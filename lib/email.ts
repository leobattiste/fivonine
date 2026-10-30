import { Resend } from "resend";
import { SITE } from "./site";
import type { HistEvent } from "./types";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export const FROM = process.env.RESEND_FROM || "Fivonine <lettre@fivonine.com>";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const COLORS = { inside: "#2F9E7E", abroad: "#C9921F", foreign: "#5A67D8" } as const;

function shell(body: string, unsubscribeUrl: string) {
  return `<!doctype html><html><body style="margin:0;background:#F2F5F3;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0B2321">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:20px" cellpadding="0" cellspacing="0">
  <tr><td style="padding:36px 36px 8px"><a href="${SITE.url}" style="color:#0B2321;text-decoration:none;font-weight:700;font-size:18px">Fivonine</a></td></tr>
  <tr><td style="padding:8px 36px 36px">${body}</td></tr>
  </table>
  <p style="font-size:12px;color:#6B7F79;margin:20px 0 0">You're receiving this because you subscribed at ${esc(SITE.url.replace(/^https?:\/\//, ""))}.
  <a href="${unsubscribeUrl}" style="color:#6B7F79">Unsubscribe</a></p>
  </td></tr></table></body></html>`;
}

export function welcomeEmail(unsubscribeUrl: string) {
  return shell(
    `<h1 style="font-size:28px;line-height:1.15;margin:16px 0 12px">Byenveni. Welcome to Fivonine.</h1>
     <p style="font-size:16px;line-height:1.6;color:#33504B">Every Sunday you'll get three moments from the coming week, drawn from any century of Haitian history, and one thread connecting decades.</p>
     <p style="margin:28px 0"><a href="${SITE.url}/#decades" style="background:#0B2321;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-size:15px">Start with a decade</a></p>`,
    unsubscribeUrl
  );
}

export function digestEmail(events: HistEvent[], thread: { title: string; dek: string; slug: string } | null, unsubscribeUrl: string) {
  const items = events
    .map((e) => `<tr><td style="padding:18px 0;border-top:1px solid #E3EAE7">
      <div style="font-size:32px;font-weight:800;color:${COLORS[e.dimension]};letter-spacing:-1px">${e.date.slice(0, 4)}</div>
      <a href="${SITE.url}/events/${e.slug}" style="display:block;font-size:18px;font-weight:600;color:#0B2321;text-decoration:none;margin-top:4px">${esc(e.title)}</a>
      <p style="font-size:15px;line-height:1.55;color:#33504B;margin:6px 0 0">${esc(e.summary)}</p></td></tr>`)
    .join("");
  const t = thread
    ? `<div style="background:#F2F5F3;border-radius:14px;padding:20px;margin-top:24px"><div style="font-size:13px;color:#6B7F79">Thread of the week</div>
       <a href="${SITE.url}/threads/${thread.slug}" style="display:block;font-size:18px;font-weight:700;color:#0B2321;text-decoration:none;margin-top:4px">${esc(thread.title)}</a>
       <p style="font-size:15px;color:#33504B;margin:6px 0 0">${esc(thread.dek)}</p></div>`
    : "";
  return shell(
    `<h1 style="font-size:26px;line-height:1.15;margin:16px 0 8px">This week in Haitian history</h1>
     <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table>${t}`,
    unsubscribeUrl
  );
}
