// Character sheet screens: the character list, and a character's five tabs. Each view returns HTML;
// charView() puts the open tab on the page. Overview keeps one order in both modes so nothing jumps:
// HP, stats, warnings, dice, cards (combat only), effects, then equipment (standard) or abilities (combat).
"use strict";

/* ---------- the character list ---------- */
function listView() {
  current = null;
  $('#tabs').hidden = true; $('#backBtn').hidden = true; $('#title').textContent = 'Primordium';
  const chars = Object.values(db).map(upgrade).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  const row = c => `<div class="charline">
    ${editList ? `<button class="del" data-delchar="${c.id}" aria-label="Delete ${esc(c.name)}">Delete</button>` : ''}
    <button class="charrow" data-open="${c.id}"><b>${esc(c.name || 'Unnamed')}</b><span>Level ${esc(c.level)} ${esc(c.race || '')}</span><span class="hp">${esc(c.hpCur)} / ${totals(c).maxhp} HP</span></button>
  </div>`;
  $('#view').innerHTML = `<section class="list">
    ${chars.length ? `<div class="listbar"><h2>Characters</h2><button class="link" data-act="editlist">${editList ? 'Done' : 'Edit'}</button></div>${chars.map(row).join('')}`
      : `<p class="empty">No characters yet. Create one to start tracking HP, stacks, gear, and skills at the table.</p>`}
    <form id="newForm" class="newchar"><input id="newName" placeholder="Character name" required><button class="btn">Create character</button></form>
  </section>`;
}

/* ---------- a character ---------- */
const TABS = [['overview', 'Overview'], ['sheet', 'Sheet'], ['inventory', 'Inventory'], ['abilities', 'Abilities'], ['skills', 'Skills']];
// Draw a character's tab, keeping the scroll position when it is the same tab being redrawn.
function charView(id, t = tab) {
  const y = current && current.id === id && t === tab ? window.scrollY : 0;
  current = upgrade(db[id]);
  tab = t;
  $('#backBtn').hidden = false;
  $('#tabs').hidden = false;
  $('#tabs').innerHTML = TABS.map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? 'on' : ''}">${l}</button>`).join('');
  $('#view').innerHTML = views[tab](totals(current));
  $('#title').textContent = current.name || 'Unnamed';
  window.scrollTo(0, y);
}
const rerender = () => { save(); charView(current.id); };

const views = {
  overview(T) {
    const combat = current.mode === 'combat';
    const parts = [modeBar(combat), heroHTML(T, combat), statsHTML(T, combat), notesHTML(T), diceHTML(T)];
    if (combat) parts.push(cardsHTML());
    parts.push(effectsHTML(combat));
    if (combat) parts.push(abilitiesHTML(), perksHTML(), restActionsHTML());
    else parts.push(`<section><h2>Equipped</h2>${equippedList()}</section>`);
    return parts.join('');
  },
  sheet: sheetTab,
  inventory: inventoryTab,
  abilities: abilitiesTab,
  skills: skillsTab
};

/* ---------- overview parts ---------- */
const modeBar = combat => `<div class="modebar"><span>${combat ? 'Combat' : 'Standard'}</span>
  <button class="switch ${combat ? 'on' : ''}" data-act="mode" role="switch" aria-checked="${combat}" aria-label="Combat mode"><i></i></button></div>`;

