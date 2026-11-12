// The window onto the map: panning, zooming, and turning screen positions into map positions.
// The viewBox of the SVG always has the same shape as the stage, so one map unit is the same number of pixels
// across and down. Zooming and "go to" glide to where they are going (unless the device asks for less motion):
// `goal` is where the view is heading and `vb` is where it is now.
// Two things follow the zoom:
//   --s      a CSS variable that shrinks icons and line widths as you zoom in, so they grow more slowly than
//            the land does and stay readable (draw.js multiplies sizes by it)
//   lod0-3   a class saying how much detail to show (small towns and labels appear as you zoom in, and the
//            big realm names fade once you are close)
(function () {
  'use strict';
  const MIN = 0.5, MAX = 48;          // zoom limits, as multiples of "the whole map fits"
  let svg, size = { w: 1600, h: 1200 }, simplify = true, whole = true, frame = 0;
  const vb = { x: 0, y: 0, w: 1600, h: 1200 }, goal = { x: 0, y: 0, w: 1600, h: 1200 }, listeners = [];
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rect = () => svg.getBoundingClientRect();
  const fitScale = () => { const r = rect(); return Math.min(r.width / size.w, r.height / size.h) || 1; };
  const scale = () => (rect().width / vb.w) || 1;                    // screen pixels per map unit
  const zoom = () => scale() / fitScale();                           // 1 = the whole map fits
  const iconScale = () => Math.pow(Math.max(zoom(), 0.6), -0.45);    // the value of --s
  const clamp = s => Math.min(fitScale() * MAX, Math.max(fitScale() * MIN, s));

  function apply() {
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    svg.style.setProperty('--s', iconScale().toFixed(4));
    const z = zoom(), byZoom = z < 1.5 ? 0 : z < 2.8 ? 1 : z < 6 ? 2 : 3, lod = simplify ? byZoom : Math.max(2, byZoom);
    if (!svg.classList.contains('lod' + lod)) { svg.classList.remove('lod0', 'lod1', 'lod2', 'lod3'); svg.classList.add('lod' + lod); }
    listeners.forEach(fn => fn());
  }
  // Move toward the goal a little each frame; arrive at once when asked to (or when motion is unwanted).
  function head(now) {
    if (now || still) { Object.assign(vb, goal); cancelAnimationFrame(frame); frame = 0; return apply(); }
    if (frame) return;
    const tick = () => {
      const k = 0.26, done = Math.abs(goal.w - vb.w) < vb.w * 0.002 && Math.abs(goal.x - vb.x) < vb.w * 0.001 && Math.abs(goal.y - vb.y) < vb.h * 0.001;
      if (done) { Object.assign(vb, goal); frame = 0; } else {
        vb.x += (goal.x - vb.x) * k; vb.y += (goal.y - vb.y) * k; vb.w += (goal.w - vb.w) * k; vb.h += (goal.h - vb.h) * k;
        frame = requestAnimationFrame(tick);
      }
      apply();
    };
    frame = requestAnimationFrame(tick);
  }
  // Show a box of the map (default: all of it), centered. `room` below 1 leaves space around the box.
  function fit(box, room, glide) {
    const r = rect();
    if (!r.width || !r.height) return;
    const b = box || [0, 0, size.w, size.h], bw = Math.max(b[2] - b[0], 1), bh = Math.max(b[3] - b[1], 1);
    const s = clamp(Math.min(r.width / bw, r.height / bh) * (box ? (room || 0.6) : 0.98));
    goal.w = r.width / s; goal.h = r.height / s;
    goal.x = (b[0] + b[2]) / 2 - goal.w / 2; goal.y = (b[1] + b[3]) / 2 - goal.h / 2;
    whole = !box;
    head(!glide);
  }
  // Center on a point at a zoom (1 = the whole map fits). Used by links.
  function setView(x, y, z) {
    const r = rect(), s = clamp(fitScale() * (z || 1));
    goal.w = r.width / s; goal.h = r.height / s; goal.x = x - goal.w / 2; goal.y = y - goal.h / 2;
    whole = false;
    head(true);
  }
  function toMap(clientX, clientY) {
    const r = rect();
    return [Math.round((vb.x + (clientX - r.left) / r.width * vb.w) * 10) / 10, Math.round((vb.y + (clientY - r.top) / r.height * vb.h) * 10) / 10];
  }
  // Zoom keeping the map point under (clientX, clientY) where it is. Wheel ticks add up while it glides.
  function zoomAt(clientX, clientY, factor, glide) {
    const r = rect(), s = clamp(r.width / goal.w * factor), fx = (clientX - r.left) / r.width, fy = (clientY - r.top) / r.height;
    const mx = goal.x + fx * goal.w, my = goal.y + fy * goal.h;
    goal.w = r.width / s; goal.h = r.height / s; goal.x = mx - fx * goal.w; goal.y = my - fy * goal.h;
    whole = false;
    head(!glide);
  }
  const zoomBy = factor => { const r = rect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor, true); };
  function panBy(dxPx, dyPx) {
    const s = scale();
    goal.x -= dxPx / s; goal.y -= dyPx / s;
    whole = false;
    head(true);
  }
  // Keep the same center and zoom when the stage changes size (or keep showing the whole map).
  function resized() {
    const r = rect();
    if (!r.width || !r.height) return;
    if (whole) return fit();
    const cx = goal.x + goal.w / 2, cy = goal.y + goal.h / 2, s = clamp(lastScale || fitScale());
    goal.w = r.width / s; goal.h = r.height / s; goal.x = cx - goal.w / 2; goal.y = cy - goal.h / 2;
    head(true);
  }
  let lastScale = 0;

  function init(el, mapSize) {
    svg = el; size = mapSize;
    fit();
    listeners.push(() => { lastScale = scale(); });
    new ResizeObserver(resized).observe(svg);
  }

  window.MapView = {
    init, fit, setView, toMap, zoomAt, zoomBy, panBy, scale, zoom, iconScale,
    box: () => [vb.x, vb.y, vb.x + vb.w, vb.y + vb.h],
    center: () => [vb.x + vb.w / 2, vb.y + vb.h / 2],
    moving: () => !!frame,
    unitsPerPx: () => 1 / scale(),
    setSimplify(on) { simplify = !!on; if (svg) apply(); },
    lod: () => [0, 1, 2, 3].find(n => svg.classList.contains('lod' + n)) || 0,
    onChange: fn => listeners.push(fn)
  };
})();
