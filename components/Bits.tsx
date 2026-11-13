"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { t, type Locale } from "@/lib/i18n";

export function CopyButton({ text, locale, label, done, className = "btn small soft" }: { text: string; locale: Locale; label?: string; done?: string; className?: string }) {
  const d = t(locale).common;
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className={className} onClick={async () => {
      try { await navigator.clipboard.writeText(text); } catch {
        const ta = Object.assign(document.createElement("textarea"), { value: text });
        document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
      setOk(true); setTimeout(() => setOk(false), 2000);
    }}>
      <Icon name={ok ? "check" : "copy"} size={16} />
      <span aria-live="polite">{ok ? done ?? d.copied : label ?? d.copy}</span>
    </button>
  );
}
export function ShareBar({ url, title, locale }: { url: string; title: string; locale: Locale }) {
  const d = t(locale), x = d.x.detail;
  const [native, setNative] = useState(false);
  useEffect(() => setNative("share" in navigator), []);
  return (
    <div className="support-tools">
      <a className="btn small" href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`} target="_blank" rel="noopener noreferrer">
        <Icon name="whatsapp" size={17} />WhatsApp<span className="sr"> ({d.x.common.newTab})</span>
      </a>
      <CopyButton text={url} locale={locale} label={x.copyLink} done={x.linkCopied} className="btn small" />
      {native && <button type="button" className="btn small" onClick={() => navigator.share({ title, url }).catch(() => {})}><Icon name="share" size={16} />{d.campaign.share}</button>}
    </div>
  );
}
export function PrintButton({ label }: { label: string }) {
  return <button type="button" className="btn primary no-print" onClick={() => window.print()}><Icon name="print" size={18} />{label}</button>;
}
export function ClearDraft({ storageKey }: { storageKey: string }) {
  useEffect(() => { try { localStorage.removeItem(storageKey); } catch {} }, [storageKey]);
  return null;
}
export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}

/** Explore remembers its address and scroll position so a fundraiser can link back to the same results. */
const RESULTS = "yk-results";
export function RememberResults() {
  const path = usePathname(), sp = useSearchParams();
  useEffect(() => {
    const url = `${path}${sp.toString() ? `?${sp}` : ""}`;
    let saved: { url: string; y: number } | null = null;
    try { saved = JSON.parse(sessionStorage.getItem(RESULTS) ?? "null"); } catch {}
    if (saved?.url === url && sessionStorage.getItem(`${RESULTS}-restore`) === "1") {
      sessionStorage.removeItem(`${RESULTS}-restore`);
      requestAnimationFrame(() => window.scrollTo({ top: saved!.y, behavior: "instant" as ScrollBehavior }));
    }
    const save = () => { try { sessionStorage.setItem(RESULTS, JSON.stringify({ url, y: window.scrollY })); } catch {} };
    save();
    let frame = 0;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(save); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [path, sp]);
  return null;
}
export function BackToResults({ locale }: { locale: Locale }) {
  const x = t(locale).x.detail;
  const [href, setHref] = useState<string | null>(null);
  useEffect(() => {
    try { const s = JSON.parse(sessionStorage.getItem(RESULTS) ?? "null"); if (s?.url?.startsWith(`/${locale}/explore`)) setHref(s.url); } catch {}
  }, [locale]);
  return (
    <Link className="crumb" href={href ?? `/${locale}/explore`} onClick={() => { if (href) try { sessionStorage.setItem(`${RESULTS}-restore`, "1"); } catch {} }} scroll={!href}>
      <Icon name="left" size={18} />{href ? x.back : x.backExplore}
    </Link>
  );
}

/** Section navigation that highlights the part of the page being read. */
export function SectionTabs({ items }: { items: [string, string, number?][] }) {
  const [on, setOn] = useState(items[0]?.[0]);
  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setOn(vis.target.id);
    }, { rootMargin: "-80px 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="section-tabs" aria-label="Sections">
      {items.map(([id, label, n]) => <a key={id} href={`#${id}`} aria-current={on === id ? "true" : undefined}>{label}{n ? <span className="count">{n}</span> : null}</a>)}
    </nav>
  );
}

/** Mobile: a compact support action that steps aside once the support panel is on screen. */
export function MobileSupport({ label, target = "support" }: { label: string; target?: string }) {
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    document.body.classList.add("has-mobile-support");
    return () => { io.disconnect(); document.body.classList.remove("has-mobile-support"); };
  }, [target]);
  return (
    <div ref={ref} className="mobile-support no-print" data-hidden={hidden} aria-hidden={hidden}>
      <a className="btn primary large" href={`#${target}`} tabIndex={hidden ? -1 : 0}><Icon name="hand" size={20} />{label}</a>
    </div>
  );
}
