// The map being edited: where it comes from, undo and redo, and saving it.
//
// Three copies matter:
//   the file     shared/map/primordium-map.json, loaded through the generated map-data.js (window.PRIMORDIUM_MAP)
//   the map      what is on screen, with your edits
//   the draft    the map, kept in this browser (localStorage) after every edit so nothing is lost on a reload
// Save writes the map back to the file. A page cannot write to disk by itself, so the first Save asks you to
// choose the shared/map folder (Chrome and Edge); the browser then lets this page write the two files there.
// Other browsers get a download instead.
//
// Everything that comes from outside (the data file, the draft, an opened file, pasted changes) goes through
// PrimordiumMap.shaped() first.
(function () {
  'use strict';
  const PM = window.PrimordiumMap;
  const DRAFT = 'primordium.map.draft.v1', PREFS = 'primordium.map.prefs.v1', UNDO_LIMIT = 100;
  const listeners = { change: [], state: [] };
  const emit = (name, arg) => listeners[name].forEach(fn => fn(arg));

  let map = null;            // the map on screen
  let fileMap = null;        // the map as the file has it
  let fileText = '';         // PM.serialize(fileMap), to tell whether anything is unsaved
  let undoStack = [], redoStack = [], gesture = null, folder = null, draftTimer = 0;
  const state = { stale: false, notes: [], savedAt: null, storageFailed: false };

  /* ---------- loading ---------- */
  function init() {
    fileMap = PM.shaped(window.PRIMORDIUM_MAP, state.notes);
    fileText = PM.serialize(fileMap);
    map = JSON.parse(JSON.stringify(fileMap));
    let draft = null;
    try { draft = JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch (e) { /* unreadable or blocked: start from the file */ }
    if (draft && draft.map) {
      try {
        const mine = PM.shaped(draft.map);
        if (PM.serialize(mine) !== fileText) {
          map = mine;
          // The file changed underneath unsaved edits (a new map arrived): the owner chooses which to keep.
          state.stale = draft.base !== PM.hash(fileText);
        }
      } catch (e) { /* a damaged draft is dropped */ }
    }
    restoreFolder();
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') writeDraft(); });
    window.addEventListener('pagehide', writeDraft);
  }
  function writeDraft() {
    clearTimeout(draftTimer);
    try {
      if (dirty()) localStorage.setItem(DRAFT, JSON.stringify({ base: PM.hash(fileText), map }));
      else localStorage.removeItem(DRAFT);
      state.storageFailed = false;
    } catch (e) {
      if (!state.storageFailed) { state.storageFailed = true; emit('state'); }
    }
  }
  let textCache = null;
  const text = () => (textCache === null ? (textCache = PM.serialize(map)) : textCache);
  const dirty = () => text() !== fileText;
  function changed(live) {
    textCache = null;
    if (!live) { clearTimeout(draftTimer); draftTimer = setTimeout(writeDraft, 400); }
    emit('change', { live: !!live });
    if (!live) emit('state');
  }

  /* ---------- editing, with undo ---------- */
  function remember(before) {
    undoStack.push(before);
    if (undoStack.length > UNDO_LIMIT) undoStack.shift();
    redoStack = [];
  }
  // One change: fn(map) edits the map in place. Nothing is recorded if it changed nothing.
  function edit(fn) {
    const before = JSON.stringify(map);
    fn(map);
    if (JSON.stringify(map) === before) return false;
    remember(before);
    changed();
    return true;
  }
  // A drag is one undo step however many small moves it makes: begin(), then touch() per move, then end().
  function begin() { if (!gesture) gesture = JSON.stringify(map); }
  function touch() { changed(true); }
  function end() {
    if (!gesture) return;
    const before = gesture;
    gesture = null;
    if (JSON.stringify(map) !== before) remember(before);
    changed();
  }
  function replace(next) {
    const before = JSON.stringify(map);
    map = next;
    if (JSON.stringify(map) !== before) remember(before);
    changed();
  }
  function step(from, to) {
    if (!from.length || gesture) return false;
    to.push(JSON.stringify(map));
    map = JSON.parse(from.pop());
    changed();
    return true;
  }

  /* ---------- the file ---------- */
  function setFile(next) {
    fileMap = JSON.parse(JSON.stringify(next));
    fileText = PM.serialize(fileMap);
    state.stale = false;
    writeDraft();
    emit('state');
  }
  // Opening a file or pasting changes replaces the map on screen; it is one undo step and not yet saved.
  function load(data) {
    const notes = [];
    replace(PM.shaped(data, notes));
    return notes;
  }
  function applyChanges(change) {
    const notes = [];
    replace(PM.patch(map, change, notes));
    return notes;
  }
  function discard() { replace(JSON.parse(JSON.stringify(fileMap))); state.stale = false; emit('state'); }

  /* ---------- saving into the project folder (File System Access, Chrome and Edge) ---------- */
  const canUseFolder = typeof window.showDirectoryPicker === 'function';
  // The chosen folder is remembered between visits in IndexedDB (the only storage that can hold it).
  function idb(mode, run) {
    return new Promise((resolve, reject) => {
      const open = indexedDB.open('primordium-map', 1);
      open.onupgradeneeded = () => open.result.createObjectStore('kv');
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const tx = open.result.transaction('kv', mode);
        let req;
        tx.oncomplete = () => { open.result.close(); resolve(req && req.result); };
        tx.onerror = tx.onabort = () => { open.result.close(); reject(tx.error); };
        try { req = run(tx.objectStore('kv')); } catch (e) { open.result.close(); reject(e); }
      };
    });
  }
  async function restoreFolder() {
    if (!canUseFolder) return;
    try { folder = (await idb('readonly', s => s.get('folder'))) || null; } catch (e) { folder = null; }
    if (folder) emit('state');
  }
  async function connect() {
    const dir = await window.showDirectoryPicker({ id: 'primordium-map', mode: 'readwrite' });
    try { await dir.getFileHandle(PM.JSON_FILE); } catch (e) {
      throw new Error(`That folder has no ${PM.JSON_FILE} in it. Choose the "map" folder inside "shared" in your Primordium Tools folder.`);
    }
    folder = dir;
    try { await idb('readwrite', s => s.put(dir, 'folder')); } catch (e) { /* it still works for this visit */ }
    emit('state');
  }
  async function disconnect() {
    folder = null;
    try { await idb('readwrite', s => s.delete('folder')); } catch (e) { /* nothing was stored */ }
    emit('state');
  }
  async function allowed() {
    const opts = { mode: 'readwrite' };
    return (await folder.queryPermission(opts)) === 'granted' || (await folder.requestPermission(opts)) === 'granted';
  }
  async function readFolder() {
    const file = await (await folder.getFileHandle(PM.JSON_FILE)).getFile();
    return PM.shaped(JSON.parse(await file.text()));
  }
  async function write(name, content) {
    const handle = await folder.getFileHandle(name, { create: true }), out = await handle.createWritable();
    await out.write(content);
    await out.close();
  }
  // Writes both files. Returns { conflict: true } without writing when the file in the folder is not the one
  // this page started from (someone, or a new handoff, changed it), unless `force` is set.
  async function saveToFolder(force) {
    if (!folder) throw new Error('No folder has been chosen yet.');
    if (!(await allowed())) throw new Error('The browser was not given permission to write to that folder.');
    if (!force) {
      let onDisk = null;
      try { onDisk = PM.serialize(await readFolder()); } catch (e) { /* missing or damaged: writing a good file is the fix */ }
      if (onDisk !== null && onDisk !== fileText && onDisk !== text()) return { conflict: true };
    }
    const saved = JSON.parse(JSON.stringify(map));
    await write(PM.JSON_FILE, PM.serialize(saved));
    await write(PM.DATA_FILE, PM.dataFile(saved));
    state.savedAt = new Date();
    setFile(saved);
    return { saved: true };
  }
  // Takes the folder's version as both the file and the map (the edits on screen stay one undo away).
  async function loadFromFolder() {
    if (!(await allowed())) throw new Error('The browser was not given permission to read that folder.');
    const disk = await readFolder();
    replace(disk);
    setFile(disk);
  }

  /* ---------- viewer preferences ---------- */
  function prefs() { try { return JSON.parse(localStorage.getItem(PREFS) || '{}') || {}; } catch (e) { return {}; } }
  function setPrefs(patch) { try { localStorage.setItem(PREFS, JSON.stringify(Object.assign(prefs(), patch))); } catch (e) { /* not kept */ } }

  window.MapStore = {
    init, edit, begin, touch, end, load, applyChanges, discard, dirty, text, state,
    get map() { return map; },
    get fileMap() { return fileMap; },
    get folderName() { return folder ? folder.name : null; },
    changes: () => PM.diff(fileMap, map),
    undo: () => step(undoStack, redoStack), redo: () => step(redoStack, undoStack),
    canUndo: () => undoStack.length > 0, canRedo: () => redoStack.length > 0,
    canUseFolder, connect, disconnect, saveToFolder, loadFromFolder,
    prefs, setPrefs,
    on: (name, fn) => listeners[name].push(fn)
  };
})();
