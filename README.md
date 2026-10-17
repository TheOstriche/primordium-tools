# Primordium Tools

Three apps for Primordium 2.0 that share one copy of the game's rules and data, and one look (light or dark).

| Folder | What it is | Live link |
|---|---|---|
| `sheet/` | Player character sheet (phone app, works offline) | https://theostriche.github.io/primordium-tools/sheet/ |
| `gm/` | GM combat tool (laptop) | https://theostriche.github.io/primordium-tools/gm/ |
| `codex/` | Rules reference: skills, creatures, rules, dice, and the tactical deck (phone app, works offline) | https://theostriche.github.io/primordium-tools/codex/ |
| `shared/` | What all of them use: rule tables, game data, the deck, dice, effects, and the look | |

The site's front page (`index.html`) links to all three. How everything fits together, file by file, is in `ARCHITECTURE.md`.

## Light and dark

Every app follows your device's light or dark setting. The round button at the top of each app switches between **System**, **Light**, and **Dark**; the choice is remembered and shared by all three apps on that device.

## Changing the game data

- Skills, races, and traits: `shared/primordium-data.js`. Creatures: `shared/npc-data.js`.
- Rule tables (rarities, the D20 tactics table, cooldowns, XP, stacks, movement): `shared/core.js`.
- Codex-only rules text and tables: `codex/codex-data.js`.

Edit once and every app picks it up. Then raise the version in `sheet/sw.js` and `codex/sw.js` (for example `codex-v4` to `codex-v5`) so installed phones download the new data.

To change the data with Claude, run `node tools/export-handoffs.js`. It writes `exports/handoff/`: one file each for creatures, skills, races and traits, the shared rule tables, the Codex's rules text, and the GM tool's rulings and scaling. Each holds the current data, its exact format and rules, and how Claude Code brings a change in. Put those files in your Claude project; paste Claude's answers into Claude Code; then run the export again and refresh the project.

## Opening the apps on this computer

- **GM tool:** double-click `gm/index.html`.
- **All apps the way the website serves them:** run `node tools/serve.js` in this folder, then visit http://localhost:8080.

## Checking everything still works

Run `node tools/test.js`. It checks the shared rule tables, the tactical deck at every Tactics level, the GM tool's game math and combat rules, and (if Python is installed) the Codex's guide parser.

## Publishing

1. Commit and push with GitHub Desktop.
2. One-time setup: on GitHub, open the repository's **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.
3. After about a minute the links above are live.

More details for each app are in `gm/README.md`, `sheet/README.md`, and `codex/README.md`.

## The old player sheet link

The player sheet used to live in its own repository, `Primordium-Player-Sheets`. The files in `tools/old-sheet-redirect/` replace that repository's contents, so old links and phones that installed the app are sent to the new address. Characters carry over because both addresses are on the same site (`theostriche.github.io`).