// HP, temporary HP, the death clock, armor, movement, initiative. In combat HP can be changed here;
// outside it the same rows show read-only, so the stats below never move.
function heroHTML(T, combat) {
  const S = T.live, pct = Math.max(0, Math.min(100, Math.round(100 * n(current.hpCur) / Math.max(1, T.maxhp))));
  const hp = combat
    ? `<div class="hpline"><button class="big" data-hp="-1" aria-label="Lose 1 HP">−</button>
        <div class="hpnum"><input type="number" inputmode="numeric" data-p="hpCur" value="${esc(current.hpCur)}" aria-label="Current HP"><small>of ${T.maxhp} HP</small></div>
        <button class="big" data-hp="1" aria-label="Gain 1 HP">+</button></div>`
    : `<div class="hpnum still"><b>${esc(current.hpCur)}</b><small>of ${T.maxhp} HP${n(current.hpTemp) ? ` · ${n(current.hpTemp)} temporary` : ''}</small></div>`;
  const temp = combat ? field('Temporary HP', 'hpTemp', { num: 1 }) : `<div class="field"><span>Temporary HP</span><output class="still">${n(current.hpTemp)}</output></div>`;
  const clock = [1, 2, 3].map(i => `<button class="pip ${current.death >= i ? 'on' : ''}" ${combat ? `data-death="${i}"` : 'disabled'} aria-label="Death clock phase ${i}">${i}</button>`).join('');
  return `<section class="hero">${hp}
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="row2">${temp}<div class="clockwrap"><span>Death clock</span><div class="clock">${clock}</div></div></div>
    <div class="row3">${stat('Armor', T.armor)}${stat('Movement', Core.movement(S.SPD) + 'M')}${stat('Initiative', 'D10 ' + (S.PER >= 0 ? '+ ' : '- ') + Math.abs(S.PER))}</div>
  </section>`;
}

// The six stats. In combat each has −/+ for this fight only; outside it the row keeps its space, hidden.
function statsHTML(T, combat) {
  const S = T.live;
  const tile = s => {
    const cls = S[s] !== T.st[s] ? 'temp' : T.st[s] !== n(current.stats[s]) ? 'boosted' : '';
    return `<div class="stat ${cls}"><span>${STATN[s]}</span><b>${S[s]}</b>
      <div class="adj${combat ? '' : ' ghost'}" ${combat ? '' : 'aria-hidden="true"'}>
        <button data-tmp="${s}" data-by="-1" aria-label="Temporarily lower ${STATN[s]}">−</button><small>${S[s] !== T.st[s] ? 'temp' : ''}</small>
        <button data-tmp="${s}" data-by="1" aria-label="Temporarily raise ${STATN[s]}">+</button></div></div>`;
  };
  return `<section><h2>Stats</h2><div class="statgrid">${STATS.map(tile).join('')}</div>
    <p class="note">${combat ? 'Changes here are temporary and clear when combat ends.' : 'Turn on Combat to change stats for a fight.'}</p></section>`;
}

const notesHTML = T => T.notes.length ? `<section class="alerts">${T.notes.map(x => `<p>${esc(x)}</p>`).join('')}</section>` : '';

// The dice tray (same buttons as the Codex: ../shared/dice.js) and the quick rolls with this character's stats.
function diceHTML(T) {
  const S = T.live, sg = v => (v >= 0 ? '+ ' : '- ') + Math.abs(v), ex = DICE.poolExpr(tray.pool, tray.mod);
  return `<section class="dice"><h2>Dice</h2>
    <div class="tray compact">${DICE.FACES.map(f => DICE.trayButton(f, tray.pool.filter(x => x === f).length)).join('')}</div>
    <div class="pool"><code>${ex ? esc(ex) : 'Tap dice to build a roll'}</code>
      <div class="mini"><button data-mod="-1" aria-label="Minus one">−1</button><button data-mod="1" aria-label="Plus one">+1</button></div></div>
    <div class="row2"><button class="btn" data-act="trroll" ${ex ? '' : 'disabled'}>Roll${ex ? ' ' + esc(ex) : ''}</button><button class="btn ghost" data-act="trclear">Clear</button></div>
    <div class="quickrolls">
      <button class="tog" data-qroll="init">Initiative D10 ${sg(S.PER)}</button><button class="tog" data-qroll="speed">Speed roll D10 ${sg(S.SPD)}</button>
      <button class="tog" data-qroll="ooc">Out of combat D10</button></div>
    <p class="note">Contest: D10 + stat. Ties go to the defender.</p>
    <div class="contest">${STATS.map(k => `<button class="tog" data-qroll="stat" data-stat="${k}">${k} ${sg(S[k])}</button>`).join('')}</div>
    ${tray.rolls.length ? `<ol class="rolls">${tray.rolls.map(r => `<li><span><b>${esc(r.label)}</b><small>${esc(r.parts)}${r.extra ? ' · ' + esc(r.extra) : ''}</small></span><output>${r.total}</output></li>`).join('')}</ol>` : ''}
  </section>`;
}

