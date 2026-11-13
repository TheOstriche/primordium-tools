// Paints the land: every terrain area blended into its neighbours, with texture, and more detail the closer
// you look. The result is a picture (a canvas), which draw.js places under the coastline, rivers and lettering.
//
// How a picture of some part of the map is made (render):
//   1. Every pixel gets a few values of smooth, repeatable noise, anchored to the map (so nothing shifts when
//      you pan or zoom): big patches, medium patches, fine texture, grain, and a wobble for edges.
//   2. The base plains are painted from two tones mixed by that noise, shaded as if lit from the north-west.
//   3. Each terrain area, in order, is drawn as a soft-edged shape. Where the softness plus the edge wobble
//      passes halfway, the area's own tones replace what is underneath, so areas interlock along a ragged
//      edge and fade into each other instead of stopping at a hard line. Mountain ranges put rocky ground
//      under their peaks the same way, shores get a pale strand, and settlements get tilled fields round them.
//   4. Small marks (dune crests, tufts, reeds, cracks, stones…) are scattered where each terrain is, at fixed
//      spots on the map. Finer marks join in as you zoom in.
// Finer noise and marks are only drawn when the picture is detailed enough to show them, which is what makes
// detail appear with zoom. The whole map is painted once at a fixed size; when you zoom in past that, just the
// part on screen is painted again at screen sharpness (detail), a moment after the view stops moving.
//
// The terrain's colors live in MapDraw.PAL.terrain (draw.js), with the rest of the map's artwork colors.
(function () {
  'use strict';
  const PM = window.PrimordiumMap, D = window.MapDraw;
  const FIELDS = 250;                    // the mark id of tilled fields in `top` (terrain areas use 1 upward)
  const BASE_PX_PER_UNIT = 1.2;          // sharpness of the whole-map picture
  const rgb = hex => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const styles = (() => {
    const out = {}, T = D.PAL.terrain;
    for (const [type, s] of Object.entries(T)) out[type] = Object.assign({}, s, { a: rgb(s.a), b: rgb(s.b), c: s.c ? rgb(s.c) : null, rim: s.rim ? rgb(s.rim) : null, ink: s.ink || '#3a3020' });
    return out;
  })();

  /* ---------- noise: one smooth tile, repeated; sampled at different sizes for different jobs ---------- */
  const TILE = 256;
  const tile = (() => {
    const r = PM.rng(20261112), t = new Float32Array(TILE * TILE);
    let total = 0;
    for (const [cells, amp] of [[4, 1], [8, 0.5], [16, 0.25], [32, 0.13]]) {
      const lat = new Float32Array(cells * cells);
      for (let i = 0; i < lat.length; i++) lat[i] = r();
      total += amp;
      for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) {
        const gx = x / TILE * cells, gy = y / TILE * cells, x0 = Math.floor(gx), y0 = Math.floor(gy), fx = gx - x0, fy = gy - y0;
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy), x1 = (x0 + 1) % cells, y1 = (y0 + 1) % cells;
        const a = lat[y0 * cells + x0], b = lat[y0 * cells + x1], c = lat[y1 * cells + x0], d = lat[y1 * cells + x1];
        t[y * TILE + x] += (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy) * amp;
      }
    }
    // Spread the values over the whole 0..1 range, so "above half" really is half the map.
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < t.length; i++) { t[i] /= total; if (t[i] < lo) lo = t[i]; if (t[i] > hi) hi = t[i]; }
    for (let i = 0; i < t.length; i++) t[i] = (t[i] - lo) / (hi - lo);
    return t;
  })();
  function nz(x, y) {
    const xf = Math.floor(x), yf = Math.floor(y), fx = x - xf, fy = y - yf;
    const x0 = xf & 255, y0 = yf & 255, x1 = (x0 + 1) & 255, y1 = (y0 + 1) & 255;
    const a = tile[y0 * TILE + x0], b = tile[y0 * TILE + x1], c = tile[y1 * TILE + x0], d = tile[y1 * TILE + x1];
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const cellHash = (x, y, salt) => { let h = (x * 374761393 + y * 668265263 + salt * 2246822519) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  /* ---------- one picture ---------- */
  // box: [x0, y0, x1, y1] in map units; w, h: the picture's size in pixels. opts.areas / opts.ranges: draw
  // terrain areas / the ground under ranges. Painting a large picture takes a second or two, so it is done in
  // short bursts with pauses between them (the page stays responsive), and stops early, returning null, when
  // opts.alive() says the picture is no longer wanted.
  async function render(map, box, w, h, opts) {
    opts = opts || {};
    let burst = performance.now();
    const wanted = async () => {
      if (performance.now() - burst > 18) { await new Promise(r => setTimeout(r)); burst = performance.now(); }
      return !opts.alive || opts.alive();
    };
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const g = cv.getContext('2d', { willReadFrequently: false });
    const upp = (box[2] - box[0]) / w, x0 = box[0], y0 = box[1];            // map units per pixel
    const fine = upp < 2.4, grain = upp < 0.7;
    const n = w * h, mix = new Uint8Array(n), shade = new Uint8Array(n), edge = new Uint8Array(n), speck = new Uint8Array(n), top = new Uint8Array(n);
    const img = g.createImageData(w, h), px = img.data;

    // 1 and 2: noise for every pixel, and the base plains
    const base = styles.base;
    for (let j = 0, i = 0; j < h; j++) {
      if ((j & 15) === 0 && !(await wanted())) return null;
      const wy = y0 + (j + 0.5) * upp;
      for (let k = 0; k < w; k++, i++) {
        const wx = x0 + (k + 0.5) * upp;
        const L = nz(wx * 0.33 + 11, wy * 0.33 + 47), M = nz(wx * 1.6 + 90, wy * 1.6 + 3), M2 = nz((wx + 1.6) * 1.6 + 90, (wy + 1.6) * 1.6 + 3);
        const F = fine ? nz(wx * 7 + 5, wy * 7 + 60) : 0.5, G = grain ? nz(wx * 33 + 70, wy * 33 + 9) : 0.5;
        const m = clamp01(0.5 + (L - 0.5) * 1.7 + (M - 0.5) * 0.9 + (F - 0.5) * 0.3);
        // Brighter where the ground "rises" toward the light, darker on the far side: a hint of relief.
        const s = clamp01(0.5 + (M - M2) * 2.2 + (F - 0.5) * 0.22 + (G - 0.5) * 0.2);
        mix[i] = m * 255; shade[i] = s * 255; speck[i] = F * 255;
        edge[i] = clamp01(nz(wx * 2.4 + 200, wy * 2.4 + 130) * 0.6 + (fine ? F : 0.5) * 0.28 + (grain ? G : 0.5) * 0.12) * 255;
        const o = i * 4, k2 = 0.72 + s * 0.56;
        px[o] = (base.a[0] + (base.b[0] - base.a[0]) * m) * k2; px[o + 1] = (base.a[1] + (base.b[1] - base.a[1]) * m) * k2; px[o + 2] = (base.a[2] + (base.b[2] - base.a[2]) * m) * k2; px[o + 3] = 255;
      }
    }

    // 3: soft-edged zones, each replacing what is under it where it wins.
    // The soft shapes are drawn small (a quarter of the picture's size) and read back smoothly: they are blurry
    // by nature, so nothing is lost, and blurring and reading a small canvas is many times quicker.
    const q = w > 500 ? 4 : 2, mw = Math.ceil(w / q) + 1, mh = Math.ceil(h / q) + 1;
    const mask = document.createElement('canvas');
    mask.width = mw; mask.height = mh;
    const mg = mask.getContext('2d', { willReadFrequently: true }), canBlur = 'filter' in mg;
    mg.setTransform(1 / q, 0, 0, 1 / q, 0, 0);
    const toPx = p => [(p[0] - x0) / upp, (p[1] - y0) / upp];
    const trace = (pts, closed) => { mg.beginPath(); pts.forEach((p, i) => { const c = toPx(p); if (i) mg.lineTo(c[0], c[1]); else mg.moveTo(c[0], c[1]); }); if (closed) mg.closePath(); };
    // zone: { style, id (index into `top`, or 0), feather (map units), strength, paint(): draws the shape }
    function zone(z, bounds) {
      const st = z.style, blur = Math.min(48, z.feather / upp), pad = blur * 2.5 + q + 2;
      const bx0 = Math.max(0, Math.floor((bounds[0] - x0) / upp - pad)), by0 = Math.max(0, Math.floor((bounds[1] - y0) / upp - pad));
      const bx1 = Math.min(w, Math.ceil((bounds[2] - x0) / upp + pad)), by1 = Math.min(h, Math.ceil((bounds[3] - y0) / upp + pad));
      if (bx1 <= bx0 || by1 <= by0) return;
      mg.save(); mg.setTransform(1, 0, 0, 1, 0, 0); mg.clearRect(0, 0, mw, mh); mg.restore();
      if (canBlur) mg.filter = blur / q >= 0.4 ? `blur(${(blur / q).toFixed(2)}px)` : 'none';
      z.paint();
      if (canBlur) mg.filter = 'none';
      // The part of the small canvas that covers this zone, with one spare pixel all round for smooth reading.
      const mx0 = Math.max(0, Math.floor(bx0 / q) - 1), my0 = Math.max(0, Math.floor(by0 / q) - 1), mx1 = Math.min(mw, Math.ceil(bx1 / q) + 2), my1 = Math.min(mh, Math.ceil(by1 / q) + 2);
      const sw = mx1 - mx0, sh = my1 - my0, a = mg.getImageData(mx0, my0, sw, sh).data;
      const bw = bx1 - bx0, bh = by1 - by0, rough = st.rough == null ? 0.85 : st.rough, soft = st.soft || 0.1;
      const colI = new Int32Array(bw), colF = new Float32Array(bw);
      for (let k = 0; k < bw; k++) { const u = Math.max(0, Math.min(sw - 1.001, (bx0 + k + 0.5) / q - 0.5 - mx0)); colI[k] = u | 0; colF[k] = u - (u | 0); }
      for (let j = 0; j < bh; j++) {
        const v0 = Math.max(0, Math.min(sh - 1.001, (by0 + j + 0.5) / q - 0.5 - my0)), rowI = v0 | 0, fy = v0 - rowI, r0 = rowI * sw, r1 = Math.min(sh - 1, rowI + 1) * sw;
        for (let k = 0; k < bw; k++) {
        const c0 = colI[k], c1 = Math.min(sw - 1, c0 + 1), fx = colF[k];
        const a00 = a[(r0 + c0) * 4 + 3], a10 = a[(r0 + c1) * 4 + 3], a01 = a[(r1 + c0) * 4 + 3], a11 = a[(r1 + c1) * 4 + 3];
        if (!(a00 | a10 | a01 | a11)) continue;
        const al = a00 + (a10 - a00) * fx + (a01 - a00) * fy + (a00 - a10 - a01 + a11) * fx * fy;
        const i = (by0 + j) * w + bx0 + k, v = al / 255 + (edge[i] / 255 - 0.5) * rough;
        let t = (v - (0.5 - soft)) / (2 * soft);
        if (t <= 0) continue;
        t = t >= 1 ? 1 : t * t * (3 - 2 * t);
        const m = mix[i] / 255, s = 0.72 + shade[i] / 255 * 0.56, f = speck[i] / 255, o = i * 4;
        let r = st.a[0] + (st.b[0] - st.a[0]) * m, gg = st.a[1] + (st.b[1] - st.a[1]) * m, b = st.a[2] + (st.b[2] - st.a[2]) * m;
        if (st.c && f > 0.6) { const q = Math.min(1, (f - 0.6) * 3.2); r += (st.c[0] - r) * q; gg += (st.c[1] - gg) * q; b += (st.c[2] - b) * q; }
        r *= s; gg *= s; b *= s;
        if (st.rim) { const q = (1 - Math.min(1, Math.abs(v - 0.62) * 4.5)) * 0.8; if (q > 0) { r += (st.rim[0] - r) * q; gg += (st.rim[1] - gg) * q; b += (st.rim[2] - b) * q; } }
        t *= z.strength || 1;
        px[o] += (r - px[o]) * t; px[o + 1] += (gg - px[o + 1]) * t; px[o + 2] += (b - px[o + 2]) * t;
        if (z.id && t > 0.55) top[i] = z.id; else if (z.id === 0 && t > 0.55 && z.clears) top[i] = 255;
        }
      }
    }
    // A pale strand along every shore (under the terrain areas, so only open country gets it).
    {
      const all = [0, 0, map.meta.width, map.meta.height];
      zone({ style: styles.strand, id: 0, feather: 3, strength: 0.75, paint() { mg.strokeStyle = '#000'; mg.lineWidth = 9 / upp; mg.lineJoin = 'round'; for (const c of map.coast) { trace(c.pts, true); mg.stroke(); } } }, all);
    }
    if (opts.areas !== false) for (let i = 0; i < map.biomes.length; i++) {
      const b = map.biomes[i], st = styles[b.type] || styles.unknown;
      zone({ style: st, id: Math.min(i + 1, 249), feather: st.feather || 13, paint() { mg.fillStyle = '#000'; trace(b.pts, true); mg.fill(); } }, PM.bbox(b.pts));
      if (!(await wanted())) return null;
    }
    // Tilled fields round every settlement that stands on farmable ground: larger round a capital than a town.
    if (opts.areas !== false) {
      const reach = { capital: 30, city: 24, town: 14, port: 10 }, farmable = { 'plains-dry': 1, grass: 1, hills: 1, scrub: 1, savanna: 1, farmland: 1 };
      for (const st of map.settlements) {
        const R = reach[st.type], under = PM.biomeAt(map, st.x, st.y);
        if (!R || (under && !farmable[under.type])) continue;
        zone({ style: styles.fields, id: FIELDS, feather: R * 0.35, strength: 0.8, paint() { const c = toPx([st.x, st.y]); mg.fillStyle = '#000'; mg.beginPath(); mg.arc(c[0], c[1], R / upp, 0, 6.3); mg.fill(); } }, [st.x - R, st.y - R, st.x + R, st.y + R]);
      }
      if (!(await wanted())) return null;
    }
    // Rocky ground under the peaks, so ranges rise out of the land instead of sitting on top of it.
    if (opts.ranges !== false) for (const r of map.ranges) {
      const st = styles['under-' + r.type];
      if (!st) continue;
      const line = PM.sampleCurve(r.pts, !!r.closed, 8), bb = PM.bbox(line), half = r.width * 0.75;
      zone({ style: st, id: 0, clears: true, feather: Math.max(6, r.width * 0.3), strength: st.strength || 0.8,
        paint() { mg.strokeStyle = '#000'; mg.lineWidth = r.width * 1.15 / upp; mg.lineJoin = mg.lineCap = 'round'; trace(line, !!r.closed); mg.stroke(); } },
      [bb[0] - half, bb[1] - half, bb[2] + half, bb[3] + half]);
      if (!(await wanted())) return null;
    }
    g.putImageData(img, 0, 0);

    // 4: marks, at fixed spots on the map
    if (upp < 1.5) {
      g.save();
      g.scale(1 / upp, 1 / upp);
      g.translate(-x0, -y0);
      g.lineCap = g.lineJoin = 'round';
      const thin = Math.max(0.45, upp * 0.85), tiers = upp < 0.4 ? [0, 1] : [0];
      const kinds = [[0, styles.base], [FIELDS, styles.fields]].concat(opts.areas !== false ? map.biomes.map((b, i) => [Math.min(i + 1, 249), styles[b.type] || styles.unknown]) : []);
      // Group zones by mark so each kind of mark walks the grid once.
      const byMark = new Map();
      for (const [id, st] of kinds) if (st.mark) { const key = st.mark + '|' + st.ink + '|' + (st.gap || 16); if (!byMark.has(key)) byMark.set(key, { st, ids: new Set() }); byMark.get(key).ids.add(id); }
      let salt = 1;
      for (const { st, ids } of byMark.values()) {
        salt++;
        for (const tier of tiers) {
          const cs = (st.gap || 16) / (tier ? 2.6 : 1), size = tier ? 0.55 : 1;
          for (let cy = Math.floor(box[1] / cs); cy <= Math.floor(box[3] / cs); cy++) for (let cx = Math.floor(box[0] / cs); cx <= Math.floor(box[2] / cs); cx++) {
            const h1 = cellHash(cx, cy, salt + tier * 50);
            if (h1 < (st.sparse || 0.25)) continue;
            const wx = (cx + 0.15 + cellHash(cx, cy, salt + 7) * 0.7) * cs, wy = (cy + 0.15 + cellHash(cx, cy, salt + 13) * 0.7) * cs;
            const pxX = Math.floor((wx - x0) / upp), pxY = Math.floor((wy - y0) / upp);
            if (pxX < 0 || pxY < 0 || pxX >= w || pxY >= h || !ids.has(top[pxY * w + pxX])) continue;
            mark(g, st, wx, wy, size * (0.75 + h1 * 0.5), thin, cellHash(cx, cy, salt + 29));
          }
        }
      }
      g.restore();
    }
    return cv;
  }

  // One small mark at (x, y), in map units. k: size, lw: line width, q: a random number for variety.
  function mark(g, st, x, y, k, lw, q) {
    g.strokeStyle = g.fillStyle = st.ink;
    g.lineWidth = lw;
    g.globalAlpha = st.markAlpha || 0.6;
    g.beginPath();
    switch (st.mark) {
      case 'dune': g.moveTo(x - 5 * k, y); g.quadraticCurveTo(x - 1 * k, y - 4.2 * k, x + 5 * k, y); g.stroke(); break;
      case 'tuft': g.moveTo(x - 1.2 * k, y); g.lineTo(x - 1.7 * k, y - 2.4 * k); g.moveTo(x, y); g.lineTo(x, y - 3 * k); g.moveTo(x + 1.2 * k, y); g.lineTo(x + 1.8 * k, y - 2.2 * k); g.stroke(); break;
      case 'reed': g.moveTo(x - 3 * k, y); g.lineTo(x + 3 * k, y); g.moveTo(x - 1.2 * k, y); g.lineTo(x - 1.2 * k, y - 3 * k); g.moveTo(x + 0.8 * k, y); g.lineTo(x + 0.8 * k, y - 2.3 * k); g.stroke(); break;
      case 'rock': g.moveTo(x - 2.6 * k, y); g.lineTo(x - 0.4 * k, y - 2.4 * k); g.lineTo(x + 2.4 * k, y); g.stroke(); break;
      case 'crack': g.moveTo(x - 5 * k, y - 1.5 * k); g.lineTo(x - 1.5 * k, y + (q - 0.5) * 3 * k); g.lineTo(x + 1.2 * k, y - 1.2 * k); g.lineTo(x + 5 * k, y + 1.4 * k); g.stroke(); break;
      case 'ice': g.moveTo(x - 4 * k, y); g.lineTo(x + 4 * k, y); g.stroke(); break;
      case 'shard': g.moveTo(x - 2 * k, y + 1.2 * k); g.lineTo(x + 0.4 * k, y - 2.6 * k); g.lineTo(x + 2.2 * k, y + 1.4 * k); g.closePath(); g.fill(); break;
      case 'ember': g.arc(x, y, 0.8 * k, 0, 6.3); if (q > 0.72) g.fillStyle = '#e0602b'; g.fill(); break;
      case 'bush': g.arc(x, y - 1.3 * k, 1.9 * k, 0, 6.3); g.fill(); break;
      case 'furrow': for (let i = -1; i <= 1; i++) { g.moveTo(x - 4 * k, y + i * 1.7 * k); g.lineTo(x + 4 * k, y + i * 1.7 * k - (q - 0.5) * 2 * k); } g.stroke(); break;
      case 'hill': g.moveTo(x - 4.5 * k, y); g.bezierCurveTo(x - 2.4 * k, y - 3.8 * k, x + 2.4 * k, y - 3.8 * k, x + 4.5 * k, y); g.stroke(); break;
      case 'drift': g.moveTo(x - 4 * k, y); g.quadraticCurveTo(x, y - 1.6 * k, x + 4 * k, y); g.stroke(); break;
      default: break;
    }
    g.globalAlpha = 1;
  }

  /* ---------- keeping the pictures on the map up to date ---------- */
  let svg = null, getMap = null, getOpts = () => ({}), baseUrl = '', detail = null, serial = 0, detailSerial = 0;
  const wholeBox = map => [0, 0, map.meta.width, map.meta.height];
  const toUrl = canvas => new Promise(ok => canvas.toBlob(b => ok(b ? URL.createObjectURL(b) : ''), 'image/jpeg', 0.92));
  const setImage = (id, url, box) => {
    const el = svg && svg.querySelector('#' + id);
    if (!el) return;
    if (!url) { el.removeAttribute('href'); return; }
    el.setAttribute('x', box[0]); el.setAttribute('y', box[1]); el.setAttribute('width', box[2] - box[0]); el.setAttribute('height', box[3] - box[1]);
    el.setAttribute('href', url);
  };
  // After draw.js rebuilds the land layer its two <image> elements are new and empty: fill them again.
  function attach() {
    const map = getMap();
    if (baseUrl) setImage('terrainBase', baseUrl, wholeBox(map));
    setImage('terrainDetail', detail ? detail.url : '', detail ? detail.box : null);
  }
  // Repaint the whole map. quick: a rough picture, fast enough to follow a drag.
  async function refresh(quick) {
    const map = getMap(), mine = ++serial, k = quick ? 0.4 : BASE_PX_PER_UNIT;
    const cv = await render(map, wholeBox(map), Math.round(map.meta.width * k), Math.round(map.meta.height * k), Object.assign({ alive: () => mine === serial }, getOpts()));
    if (!cv) return;                                              // a newer picture is already on its way
    const url = await toUrl(cv);
    if (mine !== serial) { URL.revokeObjectURL(url); return; }
    if (baseUrl) URL.revokeObjectURL(baseUrl);
    baseUrl = url;
    if (detail) { URL.revokeObjectURL(detail.url); detail = null; }
    attach();
    if (!quick) sharpen();
  }
  // Paint just what is on screen at screen sharpness, when zoomed in past what the whole-map picture can show.
  async function sharpen() {
    const V = window.MapView, map = getMap(), mine = ++detailSerial, dpr = Math.min(window.devicePixelRatio || 1, 1.25), scale = V.scale() * dpr;
    if (scale <= BASE_PX_PER_UNIT * 1.2) { if (detail) { URL.revokeObjectURL(detail.url); detail = null; setImage('terrainDetail', ''); } return; }
    const v = V.box(), padX = (v[2] - v[0]) * 0.12, padY = (v[3] - v[1]) * 0.12;
    const box = [Math.max(0, v[0] - padX), Math.max(0, v[1] - padY), Math.min(map.meta.width, v[2] + padX), Math.min(map.meta.height, v[3] + padY)];
    if (box[2] <= box[0] || box[3] <= box[1]) return;
    const w = Math.min(2000, Math.round((box[2] - box[0]) * scale)), h = Math.round(w * (box[3] - box[1]) / (box[2] - box[0]));
    if (w < 8 || h < 8) return;
    const cv = await render(map, box, w, h, Object.assign({ alive: () => mine === detailSerial }, getOpts()));
    if (!cv) return;
    const url = await toUrl(cv);
    if (mine !== detailSerial) { URL.revokeObjectURL(url); return; }
    if (detail) URL.revokeObjectURL(detail.url);
    detail = { url, box };
    setImage('terrainDetail', url, box);
  }
  // A picture of the whole land for export, as text that can sit inside an SVG file.
  async function dataUrl(map, pxPerUnit, opts) {
    const k = Math.min(pxPerUnit, 4800 / map.meta.width);
    return (await render(map, wholeBox(map), Math.round(map.meta.width * k), Math.round(map.meta.height * k), opts)).toDataURL('image/jpeg', 0.92);
  }

  window.MapTerrain = {
    render, attach, refresh, sharpen, dataUrl,
    init(el, mapGetter, optsGetter) { svg = el; getMap = mapGetter; getOpts = optsGetter; }
  };
})();
