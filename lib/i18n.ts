import en, { type Dict as Base } from "./dict/en";
import fr from "./dict/fr";
import ht from "./dict/ht";
import es from "./dict/es";
import xen, { type X } from "./dict/x-en";
import xfr from "./dict/x-fr";
import xht from "./dict/x-ht";
import xes from "./dict/x-es";
export const locales = ["en", "fr", "ht", "es"] as const;
export type Locale = (typeof locales)[number];
export const DEFAULT_LOCALE: Locale = "fr";
export const isLocale = (v: string): v is Locale => locales.includes(v as Locale);
export const localeNames: Record<Locale, string> = { en: "English", fr: "Français", ht: "Kreyòl", es: "Español" };
/** Organizers can write in any supported interface language. */
export const storyLanguages = localeNames;
export type Dict = Base & { x: X };
const dicts: Record<Locale, Dict> = { en: { ...en, x: xen }, fr: { ...fr, x: xfr }, ht: { ...ht, x: xht }, es: { ...es, x: xes } };
export const t = (locale: Locale): Dict => dicts[locale];
export const LOCALE_COOKIE = "fivonine-locale";
export const htmlLang: Record<Locale, string> = { en: "en", fr: "fr", ht: "ht", es: "es" };

/** Keep the current page, filters, anchor and internal sign-in destination when switching language. */
export function localizedPath(href: string, locale: Locale): string {
  const url = new URL(href, "https://fivonine.invalid");
  if (url.origin !== "https://fivonine.invalid") return `/${locale}`;
  const parts = url.pathname.split("/");
  if (isLocale(parts[1] ?? "")) parts[1] = locale;
  else parts.splice(1, 0, locale);
  url.pathname = parts.join("/");
  const next = url.searchParams.get("next");
  if (next?.startsWith("/") && !next.startsWith("//")) {
    const destination = new URL(next, url.origin);
    const nextParts = destination.pathname.split("/");
    if (destination.origin === url.origin && isLocale(nextParts[1] ?? "")) {
      nextParts[1] = locale;
      destination.pathname = nextParts.join("/");
      url.searchParams.set("next", destination.pathname + destination.search + destination.hash);
    }
  }
  return url.pathname + url.search + url.hash;
}
