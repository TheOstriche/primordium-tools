// Item rules shared by the GM tool (Shops), the character sheet (buying from a shop link), and the Codex.
// Needs items-data.js loaded first (and core.js for helpers). No screen code, so tools/test-items.js checks it.
// A shop:        { id, name, type, level, adjust (price change in %), items: [item] }
// A shop item:   { id, kind, base, tier, material, name, price, qty, notes }
//   kind 'gear'        base is a gear name (Sword, Light armor, Arrows); tier and material set its price and Condition
//   kind 'consumable'  base is a consumable name (Healing Potion)
//   kind 'other'       base is another listed item (Soul shard)
//   kind 'custom'      anything else: name, price, and notes are all the GM's; category optionally makes it a weapon or armor
(function (root) {
  const D = root.PRIMORDIUM_ITEMS;
  const byName = list => Object.fromEntries(list.map(x => [x.name, x]));
  const GEAR = byName(D.gear), CONS = byName(D.consumables), OTHER = byName(D.other), MAT = byName(D.materials);
  let counter = 0;
  const newId = () => 'i' + Date.now().toString(36) + (counter++).toString(36);
  const rand = (random, [lo, hi]) => lo + Math.floor(random() * (hi - lo + 1));

  /* ---------- gear ---------- */
  // Materials a gear item can be made of at a tier. Oak is only for the items its notes name (bows, shields, spears).
  const materialsFor = (base, tier) => D.materials.filter(m => m.tier === tier && (m.kind !== 'wood' || GEAR[base].wood));
  const lowerFirst = s => s.charAt(0).toLowerCase() + s.slice(1);
  function gearName(base, material) {
    const g = GEAR[base];
    const what = base.toLowerCase() + (g.set ? ' (full set)' : '') + (g.bundle ? ` (${g.bundle})` : '');
    return material ? `${material} ${what}` : what.charAt(0).toUpperCase() + what.slice(1);
  }
  // Starting Condition (Game Guide, Defense): weapons 12 + 3 per tier, shields 14 + 3, armor sets 10 + 3;
  // dwarven metals and Pitch +50%, Mag-Glass and PriGlass −50%, rounded down. Ammunition has none.
  function condition(base, tier, material) {
    const c = D.condition[GEAR[base].category];
    if (!c) return null;
    const mult = (MAT[material] && MAT[material].condition) || 1;
    return Math.floor((c.start + c.perTier * tier) * mult);
  }
  // Armor a full set gives (Game Guide, Defense): light 1 per tier from 1 at Tier 0, heavy 2 per tier from 2.
  function armorValue(base, tier) {
    const g = GEAR[base], a = g.category === 'armor' && D.armorValue[g.weight];
    return a ? a.start + a.perTier * tier : null;
  }

  /* ---------- reference tables (the Codex and the handoff files) ---------- */
  // Prices: items with the same prices share a row ("One Handed Axe, Mace, Bow").
  function priceRows() {
    const rows = [];
    for (const g of D.gear) {
      const row = rows.find(r => r.prices.join() === g.prices.join() && !!r.set === !!g.set && r.bundle === g.bundle);
      if (row) row.names.push(g.name); else rows.push({ names: [g.name], prices: g.prices, set: g.set, bundle: g.bundle });
    }
    return rows.map(r => [r.names.join(', ') + (r.set ? ' (full set)' : '') + (r.bundle ? ` (${r.bundle})` : ''), ...r.prices]);
  }
  // Condition: the starting value by item type, then the materials that change it.
  function conditionRows() {
    const label = { weapon: 'Weapon', shield: 'Shield', armor: 'Armor (set)' };
    const rows = Object.entries(D.condition).map(([k, c]) => [label[k] || k, `${c.start} + ${c.perTier} per material tier`]);
    const mults = [...new Set(D.materials.filter(m => m.condition).map(m => m.condition))];
    for (const x of mults) rows.push([D.materials.filter(m => m.condition === x).map(m => m.name).join(', '), `${x > 1 ? '+' : '−'}${Math.round(Math.abs(x - 1) * 100)}% Condition`]);
    return rows;
  }

  /* ---------- making shop items ---------- */
  function gear(base, tier, material, qty = 1) {
    const g = GEAR[base];
    return { id: newId(), kind: 'gear', base, tier, material: material || '', name: gearName(base, material), price: g.prices[tier], qty };
  }
  const consumable = (base, qty = 1) => ({ id: newId(), kind: 'consumable', base, name: base, price: CONS[base].price, qty });
  const other = (base, qty = 1) => ({ id: newId(), kind: 'other', base, name: base, price: OTHER[base].price, qty });
  const custom = ({ name, price, qty = 1, notes = '', category = '' }) => ({ id: newId(), kind: 'custom', name, price: Math.max(0, Math.round(+price || 0)), qty, notes, category });

  // What the screens show for an item: its rules line and description.
  function describe(item) {
    if (item.kind === 'gear') {
      const g = GEAR[item.base], parts = [`Tier ${item.tier}`];
      if (g.category === 'armor') parts.push(`${g.weight} armor, ${armorValue(item.base, item.tier)} armor`);
      const cond = condition(item.base, item.tier, item.material);
      if (cond != null) parts.push(`Condition ${cond}`);
      return { line: parts.join(' · '), text: item.material && MAT[item.material] ? MAT[item.material].notes : '' };
    }
    if (item.kind === 'consumable') return { line: 'Consumable', text: CONS[item.base].effect };
    if (item.kind === 'other') return { line: '', text: OTHER[item.base].notes || '' };
    return { line: item.category ? lowerFirst(item.category) : '', text: item.notes || '' };
  }

  /* ---------- prices ---------- */
  // The shop's listed price: the item's price with the shop's adjustment (a percent, e.g. 20 or -10).
  const listPrice = (shop, item) => Math.max(0, Math.round(item.price * (1 + (+shop.adjust || 0) / 100)));
  // Haggler (Speech, Diplomat path): buys for 20% less and sells for 20% more.
  const buyPrice = (shop, item, haggler) => haggler ? Math.round(listPrice(shop, item) * D.selling.hagglerBuy) : listPrice(shop, item);
  // What a merchant pays for an item: half its value (more with Haggler), or the item's own buy price (soul shards).
  function sellOffer(item, haggler) {
    const own = item.kind === 'other' && OTHER[item.base].sell;
    const base = own != null && own !== false ? own : item.price * D.selling.rate;
    return Math.floor(base * (haggler ? D.selling.hagglerSell : 1));
  }

  /* ---------- filling a shop ---------- */
  // Gear tiers a shop stocks at a level (Game Master's Guide, Rewards): the usual tiers, and the rarer ones.
  const tiersFor = level => D.gearTiers.find(t => level >= t.levels[0] && level <= t.levels[1]) || D.gearTiers[D.gearTiers.length - 1];
  // A shop's stock from its type and level. Each gear item comes at each usual tier (and sometimes a rarer one),
  // in a random material of that tier; quantities from stockQty. random: for tests.
  function autoStock(type, level, random = Math.random) {
    const T = D.shopTypes[type], tiers = tiersFor(level), out = [];
    const cap = t => T.maxTier == null || t <= T.maxTier;
    for (const base of T.stock) {
      if (GEAR[base]) {
        const g = GEAR[base];
        const use = tiers.common.filter(cap).concat(tiers.rare.filter(t => cap(t) && random() < D.rareChance));
        if (!use.length) use.push(Math.min(...tiers.common, T.maxTier ?? 99));
        for (const tier of use) {
          const mats = materialsFor(base, tier), m = mats.length ? mats[Math.floor(random() * mats.length)].name : '';
          out.push(gear(base, tier, m, rand(random, D.stockQty[g.category])));
        }
      } else if (CONS[base]) out.push(consumable(base, rand(random, D.stockQty.consumable)));
      else if (OTHER[base]) out.push(other(base, rand(random, D.stockQty.other)));
    }
    return out;
  }

  /* ---------- into a character sheet ---------- */
  // A bought item as a character sheet item (sheet/js/store.js): in the pack, with its tier, material, and Condition
  // filled in, so Equip on the sheet opens already set up. Gear's description is its rules line (Tier 1 · Condition 15).
  function toSheetItem(item, uid) {
    const d = describe(item), base = { id: uid(), name: item.name, desc: (item.kind === 'gear' ? d.line : d.text) || '', qty: 1, equipped: false };
    if (item.kind === 'gear') {
      const g = GEAR[item.base], cond = condition(item.base, item.tier, item.material);
      const common = { material: item.material, tier: item.tier, cond: cond == null ? '' : cond, special: '' };
      if (g.category === 'weapon') return { ...base, ...common, kind: 'weapon', wtype: item.base, ap: '' };
      if (g.category === 'shield') return { ...base, ...common, kind: 'armor', slot: 'Shield', weight: 'heavy', armor: '' };
      if (g.category === 'armor') return { ...base, ...common, kind: 'armor', slot: 'Chest', weight: g.weight, armor: armorValue(item.base, item.tier) };
      return base;   // ammunition: a pack item
    }
    if (item.kind === 'consumable') return { ...base, desc: CONS[item.base].effect };
    if (item.kind === 'custom' && item.category === 'weapon') return { ...base, kind: 'weapon', wtype: 'Other', material: '', tier: 0, cond: '', ap: '', special: '' };
    if (item.kind === 'custom' && item.category === 'armor') return { ...base, kind: 'armor', slot: 'Chest', weight: 'heavy', material: '', tier: 0, armor: '', cond: '', special: '' };
    return base;
  }

  /* ---------- a shop in a link ---------- */
  // A shop packs into a short code for a link or QR code: compact JSON, deflated (zlib) when the browser can, then base64url.
  // Format 1: [1, name, type, level, adjust, [[kind, base, tier, material, qty, price, name, notes, category], ...]]
  const KINDS = { gear: 'g', consumable: 'c', other: 'o', custom: 'x' };
  const KIND_OF = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [v, k]));
  const pack = shop => JSON.stringify([1, shop.name || '', shop.type || '', shop.level || 1, +shop.adjust || 0,
    shop.items.filter(i => i.qty > 0).map(i => i.kind === 'custom' ? [KINDS.custom, '', 0, '', i.qty, i.price, i.name, i.notes || '', i.category || '']
      : [KINDS[i.kind], i.base, i.tier || 0, i.material || '', i.qty])]);
  function unpack(text) {
    const [v, name, type, level, adjust, rows] = JSON.parse(text);
    if (v !== 1 || !Array.isArray(rows)) throw new Error('Not a Primordium shop.');
    const items = rows.map(([k, base, tier, material, qty, price, nm, notes, category]) => {
      const kind = KIND_OF[k];
      const it = kind === 'gear' && GEAR[base] ? gear(base, tier, material, qty) : kind === 'consumable' && CONS[base] ? consumable(base, qty)
        : kind === 'other' && OTHER[base] ? other(base, qty) : kind === 'custom' ? custom({ name: nm, price, qty, notes, category }) : null;
      return it;
    }).filter(Boolean);
    return { name, type, level, adjust, items };
  }
  const toB64 = bytes => { let s = ''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const fromB64 = str => Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
  // "z" marks a deflated code, "j" a plain one (browsers without CompressionStream).
  async function encodeShop(shop) {
    const bytes = new TextEncoder().encode(pack(shop));
    if (typeof CompressionStream === 'function') return 'z' + toB64(await pipe(bytes, new CompressionStream('deflate')));
    return 'j' + toB64(bytes);
  }
  async function decodeShop(code) {
    const bytes = fromB64(code.slice(1));
    const text = code[0] === 'z' ? new TextDecoder().decode(await pipe(bytes, new DecompressionStream('deflate'))) : new TextDecoder().decode(bytes);
    return unpack(text);
  }

  root.PrimordiumItems = {
    DATA: D, GEAR, CONS, OTHER, MAT, newId, materialsFor, gearName, condition, armorValue, priceRows, conditionRows,
    gear, consumable, other, custom, describe, listPrice, buyPrice, sellOffer, tiersFor, autoStock, toSheetItem,
    pack, unpack, encodeShop, decodeShop
  };
})(typeof window !== 'undefined' ? window : globalThis);
