import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { serviceClient } from "@/lib/supabase/service";
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET,
    auth = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (
    !secret ||
    Buffer.byteLength(auth) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(auth), Buffer.from(expected))
  )
    return new NextResponse("Unauthorized", { status: 401 });
  const db = serviceClient();
  if (!db || !process.env.RESEND_API_KEY || !process.env.RESEND_FROM)
    return NextResponse.json(
      { error: "Email configuration incomplete" },
      { status: 503 },
    );
  const { data, error } = await db.rpc("claim_email_batch");
  if (error)
    return NextResponse.json(
      { error: "Could not claim jobs" },
      { status: 500 },
    );
  let sent = 0,
    failed = 0;
  for (const job of data ?? []) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `fivonine-${job.id}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM,
          to: [job.recipient],
          subject: job.subject,
          text: job.body,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error(`Provider status ${response.status}`);
      const result = await db
        .from("email_outbox")
        .update({
          sent_at: new Date().toISOString(),
          processing_until: null,
          last_error: null,
        })
        .eq("id", job.id);
      if (result.error) throw new Error("Delivery state update failed");
      sent++;
    } catch (e) {
      await db
        .from("email_outbox")
        .update({
          processing_until: null,
          last_error:
            e instanceof Error ? e.message.slice(0, 120) : "Delivery failed",
        })
        .eq("id", job.id);
      failed++;
    }
  }
  return NextResponse.json({ sent, failed });
}
