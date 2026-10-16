// Codex data: the shared files reshaped the way the Codex reads them, plus the search index.
// Skills, races (stats and specials), traits, and creatures come from ../shared/; rules, tables,
// race lore, and creature family notes come from ../codex-data.js. Load order: this file, ui.js, views.js, app.js.
"use strict";

const Core = window.PrimordiumCore;   // ../shared/core.js: rarities, stats, the tactics table, text helpers
const { RARITIES: RAR, STATS, esc, slug, signed } = Core;

const DATA = (() => {
  const P = window.PRIMORDIUM_DATA, NPCS = window.PRIMORDIUM_NPCS, C = window.CODEX_DATA;

  // A skill's tiers ({ "0": [...], "1": [...] }) as an ordered list of { tier, entries }.
  const tiers = o => Object.keys(o).map(Number).sort((a, b) => a - b).map(t => ({
    tier: t,
    entries: o[t].map(e => ({ kind: e.kind, name: e.name, type: e.type, rarity: e.rarity, description: e.desc, usage: e.usage }))
  }));

  const skills = P.skills.map(s => ({
    id: slug(s.name), name: s.name, group: s.group, flavor: s.intro,
    base: tiers(s.base), paths: Object.entries(s.paths).map(([name, o]) => ({ name, tiers: tiers(o) }))
  }));

  const skillsIndex = P.skills.map(s => ({
    id: slug(s.name), name: s.name, group: s.group,
    stat: C.skillNotes[s.name]?.stat || null,          // A, S, or K: the stat its damage uses
    summary: C.skillNotes[s.name]?.summary || s.intro,
    paths: Object.keys(s.paths)
  }));

  const races = Object.entries(P.races).map(([name, r]) => {
    const lore = C.raceLore[name] || {};
    return {
      id: lore.id || slug(name), name,
      common: lore.common || '', roles: lore.roles || '', country: lore.country || '', population: lore.population || '',
      deity: lore.deity || '', appearance: lore.appearance || {}, desc: lore.desc || '',
      stats: Object.fromEntries([['HP', r.hp], ...STATS.map((k, i) => [k, r.stats[i]])]),
      special: r.traits
    };
  });

  const categories = [...new Set(P.traits.map(t => t.category))];
  const traits = {
    intro: C.traitsIntro,
    groups: categories.map(c => ({
      name: C.traitGroupNames[c] || c,
      traits: P.traits.filter(t => t.category === c).map(t => [t.name, t.cost, t.effect])
    }))
  };

  const npcs = NPCS.map(n => {
    const fam = C.creatureFamilies[n.family] || {};
    // "Standard" means "no special description"; skip a description that only repeats the family's.
    const flavor = n.description && n.description !== 'Standard' && n.description !== fam.flavor ? n.description : '';
    return {
      id: slug(n.name), name: n.name, group: fam.group || '', family: n.family, familyFlavor: fam.flavor || '', flavor,
      stats: n.stats,
      abilities: (n.abilities || []).map(a => ({ name: a.name, rarity: a.rarity, cooldown: Core.cooldownText(a.cooldown) || null, text: a.text })),
      skill: n.combatSkill ? n.combatSkill.replace(/^Combat skill:\s*/i, '') : null,
      attributes: n.attributes && n.attributes !== 'None' ? n.attributes : '',
      alignment: n.alignment, size: n.size, role: n.role, level: n.level, tactics: n.tactics,
      hp: typeof n.hp === 'number' ? n.hp : 'Special', armor: n.armor ? n.armor : 'None',
      xp: n.xp, turns: n.turnsPerPhase || 1
    };
  });

  return { races, traits, rules: C.rules, tables: C.tables, skillsIndex, skills, npcs };
})();

// Every skill joined with its full tiers (null if a skill had no tiers yet).
const SKILLS = DATA.skillsIndex.map(s => ({ ...s, full: DATA.skills.find(f => f.id === s.id) || null }));

/* ---------- search ---------- */
// One entry per skill, ability, perk, creature, race, trait, and rule. page: what opens when tapped.
const INDEX = [];
SKILLS.forEach(s => {
  INDEX.push({ kind: 'Skill', title: s.name, sub: `${s.group} · ${s.paths.join(', ')}`, text: s.summary, page: { type: 'skill', id: s.id } });
  if (!s.full) return;
  const walk = (list, path) => list.forEach(t => t.entries.forEach(e => INDEX.push({
    kind: e.kind === 'perk' ? 'Perk' : 'Ability', title: e.name, rarity: e.rarity,
    sub: `${s.name} · ${path ? path + ' Path Tier' : t.tier === 0 ? 'Tier' : 'Base Tier'} ${t.tier}`,
    text: (e.usage || '') + ' ' + (e.description || ''),
    page: { type: 'skill', id: s.id, path: path || null, hl: e.name }
  })));
  walk(s.full.base, null);
  s.full.paths.forEach(p => walk(p.tiers, p.name));
});
DATA.npcs.forEach(n => INDEX.push({ kind: 'Creature', title: n.name, sub: `Level ${n.level} ${n.role} · ${n.family}`,
  text: n.abilities.map(a => a.name + ' ' + a.text).join(' ') + ' ' + n.attributes, page: { type: 'npc', id: n.id } }));
DATA.races.forEach(r => INDEX.push({ kind: 'Race', title: r.name, sub: r.common, text: r.special.join(' ') + ' ' + r.desc, page: { type: 'race', id: r.id } }));
DATA.traits.groups.forEach((g, gi) => g.traits.forEach(([n, c, e]) => INDEX.push({ kind: 'Trait', title: n, sub: `${g.name} trait · cost ${c}`, text: e,
  page: { type: 'traits', g: gi, hl: n } })));
DATA.rules.forEach(sec => sec.entries.forEach(([k, v]) => INDEX.push({ kind: 'Rule', title: k, sub: sec.title, text: v, page: { type: 'rule', id: sec.id, hl: k } })));

// Every word must appear; a word at the start of a title counts most, anywhere in the title next, the body least.
function search(q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return INDEX.map(it => {
    const t = it.title.toLowerCase(), body = (it.sub + ' ' + it.text).toLowerCase();
    let score = 0;
    for (const w of terms) {
      if (t.startsWith(w)) score += 6;
      else if (t.includes(w)) score += 4;
      else if (body.includes(w)) score += 1;
      else return null;
    }
    return { it, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 40).map(x => x.it);
}
