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
