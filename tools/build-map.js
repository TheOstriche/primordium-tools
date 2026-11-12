// Packages the world map for the apps. A page opened from a file can not read JSON, so:
//   shared/map/primordium-map.json  ->  shared/map/map-data.js  (window.PRIMORDIUM_MAP)
// It also tidies the JSON into the standard layout (one feature per line), so changes are easy to see in
// GitHub Desktop. The map app's Save does the same two things. Run this after replacing or hand-editing the JSON:
//   node tools/build-map.js
// To apply a set of changes from the Claude project (the "What to send back" shape in exports/handoff/map.md,
// or a whole replacement map) saved as a file:
//   node tools/build-map.js --apply path/to/changes.json
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'shared', 'map');
global.window = globalThis;
eval(fs.readFileSync(path.join(dir, 'map-model.js'), 'utf8'));
const PM = globalThis.PrimordiumMap;
const readJson = file => { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error(`Could not read ${file}: ${e.message}`); process.exit(1); } };

const notes = [];
let map = PM.shaped(readJson(path.join(dir, PM.JSON_FILE)), notes);
const at = process.argv.indexOf('--apply');
if (at > 0) {
  if (!process.argv[at + 1]) { console.error('Give the changes file: node tools/build-map.js --apply path/to/changes.json'); process.exit(1); }
  const before = map;
  try { map = PM.patch(map, readJson(path.resolve(process.argv[at + 1])), notes); } catch (e) { console.error('Nothing was changed. ' + e.message); process.exit(1); }
  const d = PM.diff(before, map);
  console.log(PM.isEmptyDiff(d) ? 'The changes made no difference to the map.' : 'Applied: ' + PM.describe(d) + '.');
}
fs.writeFileSync(path.join(dir, PM.JSON_FILE), PM.serialize(map));
fs.writeFileSync(path.join(dir, PM.DATA_FILE), PM.dataFile(map));
notes.forEach(n => console.log('Repaired: ' + n));
const problems = PM.check(map);
problems.forEach(p => console.log((p.level === 'error' ? 'Problem: ' : 'Note: ') + p.text));
console.log(`Wrote shared/map/${PM.JSON_FILE} and shared/map/${PM.DATA_FILE} (${PM.LISTS.map(k => map[k].length + ' ' + k).join(', ')}).`);
process.exit(problems.some(p => p.level === 'error') ? 1 : 0);
