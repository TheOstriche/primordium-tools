# World map: the owner's notes

What the map is for, how faithful the current version is, the names it uses, and the world decisions still open.
These come from the owner through the Claude project and are kept here word for word; `node tools/export-handoffs.js`
copies this file into `exports/handoff/map.md`. Change it only when the owner (or a handoff answer) says so.

## What the owner wants

An app built around one job: **building out and improving the Primordium world map at high detail and scale**. The current map is a faithful redraw of the owner's 2022 map. It is the starting point, not the final world. The owner plans to make the map more detailed, better defined and more realistic, and either remove or explain in the lore the parts of the landscape that couldn't really exist.

Decisions about what the world *is* (lore, names, what explains each strange landform) are made in the Claude project and arrive here as handoff answers. The app's job is to make those changes fast to apply and the map rich to look at.

## How faithful map-0.1 is

- **Traced from the image (accurate):** all coastlines and islands.
- **Hand-placed against the original (close):** terrain areas, ranges, rivers, lakes, labels and settlement positions. Which castles are "capitals" and which are "cities" is a reading of the original's icons, not a canon decision.
- **Approximate:** borders, which follow the original's dotted lines only roughly, and roads, which were rebuilt between nearby settlements because the original's road web wasn't traced.
- **Placeholder:** scale.
- **Corrected when the map was brought into the repository (2026-11-12):** two features broke the map's own rules and were moved the shortest distance that fixes them. Port `port-11` sat 12 map units out to sea and was moved onto the nearest shore (1372, 935 to 1360.4, 941.3). River `drune-south` stopped 20 units short of the coast and was given one more point at the nearest shore (439.9, 868.2). Nothing else was changed.

## Names the data uses (from the owner's map; keep them spelled exactly)

Aurau Imperian, Trinimar, The Dwarven Plains, The Frostlands, Etriun, Isles of Drune, Southern Dunes, Scar of Primordium, The Obsidian Coast, Cracked Mesa, Vira's Belt, Kato's Peaks, Vidriun Forest, Lyra's Well, Ashlands. Open lore note: the map says "Aurau Imperian" but the guides say "The Imperial Expanse". Don't rename either until the owner decides.

## Open world decisions (made in the Claude project, not here)

1. Lyra's Well has rivers flowing out in every direction. It will become either a magical source or a basin that rivers flow into.
2. Rivers cross Kato's Peaks and run into the Ashlands crater.
3. The Southern Dunes sit next to green Etriun.
4. The Frostlands meet the plains at a thin ridge.
5. The Scar, the Obsidian Coast and the Cracked Mesa should be tied together as one event.
6. Vidriun Forest has hard edges.
7. The "Isles" of Drune are mostly mainland.
8. Coastlines need fjords, deltas and bays.
9. Roads cross the Scar and the mountains without passes.
10. The map needs a scale.

Until the owner decides these, keep the map as it is. Build the tools that will make the fixes easy.
