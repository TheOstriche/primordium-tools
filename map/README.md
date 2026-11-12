# Primordium World Map

A laptop app for looking at the world map of Primordium and building it out. It is part of the `primordium-tools` repository and is published with it at `https://theostriche.github.io/primordium-tools/map/`.

## Opening it

Double-click `map/index.html`, or use the **World Map** card on the front page. Use **Chrome or Edge**: they are the browsers that can save straight into the project folder.

## Looking around

- **Scroll** to zoom. **Drag** empty space to move the map (or hold **Space** and drag anywhere).
- Small towns, minor roads, and small labels appear as you zoom in. The **Layers** tab switches each kind of thing on or off.
- **Measure** (or the M key): click along a route to see how long it is. It shows map units until you set a scale.
- The **Features** tab lists everything on the map. Type in the box to find something by name, id, type, or notes; click a row to go to it.

## Changing the map

- **Click** a feature to select it. If something else is on top, click the same spot again to get the one beneath.
- **Drag the round handles** to reshape a coast, area, river, range, or border. The small handles halfway along each edge add a point when you drag them.
- **Alt+click** or right-click a handle to remove that point. **Shift+click** the map to add a point to the selected shape.
- **Ctrl+drag** a selected shape to move all of it. Drag a selected settlement or label to move it; the arrow keys nudge it.
- **Add** draws something new: click the points, then press **Enter** (or double-click) to finish. **Esc** cancels.
- A road joins two settlements. Select it and drag its halfway handle to bend it, for example through a mountain pass.
- The panel on the right holds the selected feature's name, type, notes, and other details. With nothing selected it shows the map's own details, including the **scale**.
- **Ctrl+Z** undoes, **Ctrl+Y** redoes, **Delete** removes the selection.
- The **Checks** tab lists problems (a settlement in the sea, a river that ends on dry land, a road to nowhere). Click one to go to it.

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
