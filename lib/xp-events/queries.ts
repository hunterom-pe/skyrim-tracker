import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { XpEvent } from "@/lib/supabase/types";

export async function getXpEventsForSkill(skillId: string): Promise<XpEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("xp_events")
    .select("*")
    .eq("skill_id", skillId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
