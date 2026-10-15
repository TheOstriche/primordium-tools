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
  "xp": 6,
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
  "xp": 6,
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
  "xp": 6,
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
  "xp": 6,
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
     "flat": 3
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
  "xp": 6,
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
  "xp": 6,
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
  "xp": 6,
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
     "flat": 3
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
     "flat": 5
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
     "flat": 5
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
     "flat": 5
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
  "xp": 6,
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
  "xp": 6,
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
  "xp": 6,
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
  "xp": 6,
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
 }
];
