// Character sheet rules: what skills grant, a character's totals, stacks and recovery, and the tactical deck.
// Shared rules come from ../shared/ (core.js, character-rules.js, tactics-deck.js); this file adds the
// sheet's live combat layer (temporary stat effects, encumbrance, warnings).
"use strict";

const granted = PrimordiumCharacter.granted;   // every ability and perk a character's skill tiers grant
const has = (c, name) => granted(c).some(i => i.name === name);
// The abilities and perks gained at one tier (Base Tier 1 also brings Tier 0).
function tierItems(c, skill, kind, t) {
  const d = SK[skill], s = c.skills[skill] || {};
  return kind === 'base' ? [...(t === 1 ? (d.base[0] || []) : []), ...(d.base[t] || [])] : ((d.paths[s.path] || {})[t] || []);
}

/* ---------- totals ---------- */
// Everything the screens show that is worked out from the sheet: stats (st: outside combat, live: with this
// fight's effects), HP, armor, skill points, carrying, and warnings (notes) for the overview.
function totals(c) {
  const { st, hpSkill, natural, worn, maxhp, race } = PrimordiumCharacter.core(c);
  const earned = n(c.level) + 1 + Math.floor(n(c.level) / 5) + (race.freeMagicPoint ? 1 : 0);
  const spent = Object.values(c.skills).reduce((a, s) => a + n(s.base) + n(s.ptier), 0);
  const lifter = has(c, 'Heavy Lifter');   // doubles Strength's share of the carry limit, +10
  const carryLimit = 10 + st.STR * (lifter ? 2 : 1) + (lifter ? 10 : 0);
  const carried = c.items.filter(i => !i.equipped).reduce((a, i) => a + Math.max(1, n(i.qty)), 0);

  // The live combat layer: temporary stat effects, paralysis, and weakened.
  const live = { ...st }, notes = [];
  for (const a of c.aug) {
    if (a.cat === 'stat') live[a.stat] += n(a.amount);
    if (a.cat === 'stack' && a.type === 'Paralysis') { live.STR -= n(a.count); live.AGI -= n(a.count); }
    if (a.cat === 'condition' && a.type === 'Weakened' && a.stat) live[a.stat] -= Math.abs(n(a.amount));
  }
  const liveCarry = carryLimit + (live.STR - st.STR) * (lifter ? 2 : 1);
  if (carried > liveCarry) {
    live.SPD -= 2;
    notes.push(carried >= 2 * carryLimit ? 'Encumbered: −2 Speed, no running or rolled movement' : 'Encumbered: −2 Speed');
  }
  const L = n(c.level);
  for (const a of c.aug) {
    const k = n(a.count);
    if (a.cat === 'stack' && a.type === 'Frozen') {
      if (k > L) notes.push('Frozen solid: no actions until you recover');
      else if (k >= Core.chilledAt(L)) notes.push('Chilled: no Defensive abilities; Quick abilities only as Standard on your turn');
    }
    if (a.cat === 'stack' && a.type === 'Paralysis' && k > L) notes.push('Paralyzed: no actions until you recover');
    if (a.cat === 'stack' && ['Calm', 'Anger', 'Fear'].includes(a.type) && k > L / 2) {
      notes.push(`${a.type}: roll Knowledge against 1D10 + ${k} or be ${({ Calm: 'calmed', Anger: 'enraged', Fear: 'terrified' })[a.type]}`);
    }
    if (a.cat === 'condition' && a.type === 'Disoriented') notes.push('Disoriented: abilities cost a card one rarity higher');
    if (a.cat === 'condition' && a.type === 'Silenced') notes.push('Silenced: no magic abilities');
    if (a.cat === 'condition' && a.type === 'Immobilized') notes.push('Immobilized: no movement');
  }
  return { liveCarry, st, live, maxhp, hpSkill, natural, worn, armor: natural + worn + n(c.armorOther), earned, spent, carryLimit, carried, notes };
}

/* ---------- stacks ---------- */
// The D4 a stack needs to recover right after it is added (Trained Resilience lowers it).
const startNeed = c => has(c, 'Trained Resilience') ? Core.RECOVERY_START - 1 : Core.RECOVERY_START;
function stackLine(c, a) {
  const need = n(a.need) || startNeed(c), parts = [`Recovers on ${need}+`];
  if (Core.DAMAGING_STACKS.includes(a.type)) parts.push(`deals ${n(a.count)}D4${has(c, 'Hardy') ? ` − ${n(a.count)} (Hardy, min 1 each)` : ''} at end of phase`);
  if (a.type === 'Paralysis') parts.push(`−${n(a.count)} Strength and Agility`);
  return parts.join(' · ');
}
// Stacks a successful recovery removes; Shrug It Off removes one more damaging stack.
const recoveryLoss = (c, type, count) =>
  Math.min(count, Core.recoveryLoss(type, count) + (Core.DAMAGING_STACKS.includes(type) && has(c, 'Shrug It Off') ? 1 : 0));

/* ---------- the tactical deck (rules shared with the Codex: ../shared/tactics-deck.js) ---------- */
const DK = window.PrimordiumDeck;
const tacLevel = c => { const s = c.skills.Tactics || {}; return { base: n(s.base), path: s.path || '', ptier: n(s.ptier) }; };
const deckBuild = c => DK.build(tacLevel(c), c.deckPicks || {}, c.suit || '');
// The saved hand, or a fresh deck if this character's cards changed.
const deckState = (c, b = deckBuild(c)) => (c.deck = DK.fit(c.deck, b));
function ridersText(c, b = deckBuild(c)) {
  if (b.f.fullDeck) return 'All four suits (double when every card shares a suit)';
  return b.f.suitMastery ? (c.suit || 'Choose a suit above') : 'None yet (Tactics Base Tier 2)';
}

/* ---------- describing what a tier adds ---------- */
const fxText = i => (i.effects || []).map(f =>
  f.stat ? `${f.add > 0 ? '+' : ''}${f.add} ${STATN[f.stat]}` : f.maxhp ? `+${f.maxhp} maximum HP` : f.armor ? `+${f.armor} natural armor`
    : f.maxhpPerStat ? `+${f.per} HP per ${STATN[f.maxhpPerStat]}` : '').filter(Boolean).join(', ');
const itemLine = i => `${i.kind === 'ability' ? 'Ability' : 'Perk'}: ${i.name}${fxText(i) ? ' (' + fxText(i) + ')' : ''}`;
