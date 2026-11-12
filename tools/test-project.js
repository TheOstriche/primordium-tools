// Checks the project itself rather than the game: every script parses, every file a page loads exists, each
// phone app's offline list matches what its page loads, and its version was raised after its files last changed.
// Run: node tools/test-project.js   (or node tools/test.js for every test)
const fs = require('fs'), path = require('path'), vm = require('vm');
const { root, APPS, read, fingerprint } = require('./lib/offline-files.js');
let fails = 0;
const check = (ok, msg, bad) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg + (ok || !bad ? '' : ': ' + [].concat(bad).slice(0, 8).join('; '))); if (!ok) fails++; };
const exists = f => fs.existsSync(path.join(root, f));
const walk = dir => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(dir + '/' + e.name) : [dir + '/' + e.name]);

/* ---------- every script parses ---------- */
const scripts = ['shared', 'sheet', 'codex', 'gm', 'tools'].flatMap(walk).filter(f => f.endsWith('.js'));
const broken = scripts.filter(f => { try { new vm.Script(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); return false; } catch (e) { return true; } });
check(!broken.length, `${scripts.length} scripts parse`, broken);

/* ---------- every page loads files that exist, as plain scripts ---------- */
// The local files a page loads: scripts, stylesheets, the manifest, and icons.
function loadedBy(page) {
  const html = fs.readFileSync(path.join(root, page), 'utf8'), dir = path.posix.dirname(page);
  const refs = [...html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g)].map(m => m[1]).filter(u => !/^(https?:|data:|#)/.test(u));
  return { html, files: [...new Set(refs.map(u => path.posix.join(dir, u.split(/[?#]/)[0])))] };
}
const PAGES = { 'index.html': null, 'sheet/index.html': 'sheet', 'codex/index.html': 'Codex', 'gm/index.html': null };
for (const [page, phoneApp] of Object.entries(PAGES)) {
  const { html, files } = loadedBy(page);
  check(files.every(exists), `${page}: every file it loads exists (${files.length})`, files.filter(f => !exists(f)));
  // No modules and no inline scripts: the GM tool opens from a double-clicked file, and the phone apps' security
  // policy only allows this site's own script files.
  check(!/<script\b[^>]*type="module"/.test(html) && !/<script\b(?![^>]*\bsrc=)[^>]*>\s*\S/.test(html), `${page}: plain script files only (no modules, no inline scripts)`);
  if (!phoneApp) continue;
  check(/http-equiv="Content-Security-Policy"/.test(html) && !/\son[a-z]+="/.test(html), `${page}: has its security policy and no inline event handlers`);

  /* ---------- offline: the list matches the page, and the version follows the files ---------- */
  const sw = read(APPS[phoneApp]);
  check(sw.files.every(exists), `${sw.swPath}: every listed file exists`, sw.files.filter(f => !exists(f)));
  const missing = files.filter(f => !sw.files.includes(f));
  check(!missing.length, `${sw.swPath}: lists every file ${page} loads`, missing);
  check(sw.listed.includes('./') && sw.files.includes(page), `${sw.swPath}: lists the page itself ('./' and index.html)`);
  check(sw.stamped === fingerprint(sw.files), `${sw.swPath}: ${sw.version} matches its files (if not, run: node tools/stamp-offline.js)`);
}

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
