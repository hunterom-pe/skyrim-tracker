"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { applyXpToSkill, calculateXpAwarded, unlockedPerksInRange } from "@/lib/xp";
import type { Perk } from "@/lib/supabase/types";

export type LogSessionState =
  | { status: "idle" }
  | { status: "error"; error: string }
  | {
      status: "success";
      eventId: string;
      skillId: string;
      skillName: string;
      xpAwarded: number;
      previousLevel: number;
      newLevel: number;
      levelsGained: number;
      unlockedPerks: Perk[];
    };

export async function logSession(
  _prevState: LogSessionState,
  formData: FormData,
): Promise<LogSessionState> {
  const skillId = String(formData.get("skillId") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes"));
  const note = String(formData.get("note") ?? "").trim();

  if (!skillId) {
    return { status: "error", error: "Choose a skill." };
  }
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return { status: "error", error: "Duration must be a positive number of minutes." };
  }

  const supabase = createClient();

  const { data: skill, error: skillError } = await supabase
    .from("skills")
    .select("*")
    .eq("id", skillId)
    .single();

  if (skillError || !skill) {
    return { status: "error", error: "Skill not found." };
  }

  const roundedDuration = Math.round(durationMinutes);
  const xpAwarded = calculateXpAwarded(roundedDuration);
  const previousLevel = skill.current_level;
  const result = applyXpToSkill({ level: skill.current_level, xp: skill.current_xp }, xpAwarded);

  const { data: event, error: eventError } = await supabase
    .from("xp_events")
    .insert({
      skill_id: skillId,
      duration_minutes: roundedDuration,
      note: note || null,
      xp_awarded: xpAwarded,
    })
    .select("id")
    .single();

  if (eventError || !event) {
    return { status: "error", error: "Could not save that session. Try again." };
  }

  const { error: updateError } = await supabase
    .from("skills")
    .update({ current_level: result.level, current_xp: result.xp })
    .eq("id", skillId);

  if (updateError) {
    return { status: "error", error: "Session saved, but updating the skill failed." };
  }

  let unlockedPerks: Perk[] = [];
  if (result.leveledUp) {
    const { data: perks, error: perksError } = await supabase
      .from("perks")
      .select("*")
      .eq("skill_id", skillId);

    if (!perksError && perks) {
      unlockedPerks = unlockedPerksInRange(perks, previousLevel, result.level);
      if (unlockedPerks.length > 0) {
        await supabase
          .from("perks")
          .update({ is_unlocked: true })
          .in(
            "id",
            unlockedPerks.map((perk) => perk.id),
          );
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath(`/skills/${skill.slug}`);

  return {
    status: "success",
    eventId: event.id,
    skillId,
    skillName: skill.name,
    xpAwarded,
    previousLevel,
    newLevel: result.level,
    levelsGained: result.levelsGained,
    unlockedPerks,
  };
}
