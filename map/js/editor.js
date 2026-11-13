// Working on the map with the mouse and keyboard: selecting, reshaping, drawing new features, measuring.
// There are two modes. Looking (the default) only selects, pans, zooms and measures, so nothing can be moved by
// accident. Editing adds everything below that changes the map.
//
//   Click            select what is under the pointer; click the same spot again for the thing beneath it
//   Drag             empty space pans; a selected settlement or label moves; a handle reshapes
//   Small handles    sit halfway along each edge: drag one to add a point there
//   Shift+click      add a point to the selected shape; Alt+click or right-click a handle removes that point
//   Ctrl+drag        move the whole selected shape
//   Arrow keys       nudge a selected settlement or label (Shift: 10 units); Delete removes the selection
//   Space+drag, middle mouse button, wheel: pan and zoom at any time
//
// Every change goes through MapStore (edit, or begin/touch/end for a drag), so all of it can be undone.
// The selection outline and handles live in their own overlay layer and are redrawn at screen size on each zoom.
(function () {
  'use strict';
  const PM = window.PrimordiumMap, V = window.MapView, S = window.MapStore, { toast } = window.MapUI;
  const r1 = n => Math.round(n * 10) / 10;
  const listeners = { select: [], cursor: [], tool: [], hover: [], mode: [] };
  const emit = (name, arg) => listeners[name].forEach(fn => fn(arg));

  let svg, overlay, vis = {}, sel = null, tool = null, press = null, cursor = [0, 0], spaceDown = false, editing = false, hoverFrame = 0;

  const feature = () => (sel ? PM.find(S.map, sel.kind, sel.id) : null);
  const shape = kind => PM.KINDS[kind].shape;
  // What can be reshaped: `pts` is the list to change, `line` the outline it draws (a road adds its two ends).
  function editable(kind, f) {
    if (kind === 'roads') {
      const a = PM.find(S.map, 'settlements', f.from), b = PM.find(S.map, 'settlements', f.to);
      return a && b ? { pts: f.via || [], line: [[a.x, a.y], ...(f.via || []), [b.x, b.y]], closed: false, road: true } : null;
    }
    return f.pts ? { pts: f.pts, line: f.pts, closed: PM.isClosed(kind, f) } : null;
  }
  // Whether a feature is currently visible, so hidden things cannot be clicked.
  function shown(kind, f) {
    const lod = V.lod();
    if (kind === 'biomes') return vis.biomes;
    if (kind === 'ranges') return vis.ranges;
    if (kind === 'rivers' || kind === 'lakes') return vis.rivers;
    if (kind === 'borders') return vis.borders;
    if (kind === 'roads') return vis.roads && (f.major || lod > 0);
    if (kind === 'paths') return vis.roads && lod > 0;
    if (kind === 'settlements') return vis.settlements && (f.type !== 'village' || lod > 1);
    if (kind === 'labels') return vis.labels && (f.size >= 16 || lod > 0);
    return true;
  }
  const hits = m => PM.hit(S.map, m[0], m[1], 6 * V.unitsPerPx(), { pin: 10 * V.iconScale(), shown });

  /* ---------- selection ---------- */
  function select(kind, id, opts) {
    sel = kind && PM.find(S.map, kind, id) ? { kind, id } : null;
    if (sel && opts && opts.fly) {
      const b = PM.bounds(S.map, sel.kind, feature());
      // Small things are shown with some of the country around them, not filling the screen.
      if (b) { const gx = Math.max(0, 260 - (b[2] - b[0])) / 2, gy = Math.max(0, 200 - (b[3] - b[1])) / 2; V.fit([b[0] - gx, b[1] - gy, b[2] + gx, b[3] + gy], 0.6, true); }
    }
    draw();
    emit('select', sel);
  }

  /* ---------- the overlay ---------- */
  function draw() {
    if (!overlay) return;
    const u = V.unitsPerPx(), f = feature(), box = V.box(), inView = p => p[0] > box[0] - 20 * u && p[0] < box[2] + 20 * u && p[1] > box[1] - 20 * u && p[1] < box[3] + 20 * u;
    const path = (pts, closed) => 'M' + pts.map(p => p[0] + ',' + p[1]).join('L') + (closed ? 'Z' : '');
    let s = '';
    if (f) {
      const ed = editable(sel.kind, f);
      if (ed) {
        const d = path(ed.line, ed.closed);
        s += `<path class="ol-case" d="${d}"/><path class="ol" d="${d}"/>`;
        // Halfway handles, only where the edge is long enough on screen to grab one.
        const n = ed.line.length;
        if (editing) for (let i = 0, segs = ed.closed ? n : n - 1; i < segs; i++) {
          const a = ed.line[i], b = ed.line[(i + 1) % n], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 30 * u && inView(mid)) s += `<circle class="hd mid" data-m="${i}" cx="${mid[0]}" cy="${mid[1]}" r="${3.2 * u}"/>`;
        }
        if (editing) ed.pts.forEach((p, i) => { if (inView(p)) s += `<circle class="hd${i === 0 && sel.kind === 'rivers' ? ' first' : ''}" data-i="${i}" cx="${p[0]}" cy="${p[1]}" r="${4.6 * u}"/>`; });
      } else if (sel.kind === 'labels') {
        const z = PM.labelSize(f);
        s += `<rect class="ol-case" x="${f.x - z.w / 2}" y="${f.y - z.h / 2}" width="${z.w}" height="${z.h}" transform="rotate(${f.rot || 0} ${f.x} ${f.y})"/><rect class="ol" x="${f.x - z.w / 2}" y="${f.y - z.h / 2}" width="${z.w}" height="${z.h}" transform="rotate(${f.rot || 0} ${f.x} ${f.y})"/>`;
      } else if ('x' in f) {
        // A ring around the icon, which stands a little above its point.
        const cy = f.y - 4 * V.iconScale(), r = Math.max(16 * u, 17 * V.iconScale());
        s += `<circle class="ol-case" cx="${f.x}" cy="${cy}" r="${r}"/><circle class="ol" cx="${f.x}" cy="${cy}" r="${r}"/>`;
      }
    }
    if (tool && tool.pts && tool.pts.length) {
      const d = path(tool.pts.concat([cursor]), false);
      s += `<path class="ol-case" d="${d}"/><path class="ol draft" d="${d}"/>` + tool.pts.map(p => `<circle class="hd" cx="${p[0]}" cy="${p[1]}" r="${3.6 * u}"/>`).join('');
      if (tool.type === 'measure') s += `<text class="measure" x="${cursor[0] + 12 * u}" y="${cursor[1] - 10 * u}" font-size="${14 * u}" stroke-width="${3 * u}">${distanceText(PM.lineLength(tool.pts.concat([cursor])))}</text>`;
    }
    overlay.innerHTML = s;
  }
  function distanceText(units) {
    const sc = S.map.meta.scale, n = v => (v >= 100 ? Math.round(v) : Math.round(v * 10) / 10).toLocaleString();
    return sc.note ? `${n(units)} map units` : `${n(units / sc.pxPerUnit)} ${MapDraw.esc(sc.unit)}`;
  }

  /* ---------- changing points ---------- */
  function removePoint(i) {
    const f = feature(), ed = f && editable(sel.kind, f);
    if (!ed) return;
    if (!ed.road && ed.pts.length <= PM.minPoints(sel.kind, f)) return toast(`${PM.KINDS[sel.kind].one}s need at least ${PM.minPoints(sel.kind, f)} points.`);
    S.edit(() => { ed.pts.splice(i, 1); if (ed.road && !ed.pts.length) delete f.via; });
  }
  function addPoint(m) {
    const f = feature(), ed = f && editable(sel.kind, f);
    if (!ed) return;
    S.edit(() => {
      if (ed.road) { f.via = f.via || []; f.via.splice(PM.lineDistance(m[0], m[1], ed.line, false).seg, 0, m); }
      else PM.insertPoint(sel.kind, f, m);
    });
  }

  /* ---------- drawing new features ---------- */
  const HINT = {
    settlements: 'Click where the settlement goes.', labels: 'Click where the label goes.',
    roads: 'Click the settlement the road starts at, then the one it ends at.', paths: 'Click along the path. Start it on a road or a settlement.',
    rivers: 'Click along the river from its source to its mouth.', ranges: 'Click along the ridge line.', borders: 'Click along the border.',
    lakes: 'Click around the shore of the lake.', biomes: 'Click around the edge of the terrain area.', coast: 'Click around the coast of the island.'
  };
  const multi = kind => shape(kind) === 'area' || shape(kind) === 'line';
  function setTool(next) {
    tool = next;
    svg.classList.toggle('drawing', !!tool);
    if (tool) select(null);
    draw();
    emit('tool', tool && (tool.type === 'measure'
      ? 'Measuring: click along the route. Double-click or Enter starts again; Esc stops.'
      : `New ${PM.KINDS[tool.kind].one.toLowerCase()}. ${HINT[tool.kind]}${multi(tool.kind) ? ' Enter or double-click finishes; Backspace removes the last point.' : ''} Esc cancels.`));
  }
  function create(kind, f) {
    S.edit(map => { f.id = PM.freshId(map, kind); map[kind].push(f); });
    setTool(null);
    select(kind, f.id);
  }
  function toolClick(m) {
    if (tool.type === 'measure') { tool.pts.push(m); return draw(); }
    const kind = tool.kind;
    if (kind === 'settlements') return create(kind, { id: '', name: '', type: 'town', x: m[0], y: m[1] });
    if (kind === 'labels') return create(kind, { id: '', text: 'New label', x: m[0], y: m[1], rot: 0, size: 20, kind: 'feature' });
    if (kind === 'roads') {
      const near = S.map.settlements.map(s => [Math.hypot(s.x - m[0], s.y - m[1]), s]).sort((a, b) => a[0] - b[0])[0];
      if (!near || near[0] > Math.max(14 * V.unitsPerPx(), 10 * V.iconScale())) return toast('Click on a settlement.');
      if (tool.ends[0] === near[1].id) return toast('Pick a different settlement for the other end.');
      tool.ends.push(near[1].id);
      if (tool.ends.length === 2) return create(kind, { id: '', from: tool.ends[0], to: tool.ends[1], major: false });
      return emit('tool', 'New road. Now click the settlement it ends at. Esc cancels.');
    }
    tool.pts.push(m);
    draw();
  }
  function finish() {
    if (!tool || !tool.pts) return;
    // A double-click leaves two points on the same spot: keep one.
    const pts = tool.pts.filter((p, i, a) => i === 0 || Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) > 2 * V.unitsPerPx());
    if (tool.type === 'measure') { tool.pts = []; return draw(); }
    const kind = tool.kind, need = shape(kind) === 'area' ? 3 : 2;
    if (pts.length < need) return toast(`Click at least ${need} points first.`);
    const f = { id: '' };
    if (kind === 'biomes') f.type = 'forest';
    if (kind !== 'borders') f.name = '';
    if (kind === 'ranges') { f.type = 'mountain'; f.width = 30; }
    if (kind === 'rivers') f.width = [1.5, 4];
    f.pts = pts;
    create(kind, f);
  }

  /* ---------- pointer ---------- */
  // Two fingers: pinch to zoom and drag to pan together.
  const touches = new Map();
  let pinch = null;
  const pinchState = () => { const [a, b] = [...touches.values()]; return { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; };
  function onDown(e) {
    if (e.button === 2) return;
    svg.setPointerCapture(e.pointerId);
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size === 2) {
      if (press && press.moved && press.mode !== 'pan') S.end();
      press = null;
      pinch = pinchState();
      return;
    }
    const m = V.toMap(e.clientX, e.clientY);
    press = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, start: m, mode: 'click', moved: false };
    if (e.button === 1 || spaceDown) { press.mode = 'pan'; press.panOnly = true; e.preventDefault(); return; }
    if (tool || !editing) return;
    const hd = e.target.closest ? e.target.closest('.hd') : null, f = feature();
    if (hd && f) {
      if (e.altKey && hd.dataset.i != null) { removePoint(+hd.dataset.i); press = null; return; }
      press.mode = 'point';
      press.handle = hd.dataset.m != null ? { mid: +hd.dataset.m } : { i: +hd.dataset.i };
      return;
    }
    if (f && !e.shiftKey && hits(m).some(x => x.kind === sel.kind && x.id === sel.id)) {
      if (shape(sel.kind) === 'point') { press.mode = 'move'; press.off = [f.x - m[0], f.y - m[1]]; }
      else if ((e.ctrlKey || e.metaKey) && f.pts) { press.mode = 'shape'; press.last = m; }
    }
  }
  function onMove(e) {
    if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && touches.size === 2) {
      const now = pinchState();
      V.panBy(now.x - pinch.x, now.y - pinch.y);
      V.zoomAt(now.x, now.y, now.d / pinch.d);
      pinch = now;
      return;
    }
    const m = V.toMap(e.clientX, e.clientY);
    cursor = m;
    emit('cursor', m);
    if (!press) {
      if (tool && tool.pts && tool.pts.length) draw();
      // Say what is under the pointer (a few times a second is plenty).
      if (!tool && !hoverFrame) hoverFrame = setTimeout(() => { hoverFrame = 0; if (!press && !tool && !V.moving()) emit('hover', { hit: hits(cursor)[0] || null, x: e.clientX, y: e.clientY }); }, 40);
      return;
    }
    emit('hover', { hit: null });
    if (!press.moved) {
      if (Math.hypot(e.clientX - press.x, e.clientY - press.y) < 4) return;
      press.moved = true;
      if (press.mode === 'click') press.mode = 'pan';
      if (press.mode === 'pan') svg.classList.add('panning');
      else {
        S.begin();
        if (press.mode === 'point' && press.handle.mid != null) {
          // A halfway handle becomes a real point the moment it is dragged.
          const f = feature(), ed = editable(sel.kind, f), at = press.handle.mid;
          if (ed.road) { f.via = f.via || []; f.via.splice(at, 0, m); press.handle = { i: at }; }
          else { f.pts.splice(at + 1, 0, m); press.handle = { i: at + 1 }; }
        }
      }
    }
    const f = feature();
    if (press.mode === 'pan') V.panBy(e.clientX - press.lx, e.clientY - press.ly);
    else if (!f) { /* the selection went away mid-drag */ }
    else if (press.mode === 'point') { editable(sel.kind, f).pts[press.handle.i] = m; S.touch(); }
    else if (press.mode === 'move') { f.x = r1(m[0] + press.off[0]); f.y = r1(m[1] + press.off[1]); S.touch(); }
    else if (press.mode === 'shape') {
      const dx = m[0] - press.last[0], dy = m[1] - press.last[1];
      f.pts = f.pts.map(p => [r1(p[0] + dx), r1(p[1] + dy)]);
      press.last = m;
      S.touch();
    }
    press.lx = e.clientX; press.ly = e.clientY;
  }
  function onUp(e) {
    touches.delete(e.pointerId);
    if (pinch) { if (touches.size < 2) pinch = null; return; }
    if (!press) return;
    const p = press;
    press = null;
    svg.classList.remove('panning');
    if (p.moved) { if (p.mode !== 'pan') S.end(); return; }
    if (p.panOnly || p.mode === 'point') return;
    // A click
    if (tool) return toolClick(p.start);
    if (editing && e.shiftKey && feature() && editable(sel.kind, feature())) return addPoint(p.start);
    const under = hits(p.start);
    if (!under.length) return select(null);
    const i = sel ? under.findIndex(x => x.kind === sel.kind && x.id === sel.id) : -1, pick = under[(i + 1) % under.length];
    select(pick.kind, pick.id);
  }

  /* ---------- keyboard ---------- */
  function onKey(e) {
    const typing = e.target.closest && e.target.closest('input, textarea, select, [contenteditable], dialog');
    if (typing) return;
    if (e.key === ' ' && !e.target.closest('button')) { spaceDown = true; e.preventDefault(); return; }
    if (e.key === 'Escape') { if (tool) setTool(null); else select(null); return; }
    if (tool) {
      if (e.key === 'Enter') { e.preventDefault(); finish(); }
      if (e.key === 'Backspace' && tool.pts && tool.pts.length) { e.preventDefault(); tool.pts.pop(); draw(); }
      return;
    }
    const f = feature();
    if (!f || !editing) return;
    if (e.key === 'Delete') { e.preventDefault(); removeSelected(); return; }
    const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (step && shape(sel.kind) === 'point' && !e.target.closest('button, summary, a')) {
      e.preventDefault();
      const k = e.shiftKey ? 10 : 1;
      S.edit(() => { f.x = r1(f.x + step[0] * k); f.y = r1(f.y + step[1] * k); });
    }
  }
  function removeSelected() {
    if (!sel || !editing) return;
    const { kind, id } = sel;
    select(null);
    S.edit(map => PM.remove(map, kind, id));
  }

  function init(el, layer) {
    svg = el; overlay = layer;
    svg.addEventListener('pointerdown', onDown);
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup', onUp);
    svg.addEventListener('pointercancel', e => { touches.delete(e.pointerId); pinch = null; if (press && press.moved && press.mode !== 'pan') S.end(); press = null; svg.classList.remove('panning'); });
    svg.addEventListener('dblclick', e => { if (tool && tool.pts) finish(); else if (!tool && !e.target.closest('.hd')) V.zoomAt(e.clientX, e.clientY, 2, true); });
    svg.addEventListener('pointerleave', () => emit('hover', { hit: null }));
    svg.addEventListener('contextmenu', e => {
      const hd = e.target.closest ? e.target.closest('.hd') : null;
      if (hd && hd.dataset.i != null) { e.preventDefault(); removePoint(+hd.dataset.i); }
    });
    svg.addEventListener('wheel', e => { e.preventDefault(); V.zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0022)), true); }, { passive: false });
    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', e => { if (e.key === ' ') spaceDown = false; });
    window.addEventListener('blur', () => { spaceDown = false; });
    V.onChange(draw);
    // After any change (an undo included) the selection may be gone.
    S.on('change', () => { if (sel && !feature()) { sel = null; emit('select', null); } draw(); });
  }

  window.MapEditor = {
    init, select, removeSelected, distanceText,
    get selection() { return sel; },
    get tool() { return tool; },
    get editing() { return editing; },
    setEditing(on) {
      editing = !!on;
      if (!editing && tool && tool.type === 'add') setTool(null);
      svg.classList.toggle('editing', editing);
      draw();
      emit('mode', editing);
    },
    setVis(v) { vis = v; },
    add(kind) { if (editing) setTool({ type: 'add', kind, pts: multi(kind) ? [] : null, ends: [] }); },
    measure() { setTool(tool && tool.type === 'measure' ? null : { type: 'measure', pts: [] }); },
    cancel() { setTool(null); },
    on: (name, fn) => listeners[name].push(fn)
  };
})();
