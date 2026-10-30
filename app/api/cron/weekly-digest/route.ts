import { NextResponse } from "next/server";
import { getContent, sortEvents } from "@/lib/data";
import { digestEmail, FROM, resend } from "@/lib/email";
import { getServiceClient, hasSupabase } from "@/lib/supabase";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

/** Sunday letter: events whose anniversaries fall in the next 7 days. */
export async function GET(req: Request) {
  if (process.env.CRON_SECRET && req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!resend || !hasSupabase()) return NextResponse.json({ skipped: "Resend or Supabase not configured" });

  const c = await getContent();
  const now = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() + i * 864e5);
    return `${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  });
  let picks = c.events.filter((e) => e.precision === "day" && days.includes(e.date.slice(5)));
  if (picks.length < 3) {
    const month = days[0].slice(0, 2);
    picks = [...picks, ...c.events.filter((e) => e.date.slice(5, 7) === month && !picks.includes(e))];
  }
  picks = sortEvents(picks).slice(0, 3);
  if (!picks.length) return NextResponse.json({ skipped: "No anniversaries this week" });


  const { data: subs, error } = await getServiceClient().from("subscribers").select("email, token").eq("status", "active");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (let i = 0; i < (subs ?? []).length; i += 100) {
    const batch = subs!.slice(i, i + 100).map((s) => {
      const unsub = `${SITE.url}/api/unsubscribe?token=${s.token}`;
      return {
        from: FROM,
        to: s.email,
        subject: `This week in Haitian history: ${picks[0].title}`,
        html: digestEmail(picks, unsub),
        headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      };
    });
    const { error: e } = await resend.batch.send(batch);
    if (e) console.error("[digest]", e); else sent += batch.length;
  }
  return NextResponse.json({ sent, events: picks.map((p) => p.slug) });
}
