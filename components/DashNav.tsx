"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Icon, { type IconName } from "./Icon";
import { t, type Locale } from "@/lib/i18n";
import { followUp } from "@/lib/dict/follow-up";
export default function DashNav({ locale, tab, unread }: { locale: Locale; tab: string; unread: number }) {
  const n = t(locale).x.nav;
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    const navRect = nav.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const margin = 20;
    if (activeRect.left < navRect.left + margin) {
      nav.scrollLeft += activeRect.left - navRect.left - margin;
    } else if (activeRect.right > navRect.right - margin) {
      nav.scrollLeft += activeRect.right - navRect.right + margin;
    }
  }, [tab]);
  const items: [string, string, IconName, number?][] = [["profile", n.profile, "userCircle"], ["campaigns", n.fundraisers, "hand"], ["support", followUp[locale].mine.tab, "heart"], ["saved", n.saved, "bookmark"], ["messages", followUp[locale].msg.tab, "mail"], ["notifications", n.notifications, "bell", unread], ["settings", n.settings, "settings"]];
  return (
    <nav ref={navRef} className="side-nav" aria-label={n.account}>
      {items.map(([k, label, icon, count]) => (
        <Link key={k} href={`/${locale}/dashboard${k === "profile" ? "" : `?tab=${k}`}`} aria-current={tab === k ? "page" : undefined}><Icon name={icon} size={18} />{label}{count ? <span className="count">{count}</span> : null}</Link>
      ))}
    </nav>
  );
}
