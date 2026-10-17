# Primordium 2.0: combat rules for the GM tool

The full rules are in the Game Guide 2.0 and NPC Guide 2.0. This is what the GM tool needs to apply.

## Phases, turns, and initiative
- A phase is one full round: every player and enemy takes a turn, then the phase resolves (stacks deal damage, durations tick, cooldowns count down).
- Initiative: players roll D10 + Perception (the GM types the result in). Enemies have 5 + their Perception (no roll).
- Ties: players act before enemies; between players, higher Perception first, then players choose.
- Bosses take two turns each phase (each rolls on its tactics table).
- Ambush: ambushers get a surprise phase first; ambushed characters can not use Defensive or Quick abilities in it.

## Movement and grid
- Standard movement: 5M + Speed (minimum 2M). Optional Speed roll instead: D10 + Speed, take the result, minimum 2M.
- Charge: at least 4M in a straight line toward a target, then attack it the same turn.
- Difficult terrain costs double movement.
- Grid: 1 square = 1M. Sizes: Tiny 4 per square, Small 2 per square, Average 1 square, Large 2 squares, Huge 4 squares (2x2), Massive 9 squares (3x3).
- Size modifiers: Tiny +2 dodge, -20% accuracy to target it; Small +1, -10%; Average none; Large -1, +10%; Huge -2, +20%; Massive -4, +40%.

## Enemy ability selection (D20 tactics)
Roll a D20 on the enemy's Tactics row to set the rarity of its Standard ability this turn:

| Tactics | Basic | Common | Uncommon | Rare | Epic | Legendary | Mythic |
|---|---|---|---|---|---|---|---|
| Basic | always | | | | | | |
| Fair | 1-10 | 11-16 | 17-20 | | | | |
| Good | 1-6 | 7-12 | 13-18 | 19-20 | | | |
| Great | 1-4 | 5-9 | 10-14 | 15-18 | 19-20 | | |
| Excellent | | 1-5 | 6-10 | 11-15 | 16-19 | 20 | |
| Mythic | | | 1-6 | 7-12 | 13-16 | 17-19 | 20 |

- Cooldowns after use: Rare 1 phase, Epic 2, Legendary 3, Mythic once per combat. Basic to Uncommon none.
- If every ability of the rolled rarity is on cooldown (or the enemy has none at that rarity), use another of the same rarity, otherwise drop one rarity at a time until one is usable.
- Quick and Defensive abilities are not rolled: one of each per phase.
- Disoriented enemies drop one rarity on the roll. A disoriented enemy with Basic tactics can not use abilities that turn (it may still move and dodge).

## Damage
- Beasts and non-humanoids deal their listed damage exactly (no stats added).
- Humanoids use player skills: their stat block lists a combat skill, skill tier, damage stat, and weapon tier instead of fixed attacks. The GM resolves their attacks from the Skill Guide; the tool should allow typing in a damage total.
- Damage modifier (players and humanoids): +½ per D4 or D6, +1 per D8 to D12, +2 per D20 rolled. A weapon adds its tier to one strike per attack.
- Half-modifiers (D4 and D6) are added together for the whole strike, then rounded down.
- Spells hit automatically within their listed range unless the ability says otherwise; targets may still dodge or block.
- A strike with several dice only fails if every die rolls a 1.
- Armor is subtracted from each strike (minimum 0). AP ignores that much armor per strike. Some attacks ignore armor entirely.
- Percentage bonuses add together and apply once, after flat modifiers. Resistances add together (cap 75%), applied after armor.
- Damage types: physical and elemental are reduced by armor unless stated (shock ignores worn metal armor); psychic ignores armor; radiant ignores physical armor against undead and unholy; soul ignores physical armor; stack damage ignores armor.

## Defense
- Dodge: Agility contest against the attacker; ties go to the attacker. A failed dodge takes 1.5x damage.
- Block: roll the block die (plus shield tier) and subtract it. A natural 1 fails a block or dodge.

