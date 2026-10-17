// Checks js/combat-engine.js against docs/rules.md using scripted dice.
// Run:  node tools/test-combat.js
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const S = JSON.parse(fs.readFileSync(path.join(root, 'data', 'scaling.json'), 'utf8'));
const Rules = require(path.join(root, 'js', 'rules.js'))(S);
const window = {};
eval(fs.readFileSync(path.join(root, '..', 'shared', 'npc-data.js'), 'utf8'));
const NPCS = window.PRIMORDIUM_NPCS;
const find = name => NPCS.find(n => n.name === name);

// Scripted dice: dice(sides, ...faces) queues face values for dice of that size.
// When the queue is empty, dice roll their highest face.
let queue = [];
let sidesNow = 4;
const random = () => ((queue.length ? queue.shift() : sidesNow) - 1) / sidesNow + 1e-9;
const C = require(path.join(root, 'js', 'combat-engine.js'))(Rules, find, random);
function dice(sides, ...faces) { sidesNow = sides; queue = faces; }

let failed = 0;
function eq(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log((ok ? 'ok   ' : 'FAIL ') + label + (ok ? '' : ': got ' + JSON.stringify(actual) + ', expected ' + JSON.stringify(expected)));
}

const players = [
  { id: 'p1', name: 'Kaela', level: 5, hp: 60, armor: 3, stats: { STR: 3, AGI: 0, KNO: 0, SPD: 1, PER: 2, SPE: 0 } },
  { id: 'p2', name: 'Bram', level: 5, hp: 60, armor: 3, stats: { STR: 1, AGI: 2, KNO: 1, SPD: -4, PER: 3, SPE: 0 } }
];
const enc = { id: 'e1', name: 'Test', partyIds: ['p1', 'p2'], enemies: [{ npcName: 'Wolf', count: 2 }, { npcName: 'Clockwork Titan', count: 1 }] };

// --- Building and initiative ---
const combat = C.fromEncounter(enc, players);
eq('combatants built', combat.combatants.map(c => c.name), ['Kaela', 'Bram', 'Wolf 1', 'Wolf 2', 'Clockwork Titan']);
const wolfInit = 5 + find('Wolf').stats.PER;           // 8
const [kaela, bram, wolf1, wolf2, titan] = combat.combatants;
kaela.init = wolfInit;                                  // tie with the wolves
bram.init = wolfInit;                                   // tie, but higher Perception
C.begin(combat, null);
const names = combat.order.map(e => C.get(combat, e.cid).name + (e.second ? ' (2nd)' : ''));
eq('wolf initiative is 5 + PER', wolf1.init, wolfInit);
const tieBlock = names.filter(n => ['Kaela', 'Bram', 'Wolf 1', 'Wolf 2'].includes(n));
eq('ties: players first, higher PER first', tieBlock, ['Bram', 'Kaela', 'Wolf 1', 'Wolf 2']);
eq('boss second turn at the end', names[names.length - 1], 'Clockwork Titan (2nd)');
eq('phase 1, first turn active', [combat.phase, combat.turn], [1, 0]);

// --- Movement ---
eq('movement 5 + Speed', C.movement(kaela), 6);
eq('movement minimum 2', C.movement(bram), 2);
eq('diagonals cost 1M', C.distance(0, 0, 3, 2), 3);

// --- Damage ---
eq('armor per strike, AP', C.computeDamage({ armor: 3 }, { strikes: [5, 2], ap: 1 }).total, 3 + 0);
eq('ignore armor', C.computeDamage({ armor: 3 }, { strikes: [5, 2], ignoreArmor: true }).total, 7);
eq('failed dodge x1.5 rounds down', C.computeDamage({ armor: 0 }, { strikes: [7], failedDodge: true }).total, 10);
eq('resist capped at 75%', C.computeDamage({ armor: 0 }, { strikes: [20], resist: 90 }).total, 5);
eq('block subtracts', C.computeDamage({ armor: 0 }, { strikes: [9], block: 4 }).total, 5);

