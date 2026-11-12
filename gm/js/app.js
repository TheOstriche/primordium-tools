// Starts the app: loads saved data, wires up the tabs, draws each screen.
(function () {
  const views = {};   // name -> render function

  function register(name, render) { views[name] = render; }

  function show(name) {
    document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
    if (views[name]) views[name](document.getElementById('view-' + name));
    try { localStorage.setItem('gm-tab', name); } catch (e) { /* storage blocked */ }
  }

  function current() {
    const b = document.querySelector('#tabs button.active');
    return b ? b.dataset.view : 'encounter';
  }

  function refreshSaveStatus() {
    const el = document.getElementById('save-status');
    const last = Store.state.settings.lastBackupAt;
    const stale = !last || Date.now() - new Date(last) > 7 * 24 * 3600 * 1000;
    el.textContent = 'Last backup: ' + UI.timeAgo(last);
    el.classList.toggle('warn', stale);
    el.title = stale ? 'Make a backup on the Save tab' : '';
  }

  async function start() {
    try {
      await Store.init();
    } catch (e) {
      document.querySelector('main').prepend(UI.h('p.error',
        'Saved data could not be opened in this browser. Changes will not be kept. (' + e.message + ')'));
    }
    document.getElementById('tabs').addEventListener('click', e => {
      if (e.target.dataset.view) show(e.target.dataset.view);
    });
    document.getElementById('save-status').addEventListener('click', () => show('save'));
    Store.onError(message => document.querySelector('main').prepend(UI.h('p.error', { role: 'alert' }, message)));
    Store.onChange(refreshSaveStatus);
    refreshSaveStatus();
    let first = 'encounter';
    try { first = localStorage.getItem('gm-tab') || first; } catch (e) { /* storage blocked */ }
    if (!document.querySelector('#tabs button[data-view="' + first + '"]')) first = 'encounter';
    show(first);
  }

  window.App = { register, show, rerender: () => show(current()) };
  document.addEventListener('DOMContentLoaded', start);
})();
