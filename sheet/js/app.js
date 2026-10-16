// Character sheet app: actions (skills, race, recovery, rests) and every tap, typed value, and form.
"use strict";

/* ---------- actions ---------- */
// Raise or lower a skill's base or path tier, and say what it added or removed.
function stepSkill(k, kind, by) {
  const s = current.skills[k] ??= { base: 0, path: '', ptier: 0 };
  const T0 = totals(current), deck0 = deckBuild(current).counts;
  let head, items;
  if (kind === 'base') {
    const nv = Math.min(4, Math.max(0, n(s.base) + by));
    if (nv === n(s.base)) return;
    if (by < 0 && n(s.ptier) > 0) return toast([`Lower ${k}'s path first`, 'Path tiers depend on Base Tier 4.']);
    items = tierItems(current, k, 'base', by > 0 ? nv : n(s.base));
    s.base = nv;
    if (nv < 4) s.path = '';
    head = by > 0 ? `${k} Base Tier ${nv}` : `${k} lowered to Base Tier ${nv}`;
  } else {
    const nv = Math.min(4, Math.max(0, n(s.ptier) + by));
    if (nv === n(s.ptier)) return;
    items = tierItems(current, k, 'path', by > 0 ? nv : n(s.ptier));
    s.ptier = nv;
    head = by > 0 ? `${k}: ${s.path} Tier ${nv}` : `${k} lowered to ${s.path} Tier ${nv}`;
  }
  const lines = [head, ...items.map(i => (by > 0 ? 'Added ' : 'Removed ') + itemLine(i))];
  const T = totals(current), b = deckBuild(current), deck1 = b.counts;
  if (T.maxhp !== T0.maxhp) {
    current.hpCur = by > 0 ? n(current.hpCur) + (T.maxhp - T0.maxhp) : Math.min(n(current.hpCur), T.maxhp);
    lines.push(`Max HP is now ${T.maxhp}`);
  }
  const changed = RAR.filter(r => deck1[r] !== deck0[r]).map(r => `${r} ${deck0[r]} → ${deck1[r]}`);
  if (changed.length) {
    lines.push(`Deck: ${changed.join(', ')}`);
    if (by > 0 && b.steps.length) lines.push('Choose which cards are promoted under Card assignment on the Sheet tab');
  }
  if (T.earned - T.spent < 0) lines.push(`Over budget by ${Core.plural(T.spent - T.earned, 'skill point')}`);
  const from = FX.lastTap();
  toast(lines.length > 1 ? lines : [head, 'No new abilities or perks at this tier.']);
  rerender();
  if (by > 0) FX.sparkle(from, '#eab14c', 22);
}

// Choosing a race fills in its starting HP and stats (asking first if stats were already set).
function applyRace(r) {
  const race = D.races[r];
  if (!race) return;
  if (STATS.some(s => n(current.stats[s]) !== 0) && !confirm(`Replace base stats and HP with ${r} starting values?`)) return;
  current.hpBase = race.hp;
  STATS.forEach((s, i) => current.stats[s] = race.stats[i]);
  current.hpCur = totals(current).maxhp;
  toast([`${r} applied`, `HP ${race.hp}, stats ${STATS.map((s, i) => `${s} ${race.stats[i] >= 0 ? '+' : ''}${race.stats[i]}`).join(', ')}`,
    ...(race.armor ? [`+${race.armor} natural armor`] : []), ...(race.choice ? ['Choose your +1 bonuses below'] : []),
    ...(race.freeMagicPoint ? ['+1 skill point for a magic skill'] : [])]);
}

// A recovery roll for one stack: a D4 against its target; a 1 never recovers. The target drops by 1 after each roll.
function recover(id) {
  const a = current.aug.find(x => x.id === id);
  const need = n(a.need) || startNeed(current), roll = DICE.roll('D4').total, before = n(a.count);
  const ok = roll !== 1 && roll >= need, removed = ok ? recoveryLoss(current, a.type, before) : 0;
  a.count = before - removed;
  a.need = Math.max(Core.RECOVERY_FLOOR, need - 1);
  const lines = [`${a.type} recovery: rolled ${roll}, needed ${need}+`];
  lines.push(ok ? `Removed ${Core.plural(removed, a.type + ' stack')} (${before} → ${a.count})` : roll === 1 ? 'A 1 never recovers.' : 'Failed.');
  lines.push(a.count > 0 ? `Next roll needs ${a.need}+` : `${a.type} cleared`);
  if (!a.count) current.aug = current.aug.filter(x => x !== a);
  const from = FX.lastTap();
  toast(lines);
  rerender();
  if (ok) FX.sparkle(from, '#6fd39a', 14 + removed * 3); else FX.fizzle(from);
}

