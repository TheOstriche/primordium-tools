# Primordium World Map

A laptop app for looking at the world map of Primordium and building it out. It is part of the `primordium-tools` repository and is published with it at `https://theostriche.github.io/primordium-tools/map/`.

## Opening it

Double-click `map/index.html`, or use the **World Map** card on the front page. Use **Chrome or Edge**: they are the browsers that can save straight into the project folder.

## Looking around

The map fills the window, and it opens ready for looking, so nothing can be moved by accident.

- **Scroll** (or double-click, or pinch on a phone) to zoom. **Drag** to move the map.
- The closer you look, the more you see: small towns, minor roads, and small labels appear, the ground gains texture and marks, and the big realm names fade out of the way.
- **Search** (top left, or press /): type a name, id, type, or a word from a feature's notes, then pick a result to go there.
- **Point** at anything to see its name. **Click** it for a card with its notes. If something else is on top, click the same spot again.
- **Measure** (or the M key): click along a route to see how long it is. It shows map units until you set a scale. The bar at the bottom left shows distance at the current zoom.
- **Browse** opens a panel with every feature (**Features**), what the map shows (**Layers**), and the map's problems (**Checks**).
- **More → Copy a link to this view** gives a link that opens the map at the same spot and zoom. Good for pointing players at a place.

## Changing the map

Press **Edit** (top right). It turns to **Editing**, and Add, Undo, Redo, and Save appear. Press it again to go back to looking.

- **Click** a feature to select it. Its details open on the right, where you can change its name, type, notes, and more.
- **Drag the round handles** to reshape a coast, area, river, range, or border. The small handles halfway along each edge add a point when you drag them.
- **Alt+click** or right-click a handle to remove that point. **Shift+click** the map to add a point to the selected shape.
- **Ctrl+drag** a selected shape to move all of it. Drag a selected settlement or label to move it; the arrow keys nudge it.
- **Add** draws something new: click the points, then press **Enter** (or double-click) to finish. **Esc** cancels.
- A road joins two settlements. Select it and drag its halfway handle to bend it, for example through a mountain pass.
- **Paths** are side tracks (Add → Path): click along the route, starting on a road or a settlement. They can end anywhere. They and the villages show once you zoom in.
- **Villages** are settlements of type **village**. The ones on the map were scattered automatically and have no names: name, move or delete them freely.
- **Bridges** draw themselves wherever a road crosses a river, and a river that reaches the sea opens into a mouth by itself.
- **Re-laying roads:** after moving towns, rivers or mountains, run `node tools/route-roads.js` in the Primordium Tools folder (or ask Claude to). It lays every road and path over the ground again by the road rules: round water and mountains, merging where they head the same way, with paths joining the nearest road. It replaces any bends you made by hand, and running it twice gives the same result as once. Adding `--prune` also removes minor roads that only follow other roads.
- **Borders** follow one rule: a border is a closed loop, or it runs until each end reaches the sea or another border. Drag an end onto the coast or onto another border; the Checks tab tells you if one is left loose.
- **Hills:** add a terrain area of type **hills** wherever the country should roll. Woods, hills, fields round towns, lone trees, and ships off ports all draw themselves.
- **Beaches:** select a terrain area and set **Only near the shore** to a distance, and it shows only that close to the sea, fading into the ground beneath it inland. Drune's sand works this way.
- **Terrain areas** blend into whatever is next to them, so their outlines only need to be roughly right. Later areas in the list paint over earlier ones (**Bring forward** / **Send back**). Types you can choose include hills, scrub, savanna, farmland, marsh, jungle, badlands, and snow as well as the ones the map uses now.
- **More → Map details and scale** sets the map's name, version, and **scale**.
- **Ctrl+Z** undoes, **Ctrl+Y** redoes, **Delete** removes the selection.
- The **Checks** tab (in Browse) lists problems (a settlement in the sea, a river that ends on dry land, a road to nowhere, a river running through the sea, a path that starts nowhere, a border with a loose end). Click one to go to it.

## Saving

Your changes are kept in the browser as you work, so a reload does not lose them. To put them into the project:

1. Press **Save** (or Ctrl+S).
2. The first time, choose the **map** folder inside **shared** in your Primordium Tools folder, and allow the browser to edit it.
3. The app writes two files there: `primordium-map.json` (the map) and `map-data.js` (the same map, packaged so the app can open from a file).
4. Commit and push with GitHub Desktop, as with any other change.

After that first time, Save just saves. If the file in the folder has changed since you opened the page (for example a newer map arrived), Save asks which one to keep.

## Working with the Claude project

- **To tell Claude what you changed:** **More → Copy changes for the Claude project** copies only what is different. Or run `node tools/export-handoffs.js` and give it the new `exports/handoff/map.md`, which holds the whole map.
- **To bring Claude's changes in:** **More → Apply changes from the Claude project**, paste, and press Apply. Look at the result, then Save. Undo takes it back.

## Pictures

**More → Export a picture** makes a PNG (up to print size) or an SVG of the whole map. A PNG also works as the map image under the GM tool's grid.

## If something looks wrong

- "The map data could not be read": run `node tools/build-map.js` in the Primordium Tools folder. It rebuilds `map-data.js` from `primordium-map.json` and lists any problems.
- Run `node tools/test.js` to check the map and everything else.
