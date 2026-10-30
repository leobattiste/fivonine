import { NextResponse } from "next/server";
import { getServiceClient, hasSupabase } from "@/lib/supabase";
import { FROM, resend, welcomeEmail } from "@/lib/email";
import { SITE } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: { email?: string; source?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Send a JSON body with an email." }, { status: 400 }); }

  const email = (body.email || "").trim().toLowerCase();
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!hasSupabase() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Subscriptions open soon. Supabase isn't configured yet." }, { status: 503 });
  }

  const db = getServiceClient();
  const { data, error } = await db
    .from("subscribers")
    .upsert({ email, status: "active", source: (body.source || "site").slice(0, 80) }, { onConflict: "email" })
    .select("token")
    .single();
  if (error) {
    console.error("[subscribe]", error);
    return NextResponse.json({ error: "We couldn't save your email. Try again in a moment." }, { status: 500 });
  }

  if (resend) {
    const unsub = `${SITE.url}/api/unsubscribe?token=${data.token}`;
    const { error: mailErr } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to Fivonine",
      html: welcomeEmail(unsub),
      headers: { "List-Unsubscribe": `<${unsub}>` },
    });
    if (mailErr) console.error("[subscribe] resend", mailErr);
  }
  return NextResponse.json({ ok: true });
}
