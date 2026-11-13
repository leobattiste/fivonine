import Link from "next/link";
import Icon, { type IconName } from "./Icon";
import { t, type Locale } from "@/lib/i18n";
export default function DashNav({ locale, tab, unread }: { locale: Locale; tab: string; unread: number }) {
  const n = t(locale).x.nav;
  const items: [string, string, IconName, number?][] = [["campaigns", n.dashboard, "dashboard"], ["saved", n.saved, "bookmark"], ["notifications", n.notifications, "bell", unread], ["profile", n.profile, "user"]];
  return (
    <nav className="side-nav" aria-label={n.account}>
      {items.map(([k, label, icon, count]) => (
        <Link key={k} href={`/${locale}/dashboard${k === "campaigns" ? "" : `?tab=${k}`}`} aria-current={tab === k ? "page" : undefined}><Icon name={icon} size={18} />{label}{count ? <span className="count">{count}</span> : null}</Link>
      ))}
    </nav>
  );
}
