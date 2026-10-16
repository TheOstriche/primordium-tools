// Combat rules: building combat from an encounter, initiative, turns and phases,
// damage, stacks and recovery, death clocks, and enemy ability choice.
// No screen code here, so tools/test-combat.js can check it with fixed dice.
// Sources: docs/rules.md (including the GM rulings section).
(function (root) {
  // Shared game constants (rarities, the tactics table, stacks): ../shared/core.js.
  const Core = root.PrimordiumCore || require('../../shared/core.js');
  const STACK_TYPES = Core.STACKS;
  const DAMAGING_STACKS = Core.DAMAGING_STACKS;
  // Conditions the GM can mark on a creature. Calmed, Enraged, and Terrified follow from Calm, Anger, and Fear stacks.
  const CONDITIONS = ['Disoriented', 'Calmed', 'Enraged', 'Terrified'];
  // Squares a creature covers: [wide, tall]. Tiny and Small share a square.
  const FOOTPRINT = { Tiny: [1, 1], Small: [1, 1], Average: [1, 1], Large: [2, 1], Huge: [2, 2], Massive: [3, 3] };
  const DEFAULT_COOLDOWN = Core.COOLDOWNS;
  const DEATH_CLOCK = 3;

  function make(Rules, findNpc, random) {
    random = random || Math.random;
    const die = sides => 1 + Math.floor(random() * sides);
    const roll = (n, sides) => Array.from({ length: n }, () => die(sides));
    const sum = list => list.reduce((a, b) => a + b, 0);
    let idCounter = 0;
    const newId = () => 'c' + Date.now().toString(36) + (idCounter++).toString(36);

    // ---------- Building a combat ----------

    function blankCombatant(extra) {
      return Object.assign({
        x: null, y: null, rotated: false,
        init: null, stacks: {}, conditions: [], effects: [], cooldowns: {},
        deathClock: null, stabilized: false, dead: false, resist: 0, notes: ''
      }, extra);
    }

    function fromEncounter(enc, players) {
      const combatants = [];
      for (const p of players.filter(p => enc.partyIds.includes(p.id))) {
        combatants.push(blankCombatant({
          id: newId(), kind: 'player', refId: p.id, name: p.name, level: p.level,
          hp: p.hp, maxHp: p.hp, armor: p.armor, stats: Object.assign({}, p.stats), size: 'Average'
        }));
      }
      // Allies (friendly NPCs such as summons and local help) fight on the players' side.
      for (const [kind, rows] of [['ally', enc.allies || []], ['enemy', enc.enemies]]) {
        for (const row of rows) {
          const npc = findNpc(row.npcName);
          if (!npc) continue;
          for (let i = 0; i < row.count; i++) {
            combatants.push(npcCombatant(npc, kind, row.count > 1 ? npc.name + ' ' + (i + 1) : npc.name));
          }
        }
      }
      return {
        id: newId(), encounterId: enc.id, encounterName: enc.name,
        phase: 0, turn: 0, order: [], surprise: null, combatants, log: []
      };
    }

    // kind: 'enemy' or 'ally'.
    function npcCombatant(npc, kind, name) {
      const hasHp = typeof npc.hp === 'number';
      return blankCombatant({
        id: newId(), kind, refId: npc.name, name,
        level: npc.level, role: npc.role, tactics: npc.tactics,
        hp: hasHp ? npc.hp : null, maxHp: hasHp ? npc.hp : null,
        armor: npc.armor || 0, stats: Object.assign({}, npc.stats), size: npc.size || 'Average',
        turnsPerPhase: npc.turnsPerPhase || 1, xp: npc.xp != null ? npc.xp : Rules.xpFor(npc.role, npc.level)
      });
    }

    // NPCs that join mid-fight (reinforcements, summons).
    function addNpc(combat, npc, kind) {
      kind = kind || 'enemy';
      const same = combat.combatants.filter(c => c.refId === npc.name).length;
      const c = npcCombatant(npc, kind, npc.name + ' ' + (same + 1));
      c.init = initiativeOf(c);
      combat.combatants.push(c);
      if (combat.phase > 0) {
        // Slot into the order by initiative; a Boss's extra turn goes to the end.
        const firstEnd = combat.order.findIndex(e => e.second);
        const main = firstEnd < 0 ? combat.order.length : firstEnd;
        let at = combat.order.slice(0, main).findIndex(e => initiativeOf(get(combat, e.cid)) < c.init);
        if (at < 0) at = main;
        combat.order.splice(at, 0, { cid: c.id });
        if (at <= combat.turn) combat.turn++;
        if (c.turnsPerPhase > 1) combat.order.push({ cid: c.id, second: true });
      }
      return c;
    }

    const get = (combat, id) => combat.combatants.find(c => c.id === id);

    // Two sides: players and their allies, and enemies.
    const side = c => (c.kind === 'enemy' ? 'enemy' : 'player');
    const KIND_ORDER = { player: 0, ally: 1, enemy: 2 };

    // ---------- Initiative and turns ----------

    // NPCs (enemies and allies): 5 + Perception. Players: the D10 + Perception result the GM types in.
    function initiativeOf(c) {
      if (c.kind !== 'player') return 5 + ((c.stats && c.stats.PER) || 0);
      return Number(c.init) || 0;
    }

    // Ties: players before allies before enemies; between players, higher Perception first.
    // Any remaining tie keeps list order (the GM can move entries; players choose).
    function buildOrder(combat) {
      const list = combat.combatants.map((c, i) => ({ c, i }));
      list.sort((a, b) =>
        initiativeOf(b.c) - initiativeOf(a.c) ||
        (KIND_ORDER[a.c.kind] - KIND_ORDER[b.c.kind]) ||
        (a.c.kind === 'player' ? ((b.c.stats.PER || 0) - (a.c.stats.PER || 0)) : 0) ||
        a.i - b.i);
      combat.order = list.map(({ c }) => ({ cid: c.id }));
      // Bosses: second turn at the end of the phase (GM ruling).
      for (const { c } of list) {
        if ((c.turnsPerPhase || 1) > 1) combat.order.push({ cid: c.id, second: true });
      }
      for (const c of combat.combatants) if (c.kind !== 'player') c.init = initiativeOf(c);
    }

    // surprise: null, 'player' (players and allies ambush) or 'enemy' (enemies ambush).
    function begin(combat, surprise) {
      buildOrder(combat);
      combat.surprise = surprise || null;
      combat.phase = 1;
      combat.turn = -1;
      log(combat, surprise
        ? 'Combat begins with a surprise phase for the ' + (surprise === 'player' ? 'players' : 'enemies') + '.'
        : 'Combat begins.');
      return nextTurn(combat);
    }

    const inSurprise = combat => !!combat.surprise && combat.phase === 1;

    // Entries that act this phase: skip the defeated, and in a surprise phase only the ambushers.
    function canAct(combat, entry) {
      const c = get(combat, entry.cid);
      if (!c || c.dead) return false;
      if (inSurprise(combat) && side(c) !== combat.surprise) return false;
      return true;
    }

    // Moves to the next turn. Returns 'phase-end' when everyone has acted.
    function nextTurn(combat) {
      let t = combat.turn + 1;
      while (t < combat.order.length && !canAct(combat, combat.order[t])) t++;
      if (t >= combat.order.length) {
        combat.turn = combat.order.length;
        return 'phase-end';
      }
      combat.turn = t;
      return 'turn';
    }

    function activeEntry(combat) {
      return combat.phase > 0 && combat.turn >= 0 && combat.turn < combat.order.length ? combat.order[combat.turn] : null;
    }

    function moveEntry(combat, index, delta) {
      const to = index + delta;
      if (to < 0 || to >= combat.order.length) return;
      const active = activeEntry(combat);
      const [e] = combat.order.splice(index, 1);
      combat.order.splice(to, 0, e);
      if (active) combat.turn = combat.order.indexOf(active);
    }

    // End of phase: damaging stacks hurt, recovery targets drop, effects tick,
    // death clocks count down. Returns a list of lines describing what happened.
    function endPhase(combat) {
      const lines = [];
      const wasSurprise = inSurprise(combat);
      for (const c of combat.combatants) {
        if (c.dead) continue;
        for (const type of DAMAGING_STACKS) {
          const s = c.stacks[type];
          if (!s || s.n <= 0) continue;
          const dice = roll(s.n, 4);
          const dmg = sum(dice);
          hurt(combat, c, dmg, false);
          lines.push(c.name + ' takes ' + dmg + ' ' + type + ' damage (' + s.n + 'D4: ' + dice.join(', ') + ').');
        }
        for (const s of Object.values(c.stacks)) s.target = Math.max(Core.RECOVERY_FLOOR, s.target - 1);
        c.effects = c.effects.filter(e => {
          if (e.phases == null) return true;
          e.phases--;
          if (e.phases <= 0) { lines.push(c.name + ': ' + e.text + ' ends.'); return false; }
          return true;
        });
        if (isDowned(c) && !c.dead && !c.stabilized && c.deathClock != null) {
          c.deathClock--;
          if (c.deathClock <= 0) { c.dead = true; lines.push(c.name + ' dies.'); }
          else lines.push(c.name + "'s death clock: " + c.deathClock + ' phase' + (c.deathClock === 1 ? '' : 's') + ' left.');
        }
      }
      // A surprise phase does not count as phase 1 of the normal order.
      if (wasSurprise) combat.surprise = null;
      else combat.phase++;
      combat.turn = -1;
      lines.forEach(l => log(combat, l));
      log(combat, 'Phase ' + combat.phase + ' begins.');
      nextTurn(combat);
      return lines;
    }

    // ---------- HP, damage, dying ----------

    const isDowned = c => c.kind === 'player' && c.hp != null && c.hp <= 0;

    // isHit: true for attacks (a hit on a downed character removes a death-clock phase),
    // false for stack damage and quick adjustments.
    function hurt(combat, c, amount, isHit) {
      if (c.hp == null) return;
      const wasDowned = isDowned(c);
      c.hp -= amount;
      if (c.kind === 'player') {
        if (!wasDowned && c.hp <= 0) {
          c.deathClock = DEATH_CLOCK;
          c.stabilized = false;
          log(combat, c.name + ' is downed. Death clock: ' + DEATH_CLOCK + ' phases.');
        } else if (wasDowned && isHit && !c.stabilized && !c.dead) {
          c.deathClock--;
          if (c.deathClock <= 0) { c.dead = true; log(combat, c.name + ' is hit while downed and dies.'); }
          else log(combat, c.name + ' is hit while downed. Death clock: ' + c.deathClock + '.');
        }
      } else if (c.hp <= 0 && !c.dead) {
        c.dead = true;
        log(combat, c.name + ' is defeated.');
      }
    }

    function heal(combat, c, amount) {
      if (c.hp == null) return;
      c.hp = c.maxHp != null ? Math.min(c.maxHp, c.hp + amount) : c.hp + amount;
      if (c.hp > 0) {
        if (c.kind === 'player' && c.deathClock != null && !c.dead) {
          c.deathClock = null;
          c.stabilized = false;
          log(combat, c.name + ' is back on their feet.');
        }
        if (c.kind !== 'player' && c.dead) c.dead = false;
      }
    }

    function stabilize(combat, c) {
      c.stabilized = true;
      log(combat, c.name + ' is stabilized.');
    }

    // Damage per strike after armor and AP, then a failed dodge (x1.5, round down),
    // resistance (capped at 75%), and a block.
    // opts: { strikes:[numbers], ap, ignoreArmor, failedDodge, resist, block }
    function computeDamage(target, opts) {
      const armor = opts.ignoreArmor ? 0 : Math.max(0, (target.armor || 0) - (opts.ap || 0));
      const perStrike = (opts.strikes || []).map(s => Math.max(0, s - armor));
      let total = sum(perStrike);
      if (opts.failedDodge) total = Math.floor(total * 1.5);
      const resist = Math.min(75, Math.max(0, opts.resist || 0));
      if (resist) total = Math.floor(total * (1 - resist / 100));
      if (opts.block) total = Math.max(0, total - opts.block);
      return { armor, perStrike, total };
    }

    function applyAttack(combat, target, opts, source) {
      const r = computeDamage(target, opts);
      hurt(combat, target, r.total, true);
      log(combat, (source ? source + ' hits ' : '') + target.name + ' for ' + r.total +
        (opts.strikes.length > 1 ? ' (strikes ' + r.perStrike.join(' + ') + ' after armor)' : '') + '.');
      return r;
    }

    // ---------- Stacks ----------

    function addStacks(c, type, n) {
      const s = c.stacks[type] || { n: 0, target: Core.RECOVERY_START };
      s.n = Math.max(0, s.n + n);
      if (n > 0) s.target = Core.RECOVERY_START;   // a new stack resets the recovery target
      if (s.n === 0) delete c.stacks[type];
      else c.stacks[type] = s;
    }

    // One D4 per stack type (GM ruling). A 1 never recovers.
    // Damaging stacks lose 3 or half, whichever is more; others lose half. Halves round up.
    function recover(c, type) {
      const s = c.stacks[type];
      if (!s) return null;
      const r = die(4);
      const success = r !== 1 && r >= s.target;
      let lost = 0;
      if (success) {
        lost = Core.recoveryLoss(type, s.n);
        addStacks(c, type, -lost);
      }
      return { roll: r, target: s.target, success, lost, left: c.stacks[type] ? c.stacks[type].n : 0 };
    }

    // States that follow from stacks, for display.
    function stackEffects(c) {
      const out = [];
      const n = t => (c.stacks[t] ? c.stacks[t].n : 0);
      const lvl = c.level || 1;
      if (n('Frozen') > lvl) out.push({ text: 'Frozen solid: no actions', severe: true });
      else if (n('Frozen') >= 3) out.push({ text: 'Chilled: no Defensive; Quick only as Standard' });
      if (n('Paralysis') > lvl) out.push({ text: 'Paralyzed: no actions', severe: true });
      else if (n('Paralysis')) out.push({ text: '-' + n('Paralysis') + ' Strength and Agility' });
      for (const [t, state] of [['Calm', 'calmed'], ['Anger', 'enraged'], ['Fear', 'terrified']]) {
        if (n(t) > lvl / 2) out.push({ text: 'Knowledge check against 1D10 + ' + n(t) + ' or ' + state + ' for a phase', check: t });
      }
      return out;
    }

    // ---------- Movement ----------

    const movement = c => Core.movement(c.stats && c.stats.SPD);

    function footprint(c) {
      const [w, h] = FOOTPRINT[c.size] || [1, 1];
      return c.rotated ? [h, w] : [w, h];
    }

    // Squares between two squares, diagonals costing 1M (GM ruling).
    const distance = (ax, ay, bx, by) => Math.max(Math.abs(ax - bx), Math.abs(ay - by));

    // ---------- Enemy turns ----------

    function cooldownOf(ability) {
      if (ability.cooldown != null) return ability.cooldown;
      return DEFAULT_COOLDOWN[ability.rarity] || 0;
    }

    // Cooldowns are stored as the phase the ability is ready again ('combat' = used up).
    function isReady(combat, c, ability) {
      const r = c.cooldowns[ability.name];
      if (r == null) return true;
      if (r === 'combat') return false;
      return combat.phase >= r;
    }

    function markUsed(combat, c, ability) {
      const cd = cooldownOf(ability);
      if (cd === 'combat') c.cooldowns[ability.name] = 'combat';
      else if (cd > 0) c.cooldowns[ability.name] = combat.phase + cd + 1;
    }

    // Roll the D20 on the tactics row and pick an ability (rules.md, enemy ability selection).
    // abilities: the list to choose from (a humanoid's skill abilities); defaults to the stat block's.
    function chooseAbility(combat, c, npc, forcedRoll, abilities) {
      const R = Rules.RARITIES;
      const d20 = forcedRoll || die(20);
      const rolled = Rules.rarityForRoll(npc.tactics, d20);
      const notes = [];
      let idx = R.indexOf(rolled);
      if (c.conditions.includes('Disoriented')) {
        if (npc.tactics === 'Basic') {
          return { d20, rolled, ability: null, notes: ['Disoriented with Basic tactics: no abilities this turn. It may still move and dodge.'] };
        }
        if (idx > 0) { idx--; notes.push('Disoriented: drops to ' + R[idx] + '.'); }
      }
      const standard = (abilities || npc.abilities || []).filter(a => !a.type || a.type === 'Standard');
      for (let i = idx; i >= 0; i--) {
        const atRarity = standard.filter(a => a.rarity === R[i]);
        const ready = atRarity.filter(a => isReady(combat, c, a));
        if (ready.length) {
          if (i < idx) notes.push('Nothing usable at ' + R[idx] + '; dropped to ' + R[i] + '.');
          return { d20, rolled, rarity: R[i], ability: ready[Math.floor(random() * ready.length)], notes };
        }
      }
      notes.push('No usable ability at ' + R[idx] + ' or below.');
      return { d20, rolled, ability: null, notes };
    }

    // Roll an attack object. A strike only fails if every die rolls a 1.
    // Skill attacks (humanoids) also carry perDie (damage stat modifier per die, rounded down
    // per strike) and bonus (weapon tier, added to the first strike).
    function rollAttack(atk) {
      const strikes = [];
      for (let i = 0; i < atk.strikes; i++) {
        const dice = roll(atk.dice, atk.sides);
        const failed = dice.every(v => v === 1);
        const flat = Math.floor((atk.flat || 0) + (atk.perDie || 0) * dice.length) + (i === 0 ? (atk.bonus || 0) : 0);
        strikes.push({ dice, flat, failed, value: failed ? 0 : sum(dice) + flat });
      }
      return { strikes, ap: atk.ap || 0, ignoreArmor: !!atk.ignoreArmor, area: !!atk.area };
    }

    // ---------- Ending combat ----------

    function xpSummary(combat) {
      const players = combat.combatants.filter(c => c.kind === 'player');
      const enemies = combat.combatants.filter(c => c.kind === 'enemy');
      const earned = sum(enemies.filter(e => e.dead).map(e => e.xp || 0));
      const total = sum(enemies.map(e => e.xp || 0));
      return { players, enemies, earned, total };
    }

    // ---------- Log ----------

    function log(combat, text) {
      combat.log.push({ phase: combat.phase, text });
      if (combat.log.length > 300) combat.log.splice(0, combat.log.length - 300);
    }

    return {
      STACK_TYPES, DAMAGING_STACKS, CONDITIONS, FOOTPRINT, DEATH_CLOCK,
      die, roll, fromEncounter, npcCombatant, addNpc, addEnemy: addNpc, get, side, initiativeOf, buildOrder, begin, inSurprise, canAct,
      nextTurn, activeEntry, moveEntry, endPhase, isDowned, hurt, heal, stabilize,
      computeDamage, applyAttack, addStacks, recover, stackEffects, movement, footprint, distance,
      cooldownOf, isReady, markUsed, chooseAbility, rollAttack, xpSummary, log
    };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = make;
  else root.Combat = make(root.Rules, name => root.GameData.find(name));
})(typeof window !== 'undefined' ? window : globalThis);
