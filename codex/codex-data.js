// Primordium Codex: rules, tables, and lore the shared files do not hold, hand-transcribed from Game Guide 2.0 and NPC Guide 2.0.
// Skills, races (stats and specials), traits, and creatures come from ../shared/. Edit game text here only to match the guides.
window.CODEX_DATA = {
 "raceLore": {
  "Imperios": {
   "id": "imperios",
   "common": "Light Elves",
   "roles": "Mages, Diplomats, Guardians",
   "country": "The Imperial Expanse",
   "population": "4,000,000",
   "deity": "Aurau",
   "appearance": {
    "Skin": "Tan to golden with few or no flaws",
    "Height": "Slightly above average (M: 6'2\", F: 5'9\")",
    "Weight": "Slightly below average for height"
   },
   "desc": "A race of elves generally believed to be the most ancient and pure of elves. They reside in elegant and ancient structures. Wise and swift but frail, their pure blood rapidly repairs their bodies when damaged. They protect their lands with elegance and the wrath of primordium magic."
  },
  "Etherios": {
   "id": "etherios",
   "common": "Dark Elves",
   "roles": "Scouts, Assassins, Rogues",
   "country": "Etriun",
   "population": "2,250,000",
   "deity": "N/A",
   "appearance": {
    "Skin": "Various shades of ashen grey",
    "Height": "Slightly below average (M: 5'6\", F: 5'1\")",
    "Weight": "Average for height"
   },
   "desc": "Elves who used magic to remove themselves from the line of the Imperios. Kind to outsiders while keeping to themselves, with far better capacity to go unseen thanks to their acceptance of the dark. Thought dangerous by many, but calm and well liked by those who know them."
  },
  "Lyros": {
   "id": "lyros",
   "common": "River Elves",
   "roles": "Tradesman, Diplomats, Sailors",
   "country": "Lyra's Well",
   "population": "2,000,000",
   "deity": "Lyra",
   "appearance": {
    "Skin": "Iridescent silvery blue or green",
    "Height": "Approximately average (M: 5'10\", F: 5'4\")",
    "Weight": "Average for height"
   },
   "desc": "Lyros live near the Well of Lyra in stilted wooden structures along the rivers. They welcome all who follow their laws, benefiting from the diversity of trade, and exercise a natural aptitude for languages."
  },
  "Magnion": {
   "id": "magnion",
   "common": "Cinder Orc",
   "roles": "Mercenaries, Warriors",
   "country": "Ashlands",
   "population": "800,000",
   "deity": "Magnis",
   "appearance": {
    "Skin": "Pale green, grey, or black",
    "Height": "Above average (M: 6'4\", F: 6')",
    "Weight": "Above average for height"
   },
   "desc": "Large, strong, resilient folk believed to have once been elven. They live in homes of ashwood and obsidian and are known for orcish weapons of cast lava. Many cultures employ them as craftsmen or mercenaries."
  },
  "Asrahelm": {
   "id": "asrahelm",
   "common": "Mountain Dwarves",
   "roles": "Tanks, Barbarians, Warriors",
   "country": "Vira's Belt",
   "population": "2,500,000",
   "deity": "Vira",
   "appearance": {
    "Skin": "Standard human skin tones",
    "Height": "Well below average (M: 4', F: 4')",
    "Weight": "Well above average for height"
   },
   "desc": "Dwarves of great strongholds built upon and into the mountains. Densely built, thick skinned, powerful defensive warriors with a long rivalry against the Iron dwarves."
  },
  "Uundrahelm": {
   "id": "uundrahelm",
   "common": "Iron Dwarves or Architects",
   "roles": "Engineers, Mages, Craftsmen",
   "country": "The Dwarven Plains",
   "population": "2,500,000",
   "deity": "Kato",
   "appearance": {
    "Skin": "Standard human skin tones",
    "Height": "Well below average (M: 4', F: 4')",
    "Weight": "Above average for height"
   },
   "desc": "Dwarves who specialize in engineering and underground cities that just peek out of the ground. Widely known for their understanding of crafting, they are often called Architect Dwarves."
  },
  "Trin": {
   "id": "trin",
   "common": "Trin, Humans, Men",
   "roles": "Any",
   "country": "Trinimar",
   "population": "5,000,000",
   "deity": "N/A",
   "appearance": {
    "Skin": "Standard human skin tones",
    "Height": "Approximately average (M: 5'10\", F: 5'4\")",
    "Weight": "Average for height"
   },
   "desc": "Unique in their lack of specialization, Trin use their blank slate to fill any role. They live in large cities and towns in the east and are active across the continent."
  },
  "Kled": {
   "id": "kled",
   "common": "Kled, Giants, Men",
   "roles": "Hunters, Warriors, Tanks",
   "country": "The Frostlands",
   "population": "1,000,000",
   "deity": "Commetriun",
   "appearance": {
    "Skin": "Standard tones, generally rather pale",
    "Height": "Giant (M: 6'8\", F: 6'4\")",
    "Weight": "Average for height"
   },
   "desc": "A larger variety of human from the cold North-East, mostly nomads with few permanent strongholds. Rarely at war, but known to unite in a mighty military should the need arise."
  },
  "Druna": {
   "id": "druna",
   "common": "Druna, Ocean Men",
   "roles": "Sailors, Strategists, Leaders",
   "country": "Isles of Drune",
   "population": "3,500,000",
   "deity": "Lyra",
   "appearance": {
    "Skin": "Standard tones, generally tan or dark",
    "Height": "Approximately average (M: 5'10\", F: 5'4\")",
    "Weight": "Average for height"
   },
   "desc": "Humans of the South-Western isles whose society is built around naval capacity. Excellent coordination and an in-born sense of teamwork make them fierce and highly desirable allies."
  },
  "Avichai": {
   "id": "avichai",
   "common": "Chai",
   "roles": "Mages, Healers, Academics",
   "country": "None",
   "population": "200,000",
   "deity": "N/A",
   "appearance": {
    "Skin": "Grey, black, green, yellow, or a combination",
    "Height": "Approximately average (M: 5'10\", F: 5'4\")",
    "Weight": "Well above average for height"
   },
   "desc": "A reptilian humanoid race with stony scales and no permanent home, settling for centuries wherever they find peace, adventure, or knowledge. Strongly connected to Primordium, they excel as scholars and mages."
  },
  "Aquilan": {
   "id": "aquilan",
   "common": "Quills, Birdfolk",
   "roles": "Scouts, Assassins, Agile Soldiers",
   "country": "Vidriun Forest",
   "population": "1,000,000",
   "deity": "No Primary Deity",
   "appearance": {
    "Skin": "Feathers of browns, whites, blacks, greys, and gold",
    "Height": "Slightly below average (M: 5'6\", F: 5'2\")",
    "Weight": "Well below average for height"
   },
   "desc": "A winged eagle-like race living in tree-top towns of the Vidriun Forest. Their flight is powerful but unsustainable, and their society is very secretive. Fragile, with wings as a weak spot."
  }
 },
 "traitsIntro": "Every character begins with 2 Background Trait points. Traits never change once selected. Some have negative costs, which grant points. Traits can raise any one stat by at most 2.",
 "traitGroupNames": {
  "Physical": "Physical",
  "Mental": "Mental",
  "Major": "Gameplay Changing"
 },
 "skillNotes": {
  "Sword": {
   "stat": "A",
   "summary": "Precise combat against individual or small groups of targets."
  },
  "Dagger": {
   "stat": "A",
   "summary": "Close range single target combat, deadly against unsuspecting targets."
  },
  "One Handed Axe": {
   "stat": "S",
   "summary": "High lingering damage through bleeding."
  },
  "Mace": {
   "stat": "S",
   "summary": "Damage against lightly armored targets and their weapons."
  },
  "Spear": {
   "stat": "A",
   "summary": "Area denial and precise damage, with 2M reach."
  },
  "Greatsword": {
   "stat": "A",
   "summary": "Combating magic and high level individual targets, with 2M reach."
  },
  "Battle Axe": {
   "stat": "S",
   "summary": "Extreme stacking bleeding damage against high level targets."
  },
  "Warhammer": {
   "stat": "S",
   "summary": "Damage against heavily armored targets."
  },
  "Bow": {
   "stat": "A",
   "summary": "Precise ranged damage."
  },
  "Crossbow": {
   "stat": "A",
   "summary": "Heavy ranged damage at a slow pace."
  },
  "Shield": {
   "summary": "Blocking and protecting allies."
  },
  "Fire Magic": {
   "stat": "K",
   "summary": "High damage and lasting flame."
  },
  "Frost Magic": {
   "stat": "K",
   "summary": "Damage and slowing through frozen stacks."
  },
  "Shock Magic": {
   "stat": "K",
   "summary": "Damage that ignores worn metal armor, chaining and charging."
  },
  "Soul Rifting Magic": {
   "stat": "K",
   "summary": "Summoning, reanimating, and harnessing souls."
  },
  "Sensory Magic": {
   "stat": "K",
   "summary": "Emotions, illusions, support, and countering magic."
  },
  "Alteration Magic": {
   "stat": "K",
   "summary": "Altering the world, empowering allies, and bending its laws."
  },
  "Restoration Magic": {
   "stat": "K",
   "summary": "Healing and warding."
  },
  "Strength": {
   "summary": "Raises Strength by 4 when fully trained, with perks that fit it."
  },
  "Agility": {
   "summary": "Raises Agility by 4 when fully trained, with perks that fit it."
  },
  "Knowledge": {
   "summary": "Raises Knowledge by 4 when fully trained, with perks that fit it."
  },
  "Speed": {
   "summary": "Raises Speed by 4 when fully trained, with perks that fit it."
  },
  "Perception": {
   "summary": "Raises Perception by 4 when fully trained, with perks that fit it."
  },
  "Speech": {
   "summary": "Raises Speech by 4 when fully trained, with perks that fit it."
  },
  "Endurance": {
   "summary": "Raises maximum HP instead of a stat."
  },
  "Tactics": {
   "summary": "Improves your tactical deck and how you play it."
  },
  "Crafting": {
   "summary": "Assists every crafting attempt."
  },
  "Roguery": {
   "summary": "Sneaking, lockpicking, pickpocketing, disarming, and traps."
  }
 },
 "creatureFamilies": {
  "Wolves": {
   "group": "Beasts",
   "flavor": "Wolves are a very common enemy in Primordium. They are thick furred pack hunting canines known for prowling at night. Opportunistic, curious, and powerful, wolves can present a variety of situations for adventurers to overcome. One is no trouble, but extremely dangerous in packs."
  },
  "Bears": {
   "group": "Beasts",
   "flavor": "Bears are large opportunistic omnivores that can be found across all of primordium. They are adaptable large hairy beasts that demand respect. Not naturally hostile but like most beasts, survival is all that matters. Generally solitary, though one is more than enough to challenge most adventurers."
  },
  "Spiders": {
   "group": "Beasts",
   "flavor": "Large eight-legged arachnids that hunt in the dark for anything unlucky enough to be marked as prey. Most often ambush hunters, adventurers should tread very carefully if they come across the tell-tale webs of these terrors."
  },
  "Crocodilians": {
   "group": "Beasts",
   "flavor": "Large scaly beasts known for ambushing those who venture too far into their murky waters. Deceptively fast and built to tear chunks out of anything they latch onto, they are the reason most adventurers steer clear of any water they can't clearly see through."
  },
  "Avra Hounds": {
   "group": "Monsters",
   "flavor": "The howl of a wolf may strike fear, but the howl of an Avra hound strikes terror. These monstrous canines have thick leathery skin that is always pitch black, crimson red eyes, and shorter snouts. They are a demonic bastardization of the wolf bred by Avranahn to kill."
  },
  "Night Claws": {
   "group": "Monsters",
   "flavor": "Boney creatures with needle-like teeth and long sharp claws. Many towns are plagued at night by the hellish screams of these foul creatures. They are blind but can sense heat which they use to hunt down prey in the night. Night Claws can grow to enormous sizes if they can survive and continually feed."
  },
  "Werewolves": {
   "group": "Monsters",
   "flavor": "Shapeshifters whose beast form is part wolf and part person. The form grows larger and more dangerous as the shifter gains experience. Silver harms them. Characters with the Lycan trait use these forms."
  },
  "Wraiths": {
   "group": "Undead and Spirits",
   "flavor": "Cursed soulless beings with an eternal hunger for the souls of the living."
  },
  "Skeletons": {
   "group": "Undead and Spirits",
   "flavor": "Bones held together with primordial magic to perform a purpose."
  },
  "Automatons": {
   "group": "Constructs",
   "flavor": "Mechanical creations, from mining picks repurposed for war to clockwork soldiers and the towering Clockwork Titans that guard important artifacts and resources."
  },
  "Golems": {
   "group": "Constructs",
   "flavor": "Constructs bound with soul magic, summoned by Soul Rifting or left to guard places of power."
  },
  "Guards": {
   "group": "Humanoids",
   "flavor": "The various common guards seen defending everything from towns to traveling merchants."
  },
  "Mages": {
   "group": "Humanoids",
   "flavor": "Trained practitioners of magic, from novices to masters."
  }
 },
 "rules": [
  {
   "id": "stats",
   "title": "Stats",
   "group": "Character",
   "entries": [
    [
     "HP",
     "Damage you can take and keep going. Average 40 for a player. At 0 a character is downed. Raised every 5th level, by Endurance, or by magic."
    ],
    [
     "Strength",
     "Physical power. Damage modifier for the One Handed Axe, Mace, Battle Axe, and Warhammer."
    ],
    [
     "Agility",
     "Precision movement, dodging, catching. Damage modifier for the Dagger, Sword, Spear, Greatsword, Bow, and Crossbow."
    ],
    [
     "Knowledge",
     "Critical thinking and understanding. Damage modifier for magic."
    ],
    [
     "Speed",
     "Movement is 5M plus Speed (minimum 2M)."
    ],
    [
     "Perception",
     "Noticing things, visually or otherwise. Also modifies initiative."
    ],
    [
     "Speech",
     "How well a character forms words. Players say what they want; the roll decides how well it lands."
    ]
   ]
  },
  {
   "id": "creation",
   "title": "Character Creation",
   "group": "Character",
   "entries": [
    [
     "Race",
     "Sets starting HP, stats, and special attributes."
    ],
    [
     "Background traits",
     "2 trait points. Chosen at creation and never change."
    ],
    [
     "Skills",
     "2 skill points to spend in any skills."
    ],
    [
     "Starting wealth",
     "One D4 roll sets both starting marks and equipment condition."
    ]
   ]
  },
  {
   "id": "leveling",
   "title": "Leveling and XP",
   "group": "Character",
   "entries": [
    [
     "Start",
     "Level 1 with 0/100 XP, 2 skill points, and 2 trait points."
    ],
    [
     "XP curve",
     "Each level needs 25 more XP than the last (125 for level 3, 150 for level 4, and so on)."
    ],
    [
     "Every level",
     "+1 skill point."
    ],
    [
     "Every 5th level",
     "Milestone: +25 maximum HP and +1 bonus skill point."
    ],
    [
     "Enemy XP",
     "Role multiplier × (20 + 6 × level). Minion ×0.25, Standard ×1, Elite ×3, Boss ×10. Split evenly across the party."
    ],
    [
     "Outside combat",
     "Measured in Standard Encounters (SE): the XP of one Standard enemy at the party's level, given to each player. Up to 0.5 SE for standout roleplay."
    ]
   ]
  },
  {
   "id": "turns",
   "title": "Phases and Initiative",
   "group": "Combat",
   "entries": [
    [
     "Phase",
     "One full round: everyone takes a turn, then the phase resolves. Stacks deal damage, per-phase effects resolve, durations tick."
    ],
    [
     "Initiative",
     "Players roll D10 plus Perception. Enemies have a base of 5 plus or minus their Perception. Players win ties; between players, higher Perception first."
    ],
    [
     "Ambush",
     "Ambushers take a surprise phase first. Ambushed characters can not use Defensive or Quick abilities. Normal initiative starts the next phase."
    ]
   ]
  },
  {
   "id": "actions",
   "title": "Actions and Movement",
   "group": "Combat",
   "entries": [
    [
     "Standard",
     "One Standard ability on your own turn."
    ],
    [
     "Quick",
     "Once per phase, at any time, resolving when played (even between an enemy's movement and its attack)."
    ],
    [
     "Defensive",
     "Once per phase, as a reaction to an enemy's attack. Block and dodge use this reaction."
    ],
    [
     "Extra actions",
     "Effects that grant extra actions double Standard abilities only, are short, and do not stack with each other."
    ],
    [
     "Movement",
     "5M plus Speed, minimum 2M. Or make a Speed roll (D10 plus Speed) and move exactly what you roll, same 2M minimum."
    ],
    [
     "Charge",
     "Move at least 4M in a straight line toward a target, then attack it the same turn."
    ],
    [
     "Contests",
     "Both roll D10 plus the named stat; higher wins. Ties go to the defender, except dodges, where ties go to the attacker."
    ]
   ]
  },
  {
   "id": "cards",
   "title": "The Tactical Deck",
   "group": "Combat",
   "entries": [
    [
     "Paying",
     "An ability can be paid for with a card of its rarity or higher."
    ],
    [
     "Hand",
     "Draw 3 at the start of combat. Each played card is replaced immediately."
    ],
    [
     "Pairs",
     "Two cards of the same rarity play as one card a rarity higher (two Legendaries make a Mythic)."
    ],
    [
     "Re-Evaluate",
     "A Standard action with no card: discard 1 to 3 cards and draw back to 3."
    ],
    [
     "Out of cards",
     "You may still use Basic abilities, with no card."
    ],
    [
     "Disoriented",
     "Abilities need a card one rarity higher."
    ],
    [
     "Suit riders",
     "Unlocked by Tactics. Spades: reroll one damage die. Hearts: recovery roll or heal 1D4. Diamonds: reroll a natural 1 or failed accuracy. Clubs: +2 armor until your next turn."
    ],
    [
     "Between fights",
     "The deck lasts until a full rest. A breather recovers 8 cards from the discard once per day. A full rest reshuffles everything."
    ],
    [
     "Outside combat",
     "No cards. Basic to Uncommon usually need no roll. Rare and above need a D10: about 4 for Rare, 7 for Epic, 9 for Legendary. On a failure, wait an encounter and try again."
    ]
   ]
  },
  {
   "id": "damage",
   "title": "Damage",
   "group": "Combat",
   "entries": [
    [
     "Damage modifier",
     "Strength, Agility, or Knowledge added to every die: +½ per D4 or D6, +1 per D8 to D12, +2 per D20. An attack bonus is a damage modifier."
    ],
    [
     "Weapon tier",
     "A weapon adds its tier to one strike per attack. Shield strikes add the shield's tier the same way."
    ],
    [
     "Natural 1s",
     "A strike with several dice only fails if every die rolls a 1."
    ],
    [
     "Thresholds",
     "Unless an ability says per strike, thresholds read the total of the attack."
    ],
    [
     "Percentages",
     "Percentage bonuses add together and apply once, after all flat modifiers."
    ],
    [
     "Physical",
     "Weapons. Reduced by armor."
    ],
    [
     "Elemental",
     "Fire, frost, and shock. Reduced by armor unless stated; shock ignores worn metal armor."
    ],
    [
     "Psychic",
     "Ignores armor, reduced by magic resistance."
    ],
    [
     "Radiant",
     "Holy damage that ignores physical armor against undead and unholy targets."
    ],
    [
     "Soul",
     "Soul Rifting damage that ignores physical armor."
    ],
    [
     "Stack damage",
     "Bleed, flame, poison, and acid. Ignores armor and takes no damage modifier."
    ]
   ]
  },
  {
   "id": "defense",
   "title": "Defense",
   "group": "Combat",
   "entries": [
    [
     "Dodge",
     "Basic Defensive. Agility contest against the attacker; ties go to the attacker. A failed dodge takes 1.5x damage. A natural 1 fails."
    ],
    [
     "Block",
     "Basic Defensive. Block rolls add the shield's tier. A natural 1 fails."
    ],
    [
     "Heavy armor",
     "2 armor per material tier, starting at 2 for Tier 0. Under 3 Strength, it reduces Speed by 2."
    ],
    [
     "Light armor",
     "1 armor per material tier, starting at 1 for Tier 0."
    ],
    [
     "Natural armor",
     "Racial armor and perks such as Thick Skin. Adds to worn armor."
    ],
    [
     "Magic armor",
     "From Alteration. Adds to other armor but not to other Alteration armor."
    ],
    [
     "Resistance",
     "Percentage reduction after armor. Resistances add, capped at 75%. Immunity is separate."
    ],
    [
     "Condition",
     "Weapons and armor break at Condition 0."
    ]
   ]
  },
  {
   "id": "stacks",
   "title": "Stacks and Conditions",
   "group": "Combat",
   "entries": [
    [
     "Damaging stacks",
     "Bleed, flame, poison, and acid. Each deals 1D4 at the end of the phase. Recovery removes 3 or half, whichever is more."
    ],
    [
     "Frozen",
     "At 3+ an entity is Chilled: no Defensive abilities, and Quick abilities only as Standard on its own turn. More frozen stacks than its level: frozen solid until it recovers."
    ],
    [
     "Paralysis",
     "Each stack is -1 Strength and Agility. More stacks than its level: paralyzed until it recovers."
    ],
    [
     "Static",
     "Stored charge that shock abilities can discharge for damage."
    ],
    [
     "Calm, Anger, Fear",
     "More of one than 50% of its level: Knowledge check against 1D10 + those stacks or be calmed, enraged, or terrified for a phase."
    ],
    [
     "Recovery",
     "D4 on the afflicted entity's turn. After a new stack a 4 is needed; the target drops by 1 each phase down to 2. A 1 never recovers."
    ],
    [
     "Disoriented",
     "All abilities have their rarity increased by one."
    ],
    [
     "Weakened",
     "Stats reduced by an ability."
    ],
    [
     "Silenced",
     "Can not cast magic abilities."
    ],
    [
     "Invisible",
     "Can not be seen, but can be perceived through interactions with physical objects."
    ],
    [
     "Immobilized",
     "Can not move."
    ]
   ]
  },
  {
   "id": "stealth",
   "title": "Sneak Attacks",
   "group": "Combat",
   "entries": [
    [
     "Hiding",
     "A contest of sneaking against each observer's Perception. In combat it needs cover and Roguery Base Tier 2 (Standard) or the Shadow path (Quick)."
    ],
    [
     "Sneak attack",
     "An attack against an unaware target. It can not be dodged or blocked, and it reveals the attacker. Bonus damage comes only from perks."
    ]
   ]
  },
  {
   "id": "death",
   "title": "Dying and Death",
   "group": "Combat",
   "entries": [
    [
     "Downed",
     "At 0 HP or below. Can not act, and a 3-phase death clock starts."
    ],
    [
     "Hit while downed",
     "Removes one phase from the clock per hit."
    ],
    [
     "Stabilize",
     "Adjacent ally, Standard action, Knowledge check of 6+. Stops the clock; stays downed at 0 HP until healed outside combat or rested."
    ],
    [
     "Healing back",
     "Only Deep Healing (Restoration Base Tier 4) heals a character below 0 HP, and only within the 3 phases."
    ],
    [
     "Prevent falling",
     "Only one such effect may trigger per character per combat."
    ],
    [
     "Death",
     "When the clock runs out. Permanent unless the GM rules otherwise."
    ]
   ]
  },
  {
   "id": "rest",
   "title": "Rest",
   "group": "World",
   "entries": [
    [
     "Breather",
     "About 10 minutes, once per day. Recover 8 cards from the discard, regain 25% of maximum HP, clear all stacks."
    ],
    [
     "Full rest",
     "6 to 8 hours, once per day. Full HP, full deck reshuffle, stacks cleared, once-per-day and once-per-rest abilities restored. Stabilized characters recover."
    ]
   ]
  },
  {
   "id": "exploration",
   "title": "Exploration",
   "group": "World",
   "entries": [
    [
     "Carrying",
     "10 + Strength significant items. Over that: -2 Speed. At double: no running or rolled movement."
    ],
    [
     "Falling",
     "1D6 per 2.5M fallen, ignoring armor. Under 2.5M is harmless."
    ],
    [
     "Climbing",
     "Half speed. Agility or Strength check of 6+ (rough) or 9+ (sheer); failure means a fall."
    ],
    [
     "Difficult terrain",
     "Costs double movement."
    ],
    [
     "Chases",
     "Both make Speed rolls each phase; the leader gains 1M per point of difference. Escape at a 10M lead or by breaking line of sight."
    ],
    [
     "Traps",
     "Snare: Agility contest or be held until Strength 6+. Spike: D10 ignoring armor. Spot or disarm: Perception or Agility 6 + the trapper's Roguery bonus."
    ],
    [
     "Tracking",
     "Perception 5+ for fresh tracks, 8+ for a day old, +3 for rain or hard ground."
    ],
    [
     "NPC attitudes",
     "Hostile, Unfriendly, Neutral, Friendly, Allied. A successful persuasion moves one step (two if it beats the difficulty by 5); failing by 5+ moves one step worse."
    ],
    [
     "Languages",
     "Everyone speaks Common plus their race's language."
    ]
   ]
  },
  {
   "id": "crafting",
   "title": "Crafting and Enchanting",
   "group": "World",
   "entries": [
    [
     "The check",
     "D10 + Knowledge + crafting bonus against the recipe's threshold."
    ],
    [
     "Results",
     "Natural 1 loses all materials. Below threshold loses half (none at Crafting Base Tier 4). Beat by 5+: great success, +50% Condition."
    ],
    [
     "Time",
     "Small 2h, medium 4h, large 8h, plus 1h per material tier. Careful work doubles time for +2; rushing halves it for -2."
    ],
    [
     "Where",
     "Field kit for Tier 0 to 1 and repairs. Higher work needs a forge or enchanting circle."
    ],
    [
     "Materials",
     "About 40% of the finished item's value."
    ],
    [
     "Enchant ranks",
     "Ranks 1 to 4, thresholds 10, 14, 18, 22. An item holds up to rank 1 + half its material tier."
    ],
    [
     "Active enchantments",
     "2 soul shards per rank to create, 1 per rank per use. Quick action, no card."
    ],
    [
     "Passive enchantments",
     "5 soul shards per rank to create, always on."
    ],
    [
     "Soul shards",
     "Half the creature's level, rounded up (minimum 1). Mage merchants sell at 25 marks, buy at 12. Kept in a soul vessel (10 each)."
    ]
   ]
  },
  {
   "id": "currency",
   "title": "Marks and Prices",
   "group": "World",
   "entries": [
    [
     "Coins",
     "Copper mark = 1. Silver mark = 10. Gold mark = 100. Players track one total."
    ],
    [
     "Prices",
     "Meal about 1, inn night about 3, laborer's day about 5, horse about 150. Iron sword 55; PriSteel sword 8,000."
    ],
    [
     "Selling",
     "Merchants buy at 50% of value (60% with Haggler)."
    ],
    [
     "Consumables",
     "Drinking, throwing, or applying is a Quick action with no card. Thrown items: 80% accuracy at 5M."
    ]
   ]
  }
 ],
 "tables": {
  "rarities": [
   "Basic",
   "Common",
   "Uncommon",
   "Rare",
   "Epic",
   "Legendary",
   "Mythic"
  ],
  "deck": [
   {
    "rarity": "Basic",
    "cards": 22,
    "mapping": "2 through 6, and the black 7s",
    "pip": "2–6"
   },
   {
    "rarity": "Common",
    "cards": 16,
    "mapping": "Red 7s, 8 through 10, and the black Jacks",
    "pip": "8–10"
   },
   {
    "rarity": "Uncommon",
    "cards": 8,
    "mapping": "Red Jacks, Queens, and the black Kings",
    "pip": "Q"
   },
   {
    "rarity": "Rare",
    "cards": 4,
    "mapping": "Red Kings and the black Aces",
    "pip": "K"
   },
   {
    "rarity": "Epic",
    "cards": 2,
    "mapping": "Red Aces",
    "pip": "A"
   },
   {
    "rarity": "Legendary",
    "cards": 1,
    "mapping": "The joker",
    "pip": "★"
   },
   {
    "rarity": "Mythic",
    "cards": 0,
    "mapping": "Two Legendaries paired",
    "pip": "✦"
   }
  ],
  "tactics": {
   "Basic": {
    "Basic": [
     1,
     20
    ]
   },
   "Fair": {
    "Basic": [
     1,
     10
    ],
    "Common": [
     11,
     16
    ],
    "Uncommon": [
     17,
     20
    ]
   },
   "Good": {
    "Basic": [
     1,
     6
    ],
    "Common": [
     7,
     12
    ],
    "Uncommon": [
     13,
     18
    ],
    "Rare": [
     19,
     20
    ]
   },
   "Great": {
    "Basic": [
     1,
     4
    ],
    "Common": [
     5,
     9
    ],
    "Uncommon": [
     10,
     14
    ],
    "Rare": [
     15,
     18
    ],
    "Epic": [
     19,
     20
    ]
   },
   "Excellent": {
    "Common": [
     1,
     5
    ],
    "Uncommon": [
     6,
     10
    ],
    "Rare": [
     11,
     15
    ],
    "Epic": [
     16,
     19
    ],
    "Legendary": [
     20,
     20
    ]
   },
   "Mythic": {
    "Uncommon": [
     1,
     6
    ],
    "Rare": [
     7,
     12
    ],
    "Epic": [
     13,
     16
    ],
    "Legendary": [
     17,
     19
    ],
    "Mythic": [
     20,
     20
    ]
   }
  },
  "cooldowns": {
   "Rare": 1,
   "Epic": 2,
   "Legendary": 3,
   "Mythic": "once per combat"
  },
  "roles": {
   "Minion": 0.25,
   "Standard": 1,
   "Elite": 3,
   "Boss": 10
  },
  "sizes": [
   [
    "Tiny",
    "4 per grid space",
    "+2 to dodge rolls. -20% accuracy to target."
   ],
   [
    "Small",
    "2 per grid space",
    "+1 to dodge rolls. -10% accuracy to target."
   ],
   [
    "Average",
    "1 grid space",
    "No modifiers."
   ],
   [
    "Large",
    "2 grid spaces",
    "-1 to dodge rolls. +10% accuracy to target."
   ],
   [
    "Huge",
    "4 grid spaces",
    "-2 to dodge rolls. +20% accuracy to target."
   ],
   [
    "Massive",
    "9 grid spaces",
    "-4 to dodge rolls. +40% accuracy to target."
   ]
  ],
  "wealth": [
   {
    "roll": 1,
    "marks": 0,
    "gear": "Damaged: basic Tier 0 gear at half Condition."
   },
   {
    "roll": 2,
    "marks": 35,
    "gear": "Worn: basic Tier 0 gear at three quarters Condition."
   },
   {
    "roll": 3,
    "marks": 70,
    "gear": "Functional: basic Tier 0 gear in good condition."
   },
   {
    "roll": 4,
    "marks": 100,
    "gear": "Functional low-level gear (Tier 0 to 1) that supports the character's build."
   }
  ],
  "outOfCombatXP": [
   [
    "Minor",
    "0.5 SE",
    "Solving a puzzle, a tense persuasion, a hard climb"
   ],
   [
    "Significant",
    "1 SE",
    "Surviving a trap gauntlet, an important negotiation, uncovering a key secret"
   ],
   [
    "Major",
    "2 SE",
    "Completing a quest, overcoming a notable foe without a fight, saving a village"
   ],
   [
    "Epic",
    "5 SE",
    "Finishing a story arc"
   ]
  ],
  "materials": [
   [
    0,
    "Oak",
    "Wood for bows, shields, staves, and spear shafts. Light and cheap."
   ],
   [
    0,
    "Bronze",
    "Soft and easy to work; the first metal most smiths learn."
   ],
   [
    0,
    "Iron",
    "The common standard for tools, weapons, and armor everywhere."
   ],
   [
    1,
    "Steel",
    "Refined iron: reliable, and the mark of a real professional."
   ],
   [
    1,
    "D-Iron",
    "Dwarven iron: denser and far more durable than common iron."
   ],
   [
    1,
    "Silv-Steel",
    "Silvered steel. Weaker than plain steel, but deals 50% more damage to shapeshifters such as werewolves."
   ],
   [
    2,
    "D-Steel",
    "Dwarven steel: the dwarves' finest common alloy, and the toughest Tier 2 metal."
   ],
   [
    2,
    "Etherian",
    "A dark-elf alloy from Etriun: light and quiet."
   ],
   [
    2,
    "Lyran Stone",
    "River stone from Lyra's Well, shaped and hardened by Lyros craftsmen."
   ],
   [
    3,
    "Glacius",
    "Frost-forged metal from the north; always cold to the touch."
   ],
   [
    3,
    "Aurausheen",
    "The golden light-metal of the Imperios, said to carry Aurau's blessing."
   ],
   [
    4,
    "Mag-Glass",
    "Glass grown through with magic. Fragile, but it carries enchantments well."
   ],
   [
    4,
    "Druiniun",
    "A sea metal from the Isles of Drune that never rusts."
   ],
   [
    5,
    "Pitch",
    "Black volcanic metal from the Ashlands: very heavy and very hard."
   ],
   [
    6,
    "PriGlass",
    "Primordial glass. Fragile, but saturated with primordial power."
   ],
   [
    7,
    "PriSteel",
    "Primordial steel, the strongest material known."
   ]
  ],
  "consumables": [
   [
    "Minor Healing Potion",
    "Heal 2D6.",
    15
   ],
   [
    "Healing Potion",
    "Heal 4D6.",
    40
   ],
   [
    "Greater Healing Potion",
    "Heal 6D6.",
    100
   ],
   [
    "Superior Healing Potion",
    "Heal 8D6.",
    250
   ],
   [
    "Recovery Tonic",
    "An immediate recovery roll against every stack; each succeeds on 2+.",
    30
   ],
   [
    "Antidote",
    "Remove all poison and acid stacks.",
    25
   ],
   [
    "Bandage",
    "Out of combat, remove all bleed stacks. +2 to a check to stabilize a downed character.",
    2
   ],
   [
    "Elixir of Might",
    "+2 Strength for one combat.",
    150
   ],
   [
    "Elixir of Grace",
    "+2 Agility for one combat.",
    150
   ],
   [
    "Elixir of Insight",
    "+2 Knowledge for one combat.",
    150
   ],
   [
    "Elixir of Swiftness",
    "+2 Speed for one combat.",
    80
   ],
   [
    "Resistance Elixir",
    "25% resistance to one element for one combat.",
    60
   ],
   [
    "Fire Bomb",
    "1 strike D10 to every entity within 2M, adding a flame stack.",
    40
   ],
   [
    "Frost Bomb",
    "1 strike D8 to every entity within 2M, adding 2 frozen stacks.",
    40
   ],
   [
    "Acid Flask",
    "1 strike D6 to the target, adding 2 acid stacks; its armor or weapon loses 2 Condition.",
    35
   ],
   [
    "Smoke Bomb",
    "A 3M cloud that blocks sight for 1 phase.",
    25
   ],
   [
    "Weapon Poison",
    "The next 3 strikes that deal damage each add a poison stack.",
    35
   ]
  ],
  "enchantments": [
   [
    "Flame Brand",
    "Weapon",
    "Active",
    "One strike of the attack deals +1D6 fire damage per rank and adds a flame stack."
   ],
   [
    "Frost Brand",
    "Weapon",
    "Active",
    "One strike deals +1D6 frost damage per rank and adds a frozen stack."
   ],
   [
    "Storm Brand",
    "Weapon",
    "Active",
    "One strike deals +1D6 shock damage per rank, ignoring metal armor, and adds a static stack."
   ],
   [
    "Keen Edge",
    "Weapon",
    "Passive",
    "+1AP per rank."
   ],
   [
    "Lifedrinker",
    "Weapon",
    "Passive",
    "Once per attack, when a strike deals damage, heal 1 HP per rank."
   ],
   [
    "Returning",
    "Weapon",
    "Passive",
    "Rank 1 only: a thrown weapon returns to your hand after the attack."
   ],
   [
    "Warding",
    "Armor",
    "Passive",
    "10% resistance per rank to one chosen element."
   ],
   [
    "Hardening",
    "Armor or shield",
    "Active",
    "+2 armor per rank until your next turn."
   ],
   [
    "Thorns",
    "Armor",
    "Passive",
    "Enemies that hit you in melee take 2 damage per rank."
   ],
   [
    "Featherweight",
    "Armor",
    "Passive",
    "Rank 1 only: heavy armor never slows you and does not count toward carrying capacity."
   ],
   [
    "Vitality",
    "Trinket",
    "Passive",
    "+5 maximum HP per rank."
   ],
   [
    "Insight",
    "Trinket",
    "Passive",
    "+1 to Perception, Speech, or Speed at rank 2; +2 at rank 4."
   ],
   [
    "Blink",
    "Trinket",
    "Active",
    "Teleport 2M per rank to a space you can see."
   ],
   [
    "Soul Well",
    "Trinket",
    "Passive",
    "Holds 5 soul shards per rank."
   ]
  ]
 }
};
