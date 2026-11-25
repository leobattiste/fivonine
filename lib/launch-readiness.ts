type Environment = Record<string, string | undefined>;
const present = (value: string | undefined) => Boolean(value?.trim());
const validEmail = (value: string | undefined) => Boolean(value && !/[\r\n]/.test(value) && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(value.trim()));
function publicHttpsUrl(value: string | undefined) {
  try {
    const url = new URL(value ?? "");
    return url.protocol === "https:" && !url.username && !url.password && !["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname);
  } catch { return false; }
}
function validSender(value: string | undefined) {
  if (!value || /[\r\n]/.test(value)) return false;
  const address = value.trim().match(/^[^<>]+<([^<>]+)>$/)?.[1] ?? value.trim();
  return validEmail(address);
}

/** Configuration checks only. Domain verification, Auth email and operational QA require the release attestation. */
export function getLaunchReadiness(env: Environment = process.env) {
  const requirements = {
    NEXT_PUBLIC_SUPABASE_URL: publicHttpsUrl(env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: present(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    APP_BACKEND_SECRET: present(env.APP_BACKEND_SECRET),
    RESEND_API_KEY: present(env.RESEND_API_KEY),
    RESEND_FROM: validSender(env.RESEND_FROM),
    CRON_SECRET: present(env.CRON_SECRET),
    NEXT_PUBLIC_SITE_URL: publicHttpsUrl(env.NEXT_PUBLIC_SITE_URL),
    SITE_OPERATOR_NAME: present(env.SITE_OPERATOR_NAME),
    SITE_OPERATOR_COUNTRY: present(env.SITE_OPERATOR_COUNTRY),
    SITE_SUPPORT_EMAIL: validEmail(env.SITE_SUPPORT_EMAIL),
    SITE_DOCUMENT_RETENTION: present(env.SITE_DOCUMENT_RETENTION),
    LAUNCH_CHECKS_PASSED: env.LAUNCH_CHECKS_PASSED === "true",
  };
  const checks = {
    database: requirements.NEXT_PUBLIC_SUPABASE_URL && requirements.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    email: requirements.APP_BACKEND_SECRET && requirements.RESEND_API_KEY && requirements.RESEND_FROM,
    cron: requirements.CRON_SECRET,
    siteUrl: requirements.NEXT_PUBLIC_SITE_URL,
    operator: requirements.SITE_OPERATOR_NAME && requirements.SITE_OPERATOR_COUNTRY && requirements.SITE_SUPPORT_EMAIL && requirements.SITE_DOCUMENT_RETENTION,
    reviewed: requirements.LAUNCH_CHECKS_PASSED,
  };
  const missing = Object.entries(requirements).filter(([, ready]) => !ready).map(([name]) => name);
  return { ready: missing.length === 0, checks, missing };
}

/** Keep indexing disabled until both the launch switch and all readiness gates pass. */
export const canIndexPublicSite = (env: Environment = process.env) => env.PUBLIC_LAUNCH === "true" && getLaunchReadiness(env).ready;
