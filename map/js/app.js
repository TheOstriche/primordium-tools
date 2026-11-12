// Starts the map app and wires its parts together: drawing the layers, the floating controls (search, tools,
// zoom, scale), looking versus editing, links to a view, saving, and exporting.
(function () {
  'use strict';
  const PM = window.PrimordiumMap, D = window.MapDraw, T = window.MapTerrain, V = window.MapView, S = window.MapStore, E = window.MapEditor, P = window.MapPanels;
  const { h, fill, toast, menu, dialog, confirmBox, download, copy, debounce } = window.MapUI;
  const $ = id => document.getElementById(id);
  const mapSize = { w: 1600, h: 1200 }, keys = {};
  let vis, frame = 0, terrainKey = '', roughBusy = false;

  /* ---------- drawing ---------- */
  // Redraws only the layers whose data (or switches) changed since they were last drawn.
  function paint() {
    const map = S.map, ctx = { vis, flat: false };
    for (const L of D.LAYERS) {
      const k = D.key(L, map, ctx);
      if (keys[L.id] === k) continue;
      keys[L.id] = k;
      $('L-' + L.id).innerHTML = D.layer(L, map, ctx);
      if (L.id === 'land') T.attach();          // its two pictures are new elements: fill them again
    }
  }
  // The painted land depends on the terrain areas, the ranges (rocky ground), and the coast (strands).
  const terrainOpts = () => ({ areas: vis.biomes, ranges: vis.ranges });
  function terrain(live) {
    const map = S.map, k = JSON.stringify([map.biomes, map.ranges, map.coast, map.meta.width, map.meta.height, vis.biomes, vis.ranges]);
    if (k === terrainKey && !live) return;
    if (!live) { terrainKey = k; T.refresh(false); return; }
    if (k === terrainKey || roughBusy) return;   // while dragging: a rough picture, one at a time
    terrainKey = k; roughBusy = true;
    T.refresh(true).then(() => { roughBusy = false; });
  }
  function visChanged() {
    S.setPrefs({ vis });
    paint();
    terrain(false);
  }

  /* ---------- status ---------- */
  function status() {
    const dirty = S.dirty(), el = $('status');
    el.textContent = dirty ? 'Unsaved changes' : S.state.savedAt ? 'Saved' : 'Matches the file';
    el.classList.toggle('warn', dirty);
    el.title = (dirty ? 'Your changes are kept in this browser until you save. ' : '') + (S.folderName ? `Save writes into the "${S.folderName}" folder.` : 'Save will ask for the map folder.');
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

  /* ---------- looking and editing ---------- */
  function setEditing(on) {
    E.setEditing(on);
    document.body.classList.toggle('editing', on);
    $('btn-edit').setAttribute('aria-pressed', String(on));
    $('btn-edit').textContent = on ? 'Editing' : 'Edit';
    S.setPrefs({ editing: on });
  }

  /* ---------- the view: zoom label, scale bar, link ---------- */
  function scaleBar() {
    const sc = S.map.meta.scale, perUnit = sc.note ? 1 : sc.pxPerUnit, want = 120 / V.scale() / perUnit;   // about 120 pixels of map
    const pow = Math.pow(10, Math.floor(Math.log10(want))), nice = [5, 2, 1].map(k => k * pow).find(v => v <= want) || pow;
    $('scalebar').firstElementChild.style.width = Math.round(nice * perUnit * V.scale()) + 'px';
    $('scalebar').lastElementChild.textContent = `${nice.toLocaleString()} ${sc.note ? 'map units' : sc.unit}`;
  }
  // The address always describes the view, so it can be copied and shared: #x=…&y=…&z=…
  const link = () => { const c = V.center(); return `#x=${Math.round(c[0])}&y=${Math.round(c[1])}&z=${V.zoom().toFixed(2)}`; };
  const settled = debounce(() => {
    T.sharpen();
    try { history.replaceState(null, '', link()); } catch (e) { /* a page opened from a file may refuse: the link is only a convenience */ }
  }, 220);
  function viewChanged() {
    $('zoom').textContent = Math.round(V.zoom() * 100) + '%';
    scaleBar();
    settled();
  }
  function viewFromLink() {
    const q = new URLSearchParams(location.hash.slice(1)), x = parseFloat(q.get('x')), y = parseFloat(q.get('y')), z = parseFloat(q.get('z'));
    if ([x, y, z].every(Number.isFinite)) V.setView(Math.max(0, Math.min(mapSize.w, x)), Math.max(0, Math.min(mapSize.h, y)), z);
  }

  /* ---------- search ---------- */
  function search() {
    const input = $('search'), box = $('results');
    let found = [], active = 0;
    const show = () => {
      const q = input.value.trim();
      found = P.search(q, 8);
      active = 0;
      box.hidden = !q;
      fill(box, found.length ? found.map((r, i) => h('button.row', { type: 'button', role: 'option', class: i === 0 ? 'active' : '', onclick: () => go(r) }, h('span.name', r.title), h('span.tag', r.tag)))
        : h('p.muted', 'Nothing on the map matches.'));
    };
    const go = r => { box.hidden = true; input.blur(); E.select(r.kind, r.id, { fly: true }); };
    input.addEventListener('input', show);
    input.addEventListener('focus', () => { if (input.value.trim()) show(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { input.value = ''; box.hidden = true; input.blur(); }
      if (e.key === 'Enter' && found[active]) go(found[active]);
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && found.length) {
        e.preventDefault();
        active = (active + (e.key === 'ArrowDown' ? 1 : found.length - 1)) % found.length;
        [...box.children].forEach((el, i) => el.classList.toggle('active', i === active));
      }
    });
    document.addEventListener('pointerdown', e => { if (!e.target.closest('.searchbox')) box.hidden = true; });
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
  // The whole map as one SVG, with the land painted at `sharpness` pixels per map unit.
  const wholeSvg = async (fonts, scale, sharpness) => D.full(S.map, { vis, fontCss: fonts, scale, terrain: await T.dataUrl(S.map, sharpness, terrainOpts()) });
  async function exportSvg() {
    const fonts = await embeddedFonts();
    download('primordium-map.svg', await wholeSvg(fonts, 1, 2), 'image/svg+xml');
    if (!fonts) toast('Exported. The lettering fonts could not be fetched, so the file uses whatever serif font the viewer has.');
  }
  async function exportPng(scale) {
    try {
      const fonts = await embeddedFonts(), W = S.map.meta.width * scale, H = S.map.meta.height * scale;
      const url = URL.createObjectURL(new Blob([await wholeSvg(fonts, scale, Math.max(1.5, scale))], { type: 'image/svg+xml' }));
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
    const size = h('select', { 'aria-label': 'Picture size' }, [1, 2, 3, 4].map(k => h('option', { value: k, selected: k === 2 }, `${W * k} × ${H * k} pixels${k === 1 ? ' (screen)' : k >= 3 ? ' (print)' : ''}`)));
    dialog('Export a picture', [h('p', 'A PNG picture of the whole map with everything the Layers tab has switched on, at full detail. Use it for printing, or as the map image under the GM tool’s grid.'), h('label.field', h('span', 'Size'), size)],
      [['Export PNG', () => { exportPng(+size.value); }, 'primary'], ['Export SVG instead', () => { exportSvg(); }]]);
  }

  /* ---------- start ---------- */
  function boot() {
    try { S.init(); } catch (e) {
      fill($('stage'), h('p.error', 'The map data could not be read: ' + explain(e) + ' Run "node tools/build-map.js" in the project folder to rebuild it.'));
      return;
    }
    const prefs = S.prefs(), svg = $('map');
    vis = Object.assign(D.defaultVis(), prefs.vis || {});
    mapSize.w = S.map.meta.width; mapSize.h = S.map.meta.height;
    svg.innerHTML = `<defs>${D.defs({ flat: false })}</defs>` + D.LAYERS.map(L => `<g id="L-${L.id}"></g>`).join('') + '<g id="overlay"></g>';
    T.init(svg, () => S.map, terrainOpts);
    paint();
    V.setSimplify(prefs.simplify !== false);
    V.init(svg, mapSize);
    viewFromLink();
    terrain(false);
    E.setVis(vis);
    E.init(svg, $('overlay'));
    P.init({ left: $('left'), right: $('right'), rightBox: $('details'), tabs: [...document.querySelectorAll('[role=tab]')], vis, onVis: visChanged });
    setEditing(!!prefs.editing || S.dirty());      // unsaved edits mean the owner was in the middle of editing

    S.on('change', e => {
      mapSize.w = S.map.meta.width; mapSize.h = S.map.meta.height;
      terrain(e.live);
      if (!e.live) { paint(); scaleBar(); return; }
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(); });
    });
    S.on('state', status);
    status();
    V.onChange(viewChanged);
    viewChanged();
    window.addEventListener('hashchange', viewFromLink);
    search();

    // Tools
    $('btn-edit').onclick = () => setEditing(!E.editing);
    menu($('btn-add'), () => ['settlements', 'labels', 'roads', 'rivers', 'lakes', 'ranges', 'biomes', 'borders', 'coast'].map(k => [k === 'coast' ? 'Island (coastline)' : PM.KINDS[k].one, () => E.add(k)]));
    $('btn-measure').onclick = () => E.measure();
    $('btn-undo').onclick = () => S.undo();
    $('btn-redo').onclick = () => S.redo();
    $('btn-in').onclick = () => V.zoomBy(1.6);
    $('btn-out').onclick = () => V.zoomBy(1 / 1.6);
    $('btn-fit').onclick = () => V.fit(null, null, true);
    $('btn-save').onclick = save;
    const browse = on => { $('browse').hidden = !on; $('btn-browse').setAttribute('aria-expanded', String(on)); S.setPrefs({ browse: on }); };
    $('btn-browse').onclick = () => browse($('browse').hidden);
    $('btn-close-browse').onclick = () => browse(false);
    $('btn-close-details').onclick = () => { P.mapDetails(false); E.select(null); };
    if (prefs.browse) browse(true);
    menu($('btn-more'), () => [
      ['Copy a link to this view', async () => { const url = location.href.split('#')[0] + link(); toast((await copy(url)) ? 'Link copied. It opens the map at this spot and zoom.' : url); }],
      ['How to use the map', () => dialog('How to use the map', P.help(), [])],
      ['Export a picture…', exportDialog],
      null,
      ['Map details and scale…', () => { setEditing(true); P.mapDetails(true); }],
      ['Open a map file…', () => { setEditing(true); $('file').click(); }],
      ['Download the map file', () => download(PM.JSON_FILE, S.text(), 'application/json')],
      null,
      ['Copy changes for the Claude project…', copyChanges, S.dirty()],
      ['Apply changes from the Claude project…', () => { setEditing(true); pasteChanges(); }],
      null,
      ['Drop my edits and go back to the file', async () => { if (await confirmBox('Drop your edits?', 'The map goes back to what the file holds. Undo can bring your edits back until you close this page.', 'Drop my edits', 'danger')) S.discard(); }, S.dirty()],
      [S.folderName ? `Stop saving into "${S.folderName}"` : 'Choose the map folder…', () => (S.folderName ? S.disconnect() : saveDialog())]
    ]);
    $('file').onchange = e => { openFile(e.target.files[0]); e.target.value = ''; };

    // What the editor reports
    E.on('tool', hint => { $('hint').textContent = hint || ''; $('hint').hidden = !hint; $('btn-measure').setAttribute('aria-pressed', String(!!E.tool && E.tool.type === 'measure')); });
    E.on('cursor', m => { $('coords').textContent = `${Math.round(m[0])}, ${Math.round(m[1])}`; });
    E.on('hover', ({ hit, x, y }) => {
      const tip = $('tip'), f = hit && PM.find(S.map, hit.kind, hit.id);
      svg.classList.toggle('pointing', !!f);
      tip.hidden = !f;
      if (!f) return;
      const field = PM.TYPE_FIELD[hit.kind];
      fill(tip, hit.kind === 'roads' ? 'Road' : PM.title(hit.kind, f), h('small', hit.kind === 'roads' ? (f.major ? 'major' : 'minor') : field ? f[field] : PM.KINDS[hit.kind].one));
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    });

    document.addEventListener('keydown', e => {
      const key = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
      if (mod && key === 's') { e.preventDefault(); if (E.editing) save(); return; }
      if (e.target.closest && e.target.closest('input, textarea, select, dialog')) return;
      if (mod && key === 'z') { e.preventDefault(); if (!E.editing) return; if (e.shiftKey) S.redo(); else S.undo(); }
      else if (mod && key === 'y') { e.preventDefault(); if (E.editing) S.redo(); }
      else if (mod || e.altKey) return;
      else if (key === '/') { e.preventDefault(); $('search').focus(); }
      else if (key === '+' || key === '=') V.zoomBy(1.6);
      else if (key === '-') V.zoomBy(1 / 1.6);
      else if (key === '0') V.fit(null, null, true);
      else if (key === 'm') E.measure();
    });
    // Redraw once the lettering fonts arrive, so text is measured with the right font.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { keys.labels = keys.places = null; paint(); });
  }
  boot();
})();
