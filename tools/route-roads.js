// Lays every road and path of the world map over the ground again, by the road rules below. Run it after moving
// settlements, rivers, lakes or ranges, or after adding roads or paths in the app:
//   node tools/route-roads.js            lay every road and path again
//   node tools/route-roads.js --prune    also take off minor roads that only follow other roads (rule 3)
// It keeps which settlements each road joins and where each path leads; it changes only the lines they follow
// (a road's `via` points, a path's `pts`), then writes primordium-map.json and map-data.js. Running it twice
// gives the same map as running it once. tools/test-map.js checks that, through routeRoads() below.
//
// The road rules
//   1. Ground. A road never crosses the sea or a lake. It goes round a mountain range unless crossing is far
//      shorter, avoids the Scar and other rough ground, keeps a little back from the shore, and crosses a river
//      as seldom as it can and squarely (a small stream is forded far more readily).
//   2. Merging. Roads are laid major first. A later road is cheaper where a road already runs, so roads heading
//      the same way join into one and travel together, sharing the very same line (the app draws it once).
//      A road never runs alongside another: close to one, it either joins it or keeps well away, right up to
//      the edge of the settlement it is making for.
//   3. Shortcuts (only with --prune). A minor road has to earn its place: it is kept only where it gives a real
//      shortcut over ground of its own. One that does nothing but follow other roads is taken off the map,
//      unless it is the last road one of its settlements has.
//   4. Crossroads and forks. Where roads meet, part or cross, they do it at one point, and every road through
//      that point passes through the same spot.
//   5. Paths are offshoots. A path starts at the place it leads to and takes the easiest way to the nearest road
//      or path, joining it there; later paths may join earlier ones, so tracks branch like twigs. A path between
//      two settlements keeps both ends. A path whose far end already lies on a road is left out.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'shared', 'map');
global.window = globalThis;
eval(fs.readFileSync(path.join(dir, 'map-model.js'), 'utf8'));
const PM = globalThis.PrimordiumMap;

// The numbers behind the rules. Distances are map units; a "cost" multiplies how long a stretch of ground feels.
const RULES = {
  cell: 3,                    // the ground is worked out on a grid of squares this wide
  // Rule 1: how much harder each kind of ground is to cross than open plains.
  rough: { forest: 1.45, darkforest: 1.6, jungle: 1.8, hills: 1.3, desert: 1.35, sand: 1.1, scar: 3.2, obsidian: 1.7, ice: 1.9, ash: 1.5, mesa: 1.5, rock: 1.6, swamp: 2, marsh: 2, tundra: 1.4, badlands: 1.6, snow: 2 },
  range: { road: 7.5, path: 2.4, skirtRoad: 2, skirtPath: 1.4, skirt: 9 },   // on a range, and on the ground at its foot
  river: { road: 6, path: 4, width: 2.6 },                                   // crossing a river this wide at its mouth or wider
  stream: { road: 2, path: 1.5 },                                            // crossing anything narrower
  shore: { cost: 1.5, within: 4 },
  // Rule 2.
  follow: 0.7,                // the cost of ground a road already runs on (1 would mean no cheaper)
  beside: { cost: 2.2, within: 15, exceptNearEnd: 6 },   // running close beside a road without joining it
  // Rule 3.
  shortcut: { ownUnits: 12, ownShare: 0.17 },            // a minor road needs this much ground of its own
  // Rule 4: a shared stretch keeps a point this far in from each end, so every road on it bends the same way
  // right up to the fork (see shape()).
  pin: 4,
  smooth: { road: 1.5, path: 1.3, longest: 45 }          // how closely the stored points follow the route found
};

