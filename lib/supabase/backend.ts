import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";
/** Only three bounded server operations; never exposes privileged table access. */
export async function backendAction(
  action: "rate_limit" | "message" | "outbound_click",
  payload: Record<string, string>,
) {
  const secret = process.env.APP_BACKEND_SECRET;
  if (!secret || !SUPABASE_URL || !SUPABASE_ANON_KEY)
    return { data: null, error: new Error("Backend unavailable") };
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  return db.rpc("website_action", {
    action_name: action,
    payload,
    backend_secret: secret,
  });
}
