import { NextResponse, type NextRequest } from "next/server";
import { drainOutbox, enqueueReminders, getEmailQueueHealth } from "@/lib/email";
import { authorizedBearer } from "@/lib/server-auth";
export const maxDuration = 60;
/** Daily job: queue monthly reminders, then send any waiting notification emails. */
export async function GET(request: NextRequest) {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!process.env.CRON_SECRET) return NextResponse.json({ status: "not_configured" }, { status: 503, headers });
  if (!authorizedBearer(request.headers.get("authorization"), process.env.CRON_SECRET))
    return new NextResponse("Unauthorized", { status: 401 });
  const reminders = await enqueueReminders();
  const mail = await drainOutbox();
  const queue = await getEmailQueueHealth();
  const ok = reminders.status === "ok" && mail.status === "ok" && queue.status === "ok" && queue.failed === 0;
  const status = mail.status === "not_configured" || reminders.status === "not_configured" || queue.status === "not_configured" ? "not_configured" : ok ? "ok" : "failed";
  return NextResponse.json({ status, reminders, mail, queue }, { status: ok ? 200 : 503, headers });
}
