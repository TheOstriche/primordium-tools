// Skill abilities for humanoid NPCs. A humanoid's stat block names a combat skill, skill tier,
// damage stat, and weapon tier; this turns that into a list of abilities from the Skill Guide
// data (shared/primordium-data.js) and reads strike dice from each ability's text.
// No screen code here, so tools/test-combat.js can check it.
// Sources: docs/rules.md (Damage), and the humanoid "Combat skill" text in npc-data.js.
(function (root) {
  // Shared game constants (rarities, the tactics table, stacks): ../shared/core.js.
  const Core = root.PrimordiumCore || require('../../shared/core.js');
  const RARITIES = Core.RARITIES;
  const COUNTS = { once: 1, twice: 2, thrice: 3, one: 1, a: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  // Short names the stat blocks use for skills.
  const ALIASES = { Fire: 'Fire Magic', Frost: 'Frost Magic', Shock: 'Shock Magic', Restoration: 'Restoration Magic',
    Alteration: 'Alteration Magic', Sensory: 'Sensory Magic', 'Soul Rifting': 'Soul Rifting Magic' };

  function make(Data, Rules) {
    const skills = (Data && Data.skills) || [];
    const byName = Object.fromEntries(skills.map(s => [s.name, s]));
    const weapons = skills.filter(s => s.group === 'Physical').map(s => s.name);
    const magic = skills.filter(s => s.group === 'Mental').map(s => s.name);
    // Attribute skills (Strength, Agility, ...) are not combat skills; "a Strength weapon" names a weapon.
    const combatSkills = weapons.concat(magic, skills.filter(s => s.name === 'Tactics').map(s => s.name));

    // Skills a stat block's text allows, e.g. "Battle Axe or One Handed Axe" or
    // "A weapon or magic school of the GM's choice".
    function optionsFromText(text) {
      let rest = String(text || '').replace(/^Combat skill:\s*/i, '').split(/Skill tier:/i)[0];
      const found = [];
      const names = combatSkills.concat(Object.keys(ALIASES)).sort((a, b) => b.length - a.length);
      for (const name of names) {
        const re = new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        if (re.test(rest)) {
          found.push(ALIASES[name] || name);
          rest = rest.replace(re, ' ');
        }
      }
      const open = /GM's choice|\bany\b/i.test(rest) || !found.length;
      if (open && /weapon/i.test(rest)) found.push(...weapons);
      if (open && /magic school|magic/i.test(rest)) found.push(...magic);
      const list = [...new Set(found)];
      return list.length ? list : combatSkills.slice();
    }

    // The starting setup for a humanoid: { skill, path, baseTier, pathTier, stat, weaponTier, options }.
    // A custom NPC type may store its own defaults in npc.skillSetup.
    function setupFor(npc) {
      const text = npc.combatSkill || '';
      const tier = text.match(/Skill tier:\s*(Base|Path)\s+Tier\s+(\d+)/i);
      const stat = text.match(/Damage stat:\s*(\d+)/i);
      const wt = text.match(/Weapon tier:\s*(\d+)/i);
      const isPath = tier && /path/i.test(tier[1]);
      const s = {
        skill: '', path: '',
        baseTier: tier ? (isPath ? 4 : +tier[2]) : 1,
        pathTier: isPath ? +tier[2] : 0,
        stat: stat ? +stat[1] : 2,
        weaponTier: wt ? +wt[1] : 0,
        options: optionsFromText(text)
      };
      Object.assign(s, JSON.parse(JSON.stringify(npc.skillSetup || {})));
      if (!s.options || !s.options.length) s.options = combatSkills.slice();
      if (!s.skill && s.options.length === 1) s.skill = s.options[0];
      return choosePath(s);
    }

    // Path skills need a path; default to the skill's first one.
    function choosePath(s) {
      const d = byName[s.skill];
      const paths = d ? Object.keys(d.paths || {}) : [];
      if (!s.pathTier) s.path = '';
      else if (!paths.includes(s.path)) s.path = paths[0] || '';
      return s;
    }

    const pathsOf = name => Object.keys((byName[name] || {}).paths || {});

    const maxRarityIndex = tactics => Math.max(...Core.reachableRarities(tactics).map(r => RARITIES.indexOf(r)));

    // The abilities a humanoid can use: its skill's abilities up to its tier, of rarity up to
    // the best its tactics can roll. On a path, the path's basic attack replaces Tier 0's.
    function abilitiesFor(setup, tactics) {
      const d = byName[setup.skill];
      if (!d) return [];
      const top = maxRarityIndex(tactics);
      const out = [];
      const add = (list, label) => (list || []).forEach(i => {
        if (i.kind !== 'ability' || RARITIES.indexOf(i.rarity) > top) return;
        const a = { name: i.name, rarity: i.rarity, type: i.type || 'Standard', text: i.usage || i.desc || '', desc: i.desc || '', tier: label };
        const atk = parseStrikes(a.text, setup);
        if (atk) a.attack = atk;
        out.push(a);
      });
      for (let t = 0; t <= Math.min(4, setup.baseTier); t++) add(d.base[t], t === 0 ? 'Tier 0' : 'Base Tier ' + t);
      const p = setup.pathTier && d.paths && d.paths[setup.path];
      if (p) {
        for (let t = 1; t <= setup.pathTier; t++) add(p[t], setup.path + ' Tier ' + t);
        const pathBasic = out.some(a => a.tier === setup.path + ' Tier 1' && a.rarity === 'Basic' && a.type === 'Standard');
        if (pathBasic) return out.filter(a => !(a.tier === 'Tier 0' && /^Basic .*Attack$/.test(a.name)));
      }
      return out;
    }

    // Damage modifier (rules.md): damage stat x ½ per D4 or D6, x1 per D8 to D12, x2 per D20.
    const perDieFactor = sides => sides >= 20 ? 2 : sides >= 8 ? 1 : 0.5;

    // Reads "Strike twice with D6", "Strike once with 3D6 + 2", "one strike of D10",
    // "1 strike 2D20 damage with 4AP" and similar. Returns null when the text has no strike dice.
    function parseStrikes(text, setup) {
      const t = String(text || '');
      let m = t.match(/\bstrikes?\b[^.]{0,60}?\b(once|twice|thrice|(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+times)\b[^.]{0,40}?\bwith\s+(\d*)\s*D(\d+)/i);
      let strikes, dice, sides, end;
      if (m) {
        strikes = m[2] ? (COUNTS[m[2].toLowerCase()] || +m[2]) : COUNTS[m[1].toLowerCase()];
        dice = +m[3] || 1; sides = +m[4];
      } else if ((m = t.match(/\b(one|a|two|three|\d+)\s+strikes?\s+(?:of\s+)?(\d*)\s*D(\d+)/i))) {
        strikes = COUNTS[m[1].toLowerCase()] || +m[1]; dice = +m[2] || 1; sides = +m[3];
      } else if ((m = t.match(/\b(one|a)\s+(\d*)\s*D(\d+)\s+strike/i))) {
        strikes = 1; dice = +m[2] || 1; sides = +m[3];
      } else return null;
      if (!strikes || !sides) return null;
      end = m.index + m[0].length;
      const flat = t.slice(end).match(/^\s*\+\s*(\d+)(?!\s*(?:per|for|D\d))/i);
      const ap = t.match(/(\d+)\s*AP\b/);
      const atk = { strikes, dice, sides, flat: flat ? +flat[1] : 0 };
      if (ap) atk.ap = +ap[1];
      if (/\bignor\w*\s+(?:all\s+)?armou?r/i.test(t) && !/metal armou?r/i.test(t)) atk.ignoreArmor = true;
      if (/\b(arc|arch|radius|cone|all entities|all targets|any entit|every entit|up to \d+ targets|within \d+M of (?:the )?(?:user|target|eye|impact|point))/i.test(t)) atk.area = true;
      if (setup) {
        atk.perDie = (setup.stat || 0) * perDieFactor(sides);
        atk.bonus = setup.weaponTier || 0;
      }
      return atk;
    }

    return { combatSkills, weapons, magic, optionsFromText, setupFor, choosePath, pathsOf, abilitiesFor, parseStrikes, perDieFactor };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = make;
  else root.Skills = make(root.PRIMORDIUM_DATA, root.Rules);
})(typeof window !== 'undefined' ? window : globalThis);