// Every quick stat change shares one "Quick adjust" effect per stat; it is gone when it is back to 0.
function adjustStat(key, by) {
  let r = current.aug.find(a => a.cat === 'stat' && a.stat === key && a.source === 'Quick adjust');
  if (!r) { r = { id: uid(), cat: 'stat', stat: key, amount: 0, source: 'Quick adjust' }; current.aug.push(r); }
  r.amount = n(r.amount) + by;
  r.type = `${STATN[key]} ${r.amount > 0 ? '+' : ''}${r.amount}`;
  if (!r.amount) current.aug = current.aug.filter(a => a !== r);
}

const ACTS = {
  editlist() { editList = !editList; listView(); },
  mode() { current.mode = current.mode === 'combat' ? 'standard' : 'combat'; rerender(); FX.mood(current.mode === 'combat' ? 'combat' : 'calm'); },
  addaug() { augStep(1); },
  closesheet() { sheet.close(); },
  trroll() { const ex = DICE.poolExpr(tray.pool, tray.mod); if (ex) logRoll('Roll', DICE.roll(ex)); },
  trclear() { tray.pool = []; tray.mod = 0; charView(current.id); },
  addother() { current.abilities.push({ name: '', skill: '' }); rerender(); },
  endcombat() {
    FX.mood('calm');
    current.aug = current.aug.filter(a => a.cat === 'stack');   // stacks stay until treated
    current.death = 0;
    DK.act(deckState(current), deckBuild(current), 'combat');
    toast(['Combat ended', 'Resources, conditions, and temporary stat effects cleared. Stacks remain until treated.', 'Once-per-combat card abilities are ready again.']);
    rerender();
  },
  breather() {   // once per day: 25% of max HP, stacks cleared, cards back from the discard
    const T = totals(current), gain = Math.floor(T.maxhp / 4);
    current.hpCur = Math.min(T.maxhp, n(current.hpCur) + gain);
    current.aug = current.aug.filter(a => a.cat !== 'stack');
    current.breather = true;
    const b = deckBuild(current), ds = deckState(current, b);
    DK.act(ds, b, 'breather');
    toast(['Breather taken', `+${gain} HP, stacks cleared.`, ds.pick ? 'Choose the cards to keep under Cards.' : 'The top 8 cards of your discard pile went back into your deck.']);
    rerender();
    FX.mood('breather');
  },
  rest() {   // everything restored, deck reshuffled, back to standard mode
    Object.assign(current, { hpCur: totals(current).maxhp, hpTemp: 0, aug: [], death: 0, breather: false, mode: 'standard' });
    DK.act(deckState(current), deckBuild(current), 'rest');
    toast(['Full rest taken', 'HP restored, effects cleared, deck reshuffled, breather ready.']);
    rerender();
    FX.mood('rest');
  },
  delete() {
    if (!confirm(`Delete ${current.name || 'this character'}? This can not be undone unless you have a backup.`)) return;
    delete db[current.id];
    saveNow();
    listView();
  }
};

