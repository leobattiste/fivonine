import type { Locale } from "./i18n";
export function returnPath(value: unknown, locale: Locale) {
  const path = typeof value === "string" ? value : "";
  return new RegExp(
    `^/${locale}/(?:submit|dashboard(?:/[a-f0-9-]{36}/(?:edit|preview))?)$`,
    "i",
  ).test(path)
    ? path
    : `/${locale}/dashboard`;
}
