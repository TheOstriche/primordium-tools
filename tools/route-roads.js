// Lays every road and path of the world map over the ground again, by the road rules below. Run it after moving
// settlements, rivers, lakes or ranges, or after adding roads or paths in the app:
//   node tools/route-roads.js
// It keeps which settlements each road joins and where each path leads; it only changes the lines they follow
// (a road's `via` points, a path's `pts`). It then writes primordium-map.json and map-data.js.
//
// The road rules
//   1. Ground. A road never crosses the sea or a lake. It goes round a mountain range unless crossing is far
//      shorter, avoids the Scar and other rough ground, keeps a little back from the shore, and crosses a river
//      as seldom as it can and squarely.
//   2. Merging. Roads are laid major first. A later road is cheaper where a road already runs, so roads heading
//      the same way join into one and travel together. Where they share ground they share the very same line
//      (the app draws it once). A road never runs alongside another just a little apart: it joins or keeps away.
//   3. Crossroads and forks. Where roads meet, part or cross, they do it at one point, and every road through
//      that point passes through the same spot.
//   4. Paths are offshoots. A path starts at the place it leads to and takes the easiest way to the nearest road
//      or path, joining it there; later paths may join earlier ones, so tracks branch like twigs. A path between
//      two settlements keeps both ends. A path whose far end already lies on a road is left out.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'shared', 'map');
global.window = globalThis;
eval(fs.readFileSync(path.join(dir, 'map-model.js'), 'utf8'));
const PM = globalThis.PrimordiumMap;
const m = PM.shaped(JSON.parse(fs.readFileSync(path.join(dir, PM.JSON_FILE), 'utf8')));
const r1 = n => Math.round(n * 10) / 10;

