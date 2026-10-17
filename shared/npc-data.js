// Primordium 2.0 NPC Guide: all creatures, generated from the NPC Guide working sheet.
window.PRIMORDIUM_NPCS = [
 {
  "name": "Wolf",
  "family": "Wolves",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": 2,
   "KNO": -5,
   "SPD": 5,
   "PER": 3,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "None",
  "description": "Standard",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D10.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 0
    }
   }
  ]
 },
 {
  "name": "Ice Wolf",
  "family": "Wolves",
  "role": "Standard",
  "level": 2,
  "tactics": "Basic",
  "hp": 27,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 1,
   "AGI": 2,
   "KNO": -5,
   "SPD": 5,
   "PER": 4,
   "SPE": -5
  },
  "xp": 32,
  "attributes": "Frost Resistance: 50% resistance to frost/cold damage.",
  "description": "White or light grey",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D12+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "Ash Wolf",
  "family": "Wolves",
  "role": "Standard",
  "level": 3,
  "tactics": "Basic",
  "hp": 25,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": -5,
   "SPD": 5,
   "PER": 2,
   "SPE": -5
  },
  "xp": 38,
  "attributes": "Heat Resistance: 50% resistance to fire/heat damage.",
  "description": "Dark with glowing orange eyes",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   }
  ]
 },
 {
  "name": "Dire Wolf",
  "family": "Wolves",
  "role": "Elite",
  "level": 5,
  "tactics": "Fair",
  "hp": 85,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 3,
   "KNO": -3,
   "SPD": 8,
   "PER": 4,
   "SPE": -5
  },
  "xp": 150,
  "attributes": "None",
  "description": "Very large wolves",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Rending Claws",
    "rarity": "Common",
    "text": "2 Strikes D12+7.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 7
    }
   },
   {
    "name": "Ear-Splitting Howl",
    "rarity": "Uncommon",
    "text": "All enemies within 10M roll Knowledge against 6+ or gain 2 Fear stacks."
   }
  ]
 },
 {
  "name": "Shattered Wolf",
  "family": "Wolves",
  "role": "Elite",
  "level": 8,
  "tactics": "Fair",
  "hp": 105,
  "armor": 2,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 5,
   "AGI": 4,
   "KNO": -3,
   "SPD": 10,
   "PER": 5,
   "SPE": -5
  },
  "xp": 204,
  "attributes": "Unholy. Magic Resistance: 50% resistance to magic damage.",
  "description": "Wolves twisted by Primordium",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "2 Strikes D12+5.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 5
    }
   },
   {
    "name": "Warped Rend",
    "rarity": "Common",
    "text": "2 Strikes D20+4. Damaging strikes add one random negative stack.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 4
    }
   },
   {
    "name": "Warped Howl",
    "rarity": "Uncommon",
    "text": "All enemies within 10M roll Knowledge against 7+ or gain 2 Fear stacks."
   }
  ]
 },
 {
  "name": "Avra Hound",
  "family": "Avra Hounds",
  "role": "Standard",
  "level": 3,
  "tactics": "Basic",
  "hp": 30,
  "armor": 0,
  "size": "Average",
  "alignment": "Lawful-Evil",
  "stats": {
   "STR": 2,
   "AGI": 2,
   "KNO": -5,
   "SPD": 7,
   "PER": 4,
   "SPE": -5
  },
  "xp": 38,
  "attributes": "Unholy.",
  "description": "Standard",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   },
   {
    "name": "Terrifying Howl",
    "rarity": "Basic",
    "text": "Howl at a target. Target must perform a strength, knowledge, or perception check of 6+ or they become terrified and flee until they recover."
   }
  ]
 },
 {
  "name": "Alpha Avra Hound",
  "family": "Avra Hounds",
  "role": "Elite",
  "level": 6,
  "tactics": "Good",
  "hp": 85,
  "armor": 2,
  "size": "Large",
  "alignment": "Lawful-Evil",
  "stats": {
   "STR": 5,
   "AGI": 4,
   "KNO": -2,
   "SPD": 10,
   "PER": 6,
   "SPE": -3
  },
  "xp": 168,
  "attributes": "Unholy.",
  "description": "Large pack leaders",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+6. Damaging strikes add a paralysis stack to the target.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 6
    }
   },
   {
    "name": "Shadow Claws",
    "rarity": "Common",
    "text": "2 Strikes D10+7.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 7
    }
   },
   {
    "name": "Alpha Howl",
    "rarity": "Uncommon",
    "text": "Howl at a target. Target must perform a strength, knowledge, and perception check of 6+ on at least 2 checks or they become terrified and flee until they recover."
   },
   {
    "name": "Avranahn's Lunge",
    "rarity": "Rare",
    "text": "1 Strike 2D20+13. The hound moves up to 10M to reach the target first.",
    "cooldown": 1,
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 13
    }
   }
  ]
 },
 {
  "name": "Bear",
  "family": "Bears",
  "role": "Elite",
  "level": 6,
  "tactics": "Fair",
  "hp": 85,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 10,
   "AGI": 2,
   "KNO": -5,
   "SPD": 3,
   "PER": 0,
   "SPE": -5
  },
  "xp": 168,
  "attributes": "None",
  "description": "Standard",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Claw",
    "rarity": "Common",
    "text": "2 Strikes D10+8.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 8
    }
   },
   {
    "name": "Maul",
    "rarity": "Uncommon",
    "text": "2 Strikes D12+10. Roll strength against the target; if the bear wins, the target is disoriented for 1 phase.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 10
    }
   }
  ]
 },
 {
  "name": "Frost Bear",
  "family": "Bears",
  "role": "Elite",
  "level": 10,
  "tactics": "Fair",
  "hp": 125,
  "armor": 3,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 10,
   "AGI": 3,
   "KNO": -4,
   "SPD": 2,
   "PER": 2,
   "SPE": -5
  },
  "xp": 240,
  "attributes": "Frost Resistance: 50% resistance to frost/cold damage.",
  "description": "White or light grey with thick fur",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+16.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 16
    }
   },
   {
    "name": "Claw",
    "rarity": "Common",
    "text": "2 Strikes 2D10+8.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 10,
     "flat": 8
    }
   },
   {
    "name": "Maul",
    "rarity": "Uncommon",
    "text": "2 Strikes 2D12+10. Roll strength against the target; if the bear wins, the target is disoriented for 1 phase.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 12,
     "flat": 10
    }
   }
  ]
 },
 {
  "name": "Ash Bear",
  "family": "Bears",
  "role": "Elite",
  "level": 15,
  "tactics": "Fair",
  "hp": 120,
  "armor": 5,
  "size": "Huge",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 15,
   "AGI": 0,
   "KNO": -5,
   "SPD": 2,
   "PER": 0,
   "SPE": -5
  },
  "xp": 330,
  "attributes": "Heat Resistance: 50% resistance to fire/heat damage.",
  "description": "",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike 2D20+14.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 14
    }
   },
   {
    "name": "Claw",
    "rarity": "Common",
    "text": "2 Strikes 2D12+13.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 12,
     "flat": 13
    }
   },
   {
    "name": "Molten Maul",
    "rarity": "Uncommon",
    "text": "2 Strikes 2D12+18. Damaging strikes add a flame stack.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 12,
     "flat": 18
    }
   }
  ]
 },
 {
  "name": "Shattered Bear",
  "family": "Bears",
  "role": "Elite",
  "level": 20,
  "tactics": "Good",
  "hp": 135,
  "armor": 5,
  "size": "Huge",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 20,
   "AGI": 2,
   "KNO": -4,
   "SPD": 5,
   "PER": 2,
   "SPE": -5
  },
  "xp": 420,
  "attributes": "Unholy. Magic Resistance: 50% resistance to magic damage.",
  "description": "Bears twisted by Primordium",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "2 Strikes D20+12.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 12
    }
   },
   {
    "name": "Claw",
    "rarity": "Common",
    "text": "4 Strikes 2D10+7.",
    "attack": {
     "strikes": 4,
     "dice": 2,
     "sides": 10,
     "flat": 7
    }
   },
   {
    "name": "Warped Maul",
    "rarity": "Uncommon",
    "text": "2 Strikes 3D12+14. Damaging strikes add one random negative stack.",
    "attack": {
     "strikes": 2,
     "dice": 3,
     "sides": 12,
     "flat": 14
    }
   },
   {
    "name": "Shattering Roar",
    "rarity": "Rare",
    "text": "1 Strike 2D20+25 to all enemies within 5M. Struck enemies roll Knowledge against 7+ or gain 2 Fear stacks.",
    "cooldown": 1,
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 25,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Giant Spider",
  "family": "Spiders",
  "role": "Standard",
  "level": 2,
  "tactics": "Basic",
  "hp": 22,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -2,
   "AGI": 2,
   "KNO": -5,
   "SPD": 4,
   "PER": 3,
   "SPE": -5
  },
  "xp": 32,
  "attributes": "Climb. Spider Silk: able to create sticky silk that can be used as traps, structures, and movement aids.",
  "description": "Standard",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D12+2. Damaging strikes add a poison stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 2
    }
   },
   {
    "name": "Entrap in Webbing",
    "rarity": "Basic",
    "text": "Roll agility vs melee range opponent. If Spider wins, the target is entrapped in webbing and must get 6+ on a strength check to escape. Entrapped targets can not use weapons, move, or cast most non-quick spells."
   }
  ]
 },
 {
  "name": "Woodland Spider",
  "family": "Spiders",
  "role": "Standard",
  "level": 2,
  "tactics": "Basic",
  "hp": 22,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -3,
   "AGI": 2,
   "KNO": -4,
   "SPD": 4,
   "PER": 4,
   "SPE": -5
  },
  "xp": 32,
  "attributes": "Climb. Woodland Spider Silk: particularly strong and hard to detect; a perception check of 8+ is required to spot it.",
  "description": "Generally brown. They spin webs between trees to catch prey",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D12+2. Damaging strikes add a poison stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 2
    }
   },
   {
    "name": "Entrap in Webbing",
    "rarity": "Basic",
    "text": "Roll agility vs melee range opponent. If Spider wins, the target is entrapped in webbing and must get 8+ on a strength check to escape. Entrapped targets can not use weapons, move, or cast most non-quick spells."
   }
  ]
 },
 {
  "name": "Mountain Spider",
  "family": "Spiders",
  "role": "Standard",
  "level": 4,
  "tactics": "Basic",
  "hp": 19,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 1,
   "KNO": -5,
   "SPD": 2,
   "PER": 2,
   "SPE": -5
  },
  "xp": 44,
  "attributes": "Climb.",
  "description": "Spiders with a rocky exoskeleton that lie in wait for prey",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20. Damaging strikes add a poison stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   },
   {
    "name": "Pounce",
    "rarity": "Basic",
    "text": "1 Strike D12+4. Roll strength vs an opponent within 5M. If the spider wins, the opponent is pinned and must win a strength roll to escape.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4
    }
   }
  ]
 },
 {
  "name": "Trap-Door Spider",
  "family": "Spiders",
  "role": "Standard",
  "level": 3,
  "tactics": "Basic",
  "hp": 25,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 1,
   "KNO": -5,
   "SPD": 2,
   "PER": 3,
   "SPE": -5
  },
  "xp": 38,
  "attributes": "Able to create burrows. Able to create webs. Nocturnal",
  "description": "Large spiders that wait in burrows for prey to come near.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20. Damaging strikes add a poison stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   },
   {
    "name": "Pounce",
    "rarity": "Basic",
    "text": "1 Strike D12+4. 2.5M range. Roll agility against the target; if the spider wins, the target can not attack until they recover.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4
    }
   }
  ]
 },
 {
  "name": "Acid Spider",
  "family": "Spiders",
  "role": "Standard",
  "level": 4,
  "tactics": "Basic",
  "hp": 25,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 1,
   "AGI": 2,
   "KNO": -5,
   "SPD": 1,
   "PER": 5,
   "SPE": -5
  },
  "xp": 44,
  "attributes": "Able to climb vertical surfaces. Nocturnal",
  "description": "Dark spiders with glowing green patterns that frequently reside in caves.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D12+4. Damaging strikes add 2 acid stacks.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4
    }
   },
   {
    "name": "Acid Spray",
    "rarity": "Basic",
    "text": "1 Strike D10 to a 5M 90 degree arc. Equipment hit loses 2 Condition.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 0,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Lava Spider",
  "family": "Spiders",
  "role": "Standard",
  "level": 6,
  "tactics": "Basic",
  "hp": 27,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 3,
   "KNO": -5,
   "SPD": 3,
   "PER": 2,
   "SPE": -5
  },
  "xp": 56,
  "attributes": "Able to climb vertical surfaces. Immune to heat and fire damage. 50% weakness to cold and frost damage",
  "description": "Spiders with a stone exoskeleton and lava flowing within them.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+4. Damaging strikes add a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 4
    }
   },
   {
    "name": "Lava Spray",
    "rarity": "Basic",
    "text": "1 Strike D20 to a 5M 90 degree arc. Damaging strikes add a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Shattered Spider",
  "family": "Spiders",
  "role": "Elite",
  "level": 6,
  "tactics": "Fair",
  "hp": 65,
  "armor": 4,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": -4,
   "SPD": 5,
   "PER": 4,
   "SPE": -5
  },
  "xp": 168,
  "attributes": "Unholy. Climb. Magic Resistance: 50% resistance to magic damage.",
  "description": "Spiders twisted by primordium.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9. Damaging strikes add a poison, frozen, and flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Poisonous Spray",
    "rarity": "Common",
    "text": "1 Strike D12+8 to a 5M 90 degree arc. Damaged entities gain one random negative stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 8,
     "area": true
    }
   },
   {
    "name": "Chaos Venom",
    "rarity": "Uncommon",
    "text": "2 Strikes D12+10. Damaging strikes add 2 random negative stacks.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 10
    }
   }
  ]
 },
 {
  "name": "Crocodile",
  "family": "Crocodilians",
  "role": "Elite",
  "level": 4,
  "tactics": "Fair",
  "hp": 60,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 2,
   "KNO": -5,
   "SPD": 2,
   "PER": 2,
   "SPE": -5
  },
  "xp": 132,
  "attributes": "None",
  "description": "Standard",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+2. Upon biting roll strength vs target. If they fail, become latched to target.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Tail Whip",
    "rarity": "Common",
    "text": "1 Strike D20+5. 2AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 5,
     "ap": 2
    }
   },
   {
    "name": "Death Roll",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+1. 4AP. Only against a target the crocodile is latched to.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 1,
     "ap": 4
    }
   },
   {
    "name": "Submerge",
    "rarity": "Basic",
    "text": "Dive into the water, requiring a perception check that beats the crocodile's agility check to allow targeting. Used as a Quick action."
   }
  ]
 },
 {
  "name": "Sand Crocodile",
  "family": "Crocodilians",
  "role": "Elite",
  "level": 5,
  "tactics": "Fair",
  "hp": 85,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 2,
   "KNO": -5,
   "SPD": 1,
   "PER": 5,
   "SPE": -5
  },
  "xp": 150,
  "attributes": "Heat Resistance: 50% resistance to fire/heat damage.",
  "description": "Thin crocodiles that swim through sands like water.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9. Upon biting roll strength vs target. If they fail, become latched to target.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Tail Whip",
    "rarity": "Common",
    "text": "1 Strike D20+14. 4AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 14,
     "ap": 4
    }
   },
   {
    "name": "Death Roll",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+6. 4AP. Only against a target the crocodile is latched to.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 6,
     "ap": 4
    }
   },
   {
    "name": "Submerge in Sand",
    "rarity": "Basic",
    "text": "Dive into the sand, preventing targeting while submerged. Used as a Quick action."
   }
  ]
 },
 {
  "name": "Wooden Crocodile",
  "family": "Crocodilians",
  "role": "Elite",
  "level": 5,
  "tactics": "Fair",
  "hp": 85,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 3,
   "KNO": -5,
   "SPD": 2,
   "PER": 3,
   "SPE": -5
  },
  "xp": 150,
  "attributes": "Appear as log with Major stealth. Can bite and tail bash in same phase.",
  "description": "Crocodiles with an adaptation giving them bark like scales and a log like appearance",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9. Upon biting roll strength vs target. If they fail, become pinned and latched to target.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Tail Bash",
    "rarity": "Common",
    "text": "1 Strike D20+14. 4AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 14,
     "ap": 4
    }
   },
   {
    "name": "Death Roll",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+6. 4AP. Only against a target the crocodile is latched to.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 6,
     "ap": 4
    }
   }
  ]
 },
 {
  "name": "Alpha Crocodile",
  "family": "Crocodilians",
  "role": "Elite",
  "level": 9,
  "tactics": "Good",
  "hp": 125,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 10,
   "AGI": 4,
   "KNO": -5,
   "SPD": 4,
   "PER": 5,
   "SPE": -5
  },
  "xp": 222,
  "attributes": "Major stealth in murky water. Can bite and tail whip in same phase.",
  "description": "Massive crocodiles that have had major success over long lives",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+13. Upon biting roll strength vs target. If they fail, become latched to target.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 13
    }
   },
   {
    "name": "Tail Whip",
    "rarity": "Common",
    "text": "1 Strike D20+20. 4AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 20,
     "ap": 4
    }
   },
   {
    "name": "Death Roll",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+10. 4AP. Only against a target the crocodile is latched to.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 10,
     "ap": 4
    }
   },
   {
    "name": "Drag Under",
    "rarity": "Rare",
    "text": "Against a latched target: drag it underwater. Each phase it remains latched underwater it takes the Bite's damage and must win a strength roll to break free.",
    "cooldown": 1
   }
  ]
 },
 {
  "name": "Lava Crocodile",
  "family": "Crocodilians",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 105,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 10,
   "AGI": 4,
   "KNO": -5,
   "SPD": -2,
   "PER": 4,
   "SPE": -5
  },
  "xp": 276,
  "attributes": "Lava Dwelling. 50% weakness to cold and frost. Immune to heat and fire. Can bite and tail bash in same phase.",
  "description": "Large crocodiles that reside in lava with heavy stone bodies",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+17. Damaging strikes add a flame stack. Upon biting roll strength vs target; if they fail, become latched.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 17
    }
   },
   {
    "name": "Tail Bash",
    "rarity": "Common",
    "text": "1 Strike 2D20+15. 6AP.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 15,
     "ap": 6
    }
   },
   {
    "name": "Death Roll",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+14. Damaging strikes add 2 flame stacks. Only against a latched target.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 14
    }
   }
  ]
 },
 {
  "name": "Shattered Crocodile",
  "family": "Crocodilians",
  "role": "Elite",
  "level": 16,
  "tactics": "Good",
  "hp": 160,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 15,
   "AGI": 4,
   "KNO": -5,
   "SPD": 2,
   "PER": 4,
   "SPE": -5
  },
  "xp": 348,
  "attributes": "50% magic resist. Can bite and tail bash in same phase.",
  "description": "Large crocodiles warped by Primordium",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+21. Upon biting roll strength vs target. If they fail, become latched to target.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 21
    }
   },
   {
    "name": "Tail Bash",
    "rarity": "Common",
    "text": "1 Strike 2D20+19. 6AP.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 19,
     "ap": 6
    }
   },
   {
    "name": "Death Roll",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+17. Damaging strikes add one random negative stack. Only against a latched target.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 17
    }
   },
   {
    "name": "Warped Thrash",
    "rarity": "Rare",
    "text": "2 Strikes 2D12+9 to all entities within 3M.",
    "cooldown": 1,
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 12,
     "flat": 9,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Boar",
  "family": "Boars",
  "role": "Minion",
  "level": 2,
  "tactics": "Basic",
  "hp": 9,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 2,
   "KNO": -5,
   "SPD": 2,
   "PER": -1,
   "SPE": -5
  },
  "xp": 8,
  "attributes": "Generally come in large herds.",
  "description": "Standard",
  "abilities": [
   {
    "name": "Charge",
    "rarity": "Basic",
    "text": "1 Strike D10. 2AP. Apply a bleed stack on 9 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 0,
     "ap": 2
    }
   },
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D12. Apply a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 0
    }
   }
  ]
 },
 {
  "name": "Snowy Tusk Boar",
  "family": "Boars",
  "role": "Standard",
  "level": 3,
  "tactics": "Basic",
  "hp": 19,
  "armor": 3,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": -5,
   "SPD": 1,
   "PER": 3,
   "SPE": -5
  },
  "xp": 38,
  "attributes": "50% cold and frost resist.",
  "description": "Lightly colored boars that reside in the frostlands with thick fur and a great sense of smell.",
  "abilities": [
   {
    "name": "Charge",
    "rarity": "Basic",
    "text": "1 Strike D10+4. 2AP. Apply a bleed stack on 9 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 4,
     "ap": 2
    }
   },
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D12+4. Apply a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4
    }
   }
  ]
 },
 {
  "name": "Alpha Boar",
  "family": "Boars",
  "role": "Elite",
  "level": 5,
  "tactics": "Fair",
  "hp": 85,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 2,
   "KNO": -5,
   "SPD": 4,
   "PER": -1,
   "SPE": -5
  },
  "xp": 150,
  "attributes": "Big.",
  "description": "Extremely large boar that leads a herd.",
  "abilities": [
   {
    "name": "Charge",
    "rarity": "Basic",
    "text": "1 Strike D20+9. 2AP. Apply a bleed stack on 15 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9,
     "ap": 2
    }
   },
   {
    "name": "Gore",
    "rarity": "Common",
    "text": "2 Strikes D12+7. Apply a bleed stack per strike dealing 10 or more damage.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 7
    }
   },
   {
    "name": "Trample",
    "rarity": "Uncommon",
    "text": "1 Strike D20+8 to all entities in a 5M line. Struck entities roll strength against the boar or are disoriented for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 8,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Stone Boar",
  "family": "Boars",
  "role": "Standard",
  "level": 6,
  "tactics": "Basic",
  "hp": 27,
  "armor": 3,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": -2,
   "KNO": -5,
   "SPD": 2,
   "PER": -2,
   "SPE": -5
  },
  "xp": 56,
  "attributes": "Big. 50% weakness to cold and frost. 50% heat and fire resist.",
  "description": "Boars with stone shells that rampage in the ashlands and near mountains.",
  "abilities": [
   {
    "name": "Charge",
    "rarity": "Basic",
    "text": "1 Strike D20+4. 2AP. Apply a bleed or flame stack on 15 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 4,
     "ap": 2
    }
   },
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "2 Strikes D12+2. Apply a flame stack per strike dealing 10 or more damage.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "Knife Bug",
  "family": "Insectoids",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 9,
  "armor": 1,
  "size": "Small",
  "alignment": "Neutral",
  "stats": {
   "STR": -4,
   "AGI": 2,
   "KNO": -5,
   "SPD": 3,
   "PER": 0,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "Able to climb vertical surfaces. Small.",
  "description": "Insectoid with a long dagger like growth on its head",
  "abilities": [
   {
    "name": "Lunging Stab",
    "rarity": "Basic",
    "text": "1 Strike D10.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 0
    }
   }
  ]
 },
 {
  "name": "Dartling",
  "family": "Insectoids",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Small",
  "alignment": "Neutral",
  "stats": {
   "STR": -10,
   "AGI": 2,
   "KNO": -5,
   "SPD": 0,
   "PER": 3,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "Able to climb vertical surfaces. Small.",
  "description": "Insectoid that launches poison darts from a scorpion like stinger appendage",
  "abilities": [
   {
    "name": "Poison Dart",
    "rarity": "Basic",
    "text": "1 Strike D4+3. Ranged, 75% accurate. Adds a poison stack on hit.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 4,
     "flat": 3
    }
   }
  ]
 },
 {
  "name": "Giant Wasp",
  "family": "Insectoids",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -2,
   "AGI": 2,
   "KNO": -5,
   "SPD": 5,
   "PER": 0,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "Flying. Come in swarms",
  "description": "Large flying wasps.",
  "abilities": [
   {
    "name": "Sting",
    "rarity": "Basic",
    "text": "1 Strike D6+2. Adds a poison stack on hit.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 6,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "Lava Roller",
  "family": "Insectoids",
  "role": "Standard",
  "level": 4,
  "tactics": "Basic",
  "hp": 19,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": -2,
   "KNO": -5,
   "SPD": 1,
   "PER": -2,
   "SPE": -5
  },
  "xp": 44,
  "attributes": "Immune to heat and fire. 50% weakness to cold and frost.",
  "description": "Stone shelled insectoid that can roll up for protection.",
  "abilities": [
   {
    "name": "Lava Spit",
    "rarity": "Basic",
    "text": "1 Strike D10+4. Ranged. Adds a flame stack on 8 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 4
    }
   },
   {
    "name": "Lava Charge",
    "rarity": "Basic",
    "text": "1 Strike D12+4. 4AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4,
     "ap": 4
    }
   },
   {
    "name": "Roll-Up",
    "rarity": "Basic",
    "text": "Quick action: double armor until its next turn, but it can not attack."
   }
  ]
 },
 {
  "name": "Great Mantis",
  "family": "Insectoids",
  "role": "Elite",
  "level": 7,
  "tactics": "Fair",
  "hp": 105,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 3,
   "KNO": -5,
   "SPD": 3,
   "PER": 2,
   "SPE": -5
  },
  "xp": 186,
  "attributes": "Big.",
  "description": "Large mantis like beast with an extremely violent nature.",
  "abilities": [
   {
    "name": "Cleave",
    "rarity": "Basic",
    "text": "1 Strike D20+9. Apply a bleed stack on 15 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Spear",
    "rarity": "Common",
    "text": "2 Strikes D10+9. 2AP.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 9,
     "ap": 2
    }
   },
   {
    "name": "Scything Frenzy",
    "rarity": "Uncommon",
    "text": "2 Strikes D12+5 to all entities within melee reach. Apply a bleed stack per strike dealing 10 or more damage.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 5,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Juvenile Night Claw",
  "family": "Night Claws",
  "role": "Minion",
  "level": 2,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -4,
   "AGI": 4,
   "KNO": -5,
   "SPD": 3,
   "PER": -3,
   "SPE": -5
  },
  "xp": 8,
  "attributes": "Nocturnal. Immune to poison and toxin. Heat Sensing",
  "description": "Standard",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D10.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 0
    }
   },
   {
    "name": "Claw",
    "rarity": "Basic",
    "text": "1 Strike D8+1. 2AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 8,
     "flat": 1,
     "ap": 2
    }
   }
  ]
 },
 {
  "name": "Adult Night Claw",
  "family": "Night Claws",
  "role": "Elite",
  "level": 6,
  "tactics": "Fair",
  "hp": 110,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -2,
   "AGI": 5,
   "KNO": -5,
   "SPD": 5,
   "PER": 0,
   "SPE": -5
  },
  "xp": 168,
  "attributes": "Nocturnal. Immune to poison and toxin. Heat Sensing",
  "description": "Adult Night Claws are rare because of their weakness as youth. They are very dangerous.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Claw",
    "rarity": "Common",
    "text": "1 Strike D20+14. 4AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 14,
     "ap": 4
    }
   },
   {
    "name": "Shrieking Lunge",
    "rarity": "Uncommon",
    "text": "2 Strikes D12+10. The night claw moves up to 8M to reach its target first.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 10
    }
   }
  ]
 },
 {
  "name": "Ancient Night Claw",
  "family": "Night Claws",
  "role": "Boss",
  "level": 14,
  "tactics": "Good",
  "hp": 590,
  "armor": 0,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 4,
   "KNO": -5,
   "SPD": 10,
   "PER": 4,
   "SPE": -5
  },
  "xp": 1040,
  "attributes": "Big. Nocturnal. Immune to poison and toxin. Heat Sensing Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "Massive Night Claws that have survived despite the odds to become apex predators.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+7.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 7
    }
   },
   {
    "name": "Swipe",
    "rarity": "Common",
    "text": "1 Strike D20+3 to a 180 degree arc in melee reach.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 3,
     "area": true
    }
   },
   {
    "name": "Hellish Scream",
    "rarity": "Uncommon",
    "text": "All enemies within 15M roll Knowledge against 8+ or gain 2 Fear stacks, and are disoriented for 1 phase."
   },
   {
    "name": "Apex Hunt",
    "rarity": "Rare",
    "text": "2 Strikes D20+9. The night claw moves up to its full movement and strikes a target it senses through heat, ignoring darkness and invisibility.",
    "cooldown": 1,
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Green Slime",
  "family": "Slimes",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": null,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": -5,
   "KNO": -5,
   "SPD": -4,
   "PER": -4,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "Destroyed by fire, water, and frost. No HP: can only be destroyed by fire, water, or frost. Each such hit destroys a share of its mass (GM sets how many hits).",
  "description": "Green slimes are the most common variant. They are rarely a threat to intelligent life.",
  "abilities": [
   {
    "name": "Dissolve",
    "rarity": "Basic",
    "text": "1 Strike D8+1. Hits every target in contact.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 8,
     "flat": 1
    }
   }
  ],
  "specialHp": "Destroyed by fire, water, and frost. No HP: can only be destroyed by fire, water, or frost. Each such hit destroys a share of its mass (GM sets how many hits)."
 },
 {
  "name": "Purple Slime",
  "family": "Slimes",
  "role": "Standard",
  "level": 4,
  "tactics": "Basic",
  "hp": null,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": -5,
   "KNO": -5,
   "SPD": -2,
   "PER": -2,
   "SPE": -5
  },
  "xp": 44,
  "attributes": "Destroyed by fire, water, and frost. No HP: can only be destroyed by fire, water, or frost.",
  "description": "Purple slimes are a more dangerous variant that can suck creatures in with great force.",
  "abilities": [
   {
    "name": "Dissolve",
    "rarity": "Basic",
    "text": "1 Strike D12+4. Hits every target in contact. Roll strength against the target; if the slime wins, the target is pulled into it.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4
    }
   }
  ],
  "specialHp": "Destroyed by fire, water, and frost. No HP: can only be destroyed by fire, water, or frost."
 },
 {
  "name": "Clear Slime",
  "family": "Slimes",
  "role": "Standard",
  "level": 6,
  "tactics": "Basic",
  "hp": null,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": -5,
   "KNO": -5,
   "SPD": -2,
   "PER": -2,
   "SPE": -5
  },
  "xp": 56,
  "attributes": "Destroyed by fire, water, and frost. No HP: can only be destroyed by fire, water, or frost.",
  "description": "Clear slimes often take up whole corridors and are almost perfectly clear. They are magically created.",
  "abilities": [
   {
    "name": "Dissolve",
    "rarity": "Basic",
    "text": "1 Strike D12+8. Hits every target in contact. A perception check of 8+ is needed to notice it.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 8
    }
   }
  ],
  "specialHp": "Destroyed by fire, water, and frost. No HP: can only be destroyed by fire, water, or frost."
 },
 {
  "name": "Lava Slime",
  "family": "Slimes",
  "role": "Elite",
  "level": 8,
  "tactics": "Fair",
  "hp": null,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": -5,
   "KNO": -5,
   "SPD": -5,
   "PER": -4,
   "SPE": -5
  },
  "xp": 204,
  "attributes": "Destroyed by water, and frost. No HP: can only be destroyed by water or frost.",
  "description": "Lava slimes are extremely rare and dangerous. They can absorb lava into themselves often making them very large",
  "abilities": [
   {
    "name": "Burn",
    "rarity": "Basic",
    "text": "1 Strike D20+9. Hits every target in contact and adds a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Spatter",
    "rarity": "Common",
    "text": "1 Strike D12+9 to all entities within 3M. Adds a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 9,
     "area": true
    }
   },
   {
    "name": "Engulf",
    "rarity": "Uncommon",
    "text": "2 Strikes D12+11. Roll strength against the target; if the slime wins, the target is pulled in and takes this damage again each phase until it escapes.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 11
    }
   }
  ],
  "specialHp": "Destroyed by water, and frost. No HP: can only be destroyed by water or frost."
 },
 {
  "name": "Wraith",
  "family": "Wraiths",
  "role": "Standard",
  "level": 3,
  "tactics": "Basic",
  "hp": 30,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": 2,
   "KNO": -5,
   "SPD": 2,
   "PER": 0,
   "SPE": -5
  },
  "xp": 38,
  "attributes": "Immune to physical damage. Flying.",
  "description": "Standard Wraiths are humanoid and gently glide with the winds of some magically charged storms.",
  "abilities": [
   {
    "name": "Syphon Life",
    "rarity": "Basic",
    "text": "1 Strike D12+4. Immobilizes the target for 1 phase on a natural 12.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4
    }
   }
  ]
 },
 {
  "name": "Seeking Wraith",
  "family": "Wraiths",
  "role": "Standard",
  "level": 6,
  "tactics": "Basic",
  "hp": 45,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": 2,
   "KNO": -5,
   "SPD": 4,
   "PER": 2,
   "SPE": -5
  },
  "xp": 56,
  "attributes": "Immune to physical damage. Flying.",
  "description": "Seeking Wraiths are cursed with a target that they will hunt endlessly.",
  "abilities": [
   {
    "name": "Syphon Life",
    "rarity": "Basic",
    "text": "3 Strikes D8+2. Immobilizes the target for 1 phase if two strikes roll 8.",
    "attack": {
     "strikes": 3,
     "dice": 1,
     "sides": 8,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "Eternal Wraith",
  "family": "Wraiths",
  "role": "Elite",
  "level": 10,
  "tactics": "Fair",
  "hp": 160,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 4,
   "KNO": -5,
   "SPD": 5,
   "PER": 4,
   "SPE": 2
  },
  "xp": 240,
  "attributes": "Only damaged by healing spells. Flying.",
  "description": "Eternal wraiths are powerful ancient wraiths that can be banished through healing magic. They are extremely difficult to truly destroy.",
  "abilities": [
   {
    "name": "Syphon Life",
    "rarity": "Basic",
    "text": "3 Strikes D8+7. Heals the wraith for half the damage dealt.",
    "attack": {
     "strikes": 3,
     "dice": 1,
     "sides": 8,
     "flat": 7
    }
   },
   {
    "name": "Soul Grasp",
    "rarity": "Common",
    "text": "1 Strike 2D20+14. Immobilizes the target for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 14
    }
   },
   {
    "name": "Wail of the Lost",
    "rarity": "Uncommon",
    "text": "All enemies within 10M roll Knowledge against 8+ or gain 2 Fear stacks."
   }
  ]
 },
 {
  "name": "Unjoined Mimic",
  "family": "Mimics",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Small",
  "alignment": "Neutral",
  "stats": {
   "STR": -4,
   "AGI": -4,
   "KNO": -5,
   "SPD": -4,
   "PER": -3,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "Small. Immune to physical damage.",
  "description": "Weak little blobs of moving tissue.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D4+3.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 4,
     "flat": 3
    }
   }
  ]
 },
 {
  "name": "Mimic",
  "family": "Mimics",
  "role": "Standard",
  "level": 3,
  "tactics": "Basic",
  "hp": null,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -1,
   "AGI": -2,
   "KNO": -5,
   "SPD": -4,
   "PER": -1,
   "SPE": -5
  },
  "xp": 38,
  "attributes": "Double damage on sneak attack. More possible attacks based on bond. No HP of its own: destroyed only by destroying the item it is bonded to. More attacks are possible depending on the bond.",
  "description": "Common Mimics bonded to various items such as chests, equipment, and furniture.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20. Deals double damage as a sneak attack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   }
  ],
  "specialHp": "Double damage on sneak attack. More possible attacks based on bond. No HP of its own: destroyed only by destroying the item it is bonded to. More attacks are possible depending on the bond."
 },
 {
  "name": "War Mimic",
  "family": "Mimics",
  "role": "Elite",
  "level": 6,
  "tactics": "Fair",
  "hp": null,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 1,
   "AGI": -2,
   "KNO": -5,
   "SPD": -2,
   "PER": 1,
   "SPE": -5
  },
  "xp": 168,
  "attributes": "Double damage on sneak attack. More possible attacks based on bond. No HP of its own: destroyed only by destroying the item it is bonded to.",
  "description": "War mimics uniquely favor weapons and other items used in combat.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9. Deals double damage as a sneak attack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Weapon Lash",
    "rarity": "Common",
    "text": "2 Strikes D10+8. Uses the bonded weapon.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 8
    }
   },
   {
    "name": "Turn the Blade",
    "rarity": "Uncommon",
    "text": "If bonded to a weapon held by an enemy, roll Knowledge against the wielder; if the mimic wins, the wielder's next attack targets an ally of the GM's choice."
   }
  ],
  "specialHp": "Double damage on sneak attack. More possible attacks based on bond. No HP of its own: destroyed only by destroying the item it is bonded to."
 },
 {
  "name": "Eldren",
  "family": "Eldren",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Small",
  "alignment": "Neutral",
  "stats": {
   "STR": -4,
   "AGI": 0,
   "KNO": -5,
   "SPD": 0,
   "PER": 1,
   "SPE": -10
  },
  "xp": 7,
  "attributes": "Small.",
  "description": "Standard Eldren that simply want to expand their collection of shiny things.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D6+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 6,
     "flat": 2
    }
   },
   {
    "name": "Scratch",
    "rarity": "Basic",
    "text": "1 Strike D4+3.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 4,
     "flat": 3
    }
   }
  ]
 },
 {
  "name": "Tunneling Eldren",
  "family": "Eldren",
  "role": "Minion",
  "level": 2,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Small",
  "alignment": "Neutral",
  "stats": {
   "STR": -3,
   "AGI": 1,
   "KNO": -5,
   "SPD": 1,
   "PER": 0,
   "SPE": -10
  },
  "xp": 8,
  "attributes": "Small. Able to tunnel underground.",
  "description": "Eldren that have adapted to worm their way through tunnels they dig.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D6+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 6,
     "flat": 2
    }
   },
   {
    "name": "Scratch",
    "rarity": "Basic",
    "text": "1 Strike D4+3.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 4,
     "flat": 3
    }
   }
  ]
 },
 {
  "name": "Oglenesh",
  "family": "Oglenesh",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 140,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 0,
   "KNO": -7,
   "SPD": 5,
   "PER": 2,
   "SPE": -7
  },
  "xp": 276,
  "attributes": "Big. Immune to poisons and toxins.",
  "description": "Standard Oglenesh are big and territorial.",
  "abilities": [
   {
    "name": "Smash",
    "rarity": "Basic",
    "text": "1 Strike D20+17.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 17
    }
   },
   {
    "name": "Spike Assault",
    "rarity": "Common",
    "text": "4 Strikes D8+8. Apply a poison stack per 6 damage dealt.",
    "attack": {
     "strikes": 4,
     "dice": 1,
     "sides": 8,
     "flat": 8
    }
   },
   {
    "name": "Spike Volley",
    "rarity": "Uncommon",
    "text": "2 Strikes D10+10 to up to 3 targets within 10M. Apply a poison stack per strike that deals damage.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 10,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Gold Spike Oglenesh",
  "family": "Oglenesh",
  "role": "Elite",
  "level": 16,
  "tactics": "Good",
  "hp": 160,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 8,
   "AGI": 2,
   "KNO": -5,
   "SPD": 8,
   "PER": 2,
   "SPE": -5
  },
  "xp": 348,
  "attributes": "Big. Immune to poisons and toxins.",
  "description": "Oglenesh variant with more powerful poison and a gold coloring.",
  "abilities": [
   {
    "name": "Gut",
    "rarity": "Basic",
    "text": "1 Strike D20+21. Apply a poison stack per 8 damage dealt.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 21
    }
   },
   {
    "name": "Spike Assault",
    "rarity": "Common",
    "text": "5 Strikes D8+8. Apply a poison stack per 6 damage dealt.",
    "attack": {
     "strikes": 5,
     "dice": 1,
     "sides": 8,
     "flat": 8
    }
   },
   {
    "name": "Spike Volley",
    "rarity": "Uncommon",
    "text": "2 Strikes 2D10+7 to up to 3 targets within 10M. Apply a poison stack per strike that deals damage.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 10,
     "flat": 7,
     "area": true
    }
   },
   {
    "name": "Golden Venom",
    "rarity": "Rare",
    "text": "2 Strikes 3D12+15. Apply 3 poison stacks; poison stacks from this can not be recovered from for 2 phases.",
    "cooldown": 1,
    "attack": {
     "strikes": 2,
     "dice": 3,
     "sides": 12,
     "flat": 15
    }
   }
  ]
 },
 {
  "name": "Steel Pick",
  "family": "Automatons",
  "role": "Minion",
  "level": 2,
  "tactics": "Basic",
  "hp": 6,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": -2,
   "KNO": -5,
   "SPD": -4,
   "PER": -2,
   "SPE": -5
  },
  "xp": 8,
  "attributes": "Mechanical. 50% resistant to flame and frost damage.",
  "description": "Small but potentially dangerous masses of steel.",
  "abilities": [
   {
    "name": "Pick",
    "rarity": "Basic",
    "text": "1 Strike D20.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   }
  ]
 },
 {
  "name": "Combat Steel Pick",
  "family": "Automatons",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 27,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 8,
   "AGI": -2,
   "KNO": -5,
   "SPD": -4,
   "PER": 0,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Mechanical. 50% resistant to flame and frost damage.",
  "description": "Modified Steel Pick designed to punch holes in any enemy it faces.",
  "abilities": [
   {
    "name": "Pick",
    "rarity": "Basic",
    "text": "1 Strike D20+4. 2AP.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 4,
     "ap": 2
    }
   }
  ]
 },
 {
  "name": "Clockwork Titan",
  "family": "Automatons",
  "role": "Boss",
  "level": 14,
  "tactics": "Good",
  "hp": 355,
  "armor": 5,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 10,
   "AGI": -2,
   "KNO": -2,
   "SPD": 6,
   "PER": 0,
   "SPE": -4
  },
  "xp": 1040,
  "attributes": "Big. Mechanical. 50% resistant to flame and frost damage. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "Towering armored humanoid with a massive axe built into one arm and a hammer built into the other.",
  "abilities": [
   {
    "name": "Axe",
    "rarity": "Basic",
    "text": "1 Strike D20+7.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 7
    }
   },
   {
    "name": "Area Denial",
    "rarity": "Common",
    "text": "1 Strike D20+3 to a 180 degree arc with the axe.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 3,
     "area": true
    }
   },
   {
    "name": "Forge Hammer",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+6. Ignores armor.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 6,
     "ignoreArmor": true
    }
   },
   {
    "name": "Grinding Advance",
    "rarity": "Rare",
    "text": "2 Strikes D12+6 to every entity in its path as it moves up to 10M.",
    "cooldown": 1,
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 6,
     "area": true
    }
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Forge Lord",
  "family": "Automatons",
  "role": "Boss",
  "level": 18,
  "tactics": "Great",
  "hp": 400,
  "armor": 5,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 10,
   "AGI": -2,
   "KNO": -2,
   "SPD": 6,
   "PER": 0,
   "SPE": -4
  },
  "xp": 1280,
  "attributes": "Big. Mechanical. Immune to flame. 50% resistant to frost damage but not effects. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "A variant of titan that is used to forge massive creations with its internal forge.",
  "abilities": [
   {
    "name": "Axe",
    "rarity": "Basic",
    "text": "1 Strike D20+9.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Area Denial",
    "rarity": "Common",
    "text": "1 Strike D20+5 to a 180 degree arc with the axe.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 5,
     "area": true
    }
   },
   {
    "name": "Forge Hammer",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+8. Ignores armor.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 8,
     "ignoreArmor": true
    }
   },
   {
    "name": "Flame Thrower",
    "rarity": "Rare",
    "text": "4 Strikes D10+5 to a 90 degree arc. Adds a flame stack on rolls of 8 to 10.",
    "cooldown": 1,
    "attack": {
     "strikes": 4,
     "dice": 1,
     "sides": 10,
     "flat": 5,
     "area": true
    }
   },
   {
    "name": "Forge Heart",
    "rarity": "Epic",
    "text": "Vents its internal forge: all entities within 5M take the Flame Thrower's damage and gain 2 flame stacks; the Forge Lord gains 10 armor until its next turn.",
    "cooldown": 2
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Keeper of Steel",
  "family": "Automatons",
  "role": "Boss",
  "level": 24,
  "tactics": "Excellent",
  "hp": 490,
  "armor": 8,
  "size": "Massive",
  "alignment": "Neutral",
  "stats": {
   "STR": 20,
   "AGI": -5,
   "KNO": 2,
   "SPD": 5,
   "PER": -2,
   "SPE": -1
  },
  "xp": 1640,
  "attributes": "Massive. Mechanical. Immune to flame. 50% resistant to frost damage but not effects. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "A legendary Titan that rests in the deepest depths that miners have dared dig.",
  "abilities": [
   {
    "name": "Axe",
    "rarity": "Basic",
    "text": "1 Strike D20+10.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 10
    }
   },
   {
    "name": "Area Denial",
    "rarity": "Common",
    "text": "1 Strike D20+5 to a 180 degree arc with the axe.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 5,
     "area": true
    }
   },
   {
    "name": "Forge Hammer",
    "rarity": "Uncommon",
    "text": "2 Strikes D20+10. Ignores armor.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 20,
     "flat": 10,
     "ignoreArmor": true
    }
   },
   {
    "name": "Area of Flames",
    "rarity": "Rare",
    "text": "6 Strikes D10+5 to all entities within 5M. Adds a flame stack on rolls of 8 to 10.",
    "cooldown": 1,
    "attack": {
     "strikes": 6,
     "dice": 1,
     "sides": 10,
     "flat": 5,
     "area": true
    }
   },
   {
    "name": "Seismic Slam",
    "rarity": "Epic",
    "text": "3 Strikes D20+5 to all entities within 10M. Struck entities are disoriented for 1 phase.",
    "cooldown": 2,
    "attack": {
     "strikes": 3,
     "dice": 1,
     "sides": 20,
     "flat": 5,
     "area": true
    }
   },
   {
    "name": "Heart of the Deep",
    "rarity": "Legendary",
    "text": "The Keeper overloads: for 2 phases it takes three turns each phase and all its strikes ignore armor.",
    "cooldown": 3
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Frost Golem",
  "family": "Golems",
  "role": "Standard",
  "level": 5,
  "tactics": "Fair",
  "hp": 27,
  "armor": 3,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 0,
   "KNO": -2,
   "SPD": 0,
   "PER": 1,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Construct. Immune to frost and frozen stacks. 50% weakness to fire. Immune to poisons and toxins.",
  "description": "A construct of packed ice and frost magic, summoned by Soul Rifting or left to guard frozen places.",
  "abilities": [
   {
    "name": "Frost Fist",
    "rarity": "Basic",
    "text": "1 Strike D12+6. Applies 1 frozen stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 6
    }
   },
   {
    "name": "Ice Shard",
    "rarity": "Basic",
    "text": "1 Strike D10+7. Ranged, 10M. Physical damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 7
    }
   },
   {
    "name": "Freezing Breath",
    "rarity": "Common",
    "text": "1 Strike D10+4 to a 5M 90 degree arc. Applies 1 frozen stack to each entity struck.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 4,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Stone Golem",
  "family": "Golems",
  "role": "Elite",
  "level": 13,
  "tactics": "Fair",
  "hp": 105,
  "armor": 6,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 8,
   "AGI": -2,
   "KNO": -2,
   "SPD": -1,
   "PER": 1,
   "SPE": -5
  },
  "xp": 294,
  "attributes": "Construct. 50% resistance to fire and frost. Immune to poisons and toxins.",
  "description": "A towering construct of carved stone bound with soul magic. Slow, heavy, and nearly unstoppable once moving.",
  "abilities": [
   {
    "name": "Slam",
    "rarity": "Basic",
    "text": "1 Strike D20+17.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 17
    }
   },
   {
    "name": "Boulder Toss",
    "rarity": "Common",
    "text": "2 Strikes 2D12+7. Ranged, 15M.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 12,
     "flat": 7
    }
   },
   {
    "name": "Quake",
    "rarity": "Uncommon",
    "text": "1 Strike D20+16 to all entities within 5M. Struck entities are disoriented for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 16,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Storm Golem",
  "family": "Golems",
  "role": "Elite",
  "level": 13,
  "tactics": "Fair",
  "hp": 105,
  "armor": 4,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 2,
   "KNO": -2,
   "SPD": 3,
   "PER": 3,
   "SPE": -5
  },
  "xp": 294,
  "attributes": "Construct. Immune to shock and static stacks. Immune to poisons and toxins.",
  "description": "A crackling construct of iron and captured lightning. The air around it hums and stings.",
  "abilities": [
   {
    "name": "Lightning Fist",
    "rarity": "Basic",
    "text": "1 Strike D20+17. Ignores metal armor. Applies 1 static stack on 15 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 17
    }
   },
   {
    "name": "Chain Arc",
    "rarity": "Common",
    "text": "1 Strike 2D12+8 to up to 3 targets within 10M. Ignores metal armor.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 8,
     "area": true
    }
   },
   {
    "name": "Static Field",
    "rarity": "Uncommon",
    "text": "All enemies within 5M gain 2 static stacks, and the golem may discharge them at the start of its next turn for 1D6 each."
   }
  ]
 },
 {
  "name": "Fire Golem",
  "family": "Golems",
  "role": "Elite",
  "level": 13,
  "tactics": "Fair",
  "hp": 105,
  "armor": 4,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 6,
   "AGI": 0,
   "KNO": -2,
   "SPD": 1,
   "PER": 2,
   "SPE": -5
  },
  "xp": 294,
  "attributes": "Construct. Immune to fire and flame stacks. 50% weakness to frost. Immune to poisons and toxins.",
  "description": "A construct of cracked obsidian with a furnace for a heart. Everything it touches burns.",
  "abilities": [
   {
    "name": "Burning Fist",
    "rarity": "Basic",
    "text": "1 Strike D20+17. Applies 1 flame stack on 15 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 17
    }
   },
   {
    "name": "Flame Burst",
    "rarity": "Common",
    "text": "1 Strike 2D12+8 to a 5M 90 degree arc. Applies 1 flame stack to each entity struck.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 8,
     "area": true
    }
   },
   {
    "name": "Magma Core",
    "rarity": "Uncommon",
    "text": "2 Strikes 2D12+12. Applies 2 flame stacks.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 12,
     "flat": 12
    }
   }
  ]
 },
 {
  "name": "Young Werewolf",
  "family": "Werewolves",
  "role": "Standard",
  "level": 1,
  "tactics": "Fair",
  "hp": 27,
  "armor": 0,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 1,
   "AGI": 2,
   "KNO": -2,
   "SPD": 3,
   "PER": 2,
   "SPE": -3
  },
  "xp": 26,
  "attributes": "Shapeshifter. Regenerates 1D4 HP at the end of each phase. Takes 50% more damage from silver weapons (Silv-Steel).",
  "description": "A shapeshifter in its beast form, part wolf and part person. The form grows larger and more dangerous as the shifter gains experience.",
  "abilities": [
   {
    "name": "Rending Claws",
    "rarity": "Basic",
    "text": "2 Strikes D8.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 8,
     "flat": 0
    }
   },
   {
    "name": "Savage Bite",
    "rarity": "Common",
    "text": "1 Strike D12+3. Applies a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 3
    }
   },
   {
    "name": "Pounce",
    "rarity": "Uncommon",
    "text": "1 Strike D20+1. Moves up to 6M to reach the target first, without triggering movement reactions.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 1
    }
   }
  ]
 },
 {
  "name": "Werewolf",
  "family": "Werewolves",
  "role": "Standard",
  "level": 4,
  "tactics": "Fair",
  "hp": 25,
  "armor": 1,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 2,
   "AGI": 2,
   "KNO": -2,
   "SPD": 4,
   "PER": 3,
   "SPE": -3
  },
  "xp": 44,
  "attributes": "Shapeshifter. Regenerates 1D4 HP at the end of each phase. Takes 50% more damage from silver weapons (Silv-Steel).",
  "description": "A shapeshifter in its beast form, part wolf and part person. The form grows larger and more dangerous as the shifter gains experience.",
  "abilities": [
   {
    "name": "Rending Claws",
    "rarity": "Basic",
    "text": "2 Strikes D8+1.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 8,
     "flat": 1
    }
   },
   {
    "name": "Savage Bite",
    "rarity": "Common",
    "text": "1 Strike D12+4. Applies a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4
    }
   },
   {
    "name": "Pounce",
    "rarity": "Uncommon",
    "text": "1 Strike D20+3. Moves up to 6M to reach the target first, without triggering movement reactions.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 3
    }
   }
  ]
 },
 {
  "name": "Blooded Werewolf",
  "family": "Werewolves",
  "role": "Standard",
  "level": 8,
  "tactics": "Fair",
  "hp": 45,
  "armor": 2,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 3,
   "AGI": 3,
   "KNO": -2,
   "SPD": 5,
   "PER": 3,
   "SPE": -3
  },
  "xp": 68,
  "attributes": "Shapeshifter. Regenerates 1D6 HP at the end of each phase. Takes 50% more damage from silver weapons (Silv-Steel).",
  "description": "A shapeshifter in its beast form, part wolf and part person. The form grows larger and more dangerous as the shifter gains experience.",
  "abilities": [
   {
    "name": "Rending Claws",
    "rarity": "Basic",
    "text": "2 Strikes D8+4.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 8,
     "flat": 4
    }
   },
   {
    "name": "Savage Bite",
    "rarity": "Common",
    "text": "1 Strike D12+11. Applies a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 11
    }
   },
   {
    "name": "Pounce",
    "rarity": "Uncommon",
    "text": "1 Strike D20+11. Moves up to 6M to reach the target first, without triggering movement reactions.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 11
    }
   },
   {
    "name": "Feral Howl",
    "rarity": "Rare",
    "text": "All enemies within 10M roll Knowledge against 7+ or gain 2 Fear stacks.",
    "cooldown": 1
   }
  ]
 },
 {
  "name": "Elder Werewolf",
  "family": "Werewolves",
  "role": "Standard",
  "level": 12,
  "tactics": "Good",
  "hp": 60,
  "armor": 2,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 4,
   "AGI": 4,
   "KNO": -1,
   "SPD": 6,
   "PER": 4,
   "SPE": -2
  },
  "xp": 92,
  "attributes": "Shapeshifter. Regenerates 1D6 HP at the end of each phase. Takes 50% more damage from silver weapons (Silv-Steel).",
  "description": "A shapeshifter in its beast form, part wolf and part person. The form grows larger and more dangerous as the shifter gains experience.",
  "abilities": [
   {
    "name": "Rending Claws",
    "rarity": "Basic",
    "text": "2 Strikes D8+6.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 8,
     "flat": 6
    }
   },
   {
    "name": "Savage Bite",
    "rarity": "Common",
    "text": "1 Strike 2D12+8. Applies a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 8
    }
   },
   {
    "name": "Pounce",
    "rarity": "Uncommon",
    "text": "1 Strike D20+15. Moves up to 6M to reach the target first, without triggering movement reactions.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 15
    }
   },
   {
    "name": "Feral Howl",
    "rarity": "Rare",
    "text": "All enemies within 10M roll Knowledge against 8+ or gain 2 Fear stacks.",
    "cooldown": 1
   }
  ]
 },
 {
  "name": "Alpha Werewolf",
  "family": "Werewolves",
  "role": "Standard",
  "level": 16,
  "tactics": "Good",
  "hp": 65,
  "armor": 3,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 5,
   "AGI": 5,
   "KNO": -1,
   "SPD": 7,
   "PER": 5,
   "SPE": -2
  },
  "xp": 116,
  "attributes": "Shapeshifter. Regenerates 1D8 HP at the end of each phase. Takes 50% more damage from silver weapons (Silv-Steel).",
  "description": "A shapeshifter in its beast form, part wolf and part person. The form grows larger and more dangerous as the shifter gains experience.",
  "abilities": [
   {
    "name": "Rending Claws",
    "rarity": "Basic",
    "text": "2 Strikes D8+9.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 8,
     "flat": 9
    }
   },
   {
    "name": "Savage Bite",
    "rarity": "Common",
    "text": "1 Strike 2D12+14. Applies a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 14
    }
   },
   {
    "name": "Pounce",
    "rarity": "Uncommon",
    "text": "1 Strike 2D20+12. Moves up to 6M to reach the target first, without triggering movement reactions.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 12
    }
   },
   {
    "name": "Feral Howl",
    "rarity": "Rare",
    "text": "All enemies within 10M roll Knowledge against 8+ or gain 2 Fear stacks.",
    "cooldown": 1
   },
   {
    "name": "Moonlit Frenzy",
    "rarity": "Epic",
    "text": "3 Strikes 2D10+11. Strikes may target different enemies within reach.",
    "cooldown": 2,
    "attack": {
     "strikes": 3,
     "dice": 2,
     "sides": 10,
     "flat": 11
    }
   }
  ]
 },
 {
  "name": "Primal Werewolf",
  "family": "Werewolves",
  "role": "Standard",
  "level": 20,
  "tactics": "Good",
  "hp": 75,
  "armor": 3,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 6,
   "AGI": 6,
   "KNO": 0,
   "SPD": 8,
   "PER": 6,
   "SPE": -2
  },
  "xp": 140,
  "attributes": "Shapeshifter. Regenerates 1D8 HP at the end of each phase. Takes 50% more damage from silver weapons (Silv-Steel).",
  "description": "A shapeshifter in its beast form, part wolf and part person. The form grows larger and more dangerous as the shifter gains experience.",
  "abilities": [
   {
    "name": "Rending Claws",
    "rarity": "Basic",
    "text": "2 Strikes 2D8+7.",
    "attack": {
     "strikes": 2,
     "dice": 2,
     "sides": 8,
     "flat": 7
    }
   },
   {
    "name": "Savage Bite",
    "rarity": "Common",
    "text": "1 Strike 2D12+19. Applies a bleed stack on 10 or more damage.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 19
    }
   },
   {
    "name": "Pounce",
    "rarity": "Uncommon",
    "text": "1 Strike 2D20+19. Moves up to 6M to reach the target first, without triggering movement reactions.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 19
    }
   },
   {
    "name": "Feral Howl",
    "rarity": "Rare",
    "text": "All enemies within 10M roll Knowledge against 9+ or gain 2 Fear stacks.",
    "cooldown": 1
   },
   {
    "name": "Moonlit Frenzy",
    "rarity": "Epic",
    "text": "3 Strikes 2D10+15. Strikes may target different enemies within reach.",
    "cooldown": 2,
    "attack": {
     "strikes": 3,
     "dice": 2,
     "sides": 10,
     "flat": 15
    }
   }
  ]
 },
 {
  "name": "Grunt",
  "family": "Military",
  "role": "Minion",
  "level": 3,
  "tactics": "Basic",
  "hp": 10,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 0,
   "KNO": 0,
   "SPD": 1,
   "PER": 1,
   "SPE": -1
  },
  "xp": 10,
  "attributes": "None",
  "description": "Grunts are the lowest members of any military. They are generally conscripts with little training.",
  "humanoid": true,
  "combatSkill": "Combat skill: A Strength weapon (Mace, Warhammer, Battle Axe, Greatsword). Skill tier: Base Tier 1. Damage stat: 2 (Strength). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Basic (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Soldier",
  "family": "Military",
  "role": "Standard",
  "level": 5,
  "tactics": "Fair",
  "hp": 35,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": 2,
   "SPD": 2,
   "PER": 2,
   "SPE": 0
  },
  "xp": 50,
  "attributes": "None",
  "description": "Soldiers are the average member of any military. They are trained and capable but still inexperienced.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon of the GM's choice. Skill tier: Base Tier 3. Damage stat: 3 (Strength or Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Tactical Officer",
  "family": "Military",
  "role": "Standard",
  "level": 5,
  "tactics": "Good",
  "hp": 35,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": 3,
   "SPD": 2,
   "PER": 3,
   "SPE": 2
  },
  "xp": 50,
  "attributes": "None",
  "description": "Tactical Officers are Soldiers that have better tactical sense and direct other soldiers.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon of the GM's choice, plus Tactics. Skill tier: Base Tier 2. Damage stat: 3 (Strength or Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack. A support role: its healing, buffs, or control matter more than its damage."
 },
 {
  "name": "Military Captain",
  "family": "Military",
  "role": "Elite",
  "level": 7,
  "tactics": "Great",
  "hp": 80,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 3,
   "KNO": 3,
   "SPD": 2,
   "PER": 3,
   "SPE": 2
  },
  "xp": 186,
  "attributes": "None",
  "description": "Military Captains are high ranking officers that excel at all elements of combat.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon or magic school of the GM's choice. Skill tier: Base Tier 4. Damage stat: 4 (Strength, Agility, or Knowledge). Weapon tier: 2. Uses that skill's abilities up to Base Tier 4, of rarity up to Epic (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Military Legate",
  "family": "Military",
  "role": "Elite",
  "level": 10,
  "tactics": "Great",
  "hp": 95,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 4,
   "KNO": 4,
   "SPD": 2,
   "PER": 3,
   "SPE": 2
  },
  "xp": 240,
  "attributes": "None",
  "description": "Military Legates are some of the most experienced members of any army.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon or magic school of the GM's choice. Skill tier: Path Tier 1. Damage stat: 4 (Strength, Agility, or Knowledge). Weapon tier: 2. Uses that skill's abilities up to Path Tier 1, of rarity up to Epic (its tactics), with its path's basic attack."
 },
 {
  "name": "Military General",
  "family": "Military",
  "role": "Elite",
  "level": 16,
  "tactics": "Excellent",
  "hp": 120,
  "armor": 6,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 5,
   "KNO": 5,
   "SPD": 3,
   "PER": 4,
   "SPE": 3
  },
  "xp": 348,
  "attributes": "None",
  "description": "Soldiers who refuse to die battle after battle and war after war. With so much experience and history they are obvious choices to lead an army.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon or magic school of the GM's choice. Skill tier: Path Tier 2. Damage stat: 5 (Strength, Agility, or Knowledge). Weapon tier: 3. Uses that skill's abilities up to Path Tier 2, of rarity up to Legendary (its tactics), with its path's basic attack."
 },
 {
  "name": "Novice Mage",
  "family": "Mages",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -1,
   "AGI": -1,
   "KNO": 2,
   "SPD": 0,
   "PER": 1,
   "SPE": -1
  },
  "xp": 7,
  "attributes": "None",
  "description": "Novice Mages have only a basic understanding of their magic.",
  "humanoid": true,
  "combatSkill": "Combat skill: A magic school of the GM's choice. Skill tier: Base Tier 1. Damage stat: 2 (Knowledge). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Basic (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Apprentice Mage",
  "family": "Mages",
  "role": "Standard",
  "level": 3,
  "tactics": "Fair",
  "hp": 30,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -1,
   "AGI": -1,
   "KNO": 2,
   "SPD": 1,
   "PER": 2,
   "SPE": 0
  },
  "xp": 38,
  "attributes": "None",
  "description": "Apprentice Mages have decent understanding of their magic.",
  "humanoid": true,
  "combatSkill": "Combat skill: A magic school of the GM's choice. Skill tier: Base Tier 1. Damage stat: 2 (Knowledge). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Uncommon (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Adept Mage",
  "family": "Mages",
  "role": "Standard",
  "level": 5,
  "tactics": "Good",
  "hp": 45,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 1,
   "AGI": 1,
   "KNO": 3,
   "SPD": 2,
   "PER": 3,
   "SPE": 0
  },
  "xp": 50,
  "attributes": "None",
  "description": "Adept Mages are capable of powerful spells.",
  "humanoid": true,
  "combatSkill": "Combat skill: A magic school of the GM's choice. Skill tier: Base Tier 2. Damage stat: 3 (Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Master Mage",
  "family": "Mages",
  "role": "Elite",
  "level": 7,
  "tactics": "Great",
  "hp": 130,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": 0,
   "KNO": 4,
   "SPD": 0,
   "PER": 3,
   "SPE": 1
  },
  "xp": 186,
  "attributes": "None",
  "description": "Master Mages are powerful and extremely dangerous. Those that face them should be extremely careful.",
  "humanoid": true,
  "combatSkill": "Combat skill: A magic school of the GM's choice. Skill tier: Base Tier 4. Damage stat: 4 (Knowledge). Weapon tier: 2. Uses that skill's abilities up to Base Tier 4, of rarity up to Epic (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Alteration/Sensory Mage",
  "family": "Mages",
  "role": "Standard",
  "level": 5,
  "tactics": "Good",
  "hp": 45,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 1,
   "AGI": 1,
   "KNO": 3,
   "SPD": 1,
   "PER": 3,
   "SPE": 2
  },
  "xp": 50,
  "attributes": "None",
  "description": "Alteration and Sensory Mages take a frontline role in combat. Their spells effect the combatants in various ways changing the course of battle.",
  "humanoid": true,
  "combatSkill": "Combat skill: Alteration or Sensory. Skill tier: Base Tier 2. Damage stat: 3 (Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack. A support role: its healing, buffs, or control matter more than its damage."
 },
 {
  "name": "Restoration Mage",
  "family": "Mages",
  "role": "Standard",
  "level": 7,
  "tactics": "Good",
  "hp": 55,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": 0,
   "KNO": 3,
   "SPD": 2,
   "PER": 3,
   "SPE": 3
  },
  "xp": 62,
  "attributes": "None",
  "description": "Restoration Mages stay in the back healing and protecting their allies. They are protected fiercely by their allies.",
  "humanoid": true,
  "combatSkill": "Combat skill: Restoration. Skill tier: Base Tier 3. Damage stat: 3 (Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Rare (its tactics), with Base Tier 3 upgraded basic attack. A support role: its healing, buffs, or control matter more than its damage."
 },
 {
  "name": "Skeleton Guardian",
  "family": "Skeletons",
  "role": "Elite",
  "level": 3,
  "tactics": "Fair",
  "hp": 75,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": 0,
   "SPD": 1,
   "PER": 2,
   "SPE": -2
  },
  "xp": 114,
  "attributes": "Undead. Immune to poisons and toxins.",
  "description": "Large skeletons that remain over centuries for a select purpose. Guardians are generally the result of a willing sacrifice to stand guard for eternity.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon or magic school of the GM's choice. Skill tier: Base Tier 3. Damage stat: 3 (Strength, Agility, or Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Dark Guardian",
  "family": "Skeletons",
  "role": "Elite",
  "level": 7,
  "tactics": "Good",
  "hp": 130,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 5,
   "KNO": 4,
   "SPD": 4,
   "PER": 4,
   "SPE": 3
  },
  "xp": 186,
  "attributes": "Undead. Immune to poisons and toxins.",
  "description": "Guardians that have been corrupted deeply through exposure to primordial magic. This corruption leaves them cruel and dark with a twisted sense of their original purpose.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon or magic school of the GM's choice. Skill tier: Base Tier 4. Damage stat: 4 (Strength, Agility, or Knowledge). Weapon tier: 2. Uses that skill's abilities up to Base Tier 4, of rarity up to Rare (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Skeleton of Judgement",
  "family": "Skeletons",
  "role": "Elite",
  "level": 13,
  "tactics": "Great",
  "hp": 140,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 5,
   "KNO": 4,
   "SPD": 4,
   "PER": 4,
   "SPE": 3
  },
  "xp": 294,
  "attributes": "Immune to poisons and toxins. Holy.",
  "description": "Skeletons of Judgement are unique in that they are not undead as they have not yet died but have rather been given undying skeletal forms. They are the chosen inquisitors for The Order of Nexriad.",
  "humanoid": true,
  "combatSkill": "Combat skill: Greatsword and Crossbow, plus Restoration and Fire at two tiers lower. Skill tier: Path Tier 1. Damage stat: 4 (Strength and Agility; Knowledge for spells). Weapon tier: 2. Uses that skill's abilities up to Path Tier 1, of rarity up to Epic (its tactics), with its path's basic attack."
 },
 {
  "name": "Skeleton",
  "family": "Skeletons",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": -3,
   "KNO": -5,
   "SPD": -2,
   "PER": -1,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "Undead. Immune to poisons and toxins.",
  "description": "Extremely weak skeletons that are plentiful and easy to destroy.",
  "humanoid": true,
  "combatSkill": "Combat skill: Any weapon (rusted, Tier 0 item). Skill tier: Base Tier 1. Damage stat: 2 (Strength or Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Basic (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Disassembled Skeleton",
  "family": "Skeletons",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": null,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": -4,
   "KNO": -5,
   "SPD": -1,
   "PER": -2,
   "SPE": -6
  },
  "xp": 7,
  "attributes": "Undead. Immune to poisons and toxins.",
  "description": "Broken skeletons with autonomy of each part of their body. Not a real threat but a nuisance.",
  "abilities": [
   {
    "name": "Grasping Parts",
    "rarity": "Basic",
    "text": "1 Strike D4 to anyone within 1M. Each part acts on its own; a non-combat nuisance.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 4,
     "flat": 0
    }
   }
  ],
  "specialHp": "Undead. Immune to poisons and toxins."
 },
 {
  "name": "Skeleton Warrior",
  "family": "Skeletons",
  "role": "Standard",
  "level": 1,
  "tactics": "Fair",
  "hp": 27,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 0,
   "KNO": -4,
   "SPD": 0,
   "PER": 1,
   "SPE": -6
  },
  "xp": 26,
  "attributes": "Undead. Immune to poisons and toxins.",
  "description": "Skeletons that retain some fragment of a warrior soul.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon of the GM's choice. Skill tier: Base Tier 1. Damage stat: 2 (Strength or Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Uncommon (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Elemental Skeleton",
  "family": "Skeletons",
  "role": "Standard",
  "level": 1,
  "tactics": "Fair",
  "hp": 27,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -3,
   "AGI": -2,
   "KNO": 2,
   "SPD": 0,
   "PER": 2,
   "SPE": -2
  },
  "xp": 26,
  "attributes": "Undead. Immune to poisons and toxins.",
  "description": "Skeletons imbued with the powers of a type of destructive magic",
  "humanoid": true,
  "combatSkill": "Combat skill: Fire, Frost, or Shock. Skill tier: Base Tier 1. Damage stat: 2 (Knowledge). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Uncommon (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Clockwork Warrior",
  "family": "Automatons",
  "role": "Standard",
  "level": 5,
  "tactics": "Fair",
  "hp": 35,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 0,
   "KNO": -4,
   "SPD": 0,
   "PER": 0,
   "SPE": -3
  },
  "xp": 50,
  "attributes": "Mechanical. 50% resistant to flame and frost damage.",
  "description": "Complex humanoid soldiers or guards.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon of the GM's choice. Skill tier: Base Tier 3. Damage stat: 3 (Strength or Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Clockwork Berserker",
  "family": "Automatons",
  "role": "Elite",
  "level": 7,
  "tactics": "Fair",
  "hp": 105,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 2,
   "KNO": -2,
   "SPD": 2,
   "PER": 0,
   "SPE": -3
  },
  "xp": 186,
  "attributes": "Mechanical. 50% resistant to flame and frost damage.",
  "description": "Clockwork Berserkers are larger than average and extremely proficient at combat.",
  "humanoid": true,
  "combatSkill": "Combat skill: Battle Axe or One Handed Axe. Skill tier: Path Tier 1. Damage stat: 4 (Strength). Weapon tier: 2. Uses that skill's abilities up to Path Tier 1, of rarity up to Uncommon (its tactics), with its path's basic attack."
 },
 {
  "name": "Clockwork Tank",
  "family": "Automatons",
  "role": "Elite",
  "level": 13,
  "tactics": "Good",
  "hp": 105,
  "armor": 5,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 6,
   "AGI": 0,
   "KNO": -2,
   "SPD": 0,
   "PER": 2,
   "SPE": -3
  },
  "xp": 294,
  "attributes": "Mechanical. 50% resistant to flame and frost damage.",
  "description": "Heavily armored and extremely dangerous.",
  "humanoid": true,
  "combatSkill": "Combat skill: A two-handed weapon (Greatsword, Battle Axe, Warhammer). Skill tier: Path Tier 4. Damage stat: 6 (Strength). Weapon tier: 4. Uses that skill's abilities up to Path Tier 4, of rarity up to Rare (its tactics), with its path's basic attack."
 },
 {
  "name": "Townsfolk",
  "family": "Citizens",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -3,
   "AGI": -3,
   "KNO": -2,
   "SPD": -2,
   "PER": -1,
   "SPE": 0
  },
  "xp": 7,
  "attributes": "None",
  "description": "The average person in most towns.",
  "abilities": [
   {
    "name": "Hit",
    "rarity": "Basic",
    "text": "2D4. Non-combatant: flees or surrenders when threatened."
   }
  ]
 },
 {
  "name": "Merchant",
  "family": "Citizens",
  "role": "Minion",
  "level": 3,
  "tactics": "Basic",
  "hp": 12,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": -3,
   "KNO": 2,
   "SPD": -2,
   "PER": 2,
   "SPE": 2
  },
  "xp": 10,
  "attributes": "None",
  "description": "The average business owner is more mentally keen than the average citizen.",
  "humanoid": true,
  "combatSkill": "Combat skill: Any weapon. Skill tier: Base Tier 1. Damage stat: 2 (Strength or Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Basic (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Blacksmith",
  "family": "Citizens",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 45,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": -2,
   "KNO": 2,
   "SPD": -2,
   "PER": 2,
   "SPE": 1
  },
  "xp": 50,
  "attributes": "None",
  "description": "Blacksmiths are tough and capable. They are often ex soldiers.",
  "humanoid": true,
  "combatSkill": "Combat skill: Mace, Warhammer, or One Handed Axe. Skill tier: Base Tier 3. Damage stat: 3 (Strength). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Basic (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Mage Merchant",
  "family": "Citizens",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 45,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -2,
   "AGI": -2,
   "KNO": 3,
   "SPD": -2,
   "PER": 2,
   "SPE": 1
  },
  "xp": 50,
  "attributes": "None",
  "description": "Mage Merchants have a basic adeptness at a type of magic that they market to the public.",
  "humanoid": true,
  "combatSkill": "Combat skill: A magic school of the GM's choice. Skill tier: Base Tier 3. Damage stat: 3 (Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Basic (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Healer",
  "family": "Citizens",
  "role": "Standard",
  "level": 5,
  "tactics": "Fair",
  "hp": 45,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": -2,
   "AGI": -2,
   "KNO": 3,
   "SPD": -2,
   "PER": 2,
   "SPE": 1
  },
  "xp": 50,
  "attributes": "None",
  "description": "Healers reside in most towns healing the sick and helping protect their towns.",
  "humanoid": true,
  "combatSkill": "Combat skill: Restoration. Skill tier: Base Tier 3. Damage stat: 3 (Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack. A support role: its healing, buffs, or control matter more than its damage."
 },
 {
  "name": "Town Guard",
  "family": "Guards",
  "role": "Standard",
  "level": 5,
  "tactics": "Fair",
  "hp": 27,
  "armor": 3,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": 0,
   "SPD": 2,
   "PER": 2,
   "SPE": -1
  },
  "xp": 50,
  "attributes": "None",
  "description": "Town Guards are tough, more focused on being tanky than dealing damage.",
  "humanoid": true,
  "combatSkill": "Combat skill: Spear or Sword with Shield. Skill tier: Base Tier 3. Damage stat: 3 (Strength). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Captain of the Guard",
  "family": "Guards",
  "role": "Elite",
  "level": 7,
  "tactics": "Good",
  "hp": 105,
  "armor": 3,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 3,
   "KNO": 2,
   "SPD": 2,
   "PER": 3,
   "SPE": 1
  },
  "xp": 186,
  "attributes": "None",
  "description": "Guard Captains are well paid experienced fighters that lead town guards.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon of the GM's choice. Skill tier: Base Tier 4. Damage stat: 4 (Strength or Agility). Weapon tier: 2. Uses that skill's abilities up to Base Tier 4, of rarity up to Rare (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "City Captain",
  "family": "Guards",
  "role": "Elite",
  "level": 10,
  "tactics": "Great",
  "hp": 95,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 5,
   "KNO": 3,
   "SPD": 2,
   "PER": 3,
   "SPE": 2
  },
  "xp": 240,
  "attributes": "None",
  "description": "City Captains are regularly military heroes that now protect a major city.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon of the GM's choice, plus a magic school at two tiers lower. Skill tier: Path Tier 1. Damage stat: 4 (Strength or Agility). Weapon tier: 2. Uses that skill's abilities up to Path Tier 1, of rarity up to Epic (its tactics), with its path's basic attack."
 },
 {
  "name": "Merchant Guard",
  "family": "Guards",
  "role": "Standard",
  "level": 5,
  "tactics": "Good",
  "hp": 27,
  "armor": 3,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 3,
   "KNO": 2,
   "SPD": 2,
   "PER": 3,
   "SPE": -1
  },
  "xp": 50,
  "attributes": "None",
  "description": "Merchant Guards are dangerous and focused more on dealing damage than taking it.",
  "humanoid": true,
  "combatSkill": "Combat skill: A weapon of the GM's choice. Skill tier: Base Tier 2. Damage stat: 3 (Strength or Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Ship Guard",
  "family": "Guards",
  "role": "Standard",
  "level": 5,
  "tactics": "Good",
  "hp": 45,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 1,
   "AGI": 0,
   "KNO": 3,
   "SPD": 0,
   "PER": 2,
   "SPE": -1
  },
  "xp": 50,
  "attributes": "None",
  "description": "Ship Guards are trained in destruction magic for ship to ship combat.",
  "humanoid": true,
  "combatSkill": "Combat skill: Fire, Frost, or Shock. Skill tier: Base Tier 2. Damage stat: 3 (Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Cutpurse",
  "family": "Outlaws",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": -2,
   "AGI": 2,
   "KNO": 0,
   "SPD": 2,
   "PER": 1,
   "SPE": 0
  },
  "xp": 7,
  "attributes": "Roguery Base Tier 2 (may hide in combat as a Standard action with cover). Flees when two or more of its allies have fallen.",
  "description": "Quick-fingered thieves who work crowds and camps.",
  "humanoid": true,
  "combatSkill": "Combat skill: Dagger. Skill tier: Base Tier 1. Damage stat: 2 (Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Basic (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Bandit",
  "family": "Outlaws",
  "role": "Standard",
  "level": 2,
  "tactics": "Fair",
  "hp": 27,
  "armor": 1,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 2,
   "AGI": 2,
   "KNO": -1,
   "SPD": 1,
   "PER": 1,
   "SPE": -1
  },
  "xp": 32,
  "attributes": "None",
  "description": "The common outlaw: armed, hungry, and willing.",
  "humanoid": true,
  "combatSkill": "Combat skill: Sword, One Handed Axe, or Spear. Skill tier: Base Tier 1. Damage stat: 2 (Strength or Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Uncommon (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Bandit Archer",
  "family": "Outlaws",
  "role": "Standard",
  "level": 3,
  "tactics": "Fair",
  "hp": 30,
  "armor": 1,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 0,
   "AGI": 2,
   "KNO": 0,
   "SPD": 1,
   "PER": 3,
   "SPE": -1
  },
  "xp": 38,
  "attributes": "Fights from cover where it can. Usually part of the ambush party (see Ambushes in the Game Guide).",
  "description": "Outlaws who watch the road from cover and open every ambush.",
  "humanoid": true,
  "combatSkill": "Combat skill: Bow. Skill tier: Base Tier 2. Damage stat: 2 (Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 2, of rarity up to Uncommon (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Highway Thug",
  "family": "Outlaws",
  "role": "Standard",
  "level": 4,
  "tactics": "Fair",
  "hp": 30,
  "armor": 2,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 3,
   "AGI": 0,
   "KNO": -2,
   "SPD": 0,
   "PER": 0,
   "SPE": -2
  },
  "xp": 44,
  "attributes": "None",
  "description": "The muscle of a band, swinging whatever is heavy.",
  "humanoid": true,
  "combatSkill": "Combat skill: Mace or Warhammer. Skill tier: Base Tier 2. Damage stat: 3 (Strength). Weapon tier: 0. Uses that skill's abilities up to Base Tier 2, of rarity up to Uncommon (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Bandit Lieutenant",
  "family": "Outlaws",
  "role": "Elite",
  "level": 4,
  "tactics": "Good",
  "hp": 70,
  "armor": 2,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": 3,
   "AGI": 3,
   "KNO": 0,
   "SPD": 1,
   "PER": 2,
   "SPE": 1
  },
  "xp": 132,
  "attributes": "Hold Together: Quick, once per combat. Every allied outlaw within 10M that has started to flee stops and fights on.",
  "description": "Hardened outlaws, often deserters, who keep a band in line.",
  "humanoid": true,
  "combatSkill": "Combat skill: Sword (with Shield) or Spear. Skill tier: Base Tier 3. Damage stat: 3 (Strength or Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Rare (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Bandit Lord",
  "family": "Outlaws",
  "role": "Boss",
  "level": 6,
  "tactics": "Good",
  "hp": 300,
  "armor": 4,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": 4,
   "AGI": 2,
   "KNO": 1,
   "SPD": 1,
   "PER": 2,
   "SPE": 2
  },
  "xp": 560,
  "attributes": "Rally the Band: Quick, once per combat. Every allied outlaw within 10M may immediately move up to 3M and gains +1 attack bonus until the end of the phase. Call for Ransom: When a player character is downed within its sight, the Bandit Lord may order them taken alive. Its allies stop attacking that character, and the GM may let the party bargain for them after the fight. Boss: takes two turns each phase (each rolls on its tactics table). Usually fights with a Bandit Lieutenant and a band of Bandits nearby.",
  "description": "The one name every outlaw on the road fears. A Bandit Lord rules from a fortified camp, takes a cut of every robbery, and keeps a ransom ledger.",
  "turnsPerPhase": 2,
  "humanoid": true,
  "combatSkill": "Combat skill: Greatsword or Battle Axe. Skill tier: Base Tier 4. Damage stat: 4 (Strength). Weapon tier: 1. Uses that skill's abilities up to Base Tier 4, of rarity up to Rare (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Harvest Crow",
  "family": "The Dark Harvest",
  "role": "Minion",
  "level": 1,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Small",
  "alignment": "Neutral",
  "stats": {
   "STR": -4,
   "AGI": 3,
   "KNO": -5,
   "SPD": 4,
   "PER": 3,
   "SPE": -5
  },
  "xp": 7,
  "attributes": "Flying. Small. Come in flocks.",
  "description": "Black crows with eyes like wet seed.",
  "abilities": [
   {
    "name": "Peck",
    "rarity": "Basic",
    "text": "1 Strike D8+1.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 8,
     "flat": 1
    }
   }
  ]
 },
 {
  "name": "Chaff Husk",
  "family": "The Dark Harvest",
  "role": "Minion",
  "level": 2,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": -2,
   "KNO": -5,
   "SPD": -1,
   "PER": -2,
   "SPE": -5
  },
  "xp": 8,
  "attributes": "Construct. 50% weakness to fire. Immune to poisons and toxins.",
  "description": "Bundled straw and cornstalk given a crude, shambling shape.",
  "abilities": [
   {
    "name": "Stalk Lash",
    "rarity": "Basic",
    "text": "1 Strike D10+1.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 1
    }
   }
  ]
 },
 {
  "name": "Strawman",
  "family": "The Dark Harvest",
  "role": "Standard",
  "level": 3,
  "tactics": "Basic",
  "hp": 32,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": -1,
   "KNO": -5,
   "SPD": 0,
   "PER": 1,
   "SPE": -5
  },
  "xp": 38,
  "attributes": "Construct. 50% weakness to fire. Immune to poisons and toxins.",
  "description": "A full-sized figure of straw wrapped around a farmer's old tools.",
  "abilities": [
   {
    "name": "Sickle Swipe",
    "rarity": "Basic",
    "text": "1 Strike D20.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   },
   {
    "name": "Root Grasp",
    "rarity": "Basic",
    "text": "Roll agility vs an opponent within 2M. If the Strawman wins, the target is immobilized until it wins a Strength check of 6+."
   }
  ]
 },
 {
  "name": "Withered Reaper",
  "family": "The Dark Harvest",
  "role": "Standard",
  "level": 5,
  "tactics": "Fair",
  "hp": 42,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": 3,
   "AGI": 0,
   "KNO": -3,
   "SPD": 1,
   "PER": 1,
   "SPE": -4
  },
  "xp": 50,
  "attributes": "Undead. Immune to poisons and toxins.",
  "description": "Farmhands who withheld the tribute, taken by the harvest they kept back.",
  "abilities": [
   {
    "name": "Rusted Scythe",
    "rarity": "Basic",
    "text": "1 Strike D20+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Blight Touch",
    "rarity": "Common",
    "text": "1 Strike D12+3. Damaging strikes add a poison stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 3
    }
   },
   {
    "name": "Wide Reap",
    "rarity": "Uncommon",
    "text": "1 Strike D12+2 to all entities in a 2M 180 degree arc.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 2,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Scarecrow of the Dark Harvest",
  "family": "The Dark Harvest",
  "role": "Boss",
  "level": 6,
  "tactics": "Good",
  "hp": 320,
  "armor": 0,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 1,
   "KNO": 2,
   "SPD": 2,
   "PER": 3,
   "SPE": -2
  },
  "xp": 560,
  "attributes": "Big. Construct. 25% weakness to fire. Immune to poisons and toxins. Boss: takes two turns each phase (each rolls on its tactics table). Tribute: a character who offers a real tribute from the field (grain, a slaughtered animal, or something the farm valued) and wins a Speech contest against the Scarecrow's Knowledge ends the Dark Harvest. The Scarecrow and every creature of the harvest return to straw and crows.",
  "description": "Meshka's vessel. It is whatever scarecrow already stood in the field, grown tall and hollow-eyed, with a scythe of black iron that drips sap.",
  "abilities": [
   {
    "name": "Black Scythe",
    "rarity": "Basic",
    "text": "1 Strike D20.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 0
    }
   },
   {
    "name": "Reaping Arc",
    "rarity": "Common",
    "text": "1 Strike D12+2 to all enemies in a 2M 180 degree arc.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 2,
     "area": true
    }
   },
   {
    "name": "Call the Crows",
    "rarity": "Uncommon",
    "text": "Three Harvest Crows rise from the field within 10M. No more than six may be in play at once."
   },
   {
    "name": "Blight Bloom",
    "rarity": "Rare",
    "text": "All enemies within 5M gain 2 poison stacks.",
    "cooldown": 1
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Talon Acolyte",
  "family": "Cult of the Dark Talon",
  "role": "Minion",
  "level": 3,
  "tactics": "Basic",
  "hp": 12,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": -1,
   "AGI": 1,
   "KNO": 1,
   "SPD": 0,
   "PER": 0,
   "SPE": -1
  },
  "xp": 10,
  "attributes": "Blood Offering: when an Acolyte dies within 10M of a Gravecaller or the Hierophant, that ally may raise it as a Skeleton (see Skeletons) as a Quick action, once per phase.",
  "description": "New initiates, eager to prove themselves with a borrowed knife.",
  "humanoid": true,
  "combatSkill": "Combat skill: Dagger. Skill tier: Base Tier 1. Damage stat: 1 (Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Basic (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Gravecaller",
  "family": "Cult of the Dark Talon",
  "role": "Standard",
  "level": 6,
  "tactics": "Good",
  "hp": 46,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": -1,
   "AGI": 1,
   "KNO": 3,
   "SPD": 0,
   "PER": 2,
   "SPE": 0
  },
  "xp": 56,
  "attributes": "Carries a soul vessel with 1D6 soul shards.",
  "description": "Cult mages who keep the dead close and the living closer.",
  "humanoid": true,
  "combatSkill": "Combat skill: Soul Rifting, plus Dagger. Skill tier: Base Tier 2. Damage stat: 3 (Knowledge). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack. A support role: its healing, buffs, or control matter more than its damage."
 },
 {
  "name": "Talon Assassin",
  "family": "Cult of the Dark Talon",
  "role": "Standard",
  "level": 8,
  "tactics": "Good",
  "hp": 45,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": 0,
   "AGI": 4,
   "KNO": 1,
   "SPD": 3,
   "PER": 3,
   "SPE": 0
  },
  "xp": 68,
  "attributes": "Roguery Base Tier 2 (may hide in combat as a Standard action with cover). Opens a fight from hiding whenever it can.",
  "description": "The cult's knives, sent for those who would expose it.",
  "humanoid": true,
  "combatSkill": "Combat skill: Dagger. Skill tier: Base Tier 4. Damage stat: 4 (Agility). Weapon tier: 2. Uses that skill's abilities up to Base Tier 4, of rarity up to Rare (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Deathsworn Knight",
  "family": "Cult of the Dark Talon",
  "role": "Elite",
  "level": 9,
  "tactics": "Great",
  "hp": 100,
  "armor": 4,
  "size": "Average",
  "alignment": "Lawful-Evil",
  "stats": {
   "STR": 4,
   "AGI": 1,
   "KNO": 1,
   "SPD": 0,
   "PER": 2,
   "SPE": 1
  },
  "xp": 222,
  "attributes": "Undying Oath: The first time the Knight is reduced to 0 HP in a combat, it rises with 1 HP at the start of its next turn. This counts as an effect that prevents falling. Undead. Immune to poisons and toxins.",
  "description": "Warriors who swore their lives to Avranahn and were refused death in return.",
  "humanoid": true,
  "combatSkill": "Combat skill: Battle Axe (Executioner's Path). Skill tier: Path Tier 1. Damage stat: 4 (Strength). Weapon tier: 2. Uses that skill's abilities up to Path Tier 1, of rarity up to Epic (its tactics), with its path's basic attack."
 },
 {
  "name": "Hierophant of the Talon",
  "family": "Cult of the Dark Talon",
  "role": "Boss",
  "level": 10,
  "tactics": "Great",
  "hp": 400,
  "armor": 0,
  "size": "Average",
  "alignment": "Lawful-Evil",
  "stats": {
   "STR": 0,
   "AGI": 1,
   "KNO": 4,
   "SPD": 0,
   "PER": 3,
   "SPE": 3
  },
  "xp": 800,
  "attributes": "Death Rite: Quick, once per combat. Every Talon Acolyte and Skeleton within 10M bursts in soul fire: 1 Strike D12 to all entities within 2M of each. The Hierophant gains 10 temporary HP for each one destroyed. Talon's Due (Epic, cooldown 2 phases): 1 Strike 2D20+8 ignoring physical armor against a target below half HP or downed. If it kills the target, the Hierophant heals 30 HP. Boss: takes two turns each phase (each rolls on its tactics table). Usually attended by a Gravecaller and several Talon Acolytes.",
  "description": "The cult's high priest, who wears a sliver said to be broken from the Dark Talon itself.",
  "turnsPerPhase": 2,
  "humanoid": true,
  "combatSkill": "Combat skill: Soul Rifting (Necromage's Path), plus Dagger at two tiers lower. Skill tier: Path Tier 2. Damage stat: 4 (Knowledge). Weapon tier: 2. Uses that skill's abilities up to Path Tier 2, of rarity up to Epic (its tactics), with its path's basic attack."
 },
 {
  "name": "Deckhand",
  "family": "Corsairs of the Isles",
  "role": "Minion",
  "level": 2,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 0,
   "AGI": 1,
   "KNO": -1,
   "SPD": 1,
   "PER": 0,
   "SPE": -1
  },
  "xp": 8,
  "attributes": "Sea Legs: no penalty for fighting on a moving deck, and +2 to climbing rigging.",
  "description": "Crew who climb, haul and fight when the captain calls.",
  "humanoid": true,
  "combatSkill": "Combat skill: Sword or Dagger. Skill tier: Base Tier 1. Damage stat: 1 (Agility). Weapon tier: 0. Uses that skill's abilities up to Base Tier 1, of rarity up to Basic (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Corsair",
  "family": "Corsairs of the Isles",
  "role": "Standard",
  "level": 4,
  "tactics": "Fair",
  "hp": 34,
  "armor": 1,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 1,
   "AGI": 3,
   "KNO": 0,
   "SPD": 2,
   "PER": 1,
   "SPE": 0
  },
  "xp": 44,
  "attributes": "Sea Legs: no penalty for fighting on a moving deck, and +2 to climbing rigging.",
  "description": "Seasoned raiders with a blade in each hand.",
  "humanoid": true,
  "combatSkill": "Combat skill: Sword with off-hand Dagger. Skill tier: Base Tier 2. Damage stat: 3 (Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Uncommon (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Corsair Gunner",
  "family": "Corsairs of the Isles",
  "role": "Standard",
  "level": 5,
  "tactics": "Good",
  "hp": 37,
  "armor": 1,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 1,
   "AGI": 2,
   "KNO": 1,
   "SPD": 0,
   "PER": 3,
   "SPE": 0
  },
  "xp": 50,
  "attributes": "Sea Legs: no penalty for fighting on a moving deck.",
  "description": "Crossbow crews who sweep a deck before the boarding begins.",
  "humanoid": true,
  "combatSkill": "Combat skill: Crossbow. Skill tier: Base Tier 2. Damage stat: 2 (Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Corsair Captain",
  "family": "Corsairs of the Isles",
  "role": "Elite",
  "level": 7,
  "tactics": "Great",
  "hp": 92,
  "armor": 2,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 2,
   "AGI": 4,
   "KNO": 2,
   "SPD": 2,
   "PER": 2,
   "SPE": 3
  },
  "xp": 186,
  "attributes": "Call the Turn: Quick, once per combat. Every ally within 10M may immediately move up to 3M without triggering movement reactions. Sea Legs. +1 to group rolls for each crew member taking part.",
  "description": "Ship captains who lead from the front of every boarding.",
  "humanoid": true,
  "combatSkill": "Combat skill: Sword. Skill tier: Base Tier 4. Damage stat: 4 (Agility). Weapon tier: 2. Uses that skill's abilities up to Base Tier 4, of rarity up to Epic (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Corsair Admiral",
  "family": "Corsairs of the Isles",
  "role": "Boss",
  "level": 9,
  "tactics": "Great",
  "hp": 360,
  "armor": 4,
  "size": "Average",
  "alignment": "Lawful-Neutral",
  "stats": {
   "STR": 2,
   "AGI": 4,
   "KNO": 3,
   "SPD": 2,
   "PER": 3,
   "SPE": 4
  },
  "xp": 740,
  "attributes": "Admiral's Command: Quick, once per phase. One allied Corsair within 10M immediately uses an ability of Uncommon rarity or lower. Broadside (Epic, cooldown 2 phases): Only while the Admiral's ship is within 100M. The ship fires on a point within 30M: 3 Strikes 2D10 to all entities in a 3M radius. Sea Legs. Boss: takes two turns each phase (each rolls on its tactics table). Usually fights aboard its flagship with a Corsair Captain and its crew.",
  "description": "The master of a corsair fleet, whose flag alone empties harbors.",
  "turnsPerPhase": 2,
  "humanoid": true,
  "combatSkill": "Combat skill: Sword (Duelist's Path). Skill tier: Path Tier 1. Damage stat: 4 (Agility). Weapon tier: 2. Uses that skill's abilities up to Path Tier 1, of rarity up to Epic (its tactics), with its path's basic attack."
 },
 {
  "name": "Mesa Raptor",
  "family": "Mesa Beasts",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 42,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 3,
   "KNO": -5,
   "SPD": 6,
   "PER": 3,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Pack Hunter: each strike deals 2 additional damage while another Mesa Raptor is within 2M of the target. Come in packs of three to six.",
  "description": "Long-legged, feathered hunters that run down prey in packs.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "Dust Wyrm",
  "family": "Mesa Beasts",
  "role": "Elite",
  "level": 9,
  "tactics": "Good",
  "hp": 104,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 6,
   "AGI": 2,
   "KNO": -4,
   "SPD": 3,
   "PER": 4,
   "SPE": -5
  },
  "xp": 222,
  "attributes": "Big. Burrow. Heat Resistance: 50% resistance to fire/heat damage.",
  "description": "A wingless, sand-colored serpent that waits beneath the canyon floor.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+15.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 15
    }
   },
   {
    "name": "Tail Lash",
    "rarity": "Common",
    "text": "2 Strikes D12+9.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 9
    }
   },
   {
    "name": "Sand Blast",
    "rarity": "Uncommon",
    "text": "1 Strike D12+8 to all entities in a 5M 90 degree arc. Struck entities roll Perception against 7+ or are disoriented for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 8,
     "area": true
    }
   },
   {
    "name": "Burrow Ambush",
    "rarity": "Rare",
    "text": "The wyrm burrows and bursts up beneath a target within 10M: 1 Strike 2D20+12. The target is pushed back 2M.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 12
    },
    "cooldown": 1
   }
  ]
 },
 {
  "name": "Mesa Thunderbird",
  "family": "Mesa Beasts",
  "role": "Boss",
  "level": 12,
  "tactics": "Great",
  "hp": 420,
  "armor": 4,
  "size": "Huge",
  "alignment": "Neutral",
  "stats": {
   "STR": 6,
   "AGI": 4,
   "KNO": -2,
   "SPD": 6,
   "PER": 6,
   "SPE": -3
  },
  "xp": 920,
  "attributes": "Huge. Flying. Immune to shock and static stacks. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "A vast storm-bird of the high mesa. Its wingbeats are thunder and its eyes flash with Vira's lightning.",
  "abilities": [
   {
    "name": "Talons",
    "rarity": "Basic",
    "text": "1 Strike D20+6.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 6
    }
   },
   {
    "name": "Wing Buffet",
    "rarity": "Common",
    "text": "1 Strike D12+4 to all enemies in a 5M 90 degree arc. Struck entities roll Strength against the Thunderbird or are pushed back 2M.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 4,
     "area": true
    }
   },
   {
    "name": "Thunderclap",
    "rarity": "Uncommon",
    "text": "1 Strike 2D10 to all entities within 5M. Ignores metal armor. Struck entities gain 1 static stack.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 10,
     "flat": 0,
     "area": true
    }
   },
   {
    "name": "Lightning Dive",
    "rarity": "Rare",
    "text": "1 Strike 3D12+6 to one target. Ignores metal armor. The target gains 2 static stacks.",
    "attack": {
     "strikes": 1,
     "dice": 3,
     "sides": 12,
     "flat": 6
    },
    "cooldown": 1
   },
   {
    "name": "Storm Call",
    "rarity": "Epic",
    "text": "For 2 phases, at the end of each phase lightning strikes up to 3 enemies: 1 Strike 2D10 to each, ignoring metal armor, then all their static stacks discharge for 1D6 each.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 10,
     "flat": 0,
     "area": true
    },
    "cooldown": 2
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Masked Agent",
  "family": "Falkrin's Masks",
  "role": "Standard",
  "level": 5,
  "tactics": "Good",
  "hp": 37,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": 0,
   "AGI": 3,
   "KNO": 2,
   "SPD": 2,
   "PER": 2,
   "SPE": 3
  },
  "xp": 50,
  "attributes": "Mask of Falkrin: appears as anyone it has studied for a day. Seeing through the disguise takes a Perception contest against its Speech.",
  "description": "Spies who wear a face for every door they need opened.",
  "humanoid": true,
  "combatSkill": "Combat skill: Dagger, plus Sensory. Skill tier: Base Tier 2. Damage stat: 3 (Agility; Knowledge for spells). Weapon tier: 1. Uses that skill's abilities up to Base Tier 2, of rarity up to Rare (its tactics), with Tier 0 basic attack."
 },
 {
  "name": "Falsewalker",
  "family": "Falkrin's Masks",
  "role": "Elite",
  "level": 9,
  "tactics": "Good",
  "hp": 110,
  "armor": 0,
  "size": "Average",
  "alignment": "Chaotic-Evil",
  "stats": {
   "STR": 3,
   "AGI": 4,
   "KNO": 3,
   "SPD": 3,
   "PER": 3,
   "SPE": 5
  },
  "xp": 222,
  "attributes": "Shapeshifter. Takes 50% more damage from silver weapons (Silv-Steel) and radiant damage.",
  "description": "Shapeshifters that have worn so many faces they no longer remember their own.",
  "abilities": [
   {
    "name": "Stolen Blade",
    "rarity": "Basic",
    "text": "1 Strike D20+14.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 14
    }
   },
   {
    "name": "Twin Strike",
    "rarity": "Common",
    "text": "2 Strikes D12+10.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 10
    }
   },
   {
    "name": "Wear Their Face",
    "rarity": "Uncommon",
    "text": "Takes the exact appearance of an ally of the party within 10M. Until the Falsewalker attacks, enemies must win a Perception contest against its Speech to tell which is real before targeting either."
   },
   {
    "name": "False Friend",
    "rarity": "Rare",
    "text": "One enemy within 10M rolls Knowledge against the Falsewalker's Speech. On a loss, the target treats the Falsewalker as an ally and can not attack it for 1 phase.",
    "cooldown": 1
   }
  ]
 },
 {
  "name": "The Faceless Prophet",
  "family": "Falkrin's Masks",
  "role": "Boss",
  "level": 12,
  "tactics": "Great",
  "hp": 440,
  "armor": 0,
  "size": "Average",
  "alignment": "Chaotic-Evil",
  "stats": {
   "STR": 0,
   "AGI": 2,
   "KNO": 5,
   "SPD": 1,
   "PER": 4,
   "SPE": 6
  },
  "xp": 920,
  "attributes": "Immune to Calm, Anger and Fear stacks. Boss: takes two turns each phase (each rolls on its tactics table). Usually attended by Masked Agents wearing the faces of the party's friends.",
  "description": "Falkrin's chosen voice, a figure with a smooth, featureless face that speaks in whatever voice its listener trusts most.",
  "abilities": [
   {
    "name": "Whispering Knife",
    "rarity": "Basic",
    "text": "1 Strike D20+6 psychic damage.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 6,
     "ignoreArmor": true
    }
   },
   {
    "name": "Hollow Words",
    "rarity": "Common",
    "text": "1 Strike 2D8+4 psychic damage to up to 3 targets within 15M.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 8,
     "flat": 4,
     "area": true,
     "ignoreArmor": true
    }
   },
   {
    "name": "Mirror Crowd",
    "rarity": "Uncommon",
    "text": "Creates 3 illusory copies of itself within 5M. An attack against the Prophet targets it or a copy at random; a copy vanishes when struck."
   },
   {
    "name": "Turn the Tongue",
    "rarity": "Rare",
    "text": "One enemy within 15M rolls Knowledge against D10 + 6. On a failure, its next attack targets its nearest ally instead.",
    "cooldown": 1
   },
   {
    "name": "The Great Lie",
    "rarity": "Epic",
    "text": "All enemies within 15M roll Knowledge against 8+ or gain 3 Fear stacks and are disoriented for 1 phase.",
    "cooldown": 2
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Crag Goat",
  "family": "Peak Dwellers",
  "role": "Minion",
  "level": 4,
  "tactics": "Basic",
  "hp": 9,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 3,
   "KNO": -5,
   "SPD": 2,
   "PER": 2,
   "SPE": -5
  },
  "xp": 11,
  "attributes": "Sure-Footed: climbs at full speed and never falls on a failed climb. Come in herds.",
  "description": "Shaggy goats that leap between ledges no climber would try.",
  "abilities": [
   {
    "name": "Horn Butt",
    "rarity": "Basic",
    "text": "1 Strike D10+2. On 8 or more damage, the target is pushed back 1M.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "Rock Troll",
  "family": "Peak Dwellers",
  "role": "Elite",
  "level": 8,
  "tactics": "Fair",
  "hp": 88,
  "armor": 4,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 6,
   "AGI": -1,
   "KNO": -3,
   "SPD": 1,
   "PER": 1,
   "SPE": -4
  },
  "xp": 204,
  "attributes": "Big. Stone Regeneration: regains 1D8 HP at the end of each phase unless it took fire or frost damage that phase.",
  "description": "Hulking trolls with skin like weathered granite that slowly knits itself back together.",
  "abilities": [
   {
    "name": "Club Smash",
    "rarity": "Basic",
    "text": "1 Strike D20+12.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 12
    }
   },
   {
    "name": "Boulder Hurl",
    "rarity": "Common",
    "text": "2 Strikes D12+7. Ranged, 15M.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 7
    }
   },
   {
    "name": "Crushing Hug",
    "rarity": "Uncommon",
    "text": "2 Strikes D12+10. Roll strength against the target; if the troll wins, the target is held until it wins a Strength contest.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 10
    }
   }
  ]
 },
 {
  "name": "Griffin",
  "family": "Peak Dwellers",
  "role": "Elite",
  "level": 10,
  "tactics": "Fair",
  "hp": 115,
  "armor": 1,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 4,
   "KNO": -3,
   "SPD": 6,
   "PER": 5,
   "SPE": -4
  },
  "xp": 240,
  "attributes": "Big. Flying. Vidrikai's Wind: +2 to dodge rolls while flying. A griffin raised from an egg can be trained as a mount (GM's call).",
  "description": "Eagle-headed hunters of the high peaks, carried on Vidrikai's winds.",
  "abilities": [
   {
    "name": "Beak",
    "rarity": "Basic",
    "text": "1 Strike D20+13.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 13
    }
   },
   {
    "name": "Rending Talons",
    "rarity": "Common",
    "text": "2 Strikes D10+12.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 12
    }
   },
   {
    "name": "Diving Strike",
    "rarity": "Uncommon",
    "text": "Flies up to 15M, then 1 Strike 2D20+12.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 12
    }
   }
  ]
 },
 {
  "name": "Peak Giant",
  "family": "Peak Dwellers",
  "role": "Boss",
  "level": 16,
  "tactics": "Great",
  "hp": 490,
  "armor": 6,
  "size": "Huge",
  "alignment": "Neutral",
  "stats": {
   "STR": 12,
   "AGI": -2,
   "KNO": -1,
   "SPD": 2,
   "PER": 1,
   "SPE": -2
  },
  "xp": 1160,
  "attributes": "Huge. Cold Resistance: 25% resistance to cold/frost damage. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "Giants of living stone who sleep for years in the mountainsides and wake in rage when the peaks are mined.",
  "abilities": [
   {
    "name": "Stone Maul",
    "rarity": "Basic",
    "text": "1 Strike D20+8.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 8
    }
   },
   {
    "name": "Boulder Throw",
    "rarity": "Common",
    "text": "1 Strike 2D12+6. Ranged, 30M. Then 1 Strike D10 to all other entities within 2M of the target.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 6
    }
   },
   {
    "name": "Stomp",
    "rarity": "Uncommon",
    "text": "1 Strike D20+6 to all entities within 5M. Struck entities roll Agility against 7+ or are immobilized for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 6,
     "area": true
    }
   },
   {
    "name": "Avalanche Call",
    "rarity": "Rare",
    "text": "Only on a mountain slope. 3 Strikes D12+4 to all entities in a 5M wide, 20M long line. Struck entities are buried and need a Strength check of 8+ to move.",
    "attack": {
     "strikes": 3,
     "dice": 1,
     "sides": 12,
     "flat": 4,
     "area": true
    },
    "cooldown": 1
   },
   {
    "name": "Kato's Grip",
    "rarity": "Epic",
    "text": "Grabs a Large or smaller target within reach: roll Strength against the target. If the giant wins, it holds the target and strikes it once with 2D20+8 at the start of each of its turns, until the target wins a Strength contest or the giant takes 30 damage.",
    "cooldown": 2
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Glassback Crab",
  "family": "Obsidian Coast Beasts",
  "role": "Standard",
  "level": 7,
  "tactics": "Basic",
  "hp": 30,
  "armor": 4,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 0,
   "KNO": -5,
   "SPD": 0,
   "PER": 2,
   "SPE": -5
  },
  "xp": 62,
  "attributes": "Big. Heat Resistance: 50% resistance to fire/heat damage. Swims.",
  "description": "Crabs the size of a cart, their shells crusted with obsidian shards.",
  "abilities": [
   {
    "name": "Pincer",
    "rarity": "Basic",
    "text": "1 Strike D20+5.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 5
    }
   },
   {
    "name": "Glass Spray",
    "rarity": "Basic",
    "text": "1 Strike D10+2 to all entities in a 5M 90 degree arc. Damaging strikes add a bleed stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 2,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Obsidian Serpent",
  "family": "Obsidian Coast Beasts",
  "role": "Elite",
  "level": 11,
  "tactics": "Fair",
  "hp": 116,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 7,
   "AGI": 3,
   "KNO": -4,
   "SPD": 4,
   "PER": 3,
   "SPE": -5
  },
  "xp": 258,
  "attributes": "Big. Swims, and can swim through lava. Immune to heat and fire. 50% weakness to cold and frost.",
  "description": "A sea serpent whose scales are cooled lava; steam rises wherever it surfaces.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+18. Damaging strikes add a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 18
    }
   },
   {
    "name": "Coil",
    "rarity": "Common",
    "text": "2 Strikes D12+12.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 12
    }
   },
   {
    "name": "Molten Breath",
    "rarity": "Uncommon",
    "text": "1 Strike 2D10+8 to all entities in a 5M 90 degree arc. Damaging strikes add a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 10,
     "flat": 8,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Ash Corsair",
  "family": "Ash Corsairs",
  "role": "Standard",
  "level": 9,
  "tactics": "Fair",
  "hp": 47,
  "armor": 2,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 4,
   "AGI": 1,
   "KNO": -2,
   "SPD": 1,
   "PER": 1,
   "SPE": -2
  },
  "xp": 74,
  "attributes": "50% resistant to all poisons and toxins. +4 to speech for intimidation speech rolls.",
  "description": "Magnion raiders who take a scar for every ship they board.",
  "humanoid": true,
  "combatSkill": "Combat skill: Battle Axe or One Handed Axe. Skill tier: Base Tier 3. Damage stat: 4 (Strength). Weapon tier: 2. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Ash Corsair Warlord",
  "family": "Ash Corsairs",
  "role": "Elite",
  "level": 12,
  "tactics": "Great",
  "hp": 102,
  "armor": 6,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 5,
   "AGI": 1,
   "KNO": -1,
   "SPD": 1,
   "PER": 2,
   "SPE": -1
  },
  "xp": 276,
  "attributes": "War Horn: Quick, once per combat. Every allied Ash Corsair within 10M gains +2 attack bonus until the end of the phase. 50% resistant to all poisons and toxins. +4 to speech for intimidation speech rolls.",
  "description": "The chosen champion of a raiding fleet, wrapped in heavy obsidian plate.",
  "humanoid": true,
  "combatSkill": "Combat skill: Battle Axe (Barbarian's Path). Skill tier: Path Tier 1. Damage stat: 5 (Strength). Weapon tier: 3. Uses that skill's abilities up to Path Tier 1, of rarity up to Epic (its tactics), with its path's basic attack."
 },
 {
  "name": "Dune Scorpion",
  "family": "Dune Beasts",
  "role": "Standard",
  "level": 6,
  "tactics": "Basic",
  "hp": 36,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": -5,
   "SPD": 2,
   "PER": 3,
   "SPE": -5
  },
  "xp": 56,
  "attributes": "Big. Burrow. Heat Resistance: 50% resistance to fire/heat damage.",
  "description": "Sand-colored scorpions as long as a horse.",
  "abilities": [
   {
    "name": "Sting",
    "rarity": "Basic",
    "text": "1 Strike D20+4. Damaging strikes add a poison stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 4
    }
   },
   {
    "name": "Pincer Grab",
    "rarity": "Basic",
    "text": "Roll agility vs a melee range opponent. If the scorpion wins, the target is held until it wins a Strength check of 7+."
   }
  ]
 },
 {
  "name": "Great Sandworm",
  "family": "Dune Beasts",
  "role": "Boss",
  "level": 15,
  "tactics": "Great",
  "hp": 470,
  "armor": 6,
  "size": "Massive",
  "alignment": "Neutral",
  "stats": {
   "STR": 12,
   "AGI": -4,
   "KNO": -5,
   "SPD": 3,
   "PER": 2,
   "SPE": -5
  },
  "xp": 1100,
  "attributes": "Massive. Burrow. Tremorsense: perceives anything touching the ground within 30M, ignoring invisibility. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "A worm so large the dunes ripple for miles before it rises. Nomad songs say it is older than the desert.",
  "abilities": [
   {
    "name": "Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+8.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 8
    }
   },
   {
    "name": "Thrash",
    "rarity": "Common",
    "text": "1 Strike D12+6 to all entities within 3M.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 6,
     "area": true
    }
   },
   {
    "name": "Swallow",
    "rarity": "Uncommon",
    "text": "One Large or smaller target within reach rolls Agility against the worm. On a loss it is swallowed: it takes 2D10 acid damage (ignoring armor) at the start of each of the worm's turns, and can only attack the worm, ignoring its armor. It escapes by dealing 30 damage from inside, or when the worm dies."
   },
   {
    "name": "Burrow and Rise",
    "rarity": "Rare",
    "text": "The worm burrows. On its next turn it bursts up beneath up to 3 targets within 15M: 1 Strike 2D12+6 to each, and each is pushed back 3M.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 6,
     "area": true
    },
    "cooldown": 1
   },
   {
    "name": "Sand Collapse",
    "rarity": "Epic",
    "text": "The ground within 15M becomes sinking sand for 3 phases: difficult terrain, and a Strength check of 7+ is needed each turn to move at all.",
    "cooldown": 2
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Dune Nomad Raider",
  "family": "Dune Nomads",
  "role": "Standard",
  "level": 7,
  "tactics": "Fair",
  "hp": 45,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 3,
   "KNO": 0,
   "SPD": 2,
   "PER": 3,
   "SPE": 0
  },
  "xp": 62,
  "attributes": "Desert Born: no penalties from heat or sand, and +2 to sneaking rolls in sand.",
  "description": "Veiled riders who strike caravans at dawn and vanish into the dunes.",
  "humanoid": true,
  "combatSkill": "Combat skill: Spear or Bow. Skill tier: Base Tier 3. Damage stat: 3 (Agility). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Nomad Sandcaller",
  "family": "Dune Nomads",
  "role": "Elite",
  "level": 10,
  "tactics": "Great",
  "hp": 120,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": 1,
   "KNO": 4,
   "SPD": 1,
   "PER": 3,
   "SPE": 2
  },
  "xp": 240,
  "attributes": "Sandstorm: Quick, once per combat. A sandstorm fills a 10M radius around the Sandcaller for 3 phases. Inside it, anyone not of the desert has -2 Perception and -20% ranged accuracy. Desert Born: no penalties from heat or sand. Usually rides with a band of Dune Nomad Raiders.",
  "description": "Clan mages who speak to the desert wind and are answered.",
  "humanoid": true,
  "combatSkill": "Combat skill: Alteration, plus Fire at two tiers lower. Skill tier: Base Tier 4. Damage stat: 4 (Knowledge). Weapon tier: 2. Uses that skill's abilities up to Base Tier 4, of rarity up to Epic (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Gilded Thrall",
  "family": "Eldrius's Gilded",
  "role": "Standard",
  "level": 7,
  "tactics": "Fair",
  "hp": 35,
  "armor": 3,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": 3,
   "AGI": 0,
   "KNO": 0,
   "SPD": 0,
   "PER": 1,
   "SPE": 1
  },
  "xp": 62,
  "attributes": "Greed-Bound: when marks or treasure are thrown within 3M of it, the Thrall must succeed a Knowledge check of 6+ or spend its turn gathering them. Shock damage ignores its golden-skin armor.",
  "description": "Servants of a greed-touched house, their skin half turned to gold.",
  "humanoid": true,
  "combatSkill": "Combat skill: Mace. Skill tier: Base Tier 3. Damage stat: 3 (Strength). Weapon tier: 1. Uses that skill's abilities up to Base Tier 3, of rarity up to Uncommon (its tactics), with Base Tier 3 upgraded basic attack."
 },
 {
  "name": "Greed Golem",
  "family": "Eldrius's Gilded",
  "role": "Elite",
  "level": 11,
  "tactics": "Fair",
  "hp": 96,
  "armor": 6,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 8,
   "AGI": -2,
   "KNO": -3,
   "SPD": -1,
   "PER": 1,
   "SPE": -5
  },
  "xp": 258,
  "attributes": "Big. Construct. Immune to poisons and toxins. Shock damage ignores its armor. When destroyed it leaves 1D4 × 100 marks of gold.",
  "description": "A golem of solid gold, made to guard a hoard that its maker can no longer bear to leave.",
  "abilities": [
   {
    "name": "Gold Fist",
    "rarity": "Basic",
    "text": "1 Strike D20+18.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 18
    }
   },
   {
    "name": "Golden Touch",
    "rarity": "Common",
    "text": "2 Strikes D12+12. Each damaging strike turns part of the target's armor or weapon to soft gold: it loses 1D4 Condition.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 12
    }
   },
   {
    "name": "Molten Hoard",
    "rarity": "Uncommon",
    "text": "1 Strike D12+6 to all enemies within 5M. Struck entities roll Agility against 7+ or are immobilized in cooling gold for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 12,
     "flat": 6,
     "area": true
    }
   }
  ]
 },
 {
  "name": "The Gilded Sovereign",
  "family": "Eldrius's Gilded",
  "role": "Boss",
  "level": 16,
  "tactics": "Great",
  "hp": 490,
  "armor": 6,
  "size": "Average",
  "alignment": "Lawful-Evil",
  "stats": {
   "STR": 4,
   "AGI": 1,
   "KNO": 5,
   "SPD": 0,
   "PER": 3,
   "SPE": 6
  },
  "xp": 1160,
  "attributes": "Boss: takes two turns each phase (each rolls on its tactics table). The Greed Stone: when the Sovereign falls, the Greed Stone drops (an artifact of Eldrius; the GM decides its power). Usually guarded by a Greed Golem and Gilded Thralls.",
  "description": "A monarch who held the Greed Stone too long. Now a living statue of gold sits on the throne, and the Stone beats in its chest like a heart.",
  "abilities": [
   {
    "name": "Scepter Strike",
    "rarity": "Basic",
    "text": "1 Strike D20+8.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 8
    }
   },
   {
    "name": "Midas Lash",
    "rarity": "Common",
    "text": "2 Strikes D10+4. Each damaging strike deals 1D4 Condition damage to the target's armor.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 4
    }
   },
   {
    "name": "Covetous Gaze",
    "rarity": "Uncommon",
    "text": "One enemy within 15M rolls Knowledge against 9+. On a failure, it drops one held item of the Sovereign's choice (weapon, shield or potion) at the Sovereign's feet."
   },
   {
    "name": "Gold Rain",
    "rarity": "Rare",
    "text": "3 Strikes D10+4 to all entities in a 3M radius within 20M.",
    "attack": {
     "strikes": 3,
     "dice": 1,
     "sides": 10,
     "flat": 4,
     "area": true
    },
    "cooldown": 1
   },
   {
    "name": "Gilding",
    "rarity": "Epic",
    "text": "One enemy within 10M rolls Strength against the Sovereign's Knowledge. On a loss, it gains 3 paralysis stacks as gold creeps over its skin.",
    "cooldown": 2
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Frost Strider",
  "family": "The Great Hunts",
  "role": "Standard",
  "level": 6,
  "tactics": "Basic",
  "hp": 41,
  "armor": 1,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 2,
   "KNO": -5,
   "SPD": 6,
   "PER": 3,
   "SPE": -5
  },
  "xp": 56,
  "attributes": "Big. Frost Resistance: 50% resistance to frost/cold damage. Travel in herds.",
  "description": "Tall white elk with antlers like branches of ice.",
  "abilities": [
   {
    "name": "Antler Charge",
    "rarity": "Basic",
    "text": "1 Strike D20+4. If the strider charged, the target is pushed back 2M.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 4
    }
   }
  ]
 },
 {
  "name": "Rime Mammoth",
  "family": "The Great Hunts",
  "role": "Elite",
  "level": 11,
  "tactics": "Fair",
  "hp": 106,
  "armor": 4,
  "size": "Huge",
  "alignment": "Neutral",
  "stats": {
   "STR": 9,
   "AGI": -2,
   "KNO": -4,
   "SPD": 2,
   "PER": 1,
   "SPE": -5
  },
  "xp": 258,
  "attributes": "Huge. Frost Resistance: 50% resistance to frost/cold damage.",
  "description": "Shaggy mammoths crusted in frost, the greatest prize of an ordinary Kled hunt.",
  "abilities": [
   {
    "name": "Tusk Gore",
    "rarity": "Basic",
    "text": "1 Strike D20+18.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 18
    }
   },
   {
    "name": "Trample",
    "rarity": "Common",
    "text": "1 Strike D20+14 to all entities in a 5M line. Struck entities roll Strength against the mammoth or are disoriented for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 14,
     "area": true
    }
   },
   {
    "name": "Trunk Hurl",
    "rarity": "Uncommon",
    "text": "Roll strength against a target in reach. If the mammoth wins, the target is thrown 1M per point of difference and struck once with 2D12+12."
   }
  ]
 },
 {
  "name": "Glacian's Wrath",
  "family": "The Great Hunts",
  "role": "Boss",
  "level": 20,
  "tactics": "Excellent",
  "hp": 560,
  "armor": 8,
  "size": "Massive",
  "alignment": "Neutral",
  "stats": {
   "STR": 14,
   "AGI": -3,
   "KNO": -2,
   "SPD": 2,
   "PER": 3,
   "SPE": -5
  },
  "xp": 1400,
  "attributes": "Massive. Immune to frost and frozen stacks. 50% weakness to fire. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "A beast of living glacier that wakes once in a generation. The Kled say Glacian dreams it, and the Menders keep a page for every hunter who faced it.",
  "abilities": [
   {
    "name": "Glacier Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+12. Damaging strikes add a frozen stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 12
    }
   },
   {
    "name": "Ice Claws",
    "rarity": "Common",
    "text": "2 Strikes D12+6.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 6
    }
   },
   {
    "name": "Frost Breath",
    "rarity": "Uncommon",
    "text": "1 Strike 2D12+8 to all entities in a 10M 90 degree arc. Struck entities gain 2 frozen stacks.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 8,
     "area": true
    }
   },
   {
    "name": "Shatter the Ice",
    "rarity": "Rare",
    "text": "All entities within 10M roll Agility against 8+ or fall into a crevasse: falling damage for 5M, and they can not move until they climb out (Strength check of 8+).",
    "cooldown": 1
   },
   {
    "name": "Whiteout",
    "rarity": "Epic",
    "text": "A blizzard fills a 20M radius for 3 phases. Enemies inside gain 1 frozen stack each phase and have -3 Perception.",
    "cooldown": 2
   },
   {
    "name": "Glacian's Breath",
    "rarity": "Legendary",
    "text": "1 Strike 3D20 frost damage to all entities in a 15M 90 degree arc. Struck entities gain 3 frozen stacks.",
    "attack": {
     "strikes": 1,
     "dice": 3,
     "sides": 20,
     "flat": 0,
     "area": true
    },
    "cooldown": 3
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Giggling Wretch",
  "family": "Aubrekian's Chosen",
  "role": "Minion",
  "level": 4,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Average",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 0,
   "AGI": 1,
   "KNO": -3,
   "SPD": 1,
   "PER": -1,
   "SPE": -2
  },
  "xp": 11,
  "attributes": "Infectious Laughter: when a Wretch dies, every enemy within 3M rolls Knowledge against 5+ or gains 1 Anger stack.",
  "description": "Mortals who met Aubrekian once. They have not stopped laughing.",
  "abilities": [
   {
    "name": "Flailing Claws",
    "rarity": "Basic",
    "text": "1 Strike D10+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "The Shifting Thing",
  "family": "Aubrekian's Chosen",
  "role": "Elite",
  "level": 10,
  "tactics": "Fair",
  "hp": 120,
  "armor": 0,
  "size": "Large",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 5,
   "AGI": 4,
   "KNO": 0,
   "SPD": 4,
   "PER": 4,
   "SPE": -2
  },
  "xp": 240,
  "attributes": "Big. Immune to Calm, Anger and Fear stacks.",
  "description": "A creature that never holds one shape for long. Watching it change is enough to make the eyes water.",
  "abilities": [
   {
    "name": "Shifting Form",
    "rarity": "Basic",
    "text": "At the start of each turn, roll a D6. The result sets its form and its basic attack until its next turn. 1, Maw: 1 Strike D20+17; a damaging strike adds a bleed stack. 2, Spines: 3 Strikes D8+5 to targets within 3M. 3, Wings: flies up to 10M, then 1 Strike D20+15. 4, Eyes: 2 Strikes D12+6 psychic damage, ranged 20M. 5, Shell: +6 armor until its next turn, and 1 Strike D20+12. 6, Mirth: every enemy within 10M rolls Knowledge against 7+ or gains 2 Anger stacks, then 1 Strike D20+12.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 17
    }
   },
   {
    "name": "Wrong Angle",
    "rarity": "Common",
    "text": "2 Strikes D12+10 from a direction that should not exist. These strikes can not be dodged.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 10
    }
   },
   {
    "name": "Unravel",
    "rarity": "Uncommon",
    "text": "One enemy within 10M rolls Knowledge against 8+ or is disoriented for 2 phases."
   }
  ]
 },
 {
  "name": "The Laughing Maw",
  "family": "Aubrekian's Chosen",
  "role": "Boss",
  "level": 18,
  "tactics": "Great",
  "hp": 560,
  "armor": 0,
  "size": "Huge",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 8,
   "AGI": 2,
   "KNO": 2,
   "SPD": 3,
   "PER": 5,
   "SPE": 4
  },
  "xp": 1280,
  "attributes": "Huge. Immune to Calm, Anger and Fear stacks. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "A mouth the size of a cottage that grins from wherever it pleases. Aubrekian's favorite joke.",
  "abilities": [
   {
    "name": "Grinning Bite",
    "rarity": "Basic",
    "text": "1 Strike D20+9.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 9
    }
   },
   {
    "name": "Lolling Tongues",
    "rarity": "Common",
    "text": "3 Strikes D8+3 to up to 3 targets within 5M.",
    "attack": {
     "strikes": 3,
     "dice": 1,
     "sides": 8,
     "flat": 3,
     "area": true
    }
   },
   {
    "name": "A Joke Told Wrong",
    "rarity": "Uncommon",
    "text": "All enemies within 15M roll Knowledge against 8+ or gain 2 Anger stacks."
   },
   {
    "name": "Reality Hiccup",
    "rarity": "Rare",
    "text": "Up to 4 entities within 20M swap places at random (the GM decides). Each enemy moved this way is struck once with 2D10 psychic damage.",
    "cooldown": 1
   },
   {
    "name": "Aubrekian's Gift",
    "rarity": "Epic",
    "text": "Roll a D6. 1: the Maw heals 50 HP. 2: every enemy within 15M is disoriented for 2 phases. 3: the Maw splits into two, each with half its current HP, each a Boss taking one turn per phase. 4: every enemy's next card counts as one rarity higher. 5: three Giggling Wretches appear within 10M. 6: 1 Strike 2D20+10 psychic damage to all entities within 10M.",
    "cooldown": 2
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Primordial Wisp",
  "family": "Scarborn",
  "role": "Minion",
  "level": 8,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Small",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": -5,
   "AGI": 4,
   "KNO": -5,
   "SPD": 3,
   "PER": 2,
   "SPE": -5
  },
  "xp": 17,
  "attributes": "Flying. Small. Unstable: when a Wisp dies it bursts, striking once with D8 every entity within 2M.",
  "description": "Drifting sparks of raw Primordium that burn whatever they touch.",
  "abilities": [
   {
    "name": "Searing Touch",
    "rarity": "Basic",
    "text": "1 Strike D10+4.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 4
    }
   }
  ]
 },
 {
  "name": "Rift Stalker",
  "family": "Scarborn",
  "role": "Standard",
  "level": 10,
  "tactics": "Basic",
  "hp": 60,
  "armor": 0,
  "size": "Average",
  "alignment": "Chaotic-Evil",
  "stats": {
   "STR": 3,
   "AGI": 4,
   "KNO": -3,
   "SPD": 5,
   "PER": 4,
   "SPE": -5
  },
  "xp": 80,
  "attributes": "Unholy. Magic Resistance: 50% resistance to magic damage.",
  "description": "Lean, many-jointed hunters that step through small tears in the world.",
  "abilities": [
   {
    "name": "Rift Claws",
    "rarity": "Basic",
    "text": "2 Strikes D10+4.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 4
    }
   },
   {
    "name": "Rift Step",
    "rarity": "Basic",
    "text": "Used as a Quick action. Teleports up to 5M to a space it can see."
   }
  ]
 },
 {
  "name": "Scarborn Colossus",
  "family": "Scarborn",
  "role": "Elite",
  "level": 18,
  "tactics": "Good",
  "hp": 128,
  "armor": 8,
  "size": "Huge",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 12,
   "AGI": -2,
   "KNO": -3,
   "SPD": 1,
   "PER": 2,
   "SPE": -5
  },
  "xp": 384,
  "attributes": "Huge. Unholy. Magic Resistance: 50% resistance to magic damage.",
  "description": "A walking mass of fused stone, bone and glass, with Primordium light bleeding from its seams.",
  "abilities": [
   {
    "name": "Crushing Limb",
    "rarity": "Basic",
    "text": "1 Strike D20+28.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 28
    }
   },
   {
    "name": "Shard Volley",
    "rarity": "Common",
    "text": "3 Strikes D12+10, each against a different target within 20M if it can.",
    "attack": {
     "strikes": 3,
     "dice": 1,
     "sides": 12,
     "flat": 10,
     "area": true
    }
   },
   {
    "name": "Primordial Pulse",
    "rarity": "Uncommon",
    "text": "1 Strike 2D12+12 to all entities within 5M. Damaging strikes add one random negative stack.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 12,
     "area": true
    }
   },
   {
    "name": "Rift Tear",
    "rarity": "Rare",
    "text": "1 Strike 2D20+10 to all entities in a 5M line, and each is pulled 3M toward the Colossus.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 20,
     "flat": 10,
     "area": true
    },
    "cooldown": 1
   }
  ]
 },
 {
  "name": "Heart of the Scar",
  "family": "Scarborn",
  "role": "Boss",
  "level": 22,
  "tactics": "Excellent",
  "hp": 640,
  "armor": 0,
  "size": "Massive",
  "alignment": "Chaotic-Neutral",
  "stats": {
   "STR": 10,
   "AGI": -5,
   "KNO": 4,
   "SPD": -10,
   "PER": 6,
   "SPE": 0
  },
  "xp": 1520,
  "attributes": "Massive. Immobile. Unholy. Magic Resistance: 50% resistance to magic damage. Immune to poisons and toxins, and to Calm, Anger and Fear stacks. Call of the Heart: when it falls below half HP, every Scarborn within 30M moves toward it. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "At the center of the Scar, a beating mass of raw Primordium has grown a will of its own. It does not move. It does not need to.",
  "abilities": [
   {
    "name": "Primordial Lash",
    "rarity": "Basic",
    "text": "1 Strike D20+12. Reach 10M.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 12
    }
   },
   {
    "name": "Shatter Pulse",
    "rarity": "Common",
    "text": "1 Strike 2D10+4 to all enemies within 10M. Damaging strikes add one random negative stack.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 10,
     "flat": 4,
     "area": true
    }
   },
   {
    "name": "Spawn",
    "rarity": "Uncommon",
    "text": "Two Primordial Wisps form within 10M. No more than six may be in play at once."
   },
   {
    "name": "Rift Gaze",
    "rarity": "Rare",
    "text": "1 Strike 3D12+8 ignoring armor against a target within 30M.",
    "attack": {
     "strikes": 1,
     "dice": 3,
     "sides": 12,
     "flat": 8,
     "ignoreArmor": true
    },
    "cooldown": 1
   },
   {
    "name": "Warp Flesh",
    "rarity": "Epic",
    "text": "All enemies within 20M roll Knowledge against 9+. On a failure, an enemy is Shattered for 2 phases: -2 to all stats, and 1D6 damage at the end of each phase.",
    "cooldown": 2
   },
   {
    "name": "Primordial Surge",
    "rarity": "Legendary",
    "text": "1 Strike 4D12+10 to all entities within 15M. The Heart heals 10% of its maximum HP.",
    "attack": {
     "strikes": 1,
     "dice": 4,
     "sides": 12,
     "flat": 10,
     "area": true
    },
    "cooldown": 3
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Reef Eel",
  "family": "The Deep",
  "role": "Minion",
  "level": 3,
  "tactics": "Basic",
  "hp": 11,
  "armor": 0,
  "size": "Small",
  "alignment": "Neutral",
  "stats": {
   "STR": -2,
   "AGI": 3,
   "KNO": -5,
   "SPD": 3,
   "PER": 2,
   "SPE": -5
  },
  "xp": 10,
  "attributes": "Small. Swims; breathes water only. Come in swarms.",
  "description": "Banded eels that carry a crackling charge.",
  "abilities": [
   {
    "name": "Shocking Bite",
    "rarity": "Basic",
    "text": "1 Strike D10+2. Ignores metal armor.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 10,
     "flat": 2
    }
   }
  ]
 },
 {
  "name": "Drowned Sailor",
  "family": "The Deep",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 42,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral-Evil",
  "stats": {
   "STR": 3,
   "AGI": 0,
   "KNO": -4,
   "SPD": 0,
   "PER": 1,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Undead. Swims; breathes water. Immune to poisons and toxins.",
  "description": "Sailors lost at sea who still walk the sea floor, and come up to drag others down to join them.",
  "abilities": [
   {
    "name": "Rotted Cutlass",
    "rarity": "Basic",
    "text": "1 Strike D20+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Drag Down",
    "rarity": "Basic",
    "text": "Only in water. Roll strength against a target in reach. If the Drowned wins, the target is pulled under and takes 1D6 damage at the end of each phase until it surfaces (Strength check of 7+, or an ally pulls it free)."
   }
  ]
 },
 {
  "name": "Tidecaller",
  "family": "The Deep",
  "role": "Elite",
  "level": 12,
  "tactics": "Good",
  "hp": 132,
  "armor": 0,
  "size": "Average",
  "alignment": "Lawful-Neutral",
  "stats": {
   "STR": 4,
   "AGI": 4,
   "KNO": 4,
   "SPD": 3,
   "PER": 4,
   "SPE": 2
  },
  "xp": 276,
  "attributes": "Swims; breathes air and water. Frost Resistance: 50% resistance to frost/cold damage.",
  "description": "Merfolk priests of the deep who claim to speak for Lyra, though Lyra has never said so.",
  "abilities": [
   {
    "name": "Coral Spear",
    "rarity": "Basic",
    "text": "1 Strike D20+19.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 19
    }
   },
   {
    "name": "Riptide",
    "rarity": "Common",
    "text": "2 Strikes D12+12. The target is pulled 3M toward the Tidecaller.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 12
    }
   },
   {
    "name": "Crushing Wave",
    "rarity": "Uncommon",
    "text": "1 Strike 2D12+10 to all entities in a 10M 90 degree arc. Struck entities roll Strength against 8+ or are pushed back 4M.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 10,
     "area": true
    }
   },
   {
    "name": "Call the Drowned",
    "rarity": "Rare",
    "text": "Two Drowned Sailors rise within 10M. No more than four may be in play at once.",
    "cooldown": 1
   }
  ]
 },
 {
  "name": "Titan of the Deep",
  "family": "The Deep",
  "role": "Boss",
  "level": 25,
  "tactics": "Excellent",
  "hp": 650,
  "armor": 10,
  "size": "Massive",
  "alignment": "Neutral",
  "stats": {
   "STR": 16,
   "AGI": 2,
   "KNO": 0,
   "SPD": 4,
   "PER": 4,
   "SPE": -5
  },
  "xp": 1700,
  "attributes": "Massive. Swims; breathes water and can not leave it. Frost Resistance: 50% resistance to frost/cold damage. Boss: takes two turns each phase (each rolls on its tactics table).",
  "description": "The oldest thing in Lyra's waters: a many-armed shape larger than any ship, which rises only when the sea itself is angry.",
  "abilities": [
   {
    "name": "Tentacle Slam",
    "rarity": "Basic",
    "text": "1 Strike D20+15. Reach 10M.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 15
    }
   },
   {
    "name": "Grasping Tentacles",
    "rarity": "Common",
    "text": "Up to 3 targets within 10M roll Agility against the Titan. Each that loses is held and takes 2D10 damage at the start of each of the Titan's turns until it wins a Strength contest."
   },
   {
    "name": "Ink Cloud",
    "rarity": "Uncommon",
    "text": "A 10M radius around the Titan blocks sight for 2 phases."
   },
   {
    "name": "Whirlpool",
    "rarity": "Rare",
    "text": "Only in water. All entities within 15M roll Strength against 9+ or are pulled 5M toward the Titan and struck once with 2D12+6.",
    "cooldown": 1
   },
   {
    "name": "Breach",
    "rarity": "Epic",
    "text": "The Titan surges up: 1 Strike 3D20+10 to all entities within 10M. Ships and structures take double damage.",
    "attack": {
     "strikes": 1,
     "dice": 3,
     "sides": 20,
     "flat": 10,
     "area": true
    },
    "cooldown": 2
   },
   {
    "name": "Maw of the Deep",
    "rarity": "Legendary",
    "text": "Swallows a held Large or smaller target. It takes 3D10 damage at the start of each of the Titan's turns and can only attack the Titan, ignoring its armor. It escapes by dealing 50 damage from inside, or when the Titan dies.",
    "cooldown": 3
   }
  ],
  "turnsPerPhase": 2
 },
 {
  "name": "Sky Elemental",
  "family": "Elementals of the Dahn",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 42,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 1,
   "AGI": 3,
   "KNO": -2,
   "SPD": 4,
   "PER": 3,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Flying. Immune to shock and static stacks.",
  "description": "A fragment of Vira's power, given shape and a simple will.",
  "abilities": [
   {
    "name": "Lightning Lash",
    "rarity": "Basic",
    "text": "1 Strike D20+2. Ignores metal armor. On 12 or more damage, adds a static stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Static Charge",
    "rarity": "Basic",
    "text": "Used as a Quick action. Discharges every static stack on one enemy within 10M for 1D6 each."
   }
  ]
 },
 {
  "name": "Greater Sky Elemental",
  "family": "Elementals of the Dahn",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 132,
  "armor": 0,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": 4,
   "KNO": -1,
   "SPD": 5,
   "PER": 4,
   "SPE": -5
  },
  "xp": 276,
  "attributes": "Big. Flying. Immune to shock and static stacks.",
  "description": "A great surge of Vira's power, appearing where the Dahn stirs in its sleep.",
  "abilities": [
   {
    "name": "Storm Lash",
    "rarity": "Basic",
    "text": "1 Strike D20+19. Ignores metal armor. On 20 or more damage, adds a static stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 19
    }
   },
   {
    "name": "Chain Bolt",
    "rarity": "Common",
    "text": "1 Strike 2D12+10 to up to 3 targets within 15M. Ignores metal armor.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 12,
     "flat": 10,
     "area": true
    }
   },
   {
    "name": "Thunderhead",
    "rarity": "Uncommon",
    "text": "All enemies within 5M gain 2 static stacks. At the start of its next turn the elemental may discharge them for 1D8 each."
   }
  ]
 },
 {
  "name": "Water Elemental",
  "family": "Elementals of the Dahn",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 37,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 2,
   "KNO": -2,
   "SPD": 2,
   "PER": 2,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Swims. Heat Resistance: 50% resistance to fire/heat damage.",
  "description": "A fragment of Lyra's power, given shape and a simple will.",
  "abilities": [
   {
    "name": "Crashing Wave",
    "rarity": "Basic",
    "text": "1 Strike D20+2. The target is pushed back 1M.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Douse",
    "rarity": "Basic",
    "text": "Removes all flame stacks from every entity within 3M."
   }
  ]
 },
 {
  "name": "Greater Water Elemental",
  "family": "Elementals of the Dahn",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 122,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 6,
   "AGI": 2,
   "KNO": -1,
   "SPD": 3,
   "PER": 3,
   "SPE": -5
  },
  "xp": 276,
  "attributes": "Big. Swims. Heat Resistance: 50% resistance to fire/heat damage.",
  "description": "A great surge of Lyra's power, appearing where the Dahn stirs in its sleep.",
  "abilities": [
   {
    "name": "Torrent",
    "rarity": "Basic",
    "text": "1 Strike D20+19.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 19
    }
   },
   {
    "name": "Engulf",
    "rarity": "Common",
    "text": "2 Strikes D12+12. Roll strength against the target; if the elemental wins, the target is held inside it and takes 1D6 damage at the end of each phase until it wins a Strength contest.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 12
    }
   },
   {
    "name": "Tidal Surge",
    "rarity": "Uncommon",
    "text": "1 Strike 2D10+10 to all entities in a 10M line. Struck entities are pushed back 3M.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 10,
     "flat": 10,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Fire Elemental",
  "family": "Elementals of the Dahn",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 42,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 2,
   "AGI": 3,
   "KNO": -2,
   "SPD": 3,
   "PER": 2,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Immune to heat, fire and flame stacks. 50% weakness to cold and frost.",
  "description": "A fragment of Magnis's power, given shape and a simple will.",
  "abilities": [
   {
    "name": "Flame Lash",
    "rarity": "Basic",
    "text": "1 Strike D20+2. On 12 or more damage, adds a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Kindle",
    "rarity": "Basic",
    "text": "Sets the ground within 2M ablaze for 2 phases. Anyone who ends a turn there gains a flame stack."
   }
  ]
 },
 {
  "name": "Greater Fire Elemental",
  "family": "Elementals of the Dahn",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 132,
  "armor": 0,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 5,
   "AGI": 3,
   "KNO": -1,
   "SPD": 4,
   "PER": 3,
   "SPE": -5
  },
  "xp": 276,
  "attributes": "Big. Immune to heat, fire and flame stacks. 50% weakness to cold and frost.",
  "description": "A great surge of Magnis's power, appearing where the Dahn stirs in its sleep.",
  "abilities": [
   {
    "name": "Inferno Fist",
    "rarity": "Basic",
    "text": "1 Strike D20+19. Damaging strikes add a flame stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 19
    }
   },
   {
    "name": "Fire Whirl",
    "rarity": "Common",
    "text": "2 Strikes D12+12. Each damaging strike adds a flame stack.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 12
    }
   },
   {
    "name": "Eruption",
    "rarity": "Uncommon",
    "text": "1 Strike 2D10+10 to all entities within 5M. Struck entities gain 2 flame stacks.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 10,
     "flat": 10,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Stone Elemental",
  "family": "Elementals of the Dahn",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 27,
  "armor": 3,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 4,
   "AGI": -2,
   "KNO": -2,
   "SPD": 0,
   "PER": 1,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Can move through earth and stone. Immune to poisons and toxins.",
  "description": "A fragment of Kato's power, given shape and a simple will.",
  "abilities": [
   {
    "name": "Stone Fist",
    "rarity": "Basic",
    "text": "1 Strike D20+2.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Earthmeld",
    "rarity": "Basic",
    "text": "Sinks into stone and moves through it up to 5M, surfacing anywhere along the way."
   }
  ]
 },
 {
  "name": "Greater Stone Elemental",
  "family": "Elementals of the Dahn",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 102,
  "armor": 6,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 8,
   "AGI": -2,
   "KNO": -1,
   "SPD": 0,
   "PER": 2,
   "SPE": -5
  },
  "xp": 276,
  "attributes": "Big. Can move through earth and stone. Immune to poisons and toxins.",
  "description": "A great surge of Kato's power, appearing where the Dahn stirs in its sleep.",
  "abilities": [
   {
    "name": "Boulder Fist",
    "rarity": "Basic",
    "text": "1 Strike D20+19.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 19
    }
   },
   {
    "name": "Stone Spikes",
    "rarity": "Common",
    "text": "2 Strikes D12+12 rising from the ground beneath one target.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 12
    }
   },
   {
    "name": "Tremor",
    "rarity": "Uncommon",
    "text": "1 Strike 2D10+10 to all entities within 5M. Struck entities roll Agility against 7+ or are immobilized for 1 phase.",
    "attack": {
     "strikes": 1,
     "dice": 2,
     "sides": 10,
     "flat": 10,
     "area": true
    }
   }
  ]
 },
 {
  "name": "Wind Elemental",
  "family": "Elementals of the Dahn",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 42,
  "armor": 0,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 0,
   "AGI": 5,
   "KNO": -2,
   "SPD": 6,
   "PER": 3,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Flying. +2 to dodge rolls. Can not be held or grappled.",
  "description": "A fragment of Vidrikai's power, given shape and a simple will.",
  "abilities": [
   {
    "name": "Gust Blades",
    "rarity": "Basic",
    "text": "2 Strikes D10+1.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 1
    }
   },
   {
    "name": "Updraft",
    "rarity": "Basic",
    "text": "Used as a Quick action. Lifts one ally of the elemental, or itself, up to 5M in any direction."
   }
  ]
 },
 {
  "name": "Greater Wind Elemental",
  "family": "Elementals of the Dahn",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 132,
  "armor": 0,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 6,
   "KNO": -1,
   "SPD": 7,
   "PER": 4,
   "SPE": -5
  },
  "xp": 276,
  "attributes": "Big. Flying. +2 to dodge rolls. Can not be held or grappled.",
  "description": "A great surge of Vidrikai's power, appearing where the Dahn stirs in its sleep.",
  "abilities": [
   {
    "name": "Cutting Gale",
    "rarity": "Basic",
    "text": "2 Strikes D12+8.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 8
    }
   },
   {
    "name": "Cyclone",
    "rarity": "Common",
    "text": "2 Strikes D10+10 to all entities within 3M. Struck entities are pulled 2M toward the elemental.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 10,
     "flat": 10,
     "area": true
    }
   },
   {
    "name": "Vidrikai's Breath",
    "rarity": "Uncommon",
    "text": "All entities in a 10M 90 degree arc roll Strength against 8+ or are pushed back 6M. A pushed entity that hits a wall takes falling damage for the distance it had left."
   }
  ]
 },
 {
  "name": "Ice Elemental",
  "family": "Elementals of the Dahn",
  "role": "Standard",
  "level": 5,
  "tactics": "Basic",
  "hp": 37,
  "armor": 1,
  "size": "Average",
  "alignment": "Neutral",
  "stats": {
   "STR": 3,
   "AGI": 1,
   "KNO": -2,
   "SPD": 1,
   "PER": 2,
   "SPE": -5
  },
  "xp": 50,
  "attributes": "Immune to frost and frozen stacks. 50% weakness to fire.",
  "description": "A fragment of Glacian's power, given shape and a simple will.",
  "abilities": [
   {
    "name": "Frost Touch",
    "rarity": "Basic",
    "text": "1 Strike D20+2. Damaging strikes add a frozen stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 2
    }
   },
   {
    "name": "Ice Floor",
    "rarity": "Basic",
    "text": "Freezes the ground within 3M for 2 phases. It is difficult terrain, and a dodge made on it is rolled at -2."
   }
  ]
 },
 {
  "name": "Greater Ice Elemental",
  "family": "Elementals of the Dahn",
  "role": "Elite",
  "level": 12,
  "tactics": "Fair",
  "hp": 122,
  "armor": 2,
  "size": "Large",
  "alignment": "Neutral",
  "stats": {
   "STR": 6,
   "AGI": 1,
   "KNO": -1,
   "SPD": 2,
   "PER": 3,
   "SPE": -5
  },
  "xp": 276,
  "attributes": "Big. Immune to frost and frozen stacks. 50% weakness to fire.",
  "description": "A great surge of Glacian's power, appearing where the Dahn stirs in its sleep.",
  "abilities": [
   {
    "name": "Ice Talon",
    "rarity": "Basic",
    "text": "1 Strike D20+19. Damaging strikes add a frozen stack.",
    "attack": {
     "strikes": 1,
     "dice": 1,
     "sides": 20,
     "flat": 19
    }
   },
   {
    "name": "Hail",
    "rarity": "Common",
    "text": "2 Strikes D12+12 to up to 2 targets within 15M.",
    "attack": {
     "strikes": 2,
     "dice": 1,
     "sides": 12,
     "flat": 12,
     "area": true
    }
   },
   {
    "name": "Deep Chill",
    "rarity": "Uncommon",
    "text": "All enemies within 5M gain 2 frozen stacks."
   }
  ]
 }
];
