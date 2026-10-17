// Checks that the stored data agrees with itself and with the code: names the code looks up exist, every value
// is one the apps understand, and the Codex's notes line up with the shared lists.
// Run: node tools/test-data.js   (or node tools/test.js for every test)
const fs = require('fs'), path = require('path');
const { root, perksNamedInCode } = require('./lib/data-links.js');
global.window = {};
for (const f of ['shared/core.js', 'shared/primordium-data.js', 'shared/npc-data.js', 'codex/codex-data.js']) eval(fs.readFileSync(path.join(root, f), 'utf8'));
const Core = window.PrimordiumCore, P = window.PRIMORDIUM_DATA, NPCS = window.PRIMORDIUM_NPCS, C = window.CODEX_DATA;
let fails = 0;
const check = (ok, msg, bad) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg + (ok || !bad ? '' : ': ' + [].concat(bad).slice(0, 8).join('; '))); if (!ok) fails++; };
const same = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

/* ---------- skills ---------- */
const entriesOf = s => [...Object.entries(s.base).flatMap(([t, l]) => l.map(e => ({ ...e, where: `${s.name} Tier ${t}` }))),
  ...Object.entries(s.paths).flatMap(([p, tiers]) => Object.entries(tiers).flatMap(([t, l]) => l.map(e => ({ ...e, where: `${s.name} / ${p} ${t}` }))))];
const entries = P.skills.flatMap(entriesOf);
check(new Set(P.skills.map(s => s.name)).size === P.skills.length, `${P.skills.length} skills, all names unique`);
check(P.skills.every(s => same(Object.keys(s.base), ['0', '1', '2', '3', '4'])), 'every skill has Tier 0 and Base Tiers 1-4',
  P.skills.filter(s => !same(Object.keys(s.base), ['0', '1', '2', '3', '4'])).map(s => s.name));
const badPath = P.skills.flatMap(s => Object.entries(s.paths).filter(([, t]) => !same(Object.keys(t), ['1', '2', '3', '4'])).map(([p]) => s.name + ' / ' + p));
check(!badPath.length, 'every path has Tiers 1-4', badPath);
const badEntry = entries.filter(e => !['ability', 'perk'].includes(e.kind) || !e.name || !e.usage ||
  (e.kind === 'ability' && (!Core.RARITIES.includes(e.rarity) || !['Standard', 'Quick', 'Defensive'].includes(e.type))));
check(!badEntry.length, `${entries.length} abilities and perks have a kind, name, and usage (abilities: a rarity and type)`, badEntry.map(e => e.where + ' / ' + e.name));
const badFx = entries.filter(e => (e.effects || []).some(f => !((f.stat && Core.STATS.includes(f.stat) && Number.isFinite(f.add)) || Number.isFinite(f.maxhp) || Number.isFinite(f.armor) ||
  (Core.STATS.includes(f.maxhpPerStat) && Number.isFinite(f.per)))));
check(!badFx.length, 'every effect is a stat, maxhp, armor, or maxhpPerStat change', badFx.map(e => e.where + ' / ' + e.name));

/* ---------- names the code depends on ---------- */
for (const g of perksNamedInCode()) {
  const pool = g.skill ? entriesOf(P.skills.find(s => s.name === g.skill)) : entries;
  const missing = g.names.filter(n => !pool.some(e => e.name === n));
  check(!missing.length, `${g.names.length} names used by ${g.where} exist${g.skill ? ' in ' + g.skill : ''}`, missing);
}
check(P.skills.some(s => s.name === 'Tactics'), 'the Tactics skill exists (the deck is built from it)');

/* ---------- races and traits ---------- */
const races = Object.entries(P.races);
check(races.every(([, r]) => Number.isInteger(r.hp) && r.stats.length === 6 && r.stats.every(Number.isInteger) && Array.isArray(r.traits)),
  `${races.length} races have HP, six stats, and specials`);
check(same(Object.keys(C.raceLore), Object.keys(P.races)), 'every race has Codex lore and every lore entry is a race');
check(P.races.Trin && P.races.Trin.choice, 'Trin exists with its stat choice (the sheet and character-rules.js handle it by name)');
check(new Set(P.traits.map(t => t.name)).size === P.traits.length, `${P.traits.length} traits, all names unique`);
check(P.traits.every(t => Object.keys(C.traitGroupNames).includes(t.category) && Number.isInteger(t.cost) && t.effect),
  'every trait has a known category, a whole-number cost, and an effect', P.traits.filter(t => !Object.keys(C.traitGroupNames).includes(t.category)).map(t => t.name));

/* ---------- Codex notes line up with the shared lists ---------- */
check(same(Object.keys(C.skillNotes), P.skills.map(s => s.name)), 'every skill has a Codex summary and every summary is a skill');
const families = new Set(NPCS.map(n => n.family));
check(Object.keys(C.creatureFamilies).every(f => families.has(f)), 'every Codex family note names a family that has creatures',
  Object.keys(C.creatureFamilies).filter(f => !families.has(f)));
check(same(C.tables.deck.map(d => d.rarity), Core.RARITIES), 'the Codex deck table lists every rarity in order');

/* ---------- creatures ---------- */
check(new Set(NPCS.map(n => n.name)).size === NPCS.length, `${NPCS.length} creatures, all names unique`);
const badNpc = NPCS.filter(n => !Core.ROLES.includes(n.role) || !Core.TACTICS.includes(n.tactics) || !Core.SIZES.includes(n.size) ||
  !same(Object.keys(n.stats), Core.STATS) || !Number.isInteger(n.level) || !Number.isFinite(n.armor) || !(Number.isFinite(n.hp) || (n.hp == null && n.specialHp)));
check(!badNpc.length, 'every creature has a valid role, tactics, size, level, armor, HP (or special HP), and six stats', badNpc.map(n => n.name));
const badAb = NPCS.flatMap(n => (n.abilities || []).filter(a => !Core.RARITIES.includes(a.rarity) || !a.text).map(a => n.name + ' / ' + a.name));
check(!badAb.length, 'every creature ability has a rarity and text', badAb);
check(NPCS.every(n => n.humanoid ? !!n.combatSkill && !(n.abilities || []).length : (n.abilities || []).length > 0),
  'humanoids have a combat skill and no abilities; everyone else has abilities', NPCS.filter(n => n.humanoid ? !n.combatSkill : !(n.abilities || []).length).map(n => n.name));
check(NPCS.every(n => (n.role === 'Boss') === (n.turnsPerPhase === 2)), 'Bosses, and only Bosses, take two turns per phase',
  NPCS.filter(n => (n.role === 'Boss') !== (n.turnsPerPhase === 2)).map(n => n.name));

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