// --- Downed and death clock ---
C.hurt(combat, kaela, 60, true);
eq('player downed at 0 HP starts a 3-phase clock', [kaela.hp, kaela.deathClock], [0, 3]);
C.hurt(combat, kaela, 5, true);
eq('hit while downed removes a phase', kaela.deathClock, 2);
C.heal(combat, kaela, 10);
eq('healing above 0 clears the clock', [kaela.hp, kaela.deathClock], [5, null]);
C.hurt(combat, wolf1, 999, true);
eq('enemy at 0 HP is defeated', wolf1.dead, true);

// --- Stacks and recovery ---
C.addStacks(bram, 'Bleed', 5);
dice(4, 4);
let r = C.recover(bram, 'Bleed');
eq('recovery on a 4 vs target 4: damaging loses max(3, half up)', [r.success, r.lost, r.left], [true, 3, 2]);
C.addStacks(bram, 'Fear', 5);
dice(4, 1);
r = C.recover(bram, 'Fear');
eq('a 1 never recovers', r.success, false);
C.addStacks(bram, 'Fear', 0);
bram.stacks.Fear.target = 2;
dice(4, 2);
r = C.recover(bram, 'Fear');
eq('other stacks lose half, rounded up (5 -> 2)', [r.success, r.lost, r.left], [true, 3, 2]);

// --- End of phase ---
bram.stacks = {};
C.addStacks(bram, 'Poison', 2);
bram.effects = [{ text: 'Shield wall', phases: 1 }];
const hpBefore = bram.hp;
dice(4, 3, 2, 4, 4, 4, 4, 4, 4, 4, 4);
combat.turn = combat.order.length;
const lines = C.endPhase(combat);
eq('stack damage 2D4 ignores armor', hpBefore - bram.hp, 5);
eq('recovery target drops by 1 (min 2)', bram.stacks.Poison.target, 3);
eq('effect with 1 phase left expires', bram.effects.length, 0);
eq('phase advances', combat.phase, 2);
eq('end-of-phase report has lines', lines.length >= 2, true);

// --- Cooldowns and ability choice ---
const tnpc = find('Clockwork Titan');
const rare = tnpc.abilities.find(a => a.rarity === 'Rare' || a.cooldown);
if (rare) {
  // Used in phase P with cooldown N: unavailable for the next N phases, ready in phase P + N + 1.
  const usedIn = combat.phase;
  const cd = C.cooldownOf(rare);
  C.markUsed(combat, titan, rare);
  combat.phase = usedIn + cd;
  eq('cooldown ' + cd + ': still waiting in phase P + ' + cd, C.isReady(combat, titan, rare), false);
  combat.phase = usedIn + cd + 1;
  eq('cooldown ' + cd + ': ready in phase P + ' + (cd + 1), C.isReady(combat, titan, rare), true);
  combat.phase = usedIn;
}
eq('Mythic is once per combat', C.cooldownOf({ rarity: 'Mythic' }), 'combat');
// Basic-tactics wolf always picks Basic.
const w = C.chooseAbility(combat, wolf2, find('Wolf'), 17);
eq('basic tactics picks a Basic ability', w.ability && w.ability.rarity, 'Basic');
wolf2.conditions.push('Disoriented');
eq('disoriented Basic-tactics enemy can not use abilities', C.chooseAbility(combat, wolf2, find('Wolf'), 5).ability, null);
// Drop a rarity when the rolled one is unavailable.
const goodNpc = NPCS.find(n => n.tactics === 'Good' && !n.humanoid && !(n.abilities || []).some(a => a.rarity === 'Rare'));
if (goodNpc) {
  const gc = C.fromEncounter({ id: 'x', name: 'x', partyIds: [], enemies: [{ npcName: goodNpc.name, count: 1 }] }, []).combatants[0];
  const pick = C.chooseAbility(combat, gc, goodNpc, 20);
  eq('no Rare ability: drops below Rare (' + goodNpc.name + ')', pick.ability && pick.ability.rarity !== 'Rare', true);
}

// --- Attack rolls ---
dice(6, 1, 1);
eq('strike fails only when every die is 1', C.rollAttack({ strikes: 1, dice: 2, sides: 6, flat: 2 }).strikes[0].value, 0);
dice(6, 1, 3);
eq('strike with one 1 still hits', C.rollAttack({ strikes: 1, dice: 2, sides: 6, flat: 2 }).strikes[0].value, 6);

