"""Run: python -m unittest discover -s codex/tests   (from the repository root)"""
import json
import os
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import parse_guides as pg  # noqa: E402

FIX = os.path.join(ROOT, "tests", "fixtures")


def load(name):
    with open(os.path.join(FIX, name), encoding="utf-8") as f:
        return f.read()


class SkillParser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.skills = {s["id"]: s for s in pg.parse_skills(load("skill_sample.md"))}

    def test_skills_found(self):
        self.assertEqual(set(self.skills), {"sword", "shield", "fire-magic"})

    def test_groups(self):
        self.assertEqual(self.skills["sword"]["group"], "Physical")
        self.assertEqual(self.skills["fire-magic"]["group"], "Mental")

    def test_base_tiers(self):
        sword = self.skills["sword"]
        self.assertEqual([t["tier"] for t in sword["base"]], [0, 1, 2, 3, 4])
        basic = sword["base"][0]["entries"][0]
        self.assertEqual(basic["name"], "Basic Sword Attack")
        self.assertEqual(basic["rarity"], "Basic")
        self.assertEqual(basic["usage"], "Strike twice with D6.")

    def test_paths(self):
        sword = self.skills["sword"]
        self.assertEqual([p["name"] for p in sword["paths"]], ["Duelist", "Soldier"])
        self.assertEqual(len(sword["paths"][0]["tiers"]), 4)
        fire = self.skills["fire-magic"]
        self.assertEqual([p["name"] for p in fire["paths"]], ["Anarchist", "Incineration Mage"])

    def test_perk_has_no_rarity(self):
        perks = [e for t in self.skills["sword"]["base"] for e in t["entries"] if e["kind"] == "perk"]
        self.assertTrue(perks)
        self.assertTrue(all("rarity" not in p for p in perks))

    def test_curly_apostrophe(self):
        names = [e["name"] for p in self.skills["sword"]["paths"] for t in p["tiers"] for e in t["entries"]]
        self.assertIn("Dahn's Challenge", names)


class NpcParser(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.npcs = {n["id"]: n for n in pg.parse_npcs(load("npc_sample.md"))}

    def test_skips_how_to_read(self):
        self.assertNotIn("stat-block", self.npcs)

    def test_wolf_escaped_table(self):
        w = self.npcs["wolf"]
        self.assertEqual(w["stats"], {"STR": 0, "AGI": 2, "KNO": -5, "SPD": 5, "PER": 3, "SPE": -5})
        self.assertEqual(w["hp"], 11)
        self.assertEqual(w["xp"], 7)  # halves round up (2026-10-17)
        self.assertEqual(w["family"], "Wolves")
        self.assertTrue(w["familyFlavor"].startswith("Wolves are"))

    def test_variant_flavor(self):
        self.assertEqual(self.npcs["ice-wolf"]["flavor"], "White or light grey")

    def test_cooldown(self):
        roar = self.npcs["shattered-bear"]["abilities"][-1]
        self.assertEqual(roar["rarity"], "Rare")
        self.assertEqual(roar["cooldown"], "1 phase")

    def test_humanoid_skill(self):
        g = self.npcs["town-guard"]
        self.assertTrue(g["skill"].startswith("Spear or Sword"))
        self.assertEqual(g["abilities"], [])

    def test_boss(self):
        self.assertEqual(self.npcs["keeper-of-steel"]["role"], "Boss")
        self.assertEqual(self.npcs["keeper-of-steel"]["tactics"], "Excellent")


class CheckAgainstShared(unittest.TestCase):
    """The sample guide text agrees with the repository's shared data, and a change is reported."""

    def test_skills_agree(self):
        self.assertEqual(pg.check_skills(pg.parse_skills(load("skill_sample.md"))), [])

    def test_npcs_agree(self):
        self.assertEqual(pg.check_npcs(pg.parse_npcs(load("npc_sample.md"))), [])

    def test_changed_text_reported(self):
        npcs = pg.parse_npcs(load("npc_sample.md"))
        wolf = next(n for n in npcs if n["id"] == "wolf")
        wolf["abilities"][0]["text"] = "1 Strike D12."
        diffs = pg.check_npcs(npcs)
        self.assertEqual(len(diffs), 1)
        self.assertIn("Wolf / Bite", diffs[0])


if __name__ == "__main__":
    unittest.main()