// The tactical deck, built from this character's Tactics (../shared/tactics-deck.js).
function cardsHTML() {
  const b = deckBuild(current);
  return `<section class="deck"><div class="listbar"><h2>Cards</h2><span class="note">Tactics ${esc(DK.levelLabel(tacLevel(current)))}</span></div>
    <div class="decklist">${RAR.filter(r => b.counts[r]).map(r => `<span class="r-${r}"><b>${b.counts[r]}</b> ${r}</span>`).join('')}</div>
    ${DK.render(deckState(current, b), b)}</section>`;
}

const CAT_NAMES = { stack: 'Stack', resource: 'Resource', condition: 'Condition', stat: 'Stat effect' };
function effectsHTML(combat) {
  const counted = a => a.cat === 'stack' || a.cat === 'resource';
  const row = a => {
    const what = CAT_NAMES[a.cat] + (a.cat === 'stat' ? ` · ${n(a.amount) > 0 ? '+' : ''}${n(a.amount)} ${STATN[a.stat]}` : '')
      + (a.cat === 'condition' && a.stat ? ` · −${Math.abs(n(a.amount))} ${STATN[a.stat]}` : '') + (a.source ? ' · ' + a.source : '');
    const controls = combat
      ? (a.cat === 'stack' ? `<button class="btn small rec-btn" data-recover="${a.id}" aria-label="Recovery roll for ${esc(a.type)}">Recover</button>` : '')
        + (counted(a) ? `<div class="mini"><button data-aug="${a.id}" data-by="-1" aria-label="Lower ${esc(a.type)}">−</button><output>${n(a.count)}</output><button data-aug="${a.id}" data-by="1" aria-label="Raise ${esc(a.type)}">+</button></div>` : '')
        + `<button class="x" data-rmaug="${a.id}" aria-label="Remove ${esc(a.type)}">×</button>`
      : (counted(a) ? `<output>${n(a.count)}</output>` : '');
    return `<div class="rec ${a.cat === 'stack' && combat ? 'stackrec' : ''}"><div><b>${esc(a.type)}</b><small>${esc(what)}</small>
      ${a.cat === 'stack' ? `<small class="need">${stackLine(current, a)}</small>` : ''}</div>${controls}</div>`;
  };
  return `<section><div class="listbar"><h2>Effects</h2>${combat ? '<button class="btn small" data-act="addaug">+ Add</button>' : ''}</div>
    ${current.aug.length ? current.aug.map(row).join('') : `<p class="note">${combat ? 'Add stacks, resources, conditions, and temporary stat effects with + Add.' : 'No active effects.'}</p>`}
  </section>`;
}

function abilitiesHTML() {
  const ab = granted(current).filter(i => i.kind === 'ability').sort((a, b) => RAR.indexOf(a.rarity) - RAR.indexOf(b.rarity) || a.name.localeCompare(b.name));
  if (!ab.length) return `<section><h2>Abilities</h2><p class="note">Train skills to gain abilities.</p></section>`;
  const sel = ab.find(a => a.skill + '|' + a.name === current.abilityPick);
  const groups = RAR.map(r => { const l = ab.filter(a => a.rarity === r);
    return l.length ? `<optgroup label="${r}">${l.map(a => `<option value="${esc(a.skill + '|' + a.name)}" ${sel === a ? 'selected' : ''}>${esc(a.name)} · ${esc(a.rarity)}</option>`).join('')}</optgroup>` : ''; }).join('');
  return `<section><h2>Abilities</h2>
    <label class="field"><span>Choose an ability</span><select id="abilityPick"><option value="">Select to see its details</option>${groups}</select></label>
    ${sel ? `<div class="card"><b>${esc(sel.name)}</b><small>${esc(sel.skill)} · ${esc(sel.type)} · ${esc(sel.rarity)}</small><p><i>${esc(sel.desc)}</i></p><p>${esc(sel.usage)}</p></div>` : ''}
  </section>`;
}
function perksHTML() {
  const pk = granted(current).filter(i => i.kind === 'perk');
  return `<section><details class="perks"><summary><h2>Perks (${pk.length})</h2></summary>${pk.map(detail).join('') || '<p class="note">No perks yet.</p>'}</details></section>`;
}
const restActionsHTML = () => `<section class="actions">
  <button class="btn ghost" data-act="endcombat">End combat</button>
  <button class="btn ghost" data-act="breather" ${current.breather ? 'disabled' : ''}>${current.breather ? 'Breather used today' : 'Take a breather'}</button>
  <button class="btn" data-act="rest">Full rest</button>
  <p class="note">End combat clears resources, conditions, and temporary stat effects. A breather restores 25% of max HP and clears stacks once per day. A full rest restores everything.</p>
</section>`;

