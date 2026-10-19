// Shops tab: the campaign's shops. Auto-fill a shop from its type and the party's level, add items by guided
// choice (gear, tier, material) or as custom items, change quantities and prices, and work out what a merchant
// pays for an item. "Player link" puts the shop on a QR code; players open it in the character sheet and buy there.
// Item rules: ../shared/items.js (one copy, shared with the sheet and the Codex).
(function () {
  const { h, fill, toast } = UI;
  const I = window.PrimordiumItems, D = I.DATA;
  const S = () => Store.state;
  const SHEET_URL = 'https://theostriche.github.io/primordium-tools/sheet/';   // used when the GM tool is opened from a file
  const TYPES = Object.keys(D.shopTypes);
  const marks = n => Number(n).toLocaleString() + ' marks';

  let openId = null;
  let addKind = 'gear';
  let pick = { base: D.gear[0].name, tier: 0, material: '', cons: D.consumables[0].name, other: D.other[0].name, qty: 1, name: '', price: '', notes: '', category: '' };
  let sellValue = '', sellHaggler = false;
  let els = {};

  const shops = () => S().shops || (S().shops = []);
  const current = () => shops().find(s => s.id === openId) || null;
  const save = () => Store.changed();
  // The party's level for a new shop: the players' average, or 1.
  const partyLevel = () => { const p = S().players; return p.length ? Math.max(1, Math.round(p.reduce((t, x) => t + (+x.level || 1), 0) / p.length)) : 1; };

  function render(root) {
    els = { list: h('div.ref-list'), detail: h('div.ref-detail') };
    fill(root, h('div.ref-layout.creatures-layout', els.list, els.detail));
    drawList();
    drawDetail();
  }

  function drawList() {
    const list = shops().slice().sort((a, b) => a.name.localeCompare(b.name));
    fill(els.list,
      h('button.primary', { onclick: newShop }, 'New shop'),
      h('div.list-group', 'Your shops'),
      list.length ? list.map(s => h('div.list-item' + (s.id === openId ? '.on' : ''), { onclick: () => { openId = s.id; drawList(); drawDetail(); } },
        s.name, h('span.muted.small', ' ' + s.type + ' · Lv ' + s.level))) : h('p.muted.small', 'None yet.'));
  }

  function newShop() {
    const s = { id: Store.newId(), name: 'New shop', type: TYPES[0], level: partyLevel(), adjust: 0, items: [] };
    s.items = I.autoStock(s.type, s.level);
    shops().push(s);
    openId = s.id;
    save(); drawList(); drawDetail();
  }

  /* ---------- one shop ---------- */
  function drawDetail() {
    const s = current();
    if (!s) {
      return fill(els.detail,
        h('h1', 'Shops'),
        h('p', 'Make the shops of your campaign. A new shop fills itself from its type and the party\'s level (Game Master\'s Guide, Rewards); ' +
          'then add, change, or remove anything. Items not in the guides can be added as custom items with your own name and price.'),
        h('p', 'Use "Player link" to show a QR code. Players scan it with their phone, the shop opens in their character sheet, and what they buy goes straight into their pack.'),
        h('p.muted', 'Enchantments are not in shops yet.'));
    }
    const field = (label, input, cls) => h('label.field' + (cls ? '.' + cls : ''), label, input);
    const num = (key, attrs, after) => h('input', Object.assign({ type: 'number', value: s[key], onchange: e => { s[key] = parseInt(e.target.value, 10) || 0; save(); (after || drawStock)(); } }, attrs));
    els.stock = h('div');
    els.add = h('div.card');
    els.side = h('div.editor-side');
    fill(els.detail,
      h('div.editor-head',
        h('input.name-input', { value: s.name, 'aria-label': 'Shop name', oninput: e => { s.name = e.target.value; save(); }, onchange: drawList }),
        h('div.row',
          h('button.ghost.danger', { onclick: () => { if (confirm('Delete ' + s.name + '?')) { S().shops = shops().filter(x => x !== s); openId = null; save(); drawList(); drawDetail(); } } }, 'Delete'))),
      h('div.editor-grid',
        h('div.editor-main',
          h('div.form-grid',
            field('Kind of shop', h('select', { onchange: e => { s.type = e.target.value; save(); drawList(); } },
              TYPES.map(t => h('option', { value: t, selected: t === s.type }, t)))),
            field('Party level', num('level', { min: 1, max: 40 }, drawList)),
            field('Prices (%)', num('adjust', { step: 5, title: 'Raise or lower every price, e.g. 20 or -10' })),
            h('div.field', h('span', ' '), h('button', { onclick: () => refill(s) }, 'Auto-fill'))),
          h('p.muted.small', tierNote(s)),
          els.stock,
          els.add),
        els.side));
    drawStock();
    drawAdd();
    drawSide();
  }

  function tierNote(s) {
    const t = I.tiersFor(s.level), cap = D.shopTypes[s.type].maxTier;
    const list = a => a.map(x => 'Tier ' + x).join(', ');
    return 'At level ' + s.level + ' shops stock ' + list(t.common) + (t.rare.length ? ', sometimes ' + list(t.rare) : '') +
      (cap != null ? '. A ' + s.type.toLowerCase() + ' stops at Tier ' + cap : '') + '.';
  }

  function refill(s) {
    if (s.items.length && !confirm('Replace this shop\'s stock with a new ' + s.type.toLowerCase() + '\'s stock for level ' + s.level + '?')) return;
    s.items = I.autoStock(s.type, s.level);
    save(); drawStock(); drawSide();
  }

  function drawStock() {
    const s = current();
    if (!s) return;
    const rows = s.items.map(it => {
      const d = I.describe(it), listed = I.listPrice(s, it);
      return h('tr',
        h('td', h('strong', { title: it.kind === 'gear' ? d.text : null }, it.name), d.line ? h('div.muted.small', d.line) : null,
          it.kind !== 'gear' && d.text ? h('div.muted.small', d.text) : null),
        h('td', h('input.qty-input', { type: 'number', min: 0, value: it.qty, 'aria-label': 'Quantity of ' + it.name, onchange: e => { it.qty = Math.max(0, parseInt(e.target.value, 10) || 0); save(); drawSide(); } })),
        h('td', h('input.price-input', { type: 'number', min: 0, value: it.price, 'aria-label': 'Price of ' + it.name, onchange: e => { it.price = Math.max(0, parseInt(e.target.value, 10) || 0); save(); drawStock(); } }),
          listed !== it.price ? h('div.muted.small', 'sells for ' + listed) : null),
        h('td', h('button.icon.ghost.danger', { title: 'Remove', 'aria-label': 'Remove ' + it.name, onclick: () => { s.items = s.items.filter(x => x !== it); save(); drawStock(); drawSide(); } }, '×')));
    });
    fill(els.stock,
      h('h2.sub-head', 'Stock'),
      s.items.length
        ? h('div.table-wrap', h('table.shop-table', h('thead', h('tr', h('th', 'Item'), h('th', 'Qty'), h('th', 'Price'), h('th', ''))), h('tbody', rows)))
        : h('p.muted', 'Nothing in stock. Use Auto-fill or add items below.'));
  }

  /* ---------- adding an item ---------- */
  function drawAdd() {
    const s = current();
    const field = (label, input, cls) => h('label.field' + (cls ? '.' + cls : ''), label, input);
    const set = (key, v, redraw = true) => { pick[key] = v; if (redraw) drawAdd(); };
    const sel = (key, options, after) => h('select', { onchange: e => { set(key, e.target.value, false); if (after) after(); drawAdd(); } },
      options.map(o => typeof o === 'string' ? h('option', { value: o, selected: o === pick[key] }, o)
        : h('optgroup', { label: o.label }, o.items.map(n => h('option', { value: n, selected: n === pick[key] }, n)))));
    const qty = field('Qty', h('input', { type: 'number', min: 1, value: pick.qty, onchange: e => set('qty', Math.max(1, parseInt(e.target.value, 10) || 1)) }));
    let body, item = null;
    if (addKind === 'gear') {
      const cats = [['weapon', 'Weapons'], ['shield', 'Shields'], ['armor', 'Armor'], ['ammo', 'Ammunition']]
        .map(([c, label]) => ({ label, items: D.gear.filter(g => g.category === c).map(g => g.name) }));
      const mats = I.materialsFor(pick.base, pick.tier);
      if (!mats.some(m => m.name === pick.material)) pick.material = mats.length ? mats[0].name : '';
      item = I.gear(pick.base, pick.tier, pick.material, pick.qty);
      body = h('div.form-grid',
        field('Item', sel('base', cats), 'span2'),
        field('Tier', h('select', { onchange: e => set('tier', +e.target.value) }, [0, 1, 2, 3, 4, 5, 6, 7].map(t => h('option', { value: t, selected: t === pick.tier }, 'Tier ' + t)))),
        field('Material', sel('material', mats.map(m => m.name))),
        qty);
    } else if (addKind === 'consumable') {
      item = I.consumable(pick.cons, pick.qty);
      body = h('div.form-grid', field('Item', sel('cons', D.consumables.map(c => c.name)), 'span2'), qty);
    } else if (addKind === 'other') {
      item = I.other(pick.other, pick.qty);
      body = h('div.form-grid', field('Item', sel('other', D.other.map(o => o.name)), 'span2'), qty);
    } else {
      const text = (key, attrs) => h('input', Object.assign({ value: pick[key], oninput: e => { pick[key] = e.target.value; } }, attrs || {}));
      body = h('div.form-grid',
        field('Name', text('name', { placeholder: 'Old map of the ruins' }), 'span2'),
        field('Price (marks)', text('price', { type: 'number', min: 0 })),
        qty,
        field('Kind', h('select', { onchange: e => { pick.category = e.target.value; } },
          [['', 'Pack item'], ['weapon', 'Weapon'], ['armor', 'Armor']].map(([v, l]) => h('option', { value: v, selected: v === pick.category }, l)))),
        field('Notes (players see these)', text('notes'), 'span4'));
    }
    const preview = item ? (() => { const d = I.describe(item); return h('p.muted.small', item.name + ' · ' + marks(I.listPrice(s, item)) + (d.line ? ' · ' + d.line : '') + (d.text ? ' · ' + d.text : '')); })() : null;
    fill(els.add,
      h('div.card-head', h('h2', 'Add an item'),
        h('div.seg', { role: 'group', 'aria-label': 'Kind of item' },
          [['gear', 'Gear'], ['consumable', 'Consumable'], ['other', 'Other'], ['custom', 'Custom']].map(([k, l]) =>
            h('button' + (k === addKind ? '.on' : ''), { onclick: () => { addKind = k; drawAdd(); } }, l)))),
      body, preview,
      h('div.row', h('button.primary', { onclick: () => add(item) }, 'Add to stock')));
  }

  function add(item) {
    const s = current();
    if (addKind === 'custom') {
      if (!pick.name.trim()) return toast('Give the item a name.', 'bad');
      item = I.custom({ name: pick.name.trim(), price: pick.price, qty: pick.qty, notes: pick.notes.trim(), category: pick.category });
      pick.name = ''; pick.price = ''; pick.notes = '';
    }
    // The same item already in stock: add to its quantity.
    const same = s.items.find(x => x.kind === item.kind && x.kind !== 'custom' && x.base === item.base && (x.tier || 0) === (item.tier || 0) && (x.material || '') === (item.material || ''));
    if (same) same.qty += item.qty; else s.items.push(item);
    save(); drawStock(); drawAdd(); drawSide();
    toast(item.name + ' added.', 'good');
  }

  /* ---------- the side: player link and buying from players ---------- */
  function drawSide() {
    const s = current();
    if (!s) return;
    const offerOf = v => I.sellOffer({ kind: 'custom', price: +v || 0 }, sellHaggler);
    const out = h('strong.num', marks(offerOf(sellValue)));
    els.link = h('div');
    fill(els.side,
      h('div.card',
        h('h2', 'Player link'),
        h('p.muted.small', 'Players scan the code (or open the link) to see this shop in their character sheet and buy. Make a new code after changing the stock.'),
        h('button.primary', { onclick: () => showLink(s) }, 'Show QR code'),
        els.link),
      h('div.card',
        h('h2', 'Buying from players'),
        h('p.muted.small', 'Merchants pay ' + Math.round(D.selling.rate * 100) + '% of an item\'s value; soul shards ' + D.other.find(o => o.name === 'Soul shard').sell + ' marks each. ' +
          D.selling.hagglerPerk + ' sells for ' + Math.round((D.selling.hagglerSell - 1) * 100) + '% more and buys for ' + Math.round((1 - D.selling.hagglerBuy) * 100) + '% less.'),
        h('div.row',
          h('label.inline', 'Value ', h('input', { type: 'number', min: 0, value: sellValue, style: 'width:90px', oninput: e => { sellValue = e.target.value; out.textContent = marks(offerOf(sellValue)); } })),
          h('label.check', h('input', { type: 'checkbox', checked: sellHaggler, onchange: e => { sellHaggler = e.target.checked; out.textContent = marks(offerOf(sellValue)); } }), D.selling.hagglerPerk)),
        h('p', 'Pays ', out)));
  }

  async function showLink(s) {
    const base = /^https?:/.test(location.protocol) ? new URL('../sheet/', location.href).href : SHEET_URL;
    const code = await I.encodeShop(s);
    const url = base + '#shop=' + code;
    let qr;
    try { qr = h('div.qr'); qr.innerHTML = PrimordiumQR.svg(url); } catch (e) { qr = h('p.bad', 'Too many items for one QR code. Split the shop in two.'); }
    const big = url.length > 1400;
    fill(els.link,
      qr,
      big ? h('p.small.warn', 'This is a large code; if phones struggle to read it, split the shop or remove items.') : null,
      h('div.row',
        h('button', { onclick: () => navigator.clipboard.writeText(url).then(() => toast('Link copied.', 'good'), () => toast('Copy did not work; select the link below.', 'bad')) }, 'Copy link'),
        h('a', { href: url, target: '_blank', rel: 'noopener' }, 'Open')),
      h('input.small', { value: url, readonly: true, 'aria-label': 'Shop link', onfocus: e => e.target.select(), style: 'width:100%;margin-top:6px' }));
  }

  App.register('shops', render);
})();
