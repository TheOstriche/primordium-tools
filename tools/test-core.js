// Checks shared/core.js: the one copy of the game's tables and helpers every app uses.
// Run: node tools/test-core.js   (or node tools/test.js for every test)
const path = require('path');
const C = require(path.join(__dirname, '..', 'shared', 'core.js'));
let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };

// The tactics table: every level covers 1-20 with no gaps or overlaps, and rarities climb with the roll.
for (const t of C.TACTICS) {
  const rolls = Array.from({ length: 20 }, (_, i) => C.rarityForRoll(t, i + 1));
  const covered = Object.values(C.TACTICS_TABLE[t]).reduce((a, [lo, hi]) => a + hi - lo + 1, 0);
  const climbs = rolls.every((r, i) => i === 0 || C.rarityIndex(r) >= C.rarityIndex(rolls[i - 1]));
  check(covered === 20 && climbs, `${t} tactics covers 1-20 in order (${C.reachableRarities(t).join(', ')})`);
}
check(C.rarityForRoll('Good', 19) === 'Rare' && C.rarityForRoll('Mythic', 20) === 'Mythic', 'spot checks: Good 19 is Rare, Mythic 20 is Mythic');

// XP (NPC Guide): role x (20 + 6 x level); the next level needs 25 more than the last.
check(C.xpFor('Standard', 5) === 50 && C.xpFor('Boss', 5) === 500 && C.xpFor('Minion', 1) === 7 && C.xpFor('Minion', 3) === 10, 'enemy XP by role and level, halves rounded up');
check(C.chilledAt(1) === 1 && C.chilledAt(2) === 2 && C.chilledAt(3) === 3 && C.chilledAt(9) === 3, 'Chilled at 3 frozen stacks, or the level if lower');
check(C.xpToNextLevel(1) === 100 && C.xpToNextLevel(3) === 150, 'XP to the next level: 100, then 25 more each level');

// Recovery: damaging stacks lose 3 or half (rounded up), others half; never more than they have.
check(C.recoveryLoss('Bleed', 2) === 2 && C.recoveryLoss('Bleed', 5) === 3 && C.recoveryLoss('Bleed', 9) === 5, 'damaging stacks: 3 or half, whichever is more');
check(C.recoveryLoss('Frozen', 5) === 3 && C.recoveryLoss('Fear', 1) === 1, 'other stacks: half, rounded up');
check(C.STACKS.includes('Static') && C.DAMAGING_STACKS.every(s => C.STACKS.includes(s)), 'stack list includes Static and every damaging stack');

// Helpers
check(C.movement(-5) === 2 && C.movement(3) === 8, 'movement is 5 + Speed, at least 2M');
check(C.esc(`<a href="x" title='y'>&</a>`) === '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;', 'esc escapes all five HTML characters');
check(C.slug('Soul Rifting Magic') === 'soul-rifting-magic' && C.signed(-2) === '−2' && C.signed(3) === '+3', 'slug and signed');
check(C.rarityStep('Legendary', 2) === 'Mythic' && C.rarityStep('Basic', -1) === 'Basic', 'rarityStep stays within Basic..Mythic');
check(C.cooldownText(C.COOLDOWNS.Rare) === '1 phase' && C.cooldownText('combat') === 'once per combat', 'cooldown text');

console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
process.exit(fails ? 1 : 0);
