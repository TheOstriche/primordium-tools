// Offline support: cache the Codex so it opens without a connection. Bump VERSION when you publish changes.
const VERSION = 'codex-v3';
const FILES = ['./','index.html','style.css','app.js','codex-data.js','../shared/primordium-data.js','../shared/npc-data.js','../shared/dice.js','../shared/tactics-deck.js','../shared/fx.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png'];
const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
// Cache each file on its own, so one missing file can never stop the app from installing.
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting())));
// Only remove the Codex's own old caches: the character sheet shares this site and keeps its own.
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('codex-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Fonts never change at a given address: serve them from the cache once saved.
  if (FONTS.test(e.request.url)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })));
    return;
  }
  // Try the network first so updates arrive quickly, and fall back to the cache when offline.
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