/* ---------- the ground, as a grid of 3-unit cells ---------- */
const C = 3, GW = Math.ceil(m.meta.width / C), GH = Math.ceil(m.meta.height / C), N = GW * GH;
const cx = i => (i % GW + 0.5) * C, cy = i => (Math.floor(i / GW) + 0.5) * C;
const cellAt = (x, y) => Math.max(0, Math.min(GH - 1, Math.floor(y / C))) * GW + Math.max(0, Math.min(GW - 1, Math.floor(x / C)));
const land = new Uint8Array(N), lake = new Uint8Array(N);
const boxes = m.coast.map(c => PM.bbox(c.pts)), lakeBoxes = m.lakes.map(l => PM.bbox(l.pts));
for (let i = 0; i < N; i++) {
  const x = cx(i), y = cy(i);
  land[i] = m.coast.some((c, k) => x >= boxes[k][0] && x <= boxes[k][2] && y >= boxes[k][1] && y <= boxes[k][3] && PM.inPolygon(x, y, c.pts)) ? 1 : 0;
  lake[i] = m.lakes.some((l, k) => x >= lakeBoxes[k][0] - 4 && x <= lakeBoxes[k][2] + 4 && y >= lakeBoxes[k][1] - 4 && y <= lakeBoxes[k][3] + 4 && (PM.inPolygon(x, y, l.pts) || PM.lineDistance(x, y, l.pts, true).d < 3)) ? 1 : 0;
}
// Points about 1.5 units apart along a line (`curve`: through the smooth curve the app draws).
function dense(pts, closed, curve) {
  const s = curve ? PM.sampleCurve(pts, closed, 1.5) : pts, out = [];
  for (let i = 0; i < s.length - (closed ? 0 : 1); i++) { const a = s[i], b = s[(i + 1) % s.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 1.5)); for (let j = 0; j < n; j++) out.push([a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]); }
  out.push(s[s.length - 1]);
  return out;
}
// Distance (up to `reach`) from every cell to a set of lines.
function field(lines, reach, minus) {
  const d = new Float32Array(N).fill(1e9), R = Math.ceil(reach / C) + 1;
  lines.forEach((pts, k) => {
    const less = minus ? minus[k] : 0;
    for (const [px, py] of pts) {
      const gx = Math.floor(px / C), gy = Math.floor(py / C);
      for (let y = Math.max(0, gy - R); y <= Math.min(GH - 1, gy + R); y++) for (let x = Math.max(0, gx - R); x <= Math.min(GW - 1, gx + R); x++) { const i = y * GW + x, v = Math.hypot(cx(i) - px, cy(i) - py) - less; if (v < d[i]) d[i] = v; }
    }
  });
  return d;
}
const dRange = field(m.ranges.map(g => dense(g.pts, !!g.closed, true)), 30, m.ranges.map(g => g.width / 2));
const dRiver = field(m.rivers.map(r => dense(r.pts, false, true)), 12);
const dShore = field(m.coast.map(c => dense(c.pts, true, false)), 8);
// How much harder each kind of ground is to build a road over than open plains.
const ROUGH = { forest: 1.45, darkforest: 1.6, jungle: 1.8, hills: 1.3, desert: 1.35, sand: 1.1, scar: 3.2, obsidian: 1.7, ice: 1.9, ash: 1.5, mesa: 1.5, rock: 1.6, swamp: 2, marsh: 2, tundra: 1.4, badlands: 1.6, snow: 2 };
// Slow, map-anchored unevenness, so a road wanders a little the way real ones do instead of running ruler-straight.
const hv = (x, y) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; };
const noise = (x, y, s) => { const fx = x / s, fy = y / s, x0 = Math.floor(fx), y0 = Math.floor(fy), u = fx - x0, v = fy - y0, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v); return (hv(x0, y0) * (1 - a) + hv(x0 + 1, y0) * a) * (1 - b) + (hv(x0, y0 + 1) * (1 - a) + hv(x0 + 1, y0 + 1) * a) * b; };
function ground(forPath) {
  const c = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    if (!land[i] || lake[i]) { c[i] = Infinity; continue; }
    const x = cx(i), y = cy(i), b = PM.biomeAt(m, x, y);
    let v = 1 + 0.9 * noise(x, y, 26) + 0.5 * noise(x + 500, y + 300, 11);
    v *= b && ROUGH[b.type] ? (forPath ? 1 + (ROUGH[b.type] - 1) * 0.5 : ROUGH[b.type]) : 1;
    if (dRange[i] < 2) v *= forPath ? 2.4 : 7.5; else if (dRange[i] < 9) v *= forPath ? 1.4 : 2;
    if (dRiver[i] < 2.6) v *= forPath ? 4 : 6;
    if (dShore[i] < 4) v *= 1.5;
    c[i] = v;
  }
  return c;
}
const roadCost = ground(false), pathCost = ground(true);
// Which stretch of land each cell is on, so nothing is routed across the sea.
const part = new Int32Array(N).fill(-1);
for (let s = 0, id = 0; s < N; s++) {
  if (part[s] >= 0 || !isFinite(roadCost[s])) continue;
  const stack = [s]; part[s] = id;
  while (stack.length) { const i = stack.pop(), x = i % GW, y = (i / GW) | 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = x + dx, ny = y + dy, j = ny * GW + nx; if (nx >= 0 && ny >= 0 && nx < GW && ny < GH && part[j] < 0 && isFinite(roadCost[j])) { part[j] = id; stack.push(j); } } }
  id++;
}
// The nearest cell a road can stand on (a port may sit right on the shoreline).
function open(x, y) {
  let best = -1, bd = 1e9;
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const i = cellAt(x + dx * C, y + dy * C), d = Math.hypot(cx(i) - x, cy(i) - y); if (isFinite(roadCost[i]) && d < bd) { bd = d; best = i; } }
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
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let k = i; if (l < heap.length && heap[l][0] < heap[k][0]) k = l; if (r < heap.length && heap[r][0] < heap[k][0]) k = r; if (k === i) break; [heap[k], heap[i]] = [heap[i], heap[k]]; i = k; } } return top; };
  gScore[s] = 0;
  let end = -1;
  while (heap.length) {
    const [, i] = pop();
    if (done[i]) continue;
    done[i] = 1;
    if (stop ? i !== s && stop(i) : i === t) { end = i; break; }
    const x = i % GW, y = (i / GW) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
      const j = ny * GW + nx; if (done[j] || !isFinite(cost[j])) continue;
      const g = gScore[i] + (dx && dy ? 1.4142 : 1) * C * (cost[i] * (factor ? factor(i) : 1) + cost[j] * (factor ? factor(j) : 1)) / 2;
      if (g < gScore[j]) { gScore[j] = g; came[j] = i; push([g + (stop ? 0 : Math.hypot(cx(j) - tx, cy(j) - ty) * floor), j]); }
    }
  }
  if (end < 0) return null;
  const cells = []; for (let i = end; i >= 0; i = came[i]) cells.push(i);
  return cells.reverse();
}
// Rounds off the grid's corners (the two ends stay put), then keeps only the points that carry the shape, with
// none more than 45 units apart so the smooth curve through them cannot swing wide.
function shape(pts, tol) {
  for (let pass = 0; pass < 4; pass++) pts = pts.map((p, i) => (i === 0 || i === pts.length - 1 ? p : [(pts[i - 1][0] + 2 * p[0] + pts[i + 1][0]) / 4, (pts[i - 1][1] + 2 * p[1] + pts[i + 1][1]) / 4]));
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const go = (a, b) => { let worst = 0, at = -1; for (let i = a + 1; i < b; i++) { const d = PM.segDistance(pts[i][0], pts[i][1], pts[a], pts[b]); if (d > worst) { worst = d; at = i; } } if (worst > tol) { keep[at] = 1; go(a, at); go(at, b); } };
  go(0, pts.length - 1);
  const out = []; let last = 0;
  pts.forEach((p, i) => { if (keep[i] || Math.hypot(p[0] - pts[last][0], p[1] - pts[last][1]) > 45) { out.push([r1(p[0]), r1(p[1])]); last = i; } });
  return out;
}

