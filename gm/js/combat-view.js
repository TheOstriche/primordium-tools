// Combat tab: set up from the current encounter, initiative, turn order, the grid,
// and a panel for the selected token. Players run their own characters, so the GM
// only tracks their HP and position; NPCs (enemies and allies) get attacks, stacks, and conditions.
(function () {
  const { h, fill, toast, fmt } = UI;
  const S = () => Store.state;
  const DEFAULT_MAP = { cols: 24, rows: 16, cell: 40, lineOpacity: 0.35, imageKey: null };
  const DEFENSES = [['none', 'Hit'], ['failed', 'Failed dodge ×1.5'], ['block', 'Blocked'], ['dodged', 'Dodged']];

  let root = null;
  let els = {};
  let grid = null;
  let selectedId = null;
  let ruler = false;
  let openMenu = null;    // 'map' or 'add'
  let addSide = 'enemy';  // side for NPCs added mid-fight
  let ambush = '';
  let plan = null;        // the selected NPC's attack: { cid, ability, tactic, targets, roll, manual, ap }
  let report = null;      // lines from the last end of phase
  let ending = false;     // showing the end-combat screen
  let xpAll = false;      // award XP for enemies that were not defeated too

  const combat = () => S().combat;
  const encounterOf = cb => S().encounters.find(e => e.id === cb.encounterId);

  function mapOf(cb) {
    const holder = encounterOf(cb) || cb;
    if (!holder.map) holder.map = Object.assign({}, DEFAULT_MAP);
    for (const k of Object.keys(DEFAULT_MAP)) if (holder.map[k] === undefined) holder.map[k] = DEFAULT_MAP[k];
    return holder.map;
  }

  function activeCombatant(cb) {
    const e = Combat.activeEntry(cb);
    return e ? Combat.get(cb, e.cid) : null;
  }

  // Run a change, save, and redraw.
  // Impact effects (../shared/fx.js): a defeated enemy or a downed player gets its moment after the redraw.
  const FX = window.PrimordiumFX || null;
  function act(fn) {
    const cb = combat(), was = cb ? new Map(cb.combatants.map(c => [c.id, { dead: !!c.dead, down: Combat.isDowned(c) }])) : new Map();
    fn();
    Store.changed();
    refresh();
    if (!FX || !cb) return;
    for (const c of cb.combatants) {
      const w = was.get(c.id); if (!w) continue;
      if (c.dead && !w.dead) FX.banner(c.kind === 'player' ? c.name + ' falls' : 'Defeated', c.kind === 'player' ? '#e0604f' : '#eab14c', .9);
      else if (Combat.isDowned(c) && !w.down) FX.hp('down');
    }
  }

  // ---------- Top level ----------

  function render(r) {
    root = r;
    const cb = combat();
    if (!cb) return renderPrepare();
    els = { bar: h('div.combat-bar'), left: h('div.combat-left'), center: h('div.combat-center'), right: h('div.combat-right') };
    fill(root, els.bar, h('div.combat-layout', els.left, els.center, els.right));
    grid = Grid.create(els.center, {
      onSelect: id => {
        // While an NPC's attack is being aimed, clicking a target's token aims at it.
        if (aiming() && isTarget(Combat.get(combat(), id))) return toggleTarget(id);
        selectedId = id;
        refresh();
      },
      onMove: (id, x, y) => act(() => {
        const c = Combat.get(combat(), id);
        c.x = x; c.y = y;
      })
    });
    refresh();
  }

  function refresh() {
    const cb = combat();
    if (!cb || !els.bar || !root.contains(els.bar)) return render(root);
    // A combat saved earlier may hold a condition that is no longer on the list (Entrapped was removed).
    for (const c of cb.combatants) c.conditions = c.conditions.filter(x => Combat.CONDITIONS.includes(x));
    if (!selectedId || !Combat.get(cb, selectedId)) {
      const a = activeCombatant(cb);
      selectedId = a ? a.id : (cb.combatants[0] || {}).id;
    }
    if (plan && plan.cid !== selectedId) plan = null;
    drawBar(cb);
    drawLeft(cb);
    drawRight(cb);
    drawGrid(cb);
  }

  function drawGrid(cb) {
    grid.update({
      map: mapOf(cb), combatants: cb.combatants, selectedId,
      activeId: (activeCombatant(cb) || {}).id, ruler,
      targetIds: aiming() ? Object.keys(plan.targets) : []
    });
  }

  // ---------- Setting up ----------

  function renderPrepare() {
    const s = S();
    const enc = s.encounters.find(e => e.id === s.settings.currentEncounterId) || s.encounters[0];
    let body;
    if (!enc) {
      body = h('p.muted', 'Create an encounter on the Encounter tab first.');
    } else {
      const players = s.players.filter(p => enc.partyIds.includes(p.id)).length;
      const enemies = enc.enemies.reduce((t, e) => t + e.count, 0);
      const allies = (enc.allies || []).reduce((t, e) => t + e.count, 0);
      body = [
        h('p', 'Set up combat for ', h('strong', enc.name), '.'),
        h('p.muted', players + (players === 1 ? ' player, ' : ' players, ') + (allies ? allies + (allies === 1 ? ' ally, ' : ' allies, ') : '') +
          enemies + (enemies === 1 ? ' enemy' : ' enemies') + '. Change these on the Encounter tab.'),
        h('button.primary', { disabled: !players && !enemies && !allies, onclick: () => start(enc) }, 'Set up combat')
      ];
    }
    fill(root, h('div.page-narrow', h('h1', 'Combat'), body));
  }

  function start(enc) {
    const cb = Combat.fromEncounter(enc, S().players);
    autoPlace(cb, mapOf(cb));
    S().combat = cb;
    selectedId = null; plan = null; report = null; ending = false; ambush = ''; openMenu = null;
    Store.changed();
    render(root);
    fitToScreen();
  }

  // Zoom so the whole grid fits in the middle area.
  function fitToScreen() {
    const cb = combat();
    const wrap = els.center && els.center.querySelector('.board-wrap');
    if (!cb || !wrap) return;
    const map = mapOf(cb);
    const fit = Math.floor(Math.min((wrap.clientWidth - 26) / map.cols, (wrap.clientHeight - 26) / map.rows));
    act(() => { map.cell = Math.max(16, Math.min(90, fit)); });
  }

  // Players and allies along the left edge, enemies along the right, in columns.
  function autoPlace(cb, map) {
    const place = (list, fromRight) => {
      let col = fromRight ? map.cols - 2 : 1, row = 1, colWidth = 1;
      for (const c of list) {
        if (c.x != null) continue;
        const [fw, fh] = Combat.footprint(c);
        if (row + fh > map.rows - 1) {
          col += (fromRight ? -1 : 1) * (colWidth + 1);
          row = 1;
          colWidth = 1;
        }
        c.x = Math.max(0, Math.min(map.cols - fw, fromRight ? col - fw + 1 : col));
        c.y = Math.max(0, Math.min(map.rows - fh, row));
        row += fh + 1;
        colWidth = Math.max(colWidth, fw);
      }
    };
    place(cb.combatants.filter(c => c.kind !== 'enemy'), false);
    place(cb.combatants.filter(c => c.kind === 'enemy'), true);
  }

  // Keep tokens on the grid after it shrinks.
  function keepOnGrid(cb, map) {
    for (const c of cb.combatants) {
      if (c.x == null) continue;
      const [fw, fh] = Combat.footprint(c);
      c.x = Math.max(0, Math.min(map.cols - fw, c.x));
      c.y = Math.max(0, Math.min(map.rows - fh, c.y));
    }
  }

  // ---------- Top bar ----------

  function drawBar(cb) {
    const active = activeCombatant(cb);
    const phaseLabel = cb.phase === 0 ? 'Setting up' : Combat.inSurprise(cb) ? 'Surprise phase' : 'Phase ' + cb.phase;
    const atEnd = cb.phase > 0 && !active;
    fill(els.bar,
      h('div.phase',
        h('span.phase-label', phaseLabel),
        active ? h('span.muted', ' · ' + active.name + "'s turn") : null,
        atEnd ? h('span.muted', ' · everyone has acted') : null),
      cb.phase > 0 && !atEnd ? h('button.primary', { onclick: nextTurn }, 'Next turn') : null,
      cb.phase > 0 ? h(atEnd ? 'button.primary' : 'button.ghost', { onclick: endPhase }, 'End phase') : null,
      h('span.spacer'),
      h('button' + (ruler ? '.on' : ''), { onclick: () => { ruler = !ruler; refresh(); }, title: 'Press and drag on the grid to measure' }, 'Ruler'),
      mapSettings(cb),
      addNpcControl(cb),
      h('button.ghost.danger', { onclick: () => { ending = true; plan = null; refresh(); } }, 'End combat'));
  }

  function nextTurn() {
    const cb = combat();
    plan = null;
    act(() => {
      Combat.nextTurn(cb);
      const a = activeCombatant(cb);
      if (a) selectedId = a.id;
    });
  }

  function endPhase() {
    const cb = combat();
    if (activeCombatant(cb) && !confirm('Not everyone has acted yet. End the phase anyway?')) return;
    plan = null;
    act(() => {
      report = { phase: Combat.inSurprise(cb) ? 'Surprise phase' : 'Phase ' + cb.phase, lines: Combat.endPhase(cb) };
      const next = activeCombatant(cb);
      if (next) selectedId = next.id;
    });
  }

  function menu(id, label, body) {
    return h('details.menu', {
      open: openMenu === id,
      ontoggle: e => {
        if (e.target.open) { openMenu = id; els.bar.querySelectorAll('details.menu').forEach(d => { if (d !== e.target) d.open = false; }); }
        else if (openMenu === id) openMenu = null;
      }
    }, h('summary', label), h('div.menu-body', body));
  }

  function mapSettings(cb) {
    const map = mapOf(cb);
    const num = (label, key) => h('label.field', label,
      h('input', { type: 'number', min: 4, max: 120, value: map[key], onchange: e => act(() => {
        map[key] = Math.max(4, Math.min(120, parseInt(e.target.value, 10) || map[key]));
        keepOnGrid(cb, map);
      }) }));
    const upload = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: e => uploadImage(cb, e.target.files[0]) });
    return menu('map', 'Map', [
      h('div.menu-grid', num('Columns', 'cols'), num('Rows', 'rows')),
      h('label.field', 'Zoom',
        h('input', { type: 'range', min: 16, max: 90, value: map.cell, oninput: e => { map.cell = +e.target.value; drawGrid(cb); }, onchange: () => Store.changed() })),
      h('label.field', 'Grid lines',
        h('input', { type: 'range', min: 0, max: 1, step: 0.05, value: map.lineOpacity, oninput: e => { map.lineOpacity = +e.target.value; drawGrid(cb); }, onchange: () => Store.changed() })),
      h('div.row',
        h('button.ghost', { onclick: fitToScreen }, 'Fit to screen'),
        h('button.ghost', { onclick: () => act(() => { cb.combatants.forEach(c => { c.x = null; c.y = null; }); autoPlace(cb, map); }) }, 'Line up tokens')),
      h('div.row',
        h('button', { onclick: () => upload.click() }, map.imageKey ? 'Replace image' : 'Upload map image'),
        map.imageKey ? h('button.ghost', { onclick: () => removeImage(cb) }, 'Remove image') : null,
        upload),
      map.imageKey ? h('button.ghost', { onclick: () => fitRowsToImage(cb) }, 'Match rows to the image') : null
    ]);
  }

  async function uploadImage(cb, file) {
    if (!file) return;
    const holder = encounterOf(cb) || cb;
    const key = 'map-' + holder.id;
    await Store.images.put(key, file);
    Grid.forgetImage(key);
    mapOf(cb).imageKey = key;
    await fitRowsToImage(cb);
    toast('Map image added. Set Columns to the number of squares across the map.', 'good');
  }

  async function fitRowsToImage(cb) {
    const map = mapOf(cb);
    const url = await Grid.imageUrl(map.imageKey);
    if (!url) return;
    const img = new Image();
    img.src = url;
    await img.decode();
    act(() => {
      map.rows = Math.max(4, Math.round(map.cols * img.naturalHeight / img.naturalWidth));
      keepOnGrid(cb, map);
    });
  }

  async function removeImage(cb) {
    const map = mapOf(cb);
    if (!confirm('Remove the map image?')) return;
    await Store.images.remove(map.imageKey);
    Grid.forgetImage(map.imageKey);
    act(() => { map.imageKey = null; });
  }

  function addNpcControl(cb) {
    const select = h('select', { 'aria-label': 'NPC type' },
      GameData.all().slice().sort((a, b) => a.name.localeCompare(b.name))
        .map(n => h('option', { value: n.name }, n.name + ' (' + n.role + ', Lv ' + n.level + ')')));
    return menu('add', 'Add NPC', [
      h('p.muted.small', 'Reinforcements and summons join the turn order at their initiative.'),
      select,
      h('div.seg',
        [['enemy', 'Enemy'], ['ally', 'Ally']].map(([v, label]) => h('button.small' + (addSide === v ? '.on' : ''), {
          onclick: e => { addSide = v; e.target.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === e.target)); }
        }, label))),
      h('button.primary', {
        onclick: () => act(() => {
          const c = Combat.addNpc(cb, GameData.find(select.value), addSide);
          autoPlace(cb, mapOf(cb));
          selectedId = c.id;
          Combat.log(cb, c.name + ' joins the fight' + (addSide === 'ally' ? ' as an ally.' : '.'));
        })
      }, 'Add')
    ]);
  }

  // ---------- Left column ----------

  function drawLeft(cb) {
    if (cb.phase === 0) return fill(els.left, initiativeSetup(cb));
    fill(els.left,
      report ? h('div.card.report',
        h('div.card-head', h('h3', report.phase + ' resolved'), h('button.icon.ghost', { title: 'Dismiss', onclick: () => { report = null; refresh(); } }, '×')),
        report.lines.length ? h('ul.small', report.lines.map(l => h('li', l))) : h('p.muted.small', 'Nothing happened at the end of the phase.')) : null,
      h('div.card.turns',
        h('h3', 'Turn order'),
        cb.order.map((e, i) => turnRow(cb, e, i))),
      h('details.card.log',
        h('summary', 'Combat log'),
        h('ol.small', cb.log.slice(-60).reverse().map(l => h('li', h('span.muted', 'P' + l.phase + ' '), l.text)))));
  }

  function turnRow(cb, e, i) {
    const c = Combat.get(cb, e.cid);
    if (!c) return null;
    const isActive = i === cb.turn;
    const out = !Combat.canAct(cb, e);
    const stackCount = Object.values(c.stacks).reduce((t, s) => t + s.n, 0);
    const effects = c.conditions.length + c.effects.length;
    return h('div.turn-row', {
      class: [c.kind, isActive && 'active', c.id === selectedId && 'selected', out && 'out'].filter(Boolean).join(' '),
      onclick: () => { selectedId = c.id; refresh(); }
    },
      h('span.init', e.second ? '2nd' : String(Combat.initiativeOf(c))),
      h('span.turn-name', c.name,
        c.dead ? h('span.badge.bad', c.kind === 'player' ? 'dead' : 'defeated') : null,
        Combat.isDowned(c) && !c.dead ? h('span.badge.bad', c.stabilized ? 'stable' : 'downed ' + c.deathClock) : null,
        stackCount ? h('span.badge', PrimordiumCore.plural(stackCount, 'stack')) : null,
        effects ? h('span.badge', effects + (effects === 1 ? ' effect' : ' effects')) : null),
      hpMini(c),
      h('span.order-btns',
        h('button.icon.ghost.tiny', { title: 'Move up', onclick: ev => { ev.stopPropagation(); act(() => Combat.moveEntry(cb, i, -1)); } }, '▲'),
        h('button.icon.ghost.tiny', { title: 'Move down', onclick: ev => { ev.stopPropagation(); act(() => Combat.moveEntry(cb, i, 1)); } }, '▼')));
  }

  function hpMini(c) {
    if (c.hp == null) return h('span.hp-mini.muted', '—');
    const pct = c.maxHp ? Math.max(0, Math.min(1, c.hp / c.maxHp)) : 1;
    return h('span.hp-mini', { title: c.hp + ' / ' + c.maxHp + ' HP' },
      h('span.hp-mini-text', String(c.hp)),
      h('span.hp-mini-bar', h('span', { style: 'width:' + pct * 100 + '%', class: pct <= 0.25 ? 'low' : '' })));
  }

  function initiativeSetup(cb) {
    const players = cb.combatants.filter(c => c.kind === 'player');
    const npcs = cb.combatants.filter(c => c.kind !== 'player');
    return h('div.card',
      h('h3', 'Initiative'),
      h('p.muted.small', 'Type each player\'s D10 + Perception roll. NPCs have 5 + Perception.'),
      players.map(c => h('div.init-row',
        h('span', c.name),
        h('input', { type: 'number', value: c.init ?? '', placeholder: '—', 'aria-label': c.name + ' initiative',
          onchange: e => { c.init = e.target.value === '' ? null : parseInt(e.target.value, 10); Store.changed(); } }))),
      npcs.map(c => h('div.init-row', h('span', c.name, c.kind === 'ally' ? h('span.muted.small', ' ally') : null), h('strong', String(Combat.initiativeOf(c))))),
      h('label.field', 'Ambush',
        h('select', { onchange: e => { ambush = e.target.value; refresh(); } },
          h('option', { value: '', selected: ambush === '' }, 'No ambush'),
          h('option', { value: 'player', selected: ambush === 'player' }, 'Players and allies ambush'),
          h('option', { value: 'enemy', selected: ambush === 'enemy' }, 'Enemies ambush'))),
      ambush ? h('p.muted.small', 'The ambushers get a surprise phase first. Ambushed characters can not use Defensive or Quick abilities in it.') : null,
      h('p.muted.small', 'Drag tokens into position before you begin.'),
      h('button.primary', {
        onclick: () => {
          const missing = players.filter(c => c.init == null);
          if (missing.length && !confirm('No initiative for ' + missing.map(c => c.name).join(', ') + '. Count it as 0?')) return;
          act(() => {
            Combat.begin(cb, ambush || null);
            const a = activeCombatant(cb);
            if (a) selectedId = a.id;
          });
        }
      }, 'Begin combat'));
  }

  // ---------- Right column: the selected token ----------

  function drawRight(cb) {
    if (ending) return fill(els.right, endScreen(cb));
    const c = Combat.get(cb, selectedId);
    if (!c) return fill(els.right, h('p.muted', 'Select a token.'));
    const npc = c.kind !== 'player' ? GameData.find(c.refId) : null;
    const isActive = activeCombatant(cb) === c;
    fill(els.right,
      h('div.detail-head',
        h('div', h('h2', c.name),
          h('div.muted.small', c.kind === 'player'
            ? 'Player · Level ' + c.level + ' · Armor ' + (c.armor || 0) + ' · Move ' + Combat.movement(c) + 'M'
            : (c.kind === 'ally' ? 'Ally · ' : '') + c.role + ' · Level ' + c.level + ' · ' + c.tactics + ' tactics' + (c.turnsPerPhase > 1 ? ' · 2 turns per phase' : ''))),
        isActive ? h('span.tag.big', 'Their turn') : null),
      hpBlock(cb, c, npc),
      npc ? [
        attackSection(cb, c, npc, isActive),
        npcStats(c, npc),
        stacksSection(cb, c, isActive),
        effectsSection(cb, c)
      ] : null,
      h('div.row.panel-foot',
        Combat.FOOTPRINT[c.size] && Combat.FOOTPRINT[c.size][0] !== Combat.FOOTPRINT[c.size][1]
          ? h('button.ghost.small', { onclick: () => act(() => { c.rotated = !c.rotated; keepOnGrid(cb, mapOf(cb)); }) }, 'Turn sideways') : null,
        h('button.ghost.danger.small', {
          onclick: () => {
            if (!confirm('Remove ' + c.name + ' from this combat?')) return;
            act(() => removeCombatant(cb, c));
          }
        }, 'Remove from combat')));
  }

  function removeCombatant(cb, c) {
    const active = Combat.activeEntry(cb);
    cb.combatants = cb.combatants.filter(x => x !== c);
    cb.order = cb.order.filter(e => e.cid !== c.id);
    if (active && active.cid !== c.id) cb.turn = cb.order.indexOf(active);
    else if (cb.phase > 0) { cb.turn--; Combat.nextTurn(cb); }
    selectedId = null;
    plan = null;
  }

  // ---- HP: players take damage as told; NPCs take strikes after armor ----

  function hpBlock(cb, c, npc) {
    if (c.hp == null) {
      return h('div.section.hp-block',
        h('div.hp-big', 'No HP'),
        npc && npc.specialHp ? h('p.small', npc.specialHp) : null,
        h('label.check', h('input', { type: 'checkbox', checked: c.dead, onchange: e => act(() => {
          c.dead = e.target.checked;
          Combat.log(cb, c.name + (c.dead ? ' is defeated.' : ' is back in the fight.'));
        }) }), 'Defeated'));
    }
    const pct = c.maxHp ? Math.max(0, Math.min(1, c.hp / c.maxHp)) : 1;
    const enemy = c.kind !== 'player';
    const amount = h('input.amount', { placeholder: enemy ? 'Strikes: 7, 5' : 'Amount', 'aria-label': 'Amount' });
    const ap = h('input.tiny-num', { type: 'number', min: 0, value: 0, title: 'AP' });
    const noArmor = h('input', { type: 'checkbox' });
    const dodge = h('input', { type: 'checkbox' });
    const preview = h('span.preview');
    const numbers = () => amount.value.split(/[^0-9]+/).filter(Boolean).map(Number);
    const opts = () => ({ strikes: numbers(), ap: +ap.value || 0, ignoreArmor: noArmor.checked, failedDodge: dodge.checked });
    const options = enemy ? h('div.row.small', { hidden: true },
      h('label.inline', 'AP', ap),
      h('label.check', noArmor, 'Ignores armor'),
      h('label.check', dodge, 'Failed dodge'),
      preview) : null;
    // The armor options only appear once damage is being typed.
    const update = () => {
      if (!enemy) return;
      const o = opts();
      options.hidden = !amount.value.trim();
      preview.textContent = o.strikes.length ? '→ ' + Combat.computeDamage(c, o).total + ' after armor' : '';
    };
    [amount, ap, noArmor, dodge].forEach(el => el.addEventListener('input', update));
    const hit = () => {
      const o = opts();
      if (!o.strikes.length) return;
      if (enemy) act(() => Combat.applyAttack(cb, c, o));
      else act(() => {
        const total = o.strikes.reduce((a, b) => a + b, 0);
        Combat.hurt(cb, c, total, true);
        Combat.log(cb, c.name + ' takes ' + total + '.');
      });
    };
    const heal = () => {
      const total = numbers().reduce((a, b) => a + b, 0);
      if (total) act(() => { Combat.heal(cb, c, total); Combat.log(cb, c.name + ' heals ' + total + '.'); });
    };
    amount.addEventListener('keydown', e => { if (e.key === 'Enter') hit(); });

    let status = null;
    if (c.dead) {
      status = h('div.status', c.kind === 'player' ? 'Dead.' : 'Defeated.',
        h('button.ghost.small', { onclick: () => act(() => {
          c.dead = false;
          if (c.hp <= 0) {
            if (c.kind === 'player') { c.deathClock = Combat.DEATH_CLOCK; c.stabilized = false; } else c.hp = 1;
          }
          Combat.log(cb, c.name + ' is back (GM).');
        }) }, 'Undo'));
    } else if (Combat.isDowned(c)) {
      status = h('div.status',
        h('strong', c.stabilized ? 'Downed, stabilized.' : 'Downed. Death clock: ' + c.deathClock + ' phase' + (c.deathClock === 1 ? '' : 's') + '.'),
        h('p.small.muted', 'Each hit removes a phase. An adjacent ally stabilizes with a Standard action and a Knowledge check of 6+.'),
        !c.stabilized ? h('button.small', { onclick: () => act(() => Combat.stabilize(cb, c)) }, 'Stabilized') : null);
    }
    return h('div.section.hp-block',
      h('div.hp-big', String(c.hp), h('span.muted', ' / ' + c.maxHp + ' HP')),
      h('div.hp-bar', h('span', { style: 'width:' + pct * 100 + '%', class: pct <= 0.25 ? 'low' : '' })),
      h('div.row', amount,
        h('button', { onclick: hit }, enemy ? 'Hit' : 'Damage'),
        h('button.ghost', { onclick: heal }, 'Heal')),
      options,
      status);
  }

  // ---- NPC attacks: pick an ability, aim, roll, confirm ----
  // Enemies attack players and allies; allies attack enemies.

  const aiming = () => plan && (plan.manual != null || (plan.ability && plan.ability.attack));
  function isTarget(t) {
    const me = plan && Combat.get(combat(), plan.cid);
    return !!(t && me && t.id !== me.id && Combat.side(t) !== Combat.side(me) && !t.dead && t.hp != null);
  }

  function planFor(c) {
    if (!plan || plan.cid !== c.id) plan = { cid: c.id, ability: null, tactic: null, targets: {}, roll: null, manual: null, ap: 0 };
    return plan;
  }

  // A humanoid's skill setup is kept on its token, so two Soldiers can use different weapons.
  function skillSetup(c, npc) {
    if (!c.skill) c.skill = Skills.setupFor(npc);
    return c.skill;
  }

  function abilitiesOf(c, npc) {
    return npc.humanoid ? Skills.abilitiesFor(skillSetup(c, npc), npc.tactics) : (npc.abilities || []);
  }

  function toggleTarget(id) {
    const area = plan.manual == null && plan.ability.attack.area;
    if (plan.targets[id]) delete plan.targets[id];
    else {
      if (!area && plan.manual == null) plan.targets = {};
      plan.targets[id] = { def: 'none', block: 0 };
    }
    refresh();
  }

  // Humanoids: which skill (and path) they fight with, their damage stat and weapon tier.
  function skillPicker(c, npc) {
    const s = skillSetup(c, npc);
    const change = fn => act(() => { fn(); Skills.choosePath(s); plan = null; });
    const choices = s.options.includes(s.skill) || !s.skill ? s.options : s.options.concat(s.skill);
    const paths = s.pathTier ? Skills.pathsOf(s.skill) : [];
    const all = choices.length < Skills.combatSkills.length;
    return h('div.skill-setup',
      h('select.small', {
        'aria-label': 'Combat skill',
        onchange: e => change(() => {
          if (e.target.value === '*') s.options = Skills.combatSkills.slice();
          else s.skill = e.target.value;
        })
      },
        h('option', { value: '', selected: !s.skill, disabled: true }, 'Choose its skill…'),
        choices.map(n => h('option', { value: n, selected: s.skill === n }, n)),
        all ? h('option', { value: '*' }, 'Other skill…') : null),
      paths.length ? h('select.small', { 'aria-label': 'Path', onchange: e => change(() => { s.path = e.target.value; }) },
        paths.map(n => h('option', { value: n, selected: s.path === n }, n))) : null,
      h('span.muted.small', s.pathTier ? 'Path Tier ' + s.pathTier : 'Base Tier ' + s.baseTier),
      h('label.inline.small', { title: 'Damage stat: adds ½ per D4 or D6, 1 per D8 to D12, 2 per D20 for each point' }, 'Stat',
        h('input.tiny-num', { type: 'number', min: 0, value: s.stat, onchange: e => change(() => { s.stat = Math.max(0, parseInt(e.target.value, 10) || 0); }) })),
      h('label.inline.small', { title: 'Weapon tier: added to one strike per attack' }, 'Weapon',
        h('input.tiny-num', { type: 'number', min: 0, value: s.weaponTier, onchange: e => change(() => { s.weaponTier = Math.max(0, parseInt(e.target.value, 10) || 0); }) })));
  }

  // Each strike that rolled every die at its highest face (a crit) or every die at 1 (a miss) gets its effect.
  function strikeFx(p) {
    if (!FX || !p.roll) return;
    const els = document.querySelectorAll('.roll-line .strike'); let loud = false;
    p.roll.strikes.forEach((s, i) => {
      const kind = FX.roll({ dice: s.dice.map(r => ({ f: p.ability.attack.sides, r })) }, els[i], { quiet: loud });
      if (kind) { loud = true; if (els[i]) els[i].classList.add(kind === 'crit' ? 'pfx-crit' : 'pfx-fumble', 'pfx-pop'); }
    });
  }

  function attackSection(cb, c, npc, isActive) {
    if (cb.phase === 0 || c.dead) return null;
    const p = planFor(c);
    const disabled = Combat.isDowned(c);
    const abilities = abilitiesOf(c, npc);
    const live = isActive || p.ability || p.manual != null;
    const parts = [h('div.card-head', h('h3', 'Attack'),
      abilities.length ? h('button' + (isActive && !p.ability && p.manual == null ? '.primary' : '') + '.small', {
        title: 'Roll a D20 on the tactics table to pick an ability',
        onclick: e => {
          const from = e.currentTarget.getBoundingClientRect();
          const ch = Combat.chooseAbility(cb, c, npc, null, abilities);
          Object.assign(p, { ability: ch.ability, tactic: ch, roll: null, manual: null, targets: {} });
          refresh();
          if (FX) FX.card(ch.ability ? ch.ability.rarity : ch.rolled, from);
        }
      }, 'Roll tactics') : null)];

    if (npc.humanoid) parts.push(skillPicker(c, npc));
    if (p.tactic) {
      parts.push(h('p.small', 'D20 ', h('strong', String(p.tactic.d20)), ' → ', p.tactic.rolled,
        p.tactic.notes.length ? h('span.muted', '. ' + p.tactic.notes.join(' ')) : null));
    }
    if (abilities.length) {
      parts.push(h('div.ability-list', abilities.map(a => {
        const ready = Combat.isReady(cb, c, a);
        const r = c.cooldowns[a.name];
        const on = p.ability && p.ability.name === a.name;
        return h('button.ability-btn' + (on ? '.on' : ''), {
          disabled: !ready,
          title: (a.tier ? a.tier + '. ' : '') + a.text,
          onclick: () => { Object.assign(p, { ability: on ? null : a, roll: null, manual: null, targets: {} }); if (!on) p.tactic = null; refresh(); }
        },
          h('span.rarity.rarity-' + a.rarity.toLowerCase(), a.rarity),
          h('span.ability-name', a.name, a.type && a.type !== 'Standard' ? h('span.type-tag', a.type) : null),
          h('span.muted.small', !ready ? (r === 'combat' ? 'used' : 'phase ' + r) : a.attack ? 'avg ' + fmt(Rules.attackAverage(a.attack), 1) : 'effect'));
      })));
    } else if (npc.humanoid) {
      parts.push(h('p.small.muted', skillSetup(c, npc).skill ? 'No abilities at this tier and its tactics\' rarities.' : 'Choose its skill to list its abilities.'));
    }
    if (abilities.some(a => !Combat.isReady(cb, c, a))) {
      parts.push(h('button.ghost.small', { onclick: () => act(() => { c.cooldowns = {}; }) }, 'Reset cooldowns'));
    }
    if (p.manual == null) {
      parts.push(h('button.ghost.small', {
        title: 'Type each strike\'s damage yourself',
        onclick: () => { Object.assign(p, { manual: '', roll: null, targets: {} }); refresh(); }
      }, 'Type damage instead'));
    }
    if (!p.ability && p.manual == null) return h('div.section.attack' + (live ? '.live' : ''), parts);

    if (p.ability) {
      parts.push(h('p.small.ability-text', p.ability.tier ? h('span.muted', p.ability.tier + ' · ' + (p.ability.type || 'Standard') + '. ') : null, p.ability.text));
    }
    if (p.ability && !p.ability.attack && p.manual == null) {
      parts.push(h('button.primary', {
        disabled,
        onclick: () => act(() => {
          Combat.markUsed(cb, c, p.ability);
          Combat.log(cb, c.name + ' uses ' + p.ability.name + '.');
          plan = null;
        })
      }, 'Use ' + p.ability.name));
      return h('div.section.attack.live', parts);
    }

    // Targets on the other side, nearest first. Clicking a token on the grid also aims.
    const foes = cb.combatants.filter(isTarget);
    const dist = t => (c.x != null && t.x != null) ? Combat.distance(c.x, c.y, t.x, t.y) : null;
    foes.sort((x, y) => (dist(x) ?? 999) - (dist(y) ?? 999));
    const manual = p.manual != null;
    const area = manual || p.ability.attack.area;
    parts.push(h('p.small.muted', area ? 'Choose everyone it hits (or click their tokens).' : 'Choose the target (or click its token).'));
    parts.push(h('div.chips', foes.map(t => h('button.toggle' + (p.targets[t.id] ? '.on' : ''), { onclick: () => toggleTarget(t.id) },
      t.name, dist(t) != null ? h('span.dist', ' ' + dist(t) + 'M') : null))));
    if (!foes.length) parts.push(h('p.small.muted', 'No one on the other side can be hit.'));

    const chosen = foes.filter(t => p.targets[t.id]);
    const previews = [];
    const strikesNow = () => manual
      ? String(p.manual).split(/[^0-9]+/).filter(Boolean).map(Number)
      : p.roll ? p.roll.strikes.map(s => s.value) : [];
    // Updates the damage shown per target without redrawing (keeps typing focus).
    const updatePreviews = () => previews.forEach(({ t, el }) => {
      el.textContent = strikesNow().length ? '−' + result(t) : '';
    });
    if (manual) {
      parts.push(h('div.row.small',
        h('input.amount', { placeholder: 'Strikes: 7, 5', value: p.manual, 'aria-label': 'Strike damage',
          oninput: e => { p.manual = e.target.value; updatePreviews(); } }),
        h('label.inline', 'AP', h('input.tiny-num', { type: 'number', min: 0, value: p.ap, oninput: e => { p.ap = +e.target.value || 0; updatePreviews(); } }))));
    } else {
      if (!p.roll) {
        parts.push(h('div.row',
          h('button.primary', {
            disabled: disabled || !chosen.length,
            onclick: () => { p.roll = Combat.rollAttack(p.ability.attack); refresh(); strikeFx(p); }
          }, chosen.length ? 'Roll ' + p.ability.name : 'Choose a target to roll'),
          h('button.ghost', { onclick: () => { plan = null; refresh(); } }, 'Cancel')));
        return h('div.section.attack.live', parts);
      }
      parts.push(h('div.roll-line',
        p.roll.strikes.map(s => h('span.strike' + (s.failed ? '.miss' : ''), { title: 'Dice: ' + s.dice.join(' + ') + (s.flat ? ' + ' + s.flat : '') },
          String(s.value))),
        h('span.muted.small', p.roll.ignoreArmor ? 'ignores armor' : p.roll.ap ? p.roll.ap + ' AP' : ''),
        h('button.ghost.small', { onclick: () => { p.roll = Combat.rollAttack(p.ability.attack); refresh(); strikeFx(p); } }, 'Reroll')));
    }

    // Each target's defense and the damage it takes.
    const opts = t => ({
      strikes: strikesNow(), ap: manual ? p.ap : p.roll.ap, ignoreArmor: !manual && p.roll.ignoreArmor,
      failedDodge: p.targets[t.id].def === 'failed', block: p.targets[t.id].def === 'block' ? p.targets[t.id].block : 0
    });
    const result = t => p.targets[t.id].def === 'dodged' ? 0 : Combat.computeDamage(t, opts(t)).total;
    parts.push(h('div.targets', chosen.map(t => {
      const st = p.targets[t.id];
      return h('div.target-row',
        h('strong', t.name),
        h('select.small', { onchange: e => { st.def = e.target.value; refresh(); } },
          DEFENSES.map(([v, label]) => h('option', { value: v, selected: st.def === v }, label))),
        st.def === 'block' ? h('input.tiny-num', { type: 'number', min: 0, value: st.block, title: 'Block roll', oninput: e => { st.block = +e.target.value || 0; updatePreviews(); } }) : h('span'),
        (() => { const el = h('span.preview'); previews.push({ t, el }); return el; })());
    })));
    updatePreviews();
    parts.push(h('div.row',
      h('button.primary', {
        disabled: disabled || !chosen.length,
        onclick: () => {
          if (!strikesNow().length) return toast('Type the damage of each strike first.', 'bad');
          const name = p.ability ? c.name + "'s " + p.ability.name : c.name;
          const summary = chosen.map(t => t.name + ' −' + result(t)).join(', ');
          act(() => {
            for (const t of chosen) {
              if (p.targets[t.id].def === 'dodged') Combat.log(cb, t.name + ' dodges ' + name + '.');
              else Combat.applyAttack(cb, t, opts(t), name);
            }
            if (p.ability) Combat.markUsed(cb, c, p.ability);
            plan = null;
          });
          toast(summary);
        }
      }, 'Confirm hit'),
      h('button.ghost', { onclick: () => { plan = null; refresh(); } }, 'Cancel')));
    return h('div.section.attack.live', parts);
  }

  // ---- NPC details ----

  function npcStats(c, npc) {
    const para = c.stacks.Paralysis ? c.stacks.Paralysis.n : 0;
    return h('div.section',
      h('div.stat-chips',
        h('span.chip', 'Armor ', h('strong', String(c.armor || 0))),
        h('span.chip', 'Move ', h('strong', Combat.movement(c) + 'M')),
        GameData.STATS.map(k => {
          const v = (c.stats[k] || 0) - ((k === 'STR' || k === 'AGI') ? para : 0);
          return h('span.chip', { title: GameData.STAT_NAMES[k] }, k + ' ', h('strong' + (para && (k === 'STR' || k === 'AGI') ? '.bad' : ''), String(v)));
        })),
      npc.attributes && npc.attributes !== 'None' ? h('p.small.muted', npc.attributes) : null,
      npc.humanoid ? h('p.small.muted', npc.combatSkill) : null);
  }

  function stacksSection(cb, c, isActive) {
    const types = Object.keys(c.stacks);
    const effects = Combat.stackEffects(c);
    const pick = h('select.small', { 'aria-label': 'Stack type' }, Combat.STACK_TYPES.map(t => h('option', { value: t }, t)));
    return h('div.section',
      h('div.card-head', h('h3', 'Stacks'),
        h('div.row.tight', pick, h('button.small', { onclick: () => act(() => Combat.addStacks(c, pick.value, 1)) }, '+ Add'))),
      isActive && types.length ? h('p.reminder', 'Start of turn: roll recovery for each stack.') : null,
      types.map(type => {
        const s = c.stacks[type];
        return h('div.stack-row',
          h('span' + (Combat.DAMAGING_STACKS.includes(type) ? '.dmg' : ''), type),
          h('button.icon.tiny', { title: 'One fewer', onclick: () => act(() => Combat.addStacks(c, type, -1)) }, '−'),
          h('strong', String(s.n)),
          h('button.icon.tiny', { title: 'One more', onclick: () => act(() => Combat.addStacks(c, type, 1)) }, '+'),
          h('button.ghost.small', {
            title: 'Roll a D4; a 1 never recovers',
            onclick: () => act(() => {
              const r = Combat.recover(c, type);
              const text = c.name + ' ' + type + ': rolled ' + r.roll + ' (needs ' + r.target + '+), ' +
                (r.success ? 'loses ' + r.lost + (r.left ? ', ' + r.left + ' left' : ', cleared') : 'no recovery') + '.';
              Combat.log(cb, text);
              toast(text, r.success ? 'good' : '');
            })
          }, 'Recover (' + s.target + '+)'));
      }),
      effects.map(e => h('p.small' + (e.severe ? '.bad' : ''), e.text,
        e.check ? h('button.ghost.small', {
          onclick: () => {
            const n = c.stacks[e.check].n;
            const d = Combat.die(10);
            toast(c.name + ': Knowledge check needs ' + (d + n) + '+ (D10 ' + d + ' + ' + n + ').');
          }
        }, 'Roll target') : null)));
  }

  function effectsSection(cb, c) {
    const text = h('input', { placeholder: 'Other effect', 'aria-label': 'Effect' });
    const phases = h('input.tiny-num', { type: 'number', min: 1, placeholder: '∞', title: 'Phases (blank = until removed)' });
    const add = () => text.value.trim() && act(() => {
      c.effects.push({ text: text.value.trim(), phases: phases.value ? Math.max(1, parseInt(phases.value, 10)) : null });
    });
    text.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
    return h('div.section',
      h('h3', 'Conditions and effects'),
      h('div.chips',
        Combat.CONDITIONS.map(name => {
          const on = c.conditions.includes(name);
          return h('button.toggle' + (on ? '.on' : ''), {
            onclick: () => act(() => { c.conditions = on ? c.conditions.filter(x => x !== name) : c.conditions.concat(name); })
          }, name);
        }),
        c.effects.map((e, i) => h('span.toggle.on.effect',
          e.text + (e.phases == null ? '' : ' (' + e.phases + ')'),
          h('button.icon.ghost.tiny', { title: 'Remove', onclick: () => act(() => { c.effects.splice(i, 1); }) }, '×')))),
      h('div.row.tight', text, phases, h('button.small', { onclick: add }, 'Add')),
      c.conditions.includes('Disoriented') ? h('p.small.muted', 'Disoriented: the tactics roll drops one rarity; with Basic tactics it can not use abilities.') : null);
  }

  // ---------- Ending combat ----------

  function endScreen(cb) {
    const s = Combat.xpSummary(cb);
    const xp = xpAll ? s.total : s.earned;
    const share = s.players.length ? xp / s.players.length : 0;
    return h('div.section',
      h('h2', 'End combat'),
      h('p', 'Defeated enemies are worth ', h('strong', fmt(s.earned, 2) + ' XP'), ' of ', fmt(s.total, 2), ' in this fight.'),
      h('label.check', h('input', { type: 'checkbox', checked: xpAll, onchange: e => { xpAll = e.target.checked; refresh(); } }),
        'Count every enemy (for example, if the rest fled)'),
      s.players.length ? h('ul', s.players.map(p => h('li', p.name + ': ', h('strong', '+' + fmt(share, 2) + ' XP')))) : h('p.muted', 'No players in this combat.'),
      h('div.row',
        h('button.primary', {
          onclick: () => {
            for (const pc of s.players) {
              const p = S().players.find(x => x.id === pc.refId);
              if (p) p.xp = Math.round(((p.xp || 0) + share) * 100) / 100;
            }
            finishCombat(s.players.length ? 'Combat ended. Each player gains ' + fmt(share, 2) + ' XP.' : 'Combat ended.');
          }
        }, 'Award XP and end'),
        h('button.ghost', { onclick: () => confirm('End combat without giving any XP?') && finishCombat('Combat ended without XP.') }, 'End without XP'),
        h('button.ghost', { onclick: () => { ending = false; refresh(); } }, 'Back to the fight')));
  }

  function finishCombat(message) {
    S().combat = null;
    ending = false; plan = null; report = null; selectedId = null;
    Store.changed();
    toast(message, 'good');
    render(root);
  }

  App.register('combat', render);
})();
