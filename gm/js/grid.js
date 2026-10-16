// The battle grid: optional map image, grid lines, tokens, movement range, and a ruler.
// 1 square = 1M; diagonals cost 1M.
(function () {
  const { h, fill } = UI;
  const imageUrls = {};

  async function imageUrl(key) {
    if (!key) return null;
    if (imageUrls[key]) return imageUrls[key];
    const blob = await Store.images.get(key);
    return blob ? (imageUrls[key] = URL.createObjectURL(blob)) : null;
  }
  function forgetImage(key) {
    if (imageUrls[key]) URL.revokeObjectURL(imageUrls[key]);
    delete imageUrls[key];
  }

  const SMALL_SCALE = { Tiny: 0.5, Small: 0.72 };

  function shortLabel(name) {
    const m = name.match(/^(.*?)(?:\s+(\d+))?$/);
    const words = m[1].split(/\s+/).filter(Boolean);
    const letters = words.length > 1 ? words.slice(0, 2).map(w => w[0]).join('') : m[1].slice(0, 2);
    return letters + (m[2] || '');
  }

  // cb: { onSelect(id), onMove(id, x, y) }
  function create(host, cb) {
    let o = null;            // { map, combatants, selectedId, activeId, ruler, targetIds }
    let drag = null;
    let rulerLine = null;    // { ax, ay, bx, by }
    const img = h('img.board-image', { alt: '', draggable: 'false' });
    const lines = h('div.board-lines');
    const canvas = h('canvas.board-overlay');
    const tokens = h('div.board-tokens');
    const tip = h('div.board-tip');
    const board = h('div.board', img, lines, canvas, tokens, tip);
    const wrap = h('div.board-wrap', board);
    host.append(wrap);

    const cellSize = () => o.map.cell;
    function cellAt(evt) {
      const r = board.getBoundingClientRect();
      return { x: Math.floor((evt.clientX - r.left) / cellSize()), y: Math.floor((evt.clientY - r.top) / cellSize()) };
    }
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    function update(next) {
      o = next;
      const { map } = o;
      const cs = map.cell;
      board.style.width = map.cols * cs + 'px';
      board.style.height = map.rows * cs + 'px';
      board.style.setProperty('--cell', cs + 'px');
      board.classList.toggle('ruler-mode', !!o.ruler);
      lines.style.opacity = map.lineOpacity;
      imageUrl(map.imageKey).then(u => {
        if (u) { img.src = u; img.hidden = false; } else { img.removeAttribute('src'); img.hidden = true; }
      });
      canvas.width = map.cols * cs;
      canvas.height = map.rows * cs;
      if (!o.ruler) rulerLine = null;
      fill(tokens, o.combatants.filter(c => c.x != null).map(tokenEl));
      drawOverlay();
    }

    function tokenEl(c) {
      const cs = cellSize();
      const [fw, fh] = Combat.footprint(c);
      const scale = SMALL_SCALE[c.size] || 1;
      const pct = c.maxHp ? Math.max(0, Math.min(1, c.hp / c.maxHp)) : null;
      const el = h('div.token.' + c.kind, {
        title: c.name + (c.hp != null ? ' (' + c.hp + (c.maxHp ? '/' + c.maxHp : '') + ' HP)' : ''),
        class: [
          c.id === o.selectedId && 'selected', c.id === o.activeId && 'active',
          (o.targetIds || []).includes(c.id) && 'targeted',
          Combat.isDowned(c) && 'downed', c.dead && 'dead', fw * fh > 1 && 'big'
        ].filter(Boolean).join(' ')
      },
        h('span.token-label', shortLabel(c.name)),
        pct != null ? h('span.token-hp', h('span', { style: 'width:' + (pct * 100) + '%' })) : null);
      const w = fw * cs, ht = fh * cs;
      const inset = scale < 1 ? (cs * (1 - scale)) / 2 : 0;
      Object.assign(el.style, {
        left: c.x * cs + inset + 'px', top: c.y * cs + inset + 'px',
        width: (scale < 1 ? cs * scale : w) + 'px', height: (scale < 1 ? cs * scale : ht) + 'px',
        fontSize: Math.max(10, Math.min(16, cs * 0.34)) + 'px'
      });
      el.addEventListener('pointerdown', e => startDrag(e, c, el));
      return el;
    }

    // ---- Dragging tokens ----

    function startDrag(e, c, el) {
      if (o.ruler || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const cell = cellAt(e);
      drag = { c, el, sx: c.x, sy: c.y, nx: c.x, ny: c.y, offX: cell.x - c.x, offY: cell.y - c.y, moved: false };
      board.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
    }

    function dragTo(e) {
      const cell = cellAt(e);
      const [fw, fh] = Combat.footprint(drag.c);
      const nx = clamp(cell.x - drag.offX, 0, o.map.cols - fw);
      const ny = clamp(cell.y - drag.offY, 0, o.map.rows - fh);
      if (nx === drag.nx && ny === drag.ny) return false;
      drag.nx = nx; drag.ny = ny; drag.moved = true;
      return true;
    }

    board.addEventListener('pointermove', e => {
      if (drag) {
        if (!dragTo(e)) return;
        const { nx, ny } = drag;
        const cs = cellSize();
        const inset = SMALL_SCALE[drag.c.size] ? (cs * (1 - SMALL_SCALE[drag.c.size])) / 2 : 0;
        drag.el.style.left = nx * cs + inset + 'px';
        drag.el.style.top = ny * cs + inset + 'px';
        const dist = Combat.distance(drag.sx, drag.sy, nx, ny);
        const over = dist > Combat.movement(drag.c);
        showTip(dist + 'M' + (over ? ' (over ' + Combat.movement(drag.c) + 'M)' : ''), nx, ny, over);
      } else if (rulerLine && rulerLine.dragging) {
        const cell = cellAt(e);
        rulerLine.bx = clamp(cell.x, 0, o.map.cols - 1);
        rulerLine.by = clamp(cell.y, 0, o.map.rows - 1);
        drawOverlay();
      }
    });

    board.addEventListener('pointerup', e => {
      if (drag) {
        dragTo(e);
        const d = drag;
        drag = null;
        hideTip();
        if (d.moved) cb.onMove(d.c.id, d.nx, d.ny);
        else cb.onSelect(d.c.id);
      } else if (rulerLine && rulerLine.dragging) {
        rulerLine.dragging = false;
      }
    });

    // Ruler: press and drag in ruler mode.
    board.addEventListener('pointerdown', e => {
      if (!o.ruler || e.button !== 0) return;
      e.preventDefault();
      const cell = cellAt(e);
      rulerLine = { ax: cell.x, ay: cell.y, bx: cell.x, by: cell.y, dragging: true };
      board.setPointerCapture(e.pointerId);
      drawOverlay();
    });

    function showTip(text, x, y, warn) {
      const cs = cellSize();
      tip.textContent = text;
      tip.classList.toggle('warn', !!warn);
      tip.style.left = x * cs + 'px';
      tip.style.top = Math.max(0, y * cs - 26) + 'px';
      tip.hidden = false;
    }
    function hideTip() { tip.hidden = true; }
    hideTip();

    // ---- Movement range and ruler ----

    // Colors come from the shared theme (../shared/theme.css), so the overlay suits light and dark.
    const token = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    function drawOverlay() {
      const ctx = canvas.getContext('2d');
      const cs = cellSize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const c = o.combatants.find(x => x.id === o.selectedId);
      if (c && c.x != null && !c.dead && !Combat.isDowned(c)) {
        const [fw, fh] = Combat.footprint(c);
        const move = Combat.movement(c);
        ctx.fillStyle = token('--side-' + c.kind);   // player, ally, or enemy
        ctx.globalAlpha = 0.18;
        for (let y = Math.max(0, c.y - move); y < Math.min(o.map.rows, c.y + fh + move); y++) {
          for (let x = Math.max(0, c.x - move); x < Math.min(o.map.cols, c.x + fw + move); x++) {
            const dx = Math.max(0, c.x - x, x - (c.x + fw - 1));
            const dy = Math.max(0, c.y - y, y - (c.y + fh - 1));
            const d = Math.max(dx, dy);
            if (d > 0 && d <= move) ctx.fillRect(x * cs + 1, y * cs + 1, cs - 2, cs - 2);
          }
        }
        ctx.globalAlpha = 1;
      }
      if (rulerLine) {
        const { ax, ay, bx, by } = rulerLine;
        const mid = v => v * cs + cs / 2;
        ctx.strokeStyle = ctx.fillStyle = token('--gilt');
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(mid(ax), mid(ay));
        ctx.lineTo(mid(bx), mid(by));
        ctx.stroke();
        ctx.setLineDash([]);
        [[ax, ay], [bx, by]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(mid(x), mid(y), 5, 0, Math.PI * 2); ctx.fill(); });
        showTip(Combat.distance(ax, ay, bx, by) + 'M', bx, by, false);
      } else if (!drag) {
        hideTip();
      }
    }

    return { update, element: wrap };
  }

  window.Grid = { create, imageUrl, forgetImage, shortLabel };
})();
