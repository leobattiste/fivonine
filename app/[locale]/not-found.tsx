import Link from "next/link";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, isLocale, t } from "@/lib/i18n";
export default async function NotFound() {
  const saved = (await headers()).get("x-fivonine-locale") ?? (await cookies()).get(LOCALE_COOKIE)?.value ?? "";
  const locale = isLocale(saved) ? saved : "ht", d = t(locale).common;
  return <div className="wrap page narrow empty"><h1>{d.notFoundTitle}</h1><p>{d.notFoundBody}</p><Link className="btn primary" href={`/${locale}`}>{d.goHome}</Link></div>;
}
