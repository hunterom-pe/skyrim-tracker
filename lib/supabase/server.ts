import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Server-only client using the service role key. This is a single-user app
// with no Supabase Auth session — access control happens at the login-gate
// proxy (see lib/auth/gate.ts), and RLS on every table has no policies, so
// the service role key is the only thing that can read or write data.
export function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
