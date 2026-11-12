// Checks the world map: the stored map itself (shared/map/primordium-map.json), the packaged copy the apps load,
// and the map rules in shared/map/map-model.js (checking, safe loading, clicking, comparing, patching).
// Run: node tools/test-map.js   (or node tools/test.js for every test)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'shared', 'map');
global.window = globalThis;
eval(fs.readFileSync(path.join(dir, 'map-model.js'), 'utf8'));
const PM = globalThis.PrimordiumMap;
let fails = 0;
const check = (ok, msg, bad) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg + (ok || !bad ? '' : ': ' + [].concat(bad).slice(0, 8).join('; '))); if (!ok) fails++; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const copy = v => JSON.parse(JSON.stringify(v));

/* ---------- the stored map ---------- */
const raw = JSON.parse(fs.readFileSync(path.join(dir, PM.JSON_FILE), 'utf8'));
const notes = [];
const map = PM.shaped(raw, notes);
check(!notes.length, 'the map file needs no repairs when it is read', notes);
check(same(map.meta, raw.meta) && PM.LISTS.every(k => same(map[k], raw[k])), 'reading the map file changes nothing in it');
const problems = PM.check(map), errors = problems.filter(p => p.level === 'error');
// These are the five rules from the map handoff: unique ids, roads join real settlements, shapes have enough
// points, settlements are on land, and rivers end in the sea, a lake, or another river.
check(!errors.length, 'the map passes every check (ids, roads, point counts, settlements on land, rivers reach water)', errors.map(p => p.text));
check(!problems.some(p => p.level === 'warn'), 'the map has no notes either (unknown types, repeated roads)', problems.filter(p => p.level === 'warn').map(p => p.text));
check(map.coast.some(c => c.id === 'mainland'), 'the mainland coastline exists');
const inside = p => p[0] >= -200 && p[0] <= map.meta.width + 200 && p[1] >= -200 && p[1] <= map.meta.height + 200;
const strays = PM.LISTS.flatMap(k => map[k].filter(f => !PM.outline(map, k, f).every(inside)).map(f => `${k}/${f.id}`));
check(!strays.length, 'every feature sits on (or just around) the canvas', strays);

/* ---------- the packaged copy ---------- */
global.window = {};
eval(fs.readFileSync(path.join(dir, PM.DATA_FILE), 'utf8'));
check(same(window.PRIMORDIUM_MAP, map), `${PM.DATA_FILE} matches ${PM.JSON_FILE} (if not, run: node tools/build-map.js)`);
global.window = globalThis;
check(same(PM.shaped(JSON.parse(PM.serialize(map))), map), 'saving and reading the map back gives the same map');
check(PM.serialize(map).split('\n').length === 2 + 1 + PM.LISTS.length * 2 + PM.LISTS.reduce((n, k) => n + map[k].length, 0) + 1, 'the saved file keeps one feature per line');

/* ---------- the checks catch each kind of mistake ---------- */
const broken = (change, words) => { const m = copy(map); change(m); return PM.check(m).some(p => p.level === 'error' && p.text.includes(words)); };
check(broken(m => { m.settlements[1].id = m.settlements[0].id; }, 'share the id'), 'a repeated id is reported');
check(broken(m => { m.roads[0].to = 'nowhere'; }, 'does not exist'), 'a road to a missing settlement is reported');
check(broken(m => { m.roads[0].to = m.roads[0].from; }, 'same settlement'), 'a road from a settlement to itself is reported');
check(broken(m => { m.lakes[0].pts.length = 2; }, 'at least 3 points'), 'an area with two points is reported');
check(broken(m => { m.rivers[0].pts.length = 1; }, 'at least 2 points'), 'a line with one point is reported');
check(broken(m => { m.settlements[0].x = 30; m.settlements[0].y = 30; }, 'in the sea'), 'a settlement in the sea is reported');
check(broken(m => { const r = m.rivers[0]; r.pts[r.pts.length - 1] = [700, 600]; }, 'dry land'), 'a river that stops on dry land is reported');
check(PM.check(Object.assign(copy(map), { biomes: [Object.assign(copy(map.biomes[0]), { type: 'lava' })] })).some(p => p.level === 'warn' && p.text.includes('cannot draw')), 'an unknown terrain type is noted');

