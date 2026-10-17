// Game math for Primordium 2.0: power steps, XP, damage estimates, encounter difficulty.
// Pure functions only (no screen code), so they can be checked with tools/test-rules.js.
// Sources: docs/rules.md and docs/scaling.md (data in data/scaling.json).
(function (root) {
  // Shared game constants (rarities, the tactics table, stacks): ../shared/core.js.
  const Core = root.PrimordiumCore || require('../../shared/core.js');
  const RARITIES = Core.RARITIES;

  function make(S) {
    const levelToStep = level => Math.max(0, Math.min(12, Math.ceil((Number(level) || 0) / 2)));
    const step = s => S.steps[String(s)];

    function xpFor(role, level) {
      const r = S.roles[role];
      return r ? Math.floor(r.xpMultiplier * (20 + 6 * level) + 0.5) : 0;   // halves up (2026-10-17)
    }

    // Reference player damage per turn against a given armor value (scaling.md section 3).
    function playerDptVsArmor(s, armor) {
      const st = step(s);
      const un = st.playerDamagePerTurn, ar = st.playerDamagePerTurnVsArmored;
      return Math.max(1, un - (un - ar) * (armor || 0) / st.referenceArmor);
    }

    // Average damage of one ability's attack, before the target's armor.
    // Skill attacks add a damage stat modifier per die and the weapon tier once (js/skills.js).
    function attackAverage(atk) {
      if (!atk) return 0;
      return atk.strikes * (atk.dice * (atk.sides + 1) / 2 + (atk.flat || 0) + (atk.perDie || 0) * atk.dice) + (atk.bonus || 0);
    }

    const rarityForRoll = Core.rarityForRoll;

    // Estimated damage per turn from a stat block: average over the tactics table,
    // dropping a rarity when the creature has no damaging ability at the rolled one.
    // Ignores cooldowns. Returns null when the creature has no rollable damage
    // (humanoids, pure-effect creatures), so the budget is used instead.
    function estimateDamagePerTurn(npc) {
      if (npc.humanoid) return null;
      const byRarity = {};
      for (const a of npc.abilities || []) {
        if (!a.attack) continue;
        (byRarity[a.rarity] = byRarity[a.rarity] || []).push(attackAverage(a.attack));
      }
      if (!Object.keys(byRarity).length) return null;
      const avgAt = rarity => {
        for (let i = RARITIES.indexOf(rarity); i >= 0; i--) {
          const list = byRarity[RARITIES[i]];
          if (list) return list.reduce((x, y) => x + y, 0) / list.length;
        }
        // Nothing at or below: use the lowest damaging ability it has.
        for (const r of RARITIES) if (byRarity[r]) return avgAt(r);
        return 0;
      };
      let total = 0;
      for (let roll = 1; roll <= 20; roll++) total += avgAt(rarityForRoll(npc.tactics, roll));
      return (total / 20) * (npc.turnsPerPhase || 1);
    }

    function budgetFor(role, level) {
      const b = S.budgetTable[String(levelToStep(level))];
      return b && b[role] ? b[role] : null;
    }

    // Numbers the difficulty estimate uses for one creature.
    function combatProfile(npc) {
      const budget = budgetFor(npc.role, npc.level) || { hp: 0, damagePerTurn: 0 };
      const est = estimateDamagePerTurn(npc);
      return {
        hp: typeof npc.hp === 'number' && npc.hp > 0 ? npc.hp : budget.hp,
        hpFromBudget: !(typeof npc.hp === 'number' && npc.hp > 0),
        armor: npc.armor || 0,
        dmg: est != null ? est : budget.damagePerTurn,
        dmgFromBudget: est == null
      };
    }

    function difficultyBand(share) {
      const b = S.difficultyBands;
      if (share < b.Easy) return 'Easy';
      if (share < b.Standard) return 'Standard';
      if (share < b.Hard) return 'Hard';
      return 'Deadly';
    }

    // Encounter difficulty (scaling.md section 8).
    // groups: [{ hp, armor, dmg, count }]. They are put in kill order (fastest to kill first).
    function encounterDifficulty(partyStep, partySize, groups) {
      const st = step(partyStep);
      const N = Math.max(1, partySize);
      const rows = groups.filter(g => g.count > 0).map(g => {
        const dpt = playerDptVsArmor(partyStep, g.armor);
        return Object.assign({}, g, {
          killTurns: g.hp / dpt,
          dropTurns: st.playerHP / Math.max(1, g.dmg - st.playerArmor)
        });
      }).sort((a, b) => a.killTurns - b.killTurns);

      let turnsSoFar = 0, lostTotal = 0;
      for (const g of rows) {
        const roundsBefore = turnsSoFar / N;
        g.lost = (g.count * roundsBefore + (g.killTurns / N) * g.count * (g.count + 1) / 2) / g.dropTurns;
        lostTotal += g.lost;
        turnsSoFar += g.count * g.killTurns;
      }
      const shareLost = lostTotal / N;
      return {
        groups: rows,
        roundsToClear: turnsSoFar / N,
        shareLost,
        band: rows.length ? difficultyBand(shareLost) : null
      };
    }

    // Encounter budget in Standard Encounters (rules.md, Encounter building; Game Master's Guide 2.0).
    // enemies: [{ role, level, count }]. Each counts its role value, scaled by its level against the party's.
    // band: Easy under 1 SE per player, Standard from 1, Hard from 1.5, Deadly from 2.
    function encounterSE(partyLevel, partySize, enemies) {
      const B = S.encounterBudgets, scale = lv => (20 + 6 * lv) / (20 + 6 * partyLevel);
      const total = enemies.reduce((t, e) => t + (B.seValue[e.role] || 0) * scale(e.level) * e.count, 0);
      const perPlayer = total / Math.max(1, partySize), P = B.perPlayer;
      const band = perPlayer >= P.Deadly ? 'Deadly' : perPlayer >= P.Hard ? 'Hard' : perPlayer >= P.Standard ? 'Standard' : 'Easy';
      return { total, perPlayer, band };
    }

    // Suggested stats for a new creature (scaling.md section 4 budget formulas).
    function suggestStats(role, level, armorClass, tactics) {
      const s = levelToStep(level);
      const st = step(s), r = S.roles[role], ac = S.armorClasses[armorClass || 'None'];
      if (!st || !r || !ac) return null;
      const hpRaw = r.playerTurnsToKill * st.playerDamagePerTurn * ac.hpMultiplier;
      // For Bosses this covers both turns in a phase, so each turn's abilities get half
      // (matches the published Bosses in npc-data.js).
      const damagePerTurn = st.playerHP / r.turnsToDropPlayer + st.playerArmor;
      const basic = damagePerTurn / (r.turnsPerPhase || 1) / (S.tacticsMultipliers[tactics] || 1);
      const rarity = { Basic: basic };
      for (const [k, m] of Object.entries(S.rarityMultipliers)) rarity[k] = basic * m;
      return {
        step: s, stage: st.stage,
        hp: hpRaw >= 50 ? Math.round(hpRaw / 5) * 5 : Math.round(hpRaw),
        armor: Math.round(st.referenceArmor * ac.armorMultiplier),
        damagePerTurn, basic, rarity, areaPerTarget: S.areaPerTarget,
        minTactics: r.minTactics || null, turnsPerPhase: r.turnsPerPhase || 1
      };
    }

    // Reads "2 Strikes 2D12+9 to all entities within 3M. 2AP." into an attack object.
    function parseAttackText(text) {
      const m = String(text).match(/(\d+)\s+strikes?\s+(\d*)\s*d(\d+)(?:\s*\+\s*(\d+))?/i);
      if (!m) return null;
      const atk = { strikes: +m[1], dice: m[2] ? +m[2] : 1, sides: +m[3], flat: m[4] ? +m[4] : 0 };
      const ap = String(text).match(/(\d+)\s*AP\b/);
      if (ap) atk.ap = +ap[1];
      if (/\bto (all|every|a \d+(\.\d+)?M)|\bup to \d+ (targets|enemies)|\beach against a different target|\bto an? \d+ degree|\barc\b|\bline\b/i.test(text)) atk.area = true;
      // Psychic damage ignores armor (rules.md, Damage types).
      if (/ignor\w*\s+(all\s+)?armou?r|\bpsychic damage/i.test(text)) atk.ignoreArmor = true;
      return atk;
    }

    return {
      RARITIES, levelToStep, xpFor, playerDptVsArmor, attackAverage,
      rarityForRoll, estimateDamagePerTurn, budgetFor, combatProfile,
      difficultyBand, encounterDifficulty, encounterSE, stepInfo: step, suggestStats, parseAttackText
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = make;
  else root.Rules = make(root.PRIMORDIUM_SCALING);
})(typeof window !== 'undefined' ? window : globalThis);
