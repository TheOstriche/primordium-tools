// Codex helpers: saving, rarity chips, tappable dice in text, the roll toast, and impact effects.
"use strict";

const $ = s => document.querySelector(s);

// Per-phone settings and state, under codex:* keys (safe to clear).
const store = {
  get(k, d) { try { const v = localStorage.getItem('codex:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('codex:' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
};

// A rarity label with its card pip, e.g. [Q] UNCOMMON.
const PIP = Object.fromEntries(DATA.tables.deck.map(d => [d.rarity, d.pip]));
const chip = r => r ? `<span class="card-chip r-${esc(r)}"><span class="pip">${esc(PIP[r] || '')}</span>${esc(r)}</span>` : '';

/* ---------- dice in text ---------- */
// "2D6+3", "D20", "1D4 + 1D6" anywhere in game text becomes a button that rolls it.
const DICE_RE = /(?<![A-Za-z0-9])(\d*D\d+(?:\s?[+\-]\s?(?:\d*D\d+|\d+(?!D)))*)(?![A-Za-z0-9])/g;
const rollExpr = window.PrimordiumDice.roll;
const linkDice = text => esc(text).replace(DICE_RE, m => `<button class="die" data-roll="${m.replace(/\s/g, '')}">${m}</button>`);

/* ---------- impact effects (../shared/fx.js); an effect starts where the last tap landed ---------- */
const FX = window.PrimordiumFX;
FX.configure({ shake: '#app' });

/* ---------- the roll toast ---------- */
let toastTimer;
// Show a roll and add it to the history. opts.quiet: a crit or fumble gets its sparks but no banner
// (tactics rolls show the rolled rarity instead).
function showRoll(label, res, extra = '', opts = {}) {
  const j = FX.judge(res);
  $('#t-total').className = 'total ' + (j ? j.kind : '');
  FX.tumble($('#t-total'), res.total, res.dice.reduce((a, d) => a + d.f, 0) || 20);
  FX.roll(res, FX.lastTap() || $('#toast'), { quiet: opts.quiet, label });
  $('#t-what').innerHTML = `<b>${esc(label)}</b>${esc(res.parts.join(' '))}${extra ? ' · ' + esc(extra) : ''}`;
  $('#toast').classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('on'), 4200);
  state.history = [{ label, total: res.total, parts: res.parts.join(' '), extra, t: Date.now() }, ...state.history].slice(0, 30);
  store.set('history', state.history);
}
$('#toast').addEventListener('click', () => $('#toast').classList.remove('on'));
// Any dice button in the text: the nearest data-ctx names the roll ("Fire Magic · Fireball · 2D6").
document.addEventListener('click', e => {
  const d = e.target.closest('[data-roll]');
  if (!d) return;
  e.preventDefault();
  const ctx = d.closest('[data-ctx]')?.dataset.ctx || 'Roll';
  showRoll(ctx + ' · ' + d.dataset.roll, rollExpr(d.dataset.roll));
});

/* ---------- creature tactics ---------- */
// The ability a creature uses at a rolled rarity: one at that rarity, or drop a rarity at a time.
// Quick abilities are not rolled.
function resolveAbility(npc, rarity) {
  const idx = RAR.indexOf(rarity);
  for (let i = idx; i >= 0; i--) {
    const a = npc.abilities.find(x => x.rarity === RAR[i] && !/Quick action/i.test(x.text));
    if (a) return { a, dropped: i < idx };
  }
  return { a: null, dropped: false };
}
