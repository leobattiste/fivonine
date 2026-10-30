import { NextResponse } from "next/server";
import { getServiceClient, hasSupabase } from "@/lib/supabase";
import { FROM, resend } from "@/lib/email";
import { CONTRIBUTION_KINDS } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 }); }

  // Honeypot: real people never fill the hidden "website" field.
  if (typeof b.website === "string" && b.website.trim()) return NextResponse.json({ ok: true });

  const kind = String(b.kind ?? "");
  const message = String(b.message ?? "").trim();
  const page = String(b.page ?? "").trim().slice(0, 300);
  const name = String(b.name ?? "").trim().slice(0, 120);
  const email = String(b.email ?? "").trim().toLowerCase().slice(0, 254);

  if (!CONTRIBUTION_KINDS.some((k) => k.value === kind)) return NextResponse.json({ error: "Choose what you're sending." }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ error: "Tell us a little more (at least 10 characters)." }, { status: 400 });
  if (message.length > 5000) return NextResponse.json({ error: "Keep it under 5,000 characters, or send it in parts." }, { status: 400 });
  if (email && !EMAIL.test(email)) return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });

  const canStore = hasSupabase() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const notifyTo = process.env.CONTRIBUTE_NOTIFY_EMAIL;
  if (!canStore && !(resend && notifyTo)) {
    return NextResponse.json({ error: "Contributions open soon. For now, email hello@fivonine.com." }, { status: 503 });
  }

  if (canStore) {
    const { error } = await getServiceClient().from("contributions").insert({ kind, message, page: page || null, name: name || null, email: email || null });
    if (error) {
      console.error("[contribute]", error);
      return NextResponse.json({ error: "We couldn't save that. Try again in a moment." }, { status: 500 });
    }
  }

  if (resend && notifyTo) {
    const label = CONTRIBUTION_KINDS.find((k) => k.value === kind)?.label ?? kind;
    const { error } = await resend.emails.send({
      from: FROM,
      to: notifyTo,
      replyTo: email || undefined,
      subject: `New contribution: ${label}`,
      html: `<p><strong>${esc(label)}</strong>${page ? ` on ${esc(page)}` : ""}</p>
             <p style="white-space:pre-wrap">${esc(message)}</p>
             <p style="color:#6E6E6B">${esc(name || "Anonymous")}${email ? ` &lt;${esc(email)}&gt;` : ""}</p>`,
    });
    if (error) console.error("[contribute] resend", error);
  }

  return NextResponse.json({ ok: true });
}
