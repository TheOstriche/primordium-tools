// Creature lookup: the built-in list from npc-data.js plus the GM's custom creatures.
(function () {
  const builtIn = window.PRIMORDIUM_NPCS || [];

  const all = () => builtIn.concat(Store.state.customNpcs);
  const find = name => all().find(n => n.name === name) || null;

  const { ROLES, SIZES, TACTICS, STATS, STAT_NAMES } = window.PrimordiumCore;   // ../shared/core.js

  function families() {
    return [...new Set(all().map(n => n.family))].sort();
  }

  window.GameData = { all, find, families, ROLES, SIZES, TACTICS, STATS, STAT_NAMES };
})();
