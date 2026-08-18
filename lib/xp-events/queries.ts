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

export type XpEventWithSkill = XpEvent & { skillName: string; skillSlug: string };

/**
 * The global activity feed, across every skill. Capped at a generous 200
 * most-recent entries — plenty for a personal, single-user log in v1.
 */
export async function getAllXpEvents(limit = 200): Promise<XpEventWithSkill[]> {
  const supabase = createClient();
  const [{ data: events, error: eventsError }, { data: skills, error: skillsError }] =
    await Promise.all([
      supabase
        .from("xp_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase.from("skills").select("id, name, slug"),
    ]);
  if (eventsError) throw eventsError;
  if (skillsError) throw skillsError;

  const skillById = new Map((skills ?? []).map((skill) => [skill.id, skill]));

  return (events ?? []).map((event) => {
    const skill = skillById.get(event.skill_id);
    return { ...event, skillName: skill?.name ?? "Unknown", skillSlug: skill?.slug ?? "" };
  });
}
