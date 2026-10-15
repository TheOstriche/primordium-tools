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
  root.PrimordiumDice = {roll, poolExpr, withMod};
})(window);
