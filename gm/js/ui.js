// Small helpers shared by every screen.
(function () {
  // Build an element: h('div.card', { onclick }, child, 'text', ...)
  function h(tag, attrs, ...children) {
    const [name, ...classes] = tag.split('.');
    const el = document.createElement(name || 'div');
    if (classes.length) el.className = classes.join(' ');
    if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) {
      children.unshift(attrs);
      attrs = null;
    }
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'class') el.className += (el.className ? ' ' : '') + v;
      else if (k === 'value') el.value = v;
      else if (k === 'checked' || k === 'selected' || k === 'disabled') el[k] = !!v;
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

  // Replace an element's contents, skipping empty items and unpacking lists like h() does.
  function fill(el, ...children) {
    el.replaceChildren();
    append(el, children);
  }

  function toast(message, kind) {
    let box = document.getElementById('toasts');
    if (!box) document.body.append(box = h('div', { id: 'toasts', role: 'status', 'aria-live': 'polite' }));
    const t = h('div.toast' + (kind ? '.' + kind : ''), message);
    box.append(t);
    setTimeout(() => t.remove(), 3500);
  }

  const fmt = (n, places = 0) => (Math.round(n * 10 ** places) / 10 ** places).toLocaleString();

  function timeAgo(iso) {
    if (!iso) return 'never';
    const mins = Math.round((Date.now() - new Date(iso)) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.round(mins / 60);
    if (hrs < 48) return hrs + ' hr ago';
    return Math.round(hrs / 24) + ' days ago';
  }

  window.UI = { h, fill, toast, fmt, timeAgo };
})();
