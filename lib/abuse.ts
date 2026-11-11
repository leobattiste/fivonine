import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { backendAction } from "./supabase/backend";
export async function humanCheck(form: FormData) {
  if (form.get("website")) return false;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Honeypot plus persistent server-side rate limiting.
  const token = String(form.get("cf-turnstile-response") ?? "");
  if (!token) return false;
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    },
  );
  if (!response.ok) return false;
  return (await response.json()).success === true;
}
export async function rateLimit(scope: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const token = createHash("sha256")
    .update(
      `${scope}:${ip}:${process.env.APP_BACKEND_SECRET ?? process.env.CRON_SECRET ?? "local"}`,
    )
    .digest("hex");
  const { data, error } = await backendAction("rate_limit", { bucket: token });
  return !error && data === true;
}
