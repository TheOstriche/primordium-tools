// Impact effects shared by the Codex, the character sheet, and the GM tool. Purely for feel: nothing here
// changes a rule or a number. Sparks and rings are drawn on one canvas above the page; banners, flashes,
// and shakes use the Web Animations API. Respects "reduce motion" (fades only) and the viewer's settings,
// saved in localStorage under primordium.fx: {visual, sound, haptics}.
(function (root) {
  const KEY = 'primordium.fx';
  const { RARITIES } = root.PrimordiumCore;   // needs core.js loaded first
  // Rarity colors come from shared/theme.css (--r-basic ... --r-mythic), so effects match the current theme.
  const color = rarity => (getComputedStyle(document.documentElement).getPropertyValue('--r-' + String(rarity).toLowerCase()).trim() || '#eab14c');
  // Glows add light on a dark page; on a light page they would vanish, so they paint normally there.
  const lightPage = () => document.documentElement.dataset.theme === 'light';
  const GOLD = '#eab14c', RED = '#e0604f', GREEN = '#6fd39a', ASH = '#8d8a96';
  let cfg = {visual: true, sound: false, haptics: true};
  try { Object.assign(cfg, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const listeners = [];
  const reducedQ = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : {matches: false};
  const reduced = () => reducedQ.matches;
  let shakeSel = 'main';

  // How hard each rarity lands. Below Rare a play stays quiet: the dealt cards are feedback enough.
  const TIER = {
    Rare:      {rings: 1, sparks: 26,  speed: 3.4, flash: 0,   shake: 0,  banner: 0,    rays: 0,  embers: 0,  hz: [18]},
    Epic:      {rings: 2, sparks: 54,  speed: 4.4, flash: .12, shake: 3,  banner: 1,    rays: 0,  embers: 14, hz: [25, 40, 25]},
    Legendary: {rings: 3, sparks: 96,  speed: 5.6, flash: .2,  shake: 6,  banner: 1.3,  rays: 12, embers: 36, hz: [30, 50, 30, 50, 90]},
    Mythic:    {rings: 4, sparks: 170, speed: 7.2, flash: .3,  shake: 10, banner: 1.75, rays: 22, embers: 80, hz: [60, 40, 60, 40, 60, 40, 220], vignette: true},
  };

  /* ---------- the layer ---------- */
  let layer, cv, cx, W = 0, H = 0, DPR = 1, running = false;
  const parts = [], rings = [], rays = [];
  function ensure() {
    if (layer) return;
    const st = document.createElement('style');
    st.textContent = `
.pfx-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000;overflow:hidden}
.pfx-layer canvas{position:absolute;inset:0;width:100%;height:100%}
.pfx-flash{position:absolute;inset:0;opacity:0}
.pfx-banner{position:absolute;left:0;right:0;top:38%;text-align:center;font:400 44px/1 var(--f-display,var(--serif,Georgia,"Times New Roman",serif));
  letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;opacity:0}
.pfx-banner::before{content:"";position:absolute;inset:-22px 0;z-index:-1;background:radial-gradient(ellipse at center,rgba(8,6,12,.72),rgba(8,6,12,0) 68%)}
.pfx-banner small{display:block;margin-top:10px;font:600 13px/1 var(--f-ui,var(--sans,system-ui,sans-serif));letter-spacing:.3em;opacity:.85}
.pfx-banner.mythic{background:linear-gradient(100deg,#f0685d 20%,#ffe2a8 45%,#f0685d 55%,#eab14c 80%);background-size:250% 100%;
  -webkit-background-clip:text;background-clip:text;color:transparent!important;animation:pfx-shimmer 1.6s linear infinite}
@keyframes pfx-shimmer{from{background-position:120% 0}to{background-position:-130% 0}}
.pfx-deal{animation:pfx-deal .42s cubic-bezier(.2,.9,.25,1.15) both}
@keyframes pfx-deal{from{opacity:0;transform:translateY(-34px) rotate(-7deg) scale(.86)}to{opacity:1;transform:none}}
.pfx-pop{animation:pfx-pop .45s cubic-bezier(.2,1.6,.4,1) both}
@keyframes pfx-pop{0%{transform:scale(.6)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
.pfx-crit{color:#eab14c!important;text-shadow:0 0 12px rgba(234,177,76,.75)}
.pfx-fumble{color:#8d8a96!important}
.pfx-beat{animation:pfx-beat .9s ease-in-out 2}
@keyframes pfx-beat{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.12)}}
@media (prefers-reduced-motion:reduce){.pfx-deal{animation:pfx-fade .3s both}.pfx-pop,.pfx-beat{animation:none}@keyframes pfx-fade{from{opacity:0}to{opacity:1}}}`;
    document.head.appendChild(st);
    layer = document.createElement('div'); layer.className = 'pfx-layer'; layer.setAttribute('aria-hidden', 'true');
    cv = document.createElement('canvas'); layer.appendChild(cv); cx = cv.getContext('2d');
    document.body.appendChild(layer); size(); root.addEventListener('resize', size);
  }
  function size() { DPR = Math.min(2, root.devicePixelRatio || 1); W = root.innerWidth; H = root.innerHeight; cv.width = W * DPR; cv.height = H * DPR; }

  /* ---------- drawing ---------- */
  const rand = (a, b) => a + Math.random() * (b - a);
  function loop() {
    cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, W, H); cx.globalCompositeOperation = lightPage() ? 'source-over' : 'lighter';
    for (let i = rays.length - 1; i >= 0; i--) {
      const r = rays[i]; r.t++; const k = r.t / r.life; if (k >= 1) { rays.splice(i, 1); continue; }
      const a = Math.sin(Math.PI * k) * .16, len = Math.max(W, H) * (.35 + k * .45);
      for (let j = 0; j < r.n; j++) {
        const ang = r.rot + r.t * .004 + j * Math.PI * 2 / r.n, w = j % 2 ? .012 : .026;
        const g = cx.createRadialGradient(r.x, r.y, 0, r.x, r.y, len); g.addColorStop(0, r.c + hex(a)); g.addColorStop(1, r.c + '00');
        cx.fillStyle = g; cx.beginPath(); cx.moveTo(r.x, r.y); cx.arc(r.x, r.y, len, ang - w, ang + w); cx.closePath(); cx.fill();
      }
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]; if (r.delay > 0) { r.delay--; continue; } r.t++; const k = r.t / r.life; if (k >= 1) { rings.splice(i, 1); continue; }
      const e = 1 - Math.pow(1 - k, 3);
      cx.strokeStyle = r.c + hex((1 - k) * .9); cx.lineWidth = r.w * (1 - k) + .5; cx.beginPath(); cx.arc(r.x, r.y, r.r * e, 0, Math.PI * 2); cx.stroke();
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; if (p.delay > 0) { p.delay--; continue; } p.t++; if (p.t >= p.life) { parts.splice(i, 1); continue; }
      const k = p.t / p.life, al = p.kind === 'ember' ? Math.sin(Math.PI * k) : 1 - k;
      p.vx *= p.drag; p.vy = p.vy * p.drag + p.g; if (p.kind === 'ember') p.vx += Math.sin(p.t * .12 + p.seed) * .05;
      p.x += p.vx; p.y += p.vy;
      if (p.kind === 'spark') { cx.strokeStyle = p.c + hex(al); cx.lineWidth = p.s; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); cx.stroke(); }
      else if (p.kind === 'shard') { cx.save(); cx.globalCompositeOperation = 'source-over'; cx.translate(p.x, p.y); cx.rotate(p.t * p.spin); cx.fillStyle = p.c + hex(al * .9); cx.fillRect(-p.s, -p.s / 3, p.s * 2, p.s * .66); cx.restore(); }
      else { const g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 3); g.addColorStop(0, p.c + hex(al)); g.addColorStop(1, p.c + '00'); cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.s * 3, 0, Math.PI * 2); cx.fill(); }
    }
    if (parts.length || rings.length || rays.length) requestAnimationFrame(loop); else { running = false; cx.clearRect(0, 0, W, H); }
  }
  const hex = a => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
  const go = () => { if (!running) { running = true; requestAnimationFrame(loop); } };
  function burst(x, y, c, n, speed, opts = {}) {
    for (let i = 0; i < n; i++) {
      const a = opts.up ? rand(-Math.PI * .85, -Math.PI * .15) : rand(0, Math.PI * 2), v = rand(.35, 1) * speed;
      parts.push({kind: opts.kind || 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: opts.g ?? .06, drag: opts.drag ?? .955,
        life: rand(30, 60) * (opts.long || 1), t: 0, s: rand(1.2, 2.6) * (opts.big || 1), c: Math.random() < (opts.mix ? .35 : 0) ? opts.mix : c,
        delay: opts.delay ? Math.floor(rand(0, opts.delay)) : 0, spin: rand(-.3, .3), seed: rand(0, 9)});
    }
    go();
  }
  function embers(x, y, c, n, spread = 80) {
    for (let i = 0; i < n; i++) parts.push({kind: 'ember', x: x + rand(-spread, spread), y: y + rand(-20, 30), vx: rand(-.3, .3), vy: rand(-2.2, -.6), g: -.01, drag: .99,
      life: rand(60, 120), t: 0, s: rand(1.2, 2.4), c, delay: Math.floor(rand(0, 30)), seed: rand(0, 9)});
    go();
  }
  const ring = (x, y, c, r, w, life, delay = 0) => { rings.push({x, y, c, r, w, life, t: 0, delay}); go(); };

  /* ---------- whole-screen touches ---------- */
  function flash(css, peak, ms) {
    const f = document.createElement('div'); f.className = 'pfx-flash'; f.style.background = css; layer.appendChild(f);
    f.animate([{opacity: 0}, {opacity: peak, offset: .18}, {opacity: 0}], {duration: ms, easing: 'ease-out'}).onfinish = () => f.remove();
  }
  function shake(px, ms) {
    if (!px || reduced()) return; const el = document.querySelector(shakeSel); if (!el || !el.animate) return;
    const k = []; for (let i = 0; i <= 10; i++) { const d = px * (1 - i / 10); k.push({transform: i === 10 ? 'none' : `translate(${rand(-d, d)}px,${rand(-d, d) * .6}px)`}); }
    el.animate(k, {duration: ms, easing: 'linear'});
  }
  function banner(text, color, scale = 1, sub = '', mythic = false) {
    ensure();
    // One banner at a time: a new one replaces any still on screen.
    layer.querySelectorAll('.pfx-banner').forEach(old => { old.getAnimations().forEach(a => a.cancel()); old.remove(); });
    const b = document.createElement('div'); b.className = 'pfx-banner' + (mythic ? ' mythic' : '');
    // Fit the word across the screen: each letter is about 0.75em wide plus 0.18em of spacing.
    const fit = (root.innerWidth - 32) / (text.length * .93);
    b.style.color = color; b.style.fontSize = Math.round(Math.min(40 * scale, fit)) + 'px'; b.style.textShadow = mythic ? 'none' : `0 0 18px ${color}99, 0 0 2px #000`;
    b.textContent = text; if (sub) { const s = document.createElement('small'); s.textContent = sub; s.style.color = color; b.appendChild(s); }
    layer.appendChild(b); const hold = 700 + scale * 500;
    const k = reduced() ? [{opacity: 0}, {opacity: 1, offset: .15}, {opacity: 1, offset: .75}, {opacity: 0}]
      : [{opacity: 0, transform: 'scale(1.6)', letterSpacing: '.5em'}, {opacity: 1, transform: 'scale(1)', letterSpacing: '.18em', offset: .18}, {opacity: 1, transform: 'scale(1.03)', offset: .78}, {opacity: 0, transform: 'scale(1.08) translateY(-10px)'}];
    b.animate(k, {duration: hold + 500, easing: 'cubic-bezier(.2,.8,.2,1)'}).onfinish = () => b.remove();
  }
  // Browsers only allow vibration after the person has tapped the page.
  const vibrate = p => { if (cfg.haptics && navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) try { navigator.vibrate(p); } catch (e) {} };

  /* ---------- sound (off by default): small synthesized tones ---------- */
  let ac;
  function tone(freq, at, dur, type = 'sine', vol = .06) {
    try {
      ac = ac || new (root.AudioContext || root.webkitAudioContext)(); const t = ac.currentTime + at;
      const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + .05);
    } catch (e) {}
  }
  const SCALE = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568, 2093];
  function sound(kind, rarity) {
    if (!cfg.sound) return;
    if (kind === 'card') { const i = Math.max(0, RARITIES.indexOf(rarity)); tone(180 + i * 30, 0, .12, 'triangle', .05);
      for (let j = 0; j <= Math.max(0, i - 2); j++) tone(SCALE[j] * (i >= 6 ? .5 : 1), .05 + j * .07, .5 + i * .08, 'sine', .045); if (i >= 5) tone(SCALE[0] / 4, .02, 1.2, 'sawtooth', .025); }
    if (kind === 'crit') [0, 4, 7, 12].forEach((s, j) => tone(523.25 * Math.pow(2, s / 12), j * .05, .6, 'triangle', .05));
    if (kind === 'fumble') { tone(160, 0, .35, 'sawtooth', .04); tone(110, .1, .5, 'sine', .06); }
    if (kind === 'heal') [0, 7].forEach((s, j) => tone(440 * Math.pow(2, s / 12), j * .08, .5, 'sine', .04));
    if (kind === 'hit') tone(120, 0, .2, 'square', .035);
    if (kind === 'deal') tone(900, 0, .05, 'triangle', .02);
  }

  /* ---------- where an effect starts ---------- */
  // Where the last tap landed (the tapped button's box), so an effect can start there even after a redraw.
  let tapped = null;
  if (typeof document !== 'undefined') document.addEventListener('pointerdown', e => {
    const b = e.target.closest && e.target.closest('button');
    tapped = b ? b.getBoundingClientRect() : null;
  }, true);
  const lastTap = () => tapped;

  function point(o) {
    const mid = {x: root.innerWidth / 2, y: root.innerHeight * .45};
    if (!o) return mid;
    const r = o.getBoundingClientRect ? o.getBoundingClientRect() : o;   // an element, or a rectangle saved before a redraw
    if (!r.width && !r.height) return mid;
    return {x: r.left + r.width / 2, y: r.top + r.height / 2};
  }
  // Several selected cards: the middle of them all.
  function rectOf(els) {
    const rs = [...els].map(e => e.getBoundingClientRect()).filter(r => r.width);
    if (!rs.length) return null;
    const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top)), rr = Math.max(...rs.map(r => r.right)), b = Math.max(...rs.map(r => r.bottom));
    return {left: l, top: t, width: rr - l, height: b - t};
  }
  const live = () => cfg.visual && typeof document !== 'undefined';

  /* ---------- the effects ---------- */
  // A card (or an enemy ability) of this rarity lands. Rare and up, louder each step to Mythic.
  function card(rarity, origin) {
    sound('card', rarity);
    const T = TIER[rarity]; if (!T || !live()) return; ensure();
    const {x, y} = point(origin), c = color(rarity);
    vibrate(T.hz);
    if (reduced()) { flash(`radial-gradient(circle at ${x}px ${y}px, ${c}55, transparent 60%)`, .9, 700); if (T.banner) banner(rarity, c, T.banner * .8, '', rarity === 'Mythic'); return; }
    if (T.vignette) flash(`radial-gradient(circle at ${x}px ${y}px, transparent 15%, #12060a 85%)`, .75, 1500);
    for (let i = 0; i < T.rings; i++) ring(x, y, i % 2 && rarity === 'Mythic' ? GOLD : c, 70 + i * 55 + T.speed * 10, 4 + i, 38 + i * 8, i * 6);
    if (T.rays) rays.push({x, y, c, n: T.rays, rot: rand(0, 6.28), t: 0, life: rarity === 'Mythic' ? 110 : 80});
    burst(x, y, c, T.sparks, T.speed, {mix: rarity === 'Mythic' ? GOLD : rarity === 'Legendary' ? '#fff4d6' : '', big: rarity === 'Mythic' ? 1.3 : 1});
    if (T.embers) embers(x, y, rarity === 'Mythic' ? GOLD : c, T.embers, 60 + T.embers);
    if (T.flash) flash(`radial-gradient(circle at ${x}px ${y}px, ${c}${hex(T.flash * 2.4)}, transparent 70%)`, 1, 500 + T.shake * 60);
    if (rarity === 'Mythic') setTimeout(() => { burst(x, y, GOLD, 70, 9, {big: 1.5, long: 1.4}); ring(x, y, '#ffe2a8', Math.max(W, H) * .7, 10, 55); flash('radial-gradient(circle, #fff3dccc, transparent 75%)', .55, 600); shake(6, 300); }, 380);
    shake(T.shake, 260 + T.shake * 35);
    if (T.banner) banner(rarity, c, T.banner, rarity === 'Mythic' ? 'The deck answers' : '', rarity === 'Mythic');
  }

  // A roll. Critical when every die shows its highest face; a fumble when every die shows 1 (the guides'
  // "a strike only fails if every die rolls a 1"). Small dice get a glint instead of the full show.
  function judge(res) {
    const d = (res && res.dice) || []; if (!d.length) return null;
    const top = d.reduce((a, x) => a + x.f, 0);
    if (d.every(x => x.r === x.f)) return {kind: 'crit', big: top >= 10};
    if (d.every(x => x.r === 1)) return {kind: 'fumble', big: top >= 10};
    return null;
  }
  function roll(res, origin, opts = {}) {
    const j = judge(res); if (!j) return null;
    sound(j.kind, '');
    if (!live()) return j.kind; ensure();
    const {x, y} = point(origin);
    if (j.kind === 'crit') {
      vibrate(j.big ? [30, 40, 60] : [15]);
      if (reduced()) { flash(`radial-gradient(circle at ${x}px ${y}px, ${GOLD}66, transparent 60%)`, 1, 600); if (j.big && !opts.quiet) banner('Critical', GOLD, 1); return j.kind; }
      ring(x, y, GOLD, j.big ? 120 : 50, j.big ? 4 : 2, 34); burst(x, y, GOLD, j.big ? 60 : 16, j.big ? 5 : 2.6, {mix: '#fff4d6'});
      if (j.big) { embers(x, y, GOLD, 24, 50); flash(`radial-gradient(circle at ${x}px ${y}px, ${GOLD}55, transparent 65%)`, 1, 600); if (!opts.quiet) banner('Critical', GOLD, 1.1, opts.label || ''); shake(3, 260); }
    } else {
      vibrate(j.big ? [80] : [20]);
      if (reduced()) { flash('radial-gradient(circle, transparent 40%, #000a 100%)', 1, 700); if (j.big && !opts.quiet) banner('Natural 1', ASH, .9); return j.kind; }
      burst(x, y, ASH, j.big ? 34 : 10, j.big ? 3.2 : 2, {kind: 'shard', g: .22, drag: .97, big: 2});
      if (j.big) { flash('radial-gradient(circle, transparent 35%, #000b 100%)', 1, 900); if (!opts.quiet) banner('Natural 1', ASH, .95, opts.label || ''); shake(5, 320); }
    }
    return j.kind;
  }

  // Count a number up through random faces before it lands. kind: 'crit' | 'fumble' | null.
  function tumble(el, value, max = 20, kind = null) {
    if (!el) return; el.classList.remove('pfx-crit', 'pfx-fumble', 'pfx-pop');
    const done = () => { el.textContent = value; void el.offsetWidth; el.classList.add('pfx-pop'); if (kind) el.classList.add('pfx-' + kind); };
    if (!cfg.visual || reduced()) return done();
    let n = 0; const steps = 9, hi = Math.max(2, Math.abs(+max) || 20);
    const tick = () => { if (n++ >= steps) return done(); el.textContent = 1 + Math.floor(Math.random() * hi); setTimeout(tick, 22 + n * 7); };
    tick();
  }

  // Newly drawn cards fly into the hand, one after another.
  function deal(els) {
    const list = [...els].filter(Boolean); if (!list.length) return; sound('deal');
    if (!cfg.visual) return; ensure();
    list.forEach((el, i) => { el.style.animationDelay = (i * 70) + 'ms'; el.classList.add('pfx-deal'); el.addEventListener('animationend', () => { el.classList.remove('pfx-deal'); el.style.animationDelay = ''; }, {once: true}); });
  }

  // Hit points change. kind: 'damage' | 'heal' | 'down'. size: how much changed, as a share of max HP.
  function hp(kind, origin, size = .1) {
    sound(kind === 'heal' ? 'heal' : 'hit');
    if (!live()) return; ensure(); const {x, y} = point(origin);
    if (kind === 'heal') { if (!reduced()) { embers(x, y, GREEN, 10 + Math.round(size * 40), 70); ring(x, y, GREEN, 70, 2, 30); } flash(`radial-gradient(circle at ${x}px ${y}px, ${GREEN}40, transparent 60%)`, 1, 700); return; }
    if (kind === 'down') { vibrate([90, 60, 90, 60, 300]); flash('radial-gradient(circle, transparent 25%, #3a0508ee 100%)', 1, 1800); banner('Downed', RED, 1.15, 'The death clock starts'); shake(8, 450); return; }
    vibrate([Math.min(80, 20 + Math.round(size * 120))]);
    flash(`radial-gradient(circle, transparent ${Math.round(60 - size * 60)}%, ${RED}${hex(.25 + size * 1.2)} 100%)`, 1, 500);
    if (!reduced()) burst(x, y, RED, 6 + Math.round(size * 40), 2.4 + size * 4, {kind: 'shard', g: .15, big: 1.2});
    shake(Math.min(7, 1.5 + size * 18), 260);
  }

  // A small burst of one color at a spot: a recovery that worked, a skill tier gained.
  function sparkle(origin, color = GOLD, n = 18) {
    if (!live()) return; ensure(); const {x, y} = point(origin);
    if (reduced()) return flash(`radial-gradient(circle at ${x}px ${y}px, ${color}55, transparent 40%)`, 1, 500);
    ring(x, y, color, 46, 2, 26); burst(x, y, color, n, 2.6, {up: true, g: .04});
  }
  // A fizzle: the recovery that failed.
  function fizzle(origin) { if (!live() || reduced()) return; ensure(); const {x, y} = point(origin); burst(x, y, ASH, 8, 1.6, {kind: 'shard', g: .2, big: 1.5}); }
  // Something pulses twice, like a heartbeat (the death clock).
  function beat(el) { if (!el || !cfg.visual) return; el.classList.remove('pfx-beat'); void el.offsetWidth; el.classList.add('pfx-beat'); vibrate([40, 120, 40]); }

  // The mood of the table shifts. kind: 'combat' | 'calm' | 'breather' | 'rest'.
  function mood(kind) {
    if (!live()) return; ensure();
    if (kind === 'combat') { vibrate([40, 30, 40]); flash(`radial-gradient(circle, transparent 35%, ${RED}aa 100%)`, 1, 1100); banner('Combat', RED, 1.1); shake(4, 300); if (cfg.sound) { tone(98, 0, .5, 'sawtooth', .04); tone(147, .12, .6, 'sawtooth', .035); } }
    if (kind === 'calm') flash('radial-gradient(circle, transparent 40%, #00000066 100%)', 1, 700);
    if (kind === 'breather') { flash('linear-gradient(180deg, #6aa2ec33, transparent 70%)', 1, 1400); banner('Breather', '#9cc4f5', .9, 'Catch your breath'); if (!reduced()) embers(W / 2, H * .7, '#9cc4f5', 26, W / 2); if (cfg.sound) [0, 5, 9].forEach((s, j) => tone(392 * Math.pow(2, s / 12), j * .12, .9, 'sine', .035)); }
    if (kind === 'rest') { flash('linear-gradient(0deg, #eab14c55, #f0685d22 45%, transparent 80%)', 1, 1800); banner('Full rest', GOLD, 1, 'A new day'); if (!reduced()) embers(W / 2, H * .85, GOLD, 40, W / 2); if (cfg.sound) [0, 4, 7, 11].forEach((s, j) => tone(330 * Math.pow(2, s / 12), j * .14, 1.2, 'sine', .035)); }
  }

  /* ---------- settings ---------- */
  function settings(next) {
    if (next) { Object.assign(cfg, next); try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {} listeners.forEach(f => f(cfg)); }
    return {...cfg};
  }
  // Which element shakes (each app's main column; fixed headers and tab bars stay put).
  const configure = o => { if (o && o.shake) shakeSel = o.shake; };

  // The effects settings as on/off rows (.fxrow and .seg in shared/theme.css). Put the markup anywhere and pass
  // clicks inside it to settingsClick(); it saves the choice, redraws the rows, and plays a sample.
  const SETTINGS = [['visual', 'Impact effects'], ['sound', 'Sound'], ['haptics', 'Vibration']];
  const settingsHTML = () => SETTINGS.map(([k, label]) => `<div class="fxrow"><span>${label}</span><div class="seg" role="group" aria-label="${label}">${
    [[true, 'On'], [false, 'Off']].map(([v, l]) => `<button type="button" aria-pressed="${cfg[k] === v}" data-fx="${k}" data-v="${v}">${l}</button>`).join('')}</div></div>`).join('');
  function settingsClick(e, box) {
    const b = e.target.closest('[data-fx]');
    if (!b) return false;
    const on = b.dataset.v === 'true', key = b.dataset.fx, at = b.getBoundingClientRect();
    settings({ [key]: on });
    if (box) box.innerHTML = settingsHTML();
    if (on && key !== 'haptics') card(key === 'visual' ? 'Epic' : 'Rare', at);   // a sample
    return true;
  }

  root.PrimordiumFX = {card, roll, judge, tumble, deal, hp, sparkle, fizzle, beat, mood, banner: (t, c, s) => live() && banner(t, c || GOLD, s || 1),
    rectOf, lastTap, settings, settingsHTML, settingsClick, configure};
})(window);
