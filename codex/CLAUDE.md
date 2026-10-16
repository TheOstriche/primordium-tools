# Primordium Codex

Phone-first rules reference for Primordium 2.0. Notes in `README.md`; how it fits with the other apps in `../ARCHITECTURE.md`.

## Rules for working here
- No build step. Game data, rule tables, and the look are shared (`../shared/`); only Codex-only text goes in `codex-data.js`. `js/data.js` adapts the shared shapes at load time.
- Code: `js/data.js` → `js/ui.js` → `js/views.js` → `js/app.js`, loaded in that order and sharing one scope. A new screen is a `V.<name>` function in `views.js`; a new button gets a `data-*` attribute and an entry in `TAPS` in `app.js`.
- The design is the house style for all three apps. Shared colors and components live in `../shared/theme.css`; `style.css` holds only the Codex's layout. Use tokens, never fixed colors.
- Game text comes from the owner's guides. Don't invent or reword rules; parse or copy them.
- Phone first: test at about 375–400px wide, light and dark. Nothing may scroll sideways except tables inside their own scroll box.
- Raise the version in `sw.js` when anything it caches changes, and keep its file list matching what `index.html` loads.
- Storage: localStorage keys start with `codex:`.
- Initiative and enemy HP tracking belong in the GM tool, not here.
- Run `node tools/test.js` from the repository root after changing the parser, the deck, or shared rules.
