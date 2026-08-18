// XP and leveling — pure functions, no I/O. Kept dependency-free so they're
// trivial to unit test and safe to call from both server actions and
// (eventually) client-side optimistic-update code.

// Uniform across all 7 skills in v1 — see project brief. Both constants are
// intentionally the single tunable knobs for pacing; nothing else should
// hardcode a rate or a curve shape.
//
// Tuned so level 10 is reachable in a handful of real sessions, level ~40
// takes roughly a year of sustained, several-times-a-week logging, and level
// 50 is a true long-term "mastery" grind — mirroring Skyrim's own curve,
// where early levels come quickly and the last stretch takes far longer.
export const BASE_XP_RATE_PER_MINUTE = 10;
export const CURVE_SCALE = 10;

const FULL_RATE_MINUTES = 30;
const HALF_RATE_MINUTES = 30; // minutes 30-60
// everything beyond 60 minutes earns at quarter rate

/**
 * XP earned for a single logged session, applying diminishing returns:
 * the first 30 minutes at the full base rate, the next 30 at half rate,
 * and anything beyond 60 minutes at quarter rate.
 */
export function calculateXpAwarded(durationMinutes: number): number {
  if (durationMinutes <= 0) return 0;

  const fullMinutes = Math.min(durationMinutes, FULL_RATE_MINUTES);
  const halfMinutes = Math.min(
    Math.max(durationMinutes - FULL_RATE_MINUTES, 0),
    HALF_RATE_MINUTES,
  );
  const quarterMinutes = Math.max(durationMinutes - FULL_RATE_MINUTES - HALF_RATE_MINUTES, 0);

  const xp =
    fullMinutes * BASE_XP_RATE_PER_MINUTE +
    halfMinutes * BASE_XP_RATE_PER_MINUTE * 0.5 +
    quarterMinutes * BASE_XP_RATE_PER_MINUTE * 0.25;

  return Math.round(xp);
}

/**
 * XP required to go from `level` to `level + 1`, following a Skyrim-style
 * quadratic curve.
 */
export function xpToNextLevel(level: number): number {
  return Math.round((0.75 * level + 0.25 * level * level) * CURVE_SCALE);
}

export type LevelState = {
  level: number;
  xp: number;
};

export type LevelUpResult = LevelState & {
  levelsGained: number;
  leveledUp: boolean;
};

/**
 * Applies awarded XP to a skill's current level/XP, rolling over as many
 * level-ups as the XP covers (a single long session can cross more than
 * one level).
 */
export function applyXpToSkill(current: LevelState, xpAwarded: number): LevelUpResult {
  let level = current.level;
  let xp = current.xp + xpAwarded;
  let levelsGained = 0;

  let threshold = xpToNextLevel(level);
  while (xp >= threshold) {
    xp -= threshold;
    level += 1;
    levelsGained += 1;
    threshold = xpToNextLevel(level);
  }

  return { level, xp, levelsGained, leveledUp: levelsGained > 0 };
}

export type PerkLike = {
  unlock_level: number;
};

/**
 * Perks whose unlock_level falls strictly after `fromLevel` and at or
 * before `toLevel` — i.e. the perks a level-up from fromLevel to toLevel
 * just unlocked.
 */
export function unlockedPerksInRange<T extends PerkLike>(
  perks: T[],
  fromLevel: number,
  toLevel: number,
): T[] {
  return perks.filter((perk) => perk.unlock_level > fromLevel && perk.unlock_level <= toLevel);
}

// ---------------------------------------------------------------------------
// Character (aggregate) level
// ---------------------------------------------------------------------------

export type TitleTier = {
  minLevel: number;
  title: string;
};

// Ordered highest-first so the first match wins.
export const TITLE_TIERS: TitleTier[] = [
  { minLevel: 40, title: "Legend" },
  { minLevel: 30, title: "Champion" },
  { minLevel: 20, title: "Veteran" },
  { minLevel: 10, title: "Wanderer" },
  { minLevel: 1, title: "Adventurer" },
];

/**
 * Overall character level: the floor of the average of all 7 skill levels.
 */
export function calculateCharacterLevel(skillLevels: number[]): number {
  if (skillLevels.length === 0) return 1;
  const average = skillLevels.reduce((sum, level) => sum + level, 0) / skillLevels.length;
  return Math.max(1, Math.floor(average));
}

export function titleForCharacterLevel(level: number): string {
  const tier = TITLE_TIERS.find((t) => level >= t.minLevel);
  return tier?.title ?? "Adventurer";
}
