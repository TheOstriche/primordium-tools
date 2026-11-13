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
- **Scale (2026-11-13, the owner's decision):** 1 map unit is 1 mile. The mainland is about 1,170 miles wide and 820 tall.
- **Corrected when the map was brought into the repository (2026-11-12):** two features broke the map's own rules and were moved the shortest distance that fixes them. Port `port-11` sat 12 map units out to sea and was moved onto the nearest shore (1372, 935 to 1360.4, 941.3). River `drune-south` stopped 20 units short of the coast and was given one more point at the nearest shore (439.9, 868.2). Nothing else was changed.
- **Borders made consistent (2026-11-12, the owner's request):** a border now either closes on itself or runs until each end reaches the sea or another border, so every territory is fully outlined by borders and coast. To get there: a new closed border, `scar-line`, runs just outside the Scar (four borders used to stop dead at its edge, leaving it unclaimed and unoutlined), and ten loose ends were moved the short distance (1 to 17 map units) to the border or shore they were heading for. The Scar, the Obsidian Coast and the Cracked Mesa are not divided from each other by any border.
- **Hills added (2026-11-12):** the owner said Trinimar and Aurau Imperian have hills now and then. Seven small `hills` areas were placed to show it: `hills-trinimar-1` to `-4` and `hills-aurau-1` to `-3`. Their exact places and shapes are a first guess and are easy to move.
- **Rivers rerouted (2026-11-12 and 13, the owner's request for realistic rivers):** the owner says Lyra's Well is a large spring. It is now a smaller spring-fed lake (about 29 by 16 miles; it was 64 by 35) with one feeder from Vira's Belt (`glacier-run`) and one outlet, the river west to the sea (`well-west`). Which river leaves the Well was the app-side's choice and is easy to change. The other rivers now rise in their own high ground: `north-run` on the spur above the Obsidian Coast, `dwarf-run` on Vira's Belt, `ash-run` in the Trinimar hills, `vidriun-run` between the two arms of Kato's Peaks, `drune-run` and `drune-south` on the west side of Kato's Peaks. No river crosses a range or splits in two. Small tributaries were added: `glacier-west`, `aurau-south`, `ash-east`, `vidriun-west`, and `mere-feed` (into the Etriun lake). Old ids that are gone: `well-north`, `well-drune`, `well-vidriun`, `well-ash`, `mere-run`. The capital on the Well and its port moved a few miles to stay on the smaller lake's shore.
- **Volcano gap (the owner's request):** the Ashlands ring (`ash-ring`) is open on its north side, and `ash-run` flows through the gap into the crater lake.
- **Roads rerouted (the owner's request for realistic pathways):** every road was laid over the ground, round the sea, lakes and ranges, away from the Scar, with few river crossings. 13 minor roads that only duplicated a journey were dropped (104 to 91) and the rest renumbered.
- **Paths and villages added (the owner's request):** a new list, `paths`, holds side tracks; 170 unnamed settlements of the new type `village` were placed, thick along rivers and roads on good ground and rare in the wastes, with tracks joining the ones that are off a road. Their places are generated first guesses, not canon; the owner names, moves or deletes them.
- **Water check and additions (2026-11-13, the owner's request):** every river was checked: none runs through the sea, crosses a range or another river, and no lake has two outlets. Three were cut back to where they first meet the coast (`north-run`, `dwarf-run`, and the new `frost-run`), and `etriun-run` now goes east from the Etriun lake to the nearest shore (it had been running north along the coast, in the sea). Lyra's Well has an uneven shore instead of an oval. Water added as first guesses, all easy to delete: `aurau-north` (from the Aurau hills to the coast by the capital), `frost-run` (meltwater north off Vira's Belt), `kato-tarn` (a small lake where `vidriun-run` rises), `dunes-oasis` (a spring-fed pool in the Southern Dunes), and `marsh-west-mouth` (a marsh where the great river meets the sea).
- **Road rules (2026-11-13, the owner's request):** roads now merge, fork and cross by fixed rules, written at the top of `tools/route-roads.js`, and paths are offshoots that join the nearest road or path.
- **Drune is not all sand (2026-11-13, the owner's decision):** Drune has sandy beaches, not sand throughout. The old sand area (`drune-sands`) now shows only within 22 miles of the sea (its new `shore` value), over a new area of dry scrub, `drune-scrub`, with the same outline. Which ground lies inland (scrub) was the app-side's choice.
- **Roughening run (the owner's request):** borders, terrain outlines and ridge lines were all given small seeded irregularities (a few miles) so nothing is ruler-straight; border ends were put back onto the border or shore they meet. Coastlines and settlements were not moved.
- **Small water (the owner's request for more small lakes and rivers, especially mountain runoff):** 25 runoff streams down the flanks of Vira's Belt, its northern spur and Kato's Peaks, 6 of them rising in tarns; 16 ponds and small lakes on open ground, forest and ice, 10 with a stream running out. Each stream takes the easiest way to the nearest water. Ids `stream-N`, `tarn-N`, `pond-N`; all unnamed first guesses. The map now has 51 rivers and 28 lakes (it had 16 and 6).
- **Noticed in the logic run, left alone:** `vira-hold`, `town-21` and `town-34` stand inside Vira's Belt (as on the original map), and the label "The Obsidian Coast" is centred just off the land.

## Names the data uses (from the owner's map; keep them spelled exactly)

Aurau Imperian, Trinimar, The Dwarven Plains, The Frostlands, Etriun, Isles of Drune, Southern Dunes, Scar of Primordium, The Obsidian Coast, Cracked Mesa, Vira's Belt, Kato's Peaks, Vidriun Forest, Lyra's Well, Ashlands. Open lore note: the map says "Aurau Imperian" but the guides say "The Imperial Expanse". Don't rename either until the owner decides.

## Open world decisions (made in the Claude project, not here)

1. Decided 2026-11-12: Lyra's Well is a large spring with one outlet (see above). Why the spring is there is still open lore.
2. Fixed: no river crosses Kato's Peaks. The river into the Ashlands crater stays, by the owner's wish, through a gap in the volcanoes.  Where the crater's water goes is open.
3. The Southern Dunes sit next to green Etriun.
4. The Frostlands meet the plains at a thin ridge.
5. The Scar, the Obsidian Coast and the Cracked Mesa should be tied together as one event.
6. Vidriun Forest has hard edges.
7. The "Isles" of Drune are mostly mainland. (Its ground is settled: scrub with sandy shores.)
8. Coastlines need fjords, deltas and bays.
9. Fixed: roads go round the Scar and the ranges.
10. Decided: 1 map unit is 1 mile.

Until the owner decides the ones still open, keep those parts of the map as they are. Build the tools that will make the fixes easy.