/* ---------- taps: [data attribute, handler(dataset, button)]; the first match wins ---------- */
const TAPS = [
  ['deck', (d, b) => DK.tap(deckState(current), deckBuild(current), b, rerender)],
  ['add', d => { tray.pool.push(Number(d.add)); charView(current.id); }],
  ['mod', d => { tray.mod += Number(d.mod); charView(current.id); }],
  ['qroll', d => quickRoll(d.qroll, d.stat)],
  ['open', d => charView(d.open, 'overview')],
  ['delchar', d => {
    const c = db[d.delchar];
    if (confirm(`Delete ${c.name || 'this character'}? This can not be undone unless you have a backup.`)) { delete db[d.delchar]; saveNow(); toast([`Deleted ${c.name || 'character'}`]); }
    listView();
  }],
  ['tab', d => charView(current.id, d.tab)],
  ['sk', d => stepSkill(d.sk, d.kind, Number(d.by))],
  ['s', d => { set(current, d.s, n(get(current, d.s)) + Number(d.by)); rerender(); }],
  ['hp', d => {   // −1 / +1 HP; healing stops at maximum HP (extra HP goes in Temporary HP)
    const before = n(current.hpCur), by = Number(d.hp);
    current.hpCur = by > 0 ? Math.min(Math.max(before, totals(current).maxhp), before + by) : before + by;
    rerender();
    hpFx(before);
  }],
  ['tmp', d => { adjustStat(d.tmp, Number(d.by)); rerender(); }],
  ['recover', d => recover(d.recover)],
  ['aug', d => {
    const a = current.aug.find(x => x.id === d.aug), by = Number(d.by);
    a.count = Math.max(0, n(a.count) + by);
    if (a.cat === 'stack' && by > 0) { a.need = startNeed(current); capStack(a); }
    if (!a.count) current.aug = current.aug.filter(x => x !== a);
    rerender();
  }],
  ['rmaug', d => { current.aug = current.aug.filter(x => x.id !== d.rmaug); rerender(); }],
  ['death', d => {   // tap a pip to set the clock there; tap the last lit pip to step back
    const was = current.death, i = Number(d.death);
    current.death = current.death >= i ? i - 1 : i;
    rerender();
    if (current.death > was) FX.beat($(`[data-death="${current.death}"]`));
  }],
  ['del', d => { const [k, i] = d.del.split('.'); current[k].splice(Number(i), 1); rerender(); }],
  ['equip', d => {
    const it = current.items.find(i => i.id === d.equip);
    if (!it.equipped) return itemSheet(it.id);
    it.equipped = false;
    toast([`Unequipped ${it.name}`, 'Moved to your pack']);
    rerender();
  }],
  ['edititem', d => { const it = current.items.find(i => i.id === d.edititem); it.equipped ? itemSheet(it.id) : packSheet(it.id); }],
  ['rmitem', d => { const it = current.items.find(i => i.id === d.rmitem); if (confirm(`Remove ${it.name}?`)) { current.items = current.items.filter(i => i !== it); rerender(); } }],
  ['augcat', d => augStep(2, d.augcat)],
  ['augtype', d => d.augtype === 'Weakened' ? augStep(2, 'weakened') : addAug({ cat: d.cat, type: d.augtype, count: 1 })],
  ['act', d => ACTS[d.act] && ACTS[d.act]()]
];
document.addEventListener('click', e => {
  const b = e.target.closest('#view button, #sheet button, #tabs button');
  if (!b) return;
  for (const [key, fn] of TAPS) if (b.dataset[key] !== undefined) return fn(b.dataset, b);
});

/* ---------- typing and choosing ---------- */
// Fields whose change alters other numbers on screen (so the tab is redrawn when they are chosen or left).
const REDRAW = ['level', 'hpBase', 'hpOther', 'armorOther', 'hpCur', 'hpTemp', 'suit'];
document.addEventListener('input', e => {
  const t = e.target, p = t.dataset.p;
  if (!p || !current || t.closest('#sheet')) return;
  set(current, p, t.type === 'number' ? (t.value === '' ? '' : Number(t.value)) : t.value);
  if (p === 'race') { applyRace(t.value); return rerender(); }
  save();
  if (p.endsWith('.path')) {
    if (t.value) toast([`${p.split('.')[1]}: ${t.value} chosen`, 'Raise its path tier to unlock the path\'s abilities.']);
    return charView(current.id);
  }
  if (t.tagName === 'SELECT' && (REDRAW.includes(p) || p.startsWith('trin.'))) charView(current.id);
});
// Typed HP gets the same effects as the buttons, once the box is left.
let hpTyped = null;
document.addEventListener('focusin', e => { if (e.target.dataset && e.target.dataset.p === 'hpCur') hpTyped = n(current && current.hpCur); });
document.addEventListener('change', e => {
  const t = e.target, id = t.id;
  if (t.dataset.p === 'hpCur' && hpTyped != null) { const before = hpTyped; hpTyped = null; setTimeout(() => hpFx(before)); }
  if (id === 'traitPick' && t.value) {
    const tr = D.traits.find(x => x.name === t.value);
    current.traits.push({ ...tr });
    toast([`Trait added: ${tr.name}`, tr.effect, ...(PrimordiumCharacter.traitFx(tr).length ? ['Applied to your stats'] : [])]);
    return rerender();
  }
  if (id === 'abilityPick') { current.abilityPick = t.value; return rerender(); }
  if (t.dataset.promo) { (current.deckPicks ??= {})[t.dataset.promo] = t.value; return rerender(); }
  if (id === 'kindPick') { const it = current.items.find(i => i.id === $('#equipForm').dataset.id); it.kind = t.value; return itemSheet(it.id); }
  if (id === 'matPick') { const o = t.selectedOptions[0]; if (o?.dataset.tier !== undefined) $('#tierBox').value = o.dataset.tier; return; }
  if (t.dataset.p && REDRAW.includes(t.dataset.p)) charView(current.id);
});

