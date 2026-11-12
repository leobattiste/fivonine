"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { LOCALE_COOKIE, localeNames, locales, t, type Locale } from "@/lib/i18n";
export default function Header({ locale, viewer }: { locale: Locale; viewer: { name: string; admin: boolean; unread: number } | null }) {
  const d = t(locale).nav, path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.close();
  }, [path]);
  const links: [string, string][] = [["", d.home], ["/donate", d.donate], ["/create", d.create], ["/how-it-works", d.how], ["/about", d.about]];
  const active = (href: string) => (href === "" ? path === `/${locale}` : path.startsWith(`/${locale}${href}`));
  const nav = links.map(([href, label]) => (
    <Link key={href} href={`/${locale}${href}`} aria-current={active(href) ? "page" : undefined}>{label}</Link>
  ));
  const switchLocale = (next: string) => {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    location.assign(path.replace(/^\/(ht|en|fr)(?=\/|$)/, `/${next}`) + location.search);
  };
  const language = (
    <label className="lang">
      <Icon name="globe" size={18} />
      <span className="sr">{d.language}</span>
      <select aria-label={d.language} value={locale} onChange={(e) => switchLocale(e.target.value)}>
        {locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}
      </select>
    </label>
  );
  const account = viewer ? (
    <Link className="btn small" href={`/${locale}/dashboard`}>
      <Icon name="user" size={18} />
      <span>{d.dashboard}</span>
      {viewer.unread > 0 && <span className="dot" aria-label={String(viewer.unread)}>{viewer.unread}</span>}
    </Link>
  ) : (
    <Link className="btn small" href={`/${locale}/login`}>{d.signIn}</Link>
  );
  return (
    <header className="site-header">
      <a className="skip" href="#main">{d.skip}</a>
      <div className="wrap header-inner">
        <Link className="wordmark" href={`/${locale}`} aria-label="Fivonine">fivonine</Link>
        <nav className="desktop-nav" aria-label={d.menu}>{nav}</nav>
        <div className="header-actions">
          {language}
          <span className="desktop-only">{viewer?.admin && <Link className="btn small ghost" href={`/${locale}/admin`}>{d.admin}</Link>}</span>
          <span className="desktop-only">{account}</span>
          <button className="icon-btn mobile-only" onClick={() => dialog.current?.showModal()} aria-label={d.menu}><Icon name="menu" /></button>
        </div>
      </div>
      <dialog ref={dialog} className="menu" onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="menu-inner">
          <div className="menu-top">
            <span className="wordmark">fivonine</span>
            <button className="icon-btn" onClick={() => dialog.current?.close()} aria-label={d.close}><Icon name="close" /></button>
          </div>
          <nav aria-label={d.menu}>{nav}</nav>
          <div className="menu-foot">
            {account}
            {viewer?.admin && <Link className="btn small ghost" href={`/${locale}/admin`}>{d.admin}</Link>}
          </div>
        </div>
      </dialog>
    </header>
  );
}
