// Codex screens. Each V.<name>(page) returns the HTML for one screen; app.js puts it on the page.
// Tabs: home, skills, beasts, rules, dice. Pages opened from a list: skill, npc, races, race, traits, rule.
"use strict";

const V = {};
const backBtn = () => `<button class="back" data-back>‹ Back</button>`;
const sec = title => `<h3 class="sec">${title}</h3>`;
// "1–20", "7–12", "20", or "–" for a rarity a tactics level can not roll.
const rangeText = (m, r) => !m[r] ? '–' : m[r][0] === 1 && m[r][1] === 20 ? '1–20' : m[r][0] === m[r][1] ? String(m[r][0]) : m[r][0] + '–' + m[r][1];

/* ---------- search results ---------- */
V.search = () => {
  const res = search(state.q);
  return `<p class="eyebrow">${res.length} found</p>
  <div class="list">${res.map(it => `
    <button class="row" data-open='${esc(JSON.stringify(it.page))}'>
      <span class="lead">${esc(it.kind[0])}</span>
      <div><span class="t">${esc(it.title)}</span><span class="s">${esc(it.kind)} · ${esc(it.sub)}</span></div>
      ${it.rarity ? chip(it.rarity) : `<span class="chev">›</span>`}
    </button>`).join('')}</div>
  ${res.length ? '' : `<p class="muted">Nothing in the Codex matches “${esc(state.q)}”. Try a skill, a creature, or a word like <i>frozen</i> or <i>initiative</i>.</p>`}`;
};

/* ---------- home ---------- */
V.home = () => {
  const fullCount = SKILLS.filter(s => s.full).length;
  const tRow = store.get('tacRow', 'Good');
  const traitCount = DATA.traits.groups.reduce((a, g) => a + g.traits.length, 0);
  return `
  <section class="home-hero">
    <p class="eyebrow">The GM's pocket grimoire</p>
    <h2 class="leaf-title">Every rule of Primordium, one thumb away.</h2>
    <p>Search above, or tap any glowing dice like <button class="die" data-roll="2D20+5">2D20+5</button> anywhere in the Codex to roll it.</p>
  </section>

  <div class="panel" data-ctx="Tactics">
    <h4>Tactics</h4>
    <p class="note">Pick a creature's tactics level to see which cards its D20 can reach.</p>
    <div class="seg" role="group" aria-label="Tactics level">${Core.TACTICS.map(r => `<button aria-pressed="${r === tRow}" data-tacrow="${r}">${r}</button>`).join('')}</div>
    ${ladderHTML(tRow)}
    <div class="btns" style="margin-top:14px"><button class="btn" id="tacGo">Roll D20 · ${esc(tRow)}</button></div>
    <div id="tacOut"></div>
    <p class="note" style="margin:12px 0 0">Players pay with a card of the ability's rarity or higher. Two of a kind play one rarity up.</p>
  </div>

  ${sec('Open to')}
  <div class="grid2">
    <button class="quick" data-goto="skills"><b>Skills</b><span><span class="count">${fullCount}</span> of ${SKILLS.length} fully inscribed</span></button>
    <button class="quick" data-goto="beasts"><b>Bestiary</b><span><span class="count">${DATA.npcs.length}</span> creatures</span></button>
    <button class="quick" data-open='{"type":"races"}'><b>Races</b><span><span class="count">${DATA.races.length}</span> peoples</span></button>
    <button class="quick" data-open='{"type":"traits","g":0}'><b>Background traits</b><span><span class="count">${traitCount}</span> traits</span></button>
  </div>

  ${sec('Sealed tomes')}
  <div class="sealed">
    <div class="tome"><b>Tongue-Forge</b><span>Names and words for each race's language, built from its own sounds.</span><div class="seal">Sealed · next</div></div>
    <div class="tome"><b>Quick-Spawn</b><span>One-tap NPCs built on the NPC Guide's budget.</span><div class="seal">Sealed · after</div></div>
    <div class="tome"><b>Encounter roll</b><span>A D10 decides what the party walks into. The higher the roll, the better the situation and the less immediate the danger.</span><div class="seal">Sealed · later</div></div>
  </div>`;
};

