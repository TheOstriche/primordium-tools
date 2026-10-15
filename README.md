# Primordium Tools

Three apps for Primordium 2.0 that share one copy of the game data.

| Folder | What it is | Live link |
|---|---|---|
| `sheet/` | Player character sheet (phone app, works offline) | https://theostriche.github.io/primordium-tools/sheet/ |
| `gm/` | GM combat tool (laptop) | https://theostriche.github.io/primordium-tools/gm/ |
| `codex/` | Rules reference: skills, creatures, rules, dice, and the tactical deck (phone app, works offline) | https://theostriche.github.io/primordium-tools/codex/ |
| `shared/` | `primordium-data.js` (every skill, race, and trait), `npc-data.js` (every creature), and `character-rules.js` (how a sheet's stats, HP, and armor add up), used by the apps | |

The site's front page (`index.html`) links to all three apps.

## Changing the game data

Edit `shared/primordium-data.js` (skills, races, traits) or `shared/npc-data.js` (creatures) once and every app picks it up. Then raise `VERSION` in `sheet/sw.js` (for example `primordium-v8` to `primordium-v9`) and in `codex/sw.js` (for example `codex-v1` to `codex-v2`) so installed phones download the new data.

## Opening the apps on this computer

- **GM tool:** double-click `gm/index.html`.
- **All apps the way the website serves them:** run `node tools/serve.js` in this folder, then visit http://localhost:8080.

## Publishing

1. Commit and push with GitHub Desktop.
2. One-time setup: on GitHub, open the repository's **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.
3. After about a minute the links above are live.

More details for each app are in `gm/README.md`, `sheet/README.md`, and `codex/README.md`.

## The old player sheet link

The player sheet used to live in its own repository, `Primordium-Player-Sheets`. The files in `tools/old-sheet-redirect/` replace that repository's contents, so old links and phones that installed the app are sent to the new address. Characters carry over because both addresses are on the same site (`theostriche.github.io`).
