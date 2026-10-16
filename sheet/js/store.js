// Character sheet: saving, new characters, upgrading characters saved by older versions, and what is on screen.
// Every character on this phone lives in localStorage under primordium.characters.v1 as { id: character }.
// The GM tool reads the same shape from an exported backup (gm/js/encounter.js).
// Load order: store.js, rules.js, ui.js, views.js, sheets.js, app.js.
"use strict";

const Core = window.PrimordiumCore;   // ../shared/core.js
const { STATS, STAT_NAMES: STATN, RARITIES: RAR, esc } = Core;
const D = window.PRIMORDIUM_DATA, LISTS = window.SHEET_LISTS;
const SK = Object.fromEntries(D.skills.map(s => [s.name, s]));
const n = v => Number(v) || 0;
const uid = () => Math.random().toString(36).slice(2, 9);

/* ---------- saving ---------- */
const KEY = 'primordium.characters.v1';
function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
let db = load();
let saveTimer;
// Typing saves a moment later, so a burst of edits is one write.
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 250); }
function saveNow() { clearTimeout(saveTimer); try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* storage full or blocked */ } }

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
