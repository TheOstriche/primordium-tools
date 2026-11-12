// A shop from the GM's link or QR code (sheet/#shop=…, made by the GM tool's Shops tab). The player picks who is
// buying; each purchase takes the marks and puts the item in that character's pack, ready to equip.
// Haggler (Speech) is applied automatically. The GM's own stock list is not changed: the player tells the GM.
// Item rules: ../shared/items.js.
"use strict";

const Items = window.PrimordiumItems, SELL = Items.DATA.selling;
let shopVisit = null;   // { shop, buyer (character id), bought: { item id: count } }

// Opens the shop when the page was opened from a shop link. Returns true if it did.
// The link is outside input; decodeShop() checks all of it (../shared/items.js).
async function openShopLink() {
  const m = location.hash.match(/^#shop=([A-Za-z0-9_-]+)/);
  if (!m) return false;
  try {
    const shop = await Items.decodeShop(m[1]);
    if (sheet.open) sheet.close();
    const ids = Object.keys(db);
    shopVisit = { shop, buyer: shopVisit?.buyer && db[shopVisit.buyer] ? shopVisit.buyer : ids.length === 1 ? ids[0] : '', bought: {} };
    shopView();
    return true;
  } catch (e) {
    toast(['This shop link did not open', 'Ask the GM for a new code.']);
    return false;
  }
}
// A pasted shop link (⋯ menu): for phones where the scanned code opened in the browser, not the installed app.
function askShopLink() {
  const text = prompt('Paste the shop link from your GM');
  if (!text) return;
  const m = text.match(/shop=([A-Za-z0-9_-]+)/) || text.trim().match(/^([zj][A-Za-z0-9_-]+)$/);
  if (!m) return toast(['That is not a shop link', 'It should contain "#shop=".']);
  if (location.hash === '#shop=' + m[1]) openShopLink(); else location.hash = 'shop=' + m[1];
}

function shopView() {
  const { shop, buyer, bought } = shopVisit;
  current = null;
  $('#tabs').hidden = true; $('#backBtn').hidden = false; $('#title').textContent = shop.name || 'Shop';
  const chars = Object.values(db).map(upgrade).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  const c = db[buyer], haggler = c ? has(c, Items.DATA.selling.hagglerPerk) : false;
  const left = it => it.qty - (bought[it.id] || 0);
  const row = it => {
    const d = Items.describe(it), price = Items.buyPrice(shop, it, haggler), n0 = left(it);
    return `<div class="rec item shopitem"><div><b>${esc(it.name)}</b><small>${esc([d.line, d.text].filter(Boolean).join(' · '))}</small>
        <small>${n0 > 0 ? `${n0} in stock` : 'Sold out'}</small></div>
      <button class="btn small" data-buy="${esc(it.id)}" ${!c || n0 <= 0 ? 'disabled' : ''}>${price.toLocaleString()} marks</button></div>`;
  };
  $('#view').innerHTML = `<section class="shop">
    <p class="note">${esc(shop.type)}${shop.adjust ? ` · prices ${shop.adjust > 0 ? '+' : ''}${esc(shop.adjust)}%` : ''}</p>
    ${chars.length ? `<label class="field"><span>Who is buying</span><select id="shopBuyer"><option value="">Choose a character</option>
        ${chars.map(x => `<option value="${esc(x.id)}" ${x.id === buyer ? 'selected' : ''}>${esc(x.name || 'Unnamed')}</option>`).join('')}</select></label>
      ${c ? `<p class="shopmarks"><b>${n(c.marks).toLocaleString()}</b> marks${haggler ? ` · ${esc(SELL.hagglerPerk)}: ${Math.round((1 - SELL.hagglerBuy) * 100)}% off` : ''}</p>` : ''}`
      : `<p class="empty">No characters here. If yours are in the installed app, copy this page's link, open the app, and use ⋯ → Open a shop link. Otherwise create a character first.</p>`}
    ${shop.items.length ? shop.items.map(row).join('') : '<p class="empty">This shop has nothing for sale.</p>'}
    <p class="note">Purchases go into your pack (Inventory tab), ready to equip. Tell the GM what you bought. Selling: merchants pay ${Math.round(SELL.rate * 100)}% of an item's value${haggler ? `, ${Math.round(SELL.rate * SELL.hagglerSell * 100)}% with ${esc(SELL.hagglerPerk)}` : ''}; ask the GM.</p>
    <button class="btn ghost" data-act="leaveshop">Leave the shop</button>
  </section>`;
}

function buy(id) {
  const { shop, buyer, bought } = shopVisit, c = db[buyer];
  const it = shop.items.find(i => i.id === id);
  if (!c || !it || it.qty - (bought[id] || 0) <= 0) return;
  const price = Items.buyPrice(shop, it, has(c, Items.DATA.selling.hagglerPerk));
  if (n(c.marks) < price) return toast([`Not enough marks`, `${it.name} costs ${price.toLocaleString()}; ${c.name || 'this character'} has ${n(c.marks).toLocaleString()}.`]);
  const item = Items.toSheetItem(it, uid);
  // A pack item already carried (a potion, arrows): one more of it.
  const same = !item.kind && c.items.find(x => !x.equipped && !x.kind && x.name === item.name);
  if (same) same.qty = n(same.qty) + 1; else c.items.push(item);
  c.marks = n(c.marks) - price;
  bought[id] = (bought[id] || 0) + 1;
  saveNow();
  toast([`Bought ${it.name}`, `${price.toLocaleString()} marks · ${n(c.marks).toLocaleString()} left`]);
  shopView();
  FX.sparkle(FX.lastTap(), '#eab14c', 12);
}
