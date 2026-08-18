import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { RumorEntry } from "@/lib/supabase/types";

export async function getRumorEntries(options?: { confirmedOnly?: boolean }): Promise<RumorEntry[]> {
  const supabase = createClient();
  let query = supabase.from("rumor_entries").select("*").order("date_posted", { ascending: false });

  if (options?.confirmedOnly) {
    query = query.eq("category", "Confirmed");
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
