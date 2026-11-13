import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "./supabase/server";
import { FIXTURES, fxProfile } from "./fixtures";
import type { Profile } from "./types";
import type { Locale } from "./i18n";
export type Viewer = { id: string; email: string; profile: Profile };
export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (FIXTURES) return process.env.FIVONINE_FIXTURE_USER ? { id: fxProfile.id, email: "roseline@example.com", profile: fxProfile } : null;
  const sb = await db();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await sb.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
  if (!profile) return null;
  return { id: data.user.id, email: data.user.email ?? "", profile: profile as Profile };
});
export async function requireViewer(locale: Locale, next: string) {
  const v = await getViewer();
  if (!v) redirect(`/${locale}/login?next=${encodeURIComponent(next)}`);
  return v;
}
export async function requireAdmin(locale: Locale) {
  const v = await requireViewer(locale, `/${locale}/admin`);
  if (v.profile.role !== "admin" || v.profile.banned) redirect(`/${locale}`);
  return v;
}
/** Same-site relative paths only. */
export function safeNext(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f]/.test(value)) return fallback;
  try {
    const u = new URL(value, "https://fivonine.invalid");
    return u.origin === "https://fivonine.invalid" ? value : fallback;
  } catch {
    return fallback;
  }
}
/** An organizer needs a public profile before starting a fundraiser: a real name, a place and a few words. */
export const profileReady = (p: { display_name: string; bio: string; department: string | null; city: string | null }) =>
  !/^(fivonine member|member|yon kout men member)$/i.test(p.display_name.trim()) && p.display_name.trim().length > 1 && Boolean(p.department || p.city) && p.bio.trim().length >= 10;
