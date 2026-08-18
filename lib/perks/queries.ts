import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Perk } from "@/lib/supabase/types";

export async function getPerksForSkill(skillId: string): Promise<Perk[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("perks")
    .select("*")
    .eq("skill_id", skillId)
    .order("unlock_level");
  if (error) throw error;
  return data ?? [];
}

export type PerkWithSkill = Perk & { skillName: string; skillSlug: string };

export async function getUnlockedPerks(): Promise<PerkWithSkill[]> {
  const supabase = createClient();
  const [{ data: perks, error: perksError }, { data: skills, error: skillsError }] =
    await Promise.all([
      supabase.from("perks").select("*").eq("is_unlocked", true).order("unlock_level"),
      supabase.from("skills").select("id, name, slug"),
    ]);
  if (perksError) throw perksError;
  if (skillsError) throw skillsError;

  const skillById = new Map((skills ?? []).map((skill) => [skill.id, skill]));

  return (perks ?? [])
    .map((perk) => {
      const skill = skillById.get(perk.skill_id);
      return { ...perk, skillName: skill?.name ?? "Unknown", skillSlug: skill?.slug ?? "" };
    })
    .sort((a, b) => a.skillName.localeCompare(b.skillName) || a.unlock_level - b.unlock_level);
}

export async function getTotalPerkCount(): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("perks")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
