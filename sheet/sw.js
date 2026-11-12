// Offline support for the character sheet (the shared logic is ../shared/offline.js).
// After changing any file below, run `node tools/stamp-offline.js`: it raises the version and updates the
// fingerprint, so installed phones download the new copy. `node tools/test.js` fails until that is done.
// fingerprint: 30f3586f5449
importScripts('../shared/offline.js');
primordiumOffline('primordium-v15', [
  './', 'index.html', 'style.css', 'data.js', 'js/store.js', 'js/rules.js', 'js/ui.js', 'js/views.js', 'js/sheets.js', 'js/shop.js', 'js/app.js',
  '../shared/theme.css', '../shared/theme.js', '../shared/core.js', '../shared/items-data.js', '../shared/items.js', '../shared/primordium-data.js', '../shared/character-rules.js',
  '../shared/dice.js', '../shared/tactics-deck.js', '../shared/fx.js',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
]);
