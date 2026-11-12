// Small helpers every part of the map app uses: building elements, toasts, menus, dialogs, downloads.
(function () {
  'use strict';
  // Build an element: h('div.card', { onclick }, child, 'text', ...)
  function h(tag, attrs, ...children) {
    const [name, ...classes] = tag.split('.');
    const el = document.createElement(name || 'div');
    if (classes.length) el.className = classes.join(' ');
    if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { children.unshift(attrs); attrs = null; }
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.className += (el.className ? ' ' : '') + v;
      else if (k === 'value') el.value = v;
      else if (k === 'checked' || k === 'selected' || k === 'disabled' || k === 'open') el[k] = !!v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    append(el, children);
    return el;
  }
  function append(el, children) {
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
  }
  function fill(el, ...children) { el.replaceChildren(); append(el, children); }

  function toast(message, kind) {
    const t = h('div.toast' + (kind ? '.' + kind : ''), message);
    document.getElementById('toasts').append(t);
    setTimeout(() => t.remove(), kind === 'bad' ? 7000 : 3800);
  }

  // Turns a button into one that opens a small menu. items() returns [label, action, enabled] entries, or null
  // for a dividing line; it is asked each time the menu opens, so entries can follow the current state.
  function menu(button, items) {
    const list = h('div.menu', { role: 'menu', hidden: true });
    const close = () => { list.hidden = true; button.setAttribute('aria-expanded', 'false'); };
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    button.after(list);
    button.addEventListener('click', () => {
      if (!list.hidden) return close();
      fill(list, items().map(it => (it ? h('button', { type: 'button', role: 'menuitem', disabled: it[2] === false, onclick: () => { close(); it[1](); } }, it[0]) : h('hr'))));
      list.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      const first = list.querySelector('button:not(:disabled)');
      if (first) first.focus();
    });
    document.addEventListener('pointerdown', e => { if (!list.hidden && !list.contains(e.target) && !button.contains(e.target)) close(); });
    list.addEventListener('keydown', e => {
      const all = [...list.querySelectorAll('button:not(:disabled)')], i = all.indexOf(document.activeElement);
      if (e.key === 'Escape') { close(); button.focus(); e.stopPropagation(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); all[(i + 1) % all.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); all[(i - 1 + all.length) % all.length].focus(); }
    });
  }

  // A modal dialog. buttons: [label, action, class]; an action that returns false keeps the dialog open.
  // onClose runs once, however the dialog goes away (a button, Cancel, or the Esc key).
  function dialog(title, body, buttons, onClose) {
    const d = h('dialog.dlg', { 'aria-label': title });
    let gone = false;
    const done = () => {
      if (gone) return;
      gone = true;
      if (d.open) d.close();
      d.remove();
      if (onClose) onClose();
    };
    append(d, [h('h2', title), h('div.dlg-body', body),
      h('div.btns', (buttons || []).map(([label, action, cls]) => h('button', { type: 'button', class: cls || '', onclick: async () => { if (!action || (await action()) !== false) done(); } }, label)),
        h('button.ghost', { type: 'button', onclick: done }, buttons && buttons.length ? 'Cancel' : 'Close'))]);
    d.addEventListener('close', done);
    document.body.append(d);
    d.showModal();
    return { el: d, close: done };
  }
  // Resolves true when the named button is pressed, false when the dialog is closed any other way.
  const confirmBox = (title, text, yes, cls) => new Promise(res => {
    let ok = false;
    dialog(title, h('p', text), [[yes, () => { ok = true; }, cls || 'primary']], () => res(ok));
  });

  function download(name, data, type) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: type || 'text/plain' });
    const a = h('a', { href: URL.createObjectURL(blob), download: name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
  }
  const debounce = (fn, ms) => { let t = 0; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  window.MapUI = { h, fill, toast, menu, dialog, confirmBox, download, copy, debounce };
})();
