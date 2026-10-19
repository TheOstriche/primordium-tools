# Primordium GM

The GM's combat companion for Primordium 2.0.

## Opening the app

Double-click `index.html`. It opens in your browser and works offline. Chrome or Edge is recommended, because only they can save to a file in a folder (see the Save tab).

Use the same browser each time: your players and encounters are saved inside that browser. Make a backup from the Save tab at the end of each session.

## Adding players from the character sheet

On the player's phone (or yours), open the character sheet app and use **⋯ → Export all characters**. Get that file to the laptop, then on the Encounter tab choose **Import character sheets** and pick it. Tick the characters to add; anyone imported before is updated instead of added twice.

## Shops

On the Shops tab, **New shop** makes a shop and fills it from its kind (Blacksmith, Armorer, Alchemist, …) and the party's level. Change the name, kind, level, or prices (a percent up or down), then **Auto-fill** again, or add items yourself: **Gear** (pick the item, tier, and material), **Consumable**, **Other**, or **Custom** for anything not in the guides (your own name, price, and notes). Change quantities and prices in the stock list, or remove items. **Buying from players** works out what the merchant pays (half, more with Haggler).

**Show QR code** puts the shop on a QR code. Players scan it with their phone camera; the shop opens in their character sheet, and what they buy comes off their marks and goes into their pack. Make a new code after changing the stock. When the GM tool is opened from a file, the code points at the published sheet (`https://theostriche.github.io/primordium-tools/sheet/`).

## For later edits

- After changing `data/scaling.json`, `docs/rules.md`, or `docs/scaling.md`, run `node tools/build-data.js` so the app picks up the changes.
- `node tools/test-rules.js` checks the game math against the worked examples in `docs/scaling.md`.
- `node tools/test-combat.js` checks the combat rules (initiative, damage, stacks, death clocks, cooldowns) with fixed dice.
- From the top folder, `node tools/test.js` runs every test in the repository (these two included), and `node tools/serve.js` serves all the apps at http://localhost:8080 (GM tool at `/gm/`; optional, used for testing).
- Light or dark: the tool follows your computer's setting; the round button in the top bar switches it.
