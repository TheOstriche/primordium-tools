// Lists only the character sheet uses. Game-wide lists (stats, rarities, stacks) are in ../shared/core.js;
// skills, races, and traits are in ../shared/primordium-data.js.
window.SHEET_LISTS = {
  resources: ['Rage', 'Fury', 'Overcharge', 'Soul Shards'],
  conditions: ['Disoriented', 'Weakened', 'Silenced', 'Immobilized', 'Invisible'],
  // [material, tier]: picking a material fills in an item's tier.
  materials: [['Oak', 0], ['Bronze', 0], ['Iron', 0], ['Steel', 1], ['D-Iron', 1], ['Silv-Steel', 1], ['D-Steel', 2], ['Etherian', 2], ['Lyran Stone', 2],
    ['Glacius', 3], ['Aurausheen', 3], ['Mag-Glass', 4], ['Druiniun', 4], ['Pitch', 5], ['PriGlass', 6], ['PriSteel', 7]],
  weapons: ['Sword', 'Dagger', 'One Handed Axe', 'Mace', 'Spear', 'Greatsword', 'Battle Axe', 'Warhammer', 'Bow', 'Crossbow', 'Staff or Focus', 'Other'],
  armorSlots: ['Head / Neck', 'Chest', 'Arms', 'Legs / Feet', 'Shield']
};