/* ---------- roads (rules 1 to 3) ---------- */
const place = id => PM.find(m, 'settlements', id);
const straight = rd => Math.hypot(place(rd.from).x - place(rd.to).x, place(rd.from).y - place(rd.to).y);
const onRoad = new Uint8Array(N);          // 2: a road runs through this cell. 1: right beside one.
const laid = [];                           // [road, its cells]
const spot = new Map();                    // the cell a settlement's roads start from -> the settlement's own position
let unrouted = 0;
for (const rd of m.roads.filter(r => place(r.from) && place(r.to)).sort((a, b) => (b.major - a.major) || straight(a) - straight(b))) {
  const a = place(rd.from), b = place(rd.to), s = open(a.x, a.y), t = open(b.x, b.y);
  const ownEnd = j => Math.hypot(cx(j) - a.x, cy(j) - a.y) < 13 || Math.hypot(cx(j) - b.x, cy(j) - b.y) < 13;
  const cells = s >= 0 && t >= 0 && part[s] === part[t] ? search(s, t, roadCost, j => (onRoad[j] === 2 ? 0.45 : onRoad[j] === 1 && !ownEnd(j) ? 1.7 : 1), 0.45) : null;
  if (!cells) { console.log(`Road "${rd.id}" (${rd.from} to ${rd.to}) has no way by land; it was left as it is.`); unrouted++; continue; }
  spot.set(s, [a.x, a.y]); spot.set(t, [b.x, b.y]);
  laid.push([rd, cells]);
  for (const i of cells) onRoad[i] = 2;
  for (const i of cells) { const x = i % GW, y = (i / GW) | 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < GW && ny < GH && !onRoad[ny * GW + nx]) onRoad[ny * GW + nx] = 1; } }
}
// The network: which cells each cell is joined to by some road. A cell with exactly two neighbours is the middle
// of a stretch; any other, and every settlement, is a meeting point. Each stretch between two meeting points is
// shaped once, and every road along it uses those same points: that is what makes shared road one line.
const links = new Map();
const link = (a, b) => { if (!links.has(a)) links.set(a, new Set()); links.get(a).add(b); };
for (const [, cells] of laid) for (let i = 1; i < cells.length; i++) { link(cells[i - 1], cells[i]); link(cells[i], cells[i - 1]); }
const meeting = i => spot.has(i) || links.get(i).size !== 2;
const stretches = new Map();
const pointOf = i => spot.get(i) || [cx(i), cy(i)];
function stretch(cells) {
  const back = cells[0] > cells[cells.length - 1] || (cells[0] === cells[cells.length - 1] && cells[1] > cells[cells.length - 2]);
  const canon = back ? cells.slice().reverse() : cells, key = canon.join(',');
  if (!stretches.has(key)) stretches.set(key, shape(canon.map(pointOf), 1.5));
  const pts = stretches.get(key);
  return back ? pts.slice().reverse() : pts;
}
let junctions = 0;
for (const i of links.keys()) if (!spot.has(i) && links.get(i).size > 2) junctions++;
for (const [rd, cells] of laid) {
  const pts = [];
  for (let i = 0, from = 0; i < cells.length; i++) {
    if (i === 0 || (i < cells.length - 1 && !meeting(cells[i]))) continue;
    const piece = stretch(cells.slice(from, i + 1));
    for (const p of (pts.length ? piece.slice(1) : piece)) pts.push(p);
    from = i;
  }
  const via = pts.slice(1, -1);
  rd.via = via.length ? via : [[r1((pts[0][0] + pts[pts.length - 1][0]) / 2), r1((pts[0][1] + pts[pts.length - 1][1]) / 2)]];
}

