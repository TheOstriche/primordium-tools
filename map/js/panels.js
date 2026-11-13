// The two panels that float over the map, and the search.
//   Browse (left):   Features (every feature, grouped), Layers (what is drawn), Checks (the map's problems)
//   Details (right): the selected feature. While looking it is a read-only card; while editing it is the form
//                    that changes it. With nothing selected it can show the map's own details (name, scale).
//   search(text):    the features matching what was typed in the search box
// All of it is rebuilt from the map whenever the map changes; nothing here holds map data of its own.
(function () {
  'use strict';
  const PM = window.PrimordiumMap, S = window.MapStore, E = window.MapEditor, V = window.MapView, { h, fill, toast, debounce } = window.MapUI;
  const PLACEHOLDER_SCALE = 'Placeholder scale: set pxPerUnit once a real distance is decided.';
  let left, right, rightBox, tabButtons, tab = 'features', vis, onVis, problems = [], showMap = false;
  const openGroups = new Set(['settlements', 'labels']);

  /* ---------- left: features ---------- */
  function rowText(kind, f) {
    if (kind === 'roads') {
      const end = id => { const s = PM.find(S.map, 'settlements', id); return s ? PM.title('settlements', s) : id + ' (missing)'; };
      return `${end(f.from)} to ${end(f.to)}`;
    }
    return PM.title(kind, f);
  }
  const rowTag = (kind, f) => (kind === 'roads' ? (f.major ? 'major' : '') : PM.TYPE_FIELD[kind] ? f[PM.TYPE_FIELD[kind]] : '');
  const features = () => PM.LISTS.map(kind => {
    const sel = E.selection;
    return h('details.group', { open: openGroups.has(kind), ontoggle: e => { openGroups[e.target.open ? 'add' : 'delete'](kind); } },
      h('summary', PM.KINDS[kind].many, h('span.count', S.map[kind].length)),
      h('div.rows', S.map[kind].map(f => h('button.row', {
        type: 'button', 'aria-current': sel && sel.kind === kind && sel.id === f.id ? 'true' : null,
        onclick: () => E.select(kind, f.id, { fly: true })
      }, h('span.name', rowText(kind, f)), rowTag(kind, f) ? h('span.tag', rowTag(kind, f)) : null))));
  });
  // Up to `limit` features whose name, id, type or notes contain the text; names that start with it come first.
  function search(text, limit) {
    const q = text.trim().toLowerCase(), out = [];
    if (!q) return out;
    for (const kind of ['settlements', 'labels', 'biomes', 'ranges', 'rivers', 'lakes', 'coast', 'borders', 'roads', 'paths']) for (const f of S.map[kind]) {
      const title = rowText(kind, f), tag = rowTag(kind, f), t = title.toLowerCase();
      const rank = t.startsWith(q) ? 0 : t.includes(q) ? 1 : [f.id, tag, f.notes || ''].some(v => String(v).toLowerCase().includes(q)) ? 2 : -1;
      if (rank >= 0) out.push({ kind, id: f.id, title, tag: tag || PM.KINDS[kind].one.toLowerCase(), rank });
    }
    return out.sort((a, b) => a.rank - b.rank).slice(0, limit || 8);
  }

  /* ---------- left: layers ---------- */
  function layers() {
    const prefs = S.prefs();
    return [
      h('p.muted', 'Choose what the map shows. Hidden things cannot be clicked.'),
      window.MapDraw.TOGGLES.map(([key, label]) => h('label.check', h('input', { type: 'checkbox', checked: vis[key], onchange: e => { vis[key] = e.target.checked; onVis(); } }), label)),
      h('hr'),
      h('label.check', h('input', { type: 'checkbox', checked: prefs.simplify !== false, onchange: e => { S.setPrefs({ simplify: e.target.checked }); V.setSimplify(e.target.checked); } }),
        'Hide small towns, villages, minor roads, paths, and small labels until zoomed in')
    ];
  }

  /* ---------- left: checks ---------- */
  function checks() {
    if (!problems.length) return h('p.muted', 'No problems found. Every id is unique, roads join real settlements, settlements are on land, rivers reach water and stay out of the sea, paths start on a road, and every border meets the sea or another border.');
    return [h('p.muted', 'Click a problem to go to it.'), problems.map(p => h('button.row.problem', { type: 'button', class: p.level, onclick: () => E.select(p.kind, p.id, { fly: true }) },
      h('span.name', p.text), h('span.tag', p.level === 'error' ? 'problem' : 'note')))];
  }

  function renderLeft() {
    tabButtons.forEach(b => {
      b.setAttribute('aria-selected', String(b.dataset.tab === tab));
      if (b.dataset.tab === 'checks') b.textContent = problems.length ? `Checks (${problems.length})` : 'Checks';
    });
    fill(left, tab === 'features' ? features() : tab === 'layers' ? layers() : checks());
  }

  /* ---------- right: the inspector ---------- */
  const row = (label, control, hint) => h('label.field', h('span', label), control, hint ? h('small.muted', hint) : null);
  const input = (key, value, onchange, attrs) => h('input', Object.assign({ 'data-key': key, value: value == null ? '' : value, onchange: e => onchange(e.target.value, e.target) }, attrs || {}));
  const number = (key, value, onchange, attrs) => input(key, value, (v, el) => { const n = parseFloat(v); if (Number.isFinite(n)) onchange(n); else el.value = value; }, Object.assign({ type: 'number', step: 'any' }, attrs || {}));
  const choice = (key, value, options, onchange) => h('select', { 'data-key': key, onchange: e => onchange(e.target.value) },
    (options.includes(value) ? options : [value, ...options]).map(o => h('option', { value: o, selected: o === value }, o)));

  function inspector() {
    const sel = E.selection, f = sel && PM.find(S.map, sel.kind, sel.id);
    if (!f) return showMap ? mapDetails() : null;
    if (!E.editing) return card(sel.kind, f);
    const kind = sel.kind, K = PM.KINDS[kind], id = f.id;
    // Edits look the feature up again: after an undo the map is a new object.
    const set = fn => S.edit(map => { const cur = PM.find(map, kind, id); if (cur) fn(cur, map); });
    const prop = name => v => set(cur => { cur[name] = v; });
    const out = [h('p.eyebrow', K.one), h('h2', PM.title(kind, f))];

    if ('name' in f) out.push(row('Name', input('name', f.name, prop('name'), { maxlength: PM.LIMITS.name })));
    if (kind === 'labels') out.push(row('Text', input('text', f.text, prop('text'), { maxlength: PM.LIMITS.text })));
    const field = PM.TYPE_FIELD[kind];
    if (field) out.push(row(kind === 'labels' ? 'Kind' : 'Type', choice(field, f[field], PM.TYPES[kind], prop(field))));

    if (kind === 'settlements' || kind === 'labels') out.push(h('div.pair', row('X', number('x', f.x, prop('x'))), row('Y', number('y', f.y, prop('y')))));
    if (kind === 'labels') out.push(h('div.pair', row('Size', number('size', f.size, prop('size'), { min: 4, max: 400 })), row('Rotation (degrees)', number('rot', f.rot, prop('rot'), { min: -360, max: 360 }))));
    if (kind === 'ranges') out.push(row('Width of the band', number('width', f.width, prop('width'), { min: 4, max: 400 }), 'In map units. Wider bands grow more rows of taller peaks.'));
    if (kind === 'rivers') out.push(h('div.pair',
      row('Width at source', number('w0', f.width[0], v => set(cur => { cur.width[0] = v; }), { min: 0.2, max: 60 })),
      row('Width at mouth', number('w1', f.width[1], v => set(cur => { cur.width[1] = v; }), { min: 0.2, max: 60 }))));
    if (kind === 'roads') {
      const ids = S.map.settlements.map(s => s.id);
      out.push(row('From', choice('from', f.from, ids, prop('from'))), row('To', choice('to', f.to, ids, prop('to'))),
        h('label.check', h('input', { type: 'checkbox', 'data-key': 'major', checked: f.major, onchange: e => prop('major')(e.target.checked) }), 'Major road'));
    }
    if (kind === 'ranges' || kind === 'borders') out.push(h('label.check', h('input', { type: 'checkbox', 'data-key': 'closed', checked: !!f.closed,
      onchange: e => set(cur => { if (e.target.checked) cur.closed = true; else delete cur.closed; }) }), 'Closed loop (the last point joins the first)'));

    out.push(row('Notes (lore, GM notes)', h('textarea', { 'data-key': 'notes', rows: 4, maxlength: PM.LIMITS.notes, onchange: e => set(cur => { if (e.target.value.trim()) cur.notes = e.target.value; else delete cur.notes; }) }, f.notes || '')));

    // Facts
    const facts = [];
    const line = PM.outline(S.map, kind, f);
    if (f.pts) facts.push(`${f.pts.length} points`);
    if (K.shape === 'line' || K.shape === 'link') facts.push(`about ${E.distanceText(PM.lineLength(K.shape === 'line' ? PM.sampleCurve(f.pts, !!f.closed, 6) : line))} long`);
    if (kind === 'rivers') facts.push('the first point is the source');
    if (facts.length) out.push(h('p.muted.facts', facts.join(' · ')));
    if (kind === 'settlements') {
      const roads = S.map.roads.filter(r => r.from === id || r.to === id);
      out.push(h('p.eyebrow', `Roads (${roads.length})`), roads.length
        ? h('div.rows', roads.map(r => h('button.row', { type: 'button', onclick: () => E.select('roads', r.id) }, h('span.name', rowText('roads', r)), r.major ? h('span.tag', 'major') : null)))
        : h('p.muted', 'No roads reach this settlement.'));
    }

    // Actions
    const move = by => set((cur, map) => { const list = map[kind], i = list.indexOf(cur), j = Math.max(0, Math.min(list.length - 1, i + by)); list.splice(i, 1); list.splice(j, 0, cur); });
    out.push(h('div.btns',
      h('button', { type: 'button', onclick: () => E.select(kind, id, { fly: true }) }, 'Zoom to'),
      kind === 'rivers' ? h('button', { type: 'button', title: 'Swap the source and the mouth', onclick: () => set(cur => { cur.pts.reverse(); }) }, 'Reverse direction') : null,
      kind === 'biomes' ? [h('button', { type: 'button', title: 'Draw this area over the ones it overlaps', onclick: () => move(1) }, 'Bring forward'), h('button', { type: 'button', title: 'Draw this area under the ones it overlaps', onclick: () => move(-1) }, 'Send back')] : null,
      h('button', { type: 'button', onclick: () => duplicate(kind, id) }, 'Duplicate'),
      h('button.danger', { type: 'button', onclick: () => E.removeSelected() }, 'Delete')));
    if (kind === 'settlements') out.push(h('p.muted.small', 'Deleting a settlement also deletes its roads. Undo brings them back.'));

    out.push(h('details.more', h('summary', 'Id'), row('Id (how the data and handoffs name this feature)', input('id', f.id, (v, el) => {
      let ok = false;
      S.edit(map => { ok = PM.rename(map, kind, id, v); });
      if (ok) E.select(kind, v.trim().slice(0, PM.LIMITS.id)); else if (v.trim() !== id) { toast('That id is empty or already used.', 'bad'); el.value = id; }
    }, { maxlength: PM.LIMITS.id, spellcheck: 'false' }), kind === 'settlements' ? 'Roads follow a settlement when its id changes.' : null)));
    return out;
  }
  // What a visitor sees: the feature's name, kind, notes and a few facts. Nothing here changes the map.
  function card(kind, f) {
    const K = PM.KINDS[kind], field = PM.TYPE_FIELD[kind], facts = [];
    if (K.shape === 'line' || K.shape === 'link') facts.push(`About ${E.distanceText(PM.lineLength(K.shape === 'line' ? PM.sampleCurve(f.pts, !!f.closed, 6) : PM.outline(S.map, kind, f)))} long`);
    if (kind === 'roads') facts.push(f.major ? 'A major road' : 'A minor road');
    if (K.shape === 'point') facts.push(`At ${Math.round(f.x)}, ${Math.round(f.y)}`);
    const roads = kind === 'settlements' ? S.map.roads.filter(r => r.from === f.id || r.to === f.id) : [];
    return [
      h('p.eyebrow', K.one + (field ? ' · ' + f[field] : '')), h('h2', kind === 'roads' ? rowText(kind, f) : PM.title(kind, f)),
      f.notes ? h('p.notes', f.notes) : h('p.muted', 'No notes yet.'),
      facts.length ? h('p.muted.facts', facts.join(' · ')) : null,
      roads.length ? [h('p.eyebrow', `Roads (${roads.length})`), h('div.rows', roads.map(r => h('button.row', { type: 'button', onclick: () => E.select('roads', r.id) }, h('span.name', rowText('roads', r)), r.major ? h('span.tag', 'major') : null)))] : null,
      h('div.btns', h('button', { type: 'button', onclick: () => E.select(kind, f.id, { fly: true }) }, 'Zoom to'),
        h('button', { type: 'button', onclick: () => E.setEditing(true) }, 'Edit'))
    ];
  }
  function duplicate(kind, id) {
    let copy = null;
    S.edit(map => {
      const f = PM.find(map, kind, id);
      copy = JSON.parse(JSON.stringify(f));
      copy.id = PM.freshId(map, kind);
      if (copy.pts) copy.pts = copy.pts.map(p => [p[0] + 20, p[1] + 20]);
      if ('x' in copy) { copy.x += 20; copy.y += 20; }
      map[kind].push(copy);
    });
    if (copy) E.select(kind, copy.id);
  }

  function mapDetails() {
    const m = S.map.meta, sc = m.scale, c = PM.counts(S.map);
    const meta = fn => S.edit(map => fn(map.meta));
    return [
      h('p.eyebrow', 'The map'), h('h2', m.name),
      h('p.muted', PM.LISTS.filter(k => c.lists[k]).map(k => `${c.lists[k]} ${(c.lists[k] === 1 ? PM.KINDS[k].one : PM.KINDS[k].many).toLowerCase()}`).join(', ') + '.'),
      row('Name', input('name', m.name, v => meta(x => { x.name = v.trim() || x.name; }), { maxlength: PM.LIMITS.name })),
      row('Version', input('version', m.version, v => meta(x => { x.version = v.trim(); }), { maxlength: 40 }), 'Raise it when a new version of the map is agreed.'),
      h('p.eyebrow', 'Scale'),
      h('p.muted', sc.note ? 'No real distance has been decided yet, so the measuring tool shows map units.' : `One ${sc.unit.replace(/s$/, '')} is ${sc.pxPerUnit} map units. The measuring tool shows ${sc.unit}.`),
      h('div.pair', row('Map units per unit of distance', number('pxPerUnit', sc.pxPerUnit, v => meta(x => { x.scale.pxPerUnit = v; }), { min: 0.0001 })),
        row('Unit of distance', input('unit', sc.unit, v => meta(x => { x.scale.unit = v.trim() || x.scale.unit; }), { maxlength: 30 }))),
      row('Length of the scale bar', number('barUnits', sc.barUnits, v => meta(x => { x.scale.barUnits = v; }), { min: 0.001 }), `In ${sc.unit}.`),
      h('label.check', h('input', { type: 'checkbox', 'data-key': 'decided', checked: !sc.note, onchange: e => meta(x => { if (e.target.checked) delete x.scale.note; else x.scale.note = PLACEHOLDER_SCALE; }) }), 'The scale is decided')
    ];
  }

  const help = () => h('ul.tips',
    h('li', h('b', 'Scroll'), ' or double-click to zoom. Drag to move the map. More appears as you zoom in.'),
    h('li', h('b', 'Click'), ' anything to see what it is. Click the same spot again for the thing beneath it.'),
    h('li', h('b', 'Search'), ' (or press /) finds a place by name, id, type, or notes.'),
    h('li', h('b', 'Measure'), ' (M): click along a route to see its length.'),
    h('li', 'Switch on ', h('b', 'Edit'), ' to change the map:'),
    h('li', h('b', 'Drag'), ' the round handles to reshape. The small handles halfway along an edge add a point there.'),
    h('li', h('b', 'Alt+click'), ' or right-click a handle to remove that point. ', h('b', 'Shift+click'), ' the map to add one.'),
    h('li', h('b', 'Ctrl+drag'), ' a selected shape to move all of it. Drag a selected settlement or label to move it; the arrow keys nudge it.'),
    h('li', h('b', 'Add'), ' draws something new: click its points, then Enter (or double-click) to finish; Esc cancels.'),
    h('li', h('b', 'Ctrl+Z'), ' undoes, ', h('b', 'Ctrl+Y'), ' redoes, ', h('b', 'Ctrl+S'), ' saves, ', h('b', 'Delete'), ' removes the selection.'));

  function renderRight() {
    // Keep the keyboard where it was: Tab has already moved to the next field by the time this runs.
    const key = right.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    const body = inspector();
    rightBox.hidden = !body;
    fill(right, body);
    const again = key && right.querySelector(`[data-key="${key}"]`);
    if (again) again.focus();
  }

  const recheck = debounce(() => { problems = PM.check(S.map); renderLeft(); listeners.forEach(fn => fn(problems)); }, 250);
  const listeners = [];

  function init(opts) {
    left = opts.left; right = opts.right; rightBox = opts.rightBox; tabButtons = opts.tabs; vis = opts.vis; onVis = opts.onVis;
    tabButtons.forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; renderLeft(); }));
    problems = PM.check(S.map);
    renderLeft();
    renderRight();
    S.on('change', e => { if (e.live) return; setTimeout(renderRight); if (tab === 'features') renderLeft(); recheck(); });
    E.on('mode', renderRight);
    E.on('select', () => {
      renderRight();
      if (tab !== 'features') return;
      const sel = E.selection;
      if (sel) { openGroups.add(sel.kind); showMap = false; }
      renderLeft();
      const cur = left.querySelector('[aria-current="true"]');
      if (cur) cur.scrollIntoView({ block: 'nearest' });
    });
  }

  window.MapPanels = { init, search, help, show(name) { tab = name; renderLeft(); },
    mapDetails(on) { showMap = on; if (on) E.select(null); renderRight(); }, problems: () => problems, onProblems: fn => listeners.push(fn) };
})();
