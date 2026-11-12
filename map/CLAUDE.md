# Primordium World Map

A laptop web app with one job: **building out and improving the Primordium world map at high detail and scale**. It draws the map from data and edits that data. Notes for the owner in `README.md`; how it fits with the other apps in `../ARCHITECTURE.md`; the owner's notes and open world decisions in `docs/map-notes.md`.

## Rules for working here
- **Never invent names or lore.** Settlements stay unnamed until the owner names them. Region names, realm borders, and landform explanations come from the owner through the Claude project (as handoff answers; see `../exports/handoff/map.md`, written by `node tools/export-handoffs.js`). Until the owner decides the open world decisions in `docs/map-notes.md`, keep the map as it is and build the tools that make the fixes easy.
- **The map is one data file:** `../shared/map/primordium-map.json`. `../shared/map/map-data.js` is generated from it (the app's Save, or `node tools/build-map.js`); never edit it by hand. `node tools/build-map.js --apply changes.json` applies a handoff answer.
- **The rules of the data live in `../shared/map/map-model.js`** (`PrimordiumMap`), with no screen code, and are tested by `tools/test-map.js`: the format (`KINDS`, `TYPES`), the gate for outside data (`shaped`), the checks (`check`), what is under a point (`hit`), comparing and patching (`diff`, `patch`), and the file text (`serialize`, `dataFile`). Put new data rules there with a test, not in the app.
- **Stored data stays plain; detail is generated when drawing** (`js/draw.js`), seeded from each feature's id so it never shifts. Don't store generated detail (tree positions, peak shapes) in the map.
- No build step and no ES modules: the app opens from a double-clicked `index.html`. Each file in `js/` is wrapped in a function and sets one global, loaded in this order: `ui.js` (`MapUI`) → `draw.js` (`MapDraw`) → `view.js` (`MapView`) → `store.js` (`MapStore`) → `editor.js` (`MapEditor`) → `panels.js` (`MapPanels`) → `app.js`.
- **Every change to the map goes through `MapStore`** (`edit(fn)`, or `begin()`/`touch()`/`end()` for a drag), so it can be undone, is kept as a draft, and redraws the right layers. Look features up by id inside the edit; after an undo the map is a new object.
- **Anything from outside goes through `PrimordiumMap.shaped()`** (the data file, the draft, an opened file, pasted changes), and text is escaped when drawn (`MapDraw.esc`) or added as text nodes (`MapUI.h`).
- **Drawing:** `draw.js` is a stack of layers (`LAYERS`), each naming the lists it reads; a layer is redrawn only when those change. No SVG filters (they redraw slowly while panning). Sizes that should stay readable when zoomed (icons, line widths) use the `--s` variable through `sw()`, `dashed()`, and `at()`; export bakes them in (`ctx.flat`).
- **Colors:** the app around the map uses theme tokens (`../shared/theme.css`), never fixed colors, and is checked in light and dark. The map artwork's own colors are the one exception: they live in `PAL` at the top of `js/draw.js` and nowhere else.
- Laptop first (mouse and keyboard), like the GM tool. Narrow windows stack the panels under the map.
- Run `node tools/test.js` from the repository root after any change.

## Status (2026-11-12)
Built: the renderer, the editor (select, reshape, draw every kind of feature, bend roads, reorder terrain), undo and redo, the feature list with search, layers, checks, measuring, saving into the project folder, opening and downloading the map file, copying and applying changes in the handoff shape, and PNG and SVG export.

Not built yet (the owner sets the order): travel times once a scale is set, regional and local maps linked from the world map, an elevation layer with river-runs-downhill checks, wind and rain-shadow overlays, region tags tied to NPC families, and using the map inside the GM tool and Codex.

## Tool defaults the owner may change (not lore)
- Small towns, minor roads, and labels under size 16 are hidden until zoomed in (`view.js`, `STYLE` in `draw.js`); the Layers tab can turn this off.
- A settlement counts as on land, and a river as reaching water, within 5 map units of the shore (`NEAR` in `map-model.js`), because the drawn coast is roughened and the map was traced by hand.
- The artwork: palette, shallow-water bands, tree and peak shapes, icons (`js/draw.js`).
