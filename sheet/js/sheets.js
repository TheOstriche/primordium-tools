// Character sheet bottom sheets: adding an effect, equipping or editing an item.
"use strict";

const sheet = $('#sheet');
function openSheet(html) {
  sheet.innerHTML = `<div class="sheetbody">${html}</div>`;
  if (!sheet.open) sheet.showModal();
}
const cancelBtn = '<button class="btn ghost" data-act="closesheet">Cancel</button>';
const statOptions = () => STATS.map(s => `<option value="${s}">${STATN[s]}</option>`).join('');

/* ---------- adding an effect: kind, then which one ---------- */
function augStep(step, cat) {
  if (step === 1) {
    const kinds = [['stack', 'Stack'], ['resource', 'Resource'], ['condition', 'Condition'], ['stat', 'Stat effect']];
    return openSheet(`<h2>Add an effect</h2><div class="choices">${kinds.map(([k, l]) => `<button class="choice" data-augcat="${k}">${l}</button>`).join('')}</div>${cancelBtn}`);
  }
  if (cat === 'stat') return openSheet(`<h2>Stat effect</h2><form id="statForm">
    <label class="field"><span>Stat</span><select name="stat">${statOptions()}</select></label>
    <label class="field"><span>Amount (use − for a penalty)</span><input name="amount" type="number" inputmode="numeric" value="1"></label>
    <label class="field"><span>Source</span><input name="source" placeholder="For example Courage or Rally"></label>
    <button class="btn">Add effect</button></form>${cancelBtn}`);
  if (cat === 'weakened') return openSheet(`<h2>Weakened</h2><form id="weakForm">
    <label class="field"><span>Stat reduced</span><select name="stat">${statOptions()}</select></label>
    <label class="field"><span>Reduced by</span><input name="amount" type="number" inputmode="numeric" value="1" min="1"></label>
    <button class="btn">Add condition</button></form>${cancelBtn}`);
  const list = { stack: Core.STACKS, resource: LISTS.resources, condition: LISTS.conditions }[cat];
  return openSheet(`<h2>Choose a ${cat}</h2><div class="choices">${list.map(t => `<button class="choice" data-augtype="${esc(t)}" data-cat="${cat}">${esc(t)}</button>`).join('')}</div>${cancelBtn}`);
}

// Add an effect; stacks and resources of the same type add up.
function addAug(rec) {
  const same = current.aug.find(a => a.cat === rec.cat && a.type === rec.type && (rec.cat === 'stack' || rec.cat === 'resource'));
  let r = same;
  if (same) same.count = n(same.count) + n(rec.count);
  else { r = { id: uid(), count: 1, ...rec }; current.aug.push(r); }
  if (r.cat === 'stack') { r.need = startNeed(current); capStack(r); }
  sheet.close();
  const T = totals(current), lines = [`${rec.type} added`];
  if (rec.cat === 'stat') lines.push(`${n(rec.amount) > 0 ? '+' : ''}${n(rec.amount)} ${STATN[rec.stat]} until combat ends`);
  if (rec.type === 'Paralysis') lines.push('−1 Strength and Agility per stack');
  if (rec.type === 'Weakened') lines.push(`−${Math.abs(n(rec.amount))} ${STATN[rec.stat]}`);
  toast([...lines, ...T.notes.slice(-1)]);
  rerender();
}
// Unyielding Flesh: damaging stacks never go above 5.
function capStack(a) {
  if (Core.DAMAGING_STACKS.includes(a.type) && has(current, 'Unyielding Flesh') && n(a.count) > 5) {
    a.count = 5;
    toast(['Unyielding Flesh', `${a.type} can not exceed 5 stacks`]);
  }
}

/* ---------- equipping or editing an item ---------- */
function itemSheet(id) {
  const it = current.items.find(i => i.id === id), k = it.kind || '';
  const opt = (v, cur) => `<option ${String(v) === String(cur ?? '') ? 'selected' : ''}>${esc(v)}</option>`;
  const input = (label, name, value, extra = '') => `<label class="field"><span>${label}</span><input name="${name}" ${extra} value="${esc(value ?? '')}"></label>`;
  const num = 'type="number" inputmode="numeric"';
  const armorFields = `<div class="row2">
      <label class="field"><span>Slot</span><select name="slot">${LISTS.armorSlots.map(v => opt(v, it.slot)).join('')}</select></label>
      <label class="field"><span>Weight</span><select name="weight">${['light', 'heavy'].map(v => opt(v, it.weight || 'heavy')).join('')}</select></label></div>`;
  const weaponFields = `<label class="field"><span>Weapon type</span><select name="wtype">${LISTS.weapons.map(v => opt(v, it.wtype)).join('')}</select></label>`;
  const common = `<div class="row2">
      <label class="field"><span>Material (sets tier)</span><select name="material" id="matPick"><option value="">Choose</option>
        ${LISTS.materials.map(([m, t]) => `<option value="${m}" data-tier="${t}" ${m === it.material ? 'selected' : ''}>${m} (Tier ${t})</option>`).join('')}</select></label>
      ${input('Tier', 'tier', it.tier ?? 0, num + ' id="tierBox"')}</div>
    <div class="row2">${k === 'armor' ? input('Armor value', 'armor', it.armor, num + ' placeholder="Shield: leave blank"') : input('AP', 'ap', it.ap, num)}${input('Condition', 'cond', it.cond, num)}</div>
    ${input('Enchantments or special effects', 'special', it.special || '', 'placeholder="For example Flame Brand, rank 1"')}
    <p class="note">${k === 'weapon' ? 'A weapon adds its tier to one strike per attack.' : 'Shields add their tier to block rolls. Worn armor adds into your armor total.'}</p>`;
  openSheet(`<h2>${it.equipped || it.kind ? 'Edit' : 'Equip'} ${esc(it.name)}</h2><form id="equipForm" data-id="${id}">
    ${input('Name', 'name', it.name)}
    <label class="field"><span>Kind</span><select name="kind" id="kindPick"><option value="">Choose</option>
      ${['armor', 'weapon'].map(v => `<option value="${v}" ${v === k ? 'selected' : ''}>${v === 'armor' ? 'Armor or shield' : 'Weapon'}</option>`).join('')}</select></label>
    ${k === 'armor' ? armorFields : ''}${k === 'weapon' ? weaponFields : ''}${k ? common : ''}
    ${input('Description', 'desc', it.desc || '')}
    <button class="btn">${it.equipped ? 'Save' : 'Equip'}</button></form>${cancelBtn}`);
}
// An item in the pack: name, description, and how many.
function packSheet(id) {
  const it = current.items.find(i => i.id === id);
  openSheet(`<h2>Edit ${esc(it.name)}</h2><form id="packForm" data-id="${it.id}">
    <label class="field"><span>Name</span><input name="name" value="${esc(it.name)}"></label>
    <label class="field"><span>Description</span><input name="desc" value="${esc(it.desc || '')}"></label>
    <label class="field"><span>Quantity</span><input name="qty" type="number" inputmode="numeric" value="${n(it.qty) || 1}"></label>
    <button class="btn">Save</button></form>${cancelBtn}`);
}
