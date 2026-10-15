#!/usr/bin/env python3
"""
Primordium Codex - guide parser.

Reads the Skill Guide and NPC Guide (exported from Google Docs as Markdown,
File > Download > Markdown (.md)). The apps read their game data from ../shared/,
so the main use is checking a fresh export against it:

    python codex/tools/parse_guides.py check-skills  path/to/Primordium_Skill_Guide_2_0.md
    python codex/tools/parse_guides.py check-npcs    path/to/Primordium_NPC_Guide_2_0.md

Each prints what the guide has that shared/primordium-data.js, shared/npc-data.js,
or codex/codex-data.js (creature groups and family notes) is missing or has differently.
"skills" and "npcs" instead of "check-..." print the parsed guide as JSON.

The parser is deliberately forgiving. Google Docs exports wrap labels in
odd runs of asterisks and backslash-escape minus signs, so every line is
normalised (asterisks and escapes stripped) before it is read. Structure
comes only from heading levels and "Label:" prefixes:

  Skill Guide                         NPC Guide
  #   Physical Skills   -> group      #   Beasts            -> group
  ##  Sword             -> skill      ##  Wolves            -> family
  ### Base Tier 1:      -> tier       ### Dire Wolf         -> creature
  Ability / Perk        -> entry      Alignment: ... etc    -> fields
  Name: Type: Rarity: Description: Usage:      | STR | AGI | ... -> stats
                                      Bite (Basic): 1 Strike D10.  -> ability
"""
import json
import os
import re
import sys

