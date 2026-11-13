import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "./supabase/config";
import { isLocale, t, type Locale } from "./i18n";
import { SITE_URL } from "./constants";
type Job = { id: string; recipient: string; locale: string; kind: string; payload: { title?: string; slug?: string; note?: string } };
function render(job: Job) {
  const locale: Locale = isLocale(job.locale) ? job.locale : "ht";
  const d = t(locale);
  const make = (d.notif as Record<string, (title: string) => string>)[job.kind];
  const title = job.payload.title ?? "";
  const subject = make ? make(title) : "yon kout men";
  const path = job.kind.startsWith("admin_") ? "admin" : ["campaign_needs_changes", "campaign_rejected", "campaign_suspended"].includes(job.kind) || !job.payload.slug ? "dashboard" : `campaigns/${job.payload.slug}`;
  const lines = [d.email.greeting, "", subject, "", `${d.email.open} ${SITE_URL}/${locale}/${path}`];
  if (job.payload.note) lines.push("", `${d.email.noteLabel} ${job.payload.note}`);
  lines.push("", "yon kout men", "", d.email.footer);
  return { subject, text: lines.join("\n") };
}
/** Sends queued notification emails. Does nothing until email delivery is configured. */
export async function drainOutbox() {
  const secret = process.env.APP_BACKEND_SECRET, key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  if (!secret || !key || !from || !supabaseEnabled) return { sent: 0, failed: 0, configured: false };
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  const { data, error } = await sb.rpc("claim_email_batch", { backend_secret: secret });
  if (error) return { sent: 0, failed: 0, configured: true };
  let sent = 0, failed = 0;
  for (const job of (data ?? []) as Job[]) {
    let ok = false, err = "";
    try {
      const { subject, text } = render(job);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `fivonine-${job.id}` },
        body: JSON.stringify({ from, to: [job.recipient], subject, text }),
        signal: AbortSignal.timeout(15000),
      });
      ok = res.ok;
      if (!ok) err = `Provider status ${res.status}`;
    } catch (e) {
      err = e instanceof Error ? e.message : "Delivery failed";
    }
    await sb.rpc("finish_email", { backend_secret: secret, email_id: job.id, ok, err });
    if (ok) sent++; else failed++;
  }
  return { sent, failed, configured: true };
}
export async function enqueueReminders() {
  const secret = process.env.APP_BACKEND_SECRET;
  if (!secret || !supabaseEnabled) return 0;
  const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  const { data } = await sb.rpc("enqueue_reminders", { backend_secret: secret });
  return Number(data ?? 0);
}
