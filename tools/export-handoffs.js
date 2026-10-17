// Writes exports/handoff/: one Markdown file per kind of stored data (creatures, skills, races and traits, rule
// tables, Codex rules text, GM rulings and scaling) plus an index. Each says where the data lives, which apps read
// it, its exact format and rules, the names the code depends on, the current contents, what to send back, and how
// Claude Code brings a change in. Made for a Claude project, so it always knows how to change the data.
// Everything is read from the live files, so run this again after any change:  node tools/export-handoffs.js
const fs = require('fs'), path = require('path');
const { root, read, perksNamedInCode } = require('./lib/data-links.js');
global.window = {};
for (const f of ['shared/core.js', 'shared/primordium-data.js', 'shared/npc-data.js', 'codex/codex-data.js', 'sheet/data.js', 'shared/tactics-deck.js']) eval(read(f));
const Core = window.PrimordiumCore, P = window.PRIMORDIUM_DATA, NPCS = window.PRIMORDIUM_NPCS, C = window.CODEX_DATA, LISTS = window.SHEET_LISTS, DK = window.PrimordiumDeck;
const S = JSON.parse(read('gm/data/scaling.json'));
// The conditions the GM can mark, read from the code so the handoff always matches it.
const GM_CONDITIONS = JSON.parse(read('gm/js/combat-engine.js').match(/const CONDITIONS = (\[[^\]]*\])/)[1].replace(/'/g, '"'));

/* ---------- helpers ---------- */
const FENCE = '```';
const code = (text, lang = 'json') => `${FENCE}${lang}\n${text}\n${FENCE}`;
const json = v => JSON.stringify(v, null, 1);
const list = arr => arr.map(v => '`' + v + '`').join(', ');
const table = (head, rows) => `| ${head.join(' | ')} |\n|${head.map(() => '---').join('|')}|\n` + rows.map(r => `| ${r.join(' | ')} |`).join('\n');
const uniq = a => [...new Set(a)];
const today = new Date().toISOString().slice(0, 10);

// Which phone apps cache a file offline (from their sw.js file lists), so a change knows which versions to raise.
const SW = { 'sheet/sw.js': 'sheet', 'codex/sw.js': 'Codex' };
function cachedBy(file) {
  return Object.entries(SW).filter(([sw]) => {
    const dir = path.dirname(sw), text = read(sw);
    return [...text.matchAll(/'([^']+)'/g)].some(m => path.posix.join(dir, m[1]) === file);
  }).map(([sw, app]) => ({ sw, app, version: (read(sw).match(/primordiumOffline\('([^']+)'/) || [])[1] }));
}
// The "Bringing it in" steps every handoff ends with.
function bringIn(files, steps) {
  const caches = uniq(files.flatMap(cachedBy).map(c => `\`${c.sw}\` (now \`${c.version}\`)`));
  return `## Bringing it in (for Claude Code)

${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
${steps.length + 1}. Run \`node tools/test.js\` from the repository root. Every suite must pass.
${steps.length + 2}. ${caches.length ? `Raise the version in ${caches.join(' and ')} so installed phones download the new data.` : 'No phone app caches these files, so no offline version needs raising.'}
${steps.length + 3}. Run \`node tools/export-handoffs.js\` so these handoff files match the new data, and give the Claude project the refreshed files.

Keep each file's format: a \`window.NAME = …;\` line holding JSON with one-space indentation, and the comment at the top. Never invent or reword rules: game text comes from the owner's guides.`;
}
const header = (title, intro, where) => `# ${title}

Exported ${today} from the Primordium Tools repository. ${intro}

${table(['Stored in', 'Read by'], where)}

**When you suggest changes, send only what is new or changed**, in the format under "What to send back". Do not resend everything.`;

const docs = {};

/* ==================== creatures ==================== */
{
  const families = uniq(NPCS.map(n => n.family)), byName = n => NPCS.find(x => x.name === n);
  docs['npcs.md'] = `${header('Primordium 2.0 creatures (NPCs)', `${NPCS.length} creatures in ${families.length} families.`, [
    ['`shared/npc-data.js` (`window.PRIMORDIUM_NPCS`)', 'GM tool: encounter picker, difficulty estimate, combat (tactics rolls, attacks, HP); Codex: Bestiary and tactics rolls'],
    ['`codex/codex-data.js` → `creatureFamilies`', 'Codex: each family\'s group and description in the Bestiary']])}

## One creature

${table(['Field', 'Required', 'What it holds'], [
    ['`name`', 'yes', 'Unique across all creatures. Never put numbers in a name; the GM tool numbers copies in combat ("Wolf 2").'],
    ['`family`', 'yes', 'An existing family (table below) or a new one. A new family also needs a family note (see "What to send back").'],
    ['`role`', 'yes', list(Core.ROLES)],
    ['`level`', 'yes', 'Whole number, 1 or more.'],
    ['`tactics`', 'yes', `${list(Core.TACTICS)}: the row of the D20 tactics table that picks its ability each turn. Elites and Bosses need at least Fair.`],
    ['`hp`', 'yes', 'Whole number, or `null` for a creature with no HP (then `specialHp` is required).'],
    ['`armor`', 'yes', 'Whole number (0 for none). Subtracted from each strike against it.'],
    ['`size`', 'yes', list(Core.SIZES)],
    ['`alignment`', 'yes', `As the NPC Guide writes it. In use: ${list(uniq(NPCS.map(n => n.alignment)))}.`],
    ['`stats`', 'yes', 'All six, in this order: `{ "STR": 0, "AGI": 0, "KNO": 0, "SPD": 0, "PER": 0, "SPE": 0 }`. Whole numbers.'],
    ['`xp`', 'yes', `Role multiplier × (20 + 6 × level), rounded to a whole number with halves rounded up (6.5 → 7, 9.5 → 10). Multipliers: ${Object.entries(Core.ROLE_XP).map(([r, m]) => r + ' ' + m).join(', ')}.`],
    ['`attributes`', 'yes', 'Passive traits as text, or `"None"`.'],
    ['`description`', 'yes', 'What sets it apart, or `"Standard"` for a family\'s plain version.'],
    ['`abilities`', 'unless humanoid', 'A list of abilities (below).'],
    ['`turnsPerPhase`', 'Bosses only', '`2`. Every Boss has it; no one else does.'],
    ['`humanoid`', 'humanoids only', '`true`: fights with player skills instead of fixed attacks; has `combatSkill` and no `abilities`.'],
    ['`combatSkill`', 'humanoids only', 'One text in exactly this pattern (the GM tool reads its parts): `"Combat skill: <skills>. Skill tier: Base Tier <n> (or <Path> Tier <n>). Damage stat: <n> (<Strength, Agility, or Knowledge>). Weapon tier: <n>. Uses that skill\'s abilities up to <tier>, of rarity up to <rarity> (its tactics), with <Tier 0 basic attack or Base Tier 3 upgraded basic attack>."` Magic schools may be shortened to Fire, Frost, Shock, Restoration, Alteration, Sensory, or Soul Rifting.'],
    ['`specialHp`', 'no-HP creatures only', 'The rule for destroying it. Repeat the same text in `attributes`.']])}

### One ability

${table(['Field', 'Required', 'What it holds'], [
    ['`name`', 'yes', 'Unique within this creature.'],
    ['`rarity`', 'yes', `${list(Core.RARITIES)}. Give it an ability at each rarity its tactics can roll: ${Core.TACTICS.map(t => t + ': ' + Core.reachableRarities(t).join('/')).join('; ')}.`],
    ['`text`', 'yes', 'The NPC Guide\'s wording. Strikes are always written "<n> Strike(s) <dice>D<sides>+<flat>.", for example "1 Strike D10." or "2 Strikes 2D12+9 to all entities within 3M. 2AP."'],
    ['`attack`', 'for strike damage', '`{ "strikes", "dice", "sides", "flat" }` matching the text exactly, plus only when they apply: `"ap": n` (text says "<n>AP"), `"area": true` (more than one target: all entities, within <n>M, up to <n> targets, an arc, a line), `"ignoreArmor": true`. Leave it out when there is no strike.'],
    ['`cooldown`', 'only if not the default', `Phases it waits after use. Defaults: ${Object.entries(Core.COOLDOWNS).map(([r, c]) => r + ' ' + Core.cooldownText(c)).join(', ')}; Basic to Uncommon none. A number, or \`"combat"\` for once per combat.`]])}

## Families

${table(['Family', 'Group', 'Count', 'Creatures'], families.map(f => [f, C.creatureFamilies[f]?.group || '(not set yet)', NPCS.filter(n => n.family === f).length, NPCS.filter(n => n.family === f).map(n => n.name).join(', ')]))}

Family notes (shown in the Codex):

${families.filter(f => C.creatureFamilies[f]).map(f => `- **${f}** (${C.creatureFamilies[f].group}): ${C.creatureFamilies[f].flavor}`).join('\n')}

## Examples

A plain creature:

${code(json(byName('Wolf')))}

Area, armor piercing, and a cooldown:

${code(json(byName('Shattered Crocodile')))}

A Boss:

${code(json(byName('Clockwork Titan')))}

A humanoid:

${code(json(byName('Military Captain')))}

No HP:

${code(json(byName('Green Slime')))}

## What to send back

${code(json({ add: [{ name: '…', family: '…', '...': 'every field above' }], change: [{ name: 'an existing creature\'s exact name', '...': 'only the fields that change' }],
  remove: ['an existing creature\'s exact name'], families: { Boars: { group: 'Beasts', flavor: 'One or two sentences from the NPC Guide.' } } }))}

Check first: \`add\` names are new and \`change\`/\`remove\` names exact; \`xp\` follows the formula; each \`attack\` matches its text; Bosses have \`turnsPerPhase: 2\`; humanoids have \`humanoid\` and \`combatSkill\` and no abilities.

${bringIn(['shared/npc-data.js', 'codex/codex-data.js'], [
    'Add each `add` entry to `shared/npc-data.js` beside its family (lowest level first); apply each `change` to the creature with that exact name; delete each `remove`.',
    'Add or update each `families` entry in `creatureFamilies` in `codex/codex-data.js` (`{ "group", "flavor" }`). The test fails if a family note names a family with no creatures.',
    'The GM tests check every creature\'s XP against the formula and every `attack` against its text, so fix any mismatch they report.'])}

## All current creatures

${code(json(NPCS))}
`;
}

/* ==================== skills ==================== */
{
  const named = perksNamedInCode();
  const what = {
    'Improved Tactics': 'promotes one Basic number to Common', 'Trained Tactics': 'promotes one Uncommon number to Rare', 'Seasoned Tactics': 'promotes a Common number to Uncommon and a Rare color to Epic',
    'Wild Card': 'adds the second joker, wild up to Legendary', 'Focused Training': 'promotes a Rare color to Epic', 'Specialist': 'promotes an Uncommon number to Rare',
    'Mastery': 'promotes two Epic cards to Legendary', 'Grand Strategy': 'joker to Mythic; reserve holds two', "Officer's Training": 'promotes a Common number to Uncommon', 'Veteran Command': 'promotes an Epic card to Legendary',
    'Quick Re-Evaluation': 'adds the Quick Re-Evaluation button', 'Suit Mastery': 'adds a suit choice and its rider', 'Foresight': 'shows the top card', 'Side Bet': 'adds a once-per-combat marker',
    'Three of a Kind': 'allows playing three cards two rarities up', 'Full Deck': 'all four riders; double when every card shares a suit', 'Stack the Deck': 'adds reordering the top 3',
    'Held in Reserve': 'adds a reserve slot, one swap per phase', 'Measured Breather': 'breather keeps 8 chosen from the top 12', 'Master Plan': 'once per day, +1 rarity', 'Lead by Example': 'adds the Lead by Example play',
    'Battle Plan': 'adds setting and calling a battle plan', 'Rally': 'adds the once-per-combat Rally play', 'Victory Plan': 'an ally\'s called plan counts one rarity higher', 'House Rules': 'jokers may count as Mythic',
    'Heavy Lifter': 'doubles Strength\'s share of the carry limit, +10', 'Trained Resilience': 'stacks need 3 instead of 4 to recover', 'Hardy': 'damaging stacks deal 1 less per die (shown on the stack)',
    'Shrug It Off': 'recovery removes 1 more damaging stack', 'Unyielding Flesh': 'damaging stacks cap at 5'
  };
  // One row per name (the deck reads some perks in two places).
  const skillOf = n => P.skills.find(s => [...Object.values(s.base), ...Object.values(s.paths).flatMap(Object.values)].flat().some(e => e.name === n))?.name || '?';
  const nameRows = uniq(named.flatMap(g => g.names)).map(n => [`**${n}**`, skillOf(n),
    uniq(named.filter(g => g.names.includes(n)).map(g => g.where.split(' (')[0])).join(', '), what[n] || '']);
  docs['skills.md'] = `${header('Primordium 2.0 skills: every tier, ability, and perk', `${P.skills.length} skills.`, [
    ['`shared/primordium-data.js` → `skills` (`window.PRIMORDIUM_DATA`)', 'Sheet: Skills tab, abilities and perks a character gains, stat and HP bonuses; GM tool: Reference tab, humanoid NPC attacks; Codex: Skills pages and search'],
    ['`codex/codex-data.js` → `skillNotes`', 'Codex: each skill\'s one-line summary and damage stat letter in the skill list'],
    ['`shared/tactics-deck.js`', 'The Tactics skill\'s perks change the tactical deck (sheet and Codex)']])}

## One skill

${table(['Field', 'What it holds'], [
    ['`name`', 'Unique. The GM tool matches humanoid combat skills by this name.'],
    ['`group`', `${list(uniq(P.skills.map(s => s.group)))}. Physical skills are weapons (and Shield); Mental are magic schools.`],
    ['`intro`', 'One sentence describing the skill.'],
    ['`base`', '`{ "0": [...], "1": [...], "2": [...], "3": [...], "4": [...] }`: Tier 0 (free with the skill) and Base Tiers 1–4. All five keys, every skill.'],
    ['`paths`', '`{ "<Path name>": { "1": [...], "2": [...], "3": [...], "4": [...] } }`: two to four paths, each with Path Tiers 1–4. A character picks one path after Base Tier 4.']])}

### One entry (ability or perk)

${table(['Field', 'What it holds'], [
    ['`kind`', '`"ability"` or `"perk"`.'],
    ['`name`', 'Unique within the skill. Some names are read by the code (see below); renaming those turns their rule off.'],
    ['`desc`', 'The flavor description.'],
    ['`usage`', 'What it does, in the Skill Guide\'s wording. Dice like "2D6+3" become tappable rolls in the Codex; the GM tool reads strike dice from humanoid abilities\' usage ("Strike twice with D6").'],
    ['`type`', `Abilities only: ${list(['Standard', 'Quick', 'Defensive'])}.`],
    ['`rarity`', `Abilities only: ${list(Core.RARITIES)}.`],
    ['`effects`', 'Optional. Changes the sheet applies automatically when the tier is gained; the text should still say it. Each one of: `{ "stat": "STR", "add": 1 }`, `{ "maxhp": 10 }`, `{ "armor": 1 }`, `{ "maxhpPerStat": "STR", "per": 5 }` (HP per point of a stat).']])}

## Names the code depends on

These are looked up by name. Renaming or removing one silently turns its rule off (\`node tools/test-data.js\` catches it). If a perk is renamed in the guide, the code must change with it.

${table(['Name', 'Skill', 'Read by', 'What the code does'], nameRows)}

The tactical deck's starting cards and riders are in the rule tables handoff (\`rule-tables.md\`).

## What to send back

${code(json({ skills: { add: [{ name: '…', group: '…', intro: '…', base: { 0: [], 1: [], 2: [], 3: [], 4: [] }, paths: {} }],
  change: [{ skill: 'Sword', where: 'base 2 (or a path name and tier, e.g. "Duelist 3")', entry: 'the entry\'s exact name, or new', set: { usage: '…', rarity: '…' } }] },
  skillNotes: { 'New Skill': { stat: 'A, S, or K (or leave out)', summary: 'One line.' } } }))}

Check first: every skill has all five base tiers and four tiers per path; abilities have a type and rarity; perks have neither; names the code reads are spelled exactly.

${bringIn(['shared/primordium-data.js', 'codex/codex-data.js'], [
    'Apply each change in `shared/primordium-data.js` → `skills` (a new skill goes in its group\'s place in the list).',
    'A new skill also needs an entry in `skillNotes` in `codex/codex-data.js` (the test checks every skill has one). A new weapon or magic skill is offered to humanoid NPCs automatically.',
    'If a name in "Names the code depends on" changed, update the code that reads it (`shared/tactics-deck.js` or `sheet/js/rules.js`).'])}

## All current skills

${P.skills.map(s => `### ${s.name} (${s.group})\n\n${code(json({ ...s, codexNote: C.skillNotes[s.name] }))}`).join('\n\n')}
`;
}

/* ==================== races and traits ==================== */
{
  docs['races-and-traits.md'] = `${header('Primordium 2.0 races and background traits', `${Object.keys(P.races).length} races and ${P.traits.length} traits.`, [
    ['`shared/primordium-data.js` → `races`, `traits`', 'Sheet: race choice (starting HP and stats), traits (with automatic stat and HP changes), max HP and armor; GM tool: Reference, importing sheet characters; Codex: Races and Background traits'],
    ['`codex/codex-data.js` → `raceLore`, `traitsIntro`, `traitGroupNames`', 'Codex: each race\'s country, deity, appearance, and description; the traits page intro and group names']])}

## One race (keyed by its name)

${table(['Field', 'What it holds'], [
    ['`hp`', 'Starting HP (whole number).'],
    ['`stats`', `Six starting stats as a list, always in this order: ${Core.STATS.map(k => Core.STAT_NAMES[k]).join(', ')}.`],
    ['`traits`', 'The racial specials as text lines (shown on the sheet and in the Codex).'],
    ['`armor`', 'Optional: natural armor (added to the sheet\'s armor total).'],
    ['`resist`', 'Optional: resistances as text, e.g. `["Frost 25%"]`.'],
    ['`freeMagicPoint`', 'Optional `true`: the sheet adds a skill point for a magic skill.'],
    ['`choice`', 'Optional `true`: the race picks stat bonuses. **Only Trin is handled**: the sheet shows its three +1 choices and `shared/character-rules.js` applies them, both by the name "Trin". A new race with a choice needs code.']])}

Codex lore for each race, in \`raceLore\` (keyed by the same name): ${list(Object.keys(Object.values(C.raceLore)[0]))}. Every race needs one (the test checks).

## One trait

${table(['Field', 'What it holds'], [
    ['`name`', 'Unique.'],
    ['`category`', `${list(Object.keys(C.traitGroupNames))} (the Codex shows them as ${Object.values(C.traitGroupNames).join(', ')}).`],
    ['`cost`', 'Whole number. Negative costs grant points. A character spends 2 at creation.'],
    ['`effect`', 'Text. **Exactly** "+1 Strength" (any stat, any signed number) or "+10 HP" / "-10 HP" is applied to the sheet automatically; any other wording is shown but not applied.']])}

## What to send back

${code(json({ races: { add: { 'New Race': { hp: 35, stats: [0, 0, 0, 0, 0, 0], traits: ['…'] } }, change: { Kled: { hp: 55 } } },
  raceLore: { 'New Race': { id: 'new-race', common: '…', roles: '…', country: '…', population: '…', deity: '…', appearance: { Skin: '…', Height: '…', Weight: '…' }, desc: '…' } },
  traits: { add: [{ name: '…', category: 'Physical', cost: 1, effect: '+1 Agility' }], change: [{ name: 'exact name', effect: '…' }], remove: ['exact name'] } }))}

${bringIn(['shared/primordium-data.js', 'codex/codex-data.js'], [
    'Apply race and trait changes in `shared/primordium-data.js` → `races` / `traits`.',
    'Add or update lore in `raceLore` in `codex/codex-data.js` for every new race.',
    'A race with stat choices other than Trin\'s needs code in `shared/character-rules.js` and `sheet/js/views.js`.'])}

## All current races

${code(json(Object.fromEntries(Object.entries(P.races).map(([n, r]) => [n, { ...r, codexLore: C.raceLore[n] }]))))}

## All current traits

Intro (Codex): ${C.traitsIntro}

${code(json(P.traits))}
`;
}

/* ==================== rule tables ==================== */
{
  const T = Core.TACTICS_TABLE;
  const range = (m, r) => !m[r] ? '' : m[r][0] === m[r][1] ? m[r][0] : m[r][0] + '–' + m[r][1];
  const deckRows = DK.LEVELS.map(l => { const b = DK.build(l); return [DK.levelLabel(l), ...Core.RARITIES.map(r => b.counts[r] || '')]; });
  const b0 = DK.build({ base: 0 });
  docs['rule-tables.md'] = `${header('Primordium 2.0 rule tables', 'The numbers and lists every app shares, the tactical deck\'s rules, and the sheet\'s own lists.', [
    ['`shared/core.js` (`window.PrimordiumCore`)', 'All three apps and the tests: rarities, stats, the D20 tactics table, cooldowns, roles and XP, sizes, stacks and recovery, movement, materials'],
    ['`shared/tactics-deck.js`', 'Sheet and Codex: the deck\'s starting cards, Tactics promotions, suit riders, and every deck mechanic'],
    ['`sheet/data.js` (`window.SHEET_LISTS`)', 'Sheet only: resources, conditions, weapon types, armor slots'],
    ['`gm/js/combat-engine.js` → `CONDITIONS`', 'GM tool only: conditions the GM can mark on a creature']])}

These are code, not JSON: send changes as words and values, and Claude Code edits the code. The same rules also appear as text in places people read (listed under each table); those must say the same thing.

## Rarities

${list(Core.RARITIES)}, lowest to highest. Shown in this order everywhere; colors are in \`shared/theme.css\`.

## The D20 tactics table

Each tactics level, the D20 roll that picks each rarity:

${table(['Tactics', ...Core.RARITIES], Core.TACTICS.map(t => [t, ...Core.RARITIES.map(r => range(T[t], r))]))}

Every row must cover 1–20 with no gaps (the test checks). Also written in: \`gm/docs/rules.md\` ("Enemy ability selection"), shown in the GM tool's Reference tab.

## Cooldowns

${table(['Rarity', 'Cooldown after use'], Object.entries(Core.COOLDOWNS).map(([r, c]) => [r, Core.cooldownText(c)]))}

Basic to Uncommon: none. Also written in: \`gm/docs/rules.md\`. (The Codex's note is generated from this table.)

## Roles and XP

${table(['Role', 'XP multiplier'], Object.entries(Core.ROLE_XP).map(([r, m]) => [r, m]))}

Enemy XP = multiplier × (20 + 6 × level), rounded with halves up (6.5 → 7). XP to the next player level: 100 at level 1, then 25 more each level. Also in: \`gm/data/scaling.json\` → \`roles.*.xpMultiplier\` (the test fails if they differ).

## Sizes

${list(Core.SIZES)}. Their effects are Codex text (\`rules-text.md\`, the Sizes table); their grid footprints are in \`gm/js/combat-engine.js\` → \`FOOTPRINT\`.

## Stacks and recovery

- Stacks: ${list(Core.STACKS)}. Damaging (1D4 each at the end of the phase): ${list(Core.DAMAGING_STACKS)}.
- Frozen: Chilled at 3 stacks, or at stacks equal to the entity's level if that is lower (\`chilledAt\` in \`shared/core.js\`); frozen solid at more stacks than its level.
- Recovery: a D4 against ${Core.RECOVERY_START} after a new stack, dropping by 1 (the GM tool each phase, the sheet each roll; the owner accepts both) to a lowest of ${Core.RECOVERY_FLOOR}. A 1 never recovers.
- A success removes, for damaging stacks, 3 or half (whichever is more); for others, half. Halves round up.
- Also written in: the Codex's "Stacks and Conditions" rules (\`rules-text.md\`) and \`gm/docs/rules.md\`.

## Movement

5 + Speed meters, at least 2M.

## Materials

${table(['Tier', 'Material', 'Notes'], Core.MATERIALS.map(([t, n, d]) => [t, n, d]))}

Shown in the Codex's Materials table; picking a material on the sheet fills in an item's tier.

## The tactical deck

Starting cards (Game Guide default): ${Core.RARITIES.filter(r => b0.counts[r]).map(r => `${r} ${b0.counts[r]} (${b0.mapping[r]})`).join('; ')}. In \`shared/tactics-deck.js\` → \`defaultRarity()\`. Also written in: \`codex/codex-data.js\` → \`tables.deck\` (counts, wording, and each rarity's card pip).

Cards at every Tactics level (the test checks these against each promotion perk):

${table(['Level', ...Core.RARITIES], deckRows)}

Pairs: two cards of one rarity play as one card a rarity higher, and a paired card may itself be paired (two Epics make a Legendary, and that with a Legendary or the joker makes a Mythic). In \`pairUp()\` in \`shared/tactics-deck.js\`; Three of a Kind (Gambler) is separate. Also written in: the Codex's "The Tactical Deck" rules → "Pairs", and \`tables.deck\` → Mythic.

Promotions (which perk moves which cards) are in \`PROMOS\` in \`shared/tactics-deck.js\`, keyed by perk name; see \`skills.md\` for every name the deck reads.

Suit riders (\`RIDERS\`): ${Object.values(DK.RIDERS).join(' ')} Also written in: the Codex's "The Tactical Deck" rules → "Suit riders".

## Sheet lists

${table(['List', 'Values'], Object.entries(LISTS).map(([k, v]) => [k, v.join(', ')]))}

## GM conditions

${list(GM_CONDITIONS)} (\`CONDITIONS\` in \`gm/js/combat-engine.js\`). Calmed, Enraged, and Terrified follow from Calm, Anger, and Fear stacks. A Boss may end one condition, or act despite being frozen solid or paralyzed, at the start of each of its turns (Boss Resolve, \`gm/docs/rules.md\`).

## What to send back

Describe each change with the table it belongs to and the exact new values, and every place under "Also written in" that must change to match. For example:

${code(json({ table: 'Cooldowns', change: { Rare: 2 }, alsoUpdate: ['gm/docs/rules.md: "Cooldowns after use: Rare 2 phases…"'] }))}

${bringIn(['shared/core.js', 'shared/tactics-deck.js', 'sheet/data.js', 'codex/codex-data.js'], [
    'Change the value in its file (`shared/core.js`, `shared/tactics-deck.js`, `sheet/data.js`, or `gm/js/combat-engine.js`).',
    'Update every place listed under "Also written in". After editing `gm/docs/rules.md`, run `node gm/tools/build-data.js`.',
    'A change to the tactics table, cooldowns, XP, or recovery also changes the GM tool\'s worked examples; update `gm/tools/test-rules.js` or `test-combat.js` only if the owner confirms the new numbers.'])}
`;
}

/* ==================== Codex rules text ==================== */
{
  const T = C.tables;
  docs['rules-text.md'] = `${header('Primordium 2.0 rules text and tables (the Codex)', `${C.rules.length} rules sections and ${Object.keys(T).length} tables, transcribed from Game Guide 2.0 and NPC Guide 2.0.`, [
    ['`codex/codex-data.js` → `rules`', 'Codex: the Rules tab (Character, Combat, World) and search'],
    ['`codex/codex-data.js` → `tables`', 'Codex: the Tables screen, the deck pips, and the Dice tab']])}

## One rules section

${table(['Field', 'What it holds'], [
    ['`id`', 'Unique short id (letters and dashes); search links to it.'],
    ['`title`', 'The section heading.'],
    ['`group`', `${list(uniq(C.rules.map(r => r.group)))}: which part of the Rules tab it is under.`],
    ['`entries`', 'A list of `["Term", "Text"]` pairs. Dice in the text ("2D6") become tappable rolls.']])}

## The tables

${table(['Table', 'Each row'], [
    ['`deck`', '`{ "rarity", "cards", "mapping", "pip" }`: the default card for each rarity (must match the deck\'s starting cards in `rule-tables.md`); `pip` is the short label on the rarity chips.'],
    ['`sizes`', '`["Size", "Space", "Effect"]`'],
    ['`wealth`', '`{ "roll" (D4), "marks", "gear" }`: starting wealth'],
    ['`outOfCombatXP`', '`["Event", "Award", "Examples"]`'],
    ['`consumables`', '`["Item", "Effect", marks]`'],
    ['`enchantments`', '`["Name", "Slot", "Active or Passive", "Effect"]`'],
    ['`prices`', '`{ "columns": ["Item", "T0", … "T7"], "rows": [["Item", marks at each tier, …]], "note" }`: weapon, armor, and ammunition prices by material tier'],
    ['`condition`', '`{ "columns": ["Item", "Condition"], "rows": [["Item", "rule"]] }`: starting Condition by item type and material']])}

Rarities, the tactics table, cooldowns, XP, and materials are not here: they are in \`shared/core.js\` (\`rule-tables.md\`).

## What to send back

${code(json({ rules: { add: [{ id: 'new-section', title: '…', group: 'Combat', entries: [['Term', 'Text']] }], change: [{ id: 'stacks', term: 'Recovery', text: 'new text' }] },
  tables: { consumables: { add: [['New Potion', 'Heal 3D6.', 40]] } } }))}

${bringIn(['codex/codex-data.js'], [
    'Apply the change in `codex/codex-data.js` (keep each section\'s `id` stable; search links use it).',
    'If the text describes a rule the apps calculate (stacks, recovery, cooldowns, the deck), the matching value in `shared/core.js` or `shared/tactics-deck.js` must change too (`rule-tables.md`).'])}

## All current rules sections

${code(json(C.rules))}

## All current tables

${code(json(T))}
`;
}

/* ==================== GM rulings and scaling ==================== */
{
  docs['gm-rules-and-scaling.md'] = `${header('GM tool: combat rules, owner rulings, and the scaling workbook', 'What the GM tool applies in combat and uses to budget encounters.', [
    ['`gm/docs/rules.md`', 'GM tool: the combat rules it applies, including the owner\'s rulings; shown in its Reference tab'],
    ['`gm/docs/scaling.md`', 'GM tool: how difficulty and enemy budgets are worked out; shown in its Reference tab'],
    ['`gm/data/scaling.json`', 'GM tool: player benchmarks per power step, role and armor budgets, difficulty bands (encounter difficulty and the NPC builder\'s suggestions)']])}

The GM tool opens from a file, so these are packaged into \`gm/data/docs-data.js\` and \`gm/data/scaling-data.js\` by \`node gm/tools/build-data.js\`. Never edit those two generated files.

## The scaling workbook (\`scaling.json\`)

${table(['Key', 'What it holds'], [
    ['`steps`', 'Power steps 0–12: the reference player at each (damage stat, item tier, reference armor, damage per turn, HP, armor).'],
    ['`roles`', 'Minion to Boss: player turns to kill, turns to drop a player, XP multiplier (must match `shared/core.js`), turns per phase, minimum tactics.'],
    ['`armorClasses`', 'None to Heavy: armor and HP multipliers.'],
    ['`tacticsMultipliers`, `rarityMultipliers`, `areaPerTarget`', 'How tactics and rarity scale an ability\'s damage budget; area attacks deal 60% per target.'],
    ['`budgetTable`', 'HP and damage per turn for each role at each step.'],
    ['`encounterBudgets`', 'Game Master\'s Guide budgets: each role\'s value in Standard Encounters (SE) and the SE per player for Easy, Standard, Hard, and Deadly. The Encounter tab shows a fight\'s SE per player.'],
    ['`difficultyBands`', 'Share of party HP lost: Easy, Standard, Hard; above Hard is Deadly.']])}

Its numbers come from the owner's Enemy Budget workbook. \`gm/tools/test-rules.js\` checks the GM tool's math against the worked examples in \`scaling.md\`; change those examples only when the workbook changes.

## What to send back

For a ruling: the new or changed line for \`rules.md\` → "GM rulings for the tool", with the date. For the workbook: the key path and new value, e.g. \`roles.Elite.playerTurnsToKill: 6\`.

${bringIn([], [
    'Edit `gm/docs/rules.md`, `gm/docs/scaling.md`, or `gm/data/scaling.json`.',
    'Run `node gm/tools/build-data.js` to repackage them for the app.',
    'If a ruling changes how combat resolves, update `gm/js/combat-engine.js` (and its checks in `gm/tools/test-combat.js`) to match.'])}

## Current \`gm/docs/rules.md\`

${code(read('gm/docs/rules.md'), 'markdown')}

## Current \`gm/data/scaling.json\`

${code(json(S))}
`;
}

/* ==================== index ==================== */
const sizes = Object.fromEntries(Object.entries(docs).map(([f, t]) => [f, Math.round(Buffer.byteLength(t) / 1024)]));
docs['README.md'] = `# Primordium Tools: data handoffs

Exported ${today}. One file per kind of stored data, for a Claude project: each explains where the data lives, which apps read it, its exact format and rules, the names the code depends on, the current contents, what to send back, and how Claude Code brings a change in.

${table(['File', 'Covers', 'Size'], [
  ['`npcs.md`', 'Creatures (NPCs) and their families', sizes['npcs.md'] + ' KB'],
  ['`skills.md`', 'Skills: every tier, ability, perk, and automatic effect; the perk names the code reads', sizes['skills.md'] + ' KB'],
  ['`races-and-traits.md`', 'Races (stats, specials, lore) and background traits', sizes['races-and-traits.md'] + ' KB'],
  ['`rule-tables.md`', 'Shared numbers: rarities, the D20 tactics table, cooldowns, XP, stacks, movement, materials; the tactical deck; the sheet\'s lists', sizes['rule-tables.md'] + ' KB'],
  ['`rules-text.md`', 'The Codex\'s rules sections and tables (sizes, wealth, consumables, enchantments, …)', sizes['rules-text.md'] + ' KB'],
  ['`gm-rules-and-scaling.md`', 'The GM tool\'s combat rules, the owner\'s rulings, and the scaling workbook', sizes['gm-rules-and-scaling.md'] + ' KB']])}

## How a change flows

1. **In the Claude project:** describe the change from the guides (a new creature, a reworded ability, a new rule). Claude answers in the "What to send back" format of the matching file.
2. **In Claude Code:** paste that answer. Claude Code follows the file's "Bringing it in" steps, runs \`node tools/test.js\`, and raises the phone apps' offline versions.
3. **Refresh the project:** Claude Code runs \`node tools/export-handoffs.js\`; replace these files in the project with the new ones.

## Rules for every change

- Game text comes from the owner's guides (Game Guide 2.0, Skill Guide 2.0, NPC Guide 2.0). Don't invent or reword rules; when one is unclear, ask.
- Each fact is stored once. When a file says a rule is "also written in" somewhere, that place changes too.
- Names the code reads (Tactics perks, a few sheet perks, Trin) must stay spelled exactly; \`skills.md\` lists them.
- \`node tools/test.js\` must pass after every change. It checks the rule tables, every creature's XP and attacks, the deck at every Tactics level, and that the data files agree with each other.
`;

const dir = path.join(root, 'exports', 'handoff');
fs.mkdirSync(dir, { recursive: true });
for (const [f, text] of Object.entries(docs)) fs.writeFileSync(path.join(dir, f), text);
console.log('Wrote exports/handoff/: ' + Object.keys(docs).map(f => `${f} (${Math.round(Buffer.byteLength(docs[f]) / 1024)} KB)`).join(', '));
