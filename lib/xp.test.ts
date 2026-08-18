import { describe, expect, it } from "vitest";
import {
  applyXpToSkill,
  calculateCharacterLevel,
  calculateXpAwarded,
  titleForCharacterLevel,
  unlockedPerksInRange,
  xpToNextLevel,
} from "./xp";

describe("calculateXpAwarded", () => {
  it("returns 0 for zero or negative duration", () => {
    expect(calculateXpAwarded(0)).toBe(0);
    expect(calculateXpAwarded(-5)).toBe(0);
  });

  it("earns full rate for the first 30 minutes", () => {
    expect(calculateXpAwarded(10)).toBe(100);
    expect(calculateXpAwarded(30)).toBe(300);
  });

  it("earns half rate for minutes 30-60", () => {
    expect(calculateXpAwarded(31)).toBe(305);
    expect(calculateXpAwarded(45)).toBe(375);
    expect(calculateXpAwarded(60)).toBe(450);
  });

  it("earns quarter rate beyond 60 minutes", () => {
    expect(calculateXpAwarded(61)).toBe(453);
    expect(calculateXpAwarded(90)).toBe(525);
    expect(calculateXpAwarded(120)).toBe(600);
  });
});

describe("xpToNextLevel", () => {
  it("follows the quadratic curve", () => {
    expect(xpToNextLevel(1)).toBe(10);
    expect(xpToNextLevel(2)).toBe(25);
    expect(xpToNextLevel(10)).toBe(325);
    expect(xpToNextLevel(25)).toBe(1750);
    expect(xpToNextLevel(50)).toBe(6625);
  });

  it("grows super-linearly, matching the Skyrim-style pacing", () => {
    const early = xpToNextLevel(2) - xpToNextLevel(1);
    const late = xpToNextLevel(50) - xpToNextLevel(49);
    expect(late).toBeGreaterThan(early * 10);
  });
});

describe("applyXpToSkill", () => {
  it("accumulates XP without leveling up when under the threshold", () => {
    const result = applyXpToSkill({ level: 1, xp: 0 }, 5);
    expect(result).toEqual({ level: 1, xp: 5, levelsGained: 0, leveledUp: false });
  });

  it("levels up exactly at the threshold", () => {
    const result = applyXpToSkill({ level: 1, xp: 0 }, 10);
    expect(result).toEqual({ level: 2, xp: 0, levelsGained: 1, leveledUp: true });
  });

  it("rolls over multiple level-ups from a single large session", () => {
    // thresholds: L1->2 = 10, L2->3 = 25, L3->4 = 45
    const result = applyXpToSkill({ level: 1, xp: 0 }, 40);
    expect(result).toEqual({ level: 3, xp: 5, levelsGained: 2, leveledUp: true });
  });

  it("carries existing partial XP into the calculation", () => {
    // threshold at level 1 is 10; starting with 6 XP + 10 awarded crosses it
    const result = applyXpToSkill({ level: 1, xp: 6 }, 10);
    expect(result.level).toBe(2);
    expect(result.leveledUp).toBe(true);
  });

  it("does nothing for zero XP awarded", () => {
    const result = applyXpToSkill({ level: 5, xp: 12 }, 0);
    expect(result).toEqual({ level: 5, xp: 12, levelsGained: 0, leveledUp: false });
  });
});

describe("unlockedPerksInRange", () => {
  const perks = [{ unlock_level: 10 }, { unlock_level: 25 }, { unlock_level: 50 }];

  it("includes perks whose unlock level falls within the range", () => {
    expect(unlockedPerksInRange(perks, 5, 10)).toEqual([{ unlock_level: 10 }]);
    expect(unlockedPerksInRange(perks, 24, 26)).toEqual([{ unlock_level: 25 }]);
  });

  it("excludes the fromLevel boundary itself", () => {
    expect(unlockedPerksInRange(perks, 10, 10)).toEqual([]);
  });

  it("returns multiple perks when a session crosses more than one milestone", () => {
    expect(unlockedPerksInRange(perks, 1, 50)).toEqual(perks);
  });
});

describe("calculateCharacterLevel", () => {
  it("floors the average of skill levels", () => {
    expect(calculateCharacterLevel([1, 1, 1, 1, 1, 1, 1])).toBe(1);
    expect(calculateCharacterLevel([10, 20, 30, 5, 5, 5, 5])).toBe(11);
  });

  it("defaults to level 1 when there are no skills", () => {
    expect(calculateCharacterLevel([])).toBe(1);
  });
});

describe("titleForCharacterLevel", () => {
  it("maps level ranges to titles", () => {
    expect(titleForCharacterLevel(1)).toBe("Adventurer");
    expect(titleForCharacterLevel(9)).toBe("Adventurer");
    expect(titleForCharacterLevel(10)).toBe("Wanderer");
    expect(titleForCharacterLevel(20)).toBe("Veteran");
    expect(titleForCharacterLevel(30)).toBe("Champion");
    expect(titleForCharacterLevel(40)).toBe("Legend");
    expect(titleForCharacterLevel(100)).toBe("Legend");
  });
});
