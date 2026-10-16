// The tactical deck, shared by the Codex and the character sheet. Needs core.js and primordium-data.js loaded first.
// build(level, picks, suit) turns a Tactics level (base tier, path, path tier) into the actual 52 cards
// and jokers with their rarities, applying each promotion perk. newState/act/render run a hand of cards
// with every mechanic the Tactics perks add. State is plain JSON so each app can save it.
(function (root) {
  const D = root.PRIMORDIUM_DATA;
  const TAC = D.skills.find(s => s.name === 'Tactics');
  const { RARITIES: RAR, esc, article, rarityStep: up } = root.PrimordiumCore;
  const SUITS = [['♠', 'Spades', 'b'], ['♥', 'Hearts', 'r'], ['♦', 'Diamonds', 'r'], ['♣', 'Clubs', 'b']];
  const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const PLURAL = {J: 'Jacks', Q: 'Queens', K: 'Kings', A: 'Aces'};
  const RIDERS = {Spades: 'Spades rider: reroll one damage die.', Hearts: 'Hearts rider: make a recovery roll, or heal 1D4.',
    Diamonds: 'Diamonds rider: reroll a natural 1 or a failed accuracy roll.', Clubs: 'Clubs rider: +2 armor until your next turn.'};
  const PATHS = Object.keys(TAC.paths);

  // Game Guide default: 2-6 and black 7s Basic; red 7s, 8-10, black Jacks Common; red Jacks, Queens,
  // black Kings Uncommon; red Kings, black Aces Rare; red Aces Epic; the joker Legendary.
  function defaultRarity(rank, color) {
    if (['2', '3', '4', '5', '6'].includes(rank)) return 'Basic';
    if (rank === '7') return color === 'b' ? 'Basic' : 'Common';
    if (['8', '9', '10'].includes(rank)) return 'Common';
    if (rank === 'J') return color === 'b' ? 'Common' : 'Uncommon';
    if (rank === 'Q') return 'Uncommon';
    if (rank === 'K') return color === 'b' ? 'Uncommon' : 'Rare';
    return color === 'b' ? 'Rare' : 'Epic';
  }

  // How each Tactics perk changes the deck. "number" = all four cards of one rank, "color" = the two
  // cards of one rank and color, "card" = a single card.
  const PROMOS = {
    'Improved Tactics': [{t: 'number', from: 'Basic', to: 'Common'}],
    'Trained Tactics': [{t: 'number', from: 'Uncommon', to: 'Rare'}],
    'Seasoned Tactics': [{t: 'number', from: 'Common', to: 'Uncommon'}, {t: 'color', from: 'Rare', to: 'Epic'}],
    'Wild Card': [{t: 'addJoker'}],
    'Focused Training': [{t: 'color', from: 'Rare', to: 'Epic'}],
    'Specialist': [{t: 'number', from: 'Uncommon', to: 'Rare'}],
    'Mastery': [{t: 'card', from: 'Epic', to: 'Legendary'}, {t: 'card', from: 'Epic', to: 'Legendary'}],
    'Grand Strategy': [{t: 'jokerTo', to: 'Mythic'}],
    "Officer's Training": [{t: 'number', from: 'Common', to: 'Uncommon'}],
    'Veteran Command': [{t: 'card', from: 'Epic', to: 'Legendary'}],
  };

  // Everything the Tactics skill grants at this level, in tier order.
  function grantedAt(level) {
    const base = Math.max(0, Math.min(4, +level.base || 0)), out = [];
    for (let t = 0; t <= base; t++) (TAC.base[t] || []).forEach(i => out.push({...i, tier: t === 0 ? 'Tier 0' : `Base Tier ${t}`}));
    if (base >= 4 && TAC.paths[level.path]) for (let t = 1; t <= Math.min(4, +level.ptier || 0); t++)
      (TAC.paths[level.path][t] || []).forEach(i => out.push({...i, tier: `${level.path} Tier ${t}`}));
    return out;
  }

  const rankName = r => PLURAL[r] || r + 's';
  function options(step, cards) {
    if (step.t === 'number') return RANKS.filter(r => cards.filter(c => c.r === r).every(c => c.rar === step.from))
      .map(r => ({v: r, label: rankName(r)}));
    if (step.t === 'color') return RANKS.flatMap(r => [['r', 'red'], ['b', 'black']].filter(([c]) => cards.filter(x => x.r === r && x.c === c).every(x => x.rar === step.from))
      .map(([c, w]) => ({v: r + c, label: `${w} ${rankName(r)}`})));
    if (step.t === 'card') return cards.filter(c => c.rar === step.from && c.r !== 'JK').map(c => ({v: c.id, label: c.id}));
    return [];
  }
  function stepLabel(step) {
    if (step.t === 'number') return `${step.from} number to ${step.to}`;
    if (step.t === 'color') return `${step.from} color to ${step.to}`;
    if (step.t === 'card') return `${step.from} card to ${step.to}`;
    return '';
  }

  // Which cards hold one rarity, in the guide's wording ("2 through 5, black 7s").
  function describe(cards, rar) {
    const items = [];
    RANKS.forEach((r, i) => {
      const of = cards.filter(c => c.r === r), mine = of.filter(c => c.rar === rar);
      if (!mine.length) return;
      if (mine.length === 4) return items.push({i, full: r});
      for (const [c, w] of [['r', 'red'], ['b', 'black']]) {
        const pair = of.filter(x => x.c === c);
        if (pair.every(x => x.rar === rar)) items.push({i, text: `${w} ${rankName(r)}`});
        else pair.filter(x => x.rar === rar).forEach(x => items.push({i, text: x.id}));
      }
    });
    const out = []; let run = [];
    const flush = () => { if (!run.length) return; const nums = run.every(x => /\d/.test(x.full));
      out.push(run.length >= 3 && nums ? `${run[0].full} through ${run[run.length - 1].full}` : run.map(x => rankName(x.full)).join(', ')); run = []; };
    items.forEach(it => {
      if (it.full) { if (run.length && run[run.length - 1].i !== it.i - 1) flush(); run.push(it); }
      else { flush(); out.push(it.text); }
    });
    flush();
    const jk = cards.filter(c => c.r === 'JK' && c.rar === rar).length;
    if (jk) out.push(jk > 1 ? 'both jokers' : 'the joker');
    const s = out.join(', ');
    return s ? s[0].toUpperCase() + s.slice(1) : '';
  }

  function build(level, picks = {}, suit = '') {
    const granted = grantedAt(level), names = new Set(granted.map(i => i.name));
    const cards = [];
    SUITS.forEach(([s, name, c]) => RANKS.forEach(r => cards.push({id: r + s, r, s, suit: name, c, rar: defaultRarity(r, c)})));
    cards.push({id: 'JK1', r: 'JK', s: '★', suit: '', c: 'x', rar: 'Legendary'});
    const steps = [];
    granted.forEach(g => (PROMOS[g.name] || []).forEach((step, k) => {
      if (step.t === 'addJoker') { cards.push({id: 'JK2', r: 'JK', s: '★', suit: '', c: 'x', rar: 'Legendary'}); return; }
      if (step.t === 'jokerTo') { cards.filter(c => c.r === 'JK').forEach(c => c.rar = step.to); return; }
      const key = `${g.name}#${k}`, opts = options(step, cards);
      const value = opts.some(o => o.v === picks[key]) ? picks[key] : (opts.length ? opts[opts.length - 1].v : '');
      steps.push({key, perk: g.name, tier: g.tier, label: stepLabel(step), options: opts, value});
      if (!value) return;
      if (step.t === 'number') cards.filter(c => c.r === value).forEach(c => c.rar = step.to);
      if (step.t === 'color') cards.filter(c => c.r === value.slice(0, -1) && c.c === value.slice(-1)).forEach(c => c.rar = step.to);
      if (step.t === 'card') cards.find(c => c.id === value).rar = step.to;
    }));
    const f = {
      quickReeval: names.has('Quick Re-Evaluation'), suitMastery: names.has('Suit Mastery'), foresight: names.has('Foresight'),
      wild: names.has('Wild Card'), sideBet: names.has('Side Bet'), threeKind: names.has('Three of a Kind'), fullDeck: names.has('Full Deck'),
      fortune: names.has("Fortune's Favor"), stackDeck: names.has('Stack the Deck'),
      reserve: names.has('Grand Strategy') ? 2 : names.has('Held in Reserve') ? 1 : 0,
      measured: names.has('Measured Breather'), masterPlan: names.has('Master Plan'), lead: names.has('Lead by Example'),
      hearts: names.has("Commander's Hearts"), battlePlan: names.has('Battle Plan'), rally: names.has('Rally'), victoryPlan: names.has('Victory Plan'),
    };
    f.wildCap = names.has('House Rules') ? 'Mythic' : 'Legendary';
    const riders = f.fullDeck ? SUITS.map(s => s[1]) : f.suitMastery && suit ? [suit] : [];
    const counts = Object.fromEntries(RAR.map(r => [r, cards.filter(c => c.rar === r).length]));
    const mapping = Object.fromEntries(RAR.map(r => [r, describe(cards, r)]));
    return {level, granted, steps, cards, byId: Object.fromEntries(cards.map(c => [c.id, c])), counts, mapping, riders, f,
      needsSuit: f.suitMastery && !f.fullDeck, suit};
  }

  // A Tactics level as a short phrase, and the full list of levels for a picker.
  const levelLabel = l => (+l.base || 0) < 4 || !l.path || !(+l.ptier) ? `Base Tier ${+l.base || 0}` : `${l.path} Tier ${l.ptier}`;
  const LEVELS = [0, 1, 2, 3, 4].map(b => ({base: b, path: '', ptier: 0}))
    .concat(PATHS.flatMap(p => [1, 2, 3, 4].map(t => ({base: 4, path: p, ptier: t}))));

  /* ---------- running a hand ---------- */
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sig = b => b.cards.map(c => c.id).join(',');
  function newState(b) {
    const draw = shuffle(b.cards.map(c => c.id));
    return {v: 1, sig: sig(b), draw, hand: draw.splice(0, 3), discard: [], reserve: [], plan: null, sel: [], used: {}, boost: false,
      peek: null, pick: null, log: 'Fresh deck. Drew 3.'};
  }
  // Keep a saved state if it still fits this deck (promotions only change rarities); start over if the cards changed.
  const fit = (s, b) => s && s.v === 1 && s.sig === sig(b) ? s : newState(b);
  const drawTo3 = s => { while (s.hand.length < 3 && s.draw.length) s.hand.push(s.draw.shift()); };
  const name = (b, id) => { const c = b.byId[id]; return c.r === 'JK' ? 'Joker' : c.id; };
  const isJoker = (b, id) => b.byId[id].r === 'JK';
  const wildJoker = (b, id) => b.f.wild && isJoker(b, id);
  // The rarity a single card pays as: a wild joker pays as high as it may count.
  const value = (b, id) => wildJoker(b, id) ? b.f.wildCap : b.byId[id].rar;
  // Two or three cards played together: they must share a rarity (wild jokers match it); the result is one
  // (pair) or two (three of a kind) rarities higher, never above Mythic.
  function combo(b, ids) {
    const step = ids.length === 2 ? 1 : 2, fixed = ids.filter(id => !wildJoker(b, id)).map(id => b.byId[id].rar);
    let base;
    if (fixed.length) { if (fixed.some(r => r !== fixed[0])) return null; base = fixed[0];
      if (fixed.length < ids.length && RAR.indexOf(base) > RAR.indexOf(b.f.wildCap)) return null; }
    else base = RAR[Math.min(RAR.indexOf(b.f.wildCap), RAR.length - 1 - step)];
    const i = RAR.indexOf(base) + step; return i < RAR.length ? RAR[i] : null;
  }
  function riderText(b, ids) {
    const suits = ids.map(id => b.byId[id].suit);
    const out = [...new Set(suits.filter(s => s && b.riders.includes(s)))].map(s => RIDERS[s]);
    if (b.f.fullDeck && out.length === 1 && suits.every(s => s === suits[0])) out[0] += ' It triggers twice.';
    if (b.f.hearts && suits.includes('Hearts')) out.push("Commander's Hearts: one ally within 10M also gains the Hearts rider.");
    return out.join(' ');
  }
  function pay(s, b, ids, rar, what) {
    if (s.boost) { rar = up(rar, 1); s.boost = false; s.used.masterPlan = true; }
    played = {rarity: rar, ids};
    const set = new Set(ids); s.discard.push(...ids); s.hand = s.hand.filter(id => !set.has(id)); s.sel = []; drawTo3(s);
    return `${what} <b>${ids.map(id => name(b, id)).join(' + ')}</b> as ${article(rar)} <b>${rar}</b> card. ${riderText(b, ids)}`.trim();
  }

  // act returns what happened, for the apps' effects: {played: {rarity, ids} | null, drawn: [card ids]}.
  let played = null;
  function act(s, b, action, arg) {
    const before = new Set(s.hand); played = null;
    step(s, b, action, arg);
    return {played, drawn: s.hand.filter(id => !before.has(id))};
  }
  function step(s, b, action, arg) {
    const picked = s.sel.map(i => s.hand[i]).filter(Boolean);
    const one = picked.length === 1 ? picked[0] : null;
    switch (action) {
      case 'sel': { const i = +arg; s.sel = s.sel.includes(i) ? s.sel.filter(x => x !== i) : [...s.sel, i].slice(-3); return; }
      case 'play': if (one) s.log = pay(s, b, [one], value(b, one), 'Played'); return;
      case 'pair': case 'three': { const r = combo(b, picked); if (r && picked.length === (action === 'pair' ? 2 : 3)) s.log = pay(s, b, picked, r, action === 'pair' ? 'Paired' : 'Three of a kind:'); return; }
      case 'reeval': { if (!picked.length) return; const n = picked.length, set = new Set(picked);
        s.discard.push(...picked); s.hand = s.hand.filter(id => !set.has(id)); s.sel = []; drawTo3(s);
        s.log = `Re-Evaluate: discarded ${n}, drew back to ${s.hand.length}. Uses your Standard action.`; return; }
      case 'quick': { if (!one) return; s.discard.push(one); s.hand = s.hand.filter(id => id !== one); s.sel = []; drawTo3(s);
        s.log = `Quick Re-Evaluation: discarded <b>${name(b, one)}</b> and drew a replacement. A Quick action; pay for it with a Common card or higher.`; return; }
      case 'lead': if (one) s.log = pay(s, b, [one], value(b, one), 'Lead by Example: played') + ` One friendly character within 10M treats the next card they play this phase as one rarity higher, up to ${value(b, one)}.`; return;
      case 'rally': { if (!one || isJoker(b, one) || s.used.rally) return; const suit = b.byId[one].suit; s.used.rally = true;
        s.log = pay(s, b, [one], value(b, one), 'Rally: played') + ` Every friendly character, including you, who plays a ${suit} card this phase treats it as one rarity higher.`; return; }
      case 'boost': if (!s.used.masterPlan) { s.boost = !s.boost; s.log = s.boost ? 'Master Plan ready: the next card you play counts as one rarity higher.' : 'Master Plan put away.'; } return;
      case 'peek': s.peek = s.draw.slice(0, 3); s.log = 'Stack the Deck: put the top cards in the order you want. A Quick action; pay for it with a Common card or higher.'; return;
      case 'peekUp': { const i = +arg; if (i > 0) [s.peek[i - 1], s.peek[i]] = [s.peek[i], s.peek[i - 1]]; return; }
      case 'peekDone': s.draw = [...s.peek, ...s.draw.slice(s.peek.length)]; s.peek = null; s.log = 'Top of the deck set.'; return;
      case 'swap': { const slot = +arg; if (!one || s.used.swap || slot >= b.f.reserve) return; const hi = s.hand.indexOf(one);
        if (s.reserve[slot]) { const back = s.reserve[slot]; s.reserve[slot] = one; s.hand[hi] = back; s.log = `Swapped <b>${name(b, one)}</b> into your reserve for <b>${name(b, back)}</b>.`; }
        else { s.reserve[slot] = one; s.hand.splice(hi, 1); drawTo3(s); s.log = `Put <b>${name(b, one)}</b> in your reserve and drew a replacement.`; }
        s.sel = []; s.used.swap = true; return; }
      case 'plan': { if (!one || s.plan) return; s.plan = one; s.hand = s.hand.filter(id => id !== one); s.sel = []; drawTo3(s);
        s.log = 'Battle plan set aside face down. Drew a replacement. Any friendly character may call it once this combat.'; return; }
      case 'callPlan': { if (!s.plan) return; const id = s.plan, ally = arg === 'ally'; let r = value(b, id);
        if (ally && b.f.victoryPlan) r = up(r, 1); s.plan = null; s.discard.push(id); played = {rarity: r, ids: [id]};
        s.log = `${ally ? 'An ally called' : 'You called'} your battle plan: <b>${name(b, id)}</b> as ${article(r)} <b>${r}</b> card.`; return; }
      case 'mark': s.used[arg] = !s.used[arg]; return;
      case 'phase': delete s.used.swap; s.log = 'New phase.'; return;
      case 'combat': ['swap', 'rally', 'sideBet', 'fortune'].forEach(k => delete s.used[k]); s.log = 'New combat: once-per-combat abilities are ready.'; return;
      case 'breather': {
        if (s.used.breather) { s.log = 'Breather already used today. A full rest resets it.'; return; }
        if (b.f.measured) { s.pick = {ids: s.discard.slice(-12).reverse(), keep: []}; s.log = 'Measured Breather: choose up to 8 of the top 12 discards to keep.'; return; }
        const back = s.discard.splice(-8, 8); s.draw = shuffle([...s.draw, ...back]); s.used.breather = true; drawTo3(s);
        s.log = `Breather: the top ${back.length} cards of your discard pile shuffled back into your deck.`; return; }
      case 'pickToggle': { const k = s.pick.keep; s.pick.keep = k.includes(arg) ? k.filter(x => x !== arg) : k.length < 8 ? [...k, arg] : k; return; }
      case 'pickDone': { const keep = new Set(s.pick.keep); s.discard = s.discard.filter(id => !keep.has(id)); s.draw = shuffle([...s.draw, ...keep]);
        s.log = `Measured Breather: kept ${keep.size} cards, shuffled into your deck.`; s.pick = null; s.used.breather = true; drawTo3(s); return; }
      case 'rest': { const keep = s.reserve.slice(); Object.assign(s, newState(b)); s.reserve = keep;
        const held = new Set(keep); s.draw = s.draw.filter(id => !held.has(id)); s.hand = s.hand.filter(id => !held.has(id)); drawTo3(s);
        s.log = 'Full rest: whole deck reshuffled, drew 3. Breather and once-per-day abilities are ready.' + (keep.length ? ' Your reserve stays.' : ''); return; }
    }
  }

  /* ---------- the hand, as HTML (each app styles these classes) ---------- */
  function cardHTML(b, id, attrs = '', label) {
    const c = b.byId[id], rar = c.rar, lab = label || (wildJoker(b, id) ? `Wild · ${b.f.wildCap}` : rar);
    return `<button class="pcard r-${rar}" data-card="${esc(id)}" ${attrs} aria-label="${esc(name(b, id))}, ${esc(lab)}"><span class="rk">${c.r === 'JK' ? 'JK' : esc(c.r)}<small>${c.r === 'JK' ? '' : c.s}</small></span><span class="mid">${c.s}</span><span class="lbl">${esc(lab)}</span></button>`;
  }
  function render(s, b, opts = {}) {
    const picked = s.sel.map(i => s.hand[i]).filter(Boolean), f = b.f;
    const pairTo = picked.length === 2 ? combo(b, picked) : null, threeTo = picked.length === 3 && f.threeKind ? combo(b, picked) : null;
    const best = s.hand.reduce((m, id) => Math.max(m, RAR.indexOf(value(b, id))), -1);
    const btn = (act, label, on, cls = 'btn', i = '') => `<button class="${cls}" data-deck="${act}" ${i !== '' ? `data-i="${esc(i)}"` : ''} ${on ? '' : 'disabled'}>${label}</button>`;
    const one = picked.length === 1, top = s.draw[0];
    let h = `<div class="deckbar"><span>Draw pile <b>${s.draw.length}</b></span><span>Discard <b>${s.discard.length}</b></span><span>Breather <b>${s.used.breather ? 'used' : 'ready'}</b></span></div>`;
    if (f.foresight) h += `<p class="deck-note">Foresight: the top card is <b>${top ? esc(name(b, top)) + ' (' + value(b, top) + ')' : 'none, the deck is empty'}</b>.</p>`;
    if (s.pick) return h + `<p class="deck-note">Measured Breather: tap the cards to keep (${s.pick.keep.length} of ${Math.min(8, s.pick.ids.length)}).</p>
      <div class="cardrow">${s.pick.ids.map(id => cardHTML(b, id, `data-deck="pickToggle" data-i="${esc(id)}" aria-pressed="${s.pick.keep.includes(id)}"`)).join('')}</div>
      <div class="btns">${btn('pickDone', 'Keep these', s.pick.keep.length === Math.min(8, s.pick.ids.length))}</div>`;
    if (s.peek) return h + `<p class="deck-note">Stack the Deck: the first card is drawn first. Tap ↑ to move a card earlier.</p>
      <div class="cardrow">${s.peek.map((id, i) => `<div class="peek">${cardHTML(b, id, 'tabindex="-1" disabled')}${i ? btn('peekUp', '↑', true, 'btn ghost', i) : '<span class="peek-first">First</span>'}</div>`).join('')}</div>
      <div class="btns">${btn('peekDone', 'Done', true)}</div>`;
    h += `<div class="hand">${[0, 1, 2].map(i => s.hand[i] ? cardHTML(b, s.hand[i], `data-deck="sel" data-i="${i}" aria-pressed="${s.sel.includes(i)}"`) : '<div class="pcard empty">No card</div>').join('')}</div>`;
    const slots = [];
    for (let k = 0; k < f.reserve; k++) slots.push(`<div class="slot"><span>Reserve${f.reserve > 1 ? ' ' + (k + 1) : ''}</span>${s.reserve[k] ? cardHTML(b, s.reserve[k], 'tabindex="-1" disabled') : '<div class="pcard empty">Empty</div>'}</div>`);
    if (f.battlePlan) slots.push(`<div class="slot"><span>Battle plan</span>${s.plan ? '<div class="pcard facedown" aria-label="Battle plan, face down"><span class="mid">✦</span><span class="lbl">Face down</span></div>' : '<div class="pcard empty">None</div>'}</div>`);
    if (slots.length) h += `<div class="slots">${slots.join('')}</div>`;
    h += `<p class="deck-note">${s.hand.length ? `Tap cards to select. This hand can pay up to <b>${RAR[best]}</b>.` : 'Out of cards: Basic abilities still work with no card.'}${s.boost ? ' <b>Master Plan is ready.</b>' : ''}</p>`;
    h += `<div class="btns">${btn('play', 'Play card', one)}${btn('pair', 'Play pair' + (pairTo ? ' as ' + pairTo : ''), !!pairTo)}${f.threeKind ? btn('three', 'Play three' + (threeTo ? ' as ' + threeTo : ''), !!threeTo) : ''}${btn('reeval', 'Re-Evaluate', picked.length > 0, 'btn ghost')}</div>`;
    const tac = [];
    if (f.quickReeval) tac.push(btn('quick', 'Quick Re-Evaluation', one, 'btn ghost'));
    if (f.stackDeck) tac.push(btn('peek', 'Stack the Deck', s.draw.length > 0, 'btn ghost'));
    for (let k = 0; k < f.reserve; k++) tac.push(btn('swap', `Swap with reserve${f.reserve > 1 ? ' ' + (k + 1) : ''}${s.used.swap ? ' (used this phase)' : ''}`, one && !s.used.swap, 'btn ghost', k));
    if (f.battlePlan) tac.push(s.plan ? btn('callPlan', f.victoryPlan ? 'Ally calls plan (+1 rarity)' : 'Ally calls plan', true, 'btn ghost', 'ally') + btn('callPlan', 'Call plan yourself', true, 'btn ghost', 'self')
      : btn('plan', 'Set battle plan', one, 'btn ghost'));
    if (f.lead) tac.push(btn('lead', 'Lead by Example', one, 'btn ghost'));
    if (f.rally) tac.push(btn('rally', s.used.rally ? 'Rally (used this combat)' : 'Rally', one && !s.used.rally && !isJoker(b, picked[0]), 'btn ghost'));
    if (f.masterPlan) tac.push(btn('boost', s.used.masterPlan ? 'Master Plan (used today)' : s.boost ? 'Put away Master Plan' : 'Master Plan: next card +1', !s.used.masterPlan, 'btn ghost'));
    if (tac.length) h += `<p class="deck-sub">Tactics</p><div class="btns">${tac.join('')}</div>`;
    const marks = [];
    if (f.sideBet) marks.push(['sideBet', 'Side Bet']);
    if (f.fortune) marks.push(['fortune', "Fortune's Favor"]);
    if (marks.length) h += `<div class="marks">${marks.map(([k, l]) => `<button class="mark" data-deck="mark" data-i="${k}" aria-pressed="${!!s.used[k]}">${l}: ${s.used[k] ? 'used' : 'ready'}</button>`).join('')}<span>Once per combat</span></div>`;
    h += `<p class="deck-log">${s.log || ''}</p>`;
    // session: the Codex's own between-fights buttons. The sheet has its own breather, rest, and end of combat.
    if (opts.session) h += `<div class="btns">${f.reserve ? btn('phase', 'New phase', true, 'btn ghost') : ''}${btn('combat', 'New combat', true, 'btn ghost')}${btn('breather', f.measured ? 'Breather · keep 8 of 12' : 'Breather · 8 back', !s.used.breather, 'btn ghost')}${btn('rest', 'Full rest', true, 'btn ghost')}</div>`;
    else if (f.reserve) h += `<div class="btns">${btn('phase', 'New phase', true, 'btn ghost')}</div>`;
    h += `<p class="deck-note">Suit riders: ${b.riders.length ? b.riders.map(r => esc(RIDERS[r])).join(' ') + (b.f.fullDeck ? ' A rider triggers twice when every card paying for an ability shares its suit.' : '') : b.needsSuit ? 'choose your Suit Mastery suit.' : 'none yet (Tactics Base Tier 2).'}</p>`;
    return h;
  }

  // A tap on a deck button ([data-deck]), the same in every app: act, save and redraw (the app's redraw does both),
  // then deal the drawn cards in and land the played card's impact (shared/fx.js, when loaded).
  function tap(s, b, button, redraw) {
    const fx = root.PrimordiumFX;
    const from = fx && (fx.rectOf(document.querySelectorAll('.hand .pcard[aria-pressed="true"]')) || fx.lastTap());
    const ev = act(s, b, button.dataset.deck, button.dataset.i);
    redraw();
    if (!fx) return ev;
    fx.deal(ev.drawn.map(id => document.querySelector(`.hand [data-card="${CSS.escape(id)}"]`)));
    if (ev.played) fx.card(ev.played.rarity, from);
    return ev;
  }

  root.PrimordiumDeck = {RAR, SUITS, RIDERS, PATHS, LEVELS, levelLabel, grantedAt, build, newState, fit, act, tap, render, combo, value};
})(window);
