// Dice expressions shared by the Codex and the character sheet: "2D6+3", "D20", "D10-1".
(function (root) {
  function roll(expr) {
    const terms = String(expr).replace(/\s+/g, '').match(/[+\-]?[^+\-]+/g) || [];
    let total = 0; const parts = [], dice = [];
    for (const t of terms) {
      const sign = t[0] === '-' ? -1 : 1, body = t.replace(/^[+\-]/, '');
      const m = body.match(/^(\d*)D(\d+)$/i);
      if (m) {
        const n = +(m[1] || 1), f = +m[2], rs = [];
        for (let i = 0; i < n; i++) { const r = 1 + Math.floor(Math.random() * f); rs.push(r); dice.push({f, r}); }
        total += rs.reduce((a, b) => a + b, 0) * sign;
        parts.push(`${sign < 0 ? '−' : ''}${n > 1 ? n : ''}D${f} [${rs.join(', ')}]`);
      } else if (/^\d+$/.test(body)) { total += sign * +body; parts.push((sign < 0 ? '−' : '+') + body); }
    }
    return {total, parts, dice};
  }
  // A pool of dice faces plus a modifier, written the way the guides write rolls ("2D20+D6+1").
  function poolExpr(pool, mod) {
    const parts = [];
    [20, 12, 10, 8, 6, 4].forEach(f => { const c = pool.filter(x => x === f).length; if (c) parts.push((c > 1 ? c : '') + 'D' + f); });
    let e = parts.join('+'); if (e && mod) e += (mod > 0 ? '+' : '-') + Math.abs(mod); return e;
  }
  const withMod = (die, mod) => die + (mod ? (mod > 0 ? '+' : '-') + Math.abs(mod) : '');
  // The shape of each die, for dice tray buttons (.dbtn in shared/theme.css).
  const FACES = [4, 6, 8, 10, 12, 20];
  const SHAPES = {4: '<path d="M12 3 21 19H3z"/>', 6: '<rect x="4" y="4" width="16" height="16" rx="2"/>', 8: '<path d="M12 2 21 12 12 22 3 12z"/><path d="M3 12h18"/>',
    10: '<path d="M12 2 21 10 12 22 3 10z"/><path d="M3 10 12 14 21 10M12 14v8"/>', 12: '<path d="M12 2.5 21 9l-3.4 10.5H6.4L3 9z"/><path d="M12 7l4.5 3.3-1.7 5.2H9.2l-1.7-5.2z"/>',
    20: '<path d="M12 2.5 20.5 7.5v9L12 21.5 3.5 16.5v-9z"/><path d="M12 2.5 7.5 15h9zM3.5 7.5 7.5 15 12 21.5 16.5 15l4-7.5"/>'};
  const svg = f => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true">${SHAPES[f]}</svg>`;
  // One tray button: data-add carries the face; count shows how many are in the pool.
  const trayButton = (f, count) => `<button class="dbtn" data-add="${f}" aria-label="Add a D${f}">${svg(f)}<b>D${f}</b>${count ? `<span class="n">×${count}</span>` : ''}</button>`;
  root.PrimordiumDice = {roll, poolExpr, withMod, FACES, svg, trayButton};
})(window);