/* ---------- outside data is forced into shape ---------- */
const throws = fn => { try { fn(); return false; } catch (e) { return true; } };
check([null, 5, 'x', [], {}, { coast: 'x' }, { coast: [] }, { coast: [{ id: 'a', pts: [[0, 0]] }] }].every(v => throws(() => PM.shaped(v))), 'things that are not a map are refused');
{
  const fixes = [];
  const hostile = PM.shaped({
    meta: { name: { toString: () => 'x' }, width: 'wide', height: 1e9, scale: { pxPerUnit: -4, unit: 7, barUnits: 'NaN' }, __proto__: { polluted: true } },
    coast: [{ id: 'mainland', name: 5, pts: [[0, 0], [10, 0], [10, 10], ['x', 3], [NaN, 2], null, [1e12, 5]] }, { id: 'mainland', pts: [[0, 0], [1, 1], [2, 0]] }, 'junk', { pts: [[0, 0], [1, 1], [2, 0]] }],
    settlements: [{ id: '<img src=x onerror=alert(1)>', type: {}, x: '12.34', y: 5, name: 'a'.repeat(5000), deep: { a: 1 }, list: [1], extra: 'kept', flag: true }, { id: 'lost', x: 'no', y: 1 }],
    roads: 'none', rivers: [{ id: 'r', width: 'thick', pts: [[0, 0]] }], labels: [{ id: 'l', text: 5, x: 1, y: 2, rot: 9999, size: -5 }]
  }, fixes);
  check(hostile.meta.width === 1600 && hostile.meta.height === 20000 && hostile.meta.scale.pxPerUnit === 0.0001 && hostile.meta.scale.barUnits === 100 && hostile.meta.scale.unit === '7', 'bad map details fall back to safe values');
  check(({}).polluted === undefined, 'a hostile file cannot reach into the code (prototype pollution)');
  check(same(hostile.coast.map(c => c.id), ['mainland', 'isle-1', 'isle-2']) && same(hostile.coast[0].pts, [[0, 0], [10, 0], [10, 10], [100000, 5]]) && hostile.coast[0].name === '5', 'repeated or missing ids are renamed, bad points dropped, far points pulled in');
  const s = hostile.settlements[0];
  check(hostile.settlements.length === 1 && s.x === 12.3 && s.name.length === PM.LIMITS.name && s.type === '[object Object]'.slice(0, 30) && !('deep' in s) && !('list' in s) && s.extra === 'kept' && s.flag === true,
    'fields are coerced and trimmed; unknown plain fields are kept, nested ones dropped');
  check(hostile.roads.length === 0 && hostile.rivers.length === 0 && hostile.labels[0].rot === 360 && hostile.labels[0].size === 4 && hostile.labels[0].text === '5', 'lists of the wrong kind are emptied and numbers are kept in range');
  check(fixes.length >= 5, 'each repair is reported (' + fixes.length + ')');
  check(typeof PM.check(hostile) === 'object' && Array.isArray(PM.hit(hostile, 5, 5, 3)), 'a repaired map can be checked and clicked without errors');
}

