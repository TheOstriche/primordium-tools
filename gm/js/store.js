// Saving. Everything lives in the browser's IndexedDB:
//   "state"  – one record with players, encounters, custom creatures, settings
//   "images" – map images (added with the grid map)
//   "meta"   – the linked save-file handle, when the GM picks a folder file
// Backups are a single JSON file the GM can export, import, or keep linked.
(function () {
  const DB_NAME = 'primordium-gm';
  const DB_VERSION = 1;
  const BACKUP_FORMAT = 'primordium-gm-backup';

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
    });
  }

  async function init() {
    db = await openDb();
    const saved = await idb('state', 'readonly', s => s.get('main'));
    state = Object.assign(blankState(), saved || {});
    state.settings = Object.assign(blankState().settings, state.settings);
    fileHandle = (await idb('meta', 'readonly', s => s.get('fileHandle'))) || null;
  }

  // Call after changing state. Saves shortly after, so rapid edits are batched.
  function changed() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 300);
    listeners.forEach(fn => fn());
  }

  async function saveNow() {
    clearTimeout(saveTimer);
    await idb('state', 'readwrite', s => s.put(state, 'main'));
  }

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
    return { format: BACKUP_FORMAT, version: 1, savedAt: new Date().toISOString(), state, images };
  }

  async function restoreBackup(backup) {
    if (!backup || backup.format !== BACKUP_FORMAT) throw new Error('This file is not a Primordium GM backup.');
    state = Object.assign(blankState(), backup.state || {});
    state.settings = Object.assign(blankState().settings, state.settings);
    await idb('images', 'readwrite', s => s.clear());
    for (const [key, url] of Object.entries(backup.images || {})) {
      const blob = await (await fetch(url)).blob();
      await idb('images', 'readwrite', s => s.put(blob, key));
    }
    await saveNow();
    listeners.forEach(fn => fn());
  }

  function blobToDataUrl(blob) {
    return new Promise(resolve => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
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
    await restoreBackup(JSON.parse(await file.text()));
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
    init, changed, saveNow, onChange, newId,
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
