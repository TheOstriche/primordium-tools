// Checks the shared tactical deck (shared/tactics-deck.js): card counts at every Tactics level match the
// Skill Guide's promotions, and the hand rules (pairs, wild jokers, breathers, reserve) behave.
// Run: node tools/test-deck.js
const fs = require('fs'), path = require('path');
global.window = {};
for (const f of ['primordium-data.js', 'tactics-deck.js']) eval(fs.readFileSync(path.join(__dirname, '..', 'shared', f), 'utf8'));
const K = window.PrimordiumDeck;
let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };

// Expected counts, from each promotion perk's text (the same table the sheet used before).
const START = {Basic: 22, Common: 16, Uncommon: 8, Rare: 4, Epic: 2, Legendary: 1, Mythic: 0};
const FX = {'Improved Tactics': {Basic: -4, Common: 4}, 'Trained Tactics': {Uncommon: -4, Rare: 4},
  'Seasoned Tactics': {Common: -4, Uncommon: 4, Rare: -2, Epic: 2}, 'Wild Card': {Legendary: 1},
  'Focused Training': {Rare: -2, Epic: 2}, 'Specialist': {Uncommon: -4, Rare: 4}, 'Mastery': {Epic: -2, Legendary: 2},
  'Grand Strategy': {Legendary: -1, Mythic: 1}, "Officer's Training": {Common: -4, Uncommon: 4}, 'Veteran Command': {Epic: -1, Legendary: 1}};
for (const lv of K.LEVELS) {
  const b = K.build(lv), want = {...START};
  b.granted.forEach(g => Object.entries(FX[g.name] || {}).forEach(([r, v]) => want[r] += v));
  const ok = K.RAR.every(r => b.counts[r] === want[r]) && b.cards.length === 53 + (b.f.wild ? 1 : 0);
  check(ok, `${K.levelLabel(lv)}: ${K.RAR.map(r => r + ' ' + b.counts[r]).join(', ')}`);
  check(b.steps.every(s => s.value), `${K.levelLabel(lv)}: every promotion found eligible cards`);
}

// Card assignment text matches the Game Guide's default.
const b0 = K.build({base: 0});
check(b0.mapping.Basic === '2 through 6, black 7s', 'default Basic: ' + b0.mapping.Basic);
check(b0.mapping.Common === 'Red 7s, 8 through 10, black Jacks', 'default Common: ' + b0.mapping.Common);
check(b0.mapping.Rare === 'Red Kings, black Aces', 'default Rare: ' + b0.mapping.Rare);

// A promotion choice moves the right cards.
const b1 = K.build({base: 1}, {'Improved Tactics#0': '2'});
check(b1.byId['2♠'].rar === 'Common' && b1.byId['6♠'].rar === 'Basic', 'Improved Tactics can promote the 2s instead of the 6s');
check(b1.mapping.Basic === '3 through 6, black 7s', 'mapping follows the choice: ' + b1.mapping.Basic);

// Pairs and three of a kind.
const g4 = K.build({base: 4, path: 'Gambler', ptier: 4});
const id = r => g4.cards.find(c => c.rar === r && c.r !== 'JK').id;
check(K.combo(g4, [id('Basic'), id('Basic')]) === 'Common', 'pair of Basics plays as Common');
check(K.combo(g4, [id('Common'), id('Common'), id('Common')]) === 'Rare', 'three Commons play as Rare');
check(K.combo(g4, [id('Basic'), id('Common')]) === null, 'mixed rarities do not pair');
check(K.combo(g4, ['JK1', id('Rare')]) === 'Epic', 'a wild joker matches the other card');
check(K.combo(g4, ['JK1', 'JK2']) === 'Mythic', 'two wild jokers pair to Mythic');
check(K.value(g4, 'JK1') === 'Mythic', 'House Rules: a wild joker pays as Mythic');
const g1 = K.build({base: 4, path: 'Gambler', ptier: 1});
check(K.value(g1, 'JK1') === 'Legendary', 'Wild Card alone: a joker pays up to Legendary');

// Breathers take the top of the discard pile.
let s = K.newState(b0); K.act(s, b0, 'sel', 0); K.act(s, b0, 'reeval');
for (let i = 0; i < 9; i++) { K.act(s, b0, 'sel', 0); K.act(s, b0, 'play'); }
const top8 = s.discard.slice(-8), drawBefore = s.draw.length;
K.act(s, b0, 'breather');
check(s.draw.length + s.hand.length === drawBefore + 3 + 8 - (3 - 3) && top8.every(x => s.draw.includes(x) || s.hand.includes(x)), 'breather returns the top 8 discards');
K.act(s, b0, 'breather'); check(/already used/.test(s.log), 'breather is once per day');

// Measured Breather keeps the chosen 8 of the top 12.
const st3 = K.build({base: 4, path: 'Strategist', ptier: 3});
s = K.newState(st3); for (let i = 0; i < 14; i++) { K.act(s, st3, 'sel', 0); K.act(s, st3, 'play'); }
K.act(s, st3, 'breather'); check(s.pick && s.pick.ids.length === 12, 'Measured Breather shows the top 12');
s.pick.ids.slice(0, 8).forEach(x => K.act(s, st3, 'pickToggle', x)); const kept = s.pick.keep.slice();
K.act(s, st3, 'pickToggle', s.pick.ids[9]); check(s.pick.keep.length === 8, 'no more than 8 can be kept');
K.act(s, st3, 'pickDone'); check(kept.every(x => s.draw.includes(x) || s.hand.includes(x)) && s.used.breather, 'the kept 8 go back into the deck');

// Reserve: once per phase, kept through a full rest.
s = K.newState(st3); const first = s.hand[0]; K.act(s, st3, 'sel', 0); K.act(s, st3, 'swap', 0);
check(s.reserve[0] === first && s.hand.length === 3, 'a card goes into the empty reserve and the hand refills');
K.act(s, st3, 'sel', 0); K.act(s, st3, 'swap', 0); check(s.reserve[0] === first, 'only one swap per phase');
K.act(s, st3, 'phase'); s.sel = []; K.act(s, st3, 'sel', 1); const other = s.hand[1]; K.act(s, st3, 'swap', 0);
check(s.reserve[0] === other && s.hand.includes(first), 'a new phase allows another swap');
K.act(s, st3, 'rest'); check(s.reserve[0] === other && !s.draw.includes(other) && !s.hand.includes(other) && s.draw.length + s.hand.length === 52, 'the reserve stays through a full rest');

// Every card is always somewhere, exactly once.
const all = s => [...s.draw, ...s.hand, ...s.discard, ...s.reserve, ...(s.plan ? [s.plan] : [])].sort().join();
const c4 = K.build({base: 4, path: 'Commander', ptier: 4});
s = K.newState(c4); K.act(s, c4, 'sel', 0); K.act(s, c4, 'plan'); K.act(s, c4, 'sel', 1); K.act(s, c4, 'lead');
K.act(s, c4, 'callPlan', 'ally');
check(all(s) === c4.cards.map(c => c.id).sort().join(), 'battle plan and Lead by Example keep every card accounted for');
check(/as an? <b>/.test(s.log), 'calling the plan reports its rarity');

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