// The seven card rarities as small cards, each showing the D20 range that reaches it at this tactics level.
// hit: the rarity just rolled (lifted).
function ladderHTML(row, hit) {
  const m = Core.TACTICS_TABLE[row];
  const short = { Basic: 'Basic', Common: 'Comm', Uncommon: 'Unc', Rare: 'Rare', Epic: 'Epic', Legendary: 'Leg', Mythic: 'Myth' };
  return `<div class="ladder" id="ladder">${DATA.tables.deck.map(d => `
      <div class="c r-${d.rarity}${m[d.rarity] ? '' : ' off'}${hit === d.rarity ? ' hit' : ''}" title="${d.rarity}: ${d.mapping}"><b>${esc(d.pip)}</b><i>${rangeText(m, d.rarity)}</i></div>`).join('')}</div>
    <div class="ladder-names">${RAR.map(r => `<span class="r-${r}">${short[r]}</span>`).join('')}</div>`;
}

/* ---------- skills ---------- */
V.skills = () => {
  const groups = ['Physical', 'Mental', 'Attribute', 'Other'];
  return `<p class="eyebrow">Skill Guide 2.0</p><h2 class="leaf-title">Skills</h2>
  <p class="flavor">Four base tiers, then one path for four more. A or S marks Agility or Strength weapons.</p>
  ${groups.map(g => `${sec(g)}<div class="list">${SKILLS.filter(s => s.group === g).map(s => `
    <button class="row" data-open='{"type":"skill","id":"${s.id}"}'>
      <span class="lead">${s.stat ? s.stat : esc(s.name[0])}</span>
      <div><span class="t">${esc(s.name)}</span><span class="s">${esc(s.paths.join(' · '))}${s.full ? '' : ' · awaiting transcription'}</span></div>
      <span class="chev">›</span>
    </button>`).join('')}</div>`).join('')}`;
};

// One ability or perk. ctx names its dice rolls; hl: the entry to highlight (from a search);
// note: an optional small line under it (where it comes from).
function entryHTML(e, ctx, hl, note) {
  const badges = e.kind === 'perk' ? `<span class="tag gilt">Perk</span>` : `<span class="tag">${esc(e.type || '')}</span>${chip(e.rarity)}`;
  return `<div class="entry" data-ctx="${esc(ctx + ' · ' + e.name)}" ${hl === e.name ? 'id="hl"' : ''}>
    <div class="entry-head"><span class="entry-name">${esc(e.name)}</span><span class="badges">${badges}</span></div>
    ${e.description ? `<p class="desc">${esc(e.description)}</p>` : ''}
    <p class="use">${linkDice(e.usage || '')}</p>
    ${note ? `<p class="note" style="margin:4px 0 0">${esc(note)}</p>` : ''}
  </div>`;
}

V.skill = p => {
  const s = SKILLS.find(x => x.id === p.id), full = s.full, view = p.path || 'Base';
  const statName = { A: 'Agility', S: 'Strength', K: 'Knowledge' }[s.stat];
  let body;
  if (!full) {
    body = `<div class="pending">This skill hasn't been inscribed yet. Add it to shared/primordium-data.js and every tier, ability, and perk appears here.</div>
    ${sec('Paths')}<div class="list">${s.paths.map(n => `<div class="row" style="cursor:default"><span class="lead">${esc(n[0])}</span><div><span class="t">${esc(n)}</span></div><span></span></div>`).join('')}</div>`;
  } else {
    const tiers = view === 'Base' ? full.base : full.paths.find(x => x.name === view).tiers;
    const label = t => view === 'Base' ? (t.tier === 0 ? 'Tier 0 · free' : 'Base Tier ' + t.tier) : esc(view) + ' Tier ' + t.tier;
    body = `<div class="seg" role="group" aria-label="Base or path">
      ${['Base', ...full.paths.map(x => x.name)].map(n => `<button aria-pressed="${n === view}" data-path="${esc(n)}">${n === 'Base' ? 'Base tiers' : esc(n)}</button>`).join('')}</div>
      ${tiers.map(t => `<div class="tier">
        <div class="tier-label"><span>${label(t)}</span><span>${t.entries.length} ${t.entries.length === 1 ? 'entry' : 'entries'}</span></div>
        ${t.entries.map(e => entryHTML(e, s.name, p.hl)).join('')}</div>`).join('')}`;
  }
  return `${backBtn()}<p class="eyebrow">${esc(s.group)} skill${statName ? ' · ' + statName : ''}</p>
    <h2 class="leaf-title">${esc(s.name)}</h2><p class="flavor">${esc(full?.flavor || s.summary)}</p>${body}`;
};

