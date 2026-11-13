// Primordium world map: everything about the map's data that is not drawing. No screen code, so Node can test it
// (tools/test-map.js) and any app can load it. The map itself is shared/map/primordium-map.json; this file knows
// its format (see exports/handoff/map.md), checks it, and changes it safely.
//
//   PrimordiumMap.shaped(data, notes)   the one gate for map data from outside (a file, a paste, saved edits)
//   PrimordiumMap.check(map)            the map's problems: [{ level: 'error'|'warn', kind, id, text }]
//   PrimordiumMap.hit(map, x, y, tol)   the features under a point, topmost first
//   PrimordiumMap.diff / patch          what changed between two maps, and applying such a change
//   PrimordiumMap.serialize / dataFile  the exact text of primordium-map.json and of the generated map-data.js
(function (root) {
  'use strict';

  /* ---------- the format ---------- */
  // The lists in file order. shape: area (closed outline), line (open unless `closed`), point (x, y), or
  // link (joins two settlements). A path is a free line: a track or trail that may leave a road anywhere.
  const KINDS = {
    coast:       { one: 'Coastline',      many: 'Coastlines',      shape: 'area',  prefix: 'isle' },
    biomes:      { one: 'Terrain area',   many: 'Terrain areas',   shape: 'area',  prefix: 'area' },
    ranges:      { one: 'Mountain range', many: 'Mountain ranges', shape: 'line',  prefix: 'range' },
    rivers:      { one: 'River',          many: 'Rivers',          shape: 'line',  prefix: 'river' },
    lakes:       { one: 'Lake',           many: 'Lakes',           shape: 'area',  prefix: 'lake' },
    borders:     { one: 'Border',         many: 'Borders',         shape: 'line',  prefix: 'border' },
    settlements: { one: 'Settlement',     many: 'Settlements',     shape: 'point', prefix: 'place' },
    roads:       { one: 'Road',           many: 'Roads',           shape: 'link',  prefix: 'road' },
    paths:       { one: 'Path',           many: 'Paths',           shape: 'line',  prefix: 'path' },
    labels:      { one: 'Label',          many: 'Labels',          shape: 'point', prefix: 'label' }
  };
  const LISTS = Object.keys(KINDS);
  // The field holding each kind's type, and the types the renderer knows how to draw.
  const TYPE_FIELD = { biomes: 'type', ranges: 'type', settlements: 'type', labels: 'kind' };
  const TYPES = {
    biomes: ['plains-dry', 'sand', 'mesa', 'obsidian', 'scar', 'rock', 'ice', 'darkforest', 'desert', 'ash', 'forest', 'tundra', 'swamp', 'grass',
      'hills', 'scrub', 'savanna', 'farmland', 'marsh', 'jungle', 'badlands', 'snow'],
    ranges: ['mountain', 'snow', 'volcano', 'butte'],
    settlements: ['capital', 'city', 'town', 'port', 'village', 'fort', 'ruin'],
    labels: ['realm', 'feature', 'sea']
  };
  const LIMITS = { items: 5000, points: 20000, id: 60, name: 120, text: 200, notes: 5000, coord: 100000 };
  // How far (in map units) a point may sit from a shoreline or river and still count as touching it. The drawn
  // coast is roughened by a couple of units, and the map was traced by hand.
  const NEAR = 5;

  const isClosed = (kind, f) => KINDS[kind].shape === 'area' || !!f.closed;
  const minPoints = (kind, f) => (isClosed(kind, f) ? 3 : 2);

  /* ---------- small geometry ---------- */
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  // A repeatable random stream: the same seed always gives the same numbers, so generated detail never shifts.
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const r1 = n => Math.round(n * 10) / 10;
  function bbox(pts) {
    const b = [Infinity, Infinity, -Infinity, -Infinity];
    for (const [x, y] of pts) { if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; }
    return b;
  }
  function inPolygon(x, y, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function segDistance(x, y, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / ((dx * dx + dy * dy) || 1)));
    return Math.hypot(a[0] + t * dx - x, a[1] + t * dy - y);
  }
  // Distance from a point to a line of points, and which segment was nearest.
  function lineDistance(x, y, pts, closed) {
    const n = pts.length, segs = closed ? n : n - 1;
    if (n === 1) return { d: Math.hypot(pts[0][0] - x, pts[0][1] - y), seg: 0 };
    let best = Infinity, at = 0;
    for (let i = 0; i < segs; i++) { const d = segDistance(x, y, pts[i], pts[(i + 1) % n]); if (d < best) { best = d; at = i; } }
    return { d: best, seg: at };
  }
  // Points along the smooth (Catmull-Rom) curve through `pts`, about `step` map units apart.
  function sampleCurve(pts, closed, step) {
    const n = pts.length, out = [];
    if (n < 3) return pts.map(p => p.slice());
    const P = i => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const k = Math.max(2, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / (step || 6)));
      for (let j = 0; j < k; j++) {
        const u = j / k, u2 = u * u, u3 = u2 * u;
        const c = (a, b, c_, d) => 0.5 * ((2 * b) + (-a + c_) * u + (2 * a - 5 * b + 4 * c_ - d) * u2 + (-a + 3 * b - 3 * c_ + d) * u3);
        out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    if (!closed) out.push(pts[n - 1].slice());
    return out;
  }
  function lineLength(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }

  /* ---------- looking things up ---------- */
  const find = (map, kind, id) => (map[kind] || []).find(f => f.id === id);
  function onLand(map, x, y) {
    return map.coast.some(c => inPolygon(x, y, c.pts));
  }
  const shoreDistance = (map, x, y) => Math.min(...map.coast.map(c => lineDistance(x, y, c.pts, true).d));
  // The topmost terrain area at a point (later areas draw over earlier ones), or null for the base plains.
  function biomeAt(map, x, y) {
    for (let i = map.biomes.length - 1; i >= 0; i--) if (inPolygon(x, y, map.biomes[i].pts)) return map.biomes[i];
    return null;
  }
  // The line a road follows: through its `via` points, or a gentle seeded curve between its two settlements.
  function roadLine(map, road) {
    const a = find(map, 'settlements', road.from), b = find(map, 'settlements', road.to);
    if (!a || !b) return [];
    if (road.via && road.via.length) return sampleCurve([[a.x, a.y], ...road.via, [b.x, b.y]], false, 6);
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
    const off = (rng(hash(road.id))() - 0.5) * L * 0.25;
    const cx = (a.x + b.x) / 2 - dy / L * off, cy = (a.y + b.y) / 2 + dx / L * off;
    const out = [], n = Math.max(4, Math.ceil(L / 8));
    for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * a.x + 2 * u * t * cx + t * t * b.x, u * u * a.y + 2 * u * t * cy + t * t * b.y]); }
    return out;
  }
  // A label's rough size in map units (text is not measured here, so this is an estimate).
  function labelSize(l) {
    return { w: Math.max(1, String(l.text || '').length) * l.size * (l.kind === 'realm' ? 0.8 : 0.5), h: l.size * 1.15 };
  }
  // The points a feature is drawn through, for outlines, hit tests and "zoom to".
  function outline(map, kind, f) {
    const shape = KINDS[kind].shape;
    if (shape === 'point') return [[f.x, f.y]];
    if (shape === 'link') return roadLine(map, f);
    return f.pts;
  }
  function bounds(map, kind, f) {
    const pts = outline(map, kind, f);
    if (!pts.length) return null;
    const b = bbox(pts), pad = kind === 'ranges' ? f.width / 2 : kind === 'labels' ? labelSize(f).w / 2 : 0;
    return [b[0] - pad, b[1] - pad, b[2] + pad, b[3] + pad];
  }
  const title = (kind, f) => (kind === 'labels' ? f.text : f.name) || f.id;

  /* ---------- checking ---------- */
  function check(map) {
    const out = [];
    const add = (level, kind, id, text) => out.push({ level, kind, id, text });
    for (const kind of LISTS) {
      const K = KINDS[kind], seen = new Set();
      for (const f of map[kind] || []) {
        if (seen.has(f.id)) add('error', kind, f.id, `Two ${K.many.toLowerCase()} share the id "${f.id}".`);
        seen.add(f.id);
        if ((K.shape === 'area' || K.shape === 'line') && f.pts.length < minPoints(kind, f))
          add('error', kind, f.id, `${K.one} "${title(kind, f)}" needs at least ${minPoints(kind, f)} points.`);
        const field = TYPE_FIELD[kind];
        if (field && !TYPES[kind].includes(f[field])) add('warn', kind, f.id, `${K.one} "${title(kind, f)}" has a type the map cannot draw ("${f[field]}").`);
      }
    }
    const pairs = new Set();
    for (const r of map.roads) {
      for (const end of [r.from, r.to]) if (!find(map, 'settlements', end)) add('error', 'roads', r.id, `Road "${r.id}" points to a settlement that does not exist ("${end}").`);
      if (r.from === r.to) add('error', 'roads', r.id, `Road "${r.id}" starts and ends at the same settlement.`);
      const pair = [r.from, r.to].sort().join(' > ');
      if (pairs.has(pair)) add('warn', 'roads', r.id, `Road "${r.id}" repeats another road between the same two settlements.`);
      pairs.add(pair);
    }
    // A path may end anywhere (a pass, a cove, deep in a wood), but it has to leave from somewhere: one end on a
    // road, a settlement, or another path.
    if (map.paths.length) {
      const lines = map.roads.map(r => roadLine(map, r)).filter(l => l.length > 1);
      const joined = (p, [x, y]) => map.settlements.some(s => Math.hypot(s.x - x, s.y - y) <= NEAR) || lines.some(l => lineDistance(x, y, l, false).d <= NEAR) ||
        map.paths.some(o => o !== p && o.pts.length > 1 && lineDistance(x, y, sampleCurve(o.pts, false, 4), false).d <= NEAR);
      for (const p of map.paths) {
        if (p.pts.length < 2 || p.closed) continue;
        if (!joined(p, p.pts[0]) && !joined(p, p.pts[p.pts.length - 1])) add('warn', 'paths', p.id, `Path "${title('paths', p)}" joins nothing: one end should start on a road, a settlement, or another path.`);
        const wet = sampleCurve(p.pts, false, 4).find(([x, y]) => !onLand(map, x, y) && shoreDistance(map, x, y) > NEAR);
        if (wet) add('warn', 'paths', p.id, `Path "${title('paths', p)}" runs into the sea near ${Math.round(wet[0])}, ${Math.round(wet[1])}.`);
      }
    }
    for (const s of map.settlements) {
      if (!onLand(map, s.x, s.y) && shoreDistance(map, s.x, s.y) > NEAR) add('error', 'settlements', s.id, `Settlement "${title('settlements', s)}" is in the sea.`);
    }
    // Borders work one way: a border either closes on itself, or each of its ends reaches the sea or another
    // border. Then every territory is fully outlined by borders and coast, and none trails off in open country.
    for (const b of map.borders) {
      if (b.closed || b.pts.length < 2) continue;
      for (const [x, y] of [b.pts[0], b.pts[b.pts.length - 1]]) {
        const meets = !onLand(map, x, y) || shoreDistance(map, x, y) <= NEAR ||
          map.borders.some(o => o !== b && o.pts.length > 1 && lineDistance(x, y, sampleCurve(o.pts, !!o.closed, 4), !!o.closed).d <= NEAR);
        if (!meets) add('error', 'borders', b.id, `Border "${b.id}" has a loose end at ${Math.round(x)}, ${Math.round(y)}: each end should reach the sea or another border (or the border should be a closed loop).`);
      }
    }
    for (const rv of map.rivers) {
      if (rv.pts.length < 2) continue;
      const [x, y] = rv.pts[rv.pts.length - 1];
      const ends = !onLand(map, x, y) || shoreDistance(map, x, y) <= NEAR ||
        map.lakes.some(l => inPolygon(x, y, l.pts) || lineDistance(x, y, l.pts, true).d <= NEAR) ||
        map.rivers.some(o => o !== rv && o.pts.length > 1 && lineDistance(x, y, sampleCurve(o.pts, false, 4), false).d <= NEAR);
      if (!ends) add('error', 'rivers', rv.id, `River "${title('rivers', rv)}" ends on dry land: its last point should reach the sea, a lake, or another river.`);
    }
    return out;
  }

  /* ---------- the gate for outside data ---------- */
  // Forces anything (a file, pasted text, saved edits) into a clean map, so the rest of the code can trust what
  // it holds. Throws when it is not a map at all; smaller repairs are listed in `notes`.
  function shaped(data, notes) {
    notes = notes || [];
    if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(data.coast)) throw new Error('This is not a Primordium map file.');
    const str = (v, max) => (typeof v === 'string' ? v : v == null ? '' : String(v)).slice(0, max);
    const num = (v, lo, hi, fallback) => { const n = typeof v === 'number' || typeof v === 'string' ? Number(v) : NaN; return Number.isFinite(n) && v !== '' ? Math.min(hi, Math.max(lo, n)) : fallback; };
    const coord = v => { const n = num(v, -LIMITS.coord, LIMITS.coord, null); return n === null ? null : r1(n); };
    const points = v => (Array.isArray(v) ? v : []).slice(0, LIMITS.points)
      .map(p => (Array.isArray(p) ? [coord(p[0]), coord(p[1])] : [null, null])).filter(p => p[0] !== null && p[1] !== null);
    // Fields this code does not know are kept when they are plain values, so a newer map file loses nothing.
    const extras = (src, out) => {
      for (const k of Object.keys(src)) {
        const v = src[k];
        if (k in out || k === '__proto__' || k === 'constructor') continue;
        if (typeof v === 'string') out[k] = v.slice(0, LIMITS.notes);
        else if (typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))) out[k] = v;
      }
      return out;
    };

    const m = data.meta && typeof data.meta === 'object' ? data.meta : {}, sc = m.scale && typeof m.scale === 'object' ? m.scale : {};
    const scale = { pxPerUnit: num(sc.pxPerUnit, 0.0001, 100000, 1), unit: str(sc.unit, 30) || 'miles', barUnits: num(sc.barUnits, 0.001, 1e7, 100) };
    if (sc.note) scale.note = str(sc.note, LIMITS.text);
    const meta = { name: str(m.name, LIMITS.name) || 'Primordium', version: str(m.version, 40), width: num(m.width, 100, 20000, 1600), height: num(m.height, 100, 20000, 1200), scale };
    if (m.source) meta.source = str(m.source, LIMITS.notes);
    const map = { meta: extras(m, meta) };

    for (const kind of LISTS) {
      const K = KINDS[kind], seen = new Set(), list = [];
      for (const src of (Array.isArray(data[kind]) ? data[kind] : []).slice(0, LIMITS.items)) {
        if (!src || typeof src !== 'object' || Array.isArray(src)) { notes.push(`A damaged ${K.one.toLowerCase()} was left out.`); continue; }
        let id = str(src.id, LIMITS.id).trim();
        if (!id || seen.has(id)) {
          const was = id;
          id = freshId({ [kind]: list }, kind);
          notes.push(was ? `A second ${K.one.toLowerCase()} with the id "${was}" was renamed "${id}".` : `A ${K.one.toLowerCase()} with no id was named "${id}".`);
        }
        const f = { id };
        if (kind === 'biomes') f.type = str(src.type, 30) || 'grass';
        if (kind !== 'borders' && kind !== 'roads' && kind !== 'labels') f.name = str(src.name, LIMITS.name);
        if (kind === 'ranges') { f.type = str(src.type, 30) || 'mountain'; f.width = num(src.width, 4, 400, 30); }
        if (kind === 'rivers') { const w = Array.isArray(src.width) ? src.width : [src.width, src.width]; f.width = [num(w[0], 0.2, 60, 1.5), num(w[1], 0.2, 60, 4)]; }
        if (kind === 'settlements') { f.type = str(src.type, 30) || 'town'; f.x = coord(src.x); f.y = coord(src.y); }
        if (kind === 'roads') { f.from = str(src.from, LIMITS.id); f.to = str(src.to, LIMITS.id); f.major = !!src.major; const via = points(src.via); if (via.length) f.via = via; }
        if (kind === 'labels') { f.text = str(src.text, LIMITS.text); f.x = coord(src.x); f.y = coord(src.y); f.rot = num(src.rot, -360, 360, 0); f.size = num(src.size, 4, 400, 20); f.kind = str(src.kind, 30) || 'feature'; }
        if (K.shape === 'area' || K.shape === 'line') {
          if (src.closed && K.shape === 'line') f.closed = true;
          f.pts = points(src.pts);
          if (f.pts.length < minPoints(kind, f)) { notes.push(`${K.one} "${id}" had too few points and was left out.`); continue; }
        }
        if (K.shape === 'point' && (f.x === null || f.y === null)) { notes.push(`${K.one} "${id}" had no position and was left out.`); continue; }
        if (src.notes) f.notes = str(src.notes, LIMITS.notes);
        seen.add(id);
        list.push(extras(src, f));
      }
      map[kind] = list;
    }
    if (!map.coast.length) throw new Error('This map has no coastline, so it cannot be drawn.');
    return map;
  }

  /* ---------- changing ---------- */
  function freshId(map, kind) {
    const p = KINDS[kind].prefix;
    let n = 1;
    while (find(map, kind, `${p}-${n}`)) n++;
    return `${p}-${n}`;
  }
  // Renaming a settlement keeps its roads attached. Returns false when the new id is empty or taken.
  function rename(map, kind, id, next) {
    next = String(next || '').trim().slice(0, LIMITS.id);
    const f = find(map, kind, id);
    if (!f || !next || (next !== id && find(map, kind, next))) return false;
    if (kind === 'settlements') for (const r of map.roads) { if (r.from === id) r.from = next; if (r.to === id) r.to = next; }
    f.id = next;
    return true;
  }
  // Removing a settlement removes its roads too.
  function remove(map, kind, id) {
    const i = map[kind].findIndex(f => f.id === id);
    if (i < 0) return false;
    map[kind].splice(i, 1);
    if (kind === 'settlements') map.roads = map.roads.filter(r => r.from !== id && r.to !== id);
    return true;
  }
  // Adds a point to a shape on its nearest edge, or onto the nearer end of an open line. Returns its index.
  function insertPoint(kind, f, p) {
    const closed = isClosed(kind, f), n = f.pts.length, near = lineDistance(p[0], p[1], f.pts, closed);
    if (!closed) {
      const d0 = Math.hypot(p[0] - f.pts[0][0], p[1] - f.pts[0][1]), dn = Math.hypot(p[0] - f.pts[n - 1][0], p[1] - f.pts[n - 1][1]);
      if (dn <= near.d + 1e-6 && dn <= d0) { f.pts.push(p); return n; }
      if (d0 <= near.d + 1e-6) { f.pts.unshift(p); return 0; }
    }
    f.pts.splice(near.seg + 1, 0, p);
    return near.seg + 1;
  }

  /* ---------- what is under a point ---------- */
  // Topmost first: small, exact things (settlements, then lines) win over the big boxes of labels and the areas
  // beneath them, so a town inside the name of a realm can still be clicked. `tol` is the reach in map units (the
  // app passes a few screen pixels' worth); `opts.pin` is the radius of a settlement's icon; `opts.shown(kind, f)`
  // can leave out features the viewer has hidden.
  function hit(map, x, y, tol, opts) {
    opts = opts || {};
    const shown = opts.shown || (() => true), out = [];
    const each = (kind, test) => { for (let i = map[kind].length - 1; i >= 0; i--) { const f = map[kind][i]; if (shown(kind, f) && test(f)) out.push({ kind, id: f.id }); } };
    const nearLine = (pts, closed, reach) => {
      if (pts.length < 2) return false;
      const b = bbox(pts);
      return x >= b[0] - reach && x <= b[2] + reach && y >= b[1] - reach && y <= b[3] + reach && lineDistance(x, y, pts, closed).d <= reach;
    };
    each('settlements', s => Math.hypot(s.x - x, s.y - y) <= Math.max(tol, opts.pin || 0));
    each('roads', r => nearLine(roadLine(map, r), false, tol));
    each('paths', p => nearLine(sampleCurve(p.pts, !!p.closed, 6), !!p.closed, tol));
    each('borders', b => nearLine(sampleCurve(b.pts, !!b.closed, 6), !!b.closed, tol));
    each('rivers', r => nearLine(sampleCurve(r.pts, false, 6), false, tol + Math.max(r.width[0], r.width[1]) / 2));
    each('labels', l => {
      const a = -(l.rot || 0) * Math.PI / 180, dx = x - l.x, dy = y - l.y, s = labelSize(l);
      return Math.abs(dx * Math.cos(a) - dy * Math.sin(a)) <= s.w / 2 && Math.abs(dx * Math.sin(a) + dy * Math.cos(a)) <= s.h / 2;
    });
    each('lakes', l => inPolygon(x, y, l.pts) || nearLine(l.pts, true, tol));
    each('ranges', r => nearLine(sampleCurve(r.pts, !!r.closed, 6), !!r.closed, Math.max(tol, r.width / 2)));
    each('biomes', b => inPolygon(x, y, b.pts));
    each('coast', c => nearLine(c.pts, true, tol));
    return out;
  }

  /* ---------- comparing and patching ---------- */
  // What turns `before` into `after`:
  //   { meta?, set: { list: [whole items] }, remove: { list: [ids] }, order: { list: [ids] } }
  // `order` appears only when a list's surviving items were rearranged (terrain draws in list order).
  function diff(before, after) {
    const out = { primordiumMapChanges: 1 };
    if (JSON.stringify(before.meta) !== JSON.stringify(after.meta)) out.meta = after.meta;
    for (const kind of LISTS) {
      const old = new Map(before[kind].map(f => [f.id, JSON.stringify(f)])), now = new Set(after[kind].map(f => f.id));
      const set = after[kind].filter(f => old.get(f.id) !== JSON.stringify(f));
      const gone = before[kind].filter(f => !now.has(f.id)).map(f => f.id);
      const kept = before[kind].filter(f => now.has(f.id)).map(f => f.id).join('\n');
      const keptNow = after[kind].filter(f => old.has(f.id)).map(f => f.id).join('\n');
      if (set.length) (out.set = out.set || {})[kind] = set;
      if (gone.length) (out.remove = out.remove || {})[kind] = gone;
      if (kept !== keptNow) (out.order = out.order || {})[kind] = after[kind].map(f => f.id);
    }
    return out;
  }
  const isEmptyDiff = d => !d.meta && !d.set && !d.remove && !d.order;
  // A one-line summary of a diff, e.g. "2 settlements changed or added, 1 river removed".
  function describe(d) {
    const parts = [];
    for (const kind of LISTS) {
      const K = KINDS[kind], word = n => (n === 1 ? K.one : K.many).toLowerCase();
      const s = d.set && d.set[kind] ? d.set[kind].length : 0, r = d.remove && d.remove[kind] ? d.remove[kind].length : 0;
      if (s) parts.push(`${s} ${word(s)} changed or added`);
      if (r) parts.push(`${r} ${word(r)} removed`);
      if (d.order && d.order[kind]) parts.push(`${K.many.toLowerCase()} reordered`);
    }
    if (d.meta) parts.push('map details changed');
    return parts.join(', ');
  }
  // Applies a diff (or a full replacement map) to a copy of `map` and returns the clean result.
  function patch(map, change, notes) {
    if (!change || typeof change !== 'object' || Array.isArray(change)) throw new Error('These are not map changes.');
    if (Array.isArray(change.coast)) return shaped(change, notes);
    if (!change.set && !change.remove && !change.order && !change.meta) throw new Error('These are not map changes: there is nothing to set, remove, or reorder.');
    const next = JSON.parse(JSON.stringify(map));
    const lists = o => Object.keys(o && typeof o === 'object' ? o : {}).filter(k => LISTS.includes(k) && Array.isArray(o[k])).map(k => [k, o[k]]);
    for (const [kind, ids] of lists(change.remove)) for (const id of ids) remove(next, kind, String(id));
    for (const [kind, items] of lists(change.set)) for (const item of items) {
      if (!item || typeof item !== 'object') continue;
      const i = next[kind].findIndex(f => f.id === item.id);
      if (i >= 0) next[kind][i] = item; else next[kind].push(item);
    }
    for (const [kind, ids] of lists(change.order)) {
      const place = new Map(ids.map((id, i) => [String(id), i]));
      next[kind] = next[kind].map((f, i) => [f, place.has(f.id) ? place.get(f.id) : ids.length + i]).sort((a, b) => a[1] - b[1]).map(e => e[0]);
    }
    if (change.meta && typeof change.meta === 'object') next.meta = Object.assign({}, next.meta, change.meta);
    return shaped(next, notes);
  }

  /* ---------- files ---------- */
  // One feature per line, so a change shows up in GitHub Desktop as the few features that changed.
  function serialize(map) {
    const out = ['{', ' "meta": ' + JSON.stringify(map.meta) + ','];
    LISTS.forEach((kind, i) => {
      out.push(` "${kind}": [`);
      map[kind].forEach((f, j) => out.push('  ' + JSON.stringify(f) + (j < map[kind].length - 1 ? ',' : '')));
      out.push(' ]' + (i < LISTS.length - 1 ? ',' : ''));
    });
    return out.join('\n') + '\n}\n';
  }
  const DATA_FILE = 'map-data.js', JSON_FILE = 'primordium-map.json';
  // The generated file apps load (a page opened from a file cannot read JSON).
  const dataFile = map => `// Generated from ${JSON_FILE} by tools/build-map.js or the map app's Save. Edit the map, not this file.\n` +
    `window.PRIMORDIUM_MAP = ${JSON.stringify(map)};\n`;
  function counts(map) {
    const by = (kind, field) => map[kind].reduce((o, f) => { o[f[field]] = (o[f[field]] || 0) + 1; return o; }, {});
    return { lists: Object.fromEntries(LISTS.map(k => [k, map[k].length])), settlements: by('settlements', 'type'), majorRoads: map.roads.filter(r => r.major).length };
  }

  root.PrimordiumMap = {
    KINDS, LISTS, TYPES, TYPE_FIELD, LIMITS, NEAR, JSON_FILE, DATA_FILE,
    isClosed, minPoints, hash, rng, bbox, inPolygon, segDistance, lineDistance, sampleCurve, lineLength,
    find, onLand, shoreDistance, biomeAt, roadLine, outline, bounds, labelSize, title,
    check, shaped, freshId, rename, remove, insertPoint, hit, diff, isEmptyDiff, describe, patch, serialize, dataFile, counts
  };
})(typeof window !== 'undefined' ? window : globalThis);
