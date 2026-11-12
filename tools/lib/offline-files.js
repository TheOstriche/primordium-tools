// What each phone app keeps for offline use, read from its sw.js, and a fingerprint of those files' contents.
// The fingerprint is written in sw.js; when a cached file changes it no longer matches, tools/test-project.js
// fails, and `node tools/stamp-offline.js` raises the version and writes the new fingerprint. So a phone app can
// not be published with changed files and an old version (installed phones would keep the old copy).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..', '..');
const APPS = { sheet: 'sheet/sw.js', Codex: 'codex/sw.js' };
const TEXT = /\.(js|css|html|json|webmanifest|md|svg)$/;

function read(swPath) {
  const text = fs.readFileSync(path.join(root, swPath), 'utf8'), dir = path.posix.dirname(swPath);
  const call = text.match(/primordiumOffline\('([^']+)',\s*\[([\s\S]*?)\]\)/);
  if (!call) throw new Error(swPath + ': no primordiumOffline(version, [files]) call');
  const listed = [...call[2].matchAll(/'([^']+)'/g)].map(m => m[1]);
  // './' is the folder's index.html, which is listed as well.
  const files = [...new Set(listed.filter(f => f !== './').map(f => path.posix.join(dir, f)))].sort();
  return { swPath, text, version: call[1], listed, files, stamped: (text.match(/^\/\/ fingerprint: (\w+)/m) || [])[1] || null };
}

// Line endings are evened out, so the same files give the same fingerprint on Windows and on GitHub.
function fingerprint(files) {
  const h = crypto.createHash('sha256');
  for (const f of files) {
    let body = fs.readFileSync(path.join(root, f));
    if (TEXT.test(f)) body = Buffer.from(body.toString('utf8').replace(/\r\n/g, '\n'));
    h.update(f).update('\0').update(body).update('\0');
  }
  return h.digest('hex').slice(0, 12);
}

module.exports = { root, APPS, read, fingerprint };
