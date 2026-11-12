// Codex app: what is on screen (state), moving between screens, and every tap and change.
"use strict";

/* ---------- state and navigation ---------- */
// tab: the bottom tab. stack: pages opened on top of it (Back pops one). q: the search text.
const state = {
  tab: store.get('tab', 'home'), diceView: store.get('diceView', 'dice'), stack: [], q: '',
  history: store.get('history', []), pool: [], mod: 0, roleFilter: 'All', ruleGroup: 'Combat'
};
// Each opened page is also a step in the browser's history, so the phone's own Back button (or swipe) goes
// back a page instead of leaving the app. history.state holds how many pages are open.
const depth = () => (history.state && history.state.codexDepth) || 0;
function go(tab) {
  state.tab = tab; store.set('tab', tab);
  if (depth()) { state.pendingTab = true; history.go(-depth()); return; }   // popstate finishes the move
  state.stack = []; render(); window.scrollTo(0, 0);
}
function open(page) { state.stack.push(page); history.pushState({ codexDepth: state.stack.length }, ''); render(); window.scrollTo(0, 0); }
function back() { if (depth()) history.back(); else { state.stack.pop(); render(); } }
window.addEventListener('popstate', () => {
  state.stack.length = state.pendingTab ? 0 : Math.min(state.stack.length, depth());
  const moved = state.pendingTab; state.pendingTab = false;
  render();
  if (moved) window.scrollTo(0, 0);
});
function clearSearch() { $('#q').value = ''; state.q = ''; $('#qclear').hidden = true; }

function render() {
  document.querySelectorAll('nav.tabs button').forEach(b => b.setAttribute('aria-current', b.dataset.tab === state.tab && !state.q ? 'page' : 'false'));
  const top = state.stack[state.stack.length - 1];
  $('#view').innerHTML = state.q.trim() ? V.search() : top ? V[top.type](top) : V[state.tab]();
  // A rule opened from search: open its section. Anything else opened from search: highlight it.
  if (state.pendingOpen) {
    const d = document.getElementById('sec-' + state.pendingOpen);
    if (d) { d.open = true; setTimeout(() => d.scrollIntoView({ block: 'start' }), 0); }
    state.pendingOpen = null;
  }
  const hl = document.getElementById('hl');
  if (hl) { hl.classList.add('hl'); setTimeout(() => hl.scrollIntoView({ block: 'center' }), 0); }
}

/* ---------- the tactical deck's saved state (rules in ../shared/tactics-deck.js) ---------- */
const DK = window.PrimordiumDeck;
const TAC = Object.assign({ level: { base: 0, path: '', ptier: 0 }, picks: {}, suit: '' }, store.get('tactics', {}));
const deckBuild = () => DK.build(TAC.level, TAC.picks, TAC.suit);
let DECK = DK.fit(store.get('deck2', null), deckBuild());
const saveTac = () => { store.set('tactics', TAC); DECK = DK.fit(DECK, deckBuild()); store.set('deck2', DECK); };

/* ---------- taps ---------- */
document.querySelectorAll('nav.tabs button').forEach(b => b.addEventListener('click', () => { clearSearch(); go(b.dataset.tab); }));
$('#q').addEventListener('input', e => { state.q = e.target.value; $('#qclear').hidden = !state.q; render(); });
$('#qclear').addEventListener('click', e => { e.preventDefault(); clearSearch(); render(); $('#q').focus(); });

// Each entry: [selector, handler(element, event)]. The first match wins.
const TAPS = [
  ['[data-open]', o => {
    const p = JSON.parse(o.dataset.open);
    if (state.q) clearSearch();
    if (p.type === 'rule') { V.rule(p); render(); } else open(p);
  }],
  ['[data-back]', back],
  ['[data-goto]', g => go(g.dataset.goto)],
  ['[data-path]', b => { const top = state.stack[state.stack.length - 1]; top.path = b.dataset.path === 'Base' ? null : b.dataset.path; top.hl = null; render(); }],
  ['[data-role]', b => { state.roleFilter = b.dataset.role; render(); }],
  ['[data-rg]', b => { state.ruleGroup = b.dataset.rg; render(); }],
  ['[data-tg]', b => { const top = state.stack[state.stack.length - 1]; top.g = +b.dataset.tg; top.hl = null; render(); }],
  ['[data-tacrow]', b => { store.set('tacRow', b.dataset.tacrow); render(); }],
  ['#tacGo', rollHomeTactics],
  ['[data-tactic]', b => rollCreatureTactics(DATA.npcs.find(x => x.id === b.dataset.tactic))],
  ['[data-fx]', (b, e) => FX.settingsClick(e, $('#fxBox'))],
  ['[data-deck]', b => DK.tap(DECK, deckBuild(), b, () => { store.set('deck2', DECK); render(); })],
  ['[data-dview]', b => { state.diceView = b.dataset.dview; store.set('diceView', state.diceView); render(); }],
  ['[data-add]', b => { state.pool.push(+b.dataset.add); render(); }],
  ['[data-mod]', b => { state.mod += +b.dataset.mod; render(); }],
  ['#poolRoll', () => { const ex = window.PrimordiumDice.poolExpr(state.pool, state.mod); if (ex) { showRoll('Tray · ' + ex, rollExpr(ex)); render(); } }],
  ['#poolClear', () => { state.pool = []; state.mod = 0; render(); }],
  ['[data-quick]', b => { quickRoll(b.dataset.quick); render(); }]
];
$('#view').addEventListener('click', e => {
  for (const [sel, fn] of TAPS) {
    const el = e.target.closest(sel);
    if (el) return fn(el, e);
  }
});