// --- Surprise phase ---
const c2 = C.fromEncounter(enc, players);
c2.combatants[0].init = 3; c2.combatants[1].init = 2;
C.begin(c2, 'enemy');
eq('surprise: first actor is an enemy', C.get(c2, C.activeEntry(c2).cid).kind, 'enemy');
while (C.nextTurn(c2) !== 'phase-end') eq('surprise: only enemies act', C.get(c2, C.activeEntry(c2).cid).kind, 'enemy');
C.endPhase(c2);
eq('after surprise, phase 1 begins with everyone', [c2.phase, c2.surprise], [1, null]);

// --- Allies (friendly NPCs) ---
const enc3 = { id: 'e3', name: 'Allies', partyIds: ['p1'], enemies: [{ npcName: 'Wolf', count: 1 }], allies: [{ npcName: 'Wolf', count: 1 }] };
const c3 = C.fromEncounter(enc3, players);
const [k3, ally3, foe3] = c3.combatants;
eq('ally built with its own kind', [ally3.kind, foe3.kind], ['ally', 'enemy']);
eq('ally initiative is 5 + Perception', C.initiativeOf(ally3), wolfInit);
eq('sides: player and ally together, enemy apart', [C.side(k3), C.side(ally3), C.side(foe3)], ['player', 'player', 'enemy']);
k3.init = wolfInit;
C.buildOrder(c3);
eq('ties: player, then ally, then enemy', c3.order.map(e => C.get(c3, e.cid).kind), ['player', 'ally', 'enemy']);
C.hurt(c3, ally3, 999, true);
eq('an ally at 0 HP is defeated (no death clock)', [ally3.dead, ally3.deathClock], [true, null]);
eq('allies give no XP', C.xpSummary(c3).total, foe3.xp);
const c4 = C.fromEncounter(enc3, players);
c4.combatants[0].init = 1;
C.begin(c4, 'player');
const actors = [C.get(c4, C.activeEntry(c4).cid).kind];
while (C.nextTurn(c4) !== 'phase-end') actors.push(C.get(c4, C.activeEntry(c4).cid).kind);
eq('players ambush: allies act in the surprise phase too', actors.sort(), ['ally', 'player']);
const added = C.addNpc(c4, find('Wolf'), 'ally');
eq('ally added mid-fight', added.kind, 'ally');

// --- Humanoid skills (js/skills.js) ---
const pdWindow = {};
new Function('window', fs.readFileSync(path.join(root, '..', 'shared', 'primordium-data.js'), 'utf8'))(pdWindow);
const K = require(path.join(root, 'js', 'skills.js'))(pdWindow.PRIMORDIUM_DATA, Rules);
const soldier = K.setupFor(find('Soldier'));
eq('setup read from the stat block', [soldier.baseTier, soldier.pathTier, soldier.stat, soldier.weaponTier], [3, 0, 3, 1]);
eq('"a weapon of the GM\'s choice" offers every weapon', soldier.options.length, K.weapons.length);
eq('named skills only', K.setupFor(find('Blacksmith')).options.sort(), ['Mace', 'One Handed Axe', 'Warhammer']);
eq('"Strength weapon" is not the Strength skill', K.setupFor(find('Grunt')).options.includes('Strength'), false);
eq('one choice is picked for you', K.setupFor(find('Healer')).skill, 'Restoration Magic');
eq('parse "Strike twice with D6"', K.parseStrikes('Strike twice with D6.'), { strikes: 2, dice: 1, sides: 6, flat: 0 });
eq('parse "Strike once with 2D20 + 5 per stack" (no flat)', K.parseStrikes('Strike once with 2D20 + 5 per blood stack.').flat, 0);
eq('parse "1 strike 2D20 damage with 4AP"', K.parseStrikes('launch it for 1 strike 2D20 damage with 4AP.'), { strikes: 1, dice: 2, sides: 20, flat: 0, ap: 4 });
eq('parse area', K.parseStrikes('Strike twice with D6 dealing damage to up to 3 targets within melee range.').area, true);
eq('no strike text', K.parseStrikes('Block 1D10 from a single attack.'), null);
soldier.skill = 'Sword';
const swordList = K.abilitiesFor(soldier, 'Fair');
eq('Fair tactics: nothing above Uncommon', swordList.every(a => ['Basic', 'Common', 'Uncommon'].includes(a.rarity)), true);
const basicSword = swordList.find(a => a.name === 'Basic Sword Attack');
eq('stat 3: +1.5 per D6, weapon tier 1', [basicSword.attack.perDie, basicSword.attack.bonus], [1.5, 1]);
dice(6, 4, 4);
eq('skill strike: die + stat modifier (rounded down) + weapon tier on the first strike',
  C.rollAttack(basicSword.attack).strikes.map(s => s.value), [4 + 1 + 1, 4 + 1]);
