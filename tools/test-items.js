// Checks shared/items.js against the item rules in Game Guide 2.0 and the Game Master's Guide 2.0.
// Run: node tools/test-items.js   (or node tools/test.js for every test)
const fs = require('fs'), path = require('path');
global.window = globalThis;
for (const f of ['core.js', 'items-data.js', 'items.js']) eval(fs.readFileSync(path.join(__dirname, '..', 'shared', f), 'utf8'));
const I = window.PrimordiumItems, D = I.DATA;
let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) fails++; };
const seq = list => { let i = 0; return () => list[i++ % list.length]; };   // scripted "random"

(async () => {
  // Prices (the Prices table): an Iron sword is 55, a PriSteel sword 8,000.
  check(I.gear('Sword', 0, 'Iron').price === 55 && I.gear('Sword', 7, 'PriSteel').price === 8000, 'Iron sword 55, PriSteel sword 8,000');
  check(I.gear('Sword', 1, 'Steel').name === 'Steel sword' && I.gear('Heavy armor', 2, 'D-Steel').name === 'D-Steel heavy armor (full set)' && I.gear('Arrows', 0, 'Iron').name === 'Iron arrows (20)', 'item names read naturally');

  // Condition (Defense): weapons 12 + 3 per tier, shields 14 + 3, armor 10 + 3; dwarven metals and Pitch +50%, glass −50%.
  check(I.condition('Sword', 1, 'Steel') === 15 && I.condition('Shield', 0, 'Oak') === 14 && I.condition('Light armor', 3, 'Glacius') === 19, 'Condition by item type and tier');
  check(I.condition('Sword', 1, 'D-Iron') === 22 && I.condition('Sword', 5, 'Pitch') === 40 && I.condition('Sword', 4, 'Mag-Glass') === 12, 'dwarven metals and Pitch +50%, Mag-Glass −50% (rounded down)');
  check(I.condition('Arrows', 2, 'Etherian') === null, 'ammunition has no Condition');

  // Armor (Defense): light 1 per tier from 1 at Tier 0, heavy 2 per tier from 2.
  check(I.armorValue('Light armor', 0) === 1 && I.armorValue('Light armor', 4) === 5 && I.armorValue('Heavy armor', 0) === 2 && I.armorValue('Heavy armor', 3) === 8, 'armor sets: light and heavy armor values');

  // Materials: Oak only for bows, shields, and spears.
  check(I.materialsFor('Bow', 0).some(m => m.name === 'Oak') && !I.materialsFor('Sword', 0).some(m => m.name === 'Oak'), 'Oak is offered for bows but not swords');
  check(D.materials.every(m => I.materialsFor('Shield', m.tier).length > 0), 'every tier has a material for every item');

  // Selling and Haggler (Speech, Diplomat): merchants pay 50%, 60% with Haggler; Haggler buys 20% cheaper.
  const sword = I.gear('Sword', 0, 'Iron'), shop = { adjust: 0 };
  check(I.sellOffer(sword) === 27 && I.sellOffer(sword, true) === 33 && I.buyPrice(shop, sword, true) === 44, 'sell at 50% (60% with Haggler); Haggler buys 20% cheaper');
  check(I.sellOffer(I.other('Soul shard')) === 12 && I.other('Soul shard').price === 25, 'soul shards: mage merchants sell at 25 and buy at 12');
  check(I.listPrice({ adjust: 20 }, sword) === 66 && I.listPrice({ adjust: -10 }, sword) === 50, "a shop's price adjustment");

  // Stock by level (Game Master's Guide, Rewards): levels 1-4 Tier 0 (rarely 1), 9-12 Tiers 2-3, 21+ Tiers 5-7.
  check(JSON.stringify(I.tiersFor(3)) === JSON.stringify({ levels: [1, 4], common: [0], rare: [1] }) && I.tiersFor(10).common.join() === '2,3' && I.tiersFor(25).common.join() === '5,6,7', 'gear tiers by party level');
  const smith = I.autoStock('Blacksmith', 3, seq([0.9])), tierOf = s => [...new Set(s.map(i => i.tier))].join();
  check(smith.length === D.shopTypes.Blacksmith.stock.length && tierOf(smith) === '0', 'a level 3 blacksmith stocks every weapon at Tier 0');
  check(I.autoStock('Blacksmith', 3, seq([0.1])).some(i => i.tier === 1), 'and sometimes a rarer Tier 1');
  check(tierOf(I.autoStock('General store', 15, seq([0.5])).filter(i => i.kind === 'gear')) === '0', 'a general store stays at Tier 0');
  check(I.autoStock('Alchemist', 5).every(i => i.kind === 'consumable' && i.qty >= 1), 'an alchemist stocks consumables');
  for (const [type, t] of Object.entries(D.shopTypes)) check(t.stock.every(n => I.GEAR[n] || I.CONS[n] || I.OTHER[n]), `${type}: every stock name is a known item`);

  // Into a character sheet.
  let n = 0; const uid = () => 'u' + n++;
  const w = I.toSheetItem(I.gear('Sword', 1, 'D-Iron'), uid), a = I.toSheetItem(I.gear('Light armor', 2, 'Etherian'), uid), p = I.toSheetItem(I.consumable('Healing Potion'), uid);
  check(w.kind === 'weapon' && w.wtype === 'Sword' && w.tier === 1 && w.cond === 22 && !w.equipped, 'a bought weapon arrives ready to equip (type, tier, Condition)');
  check(a.kind === 'armor' && a.weight === 'light' && a.armor === 3 && a.slot === 'Chest', 'a bought armor set carries its armor value');
  check(!p.kind && p.desc === 'Heal 4D6.', 'a bought potion is a pack item with its effect');

  // A shop in a link: it comes back the same.
  const s = { name: "Brenna's Forge", type: 'Blacksmith', level: 6, adjust: 10, items: [...I.autoStock('Blacksmith', 6), I.custom({ name: 'Old map', price: 30, notes: 'Marks a ruin.' })] };
  const code = await I.encodeShop(s), back = await I.decodeShop(code);
  const same = (x, y) => JSON.stringify(x.items.map(i => [i.kind, i.base, i.tier, i.material, i.qty, i.price, i.name])) === JSON.stringify(y.items.map(i => [i.kind, i.base, i.tier, i.material, i.qty, i.price, i.name]));
  check(back.name === s.name && back.adjust === 10 && same(s, back), `a shop survives its link (${s.items.length} items in ${code.length} characters)`);
  const big = { name: 'Big', type: 'Alchemist', level: 1, adjust: 0, items: Array.from({ length: 40 }, (_, i) => I.gear(D.gear[i % D.gear.length].name, i % 8, '', 3)) };
  check((await I.encodeShop(big)).length < 1200, '40 items fit a phone-readable QR code (under 1,200 characters)');

  // A link is outside input: a hostile or damaged one must come out harmless, or be refused.
  const evil = I.unpack(JSON.stringify([1, '<img src=x onerror=alert(1)>'.repeat(9), { a: 1 }, 'x', '<b>20</b>', [
    ['g', 'Sword', 99, '<script>', -5], ['g', 'constructor', 0, '', 1], ['g', 'Bow', 0, 'Oak', 1e9], ['c', '__proto__', 0, '', 1],
    ['x', '', 0, '', 1, 5, '   '], ['x', '', 0, '', 2, -40, 'Map', 7, 'onclick'], 'junk', null]]));
  check(evil.name.length <= 80 && evil.type === '' && evil.level === 1 && evil.adjust === 0, 'a hostile link: the shop\'s own fields are forced to short text and plain numbers');
  check(evil.items.length === 3, 'a hostile link: unknown items and blank custom items are dropped', evil.items.map(i => i.name));
  const [ev1, ev2, ev3] = evil.items;
  check(ev1.tier === 7 && ev1.material === '' && ev1.qty === 1 && ev1.price === 8000, 'a hostile link: tier, material, and quantity are forced into range');
  check(ev2.material === 'Oak' && ev2.qty === 999, 'a hostile link: a real material stays, a huge quantity is capped');
  check(ev3.price === 0 && ev3.notes === '' && ev3.category === '' && ev3.qty === 2, 'a hostile link: a custom item keeps only a name, a price of 0 or more, and plain notes');
  const refused = async c => { try { await I.decodeShop(c); return false; } catch (e) { return true; } };
  check(await refused('') && await refused('q123') && await refused('z!!') && await refused('j' + 'A'.repeat(30000)) && await refused('jbm90IGpzb24') && await refused('zAAAA'),
    'links that are empty, of another kind, too long, not JSON, or not compressed data are refused');
  if (typeof CompressionStream === 'function') {
    const bomb = 'z' + Buffer.from(require('zlib').deflateSync(Buffer.alloc(5e6, 0x20))).toString('base64url');
    check(bomb.length < 20000 && await refused(bomb), 'a small link that unpacks into something huge is refused');
  }

  // QR codes (shared/qr.js): read each one back the way a scanner does and get the same text.
  eval(fs.readFileSync(path.join(__dirname, '..', 'shared', 'qr.js'), 'utf8'));
  const Q = window.PrimordiumQR;
  const formatOf = q => {   // the 15 format bits, top-left copy
    const g = (x, y) => q.dark(x, y) ? 1 : 0, s = [];
    for (let i = 0; i <= 5; i++) s.push(g(8, i));
    s.push(g(8, 7), g(8, 8), g(7, 8));
    for (let i = 9; i < 15; i++) s.push(g(14 - i, 8));
    return s.reduce((b, v, i) => b | v << i, 0);
  };
  // Known format strings from the QR standard: L with mask 0, L mask 1, M mask 4.
  const KNOWN = { 'L0': 0b111011111000100, 'L1': 0b111001011110011, 'M4': 0b100010111111001, 'M0': 0b101010000010010 };
  const gfMul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; };
  const MASK = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
    (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
  function readBack(q) {
    const n = q.size, bits = [];
    for (let right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, y = ((right + 1) & 2) === 0 ? n - 1 - vert : vert;
        if (!q.isFunction(x, y)) bits.push(q.dark(x, y) !== MASK[q.mask](x, y) ? 1 : 0);
      }
    }
    const raw = Math.floor(Q.rawModules(q.version) / 8), cw = [];
    for (let i = 0; i < raw; i++) cw.push(bits.slice(i * 8, i * 8 + 8).reduce((a, b) => a << 1 | b, 0));
    const nb = Q.BLOCKS[q.ecc][q.version], ecc = Q.ECC_PER_BLOCK[q.ecc][q.version], nShort = nb - raw % nb, shortLen = Math.floor(raw / nb);
    const blocks = [...Array(nb)].map((_, i) => []);
    let k = 0;
    for (let i = 0; i <= shortLen; i++) for (let j = 0; j < nb; j++) if (i !== shortLen - ecc || j >= nShort) blocks[j].push(cw[k++]);   // short blocks skip one data place
    // Every block's syndromes are zero when the error correction is right.
    let syndromesOk = true;
    for (const b of blocks) for (let r = 0, a = 1; r < ecc; r++, a = gfMul(a, 2)) { let s = 0; for (const c of b) s = gfMul(s, a) ^ c; if (s) syndromesOk = false; }
    const data = blocks.flatMap((b, j) => b.slice(0, b.length - ecc));
    const dbits = data.flatMap(b => [7, 6, 5, 4, 3, 2, 1, 0].map(i => (b >> i) & 1)), take = (p, len) => dbits.slice(p, p + len).reduce((a, b) => a << 1 | b, 0);
    const lenBits = q.version <= 9 ? 8 : 16, len = take(4, lenBits), bytes = [];
    for (let i = 0; i < len; i++) bytes.push(take(4 + lenBits + i * 8, 8));
    return { mode: take(0, 4), syndromesOk, text: new TextDecoder().decode(Uint8Array.from(bytes)) };
  }
  for (const text of ['HELLO', 'https://theostriche.github.io/primordium-tools/sheet/#shop=' + code, 'Brenna’s Forge ⚒ ' + 'x'.repeat(1000)]) {
    const q = Q.make(text), r = readBack(q), known = KNOWN[q.ecc + q.mask];
    if (!(r.mode === 4 && r.syndromesOk && r.text === text)) console.log(r.mode, r.syndromesOk, formatOf(q).toString(2), JSON.stringify(r.text.slice(0, 40)));
    check(r.mode === 4 && r.syndromesOk && r.text === text && (known == null || formatOf(q) === known),
      `a QR code reads back (version ${q.version}, ${q.ecc}, mask ${q.mask}, ${text.length} characters)`);
  }

  console.log(fails ? `\n${fails} check(s) failed` : '\nAll checks passed');
  process.exit(fails ? 1 : 0);
})();
