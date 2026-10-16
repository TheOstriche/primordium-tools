// Offline support shared by the phone apps' service workers (sheet/sw.js and codex/sw.js).
// Each app's sw.js sets its cache name and file list, then calls this:
//   importScripts('../shared/offline.js');
//   primordiumOffline('codex-v4', ['./', 'index.html', ...]);
// Raise the version in an app's sw.js whenever a file it lists changes, so installed phones update.
/* global self, caches */
function primordiumOffline(version, files) {
  // Cache names are "<app>-v<n>"; an app only ever deletes its own old caches, because the apps share one site.
  const prefix = version.replace(/v\d+$/, '');
  // Google Fonts never change at a given address, so once saved they are served from the cache.
  const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
  const keep = (req, res) => { const copy = res.clone(); caches.open(version).then(c => c.put(req, copy)); return res; };

  // Cache each file on its own, so one missing file can never stop the app from installing.
  self.addEventListener('install', e => e.waitUntil(
    caches.open(version).then(c => Promise.all(files.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting())));
  self.addEventListener('activate', e => e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(prefix) && k !== version).map(k => caches.delete(k))))
      .then(() => self.clients.claim())));
  self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    if (FONTS.test(e.request.url)) {
      e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => keep(e.request, r))));
      return;
    }
    // Network first so updates arrive quickly; the cache when offline.
    e.respondWith(fetch(e.request).then(r => keep(e.request, r))
      .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  });
}
