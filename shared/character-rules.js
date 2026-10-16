// Character rules shared by the player sheet and the GM tool: what a character's skills grant,
// and the totals that follow from a sheet (stats, maximum HP, armor).
// Needs core.js and primordium-data.js loaded first.
(function (root) {
  const D = root.PRIMORDIUM_DATA;
  const SK = Object.fromEntries(D.skills.map(s => [s.name, s]));
  const { STATS, STAT_KEYS: STATK } = root.PrimordiumCore;
  const n = v => Number(v) || 0;

  // Every ability and perk a character's skill tiers grant.
  function granted(c) {
    const out = [];
    for (const [k, s] of Object.entries(c.skills || {})) {
      const d = SK[k]; if (!d) continue;
      for (let t = 0; t <= n(s.base); t++) { if (t === 0 && n(s.base) === 0) continue; (d.base[t] || []).forEach(i => out.push({...i, skill: k, tierLabel: t === 0 ? 'Tier 0' : `Base Tier ${t}`})); }
      if (s.path && d.paths[s.path]) for (let t = 1; t <= n(s.ptier); t++) (d.paths[s.path][t] || []).forEach(i => out.push({...i, skill: k, tierLabel: `${s.path} Tier ${t}`}));
    }
    return out;
  }

  // A background trait's effect on stats or HP ("+1 Strength", "+5 HP").
  function traitFx(t) {
    const fx = []; const m = String(t.effect).match(/^([+-]\d+) (Strength|Agility|Knowledge|Speed|Perception|Speech)$/); if (m) fx.push({stat: STATK[m[2]], add: Number(m[1])});
    const h = String(t.effect).match(/^([+-]\d+) HP$/); if (h) fx.push({maxhp: Number(h[1])}); return fx;
  }

  // Stats, maximum HP, and armor outside combat. Tolerates sheets saved by older versions.
  function core(c) {
    const st = {}; STATS.forEach(s => st[s] = n((c.stats || {})[s]));
    let hpSkill = 0, armSkill = 0; const hpPer = [];
    const trin = c.trin || {};
    if (c.race === 'Trin') { if (trin.dmg) st[trin.dmg] += 1; for (const x of [trin.a, trin.b]) if (x === 'HP') hpSkill += 5; else if (x) st[x] += 1; }
    for (const t of c.traits || []) for (const f of traitFx(t)) { if (f.stat) st[f.stat] += f.add; if (f.maxhp) hpSkill += f.maxhp; }
    for (const i of granted(c)) for (const f of (i.effects || [])) { if (f.stat) st[f.stat] += f.add; if (f.maxhp) hpSkill += f.maxhp; if (f.armor) armSkill += f.armor; if (f.maxhpPerStat) hpPer.push(f); }
    for (const f of hpPer) hpSkill += f.per * Math.max(0, st[f.maxhpPerStat]);
    const race = D.races[c.race] || {};
    const natural = n(race.armor) + armSkill;
    const worn = (c.items || []).filter(i => i.equipped && i.kind === 'armor' && i.slot !== 'Shield').reduce((a, i) => a + n(i.armor), 0);
    const maxhp = n(c.hpBase) + 25 * Math.floor(n(c.level) / 5) + n(c.hpOther) + hpSkill;
    return { st, hpSkill, natural, worn, armor: natural + worn + n(c.armorOther), maxhp, race };
  }

  root.PrimordiumCharacter = { SK, STATS, granted, traitFx, core };
})(window);
