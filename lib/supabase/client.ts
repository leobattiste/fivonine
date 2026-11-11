"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "./config";
let client: ReturnType<typeof createBrowserClient> | null = null;
export function browserDb() {
  if (!supabaseEnabled) return null;
  client ??= createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  return client;
}
