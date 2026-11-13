import Link from "next/link";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, isLocale, t } from "@/lib/i18n";
export default async function NotFound() {
  const saved = (await headers()).get("x-fivonine-locale") ?? (await cookies()).get(LOCALE_COOKIE)?.value ?? "";
  const locale = isLocale(saved) ? saved : "fr", d = t(locale).common;
  return <div className="wrap page"><div className="empty"><h1>{d.notFoundTitle}</h1><p>{d.notFoundBody}</p><div className="row"><Link className="btn primary" href={`/${locale}`}>{d.goHome}</Link><Link className="btn" href={`/${locale}/explore`}>{t(locale).x.nav.explore}</Link></div></div></div>;
}
