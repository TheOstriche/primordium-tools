// Character sheet helpers: toasts, form fields bound to the open character, the dice tray's log, and impact effects.
"use strict";

const $ = (s, el = document) => el.querySelector(s);

/* ---------- toasts ---------- */
// lines[0] is the headline; the rest are details. At most two toasts show at once.
function toast(lines) {
  const box = $('#toasts');
  while (box.children.length >= 2) box.firstElementChild.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.innerHTML = lines.map((l, i) => i === 0 ? `<b>${esc(l)}</b>` : `<span>${esc(l)}</span>`).join('');
  box.appendChild(el);
  setTimeout(() => el.classList.add('out'), 3800);
  setTimeout(() => el.remove(), 4300);
}

/* ---------- fields: each input carries its path in data-p; typing saves it (app.js) ---------- */
const field = (label, path, o = {}) => `<label class="field"><span>${label}</span><input ${o.num ? 'type="number" inputmode="numeric"' : 'type="text"'}
  data-p="${path}" value="${esc(get(current, path))}" ${o.ph ? `placeholder="${o.ph}"` : ''}></label>`;
// opts: values, or [value, label] pairs. blankLabel adds an empty first choice.
function select(label, path, opts, blankLabel) {
  const now = String(get(current, path) ?? '');
  return `<label class="field"><span>${label}</span><select data-p="${path}">
    ${blankLabel !== undefined ? `<option value="">${blankLabel}</option>` : ''}
    ${opts.map(o => { const [v, t] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${now === String(v) ? 'selected' : ''}>${esc(t)}</option>`; }).join('')}
  </select></label>`;
}
// A read-only number with a label, e.g. Armor 6.
const stat = (label, val, sub = '', boosted = false) => `<div class="calc ${boosted ? 'boosted' : ''}"><span>${label}</span><b>${esc(val)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
// An ability or perk that opens to show its text.
const detail = i => `<details class="item"><summary><b>${esc(i.name)}</b><span>${i.kind === 'ability' ? esc(i.type + ' · ' + i.rarity) : esc(i.tierLabel || 'Perk')}</span></summary>
  <p><i>${esc(i.desc)}</i></p><p>${esc(i.usage)}</p></details>`;

/* ---------- impact effects (../shared/fx.js); an effect starts where the last tap landed ---------- */
const FX = window.PrimordiumFX, DICE = window.PrimordiumDice;
FX.configure({ shake: '#view' });
// After HP changes: damage, healing, or going down.
function hpFx(before) {
  const after = n(current.hpCur), max = Math.max(1, totals(current).maxhp), el = $('.hero .hpnum') || $('.hero');
  if (after < before) return before > 0 && after <= 0 ? FX.hp('down') : FX.hp('damage', el, (before - after) / max);
  if (after > before) FX.hp('heal', el, (after - before) / max);
}

/* ---------- the dice tray ---------- */
// Record a roll, show it, and land its effect (crits and natural 1s).
function logRoll(label, r, extra = '') {
  tray.rolls = [{ label, total: r.total, parts: r.parts.join(' '), extra }, ...tray.rolls].slice(0, 5);
  toast([`${label}: ${r.total}`, r.parts.join(' ') + (extra ? ' · ' + extra : '')]);
  const from = FX.lastTap();
  charView(current.id);
  const j = FX.judge(r);
  FX.tumble($('.rolls output'), r.total, r.dice.reduce((a, d) => a + d.f, 0) || 20, j && j.kind);
  FX.roll(r, from, { label });
}
// The quick rolls, using the character's live stats.
function quickRoll(kind, statKey) {
  const L = totals(current).live, D10 = m => DICE.roll(DICE.withMod('D10', m));
  if (kind === 'init') return logRoll('Initiative', D10(L.PER));
  if (kind === 'speed') { const r = D10(L.SPD); return logRoll('Speed roll', r, `move ${Math.max(2, r.total)}M`); }
  if (kind === 'stat') return logRoll(`${STATN[statKey]} contest`, D10(L[statKey]));
  if (kind === 'ooc') {
    const r = DICE.roll('D10'), best = r.total >= 9 ? 'Legendary' : r.total >= 7 ? 'Epic' : r.total >= 4 ? 'Rare' : '';
    return logRoll('Out of combat', r, best ? 'succeeds up to ' + best : 'Rare and above fail');
  }
}
