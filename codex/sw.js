// Offline support for the Codex (the shared logic is ../shared/offline.js).
// Raise the version whenever any file below changes, so installed phones download the new copy.
importScripts('../shared/offline.js');
primordiumOffline('codex-v5', [
  './', 'index.html', 'style.css', 'codex-data.js', 'js/data.js', 'js/ui.js', 'js/views.js', 'js/app.js',
  '../shared/theme.css', '../shared/theme.js', '../shared/core.js', '../shared/primordium-data.js', '../shared/npc-data.js',
  '../shared/dice.js', '../shared/tactics-deck.js', '../shared/fx.js',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
]);
