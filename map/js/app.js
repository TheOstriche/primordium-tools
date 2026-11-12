// Starts the map app and wires its parts together: drawing the layers, the toolbar, saving, and exporting.
(function () {
  'use strict';
  const PM = window.PrimordiumMap, D = window.MapDraw, V = window.MapView, S = window.MapStore, E = window.MapEditor, P = window.MapPanels;
  const { h, fill, toast, menu, dialog, confirmBox, download, copy } = window.MapUI;
  const $ = id => document.getElementById(id);
  const mapSize = { w: 1600, h: 1200 }, keys = {};
  let vis, frame = 0;

  /* ---------- drawing ---------- */
  // Redraws only the layers whose data (or switches) changed since they were last drawn.
  function paint() {
    const map = S.map, ctx = { vis, flat: false };
    for (const L of D.LAYERS) {
      const k = D.key(L, map, ctx);
      if (keys[L.id] === k) continue;
      keys[L.id] = k;
      $('L-' + L.id).innerHTML = D.layer(L, map, ctx);
    }
  }
  function visChanged() {
    S.setPrefs({ vis });
    paint();
  }

  /* ---------- status ---------- */
  function status() {
    const dirty = S.dirty(), el = $('status');
    el.textContent = dirty ? 'Unsaved changes (kept in this browser)' : S.state.savedAt ? 'Saved to the file' : 'Matches the file';
    el.classList.toggle('warn', dirty);
    el.title = S.folderName ? `Save writes into the "${S.folderName}" folder.` : 'Save will ask for the map folder.';
    $('btn-undo').disabled = !S.canUndo();
    $('btn-redo').disabled = !S.canRedo();
    banner();
  }
  function banner() {
    const el = $('banner'), st = S.state;
    if (st.stale) {
      fill(el, h('p', h('b', 'The map file has changed since your unsaved edits began. '), 'Your edits are on screen. Keep working on them, or drop them and use the file as it is now.'),
        h('button', { type: 'button', onclick: () => { st.stale = false; status(); } }, 'Keep my edits'),
        h('button', { type: 'button', onclick: () => { S.discard(); toast('Now showing the file. Undo brings your edits back.'); } }, 'Use the file'));
    } else if (st.storageFailed) {
      fill(el, h('p', h('b', 'This browser is not keeping your unsaved edits. '), 'Its storage is full or blocked, so a reload would lose them. Save the map now.'));
    } else if (st.notes.length) {
      fill(el, h('p', h('b', 'The map file needed repairs when it was read: '), st.notes.slice(0, 4).join(' ')), h('button', { type: 'button', onclick: () => { st.notes = []; status(); } }, 'Dismiss'));
    }
    el.hidden = !(st.stale || st.storageFailed || st.notes.length);
  }

  /* ---------- saving ---------- */
  const explain = e => (e && e.message) || String(e);
  async function save() {
    if (!S.folderName) return saveDialog();
    if (!S.dirty()) return toast('Nothing to save: the map already matches the file.');
    await writeToFolder(false);
  }
  async function writeToFolder(force) {
    try {
      const result = await S.saveToFolder(force);
      if (result.conflict) {
        dialog('The file in the folder has changed', h('p', 'The map file in the folder is not the one this page started from. It may have been replaced by a newer map. Replacing it keeps your version; loading it shows the file instead (Undo brings your version back).'),
          [['Replace it with my map', () => { writeToFolder(true); }, 'primary'],
            ['Load the file instead', async () => { try { await S.loadFromFolder(); toast('Now showing the file from the folder.'); } catch (e) { toast('Could not read the file: ' + explain(e), 'bad'); } }]]);
        return;
      }
      const errors = PM.check(S.map).filter(p => p.level === 'error').length;
      toast(h('span', h('b', 'Saved'), 'The map and its packaged copy are in the folder. Commit them with GitHub Desktop to publish.',
        errors ? ` The Checks tab lists ${errors} problem${errors === 1 ? '' : 's'} that the project tests will also report.` : ''), 'good');
    } catch (e) { toast('Could not save: ' + explain(e), 'bad'); }
  }
  function saveDialog() {
    const body = [
      h('p', 'The map lives in two files inside your Primordium Tools folder: ', h('code', 'shared/map/' + PM.JSON_FILE), ' and its packaged copy ', h('code', PM.DATA_FILE), '.'),
      S.canUseFolder
        ? h('p', 'Choose that ', h('b', 'map'), ' folder (inside ', h('b', 'shared'), ') once and allow editing. From then on, Save writes both files there, ready to commit with GitHub Desktop.')
        : h('p', 'This browser cannot write into a folder. Open this page in Chrome or Edge to save straight into the project, or download the map file and put it in that folder by hand (then run ', h('code', 'node tools/build-map.js'), ').')
    ];
    const buttons = [];
    if (S.canUseFolder) buttons.push(['Choose the map folder', async () => {
      try { await S.connect(); } catch (e) { if (e.name !== 'AbortError') toast(explain(e), 'bad'); return false; }
      await writeToFolder(false);
    }, 'primary']);
    buttons.push(['Download the map file', () => download(PM.JSON_FILE, S.text(), 'application/json')]);
    dialog('Save the map', body, buttons);
  }

  /* ---------- opening, changes in and out ---------- */
  function openFile(file) {
    if (!file) return;
    if (file.size > 20e6) return toast('That file is too large to be a map.', 'bad');
    const reader = new FileReader();
    reader.onerror = () => toast('That file could not be read.', 'bad');
    reader.onload = () => {
      try {
        const notes = S.load(JSON.parse(reader.result));
        toast(h('span', h('b', 'Map opened'), 'It is on screen but not saved yet. Undo goes back to the map you had.', notes.length ? ' Repairs: ' + notes.slice(0, 3).join(' ') : ''), 'good');
      } catch (e) { toast(e instanceof SyntaxError ? 'That file is not valid JSON.' : explain(e), 'bad'); }
    };
    reader.readAsText(file);
  }
  function copyChanges() {
    const d = S.changes();
    if (PM.isEmptyDiff(d)) return toast('Nothing has changed since the file.');
    const text = JSON.stringify(d, null, 1), box = h('textarea', { readonly: true, spellcheck: 'false' }, text);
    dialog('Changes since the file', [h('p', PM.describe(d) + '.'), h('p.muted', 'Give this to the Claude project so it knows the current map. It lists only what changed.'), box],
      [['Copy', async () => { if (await copy(text)) toast('Copied.'); else { box.select(); toast('Press Ctrl+C to copy.'); return false; } }, 'primary']]);
  }
  function pasteChanges() {
    const box = h('textarea', { spellcheck: 'false', placeholder: '{ "primordiumMapChanges": 1, "set": { … }, "remove": { … } }', 'aria-label': 'Map changes' });
    dialog('Apply changes', [h('p', 'Paste map changes (or a whole map) from the Claude project. They are applied as one step that Undo can take back, and nothing is saved until you press Save.'), box],
      [['Apply', () => {
        try {
          const before = S.map, notes = S.applyChanges(JSON.parse(box.value)), d = PM.diff(before, S.map);
          toast(h('span', h('b', 'Changes applied'), PM.isEmptyDiff(d) ? 'Nothing was different.' : PM.describe(d) + '.', notes.length ? ' Repairs: ' + notes.slice(0, 3).join(' ') : ''), 'good');
        } catch (e) { toast(e instanceof SyntaxError ? 'That text is not valid JSON.' : explain(e), 'bad'); return false; }
      }, 'primary']]);
  }

  /* ---------- export ---------- */
  // The fonts as embeddable CSS, so an exported picture looks the same anywhere. Needs the internet once;
  // without it the export still works, in the device's own serif font.
  let fontCss = null;
  async function embeddedFonts() {
    if (fontCss !== null) return fontCss;
    try {
      const css = await (await fetch($('fonts').href)).text();
      const blocks = (css.match(/\/\*[^*]*\*\/\s*@font-face\s*\{[^}]*\}/g) || []).filter(b => /^\/\*\s*latin\s*\*\//.test(b));
      const out = await Promise.all(blocks.map(async b => {
        const url = (b.match(/url\((https:[^)]+)\)/) || [])[1];
        if (!url) return '';
        const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
        let bin = '';
        for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
        return b.replace(url, 'data:font/woff2;base64,' + btoa(bin)).replace(/\/\*[^*]*\*\//, '');
      }));
      fontCss = out.join('\n');
    } catch (e) { fontCss = ''; }
    return fontCss;
  }
  async function exportSvg() {
    const fonts = await embeddedFonts();
    download('primordium-map.svg', D.full(S.map, { vis, fontCss: fonts }), 'image/svg+xml');
    if (!fonts) toast('Exported. The lettering fonts could not be fetched, so the file uses whatever serif font the viewer has.');
  }
  async function exportPng(scale) {
    try {
      const fonts = await embeddedFonts(), W = S.map.meta.width * scale, H = S.map.meta.height * scale;
      const url = URL.createObjectURL(new Blob([D.full(S.map, { vis, fontCss: fonts, scale })], { type: 'image/svg+xml' }));
      const img = new Image();
      await new Promise((ok, bad) => { img.onload = ok; img.onerror = () => bad(new Error('the browser could not draw the map as a picture')); img.src = url; });
      const canvas = h('canvas', { width: W, height: H });
      canvas.getContext('2d').drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      const blob = await new Promise(ok => canvas.toBlob(ok, 'image/png'));
      if (!blob) throw new Error('the picture is too large for this browser; try a smaller size');
      download(`primordium-map-${W}x${H}.png`, blob);
      toast(h('span', h('b', 'Picture exported'), `${W} × ${H} pixels.` + (fonts ? '' : ' The lettering fonts could not be fetched, so it uses a plain serif font.')), 'good');
    } catch (e) { toast('Could not export: ' + explain(e), 'bad'); }
  }
  function exportDialog() {
    const W = S.map.meta.width, H = S.map.meta.height;
    const size = h('select', { 'aria-label': 'Picture size' }, [1, 2, 4, 6].map(k => h('option', { value: k, selected: k === 2 }, `${W * k} × ${H * k} pixels${k === 1 ? ' (screen)' : k >= 4 ? ' (print)' : ''}`)));
    dialog('Export a picture', [h('p', 'A PNG picture of the whole map with everything the Layers tab has switched on, at full detail. Use it for printing, or as the map image under the GM tool’s grid.'), h('label.field', h('span', 'Size'), size)],
      [['Export PNG', () => { exportPng(+size.value); }, 'primary'], ['Export SVG instead', () => { exportSvg(); }]]);
  }

  /* ---------- start ---------- */
  function boot() {
    try { S.init(); } catch (e) {
      fill($('stage'), h('p.error', 'The map data could not be read: ' + explain(e) + ' Run "node tools/build-map.js" in the project folder to rebuild it.'));
      return;
    }
    vis = Object.assign(D.defaultVis(), S.prefs().vis || {});
    const svg = $('map');
    mapSize.w = S.map.meta.width; mapSize.h = S.map.meta.height;
    svg.innerHTML = `<defs>${D.defs({ flat: false })}</defs>` + D.LAYERS.map(L => `<g id="L-${L.id}"></g>`).join('') + '<g id="overlay"></g>';
    paint();
    V.setSimplify(S.prefs().simplify !== false);
    V.init(svg, mapSize);
    E.setVis(vis);
    E.init(svg, $('overlay'));
    P.init({ left: $('left'), right: $('right'), tabs: [...document.querySelectorAll('[role=tab]')], vis, onVis: visChanged });

    S.on('change', e => {
      if (S.map.meta.width !== mapSize.w || S.map.meta.height !== mapSize.h) { mapSize.w = S.map.meta.width; mapSize.h = S.map.meta.height; }
      if (!e.live) return paint();
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(); });
    });
    S.on('state', status);
    status();

    // Toolbar
    menu($('btn-add'), () => ['settlements', 'labels', 'roads', 'rivers', 'lakes', 'ranges', 'biomes', 'borders', 'coast'].map(k => [k === 'coast' ? 'Island (coastline)' : PM.KINDS[k].one, () => E.add(k)]));
    $('btn-measure').onclick = () => E.measure();
    $('btn-undo').onclick = () => S.undo();
    $('btn-redo').onclick = () => S.redo();
    $('btn-in').onclick = () => V.zoomBy(1.4);
    $('btn-out').onclick = () => V.zoomBy(1 / 1.4);
    $('btn-fit').onclick = () => V.fit();
    $('btn-save').onclick = save;
    menu($('btn-more'), () => [
      ['Open a map file…', () => $('file').click()],
      ['Download the map file', () => download(PM.JSON_FILE, S.text(), 'application/json')],
      null,
      ['Copy changes for the Claude project…', copyChanges, S.dirty()],
      ['Apply changes from the Claude project…', pasteChanges],
      null,
      ['Export a picture…', exportDialog],
      null,
      ['Drop my edits and go back to the file', async () => { if (await confirmBox('Drop your edits?', 'The map goes back to what the file holds. Undo can bring your edits back until you close this page.', 'Drop my edits', 'danger')) S.discard(); }, S.dirty()],
      [S.folderName ? `Stop saving into "${S.folderName}"` : 'Choose the map folder…', () => (S.folderName ? S.disconnect() : saveDialog())]
    ]);
    $('file').onchange = e => { openFile(e.target.files[0]); e.target.value = ''; };

    // What the editor reports
    E.on('tool', hint => { $('hint').textContent = hint || ''; $('hint').hidden = !hint; $('btn-measure').setAttribute('aria-pressed', String(!!E.tool && E.tool.type === 'measure')); });
    E.on('cursor', m => { $('coords').textContent = `${Math.round(m[0])}, ${Math.round(m[1])}`; });
    V.onChange(() => { $('zoom').textContent = Math.round(V.zoom() * 100) + '%'; });
    $('zoom').textContent = Math.round(V.zoom() * 100) + '%';

    document.addEventListener('keydown', e => {
      const key = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
      if (mod && key === 's') { e.preventDefault(); save(); return; }
      if (e.target.closest && e.target.closest('input, textarea, select, dialog')) return;
      if (mod && key === 'z') { e.preventDefault(); if (e.shiftKey) S.redo(); else S.undo(); }
      else if (mod && key === 'y') { e.preventDefault(); S.redo(); }
      else if (mod || e.altKey) return;
      else if (key === '+' || key === '=') V.zoomBy(1.4);
      else if (key === '-') V.zoomBy(1 / 1.4);
      else if (key === '0') V.fit();
      else if (key === 'm') E.measure();
    });
    // Redraw once the lettering fonts arrive, so text is measured with the right font.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { keys.labels = keys.places = null; paint(); });
  }
  boot();
})();
