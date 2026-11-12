// Offline support shared by the phone apps' service workers (sheet/sw.js and codex/sw.js).
// Each app's sw.js sets its cache name and file list, then calls this:
//   importScripts('../shared/offline.js');
//   primordiumOffline('codex-v4', ['./', 'index.html', ...]);
// After changing a file an app lists, run `node tools/stamp-offline.js`: it raises that app's version so
// installed phones update (tools/test-project.js fails until it is done).
/* global self, caches */
function primordiumOffline(version, files) {
  // Cache names are "<app>-v<n>"; an app only ever deletes its own old caches, because the apps share one site.
  const prefix = version.replace(/v\d+$/, '');
  // Google Fonts never change at a given address, so once saved they are served from the cache.
  const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
  const WAIT = 4000;   // on a connection that hangs, give up after this long and use the saved copy
  // Save a good answer for later. Errors (a 404 page, a server fault) are never saved over a working copy.
  const keep = (req, res) => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(version).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  };
  // Our own files match whatever follows a "?"; a font's address must match exactly.
  const saved = req => caches.match(req, { ignoreSearch: !FONTS.test(req.url) });
  // The network's answer, unless it takes too long and there is a saved copy to show instead.
  function fresh(req) {
    const net = fetch(req).then(r => keep(req, r));
    const slow = new Promise(done => setTimeout(done, WAIT)).then(() => saved(req)).then(hit => hit || net);
    net.catch(() => {});   // if the saved copy wins the race, a later network failure is not an error
    return Promise.race([net, slow]);
  }

  // Cache each file on its own, so one missing file can never stop the app from installing.
  self.addEventListener('install', e => e.waitUntil(
    caches.open(version).then(c => Promise.all(files.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting())));
  self.addEventListener('activate', e => e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(prefix) && k !== version).map(k => caches.delete(k))))
      .then(() => self.clients.claim())));
  self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET' || !/^https?:/.test(req.url)) return;
    if (FONTS.test(req.url)) {
      e.respondWith(saved(req).then(hit => hit || fetch(req).then(r => keep(req, r))));
      return;
    }
    // Network first so updates arrive quickly; the saved copy when offline or the connection hangs.
    // Only a page that fails to load falls back to the app's index.html; a missing script stays an error.
    e.respondWith(fresh(req).catch(() => saved(req))
      .then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : null))
      .then(hit => hit || Response.error()));
  });
}
