// Primordium Codex: phone-first rules reference. Skills, races, traits, and creatures come from ../shared/;
// rules, tables, race lore, and creature family notes come from codex-data.js.
(function(){
"use strict";

/* ---------- data: shape the shared files the way the Codex reads them ---------- */
const DATA = (() => {
  const P = window.PRIMORDIUM_DATA, NPCS = window.PRIMORDIUM_NPCS, C = window.CODEX_DATA;
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const tiers = o => Object.keys(o).map(Number).sort((a,b)=>a-b).map(t => ({tier:t, entries:o[t].map(e => ({
    kind:e.kind, name:e.name, type:e.type, rarity:e.rarity, description:e.desc, usage:e.usage}))}));
  const skills = P.skills.map(s => ({id:slug(s.name), name:s.name, group:s.group, flavor:s.intro,
    base:tiers(s.base), paths:Object.entries(s.paths).map(([name,o]) => ({name, tiers:tiers(o)}))}));
  const skillsIndex = P.skills.map(s => ({id:slug(s.name), name:s.name, group:s.group, stat:C.skillNotes[s.name]?.stat || null,
    summary:C.skillNotes[s.name]?.summary || s.intro, paths:Object.keys(s.paths)}));
  const KEYS = ["STR","AGI","KNO","SPD","PER","SPE"];
  const races = Object.entries(P.races).map(([name,r]) => {
    const lore = C.raceLore[name] || {};
    return {id:lore.id || slug(name), name, common:lore.common || "", roles:lore.roles || "", country:lore.country || "",
      population:lore.population || "", deity:lore.deity || "", appearance:lore.appearance || {}, desc:lore.desc || "",
      stats:Object.fromEntries([["HP",r.hp], ...KEYS.map((k,i)=>[k,r.stats[i]])]), special:r.traits};
  });
  const cats = [...new Set(P.traits.map(t=>t.category))];
  const traits = {intro:C.traitsIntro, groups:cats.map(c => ({name:C.traitGroupNames[c] || c,
    traits:P.traits.filter(t=>t.category===c).map(t=>[t.name, t.cost, t.effect])}))};
  const cooldown = c => c == null ? null : c === "combat" ? "once per combat" : c + (c === 1 ? " phase" : " phases");
  const npcs = NPCS.map(n => {
    const fam = C.creatureFamilies[n.family] || {};
    const flavor = n.description && n.description !== "Standard" && n.description !== fam.flavor ? n.description : "";
    return {id:slug(n.name), name:n.name, group:fam.group || "", family:n.family, familyFlavor:fam.flavor || "", flavor,
      stats:n.stats, abilities:(n.abilities||[]).map(a => ({name:a.name, rarity:a.rarity, cooldown:cooldown(a.cooldown), text:a.text})),
      skill:n.combatSkill ? n.combatSkill.replace(/^Combat skill:\s*/i, "") : null,
      attributes:n.attributes && n.attributes !== "None" ? n.attributes : "",
      alignment:n.alignment, size:n.size, role:n.role, level:n.level, tactics:n.tactics,
      hp:typeof n.hp === "number" ? n.hp : "Special", armor:n.armor ? n.armor : "None", xp:n.xp, turns:n.turnsPerPhase || 1};
  });
  return {races, traits, rules:C.rules, tables:C.tables, skillsIndex, skills, npcs};
})();


/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const RAR = DATA.tables.rarities;
const PIP = Object.fromEntries(DATA.tables.deck.map(d => [d.rarity, d.pip]));
const store = {
  get(k, d){ try{ const v = localStorage.getItem("codex:"+k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem("codex:"+k, JSON.stringify(v)); }catch(e){} }
};
const signed = n => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n);
const chip = r => r ? `<span class="card-chip r-${esc(r)}"><span class="pip">${esc(PIP[r]||"")}</span>${esc(r)}</span>` : "";

/* ---------- dice ---------- */
const DICE_RE = /(?<![A-Za-z0-9])(\d*D\d+(?:\s?[+\-]\s?(?:\d*D\d+|\d+(?!D)))*)(?![A-Za-z0-9])/g;
const rollExpr = window.PrimordiumDice.roll;
function linkDice(text){
  return esc(text).replace(DICE_RE, m => `<button class="die" data-roll="${m.replace(/\s/g,"")}">${m}</button>`);
}
let toastTimer;
/* ---------- impact effects (../shared/fx.js): where the last tap landed is where an effect starts ---------- */
const FX = window.PrimordiumFX;
FX.configure({shake: "#app"});
let lastTap = null;
document.addEventListener("pointerdown", e => { const b = e.target.closest("button"); lastTap = b ? b.getBoundingClientRect() : null; }, true);
// quiet: a crit or fumble gets its sparks but no banner (tactics rolls show the rarity instead).
function showRoll(label, res, extra="", opts={}){
  const j = FX.judge(res);
  const cls = j ? j.kind : "";
  $("#t-total").className = "total " + cls;
  FX.tumble($("#t-total"), res.total, res.dice.reduce((a,d)=>a+d.f,0) || 20);
  FX.roll(res, lastTap || $("#toast"), {quiet: opts.quiet, label});
  $("#t-what").innerHTML = `<b>${esc(label)}</b>${esc(res.parts.join(" "))}${extra ? " · " + esc(extra) : ""}`;
  $("#toast").classList.add("on");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>$("#toast").classList.remove("on"), 4200);
  const h = state.history; h.unshift({label, total:res.total, parts:res.parts.join(" "), extra, t:Date.now()}); store.set("history", h.slice(0,30));
  state.history = h.slice(0,30);
}
$("#toast").addEventListener("click", ()=>$("#toast").classList.remove("on"));
document.addEventListener("click", e => {
  const d = e.target.closest("[data-roll]");
  if (d){ e.preventDefault(); const ctx = d.closest("[data-ctx]")?.dataset.ctx || "Roll"; showRoll(ctx + " · " + d.dataset.roll, rollExpr(d.dataset.roll)); }
});

/* ---------- tactics ---------- */
function tacticsRarity(row, roll){
  const t = DATA.tables.tactics[row];
  for (const [r,[lo,hi]] of Object.entries(t)) if (roll>=lo && roll<=hi) return r;
  return "Basic";
}
function resolveAbility(npc, rarity){
  const idx = RAR.indexOf(rarity);
  for (let i=idx;i>=0;i--){ const a = npc.abilities.find(x => x.rarity===RAR[i] && !/Quick action/i.test(x.text)); if (a) return {a, dropped: i<idx}; }
  return {a:null, dropped:false};
}

/* ---------- state + routing ---------- */
const state = { tab: store.get("tab","home"), diceView: store.get("diceView","dice"), stack: [], q:"", history: store.get("history", []), pool: [], mod:0, roleFilter:"All", ruleGroup:"Combat", traitGroup:0 };
function go(tab){ state.tab = tab; state.stack = []; store.set("tab", tab); render(); window.scrollTo(0,0); }
function open(page){ state.stack.push(page); render(); window.scrollTo(0,0); }
function back(){ state.stack.pop(); render(); }
document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", ()=>{ $("#q").value=""; state.q=""; $("#qclear").hidden=true; go(b.dataset.tab); }));

/* ---------- search index ---------- */
const SKILLS = DATA.skillsIndex.map(s => ({...s, full: DATA.skills.find(f => f.id===s.id) || null}));
const INDEX = [];
SKILLS.forEach(s => {
  INDEX.push({kind:"Skill", title:s.name, sub:`${s.group} · ${s.paths.join(", ")}`, text:s.summary, page:{type:"skill", id:s.id}});
  if (s.full){
    const walk = (tiers, path) => tiers.forEach(t => t.entries.forEach(e => INDEX.push({kind:e.kind==="perk"?"Perk":"Ability", title:e.name, sub:`${s.name} · ${path?path+" Path Tier":t.tier===0?"Tier":"Base Tier"} ${t.tier}`, text:(e.usage||"")+" "+(e.description||""), rarity:e.rarity, page:{type:"skill", id:s.id, path: path||null, hl:e.name}})));
    walk(s.full.base, null); s.full.paths.forEach(p => walk(p.tiers, p.name));
  }
});
DATA.npcs.forEach(n => INDEX.push({kind:"Creature", title:n.name, sub:`Level ${n.level} ${n.role} · ${n.family}`, text:n.abilities.map(a=>a.name+" "+a.text).join(" ")+" "+n.attributes, page:{type:"npc", id:n.id}}));
DATA.races.forEach(r => INDEX.push({kind:"Race", title:r.name, sub:r.common, text:r.special.join(" ")+" "+r.desc, page:{type:"race", id:r.id}}));
DATA.traits.groups.forEach((g,gi) => g.traits.forEach(([n,c,e]) => INDEX.push({kind:"Trait", title:n, sub:`${g.name} trait · cost ${c}`, text:e, page:{type:"traits", g:gi, hl:n}})));
DATA.rules.forEach(sec => sec.entries.forEach(([k,v]) => INDEX.push({kind:"Rule", title:k, sub:sec.title, text:v, page:{type:"rule", id:sec.id, hl:k}})));

function search(q){
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return INDEX.map(it => {
    const t = it.title.toLowerCase(), body = (it.sub+" "+it.text).toLowerCase();
    let score = 0;
    for (const w of terms){ if (t.startsWith(w)) score += 6; else if (t.includes(w)) score += 4; else if (body.includes(w)) score += 1; else return null; }
    return {it, score};
  }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,40).map(x=>x.it);
}
$("#q").addEventListener("input", e => { state.q = e.target.value; $("#qclear").hidden = !state.q; render(); });
$("#qclear").addEventListener("click", e => { e.preventDefault(); $("#q").value=""; state.q=""; $("#qclear").hidden=true; render(); $("#q").focus(); });

/* ---------- views ---------- */
const V = {};
const backBtn = () => `<button class="back" data-back>‹ Back</button>`;

V.search = () => {
  const res = search(state.q);
  return `<p class="eyebrow">${res.length} found</p><div class="list">${res.map((it,i)=>`
    <button class="row" data-open='${esc(JSON.stringify(it.page))}'>
      <span class="lead">${esc(it.kind[0])}</span>
      <div><span class="t">${esc(it.title)}</span><span class="s">${esc(it.kind)} · ${esc(it.sub)}</span></div>
      ${it.rarity ? chip(it.rarity) : `<span class="chev">›</span>`}
    </button>`).join("")}</div>
    ${res.length ? "" : `<p class="muted">Nothing in the Codex matches “${esc(state.q)}”. Try a skill, a creature, or a word like <i>frozen</i> or <i>initiative</i>.</p>`}`;
};

V.home = () => {
  const fullCount = SKILLS.filter(s=>s.full).length;
  const tRow = store.get("tacRow","Good");
  return `
  <section class="home-hero">
    <p class="eyebrow">The GM's pocket grimoire</p>
    <h2 class="leaf-title">Every rule of Primordium, one thumb away.</h2>
    <p>Search above, or tap any glowing dice like <button class="die" data-roll="2D20+5">2D20+5</button> anywhere in the Codex to roll it.</p>
  </section>

  <div class="panel" data-ctx="Tactics">
    <h4>Tactics</h4>
    <p class="muted ui" style="font-size:.88rem">Pick a creature's tactics level to see which cards its D20 can reach.</p>
    <div class="seg" role="group" aria-label="Tactics level">${Object.keys(DATA.tables.tactics).map(r=>`<button aria-pressed="${r===tRow}" data-tacrow="${r}">${r}</button>`).join("")}</div>
    ${ladderHTML(tRow)}
    <div class="btns" style="margin-top:14px"><button class="btn" id="tacGo">Roll D20 · ${esc(tRow)}</button></div>
    <div id="tacOut"></div>
    <p class="muted ui" style="font-size:.8rem;margin:12px 0 0">Players pay with a card of the ability's rarity or higher. Two of a kind play one rarity up.</p>
  </div>

  <h3 class="sec">Open to</h3>
  <div class="grid2">
    <button class="quick" data-goto="skills"><b>Skills</b><span><span class="count">${fullCount}</span> of ${SKILLS.length} fully inscribed</span></button>
    <button class="quick" data-goto="beasts"><b>Bestiary</b><span><span class="count">${DATA.npcs.length}</span> creatures</span></button>
    <button class="quick" data-open='{"type":"races"}'><b>Races</b><span><span class="count">${DATA.races.length}</span> peoples</span></button>
    <button class="quick" data-open='{"type":"traits","g":0}'><b>Background traits</b><span><span class="count">${DATA.traits.groups.reduce((a,g)=>a+g.traits.length,0)}</span> traits</span></button>
  </div>

  <h3 class="sec">Sealed tomes</h3>
  <div class="sealed">
    <div class="tome"><b>Tongue-Forge</b><span>Names and words for each race's language, built from its own sounds.</span><div class="seal">Sealed · next</div></div>
    <div class="tome"><b>Quick-Spawn</b><span>One-tap NPCs built on the NPC Guide's budget.</span><div class="seal">Sealed · after</div></div>
    <div class="tome"><b>Encounter roll</b><span>A D10 decides what the party walks into. The higher the roll, the better the situation and the less immediate the danger.</span><div class="seal">Sealed · later</div></div>
  </div>`;
};

function ladderHTML(row, hit){
  const m = DATA.tables.tactics[row];
  const ab = {Basic:"Basic",Common:"Comm",Uncommon:"Unc",Rare:"Rare",Epic:"Epic",Legendary:"Leg",Mythic:"Myth"};
  const range = r => !m[r] ? "–" : (m[r][0]===1&&m[r][1]===20) ? "1–20" : m[r][0]===m[r][1] ? String(m[r][0]) : m[r][0]+"–"+m[r][1];
  return `<div class="ladder" id="ladder">${DATA.tables.deck.map(d=>`<div class="c r-${d.rarity}${m[d.rarity]?"":" off"}${hit===d.rarity?" hit":""}" title="${d.rarity}: ${d.mapping}"><b>${esc(d.pip)}</b><i>${range(d.rarity)}</i></div>`).join("")}</div>
    <div class="ladder-names">${RAR.map(r=>`<span class="r-${r}">${ab[r]}</span>`).join("")}</div>`;
}

V.skills = () => {
  const groups = ["Physical","Mental","Attribute","Other"];
  return `<p class="eyebrow">Skill Guide 2.0</p><h2 class="leaf-title">Skills</h2>
  <p class="flavor">Four base tiers, then one path for four more. A or S marks Agility or Strength weapons.</p>
  ${groups.map(g=>`<h3 class="sec">${g}</h3><div class="list">${SKILLS.filter(s=>s.group===g).map(s=>`
    <button class="row" data-open='{"type":"skill","id":"${s.id}"}'>
      <span class="lead">${s.stat ? s.stat : esc(s.name[0])}</span>
      <div><span class="t">${esc(s.name)}</span><span class="s">${esc(s.paths.join(" · "))}${s.full?"":" · awaiting transcription"}</span></div>
      <span class="chev">›</span>
    </button>`).join("")}</div>`).join("")}`;
};

function entryHTML(e, ctx, hl){
  return `<div class="entry" data-ctx="${esc(ctx+" · "+e.name)}" ${hl===e.name?'id="hl"':""}>
    <div class="entry-head"><span class="entry-name">${esc(e.name)}</span>
      <span style="display:flex;gap:8px;align-items:center">${e.kind==="perk"?`<span class="tag perk">Perk</span>`:`<span class="tag">${esc(e.type||"")}</span>${chip(e.rarity)}`}</span></div>
    ${e.description?`<p class="desc">${esc(e.description)}</p>`:""}
    <p class="use">${linkDice(e.usage||"")}</p>
  </div>`;
}

V.skill = (p) => {
  const s = SKILLS.find(x=>x.id===p.id);
  const full = s.full;
  const view = p.path || "Base";
  let body;
  if (!full){
    body = `<div class="pending">This skill hasn't been inscribed yet. Add it to shared/primordium-data.js and every tier, ability, and perk appears here.</div>
    <h3 class="sec">Paths</h3><div class="list">${s.paths.map(n=>`<div class="row" style="cursor:default"><span class="lead">${esc(n[0])}</span><div><span class="t">${esc(n)}</span></div><span></span></div>`).join("")}</div>`;
  } else {
    const tiers = view==="Base" ? full.base : full.paths.find(x=>x.name===view).tiers;
    body = `<div class="seg" role="group" aria-label="Base or path">
      ${["Base",...full.paths.map(x=>x.name)].map(n=>`<button aria-pressed="${n===view}" data-path="${esc(n)}">${n==="Base"?"Base tiers":esc(n)}</button>`).join("")}</div>
      ${tiers.map(t=>`<div class="tier"><div class="tier-label"><span>${view==="Base"?(t.tier===0?"Tier 0 · free":"Base Tier "+t.tier):esc(view)+" Tier "+t.tier}</span><span>${t.entries.length} ${t.entries.length===1?"entry":"entries"}</span></div>
        ${t.entries.map(e=>entryHTML(e, s.name, p.hl)).join("")}</div>`).join("")}`;
  }
  return `${backBtn()}<p class="eyebrow">${esc(s.group)} skill${s.stat?` · ${s.stat==="A"?"Agility":s.stat==="S"?"Strength":"Knowledge"}`:""}</p>
    <h2 class="leaf-title">${esc(s.name)}</h2><p class="flavor">${esc(full?.flavor || s.summary)}</p>${body}`;
};

V.beasts = () => {
  const roles = ["All","Minion","Standard","Elite","Boss"];
  const list = DATA.npcs.filter(n => state.roleFilter==="All" || n.role===state.roleFilter).sort((a,b)=>a.level-b.level || a.name.localeCompare(b.name));
  return `<p class="eyebrow">NPC Guide 2.0</p><h2 class="leaf-title">Bestiary</h2>
  <div class="seg" role="group" aria-label="Filter by role">${roles.map(r=>`<button aria-pressed="${r===state.roleFilter}" data-role="${r}">${r}</button>`).join("")}</div>
  <div class="list" style="margin-top:10px">${list.map(n=>`
    <button class="row" data-open='{"type":"npc","id":"${n.id}"}'>
      <span class="lead num" title="Level">${n.level}</span>
      <div><span class="t">${esc(n.name)}</span><span class="s">${esc(n.family)} · ${typeof n.hp==="number"?n.hp+" HP":"special HP"} · ${esc(n.tactics)} tactics</span></div>
      <span class="role ${n.role}">${n.role}</span>
    </button>`).join("")}</div>`;
};

V.npc = (p) => {
  const n = DATA.npcs.find(x=>x.id===p.id);
  const party = store.get("party", 4);
  const xpEach = Math.round(n.xp / party);
  return `${backBtn()}<p class="eyebrow">${n.group?esc(n.group)+" · ":""}${esc(n.family)}</p>
  <h2 class="leaf-title">${esc(n.name)}</h2>
  <p class="flavor">${esc(n.flavor ? n.flavor.replace(/\.$/,"") + ". " : "")}${esc(n.familyFlavor)}</p>
  <div class="facts">
    ${[["Level",n.level],["Role",n.role],["HP",n.hp],["Armor",n.armor],["Tactics",n.tactics],["Size",n.size],["Alignment",n.alignment],["XP",n.xp]].map(([k,v])=>`<div><span class="k">${k}</span><span class="v num">${esc(v)}</span></div>`).join("")}
  </div>
  <div class="stats">${Object.entries(n.stats).map(([k,v])=>`<div><span class="k">${k}</span><span class="v">${signed(v)}</span></div>`).join("")}</div>

  <div class="panel" data-ctx="${esc(n.name)}">
    <h4>Run its turn</h4>
    <p class="muted ui" style="font-size:.88rem">${esc(n.tactics)} tactics.${n.turns>1?" Bosses take two turns, so this rolls twice.":""}</p>
    <button class="btn" data-tactic="${n.id}">Roll tactics</button>
    <div id="npcOut"></div>
  </div>

  <h3 class="sec">Abilities and perks</h3>
  ${n.skill?`<div class="entry" data-ctx="${esc(n.name)}"><div class="entry-head"><span class="entry-name">Combat skill</span><span class="tag">Humanoid</span></div><p class="use">${linkDice(n.skill)}</p></div>`:""}
  ${n.abilities.map(a=>`<div class="entry" data-ctx="${esc(n.name+" · "+a.name)}"><div class="entry-head"><span class="entry-name">${esc(a.name)}</span>
    <span style="display:flex;gap:8px;align-items:center">${a.cooldown?`<span class="tag">CD ${esc(a.cooldown)}</span>`:""}${chip(a.rarity)}</span></div><p class="use">${linkDice(a.text)}</p></div>`).join("")}
  ${n.attributes?`<div class="entry"><div class="entry-head"><span class="entry-name">Attributes</span></div><p class="use">${linkDice(n.attributes)}</p></div>`:""}

  <div class="panel">
    <h4>Experience</h4>
    <div class="btns" style="align-items:center"><label class="inline" for="party">Players <input id="party" type="number" min="1" max="12" value="${party}" style="width:70px"></label>
    <span class="ui"><b class="num" id="xpEach">${xpEach}</b> XP each <span class="muted">of ${n.xp}</span></span></div>
  </div>`;
};

V.races = () => `${backBtn()}<p class="eyebrow">Game Guide 2.0</p><h2 class="leaf-title">Races</h2>
  <div class="list">${DATA.races.map(r=>`<button class="row" data-open='{"type":"race","id":"${r.id}"}'>
    <span class="lead num">${r.stats.HP}</span><div><span class="t">${esc(r.name)}</span><span class="s">${esc(r.common)} · ${esc(r.roles)}</span></div><span class="chev">›</span></button>`).join("")}</div>`;

V.race = (p) => {
  const r = DATA.races.find(x=>x.id===p.id);
  const st = r.stats, keys = ["STR","AGI","KNO","SPD","PER","SPE"];
  return `${backBtn()}<p class="eyebrow">${esc(r.common)}</p><h2 class="leaf-title">${esc(r.name)}</h2><p class="flavor">${esc(r.desc)}</p>
  <div class="facts">${[["Starting HP",st.HP],["Country",r.country],["Deity",r.deity],["Population",r.population],["Roles",r.roles]].map(([k,v])=>`<div><span class="k">${k}</span><span class="v">${esc(v)}</span></div>`).join("")}</div>
  <div class="stats">${keys.map(k=>`<div><span class="k">${k}</span><span class="v">${signed(st[k])}</span></div>`).join("")}</div>
  <h3 class="sec">Special</h3><ul>${r.special.map(s=>`<li data-ctx="${esc(r.name)}">${linkDice(s)}</li>`).join("")}</ul>
  <h3 class="sec">Appearance</h3><dl class="rules">${Object.entries(r.appearance).map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`;
};

V.traits = (p) => {
  const gi = p.g ?? 0, g = DATA.traits.groups[gi];
  return `${backBtn()}<p class="eyebrow">2 points at creation · never change</p><h2 class="leaf-title">Background traits</h2>
  <p class="flavor">${esc(DATA.traits.intro)}</p>
  <div class="seg" role="group">${DATA.traits.groups.map((x,i)=>`<button aria-pressed="${i===gi}" data-tg="${i}">${esc(x.name)}</button>`).join("")}</div>
  <div class="tbl-wrap" style="margin-top:10px"><table><thead><tr><th>Trait</th><th>Cost</th><th>Effect</th></tr></thead><tbody>
  ${g.traits.map(([n,c,e])=>`<tr ${p.hl===n?'id="hl"':""}><td><b>${esc(n)}</b></td><td class="n">${c>0?c:c===0?"0":"<span style='color:var(--glow)'>"+signed(c)+"</span>"}</td><td data-ctx="${esc(n)}">${linkDice(e)}</td></tr>`).join("")}
  </tbody></table></div>`;
};

V.rules = () => {
  const groups = ["Character","Combat","World"];
  const T = DATA.tables;
  return `<p class="eyebrow">Game Guide 2.0</p><h2 class="leaf-title">Rules</h2>
  <div class="seg" role="group">${[...groups,"Tables"].map(g=>`<button aria-pressed="${g===state.ruleGroup}" data-rg="${g}">${g}</button>`).join("")}</div>
  <div style="margin-top:8px">
  ${state.ruleGroup==="Tables" ? tablesHTML(T) :
    (state.ruleGroup==="Character" ? `<details class="fold"><summary>Races</summary><div><button class="btn ghost" data-open='{"type":"races"}'>Open all ${DATA.races.length} races</button></div></details>
      <details class="fold"><summary>Background traits</summary><div><button class="btn ghost" data-open='{"type":"traits","g":0}'>Open trait tables</button></div></details>` : "") +
    DATA.rules.filter(s=>s.group===state.ruleGroup).map(sec=>`
    <details class="fold" id="sec-${sec.id}"><summary>${esc(sec.title)}</summary><div><dl class="rules">
      ${sec.entries.map(([k,v])=>`<dt>${esc(k)}</dt><dd data-ctx="${esc(k)}">${linkDice(v)}</dd>`).join("")}</dl></div></details>`).join("")}
  </div>`;
};

function tablesHTML(T){
  const tacRows = Object.entries(T.tactics);
  return `
  <h3 class="sec">Tactics (D20)</h3>
  <div class="tbl-wrap"><table><thead><tr><th>Row</th>${RAR.map(r=>`<th><span class="card-chip r-${r}" style="font-size:.6rem">${r.slice(0,4)}</span></th>`).join("")}</tr></thead><tbody>
  ${tacRows.map(([row,m])=>`<tr><td><b>${row}</b></td>${RAR.map(r=>`<td class="n">${m[r]?(m[r][0]===1&&m[r][1]===20?"Always":m[r][0]===m[r][1]?m[r][0]:m[r][0]+"–"+m[r][1]):""}</td>`).join("")}</tr>`).join("")}
  </tbody></table></div>
  <p class="muted ui" style="font-size:.85rem">Cooldowns: Rare 1 phase, Epic 2, Legendary 3, Mythic once per combat.</p>

  <h3 class="sec">Enemy XP</h3>
  <div class="panel" style="margin-top:0">
    <div class="btns" style="align-items:center">
      <select id="xpRole" aria-label="Role">${Object.keys(T.roles).map(r=>`<option ${r==="Standard"?"selected":""}>${r}</option>`).join("")}</select>
      <label class="inline" for="xpLvl">Level <input id="xpLvl" type="number" min="1" max="40" value="5" style="width:70px"></label>
      <span class="ui">= <b class="num" id="xpOut">50</b> XP</span>
    </div>
    <p class="muted ui" style="font-size:.85rem;margin:8px 0 0">Role × (20 + 6 × level). Level <span id="lvTo">5</span> needs <b class="num" id="lvNeed">200</b> XP to reach the next.</p>
  </div>

  <h3 class="sec">Starting wealth</h3>
  <div class="tbl-wrap" data-ctx="Starting wealth"><table><thead><tr><th><button class="die" data-roll="D4">D4</button></th><th>Marks</th><th>Equipment</th></tr></thead><tbody>
  ${T.wealth.map(w=>`<tr><td class="n">${w.roll}</td><td class="n">${w.marks}</td><td>${esc(w.gear)}</td></tr>`).join("")}</tbody></table></div>

  <h3 class="sec">Materials</h3>
  <div class="tbl-wrap"><table><thead><tr><th>Tier</th><th>Material</th><th>Notes</th></tr></thead><tbody>
  ${T.materials.map(([t,n,d])=>`<tr><td class="n">${t}</td><td><b>${esc(n)}</b></td><td>${esc(d)}</td></tr>`).join("")}</tbody></table></div>

  <h3 class="sec">Potions and consumables</h3>
  <div class="tbl-wrap"><table><thead><tr><th>Item</th><th>Effect</th><th>Marks</th></tr></thead><tbody>
  ${T.consumables.map(([n,e,m])=>`<tr><td><b>${esc(n)}</b></td><td data-ctx="${esc(n)}">${linkDice(e)}</td><td class="n">${m}</td></tr>`).join("")}</tbody></table></div>

  <h3 class="sec">Enchantments</h3>
  <div class="tbl-wrap"><table><thead><tr><th>Name</th><th>Slot</th><th>Effect</th></tr></thead><tbody>
  ${T.enchantments.map(([n,s,t,e])=>`<tr><td><b>${esc(n)}</b><br><span class="muted">${t}</span></td><td>${esc(s)}</td><td data-ctx="${esc(n)}">${linkDice(e)}</td></tr>`).join("")}</tbody></table></div>

  <h3 class="sec">Sizes</h3>
  <div class="tbl-wrap"><table><thead><tr><th>Size</th><th>Space</th><th>Effect</th></tr></thead><tbody>
  ${T.sizes.map(([a,b,c])=>`<tr><td><b>${a}</b></td><td>${b}</td><td>${c}</td></tr>`).join("")}</tbody></table></div>`;
}

V.rule = (p) => { state.tab = "rules"; state.ruleGroup = DATA.rules.find(s=>s.id===p.id).group; state.stack = []; state.pendingOpen = p.id; return V.rules(); };

/* ---------- tactical deck (rules in ../shared/tactics-deck.js) ---------- */
const DK = window.PrimordiumDeck;
const TAC = Object.assign({level:{base:0, path:"", ptier:0}, picks:{}, suit:""}, store.get("tactics", {}));
const deckBuild = () => DK.build(TAC.level, TAC.picks, TAC.suit);
let DECK = DK.fit(store.get("deck2", null), deckBuild());
const saveTac = () => { store.set("tactics", TAC); DECK = DK.fit(DECK, deckBuild()); store.set("deck2", DECK); };
function deckHTML(){
  const b = deckBuild();
  const lv = TAC.level, cur = JSON.stringify([lv.base, lv.path||"", lv.ptier||0]);
  const opt = l => { const v = JSON.stringify([l.base, l.path, l.ptier]); return `<option value='${v}' ${v===cur?"selected":""}>${esc(DK.levelLabel(l))}</option>`; };
  const levels = `<optgroup label="Base tiers">${DK.LEVELS.filter(l=>!l.path).map(opt).join("")}</optgroup>` +
    DK.PATHS.map(p => `<optgroup label="${esc(p)} path">${DK.LEVELS.filter(l=>l.path===p).map(opt).join("")}</optgroup>`).join("");
  const perks = b.granted.filter(g => g.name !== "Basic Tactics");
  return `<div class="panel tac-panel">
    <label class="fieldrow" for="tacLevel"><span>Tactics skill</span><select id="tacLevel">${levels}</select></label>
    ${b.needsSuit ? `<label class="fieldrow" for="tacSuit"><span>Suit Mastery suit</span><select id="tacSuit"><option value="">Choose a suit</option>${DK.SUITS.map(([sym,n])=>`<option value="${n}" ${TAC.suit===n?"selected":""}>${sym} ${n}</option>`).join("")}</select></label>` : ""}
    <div class="decklist">${DK.RAR.filter(r=>b.counts[r]).map(r=>`<span>${chip(r)}<b class="num">${b.counts[r]}</b></span>`).join("")}</div>
    ${perks.length ? `<details class="fold"><summary>What this level grants (${perks.length})</summary><div>${perks.map(g=>`<div class="entry" data-ctx="${esc(g.name)}"><div class="entry-head"><span class="entry-name">${esc(g.name)}</span><span style="display:flex;gap:8px;align-items:center">${g.kind==="perk"?`<span class="tag perk">Perk</span>`:`<span class="tag">${esc(g.type||"")}</span>${chip(g.rarity)}`}</span></div><p class="use">${linkDice(g.usage||"")}</p><p class="muted ui" style="font-size:.78rem;margin:4px 0 0">${esc(g.tier)}</p></div>`).join("")}</div></details>` : ""}
    <details class="fold"><summary>Card assignment</summary><div>
      ${b.steps.length ? b.steps.map(st=>`<label class="fieldrow"><span>${esc(st.perk)}: ${esc(st.label)}</span><select data-promo="${esc(st.key)}">${st.options.map(o=>`<option value="${esc(o.v)}" ${o.v===st.value?"selected":""}>${esc(o.label)}</option>`).join("")}</select></label>`).join("") : `<p class="muted ui" style="font-size:.85rem;margin:0">No promotions at this level. Tactics Base Tier 1 adds the first.</p>`}
      <div class="tbl-wrap" style="margin-top:10px"><table><thead><tr><th>Rarity</th><th>Cards</th><th>Which cards</th></tr></thead><tbody>
      ${DK.RAR.filter(r=>b.counts[r]).map(r=>`<tr><td>${chip(r)}</td><td class="n">${b.counts[r]}</td><td>${esc(b.mapping[r])}</td></tr>`).join("")}</tbody></table></div>
      ${b.f.wild ? `<p class="muted ui" style="font-size:.82rem;margin:8px 0 0">Jokers are wild: each counts as any rarity up to ${b.f.wildCap}.</p>` : ""}
    </div></details>
  </div>
  ${DK.render(DECK, b, {session:true})}
  <h3 class="sec">Rarity by card</h3>
  ${ladderHTML("Mythic").replace(/ off/g,"").replace(/<i>[^<]*<\/i>/g,"")}`;
}

V.dice = () => {
  const view = state.diceView;
  const seg = `<div class="seg" role="group" aria-label="Dice or deck">${[["dice","Dice"],["deck","Deck"]].map(([k,l])=>`<button aria-pressed="${k===view}" data-dview="${k}">${l}</button>`).join("")}</div>`;
  if (view==="deck") return `<p class="eyebrow">Tactical deck · ${deckBuild().cards.length - 52 > 1 ? "52 cards and two jokers" : "52 cards and a joker"}</p><h2 class="leaf-title">Draw</h2>${seg}${deckHTML()}`;
  const faces = [4,6,8,10,12,20];
  const count = f => state.pool.filter(x=>x===f).length;
  const expr = poolExpr();
  return `<p class="eyebrow">Dice tray</p><h2 class="leaf-title">Roll</h2>${seg}
  <div class="tray" style="margin-top:12px">${faces.map(f=>`<button class="dbtn" data-add="${f}" aria-label="Add a D${f}">${dieSVG(f)}<b>D${f}</b>${count(f)?`<span class="n">×${count(f)}</span>`:""}</button>`).join("")}</div>
  <div class="pool"><code>${expr || "Tap dice to build a roll"}</code>
    <span class="btns"><button class="btn ghost" data-mod="-1" aria-label="Minus one">−1</button><button class="btn ghost" data-mod="1" aria-label="Plus one">+1</button></span></div>
  <div class="btns"><button class="btn" id="poolRoll" ${expr?"":"disabled"}>Roll ${expr?esc(expr):""}</button><button class="btn ghost" id="poolClear">Clear</button></div>

  <h3 class="sec">Table rolls</h3>
  <div class="grid2">
    <button class="quick" data-quick="contest"><b>Contest</b><span>D10 + stat, ties to defender</span></button>
    <button class="quick" data-quick="rec"><b>Recovery</b><span>D4 · 1 never recovers</span></button>
    <button class="quick" data-quick="speed"><b>Speed roll</b><span>D10 + Speed, min 2M</span></button>
    <button class="quick" data-quick="ood"><b>Out of combat</b><span>D10 · Rare 4 · Epic 7 · Leg 9</span></button>
  </div>
  <label class="inline" style="margin-top:10px" for="qmod">Modifier for table rolls <input id="qmod" type="number" value="${store.get("qmod",0)}" style="width:70px"></label>

  <h3 class="sec">History</h3>
  <div class="hist">${state.history.length?`<ol>${state.history.slice(0,12).map(h=>`<li><span><b>${esc(h.label)}</b><br><span class="muted">${esc(h.parts)}${h.extra?" · "+esc(h.extra):""}</span></span><span class="tot">${h.total}</span></li>`).join("")}</ol>`:`<p class="muted">Rolls from anywhere in the Codex land here.</p>`}</div>
  ${fxSettingsHTML()}`;
};
// Effects settings, shared with the sheet and the GM tool (same site, same storage).
function fxSettingsHTML(){
  const c = FX.settings();
  const row = (k, label) => `<div class="fxrow"><span>${label}</span><div class="seg" role="group" aria-label="${label}">${[[true,"On"],[false,"Off"]].map(([v,l])=>`<button aria-pressed="${c[k]===v}" data-fx="${k}" data-v="${v}">${l}</button>`).join("")}</div></div>`;
  return `<h3 class="sec">Effects</h3><div class="panel" style="margin-top:0">${row("visual","Impact effects")}${row("sound","Sound")}${row("haptics","Vibration")}
    <p class="muted ui" style="font-size:.8rem;margin:8px 0 0">Crits, card plays from Rare to Mythic, and other flourishes. Shared with the character sheet on this phone.</p></div>`;
}
function poolExpr(){
  const faces = [20,12,10,8,6,4]; const parts = [];
  faces.forEach(f=>{ const c = state.pool.filter(x=>x===f).length; if (c) parts.push((c>1?c:"")+"D"+f); });
  let e = parts.join("+"); if (e && state.mod) e += (state.mod>0?"+":"-")+Math.abs(state.mod); return e;
}
function dieSVG(f){
  const shapes = {4:'<path d="M12 3 21 19H3z"/>',6:'<rect x="4" y="4" width="16" height="16" rx="2"/>',8:'<path d="M12 2 21 12 12 22 3 12z"/><path d="M3 12h18"/>',
    10:'<path d="M12 2 21 10 12 22 3 10z"/><path d="M3 10 12 14 21 10M12 14v8"/>',12:'<path d="M12 2.5 21 9l-3.4 10.5H6.4L3 9z"/><path d="M12 7l4.5 3.3-1.7 5.2H9.2l-1.7-5.2z"/>',
    20:'<path d="M12 2.5 20.5 7.5v9L12 21.5 3.5 16.5v-9z"/><path d="M12 2.5 7.5 15h9zM3.5 7.5 7.5 15 12 21.5 16.5 15l4-7.5"/>'};
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true">${shapes[f]}</svg>`;
}

/* ---------- render ---------- */
function render(){
  document.querySelectorAll("nav.tabs button").forEach(b => b.setAttribute("aria-current", b.dataset.tab===state.tab && !state.q ? "page" : "false"));
  let html;
  if (state.q.trim()) html = V.search();
  else if (state.stack.length){ const p = state.stack[state.stack.length-1]; html = V[p.type](p); }
  else html = V[state.tab]();
  $("#view").innerHTML = html;
  if (state.pendingOpen){ const d = document.getElementById("sec-"+state.pendingOpen); if (d){ d.open = true; setTimeout(()=>d.scrollIntoView({block:"start"}),0); } state.pendingOpen = null; }
  const hl = document.getElementById("hl"); if (hl){ hl.style.background = "color-mix(in srgb, var(--glow) 9%, transparent)"; setTimeout(()=>hl.scrollIntoView({block:"center"}),0); }
}

$("#view").addEventListener("click", e => {
  const t = e.target;
  const o = t.closest("[data-open]"); if (o){ const p = JSON.parse(o.dataset.open); if (state.q){ state.q=""; $("#q").value=""; $("#qclear").hidden=true; } if (p.type==="rule"){ V.rule(p); render(); return; } open(p); return; }
  if (t.closest("[data-back]")) return back();
  const gt = t.closest("[data-goto]"); if (gt) return go(gt.dataset.goto);
  const pth = t.closest("[data-path]"); if (pth){ const top = state.stack[state.stack.length-1]; top.path = pth.dataset.path==="Base"?null:pth.dataset.path; top.hl = null; return render(); }
  const rl = t.closest("[data-role]"); if (rl){ state.roleFilter = rl.dataset.role; return render(); }
  const rg = t.closest("[data-rg]"); if (rg){ state.ruleGroup = rg.dataset.rg; return render(); }
  const tg = t.closest("[data-tg]"); if (tg){ const top = state.stack[state.stack.length-1]; top.g = +tg.dataset.tg; top.hl=null; return render(); }
  const tr = t.closest("[data-tacrow]"); if (tr){ store.set("tacRow", tr.dataset.tacrow); return render(); }
  if (t.closest("#tacGo")){
    const row = store.get("tacRow","Good");
    const res = rollExpr("D20"), r = tacticsRarity(row, res.total);
    showRoll(`Tactics · ${row}`, res, r, {quiet:true});
    $("#ladder").outerHTML = ladderHTML(row, r).replace(/<div class="ladder-names">[\s\S]*$/, "");
    $("#tacOut").innerHTML = `<div class="verdict"><span class="big">${res.total}</span>${chip(r)}<p class="muted ui" style="margin:6px 0 0;font-size:.85rem">If nothing at ${r} is ready, drop one rarity at a time.</p></div>`;
    FX.tumble($("#tacOut .big"), res.total, 20, FX.judge(res)?.kind);
    FX.card(r, $("#ladder .c.hit") || $("#ladder"));
    return;
  }
  const fxb = t.closest("[data-fx]"); if (fxb){ FX.settings({[fxb.dataset.fx]: fxb.dataset.v === "true"}); render(); if (fxb.dataset.fx==="visual" && fxb.dataset.v==="true") FX.card("Epic", fxb); if (fxb.dataset.fx==="sound" && fxb.dataset.v==="true") FX.card("Rare", fxb); return; }
  const dk = t.closest("[data-deck]"); if (dk){
    const from = FX.rectOf(document.querySelectorAll(".hand .pcard[aria-pressed=true]")) || lastTap;
    const ev = DK.act(DECK, deckBuild(), dk.dataset.deck, dk.dataset.i); store.set("deck2", DECK); render();
    FX.deal(ev.drawn.map(id => document.querySelector(`.hand [data-card="${CSS.escape(id)}"]`)));
    if (ev.played) FX.card(ev.played.rarity, from);
    return;
  }
  const dv = t.closest("[data-dview]"); if (dv){ state.diceView = dv.dataset.dview; store.set("diceView", state.diceView); return render(); }
  const tac = t.closest("[data-tactic]");
  if (tac){
    const n = DATA.npcs.find(x=>x.id===tac.dataset.tactic);
    const turns = n.turns; let out = "", top = 0; const totals = [];
    for (let i=0;i<turns;i++){
      const res = rollExpr("D20"), r = tacticsRarity(n.tactics, res.total), {a, dropped} = resolveAbility(n, r);
      if (i===0) showRoll(`${n.name} · tactics`, res, a ? a.name : r, {quiet:true});
      top = Math.max(top, RAR.indexOf(a ? a.rarity : r)); totals.push(res);
      out += `<div class="verdict" data-ctx="${esc(n.name+(a?" · "+a.name:""))}"><div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px 10px">${turns>1?`<span class="tag">Turn ${i+1}</span>`:""}<span class="big">${res.total}</span>${chip(r)}</div>
        ${a ? `<p style="margin:8px 0 0"><b>${esc(a.name)}</b>${dropped?` <span class="muted ui" style="font-size:.8rem">(dropped to ${a.rarity})</span>`:""}<br>${linkDice(a.text)}</p>`
            : `<p class="muted" style="margin:8px 0 0">Humanoid: use its combat skill at ${r} or below.</p>`}</div>`;
    }
    $("#npcOut").innerHTML = out;
    document.querySelectorAll("#npcOut .big").forEach((el,i) => FX.tumble(el, totals[i].total, 20, FX.judge(totals[i])?.kind));
    FX.card(RAR[top], $("#npcOut")); return;
  }
  const add = t.closest("[data-add]"); if (add){ state.pool.push(+add.dataset.add); return render(); }
  const md = t.closest("[data-mod]"); if (md){ state.mod += +md.dataset.mod; return render(); }
  if (t.id==="poolRoll"){ const e2 = poolExpr(); if (e2){ showRoll("Tray · "+e2, rollExpr(e2)); render(); } return; }
  if (t.id==="poolClear"){ state.pool=[]; state.mod=0; return render(); }
  const q = t.closest("[data-quick]");
  if (q){
    const m = +($("#qmod").value||0); store.set("qmod", m); const k = q.dataset.quick;
    if (k==="contest"){ const r = rollExpr("D10"+(m?(m>0?"+":"")+m:"")); showRoll("Contest", r, "ties go to the defender, dodges tie to the attacker"); }
    if (k==="speed"){ const r = rollExpr("D10"+(m?(m>0?"+":"")+m:"")); showRoll("Speed roll", r, `move ${Math.max(2,r.total)}M`); }
    if (k==="rec"){ const r = rollExpr("D4"); showRoll("Recovery", r, r.total===1?"never recovers":"recovers if it meets the target (4, then 3, then 2)"); }
    if (k==="ood"){ const r = rollExpr("D10"); const best = r.total>=9?"Legendary":r.total>=7?"Epic":r.total>=4?"Rare":"none"; showRoll("Out-of-combat ability", r, best==="none"?"Rare and above fail":"succeeds up to "+best); }
    return render();
  }
});
$("#view").addEventListener("input", e => {
  if (e.target.id==="party"){ const n = Math.max(1, +e.target.value||1); store.set("party", n); const npc = DATA.npcs.find(x=>x.id===state.stack[state.stack.length-1].id); $("#xpEach").textContent = Math.round(npc.xp/n); }
  if (e.target.id==="xpRole" || e.target.id==="xpLvl"){
    const role = $("#xpRole").value, lv = Math.max(1, +$("#xpLvl").value||1);
    $("#xpOut").textContent = Math.round(DATA.tables.roles[role]*(20+6*lv));
    $("#lvTo").textContent = lv; $("#lvNeed").textContent = 100 + 25*(lv-1);
  }
});
$("#view").addEventListener("change", e => {
  const t = e.target;
  if (t.id==="xpRole") t.dispatchEvent(new Event("input",{bubbles:true}));
  if (t.id==="tacLevel"){ const [base, path, ptier] = JSON.parse(t.value); TAC.level = {base, path, ptier}; saveTac(); render(); }
  if (t.id==="tacSuit"){ TAC.suit = t.value; saveTac(); render(); }
  if (t.dataset.promo){ TAC.picks[t.dataset.promo] = t.value; saveTac(); render(); }
});

render();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
})();