// Lays the roads and paths of `map` (changed in place). opts: { prune: bool, log: fn }.
// Returns { roads, paths, junctions, stretches, removed: [road ids], dropped: [path ids], unrouted: [road ids] }.
function routeRoads(m, opts) {
  opts = opts || {};
  const log = opts.log || (() => {});
  const r1 = n => Math.round(n * 10) / 10;

  /* ---------- the ground, as a grid of cells ---------- */
  const C = RULES.cell, GW = Math.ceil(m.meta.width / C), GH = Math.ceil(m.meta.height / C), N = GW * GH;
  const cx = i => (i % GW + 0.5) * C, cy = i => (Math.floor(i / GW) + 0.5) * C;
  const cellAt = (x, y) => Math.max(0, Math.min(GH - 1, Math.floor(y / C))) * GW + Math.max(0, Math.min(GW - 1, Math.floor(x / C)));
  // Calls fn(cell, dx, dy) for every cell within `reach` cells of cell i (cell i included).
  const around = (i, reach, fn) => {
    const x = i % GW, y = (i / GW) | 0;
    for (let dy = -reach; dy <= reach; dy++) for (let dx = -reach; dx <= reach; dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < GW && ny < GH) fn(ny * GW + nx, dx, dy); }
  };
  const curve = (pts, closed) => PM.resample(PM.sampleCurve(pts, closed, 1.5), closed, 1.5);   // along the smooth line the app draws
  // Distance (up to `reach`) from every cell to a set of lines; `minus[k]` is taken off line k's distances.
  function field(lines, reach, minus) {
    const d = new Float32Array(N).fill(1e9), R = Math.ceil(reach / C) + 1;
    lines.forEach((pts, k) => {
      const less = minus ? minus[k] : 0;
      for (const [px, py] of pts) around(cellAt(px, py), R, i => { const v = Math.hypot(cx(i) - px, cy(i) - py) - less; if (v < d[i]) d[i] = v; });
    });
    return d;
  }
  const boxes = m.coast.map(c => PM.bbox(c.pts)), lakeBoxes = m.lakes.map(l => PM.bbox(l.pts));
  const inBox = (b, x, y, pad) => x >= b[0] - pad && x <= b[2] + pad && y >= b[1] - pad && y <= b[3] + pad;
  const land = i => m.coast.some((c, k) => inBox(boxes[k], cx(i), cy(i), 0) && PM.inPolygon(cx(i), cy(i), c.pts));
  const lake = i => m.lakes.some((l, k) => inBox(lakeBoxes[k], cx(i), cy(i), 4) && (PM.inPolygon(cx(i), cy(i), l.pts) || PM.lineDistance(cx(i), cy(i), l.pts, true).d < 3));
  const big = r => r.width[1] >= RULES.river.width;
  const dRange = field(m.ranges.map(g => curve(g.pts, !!g.closed)), 30, m.ranges.map(g => g.width / 2));   // below 0: on the range
  const dRiver = field(m.rivers.filter(big).map(r => curve(r.pts, false)), 12);
  const dStream = field(m.rivers.filter(r => !big(r)).map(r => curve(r.pts, false)), 6);
  const dShore = field(m.coast.map(c => PM.resample(c.pts, true, 1.5)), 8);
  // Slow, map-anchored unevenness, so a road wanders a little the way real ones do instead of running ruler-straight.
  const speck = (x, y) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; };
  const noise = (x, y, s) => {
    const fx = x / s, fy = y / s, x0 = Math.floor(fx), y0 = Math.floor(fy), u = fx - x0, v = fy - y0, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
    return (speck(x0, y0) * (1 - a) + speck(x0 + 1, y0) * a) * (1 - b) + (speck(x0, y0 + 1) * (1 - a) + speck(x0 + 1, y0 + 1) * a) * b;
  };
  // The cost of each cell for a road or for a path (rule 1). Infinity: sea or lake.
  function ground(kind) {
    const c = new Float32Array(N), isPath = kind === 'path';
    for (let i = 0; i < N; i++) {
      if (!land(i) || lake(i)) { c[i] = Infinity; continue; }
      const x = cx(i), y = cy(i), b = PM.biomeAt(m, x, y), rough = (b && RULES.rough[b.type]) || 1;
      let v = (1 + 0.9 * noise(x, y, 26) + 0.5 * noise(x + 500, y + 300, 11)) * (isPath ? 1 + (rough - 1) / 2 : rough);
      if (dRange[i] < 2) v *= RULES.range[kind]; else if (dRange[i] < RULES.range.skirt) v *= isPath ? RULES.range.skirtPath : RULES.range.skirtRoad;
      if (dRiver[i] < 2.6) v *= RULES.river[kind]; else if (dStream[i] < 2.2) v *= RULES.stream[kind];
      if (dShore[i] < RULES.shore.within) v *= RULES.shore.cost;
      c[i] = v;
    }
    return c;
  }
  const roadCost = ground('road'), pathCost = ground('path');
  // Which stretch of land each cell is on, so nothing is routed across the sea.
  const part = new Int32Array(N).fill(-1);
  for (let s = 0, id = 0; s < N; s++) {
    if (part[s] >= 0 || !isFinite(roadCost[s])) continue;
    const stack = [s]; part[s] = id;
    while (stack.length) around(stack.pop(), 1, j => { if (part[j] < 0 && isFinite(roadCost[j])) { part[j] = id; stack.push(j); } });
    id++;
  }
  // The nearest cell a road can stand on (a port may sit right on the shoreline), or -1.
  function open(x, y) {
    let best = -1, bd = 1e9;
    around(cellAt(x, y), 4, i => { const d = Math.hypot(cx(i) - x, cy(i) - y); if (isFinite(roadCost[i]) && d < bd) { bd = d; best = i; } });
    return best;
  }

  /* ---------- finding a way ---------- */
  // The cheapest way over `cost` from cell s to cell t, or (with `stop`) to the first cell for which stop(cell) is
  // true. `factor(cell)` scales a cell's cost; `floor` is the least it can return, which keeps the search honest.
  const gScore = new Float32Array(N), came = new Int32Array(N), done = new Uint8Array(N);
  function search(s, t, cost, factor, floor, stop) {
    gScore.fill(Infinity); done.fill(0); came.fill(-1);
    const heap = [[0, s]], tx = t >= 0 ? cx(t) : 0, ty = t >= 0 ? cy(t) : 0;
    const push = e => { let i = heap.push(e) - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => {
      const top = heap[0], last = heap.pop();
      if (heap.length) { heap[0] = last; for (let i = 0; ;) { const l = 2 * i + 1, r = l + 1; let k = i; if (l < heap.length && heap[l][0] < heap[k][0]) k = l; if (r < heap.length && heap[r][0] < heap[k][0]) k = r; if (k === i) break; [heap[k], heap[i]] = [heap[i], heap[k]]; i = k; } }
      return top;
    };
    const at = i => cost[i] * (factor ? factor(i) : 1);
    gScore[s] = 0;
    let end = -1;
    while (heap.length) {
      const [, i] = pop();
      if (done[i]) continue;
      done[i] = 1;
      if (stop ? i !== s && stop(i) : i === t) { end = i; break; }
      around(i, 1, (j, dx, dy) => {
        if (j === i || done[j] || !isFinite(cost[j])) return;
        const g = gScore[i] + (dx && dy ? 1.4142 : 1) * C * (at(i) + at(j)) / 2;
        if (g < gScore[j]) { gScore[j] = g; came[j] = i; push([g + (stop ? 0 : Math.hypot(cx(j) - tx, cy(j) - ty) * floor), j]); }
      });
    }
    if (end < 0) return null;
    const cells = []; for (let i = end; i >= 0; i = came[i]) cells.push(i);
    return cells.reverse();
  }
  // Turns a route of grid points into the points to store: rounds off the grid's corners (the two ends stay put),
  // then keeps only the points that carry the shape, with none more than `longest` apart so the smooth curve
  // through them cannot swing wide.
  function shape(pts, tol, pinEnds) {
    for (let pass = 0; pass < 4; pass++) pts = pts.map((p, i) => (i === 0 || i === pts.length - 1 ? p : [(pts[i - 1][0] + 2 * p[0] + pts[i + 1][0]) / 4, (pts[i - 1][1] + 2 * p[1] + pts[i + 1][1]) / 4]));
    const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
    // Rule 4. The smooth curve through a road's points bends with its neighbours, so without a point close to each
    // end, the last long reach before a fork would swing a little differently for each road on the stretch, and
    // they would draw as two lines side by side.
    if (pinEnds && pts.length > 5) {
      const step = i => Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      let i = 1; for (let run = 0; i < pts.length - 2 && run < RULES.pin; i++) run += step(i);
      keep[i - 1] = 1;
      i = pts.length - 2; for (let run = 0; i > 1 && run < RULES.pin; i--) run += step(i + 1);
      keep[i + 1] = 1;
    }
    const split = (a, b) => {
      let worst = 0, at = -1;
      for (let i = a + 1; i < b; i++) { const d = PM.segDistance(pts[i][0], pts[i][1], pts[a], pts[b]); if (d > worst) { worst = d; at = i; } }
      if (worst > tol) { keep[at] = 1; split(a, at); split(at, b); }
    };
    split(0, pts.length - 1);
    const out = []; let last = 0;
    pts.forEach((p, i) => { if (keep[i] || Math.hypot(p[0] - pts[last][0], p[1] - pts[last][1]) > RULES.smooth.longest) { out.push([r1(p[0]), r1(p[1])]); last = i; } });
    return out;
  }

  /* ---------- roads (rules 1 to 4) ---------- */
  const place = id => PM.find(m, 'settlements', id);
  const straight = rd => Math.hypot(place(rd.from).x - place(rd.to).x, place(rd.from).y - place(rd.to).y);
  const ON = 2, BESIDE = 1;
  const taken = new Uint8Array(N);           // ON: a road runs through this cell. BESIDE: close to one.
  const laid = [];                           // { road, cells }
  const spot = new Map();                    // the cell a settlement's roads start from -> the settlement's own position
  const unrouted = [];
  const order = m.roads.filter(r => place(r.from) && place(r.to)).sort((a, b) => (b.major - a.major) || straight(a) - straight(b));
  for (const road of order) {
    const a = place(road.from), b = place(road.to), s = open(a.x, a.y), t = open(b.x, b.y);
    const nearOwnEnd = j => Math.hypot(cx(j) - a.x, cy(j) - a.y) < RULES.beside.exceptNearEnd || Math.hypot(cx(j) - b.x, cy(j) - b.y) < RULES.beside.exceptNearEnd;
    const merging = j => (taken[j] === ON ? RULES.follow : taken[j] === BESIDE && !nearOwnEnd(j) ? RULES.beside.cost : 1);
    const cells = s >= 0 && t >= 0 && part[s] === part[t] ? search(s, t, roadCost, merging, RULES.follow) : null;
    if (!cells) { log(`Road "${road.id}" (${road.from} to ${road.to}) has no way by land; it was left as it is.`); unrouted.push(road.id); continue; }
    spot.set(s, [a.x, a.y]); spot.set(t, [b.x, b.y]);
    laid.push({ road, cells });
    for (const i of cells) taken[i] = ON;
    for (const i of cells) around(i, Math.round(RULES.beside.within / C), j => { if (!taken[j]) taken[j] = BESIDE; });
  }

  // Rule 3. Checked from the least useful road up, since removing one road can leave another as the only road on
  // a stretch.
  const removed = [];
  while (opts.prune) {
    const uses = new Map(), roadsAt = new Map();
    for (const { road, cells } of laid) {
      for (const i of new Set(cells)) uses.set(i, (uses.get(i) || 0) + 1);
      for (const id of [road.from, road.to]) roadsAt.set(id, (roadsAt.get(id) || 0) + 1);
    }
    let worst = null;
    for (const entry of laid) {
      const { road, cells } = entry;
      if (road.major || roadsAt.get(road.from) < 2 || roadsAt.get(road.to) < 2) continue;
      const own = cells.filter(i => uses.get(i) === 1).length * C, share = own / (cells.length * C);
      if ((own < RULES.shortcut.ownUnits || share < RULES.shortcut.ownShare) && (!worst || share < worst.share)) worst = { entry, share, own };
    }
    if (!worst) break;
    const { road } = worst.entry;
    log(`Minor road "${road.id}" (${road.from} to ${road.to}) was taken off: all but ${Math.round(worst.own)} units of it only followed other roads.`);
    laid.splice(laid.indexOf(worst.entry), 1); m.roads.splice(m.roads.indexOf(road), 1); removed.push(road.id);
  }

  // The network: which cells each cell is joined to by some road. A cell with exactly two neighbours is the middle
  // of a stretch; any other, and every settlement, is a meeting point. Each stretch between two meeting points is
  // shaped once, and every road along it uses those same points: that is what makes shared road one line.
  const links = new Map();
  const link = (a, b) => { if (!links.has(a)) links.set(a, new Set()); links.get(a).add(b); };
  for (const { cells } of laid) for (let i = 1; i < cells.length; i++) { link(cells[i - 1], cells[i]); link(cells[i], cells[i - 1]); }
  const meeting = i => spot.has(i) || links.get(i).size !== 2;
  const pointOf = i => spot.get(i) || [cx(i), cy(i)];
  const stretches = new Map();
  function stretch(cells) {
    // The same stretch walked either way has one key, so both directions get the same points.
    const last = cells.length - 1, back = cells[0] > cells[last] || (cells[0] === cells[last] && cells[1] > cells[last - 1]);
    const canon = back ? cells.slice().reverse() : cells, key = canon.join(',');
    if (!stretches.has(key)) stretches.set(key, shape(canon.map(pointOf), RULES.smooth.road, true));
    return back ? stretches.get(key).slice().reverse() : stretches.get(key);
  }
  for (const { road, cells } of laid) {
    const pts = [];
    for (let i = 1, from = 0; i < cells.length; i++) {
      if (i < cells.length - 1 && !meeting(cells[i])) continue;
      const piece = stretch(cells.slice(from, i + 1));
      pts.push(...(pts.length ? piece.slice(1) : piece));
      from = i;
    }
    const via = pts.slice(1, -1), a = pts[0], b = pts[pts.length - 1];
    road.via = via.length ? via : [[r1((a[0] + b[0]) / 2), r1((a[1] + b[1]) / 2)]];
  }
  let junctions = 0;
  for (const [i, joins] of links) if (!spot.has(i) && joins.size > 2) junctions++;

  /* ---------- paths (rule 5) ---------- */
  const net = [];                            // points along everything laid so far, to join onto exactly
  for (const { road } of laid) net.push(...PM.resample(PM.roadLine(m, road), false, 1.5));
  const nearNet = (x, y) => { let bd = Infinity, bp = null; for (const p of net) { const d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < bd) { bd = d; bp = p; } } return { d: Math.sqrt(bd), p: bp }; };
  const onNet = new Uint8Array(N);
  for (let i = 0; i < N; i++) if (taken[i] === ON) onNet[i] = 1;
  const atPlace = ([x, y]) => m.settlements.some(s => s.type !== 'village' && Math.hypot(s.x - x, s.y - y) <= PM.NEAR);
  const kept = [], dropped = [];
  for (const p of m.paths) {
    kept.push(p);
    if (p.closed || p.pts.length < 2 || !net.length) continue;
    const first = p.pts[0], last = p.pts[p.pts.length - 1], both = atPlace(first) && atPlace(last);
    // The far end is the one farther from the network (for a path drawn outward from a road, that is its last point).
    const far = both || nearNet(last[0], last[1]).d >= nearNet(first[0], first[1]).d ? last : first;
    const s = open(far[0], far[1]);
    if (s < 0) continue;
    if (!both && nearNet(far[0], far[1]).d < 4) { log(`Path "${p.id}" was left out: the place it leads to is already on a road.`); kept.pop(); dropped.push(p.id); continue; }
    const t = both ? open(first[0], first[1]) : -1;
    const cells = both ? (t >= 0 && part[s] === part[t] ? search(s, t, pathCost, null, 1) : null) : search(s, -1, pathCost, null, 1, i => onNet[i]);
    if (!cells) continue;                              // an island with no road: the path stays as drawn
    const pts = cells.map(i => [cx(i), cy(i)]), end = pts[pts.length - 1];
    pts[0] = far.slice();
    pts[pts.length - 1] = both ? first.slice() : nearNet(end[0], end[1]).p.slice();
    p.pts = shape(pts, RULES.smooth.path).reverse();   // stored from the road outward
    for (const i of cells) onNet[i] = 1;
    net.push(...curve(p.pts, false));
  }
  m.paths = kept;
  return { roads: laid.length, paths: m.paths.length, junctions, stretches: stretches.size, removed, dropped, unrouted };
}

module.exports = { routeRoads, RULES };

if (require.main === module) {
  const m = PM.shaped(JSON.parse(fs.readFileSync(path.join(dir, PM.JSON_FILE), 'utf8')));
  const done = routeRoads(m, { prune: process.argv.includes('--prune'), log: console.log });
  fs.writeFileSync(path.join(dir, PM.JSON_FILE), PM.serialize(m));
  fs.writeFileSync(path.join(dir, PM.DATA_FILE), PM.dataFile(m));
  const problems = PM.check(m);
  problems.forEach(p => console.log((p.level === 'error' ? 'Problem: ' : 'Note: ') + p.text));
  const also = [[done.removed, 'minor roads taken off'], [done.dropped, 'paths left out'], [done.unrouted, 'roads could not be laid']].filter(e => e[0].length).map(e => `; ${e[0].length} ${e[1]}`).join('');
  console.log(`Laid ${done.roads} roads (${done.junctions} forks and crossroads outside settlements, ${done.stretches} stretches of road) and ${done.paths} paths${also}.`);
  process.exit(problems.some(p => p.level === 'error') ? 1 : 0);
}
