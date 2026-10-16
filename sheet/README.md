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

When you change any file here or anything it loads from `../shared/`, raise the version in `sw.js` (for example `primordium-v11` to `primordium-v12`) and keep its file list matching what `index.html` loads. That tells installed phones to download the new version instead of using the cached one.

## Files

- `index.html`: the app shell; it loads the shared files, then the sheet's own scripts in this order:
  - `data.js`: lists only the sheet uses (resources, conditions, materials, weapons, armor slots)
  - `js/store.js`: saving, new characters, upgrading characters saved by older versions, and what is on screen
  - `js/rules.js`: totals (stats, HP, armor, carrying, warnings), stacks, and the deck
  - `js/ui.js`: toasts, form fields, the dice tray log, impact effects on HP
  - `js/views.js`: the character list and the five tabs
  - `js/sheets.js`: bottom sheets (add an effect, equip or edit an item)
  - `js/app.js`: actions, every tap (the `TAPS` table), forms, and the ⋯ menu
- `../shared/core.js` (shared with every app): rarities, stats, stacks and recovery, XP, movement
- `../shared/primordium-data.js` and `../shared/character-rules.js` (shared with the GM tool and the Codex): every skill, race, and trait, and how they add up
- `../shared/tactics-deck.js` and `../shared/dice.js` (shared with the Codex): the tactical deck and dice rolls
- `../shared/fx.js` (shared with the Codex and the GM tool): impact effects for rolls, cards, HP, combat, and rests. Turn them, sound, or vibration on and off in **⋯ → Effects**.
- `style.css`: the sheet's layout. Colors, fonts, buttons, the dice tray, and the deck come from `../shared/theme.css`; light or dark follows the device, or the round button at the top.
- `sw.js`: offline support
- `manifest.webmanifest` and `icons/`: home screen install
