# Primordium Character Sheet

The players' phone app for Primordium 2.0. Notes in `README.md`; how it fits with the other apps in `../ARCHITECTURE.md`.

## Rules for working here
- No build step. Code is `data.js`, then `js/store.js` → `js/rules.js` → `js/ui.js` → `js/views.js` → `js/sheets.js` → `js/shop.js` → `js/app.js`, loaded in that order and sharing one scope.
- Shared rules come from `../shared/` (core tables, what skills grant, the deck, dice, effects). Don't copy a rule or list into the sheet; add it to `../shared/core.js` if more than one app needs it.
- Characters are saved under localStorage `primordium.characters.v1` as `{ id: character }`. The GM tool imports that same file. If a character's shape changes, add the conversion to `upgrade()` in `js/store.js` so older saves keep working.
- The overview keeps the same order in both modes (HP, stats, dice, cards in combat, effects) and the HP and stat rows keep the same height, so nothing jumps when combat is switched on.
- Styling follows the shared theme (`../shared/theme.css`, the Codex's look). Use tokens, never fixed colors; check light and dark at about 375–400px wide.
- After changing anything the sheet caches, run `node tools/stamp-offline.js` from the repository root (it raises the version in `sw.js`), and keep the `sw.js` file list matching `index.html`.
- Saving: `save()` waits a moment, `saveNow()` writes; a hidden page writes at once. Anything read from a file or a link goes through `adopt()` (backups) or `PrimordiumItems.decodeShop()` (shop links) first. `index.html` carries a security policy: no inline scripts or `on…=` handlers.
- The phone's Back button returns to the character list (`enter()`/`leave()` in `js/app.js`).
- Run `node tools/test.js` from the repository root after changing shared rules or the deck.