dice(6, 1, 5);
eq('a failed skill strike deals 0', C.rollAttack(basicSword.attack).strikes[0].value, 0);
eq('average includes the modifier', Rules.attackAverage(basicSword.attack), 2 * (3.5 + 1.5) + 1);
// Reference player check (scaling.md): Tier 0, damage stat 2, sword: (5/6) x (4 + 1) x 2 = 8.33 per turn.
const legate = K.setupFor(find('Military Legate'));
legate.skill = 'Sword'; K.choosePath(legate);
const legateList = K.abilitiesFor(legate, 'Great');
eq('path tier: the path is chosen', legate.path, 'Duelist');
eq('path tier: path basic attack replaces Tier 0', [legateList.some(a => a.name === "Duelist's Strike"), legateList.some(a => a.name === 'Basic Sword Attack')], [true, false]);
const pick = C.chooseAbility(c4, c4.combatants[1], find('Military Legate'), 1, legateList);
eq('tactics roll picks from the skill list', pick.ability && pick.ability.name, "Duelist's Strike");

// ---------- Boss Resolve (rules.md, Bosses; ruling 2026-10-17) ----------
const br = C.fromEncounter({ id: 'br', name: 'Resolve', partyIds: [], enemies: [{ npcName: 'Clockwork Titan', count: 1 }, { npcName: 'Wolf', count: 1 }] }, []);
C.begin(br);
const boss = br.combatants.find(c => c.role === 'Boss'), wolf = br.combatants.find(c => c.name === 'Wolf');
while (C.activeEntry(br).cid !== boss.id) C.nextTurn(br);
boss.conditions = ['Disoriented'];
C.addStacks(boss, 'Frozen', boss.level + 1);
const resolveOpts = C.resolveOptions(br, boss);
eq('Boss Resolve offers each condition and control effect on its turn', resolveOpts.map(o => o.name), ['Disoriented', 'Frozen solid']);
eq('a non-Boss gets no Boss Resolve', C.resolveOptions(br, wolf), []);
C.useResolve(br, boss, resolveOpts.find(o => o.name === 'Frozen solid'));
eq('Boss Resolve: frozen solid ends this turn, the stacks stay', [C.stackEffects(boss, br).some(e => e.severe), boss.stacks.Frozen.n], [false, boss.level + 1]);
eq('Boss Resolve is once per turn', C.resolveOptions(br, boss), []);
C.nextTurn(br);
while (C.activeEntry(br) && C.activeEntry(br).cid !== boss.id) C.nextTurn(br);
eq("the Boss's second turn offers it again", C.resolveOptions(br, boss).map(o => o.name), ['Disoriented', 'Frozen solid']);
C.useResolve(br, boss, { kind: 'condition', name: 'Disoriented' });
eq('Boss Resolve on a condition removes it', boss.conditions, []);

// Chilled at 3 frozen stacks, or the level if lower (2026-10-17).
eq('a level 1 creature is Chilled at 1 frozen stack', C.stackEffects({ level: 1, stacks: { Frozen: { n: 1, target: 4 } } }).some(e => /^Chilled/.test(e.text)), true);

console.log(failed ? '\n' + failed + ' check(s) failed' : '\nAll checks passed');
process.exit(failed ? 1 : 0);
