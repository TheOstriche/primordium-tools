// Run after changing anything a phone app loads:  node tools/stamp-offline.js
// For each phone app whose cached files changed, raises the version in its sw.js (primordium-v14 -> v15) and
// writes the files' new fingerprint, so installed phones download the new copy. Does nothing when nothing changed.
const fs = require('fs'), path = require('path');
const { root, APPS, read, fingerprint } = require('./lib/offline-files.js');

for (const [app, swPath] of Object.entries(APPS)) {
  const sw = read(swPath), now = fingerprint(sw.files);
  if (sw.stamped === now) { console.log(`${app}: no change (${sw.version})`); continue; }
  const next = sw.version.replace(/v(\d+)$/, (_, n) => 'v' + (+n + 1));
  let text = sw.text.replace(`primordiumOffline('${sw.version}'`, `primordiumOffline('${next}'`);
  text = /^\/\/ fingerprint: \w+/m.test(text) ? text.replace(/^\/\/ fingerprint: \w+/m, '// fingerprint: ' + now)
    : text.replace(/^importScripts/m, '// fingerprint: ' + now + '\nimportScripts');
  fs.writeFileSync(path.join(root, swPath), text);
  console.log(`${app}: ${sw.version} -> ${next}`);
}