/* ---------- bestiary ---------- */
V.beasts = () => {
  const roles = ['All', ...Core.ROLES];
  const list = DATA.npcs.filter(n => state.roleFilter === 'All' || n.role === state.roleFilter)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  return `<p class="eyebrow">NPC Guide 2.0</p><h2 class="leaf-title">Bestiary</h2>
  <div class="seg" role="group" aria-label="Filter by role">${roles.map(r => `<button aria-pressed="${r === state.roleFilter}" data-role="${r}">${r}</button>`).join('')}</div>
  <div class="list" style="margin-top:10px">${list.map(n => `
    <button class="row" data-open='{"type":"npc","id":"${n.id}"}'>
      <span class="lead num" title="Level">${n.level}</span>
      <div><span class="t">${esc(n.name)}</span><span class="s">${esc(n.family)} · ${typeof n.hp === 'number' ? n.hp + ' HP' : 'special HP'} · ${esc(n.tactics)} tactics</span></div>
      <span class="role ${n.role}">${n.role}</span>
    </button>`).join('')}</div>`;
};

V.npc = p => {
  const n = DATA.npcs.find(x => x.id === p.id);
  const party = store.get('party', 4);
  const facts = [['Level', n.level], ['Role', n.role], ['HP', n.hp], ['Armor', n.armor], ['Tactics', n.tactics], ['Size', n.size], ['Alignment', n.alignment], ['XP', n.xp]];
  const ability = a => `<div class="entry" data-ctx="${esc(n.name + ' · ' + a.name)}">
    <div class="entry-head"><span class="entry-name">${esc(a.name)}</span>
      <span class="badges">${a.cooldown ? `<span class="tag">CD ${esc(a.cooldown)}</span>` : ''}${chip(a.rarity)}</span></div>
    <p class="use">${linkDice(a.text)}</p></div>`;
  return `${backBtn()}<p class="eyebrow">${n.group ? esc(n.group) + ' · ' : ''}${esc(n.family)}</p>
  <h2 class="leaf-title">${esc(n.name)}</h2>
  <p class="flavor">${esc(n.flavor ? n.flavor.replace(/\.$/, '') + '. ' : '')}${esc(n.familyFlavor)}</p>
  <div class="facts">${facts.map(([k, v]) => `<div><span class="k">${k}</span><span class="v num">${esc(v)}</span></div>`).join('')}</div>
  <div class="stats">${Object.entries(n.stats).map(([k, v]) => `<div><span class="k">${k}</span><span class="v">${signed(v)}</span></div>`).join('')}</div>

  <div class="panel" data-ctx="${esc(n.name)}">
    <h4>Run its turn</h4>
    <p class="note">${esc(n.tactics)} tactics.${n.turns > 1 ? ' Bosses take two turns, so this rolls twice.' : ''}</p>
    <button class="btn" data-tactic="${n.id}">Roll tactics</button>
    <div id="npcOut"></div>
  </div>

  ${sec('Abilities and perks')}
  ${n.skill ? `<div class="entry" data-ctx="${esc(n.name)}"><div class="entry-head"><span class="entry-name">Combat skill</span><span class="tag">Humanoid</span></div><p class="use">${linkDice(n.skill)}</p></div>` : ''}
  ${n.abilities.map(ability).join('')}
  ${n.attributes ? `<div class="entry"><div class="entry-head"><span class="entry-name">Attributes</span></div><p class="use">${linkDice(n.attributes)}</p></div>` : ''}

  <div class="panel">
    <h4>Experience</h4>
    <div class="btns" style="align-items:center">
      <label class="inline" for="party">Players <input id="party" type="number" min="1" max="12" value="${party}" style="width:70px"></label>
      <span class="ui"><b class="num" id="xpEach">${Math.round(n.xp / party)}</b> XP each <span class="muted">of ${n.xp}</span></span>
    </div>
  </div>`;
};

/* ---------- races and traits ---------- */
V.races = () => `${backBtn()}<p class="eyebrow">Game Guide 2.0</p><h2 class="leaf-title">Races</h2>
  <div class="list">${DATA.races.map(r => `<button class="row" data-open='{"type":"race","id":"${r.id}"}'>
    <span class="lead num">${r.stats.HP}</span><div><span class="t">${esc(r.name)}</span><span class="s">${esc(r.common)} · ${esc(r.roles)}</span></div><span class="chev">›</span></button>`).join('')}</div>`;

