import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getLaunchReadiness } from "@/lib/launch-readiness";
import { authorizedBearer } from "@/lib/server-auth";
import { getEmailQueueHealth } from "@/lib/email";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/** Read-only uptime check. Detailed configuration names require the cron credential. */
export async function GET(request: NextRequest) {
  const readiness = getLaunchReadiness();
  let available = false;
  if (supabaseEnabled) {
    try {
      const db = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
      const { error } = await db.from("categories").select("slug", { head: true }).limit(1).abortSignal(AbortSignal.timeout(5000));
      available = !error;
    } catch { /* Return an unavailable status without exposing upstream errors or configuration. */ }
  }
  const details = authorizedBearer(request.headers.get("authorization"), process.env.CRON_SECRET)
    ? { checks: { ...readiness.checks, databaseReachable: available }, missing: readiness.missing, emailQueue: await getEmailQueueHealth() }
    : {};
  return NextResponse.json({ status: available ? "ok" : "unavailable", launchReady: available && readiness.ready, ...details }, {
    status: available ? 200 : 503,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