// Home: roll the D20 at the chosen tactics level; the reached card lifts on the ladder.
function rollHomeTactics() {
  const row = store.get('tacRow', 'Good');
  const res = rollExpr('D20'), r = Core.rarityForRoll(row, res.total);
  showRoll(`Tactics · ${row}`, res, r, { quiet: true });
  $('#ladder').outerHTML = ladderHTML(row, r).replace(/<div class="ladder-names">[\s\S]*$/, '');
  $('#tacOut').innerHTML = `<div class="verdict"><span class="big">${res.total}</span>${chip(r)}<p class="note" style="margin:6px 0 0">If nothing at ${r} is ready, drop one rarity at a time.</p></div>`;
  FX.tumble($('#tacOut .big'), res.total, 20, FX.judge(res)?.kind);
  FX.card(r, $('#ladder .c.hit') || $('#ladder'));
}

// A creature's turn: roll its tactics (twice for a Boss) and show the ability it uses.
function rollCreatureTactics(n) {
  let out = '', top = 0;
  const rolls = [];
  for (let i = 0; i < n.turns; i++) {
    const res = rollExpr('D20'), r = Core.rarityForRoll(n.tactics, res.total), { a, dropped } = resolveAbility(n, r);
    if (i === 0) showRoll(`${n.name} · tactics`, res, a ? a.name : r, { quiet: true });
    top = Math.max(top, RAR.indexOf(a ? a.rarity : r));
    rolls.push(res);
    out += `<div class="verdict" data-ctx="${esc(n.name + (a ? ' · ' + a.name : ''))}">
      <div class="verdict-head">${n.turns > 1 ? `<span class="tag">Turn ${i + 1}</span>` : ''}<span class="big">${res.total}</span>${chip(r)}</div>
      ${a ? `<p style="margin:8px 0 0"><b>${esc(a.name)}</b>${dropped ? ` <span class="note">(dropped to ${a.rarity})</span>` : ''}<br>${linkDice(a.text)}</p>`
          : `<p class="muted" style="margin:8px 0 0">Humanoid: use its combat skill at ${r} or below.</p>`}</div>`;
  }
  $('#npcOut').innerHTML = out;
  document.querySelectorAll('#npcOut .big').forEach((el, i) => FX.tumble(el, rolls[i].total, 20, FX.judge(rolls[i])?.kind));
  FX.card(RAR[top], $('#npcOut'));
}

// The table rolls on the Dice tab. The modifier box adds to Contest and Speed.
function quickRoll(kind) {
  const m = +($('#qmod').value || 0);
  store.set('qmod', m);
  const D10 = window.PrimordiumDice.withMod('D10', m);
  if (kind === 'contest') showRoll('Contest', rollExpr(D10), 'ties go to the defender, dodges tie to the attacker');
  if (kind === 'speed') { const r = rollExpr(D10); showRoll('Speed roll', r, `move ${Math.max(2, r.total)}M`); }
  if (kind === 'rec') { const r = rollExpr('D4'); showRoll('Recovery', r, r.total === 1 ? 'never recovers' : 'recovers if it meets the target (4, then 3, then 2)'); }
  if (kind === 'ood') {
    const r = rollExpr('D10'), best = r.total >= 9 ? 'Legendary' : r.total >= 7 ? 'Epic' : r.total >= 4 ? 'Rare' : '';
    showRoll('Out-of-combat ability', r, best ? 'succeeds up to ' + best : 'Rare and above fail');
  }
}

/* ---------- typing and choosing ---------- */
$('#view').addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'party') {   // XP each for this many players
    const n = Math.max(1, +t.value || 1);
    store.set('party', n);
    const npc = DATA.npcs.find(x => x.id === state.stack[state.stack.length - 1].id);
    $('#xpEach').textContent = Math.round(npc.xp / n);
  }
  if (t.id === 'xpRole' || t.id === 'xpLvl') {   // the Enemy XP calculator on the Tables screen
    const lv = Math.max(1, +$('#xpLvl').value || 1);
    $('#xpOut').textContent = Math.round(Core.xpFor($('#xpRole').value, lv));
    $('#lvTo').textContent = lv;
    $('#lvNeed').textContent = Core.xpToNextLevel(lv);
  }
});
$('#view').addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'xpRole') t.dispatchEvent(new Event('input', { bubbles: true }));
  if (t.id === 'tacLevel') { const [base, path, ptier] = JSON.parse(t.value); TAC.level = { base, path, ptier }; saveTac(); render(); }
  if (t.id === 'tacSuit') { TAC.suit = t.value; saveTac(); render(); }
  if (t.dataset.promo) { TAC.picks[t.dataset.promo] = t.value; saveTac(); render(); }
});

// A reload keeps the browser's history but not the open pages: start again from the tab.
if (depth()) history.replaceState(null, '');
render();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
