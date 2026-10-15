// Optional tiny web server for testing the apps the way GitHub Pages serves them.
// Run:  node tools/serve.js   then visit http://localhost:8080 (GM tool at /gm/, player sheet at /sheet/, Codex at /codex/)
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const port = Number(process.env.PORT) || 8080;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.md': 'text/plain' };

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  // Like GitHub Pages: a folder without its trailing slash redirects, and a folder serves its index.html.
  const target = path.join(root, urlPath);
  if (!target.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (!urlPath.endsWith('/') && fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    res.writeHead(301, { Location: urlPath + '/' });
    return res.end();
  }
  const file = urlPath.endsWith('/') ? path.join(target, 'index.html') : target;
  fs.readFile(file, (err, body) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': (types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8',
      'Cache-Control': 'no-store' });
    res.end(body);
  });
}).listen(port, () => console.log('Primordium Tools at http://localhost:' + port));
