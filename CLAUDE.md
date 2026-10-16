# Primordium Tools

One repository (`TheOstriche/primordium-tools`, published with GitHub Pages) holding three static web apps for **Primordium 2.0**, the owner's original tabletop RPG.

- `gm/`: the GM combat tool (laptop). Its full brief is `gm/CLAUDE.md`.
- `sheet/`: the player character sheet (phone, installable, offline through `sheet/sw.js`). Notes in `sheet/README.md`.
- `codex/`: the rules reference (phone, installable, offline through `codex/sw.js`). Its brief is `codex/CLAUDE.md`.
- `shared/primordium-data.js`: sets `window.PRIMORDIUM_DATA` (skills with every tier's abilities and perks, races, traits). It is the **only** copy; all three apps load it with `../shared/primordium-data.js`. Put new data that more than one app needs in `shared/`, not inside one app.
- `shared/npc-data.js`: sets `window.PRIMORDIUM_NPCS` (all creatures from the NPC Guide). The GM tool and the Codex load it.
- `shared/character-rules.js`: sets `window.PrimordiumCharacter` (what skills grant, and a character's stats, maximum HP, and armor). The sheet computes its totals with it, and the GM tool uses it to import sheet backups, so the two always agree.
- `shared/tactics-deck.js`: sets `window.PrimordiumDeck`, the tactical deck: builds the cards from a Tactics level (base tier, path, path tier, promotion choices) and runs a hand with every Tactics mechanic. The Codex (any level, picked from a list) and the sheet (the character's own Tactics) both use it, including its HTML. `node tools/test-deck.js` checks it.
- `shared/dice.js`: sets `window.PrimordiumDice` (dice expressions like `2D6+3`), used by the Codex and the sheet.
- `shared/fx.js`: sets `window.PrimordiumFX`, impact effects for all three apps (purely for feel, never a rule): card plays escalate from Rare to Mythic, crits (every die at its highest face) and natural 1s (every die at 1), HP damage, healing and going down, combat on and off, breathers and rests. It injects its own styles, honors reduce motion, and reads the viewer's settings from localStorage key `primordium.fx`. `PrimordiumDeck.act` returns `{played, drawn}` for it.
- `index.html`: landing page linking all three apps.
- `tools/serve.js`: local server for the whole repository (port 8080). `tools/old-sheet-redirect/`: files that replace the old `Primordium-Player-Sheets` repository's contents.

## Rules for changes
- No build step. Each app must still work from a relative path, and the GM tool must still open from a double-clicked `gm/index.html`.
- When anything the sheet loads changes (its own files or `shared/`), raise `VERSION` in `sheet/sw.js`, and keep its `FILES` list matching what `sheet/index.html` loads. The same goes for the Codex and `codex/sw.js`.
- Each service worker deletes only its own caches (`primordium-*` for the sheet, `codex-*` for the Codex), because they share one site.
- All apps are on one site, so they share browser storage. Keep storage names distinct: the sheet uses localStorage key `primordium.characters.v1`; the GM tool uses IndexedDB and the `gm-tab` localStorage key; the Codex uses `codex:*` localStorage keys; effects settings use `primordium.fx` (shared on purpose).
- The owner commits and pushes with GitHub Desktop. Git for Windows is at `C:\Program Files\Git\cmd\git.exe`.
