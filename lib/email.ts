import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "./supabase/config";
import { isLocale, t, type Locale } from "./i18n";
import { SITE_URL } from "./constants";
import { DeliveryFailure, processEmailBatch, unconfiguredEmailRun, type EmailJob, type EmailFailure } from "./email-worker";
const esc = (v: string | undefined) => String(v ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch] as string);
function pathFor(job: EmailJob) {
  if (job.kind.startsWith("admin_")) return "admin";
  if (job.kind.startsWith("appeal_")) return "dashboard?tab=profile#appeals";
  if (job.kind === "message") return "dashboard?tab=messages";
  if (job.kind === "support_confirmed") return "dashboard?tab=support";
  if (["campaign_needs_changes", "campaign_rejected", "campaign_suspended", "new_contribution"].includes(job.kind) || !job.payload.slug) return "dashboard";
  return `campaigns/${job.payload.slug}`;
}
function render(job: EmailJob) {
  const locale: Locale = isLocale(job.locale) ? job.locale : "fr";
  const d = t(locale);
  const make = (d.notif as Record<string, (title: string) => string>)[job.kind];
  const title = job.payload.title ?? "";
  const subject = make ? make(title) : "yon kout men";
  const link = `${SITE_URL}/${locale}/${pathFor(job)}`;
  const lines = [d.email.greeting, "", subject, "", `${d.email.open} ${link}`];
  if (job.payload.note) lines.push("", `${d.email.noteLabel} ${job.payload.note}`);
  lines.push("", "yon kout men", "", d.email.footer);
  const font = "font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";
  const html = `<!doctype html><html lang="${locale}"><body style="margin:0;background:#f4f4f4;padding:24px 12px;${font};color:#111111">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px">
<tr><td style="padding:28px 28px 8px;font-size:22px;font-weight:700;letter-spacing:-0.5px">ykm</td></tr>
<tr><td style="padding:8px 28px 0;font-size:16px;line-height:1.55">${esc(d.email.greeting)}</td></tr>
<tr><td style="padding:12px 28px 0;font-size:20px;line-height:1.35;font-weight:600">${esc(subject)}</td></tr>
${job.payload.note ? `<tr><td style="padding:16px 28px 0"><div style="background:#f4f4f4;border-radius:12px;padding:14px 16px;font-size:15px;line-height:1.5"><strong style="font-weight:600">${esc(d.email.noteLabel)}</strong> ${esc(job.payload.note)}</div></td></tr>` : ""}
<tr><td style="padding:24px 28px 28px"><a href="${esc(link)}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:13px 24px;border-radius:999px">${esc((d.email as { cta?: string }).cta ?? d.email.open)}</a></td></tr>
</table>
<p style="max-width:520px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#777777">${esc(d.email.footer)}</p>
</td></tr></table></body></html>`;
  return { subject, text: lines.join("\n"), html };
}
const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const report = (failure: EmailFailure | { stage: "config" | "reminders" | "health"; code: string }) => console.error("email_delivery", failure);
function emailDb() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(5000) }) } });
}
/** Accepting an email and recording that acceptance are separate, observable steps. */
export async function drainOutbox() {
  const secret = process.env.APP_BACKEND_SECRET, key = process.env.RESEND_API_KEY, from = process.env.RESEND_FROM;
  if (!secret || !key || !from || !supabaseEnabled) {
    report({ stage: "config", code: "email_not_configured" });
    return unconfiguredEmailRun();
  }
  let sb: ReturnType<typeof emailDb>;
  try { sb = emailDb(); }
  catch {
    report({ stage: "config", code: "invalid_database_config" });
    return unconfiguredEmailRun();
  }
  let lastSendAt = 0;
  return processEmailBatch({
    report,
    claim: async () => {
      const { data, error } = await sb.rpc("claim_email_batch_v2", { backend_secret: secret });
      if (error || !Array.isArray(data)) throw new Error("claim_rpc_failed");
      return data as EmailJob[];
    },
    start: async (job) => {
      const { error } = await sb.rpc("start_email_delivery", { backend_secret: secret, email_id: job.id, lease: job.lease_token });
      if (error) throw new Error("start_rpc_failed");
    },
    send: async (job) => {
      let body: string;
      try { body = JSON.stringify({ from, to: [job.recipient], ...render(job) }); }
      catch { throw new DeliveryFailure("permanent", "invalid_email_payload"); }
      let uncertainAttempt = false;
      for (let attempt = 0; attempt < 2; attempt++) {
        const gap = Math.max(0, 550 - (Date.now() - lastSendAt));
        if (gap) await pause(gap);
        lastSendAt = Date.now();
        let failure: DeliveryFailure;
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `fivonine-${job.id}` },
            body, signal: AbortSignal.timeout(8000),
          });
          if (res.ok) {
            const payload = await res.json().catch(() => null);
            if (typeof payload?.id === "string" && payload.id) return;
            failure = new DeliveryFailure("uncertain", "provider_invalid_response");
          } else {
            failure = new DeliveryFailure(res.status === 429 ? "retryable" : res.status >= 500 || res.status === 408 ? "uncertain" : "permanent", "provider_http_error", res.status);
          }
        } catch { failure = new DeliveryFailure("uncertain", "provider_unavailable"); }
        uncertainAttempt ||= failure.outcome === "uncertain";
        if (attempt === 1 || failure.outcome === "permanent") {
          // A rate-limited replay cannot rule out acceptance of an earlier timed-out request.
          if (uncertainAttempt && failure.outcome === "retryable") throw new DeliveryFailure("uncertain", failure.code, failure.httpStatus);
          throw failure;
        }
        await pause(1000);
      }
    },
    finish: async (job, outcome, code) => {
      // The RPC is idempotent for this lease, including a lost success response.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const { error } = await sb.rpc("finish_email_result", { backend_secret: secret, email_id: job.id, lease: job.lease_token, outcome, err: code });
          if (!error) return;
        } catch { /* Retry the acknowledgement without sending the email again. */ }
        if (!attempt) await pause(100);
      }
      throw new Error("finish_rpc_failed");
    },
  });
}
export async function enqueueReminders() {
  const secret = process.env.APP_BACKEND_SECRET;
  if (!secret || !supabaseEnabled) return { status: "not_configured" as const, queued: 0 };
  try {
    const { data, error } = await emailDb().rpc("enqueue_reminders", { backend_secret: secret });
    if (error || typeof data !== "number" || !Number.isInteger(data) || data < 0) throw new Error("reminder_rpc_failed");
    return { status: "ok" as const, queued: data };
  } catch {
    report({ stage: "reminders", code: "reminder_rpc_failed" });
    return { status: "failed" as const, queued: 0 };
  }
}
export async function getEmailQueueHealth() {
  const secret = process.env.APP_BACKEND_SECRET;
  if (!secret || !supabaseEnabled) return { status: "not_configured" as const };
  try {
    const { data, error } = await emailDb().rpc("email_queue_health", { backend_secret: secret });
    const fields = ["pending", "failed", "quarantined", "uncertain", "processing"] as const;
    if (error || !data || fields.some((field) => !Number.isSafeInteger(data[field]) || data[field] < 0)) throw new Error("queue_health_failed");
    return { status: "ok" as const, pending: Number(data.pending), failed: Number(data.failed), quarantined: Number(data.quarantined), uncertain: Number(data.uncertain), processing: Number(data.processing) };
  } catch {
    report({ stage: "health", code: "queue_health_failed" });
    return { status: "failed" as const };
  }
}
