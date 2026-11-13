import en, { type Dict as Base } from "./dict/en";
import fr from "./dict/fr";
import xen, { type X } from "./dict/x-en";
import xfr from "./dict/x-fr";
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const DEFAULT_LOCALE: Locale = "fr";
export const isLocale = (v: string): v is Locale => locales.includes(v as Locale);
export const localeNames: Record<Locale, string> = { fr: "Français", en: "English" };
/** Languages an organizer can write a story in. The site itself is French and English. */
export const storyLanguages = { ht: "Kreyòl", fr: "Français", en: "English" } as const;
export type Dict = Base & { x: X };
const dicts: Record<Locale, Dict> = { en: { ...en, x: xen }, fr: { ...fr, x: xfr } };
export const t = (locale: Locale): Dict => dicts[locale];
export const LOCALE_COOKIE = "fivonine-locale";
export const htmlLang: Record<Locale, string> = { fr: "fr", en: "en" };
