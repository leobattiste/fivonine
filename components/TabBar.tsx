"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import Icon, { type IconName } from "./Icon";
import { t, type Locale } from "@/lib/i18n";

/** Phone navigation within thumb reach. Hidden in focused flows (create, edit, admin, print). */
export default function TabBar({ locale, signedIn, unread }: { locale: Locale; signedIn: boolean; unread: number }) {
  const path = usePathname(), sp = useSearchParams();
  const v = t(locale).v3.tab;
  const L = (p: string) => `/${locale}${p}`;
  if (/\/(create|edit|admin|flyer|auth)(\/|$)/.test(path)) return null;
  const tab = sp.get("tab");
  const dash = path.startsWith(L("/dashboard"));
  const items: { key: string; href: string; label: string; icon: IconName; on: boolean; badge?: number; primary?: boolean }[] = [
    { key: "home", href: L(""), label: v.home, icon: "home", on: path === L("") },
    { key: "donate", href: L("/explore"), label: v.donate, icon: "search", on: path.startsWith(L("/explore")) || path.startsWith(L("/campaigns")) },
    { key: "start", href: L("/create"), label: v.start, icon: "plus", on: false, primary: true },
    { key: "saved", href: signedIn ? L("/dashboard?tab=saved") : L(`/login?next=${encodeURIComponent(L("/dashboard?tab=saved"))}`), label: v.saved, icon: "bookmark", on: dash && tab === "saved" },
    { key: "account", href: signedIn ? L("/dashboard") : L("/login"), label: v.account, icon: "userCircle", on: (dash && tab !== "saved") || path.startsWith(L("/login")), badge: unread },
  ];
  return (
    <nav className="tabbar no-print" aria-label={t(locale).nav.menu}>
      {items.map((it) => (
        <Link key={it.key} href={it.href} className={it.primary ? "tab-primary" : undefined} aria-current={it.on ? "page" : undefined}>
          <span className="tab-ico"><Icon name={it.icon} size={it.primary ? 24 : 22} />{it.badge ? <span className="dot" aria-hidden="true" /> : null}</span>
          <span className="tab-label">{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
