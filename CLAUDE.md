# Primordium Tools

One repository (`TheOstriche/primordium-tools`, published with GitHub Pages) holding three static web apps for **Primordium 2.0**, the owner's original tabletop RPG. Read `ARCHITECTURE.md` first: it maps every folder, shared file, saved-data key, and the reasons behind the layout.

- `sheet/`: the player character sheet (phone, installable, offline). Notes in `sheet/README.md`, brief in `sheet/CLAUDE.md`.
- `codex/`: the rules reference (phone, installable, offline). Brief in `codex/CLAUDE.md`.
- `gm/`: the GM tool (laptop): combat, encounters, and shops. Brief in `gm/CLAUDE.md`.
- `shared/`: everything more than one app uses, once: `core.js` (rule tables and helpers), the game data, `items-data.js` and `items.js` (items, prices, shops), `qr.js` (QR codes), `character-rules.js`, `tactics-deck.js`, `dice.js`, `fx.js` (impact effects), `theme.css` and `theme.js` (the look, light and dark), `offline.js` (service workers).
- `index.html`: the front page. `tools/serve.js`: local server (port 8080). `tools/test.js`: runs every test. `tools/old-sheet-redirect/`: replaces the old `Primordium-Player-Sheets` repository's contents.

## Rules for changes
- No build step. Plain scripts that set globals, loaded in order by each `index.html`; the GM tool must still open from a double-clicked `gm/index.html` (so no ES modules).
- One copy of everything: a rule table or list goes in `shared/core.js`, game data in `shared/primordium-data.js` or `shared/npc-data.js`, items in `shared/items-data.js`, a component or color in `shared/theme.css`. Never copy them into an app.
- Styling: the Codex is the house style. Use theme tokens (`var(--glow)`, `var(--r-rare)`, …), never fixed colors, and check light and dark.
- Phone apps: test at about 375–400px wide; nothing may scroll sideways except tables in their own scroll box.
- When anything a phone app loads changes (its own files or `shared/`), run `node tools/stamp-offline.js`: it raises the version in that app's `sw.js` and updates its fingerprint, so installed phones update. Keep each `sw.js` file list matching its `index.html`. `node tools/test.js` fails if either is forgotten.
- Storage keys must stay distinct (see `ARCHITECTURE.md`); never change the sheet's `primordium.characters.v1` format without an upgrade step in `sheet/js/store.js`.
- Game text comes from the owner's guides: don't invent or reword rules. When a rule is unclear, ask.
- Run `node tools/test.js` after every change (it also checks that every script parses and every page loads real files).
- Outside input is never trusted: shop links (`PrimordiumItems.decodeShop`), imported backups (`adopt()` in `sheet/js/store.js`, `shaped()` in `gm/js/store.js`). Validate at that boundary, escape with `esc()` in HTML strings, and keep the phone apps free of inline scripts and handlers (their security policy blocks them).
- The owner commits and pushes with GitHub Desktop. Git for Windows is at `C:\Program Files\Git\cmd\git.exe`.
