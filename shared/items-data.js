// Primordium 2.0 items: materials, gear and its prices, consumables, Condition and armor rules, selling, and shop
// stock settings. One copy, read by the GM tool (Shops), the character sheet (buying, the material picker), and the Codex
// (Materials, Prices, Condition, and consumables tables). Rules come from Game Guide 2.0 and the Game Master's Guide 2.0;
// shopTypes, stockQty, and rareChance are the GM tool's defaults for filling a shop. Item rules are in shared/items.js.
window.PRIMORDIUM_ITEMS = {
 "priceNote": "Marks. Silv-Steel costs the same as Steel. Crafting materials are about 40% of these prices.",
 "materials": [
  {
   "name": "Oak",
   "tier": 0,
   "kind": "wood",
   "notes": "Wood for bows, shields, staves, and spear shafts. Light and cheap."
  },
  {
   "name": "Bronze",
   "tier": 0,
   "kind": "metal",
   "notes": "Soft and easy to work; the first metal most smiths learn."
  },
  {
   "name": "Iron",
   "tier": 0,
   "kind": "metal",
   "notes": "The common standard for tools, weapons, and armor everywhere."
  },
  {
   "name": "Steel",
   "tier": 1,
   "kind": "metal",
   "notes": "Refined iron: reliable, and the mark of a real professional."
  },
  {
   "name": "D-Iron",
   "tier": 1,
   "kind": "metal",
   "condition": 1.5,
   "notes": "Dwarven iron: denser and far more durable than common iron."
  },
  {
   "name": "Silv-Steel",
   "tier": 1,
   "kind": "metal",
   "notes": "Silvered steel. Weaker than plain steel, but deals 50% more damage to shapeshifters such as werewolves."
  },
  {
   "name": "D-Steel",
   "tier": 2,
   "kind": "metal",
   "condition": 1.5,
   "notes": "Dwarven steel: the dwarves' finest common alloy, and the toughest Tier 2 metal."
  },
  {
   "name": "Etherian",
   "tier": 2,
   "kind": "metal",
   "notes": "A dark-elf alloy from Etriun: light and quiet."
  },
  {
   "name": "Lyran Stone",
   "tier": 2,
   "kind": "stone",
   "notes": "River stone from Lyra's Well, shaped and hardened by Lyros craftsmen."
  },
  {
   "name": "Glacius",
   "tier": 3,
   "kind": "metal",
   "notes": "Frost-forged metal from the north; always cold to the touch."
  },
  {
   "name": "Aurausheen",
   "tier": 3,
   "kind": "metal",
   "notes": "The golden light-metal of the Imperios, said to carry Aurau's blessing."
  },
  {
   "name": "Mag-Glass",
   "tier": 4,
   "kind": "glass",
   "condition": 0.5,
   "notes": "Glass grown through with magic. Fragile, but it carries enchantments well."
  },
  {
   "name": "Druiniun",
   "tier": 4,
   "kind": "metal",
   "notes": "A sea metal from the Isles of Drune that never rusts."
  },
  {
   "name": "Pitch",
   "tier": 5,
   "kind": "metal",
   "condition": 1.5,
   "notes": "Black volcanic metal from the Ashlands: very heavy and very hard."
  },
  {
   "name": "PriGlass",
   "tier": 6,
   "kind": "glass",
   "condition": 0.5,
   "notes": "Primordial glass. Fragile, but saturated with primordial power."
  },
  {
   "name": "PriSteel",
   "tier": 7,
   "kind": "metal",
   "notes": "Primordial steel, the strongest material known."
  }
 ],
 "gear": [
  {
   "name": "Dagger",
   "category": "weapon",
   "prices": [
    30,
    60,
    120,
    260,
    510,
    1050,
    2150,
    4350
   ]
  },
  {
   "name": "Spear",
   "category": "weapon",
   "wood": true,
   "prices": [
    35,
    70,
    140,
    300,
    600,
    1200,
    2500,
    5100
   ]
  },
  {
   "name": "One Handed Axe",
   "category": "weapon",
   "prices": [
    50,
    100,
    200,
    420,
    850,
    1750,
    3600,
    7250
   ]
  },
  {
   "name": "Mace",
   "category": "weapon",
   "prices": [
    50,
    100,
    200,
    420,
    850,
    1750,
    3600,
    7250
   ]
  },
  {
   "name": "Bow",
   "category": "weapon",
   "wood": true,
   "prices": [
    50,
    100,
    200,
    420,
    850,
    1750,
    3600,
    7250
   ]
  },
  {
   "name": "Sword",
   "category": "weapon",
   "prices": [
    55,
    110,
    220,
    470,
    940,
    1900,
    3950,
    8000
   ]
  },
  {
   "name": "Battle Axe",
   "category": "weapon",
   "prices": [
    80,
    160,
    320,
    680,
    1350,
    2800,
    5750,
    11600
   ]
  },
  {
   "name": "Crossbow",
   "category": "weapon",
   "prices": [
    85,
    170,
    340,
    720,
    1450,
    3000,
    6100,
    12300
   ]
  },
  {
   "name": "Greatsword",
   "category": "weapon",
   "prices": [
    90,
    180,
    360,
    760,
    1550,
    3150,
    6500,
    13050
   ]
  },
  {
   "name": "Warhammer",
   "category": "weapon",
   "prices": [
    90,
    180,
    360,
    760,
    1550,
    3150,
    6500,
    13050
   ]
  },
  {
   "name": "Shield",
   "category": "shield",
   "wood": true,
   "prices": [
    45,
    90,
    180,
    380,
    760,
    1600,
    3250,
    6500
   ]
  },
  {
   "name": "Light armor",
   "category": "armor",
   "weight": "light",
   "set": true,
   "prices": [
    40,
    80,
    160,
    340,
    680,
    1400,
    2900,
    5800
   ]
  },
  {
   "name": "Heavy armor",
   "category": "armor",
   "weight": "heavy",
   "set": true,
   "prices": [
    120,
    240,
    480,
    1000,
    2050,
    4200,
    8650,
    17400
   ]
  },
  {
   "name": "Arrows",
   "category": "ammo",
   "bundle": 20,
   "prices": [
    5,
    10,
    20,
    40,
    85,
    180,
    360,
    720
   ]
  },
  {
   "name": "Bolts",
   "category": "ammo",
   "bundle": 20,
   "prices": [
    5,
    10,
    20,
    40,
    85,
    180,
    360,
    720
   ]
  }
 ],
 "condition": {
  "weapon": {
   "start": 12,
   "perTier": 3
  },
  "shield": {
   "start": 14,
   "perTier": 3
  },
  "armor": {
   "start": 10,
   "perTier": 3
  }
 },
 "armorValue": {
  "light": {
   "start": 1,
   "perTier": 1
  },
  "heavy": {
   "start": 2,
   "perTier": 2
  }
 },
 "selling": {
  "rate": 0.5,
  "hagglerPerk": "Haggler",
  "hagglerBuy": 0.8,
  "hagglerSell": 1.2
 },
 "consumables": [
  {
   "name": "Minor Healing Potion",
   "effect": "Heal 2D6.",
   "price": 15
  },
  {
   "name": "Healing Potion",
   "effect": "Heal 4D6.",
   "price": 40
  },
  {
   "name": "Greater Healing Potion",
   "effect": "Heal 6D6.",
   "price": 100
  },
  {
   "name": "Superior Healing Potion",
   "effect": "Heal 8D6.",
   "price": 250
  },
  {
   "name": "Recovery Tonic",
   "effect": "An immediate recovery roll against every stack; each succeeds on 2+.",
   "price": 30
  },
  {
   "name": "Antidote",
   "effect": "Remove all poison and acid stacks.",
   "price": 25
  },
  {
   "name": "Bandage",
   "effect": "Out of combat, remove all bleed stacks. +2 to a check to stabilize a downed character.",
   "price": 2
  },
  {
   "name": "Elixir of Might",
   "effect": "+2 Strength for one combat.",
   "price": 150
  },
  {
   "name": "Elixir of Grace",
   "effect": "+2 Agility for one combat.",
   "price": 150
  },
  {
   "name": "Elixir of Insight",
   "effect": "+2 Knowledge for one combat.",
   "price": 150
  },
  {
   "name": "Elixir of Swiftness",
   "effect": "+2 Speed for one combat.",
   "price": 80
  },
  {
   "name": "Resistance Elixir",
   "effect": "25% resistance to one element for one combat.",
   "price": 60
  },
  {
   "name": "Fire Bomb",
   "effect": "1 strike D10 to every entity within 2M, adding a flame stack.",
   "price": 40
  },
  {
   "name": "Frost Bomb",
   "effect": "1 strike D8 to every entity within 2M, adding 2 frozen stacks.",
   "price": 40
  },
  {
   "name": "Acid Flask",
   "effect": "1 strike D6 to the target, adding 2 acid stacks; its armor or weapon loses 2 Condition.",
   "price": 35
  },
  {
   "name": "Smoke Bomb",
   "effect": "A 3M cloud that blocks sight for 1 phase.",
   "price": 25
  },
  {
   "name": "Weapon Poison",
   "effect": "The next 3 strikes that deal damage each add a poison stack.",
   "price": 35
  }
 ],
 "other": [
  {
   "name": "Soul shard",
   "price": 25,
   "sell": 12,
   "notes": "Kept in a soul vessel (10 each). Mage merchants sell at 25 marks and buy at 12."
  }
 ],
 "gearTiers": [
  {
   "levels": [
    1,
    4
   ],
   "common": [
    0
   ],
   "rare": [
    1
   ]
  },
  {
   "levels": [
    5,
    8
   ],
   "common": [
    1
   ],
   "rare": [
    2
   ]
  },
  {
   "levels": [
    9,
    12
   ],
   "common": [
    2,
    3
   ],
   "rare": []
  },
  {
   "levels": [
    13,
    16
   ],
   "common": [
    3,
    4
   ],
   "rare": []
  },
  {
   "levels": [
    17,
    20
   ],
   "common": [
    4,
    5
   ],
   "rare": []
  },
  {
   "levels": [
    21,
    99
   ],
   "common": [
    5,
    6,
    7
   ],
   "rare": []
  }
 ],
 "shopTypes": {
  "Blacksmith": {
   "stock": [
    "Dagger",
    "Sword",
    "One Handed Axe",
    "Mace",
    "Spear",
    "Greatsword",
    "Battle Axe",
    "Warhammer"
   ]
  },
  "Armorer": {
   "stock": [
    "Shield",
    "Light armor",
    "Heavy armor"
   ]
  },
  "Bowyer and fletcher": {
   "stock": [
    "Bow",
    "Crossbow",
    "Arrows",
    "Bolts"
   ]
  },
  "Alchemist": {
   "stock": [
    "Minor Healing Potion",
    "Healing Potion",
    "Greater Healing Potion",
    "Superior Healing Potion",
    "Recovery Tonic",
    "Antidote",
    "Elixir of Might",
    "Elixir of Grace",
    "Elixir of Insight",
    "Elixir of Swiftness",
    "Resistance Elixir",
    "Fire Bomb",
    "Frost Bomb",
    "Acid Flask",
    "Smoke Bomb",
    "Weapon Poison"
   ]
  },
  "General store": {
   "stock": [
    "Bandage",
    "Minor Healing Potion",
    "Antidote",
    "Smoke Bomb",
    "Dagger",
    "Spear",
    "Arrows",
    "Bolts"
   ],
   "maxTier": 0
  },
  "Mage merchant": {
   "stock": [
    "Soul shard"
   ]
  }
 },
 "stockQty": {
  "weapon": [
   1,
   2
  ],
  "shield": [
   1,
   2
  ],
  "armor": [
   1,
   1
  ],
  "ammo": [
   2,
   5
  ],
  "consumable": [
   1,
   4
  ],
  "other": [
   5,
   15
  ]
 },
 "rareChance": 0.35
};
