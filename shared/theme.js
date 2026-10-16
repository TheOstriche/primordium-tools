// Light and dark theme for every app. Load it in <head> (before the page draws) so there is no flash.
// The viewer's choice is "system" (follow the device, the default), "light", or "dark", saved in
// localStorage under primordium.theme and shared by all three apps. It sets data-theme="light" or
// "dark" on <html>; shared/theme.css switches its colors on that.
// Any <button data-theme-toggle> becomes a switch that cycles System → Light → Dark.
(function () {
  const KEY = 'primordium.theme';
  const MODES = ['system', 'light', 'dark'];
  const LABEL = { system: 'Theme: follows your device', light: 'Theme: light', dark: 'Theme: dark' };
  const BAR = { dark: '#121019', light: '#e7e3da' };   // the browser bar matches --ground
  const ICON = {
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'
  };
  const device = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : { matches: false };

  let mode = 'system';
  try { const saved = localStorage.getItem(KEY); if (MODES.includes(saved)) mode = saved; } catch (e) { /* storage blocked */ }

  const resolved = () => (mode === 'system' ? (device.matches ? 'light' : 'dark') : mode);

  function apply() {
    const t = resolved();
    document.documentElement.dataset.theme = t;
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', BAR[t]));
    document.querySelectorAll('[data-theme-toggle]').forEach(b => {
      b.classList.add('theme-btn');
      b.innerHTML = ICON[mode];
      b.setAttribute('aria-label', LABEL[mode]);
      b.title = LABEL[mode];
    });
  }

  function set(next) {
    if (!MODES.includes(next)) return;
    mode = next;
    try { localStorage.setItem(KEY, mode); } catch (e) { /* storage blocked */ }
    apply();
  }
  const cycle = () => set(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);

  apply();
  if (device.addEventListener) device.addEventListener('change', () => { if (mode === 'system') apply(); });
  // Another tab or app on this site changed it.
  window.addEventListener('storage', e => { if (e.key === KEY && MODES.includes(e.newValue)) { mode = e.newValue; apply(); } });
  document.addEventListener('DOMContentLoaded', apply);
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-theme-toggle]')) cycle(); });

  window.PrimordiumTheme = { get: () => mode, resolved, set, cycle, apply };
})();