## Stacks and recovery
- Damaging stacks (Bleed, Flame, Poison, Acid): 1D4 each at end of phase, no modifier, ignores armor.
- Frozen: 3+ stacks, or stacks equal to the entity's level if that is lower = Chilled (no Defensive; Quick only as Standard). More stacks than level = frozen solid (no actions).
- Paralysis: -1 Strength and Agility per stack; more stacks than level = paralyzed (no actions).
- Calm, Anger, Fear: more stacks than half the level forces a Knowledge check against 1D10 + stacks (calmed, enraged, or terrified for a phase).
- Recovery: D4 on the entity's turn. Needs 4 after a new stack, dropping by 1 each phase to a minimum of 2. A 1 never recovers. Damaging stacks lose 3 or half (whichever is more); other stacks lose half.

## Dying
- At 0 HP or below a character is downed: no actions, and a 3-phase death clock starts. Each hit while downed removes a phase.
- Stabilize: an adjacent ally's Standard action and a Knowledge check of 6+ stops the clock.
- When the clock runs out, the character dies.

## Bosses
- Boss Resolve: at the start of each of its turns, a Boss may end one condition or control effect on itself (disoriented, silenced, immobilized, frozen solid, paralyzed, or a calm, anger or fear effect). Stacks remain; only the effect ends.

## Encounter building (Game Master's Guide 2.0)
- One Standard Encounter (SE) is one Standard enemy of the party's level. Roles count as Minion 0.25 SE, Standard 1, Elite 3, Boss 10.
- Fight budgets per player: Easy 0.5 SE, Standard 1 SE, Hard 1.5 SE, Deadly 2 SE or more.
- Enemies of other levels: multiply the role value by (20 + 6 x enemy level) / (20 + 6 x party level). Avoid enemies more than 3 levels above the party unless the fight is meant to be survived by escape.
- A Boss alone is 2.5 SE per player for four players, so a Boss fight is Deadly by design.
- These budgets and the share-of-party-HP difficulty bands are two views of the same thing; the tool may show both.

## The adventuring day (guideline)
- A Standard fight costs a party about a third of its total HP.
- About three Standard fights between full rests, with the breather after the second.
- A fight usually spends 5 to 8 cards per player.
- A party without Restoration: keep most fights Easy or Standard and include Healing Potions in early rewards.

## Rewards
- Marks: about 10 x party level marks per player for each SE of a fight.
- Gear tier by party level: 1-4 Tier 0 (rarely 1); 5-8 Tier 1 (rarely 2); 9-12 Tier 2-3; 13-16 Tier 3-4; 17-20 Tier 4-5; 21+ Tier 5-7.

## GM rulings for the tool (decided by the owner, 2026-10-08)
- Diagonal movement costs 1M (every square in any direction is 1M).
- A Boss's second turn comes at the end of the phase, after everyone else.
- Stack recovery: one D4 per stack type, each with its own target number.
- Halving stacks rounds up (5 stacks lose 3). A failed dodge's 1.5x damage rounds down.
- Until abilities are tagged Quick or Defensive, every enemy ability is treated as Standard.
- Enemies are defeated at 0 HP (no death clock); only players are downed.
- Stack damage at the end of a phase does not count as a hit on a downed character.
- Damage order: armor per strike (less AP), then a failed dodge x1.5, then resistance, then block.
- A cooldown of N phases means the ability is unavailable for the next N phases (used in phase P, ready in phase P + N + 1).
- A Boss's damage budget covers both of its turns in a phase, so each ability is budgeted at half.
- Race stat arrays are in the order Strength, Agility, Knowledge, Speed, Perception, Speech.
- (2026-10-17) XP rounds halves up (replaces halves-to-even).
- (2026-10-17) Boss Resolve: when a Boss's turn starts with a condition on it, the tool offers to end one (disoriented, silenced, immobilized, frozen solid, paralyzed, calmed, enraged, terrified). Stacks stay.
- (2026-10-17) Encounter difficulty may also be shown in SE against the GM Guide budgets (Easy 0.5 / Standard 1 / Hard 1.5 / Deadly 2+ SE per player).

## Difficulty and XP
- Enemy XP = role multiplier x (20 + 6 x level), rounded with halves up: Minion x0.25, Standard x1, Elite x3, Boss x10 (already computed in npc-data.js). The party splits XP evenly.
- Difficulty: estimate the share of party HP an encounter takes. Easy under 15%, Standard 15-35%, Hard 35-60%, Deadly over 60%. The budget assumes player HP of 35 + 25 per 5 levels, and player damage per turn rising with level (see the Enemy Budget workbook).
