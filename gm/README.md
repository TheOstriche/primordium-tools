# Primordium GM

The GM's combat companion for Primordium 2.0.

## Opening the app

Double-click `index.html`. It opens in your browser and works offline. Chrome or Edge is recommended, because only they can save to a file in a folder (see the Save tab).

Use the same browser each time: your players and encounters are saved inside that browser. Make a backup from the Save tab at the end of each session.

## Adding players from the character sheet

On the player's phone (or yours), open the character sheet app and use **⋯ → Export all characters**. Get that file to the laptop, then on the Encounter tab choose **Import character sheets** and pick it. Tick the characters to add; anyone imported before is updated instead of added twice.

## For later edits

- After changing `data/scaling.json`, `docs/rules.md`, or `docs/scaling.md`, run `node tools/build-data.js` so the app picks up the changes.
- `node tools/test-rules.js` checks the game math against the worked examples in `docs/scaling.md`.
- `node tools/test-combat.js` checks the combat rules (initiative, damage, stacks, death clocks, cooldowns) with fixed dice.
- From the top folder, `node tools/test.js` runs every test in the repository (these two included), and `node tools/serve.js` serves all the apps at http://localhost:8080 (GM tool at `/gm/`; optional, used for testing).
- Light or dark: the tool follows your computer's setting; the round button in the top bar switches it.