V.race = p => {
  const r = DATA.races.find(x => x.id === p.id), st = r.stats;
  const facts = [['Starting HP', st.HP], ['Country', r.country], ['Deity', r.deity], ['Population', r.population], ['Roles', r.roles]];
  return `${backBtn()}<p class="eyebrow">${esc(r.common)}</p><h2 class="leaf-title">${esc(r.name)}</h2><p class="flavor">${esc(r.desc)}</p>
  <div class="facts">${facts.map(([k, v]) => `<div><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join('')}</div>
  <div class="stats">${STATS.map(k => `<div><span class="k">${k}</span><span class="v">${signed(st[k])}</span></div>`).join('')}</div>
  ${sec('Special')}<ul>${r.special.map(s => `<li data-ctx="${esc(r.name)}">${linkDice(s)}</li>`).join('')}</ul>
  ${sec('Appearance')}<dl class="rules">${Object.entries(r.appearance).map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
};

V.traits = p => {
  const gi = p.g ?? 0, g = DATA.traits.groups[gi];
  // Negative costs grant points; they are shown in the glass color.
  const cost = c => c > 0 ? c : c === 0 ? '0' : `<span style="color:var(--glow)">${signed(c)}</span>`;
  return `${backBtn()}<p class="eyebrow">2 points at creation · never change</p><h2 class="leaf-title">Background traits</h2>
  <p class="flavor">${esc(DATA.traits.intro)}</p>
  <div class="seg" role="group">${DATA.traits.groups.map((x, i) => `<button aria-pressed="${i === gi}" data-tg="${i}">${esc(x.name)}</button>`).join('')}</div>
  <div class="tbl-wrap" style="margin-top:10px"><table><thead><tr><th>Trait</th><th>Cost</th><th>Effect</th></tr></thead><tbody>
  ${g.traits.map(([n, c, e]) => `<tr ${p.hl === n ? 'id="hl"' : ''}><td><b>${esc(n)}</b></td><td class="n">${cost(c)}</td><td data-ctx="${esc(n)}">${linkDice(e)}</td></tr>`).join('')}
  </tbody></table></div>`;
};

/* ---------- rules ---------- */
V.rules = () => {
  const groups = ['Character', 'Combat', 'World'];
  const characterLinks = `
    <details class="fold"><summary>Races</summary><div><button class="btn ghost" data-open='{"type":"races"}'>Open all ${DATA.races.length} races</button></div></details>
    <details class="fold"><summary>Background traits</summary><div><button class="btn ghost" data-open='{"type":"traits","g":0}'>Open trait tables</button></div></details>`;
  const sections = DATA.rules.filter(s => s.group === state.ruleGroup).map(s => `
    <details class="fold" id="sec-${s.id}"><summary>${esc(s.title)}</summary><div><dl class="rules">
      ${s.entries.map(([k, v]) => `<dt>${esc(k)}</dt><dd data-ctx="${esc(k)}">${linkDice(v)}</dd>`).join('')}</dl></div></details>`).join('');
  return `<p class="eyebrow">Game Guide 2.0</p><h2 class="leaf-title">Rules</h2>
  <div class="seg" role="group">${[...groups, 'Tables'].map(g => `<button aria-pressed="${g === state.ruleGroup}" data-rg="${g}">${g}</button>`).join('')}</div>
  <div style="margin-top:8px">
    ${state.ruleGroup === 'Tables' ? tablesHTML(DATA.tables) : (state.ruleGroup === 'Character' ? characterLinks : '') + sections}
  </div>`;
};

// A rule opened from search: switch to its group and open its section.
V.rule = p => {
  state.tab = 'rules'; state.ruleGroup = DATA.rules.find(s => s.id === p.id).group; state.stack = []; state.pendingOpen = p.id;
  return V.rules();
};

