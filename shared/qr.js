// QR codes for shop links (the GM tool shows one; a phone camera opens the link in the character sheet).
// Byte mode, error correction M where it fits in the same size as L, versions 1 to 40, the mask with the
// lowest penalty. Follows the QR Code standard (ISO/IEC 18004); the layout steps follow Project Nayuki's
// public QR Code generator. No screen code except svg(), so it also runs in Node.
//   PrimordiumQR.make(text)  -> { size, version, ecc, dark(x, y) }
//   PrimordiumQR.svg(text)   -> an <svg> string, dark on white with a quiet zone (scanners need the contrast)
(function (root) {
  // Per version (index 1-40): error correction codewords per block, and the number of blocks.
  const ECC_PER_BLOCK = {
    L: [0, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28]
  };
  const BLOCKS = {
    L: [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49]
  };
  const FORMAT_ECC = { L: 1, M: 0 };

  const rawModules = v => {
    let r = (16 * v + 128) * v + 64;
    if (v >= 2) { const n = Math.floor(v / 7) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; }
    return r;
  };
  const dataCodewords = (v, ecc) => Math.floor(rawModules(v) / 8) - ECC_PER_BLOCK[ecc][v] * BLOCKS[ecc][v];
  const dataBits = (v, len) => 4 + (v <= 9 ? 8 : 16) + 8 * len;   // byte mode: mode, count, data

  /* ---------- Reed-Solomon over GF(256), polynomial 0x11D ---------- */
  function mul(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; }
    return z;
  }
  function divisor(degree) {
    const r = new Array(degree).fill(0); r[degree - 1] = 1;
    let rootVal = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < r.length; j++) { r[j] = mul(r[j], rootVal); if (j + 1 < r.length) r[j] ^= r[j + 1]; }
      rootVal = mul(rootVal, 2);
    }
    return r;
  }
  function remainder(data, div) {
    const r = div.map(() => 0);
    for (const b of data) {
      const f = b ^ r.shift(); r.push(0);
      div.forEach((d, i) => { r[i] ^= mul(d, f); });
    }
    return r;
  }

  function make(text) {
    const bytes = Array.from(new TextEncoder().encode(text));
    let version = 0, ecc = 'L';
    for (let v = 1; v <= 40; v++) if (dataBits(v, bytes.length) <= dataCodewords(v, 'L') * 8) { version = v; break; }
    if (!version) throw new Error('Too much for one QR code.');
    if (dataBits(version, bytes.length) <= dataCodewords(version, 'M') * 8) ecc = 'M';
    const v = version, size = v * 4 + 17;

    // Data codewords: mode, count, bytes, terminator, then pad bytes.
    const bits = [];
    const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
    put(4, 4); put(bytes.length, v <= 9 ? 8 : 16); bytes.forEach(b => put(b, 8));
    const cap = dataCodewords(v, ecc) * 8;
    put(0, Math.min(4, cap - bits.length));
    put(0, (8 - bits.length % 8) % 8);
    for (let pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) put(pad, 8);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => a << 1 | b, 0));

    // Split into blocks, add error correction, interleave.
    const nBlocks = BLOCKS[ecc][v], eccLen = ECC_PER_BLOCK[ecc][v], raw = Math.floor(rawModules(v) / 8);
    const nShort = nBlocks - raw % nBlocks, shortLen = Math.floor(raw / nBlocks), div = divisor(eccLen);
    const blocks = [];
    for (let i = 0, k = 0; i < nBlocks; i++) {
      const dat = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1)); k += dat.length;
      const e = remainder(dat, div);
      if (i < nShort) dat.push(0);
      blocks.push(dat.concat(e));
    }
    const codewords = [];
    for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= nShort) codewords.push(b[i]); });

    // Function patterns.
    const mod = [...Array(size)].map(() => new Array(size).fill(false));
    const fn = [...Array(size)].map(() => new Array(size).fill(false));
    const setFn = (x, y, dark) => { mod[y][x] = dark; fn[y][x] = true; };
    for (let i = 0; i < size; i++) { setFn(6, i, i % 2 === 0); setFn(i, 6, i % 2 === 0); }
    for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy)), x = cx + dx, y = cy + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) setFn(x, y, d !== 2 && d !== 4);
      }
    }
    if (v > 1) {
      const n = Math.floor(v / 7) + 2, step = v === 32 ? 26 : Math.ceil((v * 4 + 4) / (n * 2 - 2)) * 2, pos = [6];
      for (let p = size - 7; pos.length < n; p -= step) pos.splice(1, 0, p);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setFn(pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
    const bit = (x, i) => ((x >>> i) & 1) !== 0;
    function formatBits(mask) {
      const d = FORMAT_ECC[ecc] << 3 | mask;
      let r = d;
      for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const b = (d << 10 | r) ^ 0x5412;
      for (let i = 0; i <= 5; i++) setFn(8, i, bit(b, i));
      setFn(8, 7, bit(b, 6)); setFn(8, 8, bit(b, 7)); setFn(7, 8, bit(b, 8));
      for (let i = 9; i < 15; i++) setFn(14 - i, 8, bit(b, i));
      for (let i = 0; i < 8; i++) setFn(size - 1 - i, 8, bit(b, i));
      for (let i = 8; i < 15; i++) setFn(8, size - 15 + i, bit(b, i));
      setFn(8, size - 8, true);
    }
    formatBits(0);
    if (v >= 7) {
      let r = v;
      for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
      const b = v << 12 | r;
      for (let i = 0; i < 18; i++) { const a = size - 11 + i % 3, c = Math.floor(i / 3); setFn(a, c, bit(b, i)); setFn(c, a, bit(b, i)); }
    }

    // Codewords in the zigzag, two columns at a time from the right.
    let i = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
        const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && i < codewords.length * 8) { mod[y][x] = bit(codewords[i >>> 3], 7 - (i & 7)); i++; }
      }
    }

    // Masks: try all eight, keep the one with the lowest penalty.
    const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
      (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
      (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
    const applyMask = m => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fn[y][x] && MASKS[m](x, y)) mod[y][x] = !mod[y][x]; };
    function penalty() {
      let p = 0, dark = 0;
      const lines = [];
      for (let a = 0; a < size; a++) { lines.push(mod[a]); lines.push(mod.map(row => row[a])); }
      for (const line of lines) {
        let run = 1;
        for (let k = 1; k <= size; k++) {
          if (k < size && line[k] === line[k - 1]) run++;
          else { if (run >= 5) p += run - 2; run = 1; }
        }
        const s = line.map(b => b ? '1' : '0').join('');
        p += 40 * ((s.match(/(?=10111010000)/g) || []).length + (s.match(/(?=00001011101)/g) || []).length);
      }
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        if (mod[y][x]) dark++;
        if (x < size - 1 && y < size - 1) { const c = mod[y][x]; if (c === mod[y][x + 1] && c === mod[y + 1][x] && c === mod[y + 1][x + 1]) p += 3; }
      }
      const total = size * size;
      p += 10 * (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1);
      return p;
    }
    let best = 0, bestP = Infinity;
    for (let m = 0; m < 8; m++) {
      applyMask(m); formatBits(m);
      const p = penalty();
      if (p < bestP) { bestP = p; best = m; }
      applyMask(m);
    }
    applyMask(best); formatBits(best);
    return { size, version, ecc, mask: best, dark: (x, y) => mod[y][x], isFunction: (x, y) => fn[y][x] };
  }

  function svg(text, quiet = 4) {
    const q = make(text), n = q.size + quiet * 2;
    let path = '';
    for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.dark(x, y)) path += `M${x + quiet},${y + quiet}h1v1h-1z`;
    // Fixed colors on purpose: a QR code must be dark on light to scan, in either theme.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="${n}" height="${n}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`;
  }

  root.PrimordiumQR = { make, svg, ECC_PER_BLOCK, BLOCKS, rawModules };   // the tables are for tools/test-items.js
})(typeof window !== 'undefined' ? window : globalThis);
