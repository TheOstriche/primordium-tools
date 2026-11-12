// The window onto the map: panning, zooming, and turning screen positions into map positions.
// The viewBox of the SVG always has the same shape as the stage, so one map unit is the same number of pixels
// across and down. Two things follow the zoom:
//   --s      a CSS variable that shrinks icons and line widths as you zoom in, so they grow more slowly than
//            the land does and stay readable (draw.js multiplies sizes by it)
//   lod0-2   a class saying how much detail to show (small towns and labels appear as you zoom in)
(function () {
  'use strict';
  const MIN = 0.5, MAX = 40;          // zoom limits, as multiples of "the whole map fits"
  let svg, size = { w: 1600, h: 1200 }, simplify = true, kept = 0, whole = true;
  const vb = { x: 0, y: 0, w: 1600, h: 1200 }, listeners = [];

  const rect = () => svg.getBoundingClientRect();
  const fitScale = () => { const r = rect(); return Math.min(r.width / size.w, r.height / size.h) || 1; };
  const scale = () => (rect().width / vb.w) || 1;                    // screen pixels per map unit
  const zoom = () => scale() / fitScale();                           // 1 = the whole map fits
  const iconScale = () => Math.pow(Math.max(zoom(), 0.6), -0.45);     // the value of --s
  const clamp = s => Math.min(fitScale() * MAX, Math.max(fitScale() * MIN, s));

  function apply() {
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    svg.style.setProperty('--s', iconScale().toFixed(4));
    const z = zoom(), lod = !simplify ? 2 : z < 1.5 ? 0 : z < 2.8 ? 1 : 2;
    svg.classList.remove('lod0', 'lod1', 'lod2');
    svg.classList.add('lod' + lod);
    kept = scale();
    listeners.forEach(fn => fn());
  }
  // `whole` remembers that the view is "the whole map", so it stays that way when the window changes size.
  const moved = () => { whole = false; };
  // Show a box of the map (default: all of it), centered. `room` below 1 leaves space around the box.
  function fit(box, room) {
    const r = rect();
    if (!r.width || !r.height) return;
    const b = box || [0, 0, size.w, size.h], bw = Math.max(b[2] - b[0], 1), bh = Math.max(b[3] - b[1], 1);
    const s = clamp(Math.min(r.width / bw, r.height / bh) * (box ? (room || 0.6) : 0.98));
    vb.w = r.width / s; vb.h = r.height / s;
    vb.x = (b[0] + b[2]) / 2 - vb.w / 2; vb.y = (b[1] + b[3]) / 2 - vb.h / 2;
    apply();
    whole = !box;
  }
  function toMap(clientX, clientY) {
    const r = rect();
    return [Math.round((vb.x + (clientX - r.left) / r.width * vb.w) * 10) / 10, Math.round((vb.y + (clientY - r.top) / r.height * vb.h) * 10) / 10];
  }
  function zoomAt(clientX, clientY, factor) {
    const r = rect(), s = clamp(scale() * factor), fx = (clientX - r.left) / r.width, fy = (clientY - r.top) / r.height;
    const mx = vb.x + fx * vb.w, my = vb.y + fy * vb.h;
    vb.w = r.width / s; vb.h = r.height / s; vb.x = mx - fx * vb.w; vb.y = my - fy * vb.h;
    moved();
    apply();
  }
  const zoomBy = factor => { const r = rect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor); };
  function panBy(dxPx, dyPx) { const s = scale(); vb.x -= dxPx / s; vb.y -= dyPx / s; moved(); apply(); }
  // Keep the same center and zoom when the stage changes size.
  function resized() {
    const r = rect();
    if (!r.width || !r.height) return;
    if (whole) return fit();
    const cx = vb.x + vb.w / 2, cy = vb.y + vb.h / 2, s = clamp(kept || fitScale());
    vb.w = r.width / s; vb.h = r.height / s; vb.x = cx - vb.w / 2; vb.y = cy - vb.h / 2;
    apply();
  }

  function init(el, mapSize) {
    svg = el; size = mapSize;
    fit();
    new ResizeObserver(resized).observe(svg);
  }

  window.MapView = {
    init, fit, toMap, zoomAt, zoomBy, panBy, scale, zoom, iconScale,
    box: () => [vb.x, vb.y, vb.x + vb.w, vb.y + vb.h],
    unitsPerPx: () => 1 / scale(),
    setSimplify(on) { simplify = !!on; if (svg) apply(); },
    lod: () => (svg.classList.contains('lod0') ? 0 : svg.classList.contains('lod1') ? 1 : 2),
    onChange: fn => listeners.push(fn)
  };
})();