function tablesHTML(T) {
  const table = (head, rows) => `<div class="tbl-wrap"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  const cooldowns = Object.entries(Core.COOLDOWNS).map(([r, c]) => r + ' ' + Core.cooldownText(c)).join(', ');
  return `
  ${sec('Tactics (D20)')}
  ${table(['Row', ...RAR.map(r => `<span class="card-chip r-${r}" style="font-size:.6rem">${r.slice(0, 4)}</span>`)],
    Core.TACTICS.map(row => { const m = Core.TACTICS_TABLE[row];
      return `<tr><td><b>${row}</b></td>${RAR.map(r => `<td class="n">${m[r] ? (rangeText(m, r) === '1–20' ? 'Always' : rangeText(m, r)) : ''}</td>`).join('')}</tr>`; }))}
  <p class="note">Cooldowns: ${cooldowns}.</p>

  ${sec('Enemy XP')}
  <div class="panel" style="margin-top:0">
    <div class="btns" style="align-items:center">
      <select id="xpRole" aria-label="Role">${Core.ROLES.map(r => `<option ${r === 'Standard' ? 'selected' : ''}>${r}</option>`).join('')}</select>
      <label class="inline" for="xpLvl">Level <input id="xpLvl" type="number" min="1" max="40" value="5" style="width:70px"></label>
      <span class="ui">= <b class="num" id="xpOut">${Core.xpFor('Standard', 5)}</b> XP</span>
    </div>
    <p class="note" style="margin:8px 0 0">Role × (20 + 6 × level). Level <span id="lvTo">5</span> needs <b class="num" id="lvNeed">${Core.xpToNextLevel(5)}</b> XP to reach the next.</p>
  </div>

  ${sec('Out-of-combat XP')}
  ${table(['Event', 'Award', 'For example'], T.outOfCombatXP.map(([e, xp, ex]) => `<tr><td><b>${esc(e)}</b></td><td class="n">${esc(xp)}</td><td>${esc(ex)}</td></tr>`))}

  ${sec('Starting wealth')}
  <div data-ctx="Starting wealth">${table(['<button class="die" data-roll="D4">D4</button>', 'Marks', 'Equipment'],
    T.wealth.map(w => `<tr><td class="n">${w.roll}</td><td class="n">${w.marks}</td><td>${esc(w.gear)}</td></tr>`))}</div>

  ${sec('Materials')}
  ${table(['Tier', 'Material', 'Notes'], T.materials.map(([t, n, d]) => `<tr><td class="n">${t}</td><td><b>${esc(n)}</b></td><td>${esc(d)}</td></tr>`))}

  ${sec('Potions and consumables')}
  ${table(['Item', 'Effect', 'Marks'], T.consumables.map(([n, e, m]) => `<tr><td><b>${esc(n)}</b></td><td data-ctx="${esc(n)}">${linkDice(e)}</td><td class="n">${m}</td></tr>`))}

  ${sec('Enchantments')}
  ${table(['Name', 'Slot', 'Effect'], T.enchantments.map(([n, s, t, e]) => `<tr><td><b>${esc(n)}</b><br><span class="muted">${t}</span></td><td>${esc(s)}</td><td data-ctx="${esc(n)}">${linkDice(e)}</td></tr>`))}

  ${sec('Sizes')}
  ${table(['Size', 'Space', 'Effect'], T.sizes.map(([a, b, c]) => `<tr><td><b>${a}</b></td><td>${b}</td><td>${c}</td></tr>`))}`;
}

/* ---------- dice tab: the tray and the tactical deck ---------- */
V.dice = () => {
  const view = state.diceView;
  const seg = `<div class="seg" role="group" aria-label="Dice or deck">${[['dice', 'Dice'], ['deck', 'Deck']].map(([k, l]) => `<button aria-pressed="${k === view}" data-dview="${k}">${l}</button>`).join('')}</div>`;
  if (view === 'deck') {
    const jokers = deckBuild().cards.length - 52;
    return `<p class="eyebrow">Tactical deck · 52 cards and ${jokers > 1 ? 'two jokers' : 'a joker'}</p><h2 class="leaf-title">Draw</h2>${seg}${deckHTML()}`;
  }
  const Dice = window.PrimordiumDice, expr = Dice.poolExpr(state.pool, state.mod);
  const history = state.history.slice(0, 12).map(h => `<li><span><b>${esc(h.label)}</b><br><span class="muted">${esc(h.parts)}${h.extra ? ' · ' + esc(h.extra) : ''}</span></span><span class="tot">${h.total}</span></li>`);
  return `<p class="eyebrow">Dice tray</p><h2 class="leaf-title">Roll</h2>${seg}
  <div class="tray" style="margin-top:12px">${Dice.FACES.map(f => Dice.trayButton(f, state.pool.filter(x => x === f).length)).join('')}</div>
  <div class="pool"><code>${expr || 'Tap dice to build a roll'}</code>
    <span class="btns"><button class="btn ghost" data-mod="-1" aria-label="Minus one">−1</button><button class="btn ghost" data-mod="1" aria-label="Plus one">+1</button></span></div>
  <div class="btns"><button class="btn" id="poolRoll" ${expr ? '' : 'disabled'}>Roll ${expr ? esc(expr) : ''}</button><button class="btn ghost" id="poolClear">Clear</button></div>

  ${sec('Table rolls')}
  <div class="grid2">
    <button class="quick" data-quick="contest"><b>Contest</b><span>D10 + stat, ties to defender</span></button>
    <button class="quick" data-quick="rec"><b>Recovery</b><span>D4 · 1 never recovers</span></button>
    <button class="quick" data-quick="speed"><b>Speed roll</b><span>D10 + Speed, min 2M</span></button>
    <button class="quick" data-quick="ood"><b>Out of combat</b><span>D10 · Rare 4 · Epic 7 · Leg 9</span></button>
  </div>
  <label class="inline" style="margin-top:10px" for="qmod">Modifier for table rolls <input id="qmod" type="number" value="${store.get('qmod', 0)}" style="width:70px"></label>

  ${sec('History')}
  <div class="hist">${history.length ? `<ol>${history.join('')}</ol>` : `<p class="muted">Rolls from anywhere in the Codex land here.</p>`}</div>
  ${fxSettingsHTML()}`;
};

// The deck view: the Tactics picker, what it grants, card assignment, then the hand (../shared/tactics-deck.js).
function deckHTML() {
  const b = deckBuild(), lv = TAC.level;
  const cur = JSON.stringify([lv.base, lv.path || '', lv.ptier || 0]);
  const opt = l => { const v = JSON.stringify([l.base, l.path, l.ptier]); return `<option value='${v}' ${v === cur ? 'selected' : ''}>${esc(DK.levelLabel(l))}</option>`; };
  const levels = `<optgroup label="Base tiers">${DK.LEVELS.filter(l => !l.path).map(opt).join('')}</optgroup>` +
    DK.PATHS.map(p => `<optgroup label="${esc(p)} path">${DK.LEVELS.filter(l => l.path === p).map(opt).join('')}</optgroup>`).join('');
  const perks = b.granted.filter(g => g.name !== 'Basic Tactics');
  const counts = RAR.filter(r => b.counts[r]);
  return `<div class="panel tac-panel">
    <label class="fieldrow" for="tacLevel"><span>Tactics skill</span><select id="tacLevel">${levels}</select></label>
    ${b.needsSuit ? `<label class="fieldrow" for="tacSuit"><span>Suit Mastery suit</span><select id="tacSuit"><option value="">Choose a suit</option>${DK.SUITS.map(([sym, n]) => `<option value="${n}" ${TAC.suit === n ? 'selected' : ''}>${sym} ${n}</option>`).join('')}</select></label>` : ''}
    <div class="decklist">${counts.map(r => `<span>${chip(r)}<b class="num">${b.counts[r]}</b></span>`).join('')}</div>
    ${perks.length ? `<details class="fold"><summary>What this level grants (${perks.length})</summary><div>
      ${perks.map(g => entryHTML({ ...g, description: '' }, g.name, null, g.tier)).join('')}</div></details>` : ''}
    <details class="fold"><summary>Card assignment</summary><div>
      ${b.steps.length ? b.steps.map(st => `<label class="fieldrow"><span>${esc(st.perk)}: ${esc(st.label)}</span><select data-promo="${esc(st.key)}">${st.options.map(o => `<option value="${esc(o.v)}" ${o.v === st.value ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select></label>`).join('')
        : `<p class="note" style="margin:0">No promotions at this level. Tactics Base Tier 1 adds the first.</p>`}
      <div class="tbl-wrap" style="margin-top:10px"><table><thead><tr><th>Rarity</th><th>Cards</th><th>Which cards</th></tr></thead><tbody>
        ${counts.map(r => `<tr><td>${chip(r)}</td><td class="n">${b.counts[r]}</td><td>${esc(b.mapping[r])}</td></tr>`).join('')}</tbody></table></div>
      ${b.f.wild ? `<p class="note" style="margin:8px 0 0">Jokers are wild: each counts as any rarity up to ${b.f.wildCap}.</p>` : ''}
    </div></details>
  </div>
  <div class="deck">${DK.render(DECK, b, { session: true })}</div>
  ${sec('Rarity by card')}
  ${ladderHTML('Mythic').replace(/ off/g, '').replace(/<i>[^<]*<\/i>/g, '')}`;
}

// Effects settings (markup and saving in ../shared/fx.js), shared with the sheet and the GM tool.
function fxSettingsHTML() {
  return `${sec('Effects')}<div class="panel" style="margin-top:0"><div id="fxBox">${FX.settingsHTML()}</div>
    <p class="note" style="margin:8px 0 0">Crits, card plays from Rare to Mythic, and other flourishes. Shared with the character sheet on this phone. The light or dark theme is the round button at the top.</p></div>`;
}
