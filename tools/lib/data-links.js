// Where the code depends on the data by name. Renaming one of these in the data silently turns its rule off,
// so tools/test-data.js checks they all exist and tools/export-handoffs.js lists them for whoever edits the data.
// The names are read from the source files themselves, so this list never goes stale.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const all = (text, re) => [...text.matchAll(re)].map(m => m[1] || m[2]);   // a name in '…' or "…" quotes

function perksNamedInCode() {
  const deck = read('shared/tactics-deck.js');
  const sheet = ['sheet/js/rules.js', 'sheet/js/sheets.js', 'sheet/js/app.js'].map(read).join('\n');
  return [
    { where: 'shared/tactics-deck.js (deck promotions: which cards each perk moves)', skill: 'Tactics',
      names: [...new Set(all(deck, /^\s+(?:'([^']+)'|"([^"]+)"): \[\{ ?t:/gm))] },
    { where: 'shared/tactics-deck.js (deck mechanics: buttons and rules each perk adds)', skill: 'Tactics',
      names: [...new Set(all(deck, /names\.has\('([^']+)'\)/g))] },
    { where: 'sheet/js/rules.js and sheets.js (sheet mechanics)', skill: null,
      names: [...new Set(all(sheet, /has\((?:c|current), '([^']+)'\)/g))] }
  ];
}

module.exports = { root, read, perksNamedInCode };
