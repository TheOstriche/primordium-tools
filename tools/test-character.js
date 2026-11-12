// Checks shared/character-rules.js: what a character's skills grant, and the stats, maximum HP, and armor that
// follow from a sheet. The sheet shows these and the GM tool imports with the same code, so both rely on them.
// Run: node tools/test-character.js   (or node tools/test.js for every test)
const fs = require('fs'), path = require('path');
global.window = globalThis;
for (const f of ['core.js', 'primordium-data.js', 'character-rules.js']) eval(fs.readFileSync(path.join(__dirname, '..', 'shared', f), 'utf8'));
const C = window.PrimordiumCharacter, D = window.PRIMORDIUM_DATA;
let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };
const sheet = extra => Object.assign({ level: 1, hpBase: 40, hpOther: 0, armorOther: 0, stats: { STR: 1, AGI: 0, KNO: 0, SPD: 0, PER: 0, SPE: 0 }, skills: {}, traits: [], items: [] }, extra);

// What skills grant: nothing untrained; Tier 0 arrives with Base Tier 1; a path needs its name and tier.
const sword = D.skills.find(s => s.name === 'Sword'), path0 = Object.keys(sword.paths)[0];
const count = (o, upTo) => Object.entries(o).filter(([t]) => +t <= upTo).reduce((a, [, l]) => a + l.length, 0);
check(C.granted(sheet()).length === 0 && C.granted(sheet({ skills: { Sword: { base: 0 } } })).length === 0, 'an untrained skill grants nothing');
check(C.granted(sheet({ skills: { Sword: { base: 2 } } })).length === count(sword.base, 2), 'Base Tier 2 grants Tier 0, 1, and 2');
check(C.granted(sheet({ skills: { Sword: { base: 4, path: path0, ptier: 2 } } })).length === count(sword.base, 4) + count(sword.paths[path0], 2), 'a path adds its tiers on top of the base');
check(C.granted(sheet({ skills: { 'No Such Skill': { base: 3 }, Sword: { base: 4, path: 'No Such Path', ptier: 3 } } })).length === count(sword.base, 4), 'a skill or path that no longer exists is ignored');

// Maximum HP: base + 25 at every 5th level + other + skills and traits.
check(C.core(sheet({ level: 4 })).maxhp === 40 && C.core(sheet({ level: 5 })).maxhp === 65 && C.core(sheet({ level: 12, hpOther: 3 })).maxhp === 93, 'max HP adds 25 at every 5th level');
check(C.core(sheet({ traits: [{ effect: '+5 HP' }, { effect: '+1 Strength' }, { effect: 'Something else' }] })).maxhp === 45, 'a "+5 HP" trait raises max HP');
check(C.core(sheet({ traits: [{ effect: '+1 Strength' }, { effect: '-1 Speed' }] })).st.STR === 2 && C.core(sheet({ traits: [{ effect: '-1 Speed' }] })).st.SPD === -1, 'stat traits change the stat');

// Trin: +1 to a chosen damage stat and two more choices (a stat or +5 HP).
const trin = C.core(sheet({ race: 'Trin', trin: { dmg: 'AGI', a: 'HP', b: 'PER' } }));
check(trin.st.AGI === 1 && trin.st.PER === 1 && trin.maxhp === 45, 'Trin choices: +1 Agility, +1 Perception, +5 HP');

// Armor: natural (race and skills) + worn armor (not shields, not unequipped items) + other.
const items = [{ kind: 'armor', slot: 'Chest', armor: 3, equipped: true }, { kind: 'armor', slot: 'Shield', armor: 9, equipped: true },
  { kind: 'armor', slot: 'Head / Neck', armor: 2, equipped: false }, { kind: 'weapon', armor: 5, equipped: true }];
const armored = C.core(sheet({ items, armorOther: 1 }));
check(armored.worn === 3 && armored.armor === armored.natural + 4, 'armor counts equipped armor, not shields, weapons, or the pack');
const natural = Object.entries(D.races).find(([, r]) => r.armor);
check(!natural || C.core(sheet({ race: natural[0] })).natural === natural[1].armor, `a race's natural armor counts${natural ? ' (' + natural[0] + ')' : ''}`);

// Every effect in the skill data is one core() applies, so a tier can never silently grant nothing.
const granted = C.granted(sheet({ skills: Object.fromEntries(D.skills.map(s => [s.name, { base: 4 }])) })), withFx = granted.filter(i => (i.effects || []).length);
check(withFx.length > 0 && withFx.every(i => i.effects.every(f => f.stat || f.maxhp || f.armor || f.maxhpPerStat)), `${withFx.length} base-tier perks with automatic effects are all understood`);

// A sheet saved by an old version, or a damaged one, still adds up.
check(Number.isFinite(C.core({}).maxhp) && C.core({ stats: null, items: null, traits: null }).armor === 0, 'an empty or damaged sheet does not break the totals');

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
