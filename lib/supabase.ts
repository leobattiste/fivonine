import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const hasSupabase = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

let _client: SupabaseClient | null = null;

/** Server-side client. Uses the service role key when present (bypasses RLS for writes). */
export function getServiceClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}
