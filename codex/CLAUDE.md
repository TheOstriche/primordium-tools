# Primordium Codex

Phone-first rules reference for Primordium 2.0. Notes in `README.md`.

## Rules for working here
- No build step. Game data shared with the other apps lives in `../shared/`; only Codex-only text goes in `codex-data.js`. `app.js` adapts the shared shapes at load time.
- The design is approved. Keep the color tokens, fonts, and rarity colors in `style.css` unless the owner asks for a change.
- Game text comes from the owner's guides. Don't invent or reword rules; parse or copy them.
- Phone first: test at about 400px wide, light and dark. Nothing may scroll sideways except tables inside their own scroll box.
- Raise `VERSION` in `sw.js` when anything it caches changes, and keep `FILES` matching what `index.html` loads. Its activate step deletes only `codex-*` caches, because the sheet's cache lives on the same site.
- Storage: localStorage keys start with `codex:`.
- Initiative and enemy HP tracking belong in the GM tool, not here.
- Run `python -m unittest discover -s codex/tests` from the repository root after changing the parser.