/* ---------- paths (rule 4) ---------- */
const net = [];                            // points along everything laid so far, to join onto exactly
const addNet = pts => { for (const p of pts) net.push(p); };
for (const [rd] of laid) addNet(dense(PM.roadLine(m, rd), false, false));
const nearNet = (x, y) => { let bd = 1e18, bp = null; for (const p of net) { const d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < bd) { bd = d; bp = p; } } return { d: Math.sqrt(bd), p: bp }; };
const onNet = new Uint8Array(N);
for (let i = 0; i < N; i++) if (onRoad[i] === 2) onNet[i] = 1;
const atPlace = ([x, y]) => m.settlements.find(s => s.type !== 'village' && Math.hypot(s.x - x, s.y - y) <= PM.NEAR);
const kept = [];
let dropped = 0;
for (const p of m.paths) {
  if (p.closed || p.pts.length < 2) { kept.push(p); continue; }
  const first = p.pts[0], last = p.pts[p.pts.length - 1], both = atPlace(first) && atPlace(last);
  // The far end is the one farther from the network (for a path drawn outward from a road, that is its last point).
  const far = both ? last : nearNet(last[0], last[1]).d >= nearNet(first[0], first[1]).d ? last : first;
  const s = open(far[0], far[1]);
  if (s < 0) { kept.push(p); continue; }
  if (!both && nearNet(far[0], far[1]).d < 4) { console.log(`Path "${p.id}" was left out: the place it leads to is already on a road.`); dropped++; continue; }
  const t = both ? open(first[0], first[1]) : -1;
  const cells = both ? (t >= 0 && part[s] === part[t] ? search(s, t, pathCost, null, 1) : null) : search(s, -1, pathCost, null, 1, i => onNet[i]);
  if (!cells) { kept.push(p); continue; }           // an island with no road: the path stays as drawn
  let pts = cells.map(i => [cx(i), cy(i)]);
  pts[0] = far.slice();
  pts[pts.length - 1] = both ? first.slice() : nearNet(pts[pts.length - 1][0], pts[pts.length - 1][1]).p.slice();
  p.pts = shape(pts, 1.3).reverse();               // stored from the road outward
  kept.push(p);
  for (const i of cells) onNet[i] = 1;
  addNet(dense(p.pts, false, true));
}
m.paths = kept;

/* ---------- write ---------- */
fs.writeFileSync(path.join(dir, PM.JSON_FILE), PM.serialize(m));
fs.writeFileSync(path.join(dir, PM.DATA_FILE), PM.dataFile(m));
const problems = PM.check(m);
problems.forEach(p => console.log((p.level === 'error' ? 'Problem: ' : 'Note: ') + p.text));
console.log(`Laid ${laid.length} roads (${junctions} forks and crossroads outside settlements, ${stretches.size} stretches of road) and ${m.paths.length} paths` +
  `${dropped ? `; ${dropped} paths left out` : ''}${unrouted ? `; ${unrouted} roads could not be laid` : ''}.`);
process.exit(problems.some(p => p.level === 'error') ? 1 : 0);
