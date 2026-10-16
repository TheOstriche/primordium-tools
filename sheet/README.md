# Primordium Character Sheet

A phone app for Primordium 2.0 characters. It runs in the browser, installs to the home screen on iPhone and Android, works offline, and saves characters on the device.

## Where it lives

This app is part of the `primordium-tools` repository and is published with it (see the top-level `README.md`). It is live at `https://theostriche.github.io/primordium-tools/sheet/`.

## Install it on a phone

- **iPhone (Safari):** open the link, tap **Share**, then **Add to Home Screen**.
- **Android (Chrome):** open the link, tap the **⋮** menu, then **Install app** or **Add to Home screen**.

## Using the app

- **Overview:** your character at a glance, with a dice tray (tap dice to build a roll, plus Initiative, Speed, Out of combat, and Contest rolls with your stats). In combat it also runs your tactical deck: your hand of 3, pairs, Re-Evaluate, and every mechanic your Tactics tier and path add. Take a breather, Full rest, and End combat also act on the deck. Flip the switch to **Combat** to track current HP, the death clock, temporary stat changes, and effects (stacks, resources, conditions, and stat effects added with **+ Add**). Use **End combat**, **Take a breather**, or **Full rest** to clear them.
- **Sheet:** name, race, level, base stats and HP, card assignment (updated by Tactics; choose which cards each promotion moves), background traits, resistances, and notes.
- **Inventory:** your pack and equipped items. Equip an item to set it as armor or a weapon, with its material, tier, Condition, and enchantments.
- **Abilities:** every ability and perk your skills grant, plus your own entries.
- **Skills:** raise or lower each skill's tiers. Each change shows what it added or removed.
- **Deleting a character:** tap **Edit** on the character list, or use the button at the bottom of the Sheet tab.

## Saving and backups

Characters are stored on each phone. Use **⋯ → Export all characters** to save a backup file, and **Import a backup** to load it on another device.

## Publishing changes

When you change any file here or `../shared/primordium-data.js`, also raise `VERSION` in `sw.js` (for example `primordium-v2`). That tells installed phones to download the new version instead of using the cached one.

## Files

- `index.html`: the app shell
- `app.js`: screens, rules, and saving
- `data.js`: sheet layout lists (stats, stacks, rarities, gear slots)
- `../shared/primordium-data.js` (shared with the GM tool and the Codex): full Primordium 2.0 data (every skill tier's abilities and perks, races, and traits)
- `../shared/tactics-deck.js` and `../shared/dice.js` (shared with the Codex): the tactical deck and dice rolls
- `../shared/fx.js` (shared with the Codex and the GM tool): impact effects for rolls, cards, HP, combat, and rests. Turn them, sound, or vibration on and off in **⋯ → Effects**.
- `style.css`: the look
- `sw.js`: offline support
- `manifest.webmanifest` and `icons/`: home screen install
