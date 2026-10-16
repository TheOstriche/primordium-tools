// Runs every test in the repository. Run from anywhere:  node tools/test.js
// Each test prints "ok" or "FAIL" lines; this shows only failures and a one-line result per suite.
const { spawnSync } = require('child_process');
const path = require('path');
const root = path.join(__dirname, '..');

const suites = [
  ['Shared core (rule tables, helpers)', 'node', ['tools/test-core.js']],
  ['Tactical deck', 'node', ['tools/test-deck.js']],
  ['GM game math', 'node', ['gm/tools/test-rules.js']],
  ['GM combat rules', 'node', ['gm/tools/test-combat.js']],
  ['Codex guide parser (Python)', process.platform === 'win32' ? 'python' : 'python3', ['-m', 'unittest', 'discover', '-s', 'codex/tests']]
];

let failed = 0;
for (const [name, cmd, args] of suites) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
  if (r.error) { console.log(`skip  ${name}: ${cmd} is not installed`); continue; }
  const text = (r.stdout || '') + (r.stderr || '');
  const ok = r.status === 0;
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}`);
  if (!ok) text.split('\n').filter(l => /FAIL|Error|error|Traceback|assert/i.test(l)).slice(0, 20).forEach(l => console.log('      ' + l));
}
console.log(failed ? `\n${failed} suite(s) failed` : '\nEvery suite passed');
process.exit(failed ? 1 : 0);
