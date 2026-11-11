import type { Campaign, Progress, Settings } from "./types";
import type { Locale } from "./i18n";
import { SUPABASE_URL } from "./supabase/config";
const intl: Record<Locale, string> = { ht: "fr-HT", fr: "fr-FR", en: "en-US" };
export const fmtNumber = (n: number, locale: Locale) => new Intl.NumberFormat(intl[locale], { maximumFractionDigits: 0 }).format(n);
export const fmtMoney = (n: number, currency: string, locale: Locale) => `${fmtNumber(n, locale)} ${currency}`;
export const fmtDate = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(intl[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
const tints = ["#1f503b", "#2f6b4f", "#3d7d5d", "#17402f", "#4a8a68", "#285c44"];
/** Public URL of a file in the media bucket. */
export function mediaUrl(path: string | null | undefined) {
  if (!path) return null;
  if (path.startsWith("fixture:")) {
    const i = Number(path.slice(8)) || 0;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='${tints[i % 6]}'/><circle cx='${200 + i * 70}' cy='260' r='170' fill='%23f0faef' opacity='.18'/><rect y='430' width='800' height='170' fill='%23000' opacity='.14'/></svg>`;
    return `data:image/svg+xml;utf8,${svg.replace(/#/g, "%23")}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/media/${path.split("/").map(encodeURIComponent).join("/")}`;
}
/** Self-reported total, expressed in the campaign's goal currency. */
export function raised(c: Pick<Campaign, "goal_currency">, p: Progress | undefined, s: Settings) {
  const rate = s.rate.htg_per_usd > 0 ? s.rate.htg_per_usd : 131;
  const htg = Number(p?.total_htg ?? 0), usd = Number(p?.total_usd ?? 0);
  return c.goal_currency === "USD" ? usd + htg / rate : htg + usd * rate;
}
export function otherCurrency(amount: number, currency: "HTG" | "USD", s: Settings) {
  const rate = s.rate.htg_per_usd > 0 ? s.rate.htg_per_usd : 131;
  return currency === "USD" ? { amount: amount * rate, currency: "HTG" } : { amount: amount / rate, currency: "USD" };
}
export const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
export function slugify(title: string) {
  const base = title.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "kanpay";
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => (b % 36).toString(36)).join("");
  return `${base}-${rand}`.replace(/-+/g, "-");
}
export const cleanSearch = (q: string) => q.replace(/[,()%*\\"':]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
