// Primordium 2.0 game constants and small helpers shared by every app (and the Node tests).
// One copy of each rule table: change a number here and the Codex, the sheet, and the GM tool all follow.
// Pure data and functions, no screen code. Sources: Game Guide 2.0 and NPC Guide 2.0
// (transcribed in codex/codex-data.js and gm/docs/rules.md).
(function (root) {
  /* ---------- cards and rarity ---------- */
  const RARITIES = ['Basic', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  const rarityIndex = r => RARITIES.indexOf(r);
  // One or more rarities higher (or lower with a negative step), kept within Basic..Mythic.
  const rarityStep = (r, by) => RARITIES[Math.max(0, Math.min(RARITIES.length - 1, rarityIndex(r) + by))];

  /* ---------- stats ---------- */
  const STATS = ['STR', 'AGI', 'KNO', 'SPD', 'PER', 'SPE'];   // also the order of race stat arrays
  const STAT_NAMES = { STR: 'Strength', AGI: 'Agility', KNO: 'Knowledge', SPD: 'Speed', PER: 'Perception', SPE: 'Speech' };
  const STAT_KEYS = Object.fromEntries(Object.entries(STAT_NAMES).map(([k, v]) => [v, k]));   // 'Strength' -> 'STR'

  /* ---------- enemy tactics: the D20 table ---------- */
  const TACTICS = ['Basic', 'Fair', 'Good', 'Great', 'Excellent', 'Mythic'];
  // For each tactics level, the D20 range that picks each rarity: { rarity: [lowest, highest] }.
  const TACTICS_TABLE = {
    Basic:     { Basic: [1, 20] },
    Fair:      { Basic: [1, 10], Common: [11, 16], Uncommon: [17, 20] },
    Good:      { Basic: [1, 6], Common: [7, 12], Uncommon: [13, 18], Rare: [19, 20] },
    Great:     { Basic: [1, 4], Common: [5, 9], Uncommon: [10, 14], Rare: [15, 18], Epic: [19, 20] },
    Excellent: { Common: [1, 5], Uncommon: [6, 10], Rare: [11, 15], Epic: [16, 19], Legendary: [20, 20] },
    Mythic:    { Uncommon: [1, 6], Rare: [7, 12], Epic: [13, 16], Legendary: [17, 19], Mythic: [20, 20] }
  };
  function rarityForRoll(tactics, roll) {
    const row = TACTICS_TABLE[tactics] || TACTICS_TABLE.Basic;
    const hit = Object.entries(row).find(([, [lo, hi]]) => roll >= lo && roll <= hi);
    return hit ? hit[0] : 'Basic';
  }
  // The rarities a tactics level can roll, lowest first.
  const reachableRarities = tactics => Object.keys(TACTICS_TABLE[tactics] || TACTICS_TABLE.Basic);

  // Phases an ability waits after use, by rarity ('combat' = once per combat). Basic to Uncommon: none.
  const COOLDOWNS = { Rare: 1, Epic: 2, Legendary: 3, Mythic: 'combat' };
  const cooldownText = c => c == null || c === 0 ? '' : c === 'combat' ? 'once per combat' : c + (c === 1 ? ' phase' : ' phases');

  /* ---------- creatures and XP ---------- */
  const ROLES = ['Minion', 'Standard', 'Elite', 'Boss'];
  const ROLE_XP = { Minion: 0.25, Standard: 1, Elite: 3, Boss: 10 };   // matches gm/data/scaling.json
  // Enemy XP: role multiplier × (20 + 6 × level), rounded with halves up (owner, 2026-10-17: 6.5 → 7).
  const roundHalfUp = x => Math.floor(x + 0.5);
  const xpFor = (role, level) => roundHalfUp((ROLE_XP[role] || 0) * (20 + 6 * (Number(level) || 0)));
  const xpToNextLevel = level => 100 + 25 * (Math.max(1, Number(level) || 1) - 1);
  const SIZES = ['Tiny', 'Small', 'Average', 'Large', 'Huge', 'Massive'];

  /* ---------- stacks and recovery ---------- */
  const STACKS = ['Bleed', 'Flame', 'Poison', 'Acid', 'Frozen', 'Static', 'Paralysis', 'Calm', 'Anger', 'Fear'];
  const DAMAGING_STACKS = ['Bleed', 'Flame', 'Poison', 'Acid'];   // 1D4 each at the end of the phase
  // Frozen: Chilled at 3 stacks, or at stacks equal to the entity's level if that is lower (2026-10-17);
  // frozen solid at more stacks than its level.
  const chilledAt = level => Math.min(3, Math.max(1, Number(level) || 1));
  const RECOVERY_START = 4, RECOVERY_FLOOR = 2;                    // D4 target after a new stack, and its lowest
  // Stacks a successful recovery removes: damaging stacks lose 3 or half (whichever is more), others half.
  // Halves round up (GM ruling).
  function recoveryLoss(type, count) {
    const half = Math.ceil(count / 2);
    return Math.min(count, DAMAGING_STACKS.includes(type) ? Math.max(3, half) : half);
  }

  /* ---------- movement ---------- */
  const movement = speed => Math.max(2, 5 + (Number(speed) || 0));   // meters (1 square = 1M)

  /* ---------- materials ---------- */
  // [item tier, material, notes]: an item made of a material has its tier (Game Guide 2.0, Crafting).
  const MATERIALS = [
    [0,"Oak","Wood for bows, shields, staves, and spear shafts. Light and cheap."],
    [0,"Bronze","Soft and easy to work; the first metal most smiths learn."],
    [0,"Iron","The common standard for tools, weapons, and armor everywhere."],
    [1,"Steel","Refined iron: reliable, and the mark of a real professional."],
    [1,"D-Iron","Dwarven iron: denser and far more durable than common iron."],
    [1,"Silv-Steel","Silvered steel. Weaker than plain steel, but deals 50% more damage to shapeshifters such as werewolves."],
    [2,"D-Steel","Dwarven steel: the dwarves' finest common alloy, and the toughest Tier 2 metal."],
    [2,"Etherian","A dark-elf alloy from Etriun: light and quiet."],
    [2,"Lyran Stone","River stone from Lyra's Well, shaped and hardened by Lyros craftsmen."],
    [3,"Glacius","Frost-forged metal from the north; always cold to the touch."],
    [3,"Aurausheen","The golden light-metal of the Imperios, said to carry Aurau's blessing."],
    [4,"Mag-Glass","Glass grown through with magic. Fragile, but it carries enchantments well."],
    [4,"Druiniun","A sea metal from the Isles of Drune that never rusts."],
    [5,"Pitch","Black volcanic metal from the Ashlands: very heavy and very hard."],
    [6,"PriGlass","Primordial glass. Fragile, but saturated with primordial power."],
    [7,"PriSteel","Primordial steel, the strongest material known."]
  ];

  /* ---------- text helpers ---------- */
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ESC[c]);           // safe inside HTML text and attributes
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');   // "Fire Magic" -> "fire-magic"
  const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n);           // +2, −1, 0
  const article = word => /^[aeiou]/i.test(String(word)) ? 'an' : 'a';         // "an Epic card", "a Rare card"
  const plural = (n, word) => n + ' ' + word + (n === 1 ? '' : 's');

  const Core = {
    RARITIES, rarityIndex, rarityStep, STATS, STAT_NAMES, STAT_KEYS,
    TACTICS, TACTICS_TABLE, rarityForRoll, reachableRarities, COOLDOWNS, cooldownText,
    ROLES, ROLE_XP, xpFor, xpToNextLevel, SIZES,
    STACKS, DAMAGING_STACKS, chilledAt, RECOVERY_START, RECOVERY_FLOOR, recoveryLoss, movement, MATERIALS,
    esc, slug, signed, article, plural
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Core;
  root.PrimordiumCore = Core;
})(typeof window !== 'undefined' ? window : globalThis);
