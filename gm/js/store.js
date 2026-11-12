// Saving. Everything lives in the browser's IndexedDB:
//   "state"  – one record with players, encounters, custom creatures, settings
//   "images" – map images (added with the grid map)
//   "meta"   – the linked save-file handle, when the GM picks a folder file
// Backups are a single JSON file the GM can export, import, or keep linked.
(function () {
  const DB_NAME = 'primordium-gm';
  const DB_VERSION = 1;
  const BACKUP_FORMAT = 'primordium-gm-backup', BACKUP_VERSION = 1;

  const blankState = () => ({
    players: [],        // { id, name, level, hp, armor, stats:{STR,AGI,KNO,SPD,PER,SPE}, xp, notes }
    encounters: [],     // { id, name, partyIds:[], enemies:[{ npcName, count }], map:{ cols, rows, cell, lineOpacity, imageKey } }
    customNpcs: [],     // same shape as npc-data.js entries, plus { id, custom:true }
    shops: [],          // { id, name, type, level, adjust, items:[shop item] } (see ../shared/items.js)
    combat: null,       // the fight in progress (see js/combat-engine.js)
    settings: { currentEncounterId: null, lastBackupAt: null }
  });

  let db = null;
  let state = blankState();
  let fileHandle = null;
  let saveTimer = null;
  const listeners = [];

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const d = req.result;
        for (const name of ['state', 'images', 'meta']) {
          if (!d.objectStoreNames.contains(name)) d.createObjectStore(name);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function idb(storeName, mode, fn) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const req = fn(tx.objectStore(storeName));
      tx.oncomplete = () => resolve(req && req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('The browser stopped the save (storage may be full).'));
    });
  }

  // Saved or imported data in today's shape: every list is a list, and anything missing gets its blank value.
  function shaped(saved) {
    const blank = blankState(), out = Object.assign(blankState(), saved && typeof saved === 'object' ? saved : {});
    for (const key of ['players', 'encounters', 'customNpcs', 'shops']) if (!Array.isArray(out[key])) out[key] = [];
    if (out.combat && !Array.isArray(out.combat.combatants)) out.combat = null;
    out.settings = Object.assign(blank.settings, out.settings && typeof out.settings === 'object' ? out.settings : {});
    return out;
  }

  async function init() {
    db = await openDb();
    state = shaped(await idb('state', 'readonly', s => s.get('main')));
    fileHandle = (await idb('meta', 'readonly', s => s.get('fileHandle'))) || null;
    // Ask the browser not to clear this data when the disk runs low (granted quietly or not at all).
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    // Closing the tab right after a change: write it now rather than a moment later.
    const flush = () => { if (saveTimer) saveNow(); };
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
    window.addEventListener('pagehide', flush);
    watchOtherTabs();
  }

  // The tool open in two tabs: each saves the whole campaign, so the last one to save would undo the other's
  // work. Each tab announces itself; an older tab tells the GM to close one.
  let otherTab = false;
  function watchOtherTabs() {
    if (typeof BroadcastChannel !== 'function') return;
    const ch = new BroadcastChannel('primordium-gm');
    ch.onmessage = e => {
      if (e.data === 'opened') ch.postMessage('already-open');
      if (!otherTab) { otherTab = true; errorListeners.forEach(fn => fn('The GM tool is open in another tab. Use one tab only, or changes made in one will undo the changes made in the other.')); }
    };
    ch.postMessage('opened');
  }

  // Call after changing state. Saves shortly after, so rapid edits are batched.
  function changed() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 300);
    listeners.forEach(fn => fn());
  }

  // Never rejects: a failed save is reported to onError listeners (once, until a save works again).
  let saveFailing = false;
  const errorListeners = [];
  async function saveNow() {
    clearTimeout(saveTimer); saveTimer = null;
    try {
      await idb('state', 'readwrite', s => s.put(state, 'main'));
      saveFailing = false;
    } catch (e) {
      if (!saveFailing) errorListeners.forEach(fn => fn('Changes are not being saved (' + (e && e.message || 'storage problem') + '). Download a backup from the Save tab now.'));
      saveFailing = true;
    }
  }
  function onError(fn) { errorListeners.push(fn); }

  function onChange(fn) { listeners.push(fn); }

  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // ---- Backups ----

  async function buildBackup() {
    const images = {};
    await idb('images', 'readonly', s => {
      const req = s.openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) { images[c.key] = c.value; c.continue(); }
      };
      return req;
    });
    // Images are stored as Blobs; convert to text for the JSON file.
    for (const key of Object.keys(images)) images[key] = await blobToDataUrl(images[key]);
    return { format: BACKUP_FORMAT, version: BACKUP_VERSION, savedAt: new Date().toISOString(), state, images };
  }

  async function restoreBackup(backup) {
    if (!backup || backup.format !== BACKUP_FORMAT) throw new Error('This file is not a Primordium GM backup.');
    if (backup.version > BACKUP_VERSION) throw new Error('This backup was made by a newer version of the GM tool. Update the tool, then load it.');
    // Read everything first, so a damaged file leaves the current data untouched.
    const next = shaped(backup.state), images = [];
    for (const [key, url] of Object.entries(backup.images || {})) {
      if (typeof url !== 'string' || !url.startsWith('data:')) throw new Error('This backup has a map image that can not be read.');
      images.push([key, await (await fetch(url)).blob()]);
    }
    await new Promise((resolve, reject) => {   // one transaction: all the images change, or none
      const tx = db.transaction('images', 'readwrite'), store = tx.objectStore('images');
      store.clear();
      for (const [key, blob] of images) store.put(blob, key);
      tx.oncomplete = resolve;
      tx.onerror = tx.onabort = () => reject(tx.error || new Error('The map images could not be saved.'));
    });
    state = next;
    await saveNow();
    listeners.forEach(fn => fn());
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(blob);
    });
  }

  function stampBackup() {
    state.settings.lastBackupAt = new Date().toISOString();
    changed();
  }

  // Download a backup file (works in every browser).
  async function exportDownload() {
    const text = JSON.stringify(await buildBackup());
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.download = 'primordium-gm-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    stampBackup();
  }

  async function importFile(file) {
    let backup;
    try { backup = JSON.parse(await file.text()); } catch (e) { throw new Error('This file is not a Primordium GM backup.'); }
    await restoreBackup(backup);
  }

  // ---- Linked save file (Chrome and Edge only) ----

  const canLinkFile = () => typeof window.showSaveFilePicker === 'function';

  async function linkFile() {
    fileHandle = await window.showSaveFilePicker({
      suggestedName: 'primordium-campaign.json',
      types: [{ description: 'Primordium GM save', accept: { 'application/json': ['.json'] } }]
    });
    await idb('meta', 'readwrite', s => s.put(fileHandle, 'fileHandle'));
    await saveToLinkedFile();
  }

  async function unlinkFile() {
    fileHandle = null;
    await idb('meta', 'readwrite', s => s.delete('fileHandle'));
    listeners.forEach(fn => fn());
  }

  async function ensurePermission(mode) {
    if (!fileHandle) return false;
    const opts = { mode };
    if ((await fileHandle.queryPermission(opts)) === 'granted') return true;
    return (await fileHandle.requestPermission(opts)) === 'granted';
  }

  async function saveToLinkedFile() {
    if (!(await ensurePermission('readwrite'))) throw new Error('Permission to write the save file was not given.');
    const w = await fileHandle.createWritable();
    await w.write(JSON.stringify(await buildBackup()));
    await w.close();
    stampBackup();
  }

  async function loadFromLinkedFile() {
    if (!(await ensurePermission('read'))) throw new Error('Permission to read the save file was not given.');
    await importFile(await fileHandle.getFile());
  }

  window.Store = {
    init, changed, saveNow, onChange, onError, newId,
    get state() { return state; },
    exportDownload, importFile,
    canLinkFile, linkFile, unlinkFile, saveToLinkedFile, loadFromLinkedFile,
    get linkedFileName() { return fileHandle ? fileHandle.name : null; },
    images: {
      get: key => idb('images', 'readonly', s => s.get(key)),
      put: (key, blob) => idb('images', 'readwrite', s => s.put(blob, key)),
      remove: key => idb('images', 'readwrite', s => s.delete(key))
    }
  };
})();
