// NPC types tab: build, edit, and delete the campaign's own NPC types (enemies, Bosses,
// summons, guides, townsfolk). The game's built-in list is ../shared/npc-data.js.
// Suggestions and warnings come from the scaling workbook (data/scaling.json).
(function () {
  const { h, fill, fmt, toast } = UI;
  const S = () => Store.state;
  const RARITIES = ['Basic', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  const TYPES = ['Standard', 'Quick', 'Defensive'];
  const ARMOR_CLASSES = ['None', 'Light', 'Medium', 'Heavy'];

  let draft = null;        // the NPC type being edited (a copy)
  let originalName = null; // its saved name, when editing an existing custom NPC type
  let copiedFrom = null;   // the NPC type a new one was copied from
  let armorClass = 'None';
  let els = {};

  function blank() {
    return {
      name: '', family: '', role: 'Standard', level: 1, tactics: 'Basic', hp: 27, armor: 0, size: 'Average',
      alignment: 'Neutral', stats: { STR: 0, AGI: 0, KNO: 0, SPD: 0, PER: 0, SPE: 0 },
      attributes: 'None', description: '', abilities: [{ name: '', rarity: 'Basic', text: '', attack: { strikes: 1, dice: 1, sides: 10, flat: 0 } }]
    };
  }

  // Open the editor on a copy of an NPC type (built-in: as a new custom one).
  function editCopyOf(n) {
    draft = JSON.parse(JSON.stringify(n));
    if (n.custom) {
      originalName = n.name;
      copiedFrom = null;
    } else {
      originalName = null;
      copiedFrom = n.name;
      draft.name = n.name + ' (custom)';
      delete draft.id;
    }
    armorClass = guessArmorClass(draft);
  }

  function guessArmorClass(n) {
    const sug = Rules.suggestStats(n.role, n.level, 'Medium', n.tactics);
    if (!sug || !n.armor) return 'None';
    const ratio = n.armor / sug.armor;
    return ratio < 0.25 ? 'None' : ratio < 0.75 ? 'Light' : ratio < 1.25 ? 'Medium' : 'Heavy';
  }

  // ---------- Layout ----------

  function render(root) {
    els = { list: h('div.ref-list'), editor: h('div.ref-detail.creature-editor') };
    fill(root, h('div.ref-layout.creatures-layout', els.list, els.editor));
    drawList();
    drawEditor();
  }

  function drawList() {
    const customs = S().customNpcs.slice().sort((a, b) => a.name.localeCompare(b.name));
    const copyFrom = h('select', { 'aria-label': 'Start from' },
      h('option', { value: '' }, 'Start from an existing NPC type…'),
      GameData.all().slice().sort((a, b) => a.name.localeCompare(b.name)).map(n => h('option', { value: n.name }, n.name)));
    fill(els.list,
      h('button.primary', { onclick: () => { draft = blank(); originalName = null; copiedFrom = null; armorClass = 'None'; drawList(); drawEditor(); } }, 'New NPC type'),
      h('div.row', copyFrom, h('button', {
        onclick: () => { if (copyFrom.value) { editCopyOf(GameData.find(copyFrom.value)); drawList(); drawEditor(); } }
      }, 'Copy')),
      h('div.list-group', 'Your NPC types'),
      customs.length ? customs.map(n => h('div.list-item' + (draft && originalName === n.name ? '.on' : ''), {
        onclick: () => { editCopyOf(n); drawList(); drawEditor(); }
      }, n.name, h('span.muted.small', ' ' + n.role + ' · Lv ' + n.level))) : h('p.muted.small', 'None yet.'));
  }

  // ---------- Editor ----------

  function drawEditor() {
    if (!draft) {
      return fill(els.editor,
        h('h1', 'NPC types'),
        h('p', 'Build the NPCs of your campaign: enemies and Bosses, but also summons, guides, guards, and townsfolk who fight alongside the party. ' +
          'They are saved with your other data, appear in the NPC picker (add them as enemies or allies) and the Reference tab, and are included in backups.'),
        h('p.muted', 'Start with "New NPC type", or copy an existing one and change it. Changes for the whole game (the built-in list) belong in shared/npc-data.js.'));
    }
    const d = draft;
    const sug = Rules.suggestStats(d.role, d.level, armorClass, d.tactics);
    const field = (label, input, cls) => h('label.field' + (cls ? '.' + cls : ''), label, input);
    const text = (key, attrs) => h('input', Object.assign({ value: d[key] ?? '', oninput: e => { d[key] = e.target.value; } }, attrs || {}));
    const number = (obj, key, after) => h('input', {
      type: 'number', value: obj[key] ?? 0,
      onchange: e => { obj[key] = parseInt(e.target.value, 10) || 0; if (after) after(); else drawBudget(); }
    });
    const select = (key, options, after) => h('select', {
      onchange: e => { d[key] = e.target.value; (after || redraw)(); }
    }, options.map(o => h('option', { value: o, selected: d[key] === o }, o)));

    const noHp = d.hp == null;
    els.budget = h('div.card.budget');
    fill(els.editor,
      h('div.editor-head',
        h('h1', originalName ? 'Edit ' + originalName : copiedFrom ? 'New NPC type from ' + copiedFrom : 'New NPC type'),
        h('div.row',
          h('button.primary', { onclick: save }, 'Save'),
          h('button.ghost', { onclick: () => { draft = null; drawList(); drawEditor(); } }, 'Close'),
          originalName ? h('button.ghost.danger', { onclick: remove }, 'Delete') : null)),
      h('div.editor-grid',
        h('div.editor-main',
          h('div.form-grid',
            field('Name', text('name', { required: true }), 'span2'),
            field('Family', h('span', text('family', { list: 'family-list' }),
              h('datalist', { id: 'family-list' }, GameData.families().map(f => h('option', { value: f })))), 'span2'),
            field('Role', select('role', GameData.ROLES, () => {
              if (d.role === 'Boss') d.turnsPerPhase = 2; else delete d.turnsPerPhase;
              redraw();
            })),
            field('Level', number(d, 'level', redraw)),
            field('Tactics', select('tactics', GameData.TACTICS)),
            field('Size', select('size', GameData.SIZES)),
            field('Armor class', h('select', { onchange: e => { armorClass = e.target.value; redraw(); } },
              ARMOR_CLASSES.map(a => h('option', { value: a, selected: a === armorClass }, a)))),
            field('Armor', number(d, 'armor')),
            field('HP', noHp ? h('input', { disabled: true, value: '—' }) : number(d, 'hp')),
            field('Alignment', text('alignment'))),
          h('label.check.small', h('input', { type: 'checkbox', checked: noHp, onchange: e => {
            if (e.target.checked) { d.hp = null; d.specialHp = d.specialHp || ''; } else { d.hp = sug ? sug.hp : 10; delete d.specialHp; }
            redraw();
          } }), 'No fixed HP (special rule, like slimes)'),
          noHp ? field('Special HP rule', h('textarea', { rows: 2, oninput: e => { d.specialHp = e.target.value; } }, d.specialHp || ''), 'wide') : null,
          h('h3', 'Stats'),
          h('div.form-grid.stats6', GameData.STATS.map(k => field(k, number(d.stats, k)))),
          h('div.form-grid',
            field('Attributes', text('attributes'), 'span4'),
            field('Description', h('textarea', { rows: 2, oninput: e => { d.description = e.target.value; } }, d.description || ''), 'span4')),
          h('label.check', h('input', { type: 'checkbox', checked: !!d.humanoid, onchange: e => {
            d.humanoid = e.target.checked;
            if (d.humanoid) d.combatSkill = d.combatSkill || ''; else delete d.combatSkill;
            redraw();
          } }), 'Humanoid (uses a player combat skill instead of fixed abilities)'),
          d.role === 'Boss' || d.turnsPerPhase ? h('div.row', h('label.inline.small', 'Turns per phase ',
            h('input', { type: 'number', min: 1, max: 3, value: d.turnsPerPhase || 1, onchange: e => { d.turnsPerPhase = Math.max(1, parseInt(e.target.value, 10) || 1); drawBudget(); } }))) : null,
          d.humanoid
            ? [field('Combat skill', h('textarea', { rows: 4, placeholder: 'Combat skill, skill tier, damage stat, weapon tier…', oninput: e => { d.combatSkill = e.target.value; } }, d.combatSkill || ''), 'wide'),
               skillDefaults(d)]
            : abilitiesEditor(d, sug)),
        h('div.editor-side', els.budget)));
    drawBudget();
  }

  function redraw() { drawEditor(); }

  // A humanoid's starting skill in combat (the GM can still change it on the token).
  function skillDefaults(d) {
    const base = Skills.setupFor(Object.assign({}, d, { skillSetup: null }));
    const s = d.skillSetup = Object.assign({ skill: '', path: '', baseTier: base.baseTier, pathTier: base.pathTier, stat: base.stat, weaponTier: base.weaponTier }, d.skillSetup || {});
    const tierValue = s.pathTier ? 'p' + s.pathTier : 'b' + s.baseTier;
    const paths = s.pathTier && s.skill ? Skills.pathsOf(s.skill) : [];
    const num = (label, key, title) => h('label.field', { title }, label, h('input', {
      type: 'number', min: 0, value: s[key], onchange: e => { s[key] = Math.max(0, parseInt(e.target.value, 10) || 0); }
    }));
    return h('div.skill-defaults',
      h('h3', 'Skill in combat'),
      h('p.muted.small', 'Its abilities come from this skill in the Skill Guide, up to its tier and the rarities its tactics can roll. Leave the skill blank to choose it at the table.'),
      h('div.form-grid',
        h('label.field.span2', 'Skill', h('select', { onchange: e => { s.skill = e.target.value; s.path = ''; redraw(); } },
          h('option', { value: '', selected: !s.skill }, 'Choose at the table'),
          Skills.combatSkills.map(n => h('option', { value: n, selected: s.skill === n }, n)))),
        h('label.field', 'Tier', h('select', {
          onchange: e => {
            const v = e.target.value;
            if (v[0] === 'p') { s.baseTier = 4; s.pathTier = +v.slice(1); } else { s.baseTier = +v.slice(1); s.pathTier = 0; s.path = ''; }
            redraw();
          }
        }, [1, 2, 3, 4].map(t => h('option', { value: 'b' + t, selected: tierValue === 'b' + t }, 'Base Tier ' + t)),
           [1, 2, 3, 4].map(t => h('option', { value: 'p' + t, selected: tierValue === 'p' + t }, 'Path Tier ' + t)))),
        paths.length ? h('label.field', 'Path', h('select', { onchange: e => { s.path = e.target.value; } },
          h('option', { value: '', selected: !s.path }, 'First path'),
          paths.map(n => h('option', { value: n, selected: s.path === n }, n)))) : null,
        num('Damage stat', 'stat', 'Adds ½ per D4 or D6, 1 per D8 to D12, 2 per D20 for each point'),
        num('Weapon tier', 'weaponTier', 'Added to one strike per attack')));
  }

  function abilitiesEditor(d, sug) {
    d.abilities = d.abilities || [];
    return h('div.abilities-editor',
      h('div.card-head', h('h3', 'Abilities'),
        h('button', { onclick: () => { d.abilities.push({ name: '', rarity: 'Basic', text: '' }); redraw(); } }, 'Add ability')),
      d.abilities.map((a, i) => abilityRow(d, a, i, sug)));
  }

  function abilityRow(d, a, i, sug) {
    const atk = a.attack;
    const num = (key, label, min) => h('label.field', label, h('input', {
      type: 'number', min: min ?? 0, value: atk[key] ?? 0,
      onchange: e => { const v = parseInt(e.target.value, 10) || 0; if (key === 'ap' && !v) delete atk.ap; else atk[key] = v; drawBudget(); updateAvg(); }
    }));
    const avgEl = h('span.preview');
    function updateAvg() {
      if (!a.attack) { avgEl.textContent = ''; return; }
      const avg = Rules.attackAverage(a.attack);
      const target = sug && sug.rarity[a.rarity];
      avgEl.textContent = 'Average ' + fmt(avg, 1) + (target ? ' (budget for ' + a.rarity + ': ' + fmt(target, 1) + ')' : '');
      avgEl.classList.toggle('warn', !!target && Math.abs(avg - target) / target > 0.35);
    }
    updateAvg();
    const textArea = h('textarea', { rows: 2, placeholder: 'e.g. 2 Strikes D12+7. Damaging strikes add a flame stack.', oninput: e => { a.text = e.target.value; } }, a.text || '');
    return h('div.ability-edit',
      h('div.form-grid',
        h('label.field.span2', 'Name', h('input', { value: a.name, oninput: e => { a.name = e.target.value; } })),
        h('label.field', 'Rarity', h('select', { onchange: e => { a.rarity = e.target.value; redraw(); } },
          RARITIES.map(r => h('option', { value: r, selected: a.rarity === r }, r)))),
        h('label.field', 'Type', h('select', { onchange: e => { if (e.target.value === 'Standard') delete a.type; else a.type = e.target.value; } },
          TYPES.map(t => h('option', { value: t, selected: (a.type || 'Standard') === t }, t)))),
        h('label.field', 'Cooldown', h('select', {
          onchange: e => { const v = e.target.value; if (v === '') delete a.cooldown; else a.cooldown = v === 'combat' ? 'combat' : +v; }
        },
          h('option', { value: '', selected: a.cooldown == null }, 'Default (' + defaultCooldownText(a.rarity) + ')'),
          ['0', '1', '2', '3', '4'].map(v => h('option', { value: v, selected: String(a.cooldown) === v }, v === '0' ? 'None' : v + ' phase' + (v === '1' ? '' : 's'))),
          h('option', { value: 'combat', selected: a.cooldown === 'combat' }, 'Once per combat')))),
      h('label.field.wide', 'Text', textArea),
      h('div.row',
        h('label.check.small', h('input', { type: 'checkbox', checked: !!atk, onchange: e => {
          a.attack = e.target.checked ? (Rules.parseAttackText(a.text) || { strikes: 1, dice: 1, sides: 10, flat: 0 }) : undefined;
          if (!a.attack) delete a.attack;
          redraw();
        } }), 'Damaging strike (rolled automatically in combat)'),
        h('button.ghost.small', {
          title: 'Fill in the strike numbers from the text, e.g. "2 Strikes 2D10+8. 2AP."',
          onclick: () => {
            const p = Rules.parseAttackText(textArea.value);
            if (!p) return toast('No "N Strikes XdY+Z" found in the text.', 'bad');
            a.attack = p;
            redraw();
          }
        }, 'Read numbers from text'),
        h('span.spacer'),
        h('button.icon.ghost.tiny', { title: 'Move up', onclick: () => { move(d.abilities, i, -1); redraw(); } }, '▲'),
        h('button.icon.ghost.tiny', { title: 'Move down', onclick: () => { move(d.abilities, i, 1); redraw(); } }, '▼'),
        h('button.ghost.danger.small', { onclick: () => { d.abilities.splice(i, 1); redraw(); } }, 'Remove')),
      atk ? h('div.form-grid.attack6',
        num('strikes', 'Strikes', 1), num('dice', 'Dice', 1), num('sides', 'Sides', 2), num('flat', '+ Flat'), num('ap', 'AP'),
        h('div.field',
          h('label.check.small', h('input', { type: 'checkbox', checked: !!atk.area, onchange: e => { if (e.target.checked) atk.area = true; else delete atk.area; } }), 'Area'),
          h('label.check.small', h('input', { type: 'checkbox', checked: !!atk.ignoreArmor, onchange: e => { if (e.target.checked) atk.ignoreArmor = true; else delete atk.ignoreArmor; } }), 'Ignores armor'))) : null,
      atk ? avgEl : null);
  }

  function defaultCooldownText(rarity) {
    const cd = Combat.cooldownOf({ rarity });
    return cd === 'combat' ? 'once per combat' : cd ? cd + ' phase' + (cd === 1 ? '' : 's') : 'none';
  }

  function move(list, i, delta) {
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
  }

  // ---------- Budget panel ----------

  function drawBudget() {
    const d = draft;
    if (!d || !els.budget) return;
    const sug = Rules.suggestStats(d.role, d.level, armorClass, d.tactics);
    if (!sug) return fill(els.budget, h('p.muted', 'Pick a role and level to see the budget.'));
    const est = d.humanoid ? null : Rules.estimateDamagePerTurn(d);
    const warnings = [];
    const off = (actual, target) => target ? (actual - target) / target : 0;
    const pct = v => (v > 0 ? '+' : '') + Math.round(v * 100) + '%';
    if (d.hp != null && Math.abs(off(d.hp, sug.hp)) > 0.25) warnings.push('HP is ' + pct(off(d.hp, sug.hp)) + ' from the budget.');
    if (Math.abs((d.armor || 0) - sug.armor) >= 2) warnings.push('Armor is ' + (d.armor || 0) + '; ' + armorClass + ' armor at this level is about ' + sug.armor + '.');
    if (est != null && Math.abs(off(est, sug.damagePerTurn)) > 0.25) {
      warnings.push('Damage per ' + (sug.turnsPerPhase > 1 ? 'phase' : 'turn') + ' is ' + pct(off(est, sug.damagePerTurn)) + ' from the budget.');
    }
    if (sug.minTactics && GameData.TACTICS.indexOf(d.tactics) < GameData.TACTICS.indexOf(sug.minTactics)) warnings.push(d.role + 's need at least ' + sug.minTactics + ' tactics.');
    if (d.role === 'Boss' && (d.turnsPerPhase || 1) < 2) warnings.push('Bosses take 2 turns per phase.');
    const tacticsRow = Rules.TACTICS_TABLE[d.tactics] || [];
    const missing = tacticsRow.map(r => r[0]).filter(r => !d.humanoid && !(d.abilities || []).some(a => a.rarity === r));
    if (missing.length && !d.humanoid) warnings.push('Its tactics can roll ' + missing.join(', ') + ' but it has no ability at ' + (missing.length > 1 ? 'those rarities' : 'that rarity') + ' (it will drop a rarity).');

    const apply = (key, value) => { draft[key] = value; redraw(); };
    fill(els.budget,
      h('h3', 'Budget'),
      h('p.muted.small', 'Level ' + d.level + ' is power step ' + sug.step + ' (' + sug.stage + '). ' + d.role + ', ' + armorClass + ' armor, ' + d.tactics + ' tactics.'),
      h('table.budget-table',
        h('tbody',
          budgetRow('HP', d.hp != null ? d.hp : '—', sug.hp, d.hp != null ? () => apply('hp', sug.hp) : null),
          budgetRow('Armor', d.armor || 0, sug.armor, () => apply('armor', sug.armor)),
          budgetRow(sug.turnsPerPhase > 1 ? 'Damage per phase (both turns)' : 'Damage per turn', est != null ? fmt(est, 1) : '—', fmt(sug.damagePerTurn, 1)),
          budgetRow('XP', '', fmt(Rules.xpFor(d.role, d.level), 2)))),
      h('h3', 'Average damage per ability' + (sug.turnsPerPhase > 1 ? ' (each turn)' : '')),
      h('table.budget-table',
        h('tbody', RARITIES.filter(r => sug.rarity[r]).map(r => h('tr',
          h('td', h('span.rarity.rarity-' + r.toLowerCase(), r)),
          h('td', fmt(sug.rarity[r], 1)),
          h('td.muted.small', 'area ' + fmt(sug.rarity[r] * sug.areaPerTarget, 1) + ' each')))))
      ,
      h('p.muted.small', 'Damage budgets are before player armor. Area attacks are budgeted at 60% per target.'),
      warnings.length ? h('div.warnings', h('h3', 'Check'), h('ul.small', warnings.map(w => h('li', w)))) : h('p.good.small', 'Within budget.'));
  }

  function budgetRow(label, actual, target, onUse) {
    return h('tr',
      h('td', label),
      h('td', h('strong', String(actual))),
      h('td.muted', 'budget ' + target),
      h('td', onUse ? h('button.ghost.small', { onclick: onUse }, 'Use') : null));
  }

  // ---------- Saving ----------

  function save() {
    const d = draft;
    d.name = (d.name || '').trim();
    d.family = (d.family || '').trim() || 'Custom';
    if (!d.name) return toast('Give the NPC type a name.', 'bad');
    const clash = GameData.all().find(n => n.name.toLowerCase() === d.name.toLowerCase() && n.name !== originalName);
    if (clash) return toast('"' + d.name + '" is already taken' + (clash.custom ? '' : ' by a built-in NPC type') + '.', 'bad');
    if (d.humanoid) {
      if (d.skillSetup && !d.skillSetup.skill) delete d.skillSetup.path;
    } else {
      delete d.skillSetup;
      d.abilities = (d.abilities || []).filter(a => a.name.trim() || a.text.trim());
      if (d.abilities.some(a => !a.name.trim())) return toast('Every ability needs a name.', 'bad');
    }
    if (d.role === 'Boss') d.turnsPerPhase = d.turnsPerPhase || 2;
    d.level = Math.max(1, d.level || 1);
    d.xp = Rules.xpFor(d.role, d.level);
    d.custom = true;
    d.id = d.id || Store.newId();
    const list = S().customNpcs;
    const at = list.findIndex(n => n.name === originalName);
    const record = JSON.parse(JSON.stringify(d));
    if (at >= 0) list[at] = record; else list.push(record);
    // A rename carries through to encounters that use the NPC type.
    if (originalName && originalName !== d.name) {
      S().encounters.forEach(e => [...e.enemies, ...(e.allies || [])].forEach(r => { if (r.npcName === originalName) r.npcName = d.name; }));
    }
    originalName = d.name;
    Store.changed();
    toast(d.name + ' saved.', 'good');
    drawList();
    drawEditor();
  }

  function remove() {
    const used = S().encounters.filter(e => [...e.enemies, ...(e.allies || [])].some(r => r.npcName === originalName));
    const msg = 'Delete ' + originalName + '?' + (used.length ? ' It will also be removed from: ' + used.map(e => e.name).join(', ') + '.' : '');
    if (!confirm(msg)) return;
    S().customNpcs = S().customNpcs.filter(n => n.name !== originalName);
    S().encounters.forEach(e => {
      e.enemies = e.enemies.filter(r => r.npcName !== originalName);
      e.allies = (e.allies || []).filter(r => r.npcName !== originalName);
    });
    toast(originalName + ' deleted.');
    draft = null;
    originalName = null;
    Store.changed();
    drawList();
    drawEditor();
  }

  App.register('creatures', render);
  window.Creatures = { editCopyOf };
})();
