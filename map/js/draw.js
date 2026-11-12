// Draws the world map as SVG. The stored map stays plain (outlines, lines, points); all the detail seen here is
// generated when drawing: roughened coasts, shallow-water bands, feathered terrain, trees, peaks, tapered rivers.
// Every random choice is seeded from the feature's id, so the picture is the same every time and a feature only
// changes when its own data changes.
//
// The picture is a stack of layers (LAYERS, bottom first). Each layer is redrawn only when the lists it reads
// change, which keeps editing quick. Nothing here uses SVG filters: they redraw slowly while panning and zooming.
//
//   MapDraw.layer(layer, map, ctx)   the SVG text of one layer
//   MapDraw.key(layer, map, ctx)     changes when that layer needs redrawing
//   MapDraw.defs(ctx)                gradients, patterns, symbols, and the map's own CSS
//   MapDraw.full(map, opts)          a complete standalone SVG (for export)
//
// ctx: { vis: { toggle: bool }, flat: bool }. `flat` bakes sizes in for export; live drawing sizes icons and
// line widths with the CSS variable --s (set by view.js) so they stay readable at any zoom.
// Colors: this is the one place the map's artwork colors live (PAL). They are the map, not the app, so they do
// not follow the light/dark theme; everything around the map uses theme tokens.
(function () {
  'use strict';
  const PM = window.PrimordiumMap;

  const PAL = {
    ink: '#2e2418', paper: '#f1e6c9',
    abyss: '#16292d', seaIn: '#3d6d6c', seaMid: '#2c5054', seaOut: '#1c363b',
    // Shallow water: [band width, band color, edge-line color], widest (deepest) first.
    shallows: [[70, '#3a6968', '#4d807c'], [48, '#44797a', '#5c918b'], [28, '#528b87', '#72a79c'], [11, '#6fa49a', '#a5cdbd']],
    land: '#aaa468', landShade: '#4a3a20', shadow: '#0c1b1e',
    water: '#86b6bf', waterEdge: '#3c6875', waterLight: '#cfe8e6',
    road: '#4a3826', roadCase: '#f3e7c6', border: '#241a12', borderCase: '#f1e4c3',
    biome: {
      'plains-dry': { fill: '#b6a765' },
      sand: { fill: '#d2ae6b' },
      mesa: { fill: '#c98a4a', pattern: 'pMesa' },
      obsidian: { fill: '#5c5b61', pattern: 'pGlass', dark: true },
      scar: { fill: 'url(#gScar)', edge: '#1b1220', glow: '#8a3fb0', dark: true },
      rock: { fill: '#9e998c', pattern: 'pRock' },
      ice: { fill: '#e9f1f3', pattern: 'pIce' },
      darkforest: { fill: '#4e6645', dark: true },
      desert: { fill: '#e3cf9a', pattern: 'pDune' },
      ash: { fill: '#3d3634', pattern: 'pAsh', dark: true },
      forest: { fill: '#84903a' },
      tundra: { fill: '#b9bfae', pattern: 'pTundra' },
      swamp: { fill: '#6d7a52', pattern: 'pSwamp' },
      grass: { fill: '#a9a65b', pattern: 'pGrass' }
    },
    peak: {
      mountain: { lit: '#b89468', shade: '#6d4c2f' },
      snow: { lit: '#d3d7d6', shade: '#7c8690' },
      volcano: { lit: '#5d4d46', shade: '#2a2220' }
    }
  };
  const FONT = { realm: "'IM Fell English SC', 'Palatino Linotype', Georgia, serif", text: "Alegreya, Georgia, serif", ui: "'Alegreya Sans', 'Segoe UI', sans-serif" };

  /* ---------- small helpers ---------- */
  const f1 = n => Math.round(n * 10) / 10;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const poly = pts => pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L');
  const memo = new Map();
  function cached(key, make) {
    if (memo.has(key)) return memo.get(key);
    if (memo.size > 600) memo.clear();
    const v = make();
    memo.set(key, v);
    return v;
  }
  // A smooth closed or open path through the points (Catmull-Rom as cubic Béziers).
  function smoothPath(pts, closed, t) {
    const n = pts.length;
    t = t == null ? 0.5 : t;
    if (n < 2) return '';
    if (n === 2) return `M${poly(pts)}`;
    const P = i => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
    for (let i = 0, segs = closed ? n : n - 1; i < segs; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += `C${f1(p1[0] + (p2[0] - p0[0]) * t / 3)},${f1(p1[1] + (p2[1] - p0[1]) * t / 3)} ${f1(p2[0] - (p3[0] - p1[0]) * t / 3)},${f1(p2[1] - (p3[1] - p1[1]) * t / 3)} ${f1(p2[0])},${f1(p2[1])}`;
    }
    return closed ? d + 'Z' : d;
  }
  // Breaks up a clean outline with small seeded wobbles (drawing only; the stored points are untouched).
  function roughen(pts, seed, amp, depth) {
    const r = PM.rng(seed);
    let cur = pts;
    for (let d = 0; d < depth; d++) {
      const next = [], a = amp / (d + 1);
      for (let i = 0; i < cur.length; i++) {
        const p = cur[i], q = cur[(i + 1) % cur.length];
        next.push(p);
        const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
        if (L < 3) continue;
        const off = (r() - 0.5) * 2 * a * Math.min(1, L / 12);
        next.push([(p[0] + q[0]) / 2 - dy / L * off, (p[1] + q[1]) / 2 + dx / L * off]);
      }
      cur = next;
    }
    return cur;
  }
  // A size that follows the zoom: live it is multiplied by --s, for export it is baked in.
  const sw = (ctx, n) => (ctx.flat ? `stroke-width="${n}"` : `style="stroke-width:calc(${n}px*var(--s))"`);
  const dashed = (ctx, n, a, b) => (ctx.flat ? `stroke-width="${n}" stroke-dasharray="${a} ${b}"`
    : `style="stroke-width:calc(${n}px*var(--s));stroke-dasharray:calc(${a}px*var(--s)) calc(${b}px*var(--s))"`);
  const at = (ctx, x, y) => (ctx.flat ? `transform="translate(${x} ${y})"` : `style="transform:translate(${x}px,${y}px) scale(var(--s))"`);

  /* ---------- textures (made once, as small images) ---------- */
  // Soft blotches plus a little grain, like hand-tinted paper. Value noise, seeded, so it never changes.
  function texture(seed, w, h, dark, light, strength) {
    if (typeof document === 'undefined') return '';
    const r = PM.rng(seed), G = 64, lattice = new Float32Array(G * G);
    for (let i = 0; i < lattice.length; i++) lattice[i] = r();
    const at2 = (x, y) => lattice[(y & (G - 1)) * G + (x & (G - 1))];
    const noise = (x, y) => {
      const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = at2(x0, y0), b = at2(x0 + 1, y0), c = at2(x0, y0 + 1), d = at2(x0 + 1, y0 + 1);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const g = cv.getContext('2d'), img = g.createImageData(w, h), px = img.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let n = 0, amp = 0.5, f = 1 / 90;
      for (let o = 0; o < 4; o++) { n += noise(x * f, y * f) * amp; amp /= 2; f *= 2.1; }
      const v = (n / 0.9375 - 0.5) * 2 + (r() - 0.5) * 0.35, c = v > 0 ? dark : light, i = (y * w + x) * 4;
      px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = Math.min(255, Math.abs(v) * strength * 255);
    }
    g.putImageData(img, 0, 0);
    return cv.toDataURL('image/png');
  }
  let tex = null;
  const textures = () => tex || (tex = {
    land: texture(7, 640, 480, [70, 48, 20], [255, 246, 214], 0.42),
    sea: texture(11, 640, 480, [8, 26, 32], [190, 228, 220], 0.3)
  });

  /* ---------- generated detail ---------- */
  const coastPath = c => cached('c' + JSON.stringify(c), () => smoothPath(roughen(c.pts, PM.hash(c.id), c.pts.length > 100 ? 2.4 : 1.6, 2), true, 0.4));
  const allCoasts = map => map.coast.map(coastPath).join('');
  // The same coasts without the fine roughening: a quarter of the points, for the wide soft strokes (shallows,
  // shading) where the detail would not show but would still cost time on every pan and zoom.
  const softCoasts = map => map.coast.map(c => cached('s' + JSON.stringify(c.pts), () => smoothPath(c.pts, true, 0.4))).join('');
  const biomePath = b => cached('b' + JSON.stringify(b.pts) + b.id, () => smoothPath(roughen(b.pts, PM.hash(b.id), 5, 2), true, 0.5));

  // Little wave marks out in open water, away from every shore.
  function waves(map) {
    const r = PM.rng(97), step = 64;
    let d = '';
    for (let y = step / 2; y < map.meta.height; y += step) for (let x = step / 2; x < map.meta.width; x += step) {
      const px = x + (r() - 0.5) * step * 0.8, py = y + (r() - 0.5) * step * 0.8, w = 5 + r() * 4;
      if (r() < 0.35 || PM.onLand(map, px, py) || PM.shoreDistance(map, px, py) < 62) continue;
      d += `M${f1(px - w)},${f1(py)}q${f1(w / 2)},${f1(-w * 0.45)} ${f1(w)},0q${f1(w / 2)},${f1(w * 0.45)} ${f1(w)},0`;
    }
    return d;
  }

  function trees(map, b) {
    const conifer = b.type === 'darkforest', sp = conifer ? 10.5 : 9, r = PM.rng(PM.hash(b.id));
    const [x0, y0, x1, y1] = PM.bbox(b.pts), list = [];
    for (let y = y0, row = 0; y <= y1; y += sp * 0.8, row++) for (let x = x0 + (row % 2) * sp / 2; x <= x1; x += sp) {
      const px = x + (r() - 0.5) * sp * 0.85, py = y + (r() - 0.5) * sp * 0.65, k = 0.75 + r() * 0.55, skip = r() < 0.07;
      if (skip || !PM.inPolygon(px, py, b.pts) || !PM.onLand(map, px, py) || PM.shoreDistance(map, px, py) < 3) continue;
      list.push([px, py, k]);
    }
    list.sort((a, c) => a[1] - c[1]);
    const id = conifer ? 'tCon' : 'tDec';
    return list.map(([x, y, k]) => `<use href="#${id}" transform="translate(${f1(x)} ${f1(y)}) scale(${f1(k * 10) / 10})"/>`).join('');
  }

  // Peaks along a ridge line: tallest down the middle of the band, smaller toward its edges and its two ends,
  // with low foothills outside. Drawn back to front so nearer peaks overlap farther ones.
  function peaks(g) {
    const r = PM.rng(PM.hash(g.id)), W = g.width, type = g.type, simple = type === 'volcano' || type === 'butte';
    const path = PM.sampleCurve(g.pts, !!g.closed, 3), total = PM.lineLength(path) || 1;
    const spacing = type === 'volcano' ? 22 : type === 'butte' ? 26 : Math.max(8, W * 0.36), rows = simple ? 1 : Math.max(1, Math.round(W / 13));
    const out = [];
    let acc = spacing / 2, run = 0;
    for (let i = 1; i < path.length; i++) {
      const [ax, ay] = path[i - 1], [bx, by] = path[i], L = Math.hypot(bx - ax, by - ay);
      if (!L) continue;
      acc += L;
      while (acc >= spacing) {
        acc -= spacing;
        const t = 1 - acc / L, x = ax + (bx - ax) * t, y = ay + (by - ay) * t, nx = -(by - ay) / L, ny = (bx - ax) / L;
        const along = (run + L * t) / total, taper = g.closed ? 1 : Math.min(1, 0.5 + Math.min(along, 1 - along) * 5);
        for (let k = 0; k < rows; k++) {
          const u = rows === 1 ? (r() - 0.5) * 0.5 : ((k + 0.5) / rows - 0.5) * 1.05 + (r() - 0.5) * 0.22, edge = Math.min(1, Math.abs(u) * 2);
          out.push({ x: x + nx * u * W + (r() - 0.5) * spacing * 0.5, y: y + ny * u * W + (r() - 0.5) * 3, q: r(), size: taper * (1 - 0.45 * edge * edge), hill: false });
        }
        if (!simple) for (const side of [-1, 1]) if (r() < 0.55) out.push({ x: x + nx * side * W * (0.62 + r() * 0.12) + (r() - 0.5) * spacing, y: y + ny * side * W * (0.62 + r() * 0.12), q: r(), size: taper, hill: true });
      }
      run += L;
    }
    out.sort((a, b) => a.y - b.y);
    const c = PAL.peak[type] || PAL.peak.mountain, ink = PAL.ink;
    let s = '';
    for (const p of out) {
      const { x, y, q } = p;
      if (p.hill) {
        const w = (4.5 + q * 3) * p.size, h = w * 0.62;
        s += `<path d="M${f1(x - w)},${f1(y)}C${f1(x - w * 0.55)},${f1(y - h * 1.3)} ${f1(x + w * 0.55)},${f1(y - h * 1.3)} ${f1(x + w)},${f1(y)}Z" fill="${c.lit}" stroke="${ink}" stroke-width=".55"/>` +
          `<path d="M${f1(x + w * 0.05)},${f1(y - h * 0.97)}C${f1(x + w * 0.5)},${f1(y - h * 0.9)} ${f1(x + w * 0.85)},${f1(y - h * 0.4)} ${f1(x + w)},${f1(y)}L${f1(x + w * 0.35)},${f1(y)}Z" fill="${c.shade}" opacity=".75"/>`;
        continue;
      }
      if (type === 'butte') {
        const w = 10 + q * 8, h = 7 + q * 4;
        s += `<path d="M${f1(x - w)},${f1(y)}L${f1(x - w * 0.62)},${f1(y - h)}H${f1(x + w * 0.62)}L${f1(x + w)},${f1(y)}Z" fill="#b8743c" stroke="#5c3518" stroke-width=".8" stroke-linejoin="round"/>` +
          `<path d="M${f1(x + w * 0.1)},${f1(y - h)}H${f1(x + w * 0.62)}L${f1(x + w)},${f1(y)}H${f1(x + w * 0.3)}Z" fill="#7c4a22" opacity=".7"/>` +
          `<path d="M${f1(x - w * 0.62)},${f1(y - h)}H${f1(x + w * 0.62)}" stroke="#e6b27a" stroke-width="1.3" stroke-linecap="round"/>` +
          `<path d="M${f1(x - w * 0.35)},${f1(y - h * 0.9)}v${f1(h * 0.55)}M${f1(x - w * 0.05)},${f1(y - h * 0.9)}v${f1(h * 0.4)}" stroke="#5c3518" stroke-width=".5" opacity=".6"/>`;
        continue;
      }
      const h = (8 + W * 0.34) * p.size * (0.7 + q * 0.6) + (type === 'volcano' ? 5 : 0), w = h * (0.66 + q * 0.14);
      const tx = x + (q - 0.5) * w * 0.3, ty = y - h, sl = [x - w * 0.5, y - h * 0.44], sr = [x + w * 0.52, y - h * 0.4];
      if (type === 'volcano') {
        const cw = w * 0.2;
        s += `<circle cx="${f1(tx)}" cy="${f1(ty)}" r="${f1(h * 0.55)}" fill="url(#gLava)"/>` +
          `<path d="M${f1(x - w)},${f1(y)}L${f1(sl[0])},${f1(sl[1])}L${f1(tx - cw)},${f1(ty)}L${f1(tx + cw)},${f1(ty)}L${f1(sr[0])},${f1(sr[1])}L${f1(x + w)},${f1(y)}Z" fill="${c.lit}" stroke="${ink}" stroke-width=".9" stroke-linejoin="round"/>` +
          `<path d="M${f1(tx + cw * 0.2)},${f1(ty)}L${f1(tx + cw)},${f1(ty)}L${f1(sr[0])},${f1(sr[1])}L${f1(x + w)},${f1(y)}H${f1(x + w * 0.18)}L${f1(tx + w * 0.1)},${f1(y - h * 0.5)}Z" fill="${c.shade}"/>` +
          `<path d="M${f1(tx - cw)},${f1(ty)}h${f1(cw * 2)}" stroke="#ff7a2a" stroke-width="2.2" stroke-linecap="round"/>` +
          `<path d="M${f1(tx - cw * 0.3)},${f1(ty + 1)}q${f1(-3 + q * 5)},${f1(h * 0.4)} ${f1(-w * 0.32)},${f1(h * 0.86)}" stroke="#ff8a36" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
        continue;
      }
      s += `<path d="M${f1(x - w)},${f1(y)}L${f1(sl[0])},${f1(sl[1])}L${f1(tx)},${f1(ty)}L${f1(sr[0])},${f1(sr[1])}L${f1(x + w)},${f1(y)}Z" fill="${c.lit}" stroke="${ink}" stroke-width=".85" stroke-linejoin="round"/>` +
        `<path d="M${f1(tx)},${f1(ty)}L${f1(sr[0])},${f1(sr[1])}L${f1(x + w)},${f1(y)}H${f1(x + w * 0.16)}L${f1(tx + w * 0.1)},${f1(y - h * 0.48)}Z" fill="${c.shade}"/>`;
      if (type === 'snow' || h > 21) {
        const a = h * 0.3;
        s += `<path d="M${f1(tx)},${f1(ty)}L${f1(tx - w * 0.25)},${f1(ty + a)}L${f1(tx - w * 0.09)},${f1(ty + a * 0.74)}L${f1(tx + w * 0.03)},${f1(ty + a * 1.08)}L${f1(tx + w * 0.15)},${f1(ty + a * 0.7)}L${f1(tx + w * 0.26)},${f1(ty + a)}Z" fill="#fbfdff" stroke="${ink}" stroke-width=".3" stroke-linejoin="round"/>`;
      }
      s += `<path d="M${f1(tx)},${f1(ty)}L${f1(tx - w * 0.1)},${f1(y - h * 0.62)}L${f1(tx + w * 0.07)},${f1(y - h * 0.4)}L${f1(tx - w * 0.04)},${f1(y - h * 0.16)}" fill="none" stroke="${ink}" stroke-width=".5" opacity=".55" stroke-linejoin="round"/>`;
    }
    return s;
  }

  // A river's outline: narrow at its source (first point), widening to its mouth.
  function riverShape(rv) {
    const pts = PM.sampleCurve(rv.pts, false, 4), n = pts.length, [w0, w1] = rv.width, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const w = (w0 + (w1 - w0) * Math.pow(i / (n - 1 || 1), 0.8)) / 2;
      L.push([pts[i][0] - dy / l * w, pts[i][1] + dx / l * w]);
      R.push([pts[i][0] + dy / l * w, pts[i][1] - dx / l * w]);
    }
    return 'M' + poly(L.concat(R.reverse())) + 'Z';
  }

  /* ---------- static parts ---------- */
  const STYLE = `
    .pin .dot{display:none}
    .lod0 .pin.minor .ico,.lod0 .pin.minor .nm,.lod0 .minor-road,.lod0 .small-label{display:none}
    .lod0 .pin.minor .dot{display:inline}
    .lod1 .pin.minor .nm{display:none}
    text{user-select:none;-webkit-user-select:none}`;
  const SYMBOLS = (() => {
    const body = `fill="${PAL.ink}" stroke="${PAL.paper}" stroke-width="1.2" paint-order="stroke" stroke-linejoin="round"`;
    return `
    <g id="sCapital"><circle r="13" cy="-4" fill="${PAL.paper}" opacity=".35"/><path d="M-11 4v-8h3v-5h-1.2l2.7-3.6 2.7 3.6h-1.2v3h2.5v-7.5h-1.2l2.7-3.8 2.7 3.8h-1.2v7.5h2.5v-3h-1.2l2.7-3.6 2.7 3.6h-1.2v5h3v8z" ${body}/><path d="M0-17.6v-4.6l4.6 1.6-4.6 1.6" fill="#8f2c22" stroke="#8f2c22" stroke-width=".6" stroke-linejoin="round"/><path d="M-1.8 4v-3.6a1.8 1.8 0 0 1 3.6 0v3.6z" fill="${PAL.paper}"/></g>
    <g id="sCity"><path d="M-8 3.5v-6.5h2.4v-2.2h-1l2.2-2.9 2.2 2.9h-1v2.2h2.4v-5.4h-1l2.2-2.9 2.2 2.9h-1v5.4h2.4v6.5z" ${body}/><path d="M-1.3 3.5v-2.6a1.3 1.3 0 0 1 2.6 0v2.6z" fill="${PAL.paper}"/></g>
    <g id="sTown"><path d="M-6 3.2v-3.6l3-2.7 2.4 2.1v-2.1l3.4-3 3.4 3v6.3z" ${body}/></g>
    <g id="sPort"><circle r="6.4" cy="-1" fill="${PAL.paper}" stroke="${PAL.ink}" stroke-width="1"/><g stroke="${PAL.ink}" stroke-width="1.35" fill="none" stroke-linecap="round"><circle cy="-4.3" r="1.25"/><path d="M0-3v6.4M-2.4-1.4h4.8M-3.9 0.6q.4 2.9 3.9 2.9t3.9-2.9"/></g></g>
    <g id="sFort"><path d="M-4 3.2v-8.4h1.7v1.5h1.4v-1.5h1.8v1.5h1.4v-1.5h1.7v8.4z" ${body}/></g>
    <g id="sRuin"><path d="M-4.6 3.2v-5.4l1.2-.9 1.2 1.6v4.7zM.8 3.2v-7.6l1.6-.8.9 1.9.9-.6v7.1z" ${body}/></g>
    <g id="tDec"><ellipse cx="1" cy=".6" rx="4.2" ry="1.6" fill="#2c3410" opacity=".35"/><circle cx=".7" cy="-3.3" r="4.2" fill="#48531c"/><circle cy="-4" r="4" fill="#7d8c2c"/><circle cx="-1.4" cy="-5.4" r="1.9" fill="#a3b047"/></g>
    <g id="tCon"><ellipse cx="1" cy=".5" rx="3.6" ry="1.3" fill="#16210f" opacity=".4"/><path d="M0-10.5l4 6.4h-2l3 4.1h-10l3-4.1h-2z" fill="#2f4a2e" stroke="#1d2e1c" stroke-width=".5" stroke-linejoin="round"/><path d="M0-10.5l-4 6.4h2l-3 4.1h3.6l1-4.1h-.9z" fill="#5d7b4d"/></g>`;
  })();
  function defs(ctx) {
    const t = textures();
    return `<style>${ctx.flat ? 'text{}' : STYLE}</style>
    <radialGradient id="gSea" cx="50%" cy="48%" r="72%"><stop offset="0" stop-color="${PAL.seaIn}"/><stop offset=".65" stop-color="${PAL.seaMid}"/><stop offset="1" stop-color="${PAL.seaOut}"/></radialGradient>
    <radialGradient id="gScar" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#40204f"/><stop offset=".45" stop-color="#1b1220"/><stop offset="1" stop-color="#0e0a10"/></radialGradient>
    <radialGradient id="gLava"><stop offset="0" stop-color="#ff6a1f" stop-opacity=".55"/><stop offset="1" stop-color="#ff6a1f" stop-opacity="0"/></radialGradient>
    <pattern id="pMesa" width="34" height="26" patternUnits="userSpaceOnUse"><path d="M2 8l8 3 5-4 9 5M18 20l6-3 8 2M4 22l5-2" stroke="#8e5a2c" stroke-width=".9" fill="none" opacity=".55"/></pattern>
    <pattern id="pGlass" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M3 6l4-3 2 5zM14 15l5-2-1 6z" fill="#8a8a96" opacity=".6"/><path d="M4 5l2-1M15 14l3-1" stroke="#cfd3e6" stroke-width=".6"/></pattern>
    <pattern id="pRock" width="30" height="24" patternUnits="userSpaceOnUse"><path d="M4 7l3-2 3 2M19 17l3-2 3 2M17 5l2-1" stroke="#6f6a5e" stroke-width=".8" fill="none" opacity=".55"/></pattern>
    <pattern id="pIce" width="40" height="30" patternUnits="userSpaceOnUse"><path d="M3 10h9M20 22h11M27 6h7" stroke="#a9c8d3" stroke-width="1" opacity=".7" stroke-linecap="round"/></pattern>
    <pattern id="pDune" width="46" height="24" patternUnits="userSpaceOnUse"><path d="M2 14q9-9 18 0M24 22q9-9 18 0M28 6q5-5 10 0" stroke="#b79a5c" stroke-width="1" fill="none" opacity=".75" stroke-linecap="round"/></pattern>
    <pattern id="pAsh" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r=".9" fill="#7a6e66"/><circle cx="14" cy="13" r=".7" fill="#7a6e66"/><circle cx="9" cy="17" r=".6" fill="#e0602b" opacity=".6"/></pattern>
    <pattern id="pTundra" width="26" height="20" patternUnits="userSpaceOnUse"><path d="M4 6h3M15 14h4M20 4h2" stroke="#8d9482" stroke-width=".8" opacity=".6" stroke-linecap="round"/></pattern>
    <pattern id="pSwamp" width="24" height="18" patternUnits="userSpaceOnUse"><path d="M3 6h7M14 13h7" stroke="#48583a" stroke-width=".8" opacity=".7" stroke-linecap="round"/><path d="M5 5.5v-3M7 5.5v-2.2M16 12.5v-3M18 12.5v-2" stroke="#3d4a2e" stroke-width=".7" opacity=".8" stroke-linecap="round"/></pattern>
    <pattern id="pGrass" width="28" height="22" patternUnits="userSpaceOnUse"><path d="M5 8l1-3M7 8l1-2.4M19 17l1-3M21 17l1-2.4" stroke="#7d7c3c" stroke-width=".7" opacity=".6" stroke-linecap="round"/></pattern>
    ${SYMBOLS}
    <image id="texLand" href="${t.land}" width="1" height="1" preserveAspectRatio="none"/>
    <image id="texSea" href="${t.sea}" width="1" height="1" preserveAspectRatio="none"/>`;
  }

  /* ---------- the layers, bottom first ---------- */
  // needs: the lists (or 'meta') the layer reads; toggles: the Layers switches it obeys.
  const LAYERS = [
    { id: 'sea', needs: ['coast', 'meta'], toggles: [], draw(map) {
      const W = map.meta.width, H = map.meta.height, use = a => `<use href="#coastSoft" ${a}/>`;
      let s = `<defs><path id="coastAll" d="${allCoasts(map)}"/><path id="coastSoft" d="${softCoasts(map)}"/></defs>` +
        `<rect x="${-W * 3}" y="${-H * 3}" width="${W * 7}" height="${H * 7}" fill="${PAL.abyss}"/><rect width="${W}" height="${H}" fill="url(#gSea)"/>` +
        `<g fill="none" stroke-linejoin="round">`;
      for (const [w, band, edge] of PAL.shallows) s += use(`stroke="${edge}" stroke-width="${w + 1.6}"`) + use(`stroke="${band}" stroke-width="${w}"`);
      s += `</g><use href="#texSea" transform="scale(${W} ${H})"/>` +
        `<path d="${cached('w' + JSON.stringify(map.coast) + W + H, () => waves(map))}" fill="none" stroke="#a9cfc6" stroke-width=".8" opacity=".4" stroke-linecap="round"/>` +
        `<use href="#coastAll" fill="${PAL.shadow}" opacity=".4" transform="translate(2.2 3.2)"/>`;
      return s;
    } },
    { id: 'land', needs: ['coast', 'biomes', 'meta'], toggles: ['biomes'], draw(map, ctx) {
      const W = map.meta.width, H = map.meta.height;
      let s = `<clipPath id="landClip"><use href="#coastAll"/></clipPath><g clip-path="url(#landClip)"><rect width="${W}" height="${H}" fill="${PAL.land}"/>`;
      if (ctx.vis.biomes) for (const b of map.biomes) {
        const st = PAL.biome[b.type] || { fill: '#999' }, d = biomePath(b), edge = st.edge || st.fill;
        // The same shape again with two soft, wider strokes feathers the edge into its neighbours.
        s += `<path d="${d}" fill="none" stroke="${edge}" stroke-width="20" stroke-opacity=".28" stroke-linejoin="round"/>` +
          `<path d="${d}" fill="${st.fill}" stroke="${edge}" stroke-width="9" stroke-opacity=".5" stroke-linejoin="round"/>`;
        if (st.pattern) s += `<path d="${d}" fill="url(#${st.pattern})"/>`;
        if (st.glow) s += `<path d="${d}" fill="none" stroke="${st.glow}" stroke-width="16" opacity=".14"/><path d="${d}" fill="none" stroke="${st.glow}" stroke-width="7" opacity=".22"/><path d="${d}" fill="none" stroke="${st.glow}" stroke-width="2" opacity=".45"/>`;
      }
      s += `<use href="#texLand" transform="scale(${W} ${H})"/>` +
        `<g fill="none" stroke="${PAL.landShade}" stroke-linejoin="round"><use href="#coastSoft" stroke-width="24" opacity=".08"/><use href="#coastSoft" stroke-width="11" opacity=".1"/><use href="#coastAll" stroke-width="4.5" opacity=".14"/></g></g>`;
      return s;
    } },
    { id: 'coastline', needs: ['coast'], toggles: [], draw: (map, ctx) => `<use href="#coastAll" fill="none" stroke="${PAL.ink}" stroke-linejoin="round" ${sw(ctx, 1.25)}/>` },
    { id: 'water', needs: ['rivers', 'lakes'], toggles: ['rivers'], draw(map, ctx) {
      if (!ctx.vis.rivers) return '';
      let s = '';
      for (const rv of map.rivers) s += `<path d="${cached('v' + JSON.stringify(rv), () => riverShape(rv))}" fill="${PAL.water}" stroke="${PAL.waterEdge}" stroke-width=".6" stroke-linejoin="round"/>`;
      for (const lk of map.lakes) {
        const d = smoothPath(lk.pts, true, 0.5);
        s += `<path d="${d}" fill="${PAL.water}" stroke="${PAL.waterLight}" stroke-width="4.5" stroke-opacity=".35"/><path d="${d}" fill="${PAL.water}" stroke="${PAL.waterEdge}" stroke-width=".9"/>`;
      }
      return s;
    } },
    { id: 'trees', needs: ['biomes', 'coast'], toggles: ['trees'], draw(map, ctx) {
      if (!ctx.vis.trees) return '';
      const coast = JSON.stringify(map.coast);
      return map.biomes.filter(b => b.type === 'forest' || b.type === 'darkforest').map(b => cached('t' + JSON.stringify(b) + PM.hash(coast), () => trees(map, b))).join('');
    } },
    { id: 'roads', needs: ['roads', 'settlements'], toggles: ['roads'], draw(map, ctx) {
      if (!ctx.vis.roads) return '';
      let s = `<g fill="none" stroke-linecap="round" stroke-linejoin="round">`;
      for (const rd of map.roads) {
        const pts = PM.roadLine(map, rd);
        if (pts.length < 2) continue;
        const d = 'M' + poly(pts), cls = rd.major ? '' : ' class="minor-road"';
        s += `<g${cls}><path d="${d}" stroke="${PAL.roadCase}" opacity=".4" ${sw(ctx, rd.major ? 2.8 : 1.8)}/>` +
          `<path d="${d}" stroke="${PAL.road}" ${rd.major ? dashed(ctx, 1.5, 5, 3) : dashed(ctx, 1, 2, 3)}/></g>`;
      }
      return s + '</g>';
    } },
    { id: 'ranges', needs: ['ranges'], toggles: ['ranges'], draw: (map, ctx) => (ctx.vis.ranges ? map.ranges.map(g => cached('r' + JSON.stringify(g), () => peaks(g))).join('') : '') },
    { id: 'borders', needs: ['borders'], toggles: ['borders'], draw(map, ctx) {
      if (!ctx.vis.borders) return '';
      let s = `<g fill="none" stroke-linecap="round">`;
      for (const b of map.borders) {
        const d = smoothPath(b.pts, !!b.closed);
        s += `<path d="${d}" stroke="${PAL.borderCase}" opacity=".28" ${sw(ctx, 3.6)}/><path d="${d}" stroke="${PAL.border}" ${dashed(ctx, 2.1, 0.1, 6)}/>`;
      }
      return s + '</g>';
    } },
    { id: 'grid', needs: ['meta'], toggles: ['grid'], draw(map, ctx) {
      if (!ctx.vis.grid) return '';
      const W = map.meta.width, H = map.meta.height;
      let d = '', t = '';
      for (let x = 0; x <= W; x += 50) { d += `M${x},0V${H}`; if (x % 100 === 0 && x) t += `<text x="${x + 3}" y="12">${x}</text>`; }
      for (let y = 0; y <= H; y += 50) { d += `M0,${y}H${W}`; if (y % 100 === 0 && y) t += `<text x="3" y="${y - 3}">${y}</text>`; }
      return `<path d="${d}" fill="none" stroke="${PAL.ink}" stroke-width=".5" opacity=".25"/><g font-family="${FONT.ui}" font-size="9" fill="${PAL.paper}" opacity=".8">${t}</g>`;
    } },
    { id: 'places', needs: ['settlements'], toggles: ['settlements', 'labels'], draw(map, ctx) {
      if (!ctx.vis.settlements) return '';
      const icon = { capital: 'sCapital', city: 'sCity', town: 'sTown', port: 'sPort', fort: 'sFort', ruin: 'sRuin' };
      let s = '';
      for (const st of map.settlements) {
        const big = st.type === 'capital' || st.type === 'city', fs = st.type === 'capital' ? 13 : st.type === 'city' ? 11.5 : 10;
        s += `<g class="pin${big ? '' : ' minor'}" ${at(ctx, st.x, st.y)}><circle class="dot" r="2.3" fill="${PAL.ink}" stroke="${PAL.paper}" stroke-width="1"/><use class="ico" href="#${icon[st.type] || 'sTown'}"/>`;
        if (st.name && ctx.vis.labels) s += `<text class="nm" y="${fs + 5}" text-anchor="middle" font-family="${FONT.text}" font-size="${fs}" ${st.type === 'capital' ? 'font-weight="700" ' : ''}fill="${PAL.ink}" stroke="${PAL.paper}" stroke-width="3" paint-order="stroke" stroke-linejoin="round">${esc(st.name)}</text>`;
        s += '</g>';
      }
      return s;
    } },
    { id: 'labels', needs: ['labels', 'biomes'], toggles: ['labels'], draw(map, ctx) {
      if (!ctx.vis.labels) return '';
      let s = '';
      for (const l of map.labels) {
        const realm = l.kind === 'realm', sea = l.kind === 'sea', under = PM.biomeAt(map, l.x, l.y);
        const onDark = sea || !!(under && (PAL.biome[under.type] || {}).dark && PM.onLand(map, l.x, l.y));
        const fill = onDark ? PAL.paper : PAL.ink, halo = onDark ? '#140e0c' : PAL.paper;
        const look = realm ? `font-family="${FONT.realm}" letter-spacing="${f1(l.size * 0.14)}" fill-opacity=".88"` : `font-family="${FONT.text}" font-style="italic" letter-spacing="${sea ? f1(l.size * 0.1) : 0.6}"`;
        s += `<text${l.size < 16 ? ' class="small-label"' : ''} x="${l.x}" y="${l.y}" transform="rotate(${l.rot || 0} ${l.x} ${l.y})" text-anchor="middle" dominant-baseline="middle" font-size="${l.size}" ${look} fill="${fill}" stroke="${halo}" stroke-width="${f1(Math.max(2.4, l.size * 0.14))}" stroke-opacity="${sea ? 0.35 : 0.8}" paint-order="stroke" stroke-linejoin="round">${esc(l.text)}</text>`;
      }
      return s;
    } },
    { id: 'frame', needs: ['meta'], toggles: ['deco'], draw(map, ctx) {
      const W = map.meta.width, H = map.meta.height, gold = '#d8c79a', dim = '#6e5b3a', line = '#4a3d28';
      let ticks = '';
      for (let x = 100; x < W; x += 100) ticks += `M${x},0v7M${x},${H}v-7`;
      for (let y = 100; y < H; y += 100) ticks += `M0,${y}h7M${W},${y}h-7`;
      let s = `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${PAL.abyss}" stroke-width="6"/><rect x="3" y="3" width="${W - 6}" height="${H - 6}" fill="none" stroke="${gold}" stroke-width="1" opacity=".7"/><path d="${ticks}" stroke="${gold}" stroke-width="1" opacity=".7"/>`;
      if (!ctx.vis.deco) return s;
      // Compass rose
      const cx = 200, cy = 170, R = 86;
      s += `<g opacity=".9"><circle cx="${cx}" cy="${cy}" r="${R * 0.64}" fill="none" stroke="${gold}" stroke-width="1.1" opacity=".6"/><circle cx="${cx}" cy="${cy}" r="${R * 0.7}" fill="none" stroke="${gold}" stroke-width=".5" opacity=".6"/>`;
      for (const pass of [1, 2, 0]) for (let i = 0; i < 16; i++) {
        const rank = i % 4 === 0 ? 0 : i % 2 === 0 ? 1 : 2;
        if (rank !== pass) continue;
        const a = i * Math.PI / 8 - Math.PI / 2, L = [R, R * 0.62, R * 0.4][rank], w = [10, 7, 4.5][rank];
        const tip = [cx + Math.cos(a) * L, cy + Math.sin(a) * L], side = k => [cx + Math.cos(a + k * Math.PI / 2) * w, cy + Math.sin(a + k * Math.PI / 2) * w];
        s += `<path d="M${cx},${cy}L${poly([side(-1), tip])}Z" fill="${gold}" stroke="${line}" stroke-width=".7" stroke-linejoin="round"/><path d="M${cx},${cy}L${poly([side(1), tip])}Z" fill="${dim}" stroke="${line}" stroke-width=".7" stroke-linejoin="round"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="3" fill="${line}" stroke="${gold}" stroke-width="1"/><text x="${cx}" y="${cy - R - 9}" text-anchor="middle" font-family="${FONT.realm}" font-size="22" fill="#e6d7ac">N</text></g>`;
      // Scale bar
      const sc = map.meta.scale, px = sc.barUnits * sc.pxPerUnit, x0 = 90, y0 = H - 70, cream = '#e6d7ac';
      s += `<g font-family="${FONT.text}" font-size="13" fill="${cream}">`;
      for (let i = 0; i < 4; i++) s += `<rect x="${f1(x0 + i * px / 4)}" y="${y0}" width="${f1(px / 4)}" height="6" fill="${i % 2 ? cream : '#3b3022'}" stroke="${cream}" stroke-width=".8"/>`;
      s += `<text x="${x0}" y="${y0 - 6}" text-anchor="middle">0</text><text x="${f1(x0 + px)}" y="${y0 - 6}" text-anchor="middle">${esc(sc.barUnits)} ${esc(sc.unit)}</text>`;
      if (sc.note) s += `<text x="${x0}" y="${y0 + 22}" font-size="11" font-style="italic" opacity=".75">scale not yet set</text>`;
      return s + '</g>';
    } }
  ];
  // The switches in the Layers panel.
  const TOGGLES = [['biomes', 'Terrain'], ['trees', 'Forests'], ['ranges', 'Mountains'], ['rivers', 'Rivers and lakes'], ['borders', 'Borders'], ['roads', 'Roads'],
    ['settlements', 'Settlements'], ['labels', 'Names and labels'], ['deco', 'Compass and scale'], ['grid', 'Grid (every 50 units)']];
  const defaultVis = () => Object.fromEntries(TOGGLES.map(([k]) => [k, k !== 'grid']));

  const layer = (L, map, ctx) => L.draw(map, ctx);
  const key = (L, map, ctx) => L.toggles.map(t => (ctx.vis[t] ? 1 : 0)).join('') + (ctx.flat ? 'F' : '') + L.needs.map(n => JSON.stringify(map[n])).join('|');

  // A complete standalone SVG with every layer on and sizes baked in. `fontCss` (optional) embeds the fonts.
  function full(map, opts) {
    opts = opts || {};
    const ctx = { vis: opts.vis || defaultVis(), flat: true }, W = map.meta.width, H = map.meta.height, scale = opts.scale || 1;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * scale}" height="${H * scale}">` +
      (opts.fontCss ? `<style>${opts.fontCss}</style>` : '') + `<defs>${defs(ctx)}</defs>` +
      LAYERS.map(L => `<g>${layer(L, map, ctx)}</g>`).join('') + '</svg>';
  }

  window.MapDraw = { LAYERS, TOGGLES, PAL, FONT, defaultVis, defs, layer, key, full, esc };
})();