/* ---------- forms ---------- */
const FORMS = {
  newForm() { const c = blank($('#newName').value.trim()); db[c.id] = c; saveNow(); charView(c.id, 'sheet'); },
  itemForm() {
    const name = $('#itemName').value.trim();
    current.items.push({ id: uid(), name, desc: $('#itemDesc').value.trim(), qty: Math.max(1, n($('#itemQty').value)), equipped: false });
    toast([`Added to pack: ${name}`]);
    rerender();
  },
  statForm: fd => addAug({ cat: 'stat', type: `${STATN[fd.stat]} ${n(fd.amount) > 0 ? '+' : ''}${n(fd.amount)}`, stat: fd.stat, amount: n(fd.amount), source: fd.source }),
  weakForm: fd => addAug({ cat: 'condition', type: 'Weakened', stat: fd.stat, amount: Math.abs(n(fd.amount)) }),
  equipForm(fd, f) {
    const it = current.items.find(i => i.id === f.dataset.id), wasEq = it.equipped, num = v => v === '' || v == null ? '' : n(v);
    Object.assign(it, { name: fd.name || it.name, kind: fd.kind, slot: fd.slot, weight: fd.weight, wtype: fd.wtype, material: fd.material,
      tier: n(fd.tier), armor: num(fd.armor), ap: num(fd.ap), cond: num(fd.cond), special: fd.special, desc: fd.desc });
    if (!fd.kind) { toast(['Choose armor or weapon to equip it']); return itemSheet(it.id); }
    it.equipped = true;
    sheet.close();
    toast([wasEq ? `Saved ${it.name}` : `Equipped ${it.name}`, it.kind === 'armor' && it.slot !== 'Shield' ? `Armor is now ${totals(current).armor}` : `Tier ${it.tier}`]);
    rerender();
  },
  packForm(fd, f) {
    const it = current.items.find(i => i.id === f.dataset.id);
    Object.assign(it, { name: fd.name || it.name, desc: fd.desc, qty: Math.max(1, n(fd.qty)) });
    sheet.close();
    rerender();
  }
};
document.addEventListener('submit', e => {
  const f = e.target;
  if (!FORMS[f.id]) return;
  e.preventDefault();
  FORMS[f.id](Object.fromEntries(new FormData(f)), f);
});

/* ---------- the ⋯ menu: backups and effects ---------- */
$('#backBtn').onclick = () => { saveNow(); listView(); };
// Effects settings: markup and saving in ../shared/fx.js, the same rows as the Codex.
$('#menuBtn').onclick = () => { $('#fxPrefs').innerHTML = FX.settingsHTML(); $('#menu').showModal(); };
$('#fxPrefs').onclick = e => FX.settingsClick(e, $('#fxPrefs'));
$('#closeMenu').onclick = () => $('#menu').close();
$('#exportBtn').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(db, null, 1)], { type: 'application/json' }));
  a.download = `primordium-characters-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$('#importFile').onchange = async e => {
  try {
    const data = JSON.parse(await e.target.files[0].text());
    const chars = Object.entries(data || {}).filter(([, c]) => c && typeof c === 'object' && typeof c.name === 'string');
    if (!chars.length) throw new Error('no characters');
    chars.forEach(([id, c]) => db[id] = c);
    saveNow();
    $('#menu').close();
    listView();
    toast([`Imported ${Core.plural(chars.length, 'character')}`]);
  } catch (err) {
    toast(['That file is not a Primordium backup', 'Choose a file made with Export all characters.']);
  }
  e.target.value = '';   // so the same file can be chosen again
};

document.addEventListener('toggle', e => { const g = e.target.dataset?.group; if (g) e.target.open ? openGroups.add(g) : openGroups.delete(g); }, true);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
listView();
