# How Primordium Tools fits together

Three static web apps for the Primordium 2.0 tabletop RPG, published together with GitHub Pages. There is **no build step**: every file is served as written, so what you read is what runs. This page explains where things live, how the pieces connect, and why they are arranged this way. For publishing and day-to-day editing, see `README.md`.

## The apps

| Folder | Who uses it | On | What it does |
|---|---|---|---|
| `sheet/` | players | phone, installable, works offline | A character sheet: HP, stats, effects, gear, skills, dice, and the tactical deck. |
| `codex/` | everyone | phone, installable, works offline | A rules reference: search, skills, bestiary, rules and tables, dice tray, deck simulator. |
| `gm/` | the GM | laptop, opens from a double-clicked file | Encounters, a grid map, initiative, enemy turns, HP, stacks, XP. |
| `index.html` | | | The front page linking all three. |

## Shared code (`shared/`)

Everything more than one app needs lives here, once. Each file sets one global (no modules, so the GM tool can open from `file://`). Files marked *Node* also load in the tests.

| File | Global | What it holds | Used by |
|---|---|---|---|
| `core.js` (*Node*) | `PrimordiumCore` | The game's rule tables and small helpers: rarities, stats, the D20 tactics table, cooldowns, roles and XP, stacks and recovery, movement; `esc`, `slug`, `signed`, `plural`. | all |
| `primordium-data.js` | `PRIMORDIUM_DATA` | Every skill (tiers, paths, abilities, perks), race stats and specials, background traits. Generated from the owner's working sheets. | all |
| `npc-data.js` | `PRIMORDIUM_NPCS` | All 97 creatures from the NPC Guide. | Codex, GM |
| `character-rules.js` | `PrimordiumCharacter` | What a character's skills grant, and their stats, max HP, and armor. The sheet shows these; the GM tool imports sheet backups with the same code, so the two always agree. | sheet, GM |
| `tactics-deck.js` | `PrimordiumDeck` | The tactical deck: builds the 52 cards and jokers from a Tactics level, runs a hand with every Tactics mechanic, and draws it (its HTML is shared too). | sheet, Codex |
| `dice.js` | `PrimordiumDice` | Rolling `2D6+3`-style expressions, and the dice tray buttons. | sheet, Codex |
| `fx.js` | `PrimordiumFX` | Impact effects (purely for feel): card plays from Rare to Mythic, crits and natural 1s, HP, combat, rests; and the effects settings. | all |
| `theme.css` | | The look: color tokens for dark and light, fonts, and shared components (buttons, segmented choices, rarity chips, panels, tables, toasts, dice tray, deck). | all |
| `theme.js` | `PrimordiumTheme` | Light/dark: follows the device by default; any `<button data-theme-toggle>` cycles System → Light → Dark. | all |
| `offline.js` | `primordiumOffline()` | The service-worker logic both phone apps use (`sheet/sw.js`, `codex/sw.js` call it). | sheet, Codex |

### How the data flows

```
Owner's guides and working sheets
  ├─ shared/primordium-data.js, shared/npc-data.js   (generated; edit to change game data)
  ├─ shared/core.js                                   (rule tables, hand-written)
  ├─ codex/codex-data.js                              (rules text, tables, race lore: Codex only)
  └─ gm/docs/*.md, gm/data/scaling.json               (GM rulings, scaling workbook: GM only;
                                                        `node gm/tools/build-data.js` turns them into gm/data/*.js)
        ↓
  core.js → character-rules.js / tactics-deck.js / dice.js / fx.js → each app's own files
```

## Inside each app

Every app follows the same shape: an `index.html` that loads the theme in `<head>`, then the shared scripts, then its own scripts **in order**. Each app's own files are plain scripts that share one scope, so a name declared in an earlier file (say `state` or `esc`) is available to the later ones. Each file starts with a comment saying what it holds.

| | Codex (`codex/js/`) | Sheet (`sheet/js/`) | GM tool (`gm/js/`) |
|---|---|---|---|
| Data and saving | `data.js`: shapes the shared data, builds the search index | `store.js`: saving, new characters, upgrading old saves, what is on screen | `store.js` (IndexedDB, backups), `data.js` (creature lookup) |
| Rules | (in the shared files) | `rules.js`: totals, stacks, the deck | `rules.js` (scaling math), `combat-engine.js`, `skills.js`: no screen code, tested |
| Helpers | `ui.js`: chips, dice in text, the roll toast | `ui.js`: toasts, fields, the dice tray log | `ui.js` (`h()` element builder), `markdown.js` |
| Screens | `views.js`: one function per screen | `views.js` (tabs), `sheets.js` (bottom sheets) | one file per tab: `encounter.js`, `combat-view.js`, `grid.js`, `reference.js`, `creatures.js`, `save-view.js` |
| Events | `app.js`: state, navigation, a table of taps | `app.js`: actions, a table of taps, forms, the ⋯ menu | each tab file wires its own; `app.js` switches tabs |
| Its own look | `style.css` | `style.css` | `css/style.css` |

The Codex and sheet draw screens as HTML strings and redraw on each change; a tap is matched against a table (`TAPS`) of `data-*` attributes, which makes it easy to find what a button does: search for its attribute. The GM tool builds elements with `UI.h()` and wires events where it builds them.

## Saved data

All apps are on one site, so they share browser storage. Each uses its own keys:

| Key | App | Holds |
|---|---|---|
| localStorage `primordium.characters.v1` | sheet | every character, `{ id: character }` (also the backup file format the GM tool imports) |
| localStorage `codex:*` | Codex | last tab, tactics level, roll history, deck (safe to clear) |
| IndexedDB `primordium-gm`, localStorage `gm-tab` | GM | players, encounters, custom NPC types, the combat in progress, map images |
| localStorage `primordium.theme`, `primordium.fx` | all (shared on purpose) | light/dark choice, effects settings |
| caches `primordium-v*`, `codex-v*` | sheet, Codex | offline copies; each app only clears its own |

## Why it is built this way

- **No build step, plain scripts.** The owner edits and publishes with GitHub Desktop; nothing to install or compile, and the GM tool still opens from a double-clicked file (which rules out ES modules).
- **One copy of every rule and table.** Before this review the rarity list existed six times and the tactics table twice. Now a number changes in one place (`shared/core.js` or the data files) and every app follows; `node tools/test.js` checks they still agree (for example, the scaling workbook's XP multipliers against the core).
- **One look.** The Codex's styling is the house style. `shared/theme.css` holds the tokens and components; an app's stylesheet only lays out its own screens. Colors are always tokens (`var(--glow)`, `var(--r-rare)`), never fixed values, so light mode works everywhere.
- **Effects are separate from rules.** `fx.js` never changes a number. The deck engine reports what happened (`act()` returns `{ played, drawn }`) and the apps decide how to show it.

## Changing things safely

- **Game data:** edit `shared/primordium-data.js` or `shared/npc-data.js`; rule tables: `shared/core.js`. Run `node tools/test.js`.
- **A phone app's files (or anything in `shared/` it loads):** raise the version in its `sw.js` and keep the file list there matching what its `index.html` loads, so installed phones update.
- **A new screen or button:** follow the app's pattern: a view function in `views.js`, a `data-*` attribute on the button, an entry in `TAPS` in `app.js`.
- **New colors or components:** add tokens or components to `shared/theme.css` if more than one app could use them.
- **Tests:** `node tools/test.js` runs every suite (shared core, tactical deck, GM game math, GM combat rules, and the Codex guide parser if Python is installed). Then try the apps with `node tools/serve.js` at http://localhost:8080 on a phone-sized window, in light and dark.
