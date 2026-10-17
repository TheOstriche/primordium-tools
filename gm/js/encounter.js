// Encounter tab: party roster (players and allied NPCs), the NPC picker, total XP, and difficulty.
(function () {
  const { h, fill, fmt, toast } = UI;
  const S = () => Store.state;
  const LISTS = { enemies: 'Enemies', allies: 'Allies' };

  // Picker filters stay put while you add NPCs.
  const filter = { text: '', family: '', role: '', minLevel: '', maxLevel: '' };
  let pickTo = 'enemies';       // which list the picker adds to: 'enemies' or 'allies'
  let editingPlayerId = null;   // player whose form is open ('new' for a new one)
  let openDetail = null;        // NPC name expanded in the picker
  let importing = null;         // characters read from a character sheet backup, waiting to be added
  let els = {};

  // ---------- Encounter records ----------

  function currentEncounter() {
    const s = S();
    let enc = s.encounters.find(e => e.id === s.settings.currentEncounterId);
    if (!enc) {
      enc = s.encounters[0] || newEncounter();
      s.settings.currentEncounterId = enc.id;
    }
    enc.allies = enc.allies || [];
    return enc;
  }

  function newEncounter() {
    const enc = { id: Store.newId(), name: 'Encounter ' + (S().encounters.length + 1), partyIds: [], enemies: [], allies: [] };
    S().encounters.push(enc);
    S().settings.currentEncounterId = enc.id;
    Store.changed();
    return enc;
  }

  // list: 'enemies' or 'allies'
  function addNpc(list, name, count = 1) {
    const enc = currentEncounter();
    const row = enc[list].find(e => e.npcName === name);
    if (row) row.count += count;
    else enc[list].push({ npcName: name, count });
    enc[list] = enc[list].filter(e => e.count > 0);
    Store.changed();
    drawEncounter();
  }

  // ---------- Party and difficulty ----------

  function partyMembers(enc) {
    return S().players.filter(p => enc.partyIds.includes(p.id));
  }

  function summary(enc) {
    const party = partyMembers(enc);
    let xp = 0;
    const groups = [];
    const notes = [];
    for (const row of enc.enemies) {
      const npc = GameData.find(row.npcName);
      if (!npc) { notes.push(row.npcName + ' is no longer in the NPC list.'); continue; }
      xp += (npc.xp != null ? npc.xp : Rules.xpFor(npc.role, npc.level)) * row.count;
      const p = Rules.combatProfile(npc);
      groups.push({ name: npc.name, count: row.count, hp: p.hp, armor: p.armor, dmg: p.dmg });
      if (p.hpFromBudget) notes.push(npc.name + ': no fixed HP, so the budget HP for its role and level is used.');
      if (p.dmgFromBudget) notes.push(npc.name + ': damage can not be read from its stat block, so the budget damage is used.');
    }
    if (enc.allies.length) notes.push('Allied NPCs are not counted in the difficulty, and they do not take a share of the XP.');
    const avgLevel = party.length ? party.reduce((t, p) => t + (Number(p.level) || 1), 0) / party.length : null;
    const step = avgLevel != null ? Rules.levelToStep(Math.round(avgLevel)) : null;
    const diff = step != null && groups.length ? Rules.encounterDifficulty(step, party.length, groups) : null;
    // The Game Master's Guide budget, in Standard Encounters per player.
    const foes = enc.enemies.map(r => ({ npc: GameData.find(r.npcName), count: r.count })).filter(r => r.npc)
      .map(r => ({ role: r.npc.role, level: r.npc.level, count: r.count }));
    const se = avgLevel != null && foes.length ? Rules.encounterSE(Math.round(avgLevel), party.length, foes) : null;
    return { party, xp, avgLevel, step, diff, se, notes };
  }

  // ---------- Drawing ----------

  function render(root) {
    els = {
      encBar: h('div.enc-bar'),
      party: h('div.card'),
      enemies: h('div.card'),
      summary: h('div.card.summary'),
      pickerHead: h('div.card-head.picker-head'),
      pickerFilters: h('div.filters'),
      pickerList: h('div.picker-list')
    };
    els.picker = h('div.enc-right.card', els.pickerHead, els.pickerFilters, els.pickerList);
    fill(root,
      els.encBar,
      h('div.enc-layout',
        h('div.enc-left', els.summary, els.enemies, els.party),
        els.picker)
    );
    drawFilters();
    drawEncounter();
    drawPicker();
  }

  function drawEncounter() {
    drawEncBar();
    drawSummary();
    drawEnemies();
    drawParty();
    drawPickerHead();
  }

  function drawEncBar() {
    const s = S();
    const enc = currentEncounter();
    fill(els.encBar,
      h('label.inline', 'Encounter ',
        h('select', { onchange: e => { s.settings.currentEncounterId = e.target.value; Store.changed(); drawEncounter(); } },
          s.encounters.map(e => h('option', { value: e.id, selected: e.id === enc.id }, e.name)))),
      h('input.name-input', {
        value: enc.name, 'aria-label': 'Encounter name',
        onchange: e => { enc.name = e.target.value.trim() || enc.name; Store.changed(); drawEncBar(); }
      }),
      h('button', { onclick: () => { newEncounter(); drawEncounter(); } }, 'New encounter'),
      h('button', {
        onclick: () => {
          const copy = JSON.parse(JSON.stringify(enc));
          copy.id = Store.newId();
          copy.name = enc.name + ' (copy)';
          s.encounters.push(copy);
          s.settings.currentEncounterId = copy.id;
          Store.changed();
          drawEncounter();
        }
      }, 'Duplicate'),
      h('button.ghost.danger', {
        onclick: () => {
          if (!confirm('Delete "' + enc.name + '"?')) return;
          s.encounters = s.encounters.filter(e => e.id !== enc.id);
          s.settings.currentEncounterId = null;
          Store.changed();
          drawEncounter();
        }
      }, 'Delete')
    );
  }

  function drawSummary() {
    const enc = currentEncounter();
    const sm = summary(enc);
    const band = sm.diff && sm.diff.band;
    const stepInfo = sm.step != null ? Rules.stepInfo(sm.step) : null;
    fill(els.summary,
      h('div.stat-row',
        h('div.big-stat', h('span.label', 'Difficulty'),
          h('span.value' + (band ? '.band-' + band.toLowerCase() : ''), band || '—'),
          sm.diff ? h('span.sub', fmt(sm.diff.shareLost * 100) + '% of party HP lost') : null),
        h('div.big-stat', h('span.label', 'Total XP'), h('span.value', fmt(sm.xp, 1)),
          sm.party.length ? h('span.sub', fmt(sm.xp / sm.party.length, 1) + ' each') : null),
        h('div.big-stat', h('span.label', 'Rounds to clear'),
          h('span.value', sm.diff ? sm.diff.roundsToClear.toFixed(1) : '—')),
        h('div.big-stat', { title: "Game Master's Guide budget: Easy 0.5, Standard 1, Hard 1.5, Deadly 2+ SE per player" },
          h('span.label', 'Budget'),
          h('span.value' + (sm.se ? '.band-' + sm.se.band.toLowerCase() : ''), sm.se ? fmt(sm.se.perPlayer, 2) + ' SE' : '—'),
          sm.se ? h('span.sub', 'per player · ' + sm.se.band) : null)),
      sm.party.length
        ? h('p.muted.small', sm.party.length + (sm.party.length === 1 ? ' player' : ' players') + ', average level ' + fmt(sm.avgLevel, 1) +
            ' (step ' + sm.step + ', ' + stepInfo.stage + '). Estimate uses reference players at this step: ' +
            stepInfo.playerHP + ' HP, ' + stepInfo.playerArmor + ' armor.')
        : h('p.muted.small', 'Tick players in the party list to see the difficulty.'),
      sm.notes.length ? h('ul.notes', sm.notes.map(n => h('li', n))) : null,
      h('div.row',
        S().combat
          ? h('button', { onclick: () => App.show('combat') }, 'Back to the combat in progress')
          : h('button.primary', { disabled: !enc.enemies.length && !enc.allies.length && !sm.party.length, onclick: () => App.show('combat') }, 'Go to combat'))
    );
  }

  // Rows of NPCs with quantity controls, for the enemies or allies list.
  function npcRows(list) {
    const enc = currentEncounter();
    return enc[list].map(row => {
      const npc = GameData.find(row.npcName);
      return h('div.enemy-row',
        h('div.enemy-name',
          h('strong', row.npcName),
          npc ? h('span.muted.small', ' ' + npc.role + ' · Lv ' + npc.level + ' · ' + (npc.hp ?? '—') + ' HP') : h('span.bad', ' missing')),
        h('div.qty',
          h('button.icon', { title: 'One fewer', onclick: () => addNpc(list, row.npcName, -1) }, '−'),
          h('input.qty-input', {
            type: 'number', min: 0, value: row.count, 'aria-label': 'How many',
            onchange: e => addNpc(list, row.npcName, Math.max(0, parseInt(e.target.value, 10) || 0) - row.count)
          }),
          h('button.icon', { title: 'One more', onclick: () => addNpc(list, row.npcName, 1) }, '+'),
          h('button.icon.ghost', { title: 'Remove', onclick: () => addNpc(list, row.npcName, -row.count) }, '×')));
    });
  }

  function drawEnemies() {
    const rows = npcRows('enemies');
    fill(els.enemies,
      h('div.card-head',
        h('h2', 'Enemies'),
        h('button', { onclick: () => pickFor('enemies') }, 'Add NPC')),
      rows.length ? rows : h('p.muted', 'No enemies yet. Add them from the list on the right.')
    );
  }

  // Point the picker at a list and bring it into view.
  function pickFor(list) {
    pickTo = list;
    drawPickerHead();
    els.picker.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const search = els.pickerFilters.querySelector('input.search');
    if (search) search.focus({ preventScroll: true });
  }

  function drawParty() {
    const enc = currentEncounter();
    const players = S().players;
    const toggle = (id, on) => {
      enc.partyIds = on ? [...new Set([...enc.partyIds, id])] : enc.partyIds.filter(x => x !== id);
      Store.changed();
      drawSummary();
      drawParty();
    };
    const sheetFile = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, onchange: e => readSheets(e.target.files[0]) });
    const allyRows = npcRows('allies');
    fill(els.party,
      h('div.card-head',
        h('h2', 'Party'),
        h('div.row.tight',
          h('button', { onclick: () => { editingPlayerId = 'new'; drawParty(); } }, 'Add player'),
          h('button', { title: 'Friendly NPCs: summons, guides, local help', onclick: () => pickFor('allies') }, 'Add NPC'),
          h('button', { title: 'Load a backup file from the character sheet app (⋯ → Export all characters)', onclick: () => sheetFile.click() }, 'Import character sheets'),
          sheetFile)),
      importing ? importPanel() : null,
      editingPlayerId === 'new' ? playerForm(null) : null,
      players.length ? null : h('p.muted', 'Add your players once; they are kept for every session. Tick the players in this encounter.'),
      players.map(p => editingPlayerId === p.id ? playerForm(p) : h('div.player-row',
        h('label.check',
          h('input', { type: 'checkbox', checked: enc.partyIds.includes(p.id), onchange: e => toggle(p.id, e.target.checked) }),
          h('strong', p.name)),
        h('span.muted.small', 'Lv ' + p.level + ' · ' + p.hp + ' HP · ' + p.armor + ' armor · Speed ' +
          (p.stats.SPD ?? 0) + ' · Perception ' + (p.stats.PER ?? 0) + (p.xp ? ' · ' + fmt(p.xp, 2) + ' XP' : '')),
        p.sheetId ? h('span.tag', { title: 'Imported from the character sheet' }, 'sheet') : null,
        h('button.ghost', { onclick: () => { editingPlayerId = p.id; drawParty(); } }, 'Edit'))),
      players.length ? h('div.row',
        h('button.ghost', { onclick: () => { enc.partyIds = players.map(p => p.id); Store.changed(); drawEncounter(); } }, 'Tick all'),
        h('button.ghost', { onclick: () => { enc.partyIds = []; Store.changed(); drawEncounter(); } }, 'Untick all')) : null,
      bulkBar(enc, players),
      h('h3.sub-head', 'Allied NPCs'),
      allyRows.length ? allyRows : h('p.muted.small', 'Summons, guides, and other friendly NPCs. They fight on the players\' side. Use "Add NPC".')
    );
  }

  // Changes for every ticked player at once.
  function bulkBar(enc, players) {
    const ticked = players.filter(p => enc.partyIds.includes(p.id));
    if (!ticked.length) return null;
    const level = h('input.tiny-num', { type: 'number', min: 1, placeholder: 'Lv', 'aria-label': 'New level' });
    const each = fn => { ticked.forEach(fn); Store.changed(); drawEncounter(); };
    return h('div.bulk-bar',
      h('span.small', h('strong', String(ticked.length)), ' ticked:'),
      level,
      h('button.small', {
        onclick: () => {
          const v = parseInt(level.value, 10);
          if (!(v >= 1)) return toast('Type the new level first.', 'bad');
          each(p => { p.level = v; });
          toast(ticked.length + (ticked.length === 1 ? ' player is' : ' players are') + ' now level ' + v + '.', 'good');
        }
      }, 'Set level'),
      h('button.small.ghost', { onclick: () => each(p => { p.level = (Number(p.level) || 1) + 1; }) }, 'Level up +1'),
      h('button.small.ghost.danger', {
        onclick: () => {
          if (!confirm('Remove ' + ticked.map(p => p.name).join(', ') + ' from your players? They are taken out of every encounter.')) return;
          const gone = new Set(ticked.map(p => p.id));
          S().players = S().players.filter(p => !gone.has(p.id));
          S().encounters.forEach(e => { e.partyIds = e.partyIds.filter(id => !gone.has(id)); });
          Store.changed();
          drawEncounter();
        }
      }, 'Remove'));
  }

  function playerForm(p) {
    const isNew = !p;
    const d = p || { name: '', level: 1, hp: 35, armor: 0, stats: {} };
    const num = (label, key, value) => h('label.field', label,
      h('input', { type: 'number', name: key, value: value ?? 0 }));
    const form = h('form.player-form', { onsubmit: e => save(e) },
      h('label.field.wide', 'Name', h('input', { name: 'name', value: d.name, required: true })),
      num('Level', 'level', d.level),
      num('HP', 'hp', d.hp),
      num('Armor', 'armor', d.armor),
      h('label.field', { title: 'Movement is 5 + Speed' }, 'Speed', h('input', { type: 'number', name: 'stat-SPD', value: d.stats.SPD ?? 0 })),
      h('label.field', { title: 'Breaks initiative ties' }, 'Perception', h('input', { type: 'number', name: 'stat-PER', value: d.stats.PER ?? 0 })),
      h('div.row.wide',
        h('button.primary', { type: 'submit' }, isNew ? 'Add player' : 'Save'),
        h('button.ghost', { type: 'button', onclick: () => { editingPlayerId = null; drawParty(); } }, 'Cancel'),
        isNew ? null : h('button.ghost.danger', {
          type: 'button',
          onclick: () => {
            if (!confirm('Remove ' + p.name + ' from your players?')) return;
            S().players = S().players.filter(x => x.id !== p.id);
            S().encounters.forEach(e => { e.partyIds = e.partyIds.filter(id => id !== p.id); });
            editingPlayerId = null;
            Store.changed();
            drawEncounter();
          }
        }, 'Remove player')));

    function save(e) {
      e.preventDefault();
      const f = new FormData(form);
      const n = key => parseInt(f.get(key), 10) || 0;
      const rec = p || { id: Store.newId(), notes: '' };
      rec.name = String(f.get('name')).trim();
      rec.level = Math.max(1, n('level'));
      rec.hp = n('hp');
      rec.armor = n('armor');
      rec.stats = Object.assign({}, rec.stats, { SPD: n('stat-SPD'), PER: n('stat-PER') });
      if (isNew) {
        S().players.push(rec);
        currentEncounter().partyIds.push(rec.id);
      }
      editingPlayerId = null;
      Store.changed();
      drawEncounter();
    }
    return form;
  }

  // ---------- Importing from the character sheet app ----------

  // The sheet's backup file is { id: character, ... } (⋯ → Export all characters).
  async function readSheets(file) {
    if (!file) return;
    let data;
    try { data = JSON.parse(await file.text()); } catch (e) { return toast('That file could not be read as a character sheet backup.', 'bad'); }
    const list = (Array.isArray(data) ? data : Object.values(data || {}))
      .filter(c => c && typeof c === 'object' && typeof c.name === 'string' && c.stats && typeof c.stats === 'object');
    if (!list.length) return toast('No characters found. In the character sheet app use ⋯ → Export all characters, then load that file.', 'bad');
    importing = list.map(c => {
      const t = PrimordiumCharacter.core(c);
      const match = S().players.find(p => p.sheetId && p.sheetId === c.id) ||
        S().players.find(p => !p.sheetId && p.name.trim().toLowerCase() === c.name.trim().toLowerCase());
      return { c, t, match, on: true };
    });
    drawParty();
  }

  function importPanel() {
    const chosen = importing.filter(r => r.on);
    return h('div.import-panel',
      h('h3', 'Import from the character sheet'),
      h('p.muted.small', 'HP is each character\'s maximum HP and armor is their total, as the sheet shows them. A player imported before is updated (their XP here is kept).'),
      importing.map(r => h('label.check.import-row',
        h('input', { type: 'checkbox', checked: r.on, onchange: e => { r.on = e.target.checked; drawParty(); } }),
        h('strong', r.c.name || 'Unnamed'),
        h('span.muted.small', 'Lv ' + (Number(r.c.level) || 1) + (r.c.race ? ' ' + r.c.race : '') + ' · ' + r.t.maxhp + ' HP · ' + r.t.armor +
          ' armor · Speed ' + r.t.st.SPD + ' · Perception ' + r.t.st.PER),
        r.match ? h('span.tag', 'updates ' + r.match.name) : h('span.tag.good', 'new'))),
      h('div.row',
        h('button.primary', { disabled: !chosen.length, onclick: () => applyImport(chosen) }, 'Import ' + chosen.length),
        h('button.ghost', { onclick: () => { importing = null; drawParty(); } }, 'Cancel')));
  }

  function applyImport(rows) {
    const enc = currentEncounter();
    let added = 0;
    for (const { c, t, match } of rows) {
      const rec = match || { id: Store.newId(), notes: '', xp: 0 };
      rec.name = c.name.trim() || 'Unnamed';
      rec.level = Math.max(1, Number(c.level) || 1);
      rec.hp = t.maxhp;
      rec.armor = t.armor;
      rec.stats = Object.assign({}, t.st);
      rec.race = c.race || '';
      rec.sheetId = c.id || null;
      if (!match) {
        S().players.push(rec);
        added++;
      }
      if (!enc.partyIds.includes(rec.id)) enc.partyIds.push(rec.id);
    }
    importing = null;
    Store.changed();
    drawEncounter();
    toast((added ? added + ' added' : '') + (added && rows.length - added ? ', ' : '') +
      (rows.length - added ? (rows.length - added) + ' updated' : '') + '. They are ticked for this encounter.', 'good');
  }

  // ---------- NPC picker ----------

  function drawPickerHead() {
    if (!els.pickerHead) return;
    fill(els.pickerHead,
      h('h2', 'Add NPCs'),
      h('div.seg', { role: 'group', 'aria-label': 'Add to' },
        h('span.muted.small', 'Add to '),
        Object.entries(LISTS).map(([key, label]) => h('button.small' + (pickTo === key ? '.on' : ''), {
          onclick: () => { pickTo = key; drawPickerHead(); drawPicker(); }
        }, label))));
  }

  function drawFilters() {
    const set = key => e => { filter[key] = e.target.value; drawPicker(); };
    fill(els.pickerFilters,
      h('input.search', { type: 'search', placeholder: 'Search by name or ability…', value: filter.text, oninput: set('text') }),
      h('select', { onchange: set('family'), 'aria-label': 'Family' },
        h('option', { value: '' }, 'All families'),
        GameData.families().map(f => h('option', { value: f, selected: filter.family === f }, f))),
      h('select', { onchange: set('role'), 'aria-label': 'Role' },
        h('option', { value: '' }, 'All roles'),
        GameData.ROLES.map(r => h('option', { value: r, selected: filter.role === r }, r))),
      h('label.inline.small', 'Level ',
        h('input.lvl', { type: 'number', min: 1, placeholder: 'min', value: filter.minLevel, oninput: set('minLevel') }),
        ' to ',
        h('input.lvl', { type: 'number', min: 1, placeholder: 'max', value: filter.maxLevel, oninput: set('maxLevel') }))
    );
  }

  function matches(n) {
    const t = filter.text.trim().toLowerCase();
    if (t) {
      const hay = [n.name, n.family, n.description, n.combatSkill, ...(n.abilities || []).map(a => a.name + ' ' + a.text)]
        .join(' ').toLowerCase();
      if (!hay.includes(t)) return false;
    }
    if (filter.family && n.family !== filter.family) return false;
    if (filter.role && n.role !== filter.role) return false;
    if (filter.minLevel && n.level < Number(filter.minLevel)) return false;
    if (filter.maxLevel && n.level > Number(filter.maxLevel)) return false;
    return true;
  }

  function drawPicker() {
    const list = GameData.all().filter(matches)
      .sort((a, b) => a.family.localeCompare(b.family) || a.level - b.level || a.name.localeCompare(b.name));
    const toLabel = pickTo === 'allies' ? 'ally' : 'enemy';
    fill(els.pickerList,
      h('div.picker-count.muted.small', list.length + (list.length === 1 ? ' NPC type' : ' NPC types')),
      list.map(n => h('div.picker-item',
        h('div.picker-main', { onclick: () => { openDetail = openDetail === n.name ? null : n.name; drawPicker(); } },
          h('div',
            h('strong', n.name), n.custom ? h('span.tag', 'custom') : null,
            h('div.muted.small', n.family + ' · ' + n.size + ' · ' + n.tactics + ' tactics')),
          h('span.role.role-' + n.role.toLowerCase(), n.role),
          h('span.cell', 'Lv ' + n.level),
          h('span.cell', (n.hp ?? '—') + ' HP'),
          h('span.cell', n.armor + ' AR'),
          h('span.cell', fmt(n.xp, 1) + ' XP'),
          h('button.add' + (pickTo === 'allies' ? '.ally' : ''), {
            title: 'Add to this encounter as an ' + toLabel,
            onclick: e => { e.stopPropagation(); addNpc(pickTo, n.name, 1); toast(n.name + ' added as an ' + toLabel + '.'); }
          }, 'Add')),
        openDetail === n.name ? creatureDetail(n) : null))
    );
  }

  function creatureDetail(n) {
    return h('div.picker-detail',
      h('p.small', GameData.STATS.map(k => k + ' ' + n.stats[k]).join(' · ')),
      n.specialHp ? h('p.small', h('em', n.specialHp)) : null,
      n.attributes && n.attributes !== 'None' ? h('p.small', h('strong', 'Attributes: '), n.attributes) : null,
      n.humanoid ? h('p.small', n.combatSkill) : h('ul.abilities', (n.abilities || []).map(a => h('li',
        h('span.rarity.rarity-' + a.rarity.toLowerCase(), a.rarity), ' ', h('strong', a.name),
        a.cooldown ? h('span.muted', ' (cooldown ' + a.cooldown + ')') : null, ' – ', a.text))),
      n.description && n.description !== 'Standard' ? h('p.small.muted', n.description) : null
    );
  }

  App.register('encounter', render);
})();
