# Primordium Codex

A phone-first rules reference for Primordium 2.0: search, skills, the bestiary, rules and tables, a dice tray, and a tactical deck simulator. It installs to the home screen and works offline, like the character sheet.

Live at `https://theostriche.github.io/primordium-tools/codex/`.

## Where the data comes from

| File | What it holds |
|---|---|
| `../shared/primordium-data.js` | Every skill (all tiers, paths, abilities, perks), race stats and specials, background traits. Shared with the sheet and the GM tool. |
| `../shared/npc-data.js` | All creatures. Shared with the GM tool. |
| `codex-data.js` | What only the Codex shows: rules sections, tables (tactics, deck, wealth, materials, consumables, enchantments, sizes, XP roles), race lore (country, deity, appearance), skill summaries and A/S/K stat, creature family groups and descriptions. Hand-transcribed from Game Guide 2.0 and NPC Guide 2.0. |

`app.js` reshapes the shared data for the Codex when the page loads. There is no build step: edit a data file, refresh, done.

Creature families that are not yet in `codex-data.js` → `creatureFamilies` (Boars, Insectoids, Slimes, Mimics, Eldren, Oglenesh, Military, Citizens) show only the family name. Add their group and description from the NPC Guide to fill them in.

## Publishing changes

When you change any file here or anything in `../shared/` that the Codex loads, raise `VERSION` in `sw.js` (for example `codex-v1` to `codex-v2`) so installed phones fetch the new copy.

## Checking a new guide export

The parser reads the Skill Guide and NPC Guide exported from Google Docs (File > Download > Markdown) and lists anything that differs from the shared data. From the repository root:

```
python codex/tools/parse_guides.py check-skills Primordium_Skill_Guide_2_0.md
python codex/tools/parse_guides.py check-npcs Primordium_NPC_Guide_2_0.md
python -m unittest discover -s codex/tests
```

## Files

- `index.html`, `style.css`, `app.js`: the app (design approved; colors are tokens at the top of `style.css`)
- `codex-data.js`: Codex-only rules data (see above)
- `sw.js`: offline support; `manifest.webmanifest` and `icons/`: home screen install
- `tools/parse_guides.py`, `tests/`: guide parser and its tests

Per-phone state (last tab, tactics level, roll history, deck) is kept in `localStorage` under `codex:*` keys and is safe to clear.

## Later (agreed, not started)

These show on the Codex home screen as "Sealed tomes".

- **Tactics skill in the deck simulator:** pick a player's Tactics level and path (Gambler, Strategist, Commander) and adjust card assignment and riders to match.
- **Encounter roll:** a D10 decides the encounter. Details still to come from the GM.
- **Tongue-Forge:** names and words for each race's language (racial language names still to be written).
- **Quick-Spawn:** one-tap NPCs built on the NPC Guide's stat budget.