STAT_KEYS = ["STR", "AGI", "KNO", "SPD", "PER", "SPE"]
RARITIES = ["Basic", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def normalise(text):
    """Strip Docs-export noise and return clean, non-empty lines."""
    text = text.replace("\r\n", "\n")
    text = text.replace("\\-", "-").replace("\\+", "+").replace("\\*", "")
    text = text.replace("\\", "")
    text = text.replace("*", "")
    text = text.replace("’", "'")
    out = []
    for raw in text.split("\n"):
        line = raw.strip()
        if line:
            out.append(line)
    return out


def heading(line):
    m = re.match(r"^(#{1,6})\s+(.*?)\s*:?\s*$", line)
    if not m:
        return None, None
    return len(m.group(1)), m.group(2).strip()


# ---------------------------------------------------------------- skills

TIER_RE = re.compile(r"^(?:(?P<path>.+?)(?:'s)?\s+Path\s+)?(?P<base>Base\s+)?Tier\s+(?P<n>\d+)$", re.I)
FIELD_RE = re.compile(r"^(Name|Type|Rarity|Description|Usage):\s*(.*)$")


def parse_skills(text):
    lines = normalise(text)
    skills, group, skill, tier, entry = [], None, None, None, None

    def close_entry():
        nonlocal entry
        if entry and tier is not None and entry.get("name"):
            tier["entries"].append(entry)
        entry = None

    for line in lines:
        level, title = heading(line)
        if level == 1:
            close_entry()
            group = title.replace(" Skills", "").strip()
            skill = None
            continue
        if level == 2:
            close_entry()
            skill = {"id": slug(title), "name": title, "group": group,
                     "flavor": "", "base": [], "paths": []}
            skills.append(skill)
            tier = None
            continue
        if level == 3 and skill is not None:
            close_entry()
            m = TIER_RE.match(title)
            if not m:
                tier = None
                continue
            n = int(m.group("n"))
            path = m.group("path")
            tier = {"tier": n, "entries": []}
            if path:
                path = re.sub(r"'s$", "", path.strip())
                p = next((p for p in skill["paths"] if p["name"] == path), None)
                if p is None:
                    p = {"name": path, "tiers": []}
                    skill["paths"].append(p)
                p["tiers"].append(tier)
            else:
                skill["base"].append(tier)
            continue
        if level:
            continue
        if skill is None:
            continue
        if tier is None:
            if not skill["flavor"]:
                skill["flavor"] = line
            continue
        if line in ("Ability", "Perk"):
            close_entry()
            entry = {"kind": line.lower(), "name": ""}
            continue
        m = FIELD_RE.match(line)
        if m and entry is not None:
            entry[m.group(1).lower()] = m.group(2).strip()
            continue
        if entry is not None and "usage" in entry:
            entry["usage"] += " " + line  # wrapped usage text
    close_entry()
    return skills


# ---------------------------------------------------------------- npcs

NPC_FIELDS = ["Alignment", "Size", "Role", "Level", "Tactics", "HP", "Armor", "XP"]
ABIL_RE = re.compile(r"^(?P<name>[^:()]+?)\s*\((?P<meta>[^)]*)\):\s*(?P<text>.*)$")


def parse_npcs(text):
    lines = normalise(text)
    npcs, group, family, family_flavor, cur = [], None, None, "", None
    in_body = False
    expect_stats = False

    for line in lines:
        level, title = heading(line)
        if level == 1:
            group, family, cur = title, None, None
            in_body = group not in ("Primordium NPC Guide", "How to Read NPC Guide")
            continue
        if not in_body:
            continue
        if level == 2:
            family, family_flavor, cur = title, "", None
            continue
        if level == 3:
            cur = {"id": slug(title), "name": title, "group": group, "family": family,
                   "familyFlavor": family_flavor, "flavor": "", "stats": {},
                   "abilities": [], "skill": None, "attributes": ""}
            npcs.append(cur)
            continue
        if level:
            continue
        if cur is None:
            if family and not family_flavor:
                family_flavor = line
            continue
        if line.startswith("|"):
            cells = [c.strip() for c in line.strip("|").split("|")]
            if cells and cells[0] in STAT_KEYS:
                expect_stats = True
            elif expect_stats and all(re.match(r"^-?\d+$", c) for c in cells if c):
                cur["stats"] = dict(zip(STAT_KEYS, [int(c) for c in cells]))
                expect_stats = False
            continue
        field = line.split(":", 1)[0]
        if field in NPC_FIELDS and ":" in line:
            val = line.split(":", 1)[1].strip()
            if field in ("Level", "XP"):
                val = int(re.sub(r"\D", "", val) or 0)
            elif field == "HP":
                val = int(val) if re.match(r"^\d+$", val) else val
            cur[field.lower()] = val
            continue
        if line == "Abilities and Perks":
            continue
        if line.startswith("Attributes:"):
            cur["attributes"] = line.split(":", 1)[1].strip()
            continue
        if line.startswith("Combat skill:"):
            cur["skill"] = line.split(":", 1)[1].strip()
            continue
        m = ABIL_RE.match(line)
        if m:
            meta = m.group("meta")
            rarity = next((r for r in RARITIES if meta.startswith(r)), meta)
            cd = re.search(r"cooldown\s+([^,]+)", meta)
            cur["abilities"].append({"name": m.group("name").strip(), "rarity": rarity,
                                     "cooldown": cd.group(1).strip() if cd else None,
                                     "text": m.group("text").strip()})
            continue
        if not cur["abilities"] and not cur.get("alignment"):
            cur["flavor"] = line  # italic variant line right under the name
    for n in npcs:
        if not n["familyFlavor"]:
            n["familyFlavor"] = next((x["familyFlavor"] for x in npcs
                                      if x["family"] == n["family"] and x["familyFlavor"]), "")
    return npcs


REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def load_js(*parts):
    """Read a generated data file (window.NAME = <JSON>;) from the repository."""
    with open(os.path.join(REPO, *parts), encoding="utf-8") as f:
        text = f.read()
    return json.loads(text[text.index("=", text.index("window.")) + 1:].strip().rstrip(";"))


def same(a, b):
    """Equal apart from curly quotes and spacing, which the Docs export changes freely."""
    def fix(v):
        v = str(v or "").replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
        return re.sub(r"\s+", " ", v).strip()
    return fix(a) == fix(b)


def check_skills(parsed):
    shared = {slug(s["name"]): s for s in load_js("shared", "primordium-data.js")["skills"]}
    out = []
    for sk in parsed:
        sh = shared.get(sk["id"])
        if not sh:
            out.append(f"{sk['name']}: not in shared/primordium-data.js")
            continue
        lists = [("Base", sk["base"], sh["base"])] + [
            (p["name"], p["tiers"], sh["paths"].get(p["name"])) for p in sk["paths"]]
        for label, tiers, sh_tiers in lists:
            if sh_tiers is None:
                out.append(f"{sk['name']} / {label}: path not in shared data")
                continue
            for t in tiers:
                have = sh_tiers.get(str(t["tier"]), [])
                for e in t["entries"]:
                    h = next((x for x in have if same(x["name"], e["name"])), None)
                    where = f"{sk['name']} / {label} tier {t['tier']} / {e['name']}"
                    if not h:
                        out.append(f"{where}: not in shared data")
                        continue
                    for key, sh_key in (("type", "type"), ("rarity", "rarity"), ("description", "desc"), ("usage", "usage")):
                        if not same(e.get(key), h.get(sh_key)):
                            out.append(f"{where} {key}:\n    guide:  {e.get(key)}\n    shared: {h.get(sh_key)}")
    return out


def check_npcs(parsed):
    shared = {n["name"]: n for n in load_js("shared", "npc-data.js")}
    families = load_js("codex", "codex-data.js")["creatureFamilies"]
    out = []
    for n in parsed:
        if n["family"] not in families:
            out.append(f"Family {n['family']}: not in codex/codex-data.js creatureFamilies "
                       f"(guide group {n['group']!r}, flavor {n['familyFlavor']!r})")
            families[n["family"]] = {}
        sh = shared.get(n["name"])
        if not sh:
            out.append(f"{n['name']}: not in shared/npc-data.js")
            continue
        for key in ("family", "role", "level", "tactics", "xp", "size", "alignment"):
            if not same(n.get(key), sh.get(key)):
                out.append(f"{n['name']} {key}: guide {n.get(key)!r}, shared {sh.get(key)!r}")
        if isinstance(n["hp"], int) and n["hp"] != sh.get("hp"):
            out.append(f"{n['name']} hp: guide {n['hp']}, shared {sh.get('hp')}")
        if n["stats"] != sh.get("stats"):
            out.append(f"{n['name']} stats: guide {n['stats']}, shared {sh.get('stats')}")
        have = {a["name"]: a for a in sh.get("abilities") or []}
        for a in n["abilities"]:
            h = have.get(a["name"])
            if not h:
                out.append(f"{n['name']} / {a['name']}: not in shared data")
            elif not same(a["text"], h["text"]) or a["rarity"] != h["rarity"]:
                out.append(f"{n['name']} / {a['name']}:\n    guide:  {a['rarity']} {a['text']}\n    shared: {h['rarity']} {h['text']}")
    return out


def main():
    modes = ("skills", "npcs", "check-skills", "check-npcs")
    if len(sys.argv) != 3 or sys.argv[1] not in modes:
        print(__doc__)
        sys.exit(1)
    with open(sys.argv[2], encoding="utf-8") as f:
        text = f.read()
    data = parse_skills(text) if sys.argv[1].endswith("skills") else parse_npcs(text)
    sys.stdout.reconfigure(encoding="utf-8")
    if sys.argv[1].startswith("check"):
        diffs = check_skills(data) if sys.argv[1] == "check-skills" else check_npcs(data)
        print("\n".join(diffs) if diffs else f"No differences ({len(data)} parsed).")
        sys.exit(1 if diffs else 0)
    json.dump(data, sys.stdout, indent=1, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