/* ---------- changing the map ---------- */
{
  const m = copy(map), town = m.settlements.find(s => m.roads.some(r => r.from === s.id || r.to === s.id)), roads = m.roads.filter(r => r.from === town.id || r.to === town.id).length;
  check(PM.rename(m, 'settlements', town.id, 'renamed-town') && m.roads.filter(r => r.from === 'renamed-town' || r.to === 'renamed-town').length === roads && !PM.check(m).length, 'renaming a settlement keeps its roads attached');
  check(!PM.rename(m, 'settlements', 'renamed-town', m.settlements[0].id === 'renamed-town' ? m.settlements[1].id : m.settlements[0].id) && !PM.rename(m, 'settlements', 'renamed-town', '  '), 'an id that is taken or empty is refused');
  const before = m.roads.length;
  check(PM.remove(m, 'settlements', 'renamed-town') && m.roads.length === before - roads && !PM.check(m).length, 'deleting a settlement deletes its roads');
  check(PM.freshId(map, 'settlements') === 'place-1' && PM.freshId({ rivers: [{ id: 'river-1' }, { id: 'river-2' }] }, 'rivers') === 'river-3', 'new features get the next free id');
  const line = { pts: [[0, 0], [10, 0], [20, 0]] }, ring = { pts: [[0, 0], [10, 0], [10, 10], [0, 10]] };
  check(PM.insertPoint('rivers', line, [5, 1]) === 1 && PM.insertPoint('rivers', line, [30, 0]) === 4 && PM.insertPoint('rivers', line, [-5, 0]) === 0 && same(line.pts.map(p => p[0]), [-5, 0, 5, 10, 20, 30]), 'a new point joins the nearest edge, or the nearer end of a line');
  check(PM.insertPoint('lakes', ring, [-1, 5]) === 4 && ring.pts.length === 5, 'a new point on an area can close the gap between its last and first points');
}

/* ---------- clicking ---------- */
{
  const s = map.settlements[0], top = PM.hit(map, s.x, s.y, 4, { pin: 8 })[0];
  check(top && top.kind === 'settlements' && top.id === s.id, 'clicking a settlement finds it first');
  const lake = map.lakes[0], c = lake.pts.reduce((a, p) => [a[0] + p[0] / lake.pts.length, a[1] + p[1] / lake.pts.length], [0, 0]);
  check(PM.hit(map, c[0], c[1], 3).some(h => h.kind === 'lakes' && h.id === lake.id), 'clicking inside a lake finds it');
  const rv = map.rivers[0], mid = PM.sampleCurve(rv.pts, false, 6)[3];
  check(PM.hit(map, mid[0], mid[1], 3).some(h => h.kind === 'rivers' && h.id === rv.id), 'clicking on a river finds it');
  check(!PM.hit(map, mid[0], mid[1], 3, { shown: k => k !== 'rivers' }).some(h => h.kind === 'rivers'), 'hidden layers cannot be clicked');
  check(same(PM.hit(map, 20, 20, 3), []), 'clicking open sea finds nothing');
  const label = map.labels[0];
  check(PM.hit(map, label.x, label.y, 3).some(h => h.kind === 'labels' && h.id === label.id), 'clicking a label finds it');
  check(PM.onLand(map, map.settlements[1].x, map.settlements[1].y) && !PM.onLand(map, 20, 20), 'land and sea are told apart');
}

/* ---------- comparing and patching ---------- */
{
  const next = copy(map);
  next.settlements[0].name = 'Renamed';
  PM.remove(next, 'rivers', next.rivers[0].id);
  next.lakes.push({ id: 'lake-new', name: '', pts: [[700, 900], [720, 900], [710, 915]] });
  next.biomes.push(next.biomes.shift());
  next.meta.version = 'map-test';
  const d = PM.diff(map, next);
  check(d.set.settlements.length === 1 && d.set.lakes.length === 1 && same(d.remove.rivers, [map.rivers[0].id]) && d.order.biomes && d.meta && !d.set.biomes, 'a comparison lists only what changed, was added, removed, or reordered');
  check(PM.describe(d).includes('1 river removed') && PM.describe(d).includes('1 settlement changed or added'), 'the comparison is described in words');
  check(same(PM.patch(map, d), next), 'applying a comparison to the old map gives the new map');
  check(PM.isEmptyDiff(PM.diff(map, copy(map))), 'a map compared with itself has no changes');
  check(same(PM.patch(map, next), next), 'a whole map can be pasted in place of changes');
  const gone = PM.patch(map, { remove: { settlements: [map.roads[0].from] } });
  check(!gone.roads.some(r => r.from === map.roads[0].from || r.to === map.roads[0].from), 'removing a settlement through a patch removes its roads');
  check([null, [], 'x', {}, { nope: 1 }].every(v => throws(() => PM.patch(map, v))), 'things that are not changes are refused');
  check(same(PM.patch(map, { set: { settlements: [{ id: 'bad', x: 'no' }], bogus: [{ id: 1 }] } }), map), 'a damaged item in a patch is left out');
}

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
