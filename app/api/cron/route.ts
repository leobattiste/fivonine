import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { drainOutbox, enqueueReminders } from "@/lib/email";
/** Daily job: queue monthly reminders, then send any waiting notification emails. */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET, auth = request.headers.get("authorization") ?? "", expected = `Bearer ${secret}`;
  if (!secret || Buffer.byteLength(auth) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(auth), Buffer.from(expected)))
    return new NextResponse("Unauthorized", { status: 401 });
  const reminders = await enqueueReminders();
  const mail = await drainOutbox();
  return NextResponse.json({ reminders, ...mail });
}