function equippedList() {
  const eq = current.items.filter(i => i.equipped);
  if (!eq.length) return '<p class="note">Nothing equipped. Equip items on the Inventory tab.</p>';
  return eq.map(i => `<div class="eq"><b>${esc(i.name)}</b><span>${i.kind === 'weapon'
    ? esc(i.wtype || 'Weapon') + ` · Tier ${n(i.tier)}` + (n(i.ap) ? ` · ${n(i.ap)}AP` : '')
    : esc(i.slot || 'Armor') + (i.slot === 'Shield' ? ` · Tier ${n(i.tier)} (adds to blocks)` : ` · ${n(i.armor)} armor`)}${i.special ? ' · ' + esc(i.special) : ''}</span></div>`).join('');
}

/* ---------- Sheet tab ---------- */
function sheetTab(T) {
  const race = D.races[current.race], b = deckBuild(current);
  const traitCost = current.traits.reduce((a, t) => a + n(t.cost), 0);
  const trinBonus = [['SPD', 'Speed'], ['PER', 'Perception'], ['SPE', 'Speech'], ['HP', '+5 HP']];
  const baseStat = s => `<div class="stat ${T.st[s] !== n(current.stats[s]) ? 'boosted' : ''}"><span>${STATN[s]}</span><b>${T.st[s]}</b>
    <div class="adj"><button data-s="stats.${s}" data-by="-1" aria-label="Lower base ${STATN[s]}">−</button><small>base ${n(current.stats[s])}</small><button data-s="stats.${s}" data-by="1" aria-label="Raise base ${STATN[s]}">+</button></div></div>`;
  return `
  <section><h2>Character</h2>
    <div class="row2">${field('Name', 'name')}${select('Race', 'race', Object.keys(D.races), 'Choose a race')}</div>
    <div class="row3">${field('Level', 'level', { num: 1 })}${field('XP', 'xp', { num: 1 })}${stat('XP for next level', Core.xpToNextLevel(current.level))}</div>
    ${field('Marks', 'marks', { num: 1 })}
    ${race ? `<div class="racebox"><b>${esc(current.race)}</b><ul>${race.traits.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
    ${current.race === 'Trin' ? `<div class="row3">${select('+1 to', 'trin.dmg', [['STR', 'Strength'], ['AGI', 'Agility'], ['KNO', 'Knowledge']], 'Choose')}${select('+1 to', 'trin.a', trinBonus, 'Choose')}${select('+1 to', 'trin.b', trinBonus, 'Choose')}</div>` : ''}
  </section>
  <section><h2>Base stats</h2><div class="statgrid">${STATS.map(baseStat).join('')}</div>
    <p class="note">Large numbers include race choices, traits, and skills. Damage modifier per die: +½ per D4 or D6, +1 per D8 to D12, +2 per D20.</p></section>
  <section><h2>Health and armor</h2>
    <div class="row3">${field('Base HP (race)', 'hpBase', { num: 1 })}${stat('Skills and traits', '+' + T.hpSkill)}${field('Other HP', 'hpOther', { num: 1 })}</div>
    <div class="row3">${stat('Max HP', T.maxhp, 'adds 25 every 5th level')}${stat('Natural armor', T.natural)}${field('Other armor', 'armorOther', { num: 1 })}</div></section>
  <section><h2>Card assignment</h2><p class="note">Tactics ${esc(DK.levelLabel(tacLevel(current)))}. Counts include your Tactics promotions.</p>
    ${RAR.filter(r => b.counts[r]).map(r => `<div class="maprow r-${r}"><b>${b.counts[r]}</b><span>${r}</span><small>${esc(b.mapping[r])}</small></div>`).join('')}
    ${b.f.wild ? `<p class="note">Jokers are wild: each counts as any rarity up to ${b.f.wildCap}.</p>` : ''}
    ${b.steps.map(st => `<label class="field"><span>${esc(st.perk)}: ${esc(st.label)}</span><select data-promo="${esc(st.key)}">${st.options.map(o => `<option value="${esc(o.v)}" ${o.v === st.value ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select></label>`).join('')}
    ${b.needsSuit ? select('Suit Mastery suit', 'suit', ['Spades', 'Hearts', 'Diamonds', 'Clubs'], 'Choose a suit') : ''}
    <p class="note">Suit riders: ${esc(ridersText(current, b))}</p></section>
  <section><h2>Background traits</h2><p class="note">Chosen at creation and never changed. Total cost: <b class="${traitCost > 2 ? 'warn' : ''}">${traitCost}</b> of 2.</p>
    ${current.traits.map((t, i) => `<div class="rec"><div><b>${esc(t.name)}</b><small>Cost ${esc(t.cost)} · ${esc(t.effect)}</small></div><button class="x" data-del="traits.${i}" aria-label="Remove ${esc(t.name)}">×</button></div>`).join('')}
    <label class="field"><span>Add a trait</span><select id="traitPick"><option value="">Choose a trait</option>
      ${['Physical', 'Mental', 'Major'].map(c => `<optgroup label="${c}">${D.traits.filter(t => t.category === c).map(t => `<option value="${esc(t.name)}">${esc(t.name)} (${t.cost})</option>`).join('')}</optgroup>`).join('')}
    </select></label></section>
  <section><h2>Resistances</h2>${(race?.resist || []).map(r => `<p class="note">${esc(r)} (racial)</p>`).join('')}<textarea data-p="resist" rows="2">${esc(current.resist)}</textarea></section>
  <section><h2>Notes</h2><textarea data-p="notes" rows="6">${esc(current.notes)}</textarea></section>
  <section><button class="btn danger" data-act="delete">Delete this character</button></section>`;
}

/* ---------- Inventory tab ---------- */
function inventoryTab(T) {
  const pack = current.items.filter(i => !i.equipped), eq = current.items.filter(i => i.equipped);
  const info = i => {
    if (!i.equipped) return esc(i.desc || '');
    const base = i.kind === 'weapon'
      ? `${esc(i.wtype)} · ${esc(i.material || '')} · Tier ${n(i.tier)}${n(i.ap) ? ' · ' + n(i.ap) + 'AP' : ''}`
      : `${esc(i.slot)} · ${esc(i.weight || '')} ${esc(i.material || '')} · Tier ${n(i.tier)}${i.slot === 'Shield' ? '' : ' · ' + n(i.armor) + ' armor'}`;
    return base + (i.cond !== '' && i.cond != null ? ` · Condition ${esc(i.cond)}` : '') + (i.special ? ' · ' + esc(i.special) : '');
  };
  const card = i => `<div class="rec item ${i.equipped ? 'equipped' : ''}"><div><b>${esc(i.name)}${n(i.qty) > 1 ? ' ×' + n(i.qty) : ''}</b><small>${info(i)}</small></div>
    <div class="itembtns"><button class="link" data-equip="${i.id}">${i.equipped ? 'Unequip' : 'Equip'}</button><button class="link" data-edititem="${i.id}">Edit</button>
      <button class="x" data-rmitem="${i.id}" aria-label="Remove ${esc(i.name)}">×</button></div></div>`;
  return `
  <section><div class="listbar"><h2>Equipped</h2></div>${eq.length ? eq.map(card).join('') : '<p class="note">Equip an item from your pack below.</p>'}
    <div class="row2">${stat('Worn armor', T.worn)}${stat('Total armor', T.armor)}</div></section>
  <section><div class="listbar"><h2>Pack</h2><span class="${T.carried > T.liveCarry ? 'warn' : 'note'}">${T.carried} of ${T.liveCarry} items</span></div>
    ${pack.length ? pack.map(card).join('') : '<p class="note">Your pack is empty.</p>'}
    <form id="itemForm" class="additem"><input id="itemName" placeholder="Item name" required><input id="itemDesc" placeholder="Description (optional)">
      <div class="row2"><input id="itemQty" type="number" inputmode="numeric" min="1" value="1" aria-label="Quantity"><button class="btn">Add item</button></div></form>
    <p class="note">Carrying more than your limit applies −2 Speed automatically.</p></section>`;
}

/* ---------- Abilities tab ---------- */
function abilitiesTab() {
  const g = granted(current), ab = g.filter(i => i.kind === 'ability'), pk = g.filter(i => i.kind === 'perk');
  const bySkill = list => { const m = {}; list.forEach(i => (m[i.skill] ??= []).push(i)); return Object.entries(m).map(([k, l]) => `<h3>${esc(k)}</h3>${l.map(detail).join('')}`).join(''); };
  return `
  <section><h2>Abilities from skills</h2>${ab.length ? bySkill(ab) : '<p class="empty">Train a skill on the Skills tab and its abilities appear here.</p>'}</section>
  <section><h2>Perks from skills</h2>${pk.length ? bySkill(pk) : '<p class="empty">Perks from your skills appear here.</p>'}</section>
  <section><h2>Other abilities and perks</h2><p class="note">For anything not from a skill: items, enchantments, or GM rewards.</p>
    ${current.abilities.map((a, i) => `<div class="gear">${field('Name', `abilities.${i}.name`)}${field('Effect', `abilities.${i}.skill`)}<button class="link" data-del="abilities.${i}">Remove</button></div>`).join('')}
    <button class="btn ghost" data-act="addother">Add an entry</button></section>`;
}

/* ---------- Skills tab ---------- */
function skillsTab(T) {
  const left = T.earned - T.spent;
  const stepper = (name, kind, label, value) => `<div class="step"><span>${label}</span>
    <button data-sk="${esc(name)}" data-kind="${kind}" data-by="-1" aria-label="Lower ${esc(label)}">−</button><output>${value}</output>
    <button data-sk="${esc(name)}" data-kind="${kind}" data-by="1" aria-label="Raise ${esc(label)}">+</button></div>`;
  const skill = d => {
    const s = current.skills[d.name] || {}, total = n(s.base) + n(s.ptier);
    return `<div class="skill"><div class="skhead"><b>${esc(d.name)}</b><small>${total ? `${total} of 8 tiers` : ''}</small></div>
      ${stepper(d.name, 'base', 'Base tier', n(s.base))}
      ${n(s.base) >= 4 ? select('Path', 'skills.' + d.name + '.path', Object.keys(d.paths), 'Choose a path') + (s.path ? stepper(d.name, 'path', s.path + ' tier', n(s.ptier)) : '') : ''}
    </div>`;
  };
  const group = g => {
    const list = D.skills.filter(s => s.group === g);
    const tiers = list.reduce((a, d) => a + n(current.skills[d.name]?.base) + n(current.skills[d.name]?.ptier), 0);
    return `<section><details class="group" data-group="${g}" ${openGroups.has(g) ? 'open' : ''}>
      <summary><h2>${g} skills</h2><span>${tiers ? Core.plural(tiers, 'tier') : list.length + ' skills'}</span></summary>${list.map(skill).join('')}</details></section>`;
  };
  return `
  <section class="points"><div class="row3">${stat('Points earned', T.earned)}${stat('Spent', T.spent)}<div class="calc"><span>Remaining</span><b class="${left < 0 ? 'warn' : ''}">${left}</b></div></div>
    <p class="note">2 at level 1, +1 each level, +1 bonus at every 5th level${D.races[current.race]?.freeMagicPoint ? ', +1 Avichai magic point' : ''}.</p></section>
  ${['Physical', 'Mental', 'Attribute', 'Other'].map(group).join('')}`;
}
