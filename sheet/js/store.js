// Character sheet: saving, new characters, upgrading characters saved by older versions, and what is on screen.
// Every character on this phone lives in localStorage under primordium.characters.v1 as { id: character }.
// The GM tool reads the same shape from an exported backup (gm/js/encounter.js).
// Load order: store.js, rules.js, ui.js, views.js, sheets.js, shop.js, app.js.
"use strict";

const Core = window.PrimordiumCore;   // ../shared/core.js
const { STATS, STAT_NAMES: STATN, RARITIES: RAR, esc } = Core;
const D = window.PRIMORDIUM_DATA, LISTS = window.SHEET_LISTS;
const SK = Object.fromEntries(D.skills.map(s => [s.name, s]));
const n = v => Number(v) || 0;
const uid = () => Math.random().toString(36).slice(2, 9);

/* ---------- saving ---------- */
const KEY = 'primordium.characters.v1', DAMAGED_KEY = 'primordium.characters.damaged';
// Ids end up inside HTML attributes, and a backup file can come from anywhere, so only plain ids are kept.
const safeId = v => (typeof v === 'string' && /^[\w-]{1,40}$/.test(v) ? v : uid());
// Characters from saved text or a backup file: { id: character }, keeping only real characters, each under a plain id.
function adopt(data) {
  const out = {};
  for (const c of Object.values(data && typeof data === 'object' ? data : {})) {
    if (!c || typeof c !== 'object' || typeof c.name !== 'string') continue;
    c.id = safeId(c.id);
    for (const list of [c.items, c.aug]) if (Array.isArray(list)) list.forEach(x => { if (x && typeof x === 'object') x.id = safeId(x.id); });
    out[c.id] = c;
  }
  return out;
}
let saveProblem = '';   // shown once the page has drawn (app.js)
function load() {
  let text = null;
  try { text = localStorage.getItem(KEY); } catch (e) { saveProblem = 'This browser is blocking saved data, so characters will not be kept.'; }
  if (!text) return {};
  try { return adopt(JSON.parse(text)); } catch (e) {
    // Saved characters that can not be read: keep the text aside before anything writes over it.
    try { localStorage.setItem(DAMAGED_KEY, text); } catch (e2) { /* nothing more to do */ }
    saveProblem = 'Your saved characters could not be read. A copy was kept; import a backup to restore them.';
    return {};
  }
}
let db = load();
let saveTimer, saveFailed = false;
// Typing saves a moment later, so a burst of edits is one write.
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 250); }
function saveNow() {
  clearTimeout(saveTimer); saveTimer = null;
  try { localStorage.setItem(KEY, JSON.stringify(db)); saveFailed = false; } catch (e) {
    if (!saveFailed) toast(['Changes are not being saved', 'Storage on this phone is full or blocked. Export a backup from the ⋯ menu.']);
    saveFailed = true;
  }
}
// The phone may close the app without warning: write any waiting change as soon as the page is hidden.
const flushSave = () => { if (saveTimer) saveNow(); };
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });
window.addEventListener('pagehide', flushSave);

/* ---------- what is on screen ---------- */
let current = null;              // the open character (null on the list)
let tab = 'overview';            // its open tab
let editList = false;            // the character list shows Delete buttons
const openGroups = new Set();    // skill groups left open on the Skills tab
const tray = { pool: [], mod: 0, rolls: [] };   // the dice tray (kept until the page closes)

/* ---------- characters ---------- */
// A character's fields. aug: active effects (stacks, resources, conditions, stat effects).
// deck and deckPicks: the tactical deck's state and promotion choices (../shared/tactics-deck.js).
function blank(name) {
  const c = {
    id: Date.now().toString(36), name, race: '', level: 1, xp: 0, marks: 0, stats: {},
    hpBase: 40, hpOther: 0, hpCur: 40, hpTemp: 0, armorOther: 0, trin: { dmg: '', a: '', b: '' },
    mode: 'standard', aug: [], death: 0, breather: false, suit: '',
    items: [], abilities: [], traits: [], resist: '', notes: '', skills: {}
  };
  STATS.forEach(s => c.stats[s] = 0);
  return c;
}

// Characters saved by earlier versions: fill in missing fields and move old layouts to the current one.
function upgrade(c) {
  if (!c.stats || typeof c.stats !== 'object') c.stats = {};
  if (c.items && !Array.isArray(c.items)) c.items = [];
  if (c.aug && !Array.isArray(c.aug)) c.aug = [];
  c.trin ??= { dmg: '', a: '', b: '' };
  c.armorOther ??= n(c.armor);
  c.skills ??= {};
  c.traits ??= [];
  c.abilities ??= [];
  c.mode ??= 'standard';
  if (!c.items) {   // version 1 kept equipment, weapons, and a free-text inventory separately
    c.items = [];
    (c.equip || []).forEach((e, i) => e.item && c.items.push({ id: uid(), name: e.item, desc: '', qty: 1, equipped: true, kind: 'armor',
      slot: LISTS.armorSlots[Math.min(i, 3)], weight: 'heavy', material: '', tier: n(e.tier), armor: n(e.armor), cond: e.cond, special: '' }));
    (c.weapons || []).forEach(w => w.item && c.items.push({ id: uid(), name: w.item, desc: '', qty: 1, equipped: true, kind: 'weapon',
      wtype: 'Other', material: '', tier: n(w.tier), ap: n(w.ap), cond: w.cond, special: '' }));
    if (c.inventory) c.items.push({ id: uid(), name: 'Pack (from earlier notes)', desc: c.inventory, qty: 1, equipped: false });
  }
  if (!c.aug) {   // version 1 kept stacks, resources, and conditions as separate maps
    c.aug = [];
    for (const [k, v] of Object.entries(c.stacks || {})) if (n(v)) c.aug.push({ id: uid(), cat: 'stack', type: k, count: n(v) });
    for (const [k, v] of Object.entries(c.resources || {})) if (n(v)) c.aug.push({ id: uid(), cat: 'resource', type: k, count: n(v) });
    for (const [k, v] of Object.entries(c.conditions || {})) if (v) c.aug.push({ id: uid(), cat: 'condition', type: k, count: 1 });
  }
  for (const k of Object.keys(c.skills)) if (!SK[k]) delete c.skills[k];   // a skill that no longer exists
  return c;
}

// Read and write a field by its path, e.g. "stats.STR" or "trin.a". Inputs carry it as data-p.
const get = (o, p) => p.split('.').reduce((a, k) => a?.[k], o);
function set(o, p, v) { const k = p.split('.'), last = k.pop(); k.reduce((a, x) => a[x] ??= {}, o)[last] = v; }
