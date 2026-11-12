// Offline support for the Codex (the shared logic is ../shared/offline.js).
// After changing any file below, run `node tools/stamp-offline.js`: it raises the version and updates the
// fingerprint, so installed phones download the new copy. `node tools/test.js` fails until that is done.
// fingerprint: 9eab52f55a83
importScripts('../shared/offline.js');
primordiumOffline('codex-v9', [
  './', 'index.html', 'style.css', 'codex-data.js', 'js/data.js', 'js/ui.js', 'js/views.js', 'js/app.js',
  '../shared/theme.css', '../shared/theme.js', '../shared/core.js', '../shared/items-data.js', '../shared/items.js', '../shared/primordium-data.js', '../shared/npc-data.js',
  '../shared/dice.js', '../shared/tactics-deck.js', '../shared/fx.js',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
]);
