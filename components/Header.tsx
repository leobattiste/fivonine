"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { Wordmark } from "./Brand";
import { LOCALE_COOKIE, localeNames, locales, t, type Locale } from "@/lib/i18n";
import { signOut } from "@/app/actions";

type Viewer = { name: string; admin: boolean; unread: number; avatar: string | null };

export default function Header({ locale, viewer }: { locale: Locale; viewer: Viewer | null }) {
  const d = t(locale), n = d.x.nav, path = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const [acct, setAcct] = useState(false);
  const acctRef = useRef<HTMLDivElement>(null);

  useEffect(() => { drawer.current?.close(); setAcct(false); }, [path]);
  useEffect(() => {
    if (!acct) return;
    const away = (e: MouseEvent) => { if (!acctRef.current?.contains(e.target as Node)) setAcct(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setAcct(false); (acctRef.current?.querySelector("button") as HTMLButtonElement | null)?.focus(); } };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [acct]);

  const L = (p: string) => `/${locale}${p}`;
  const links: [string, string][] = [["/explore", n.explore], ["/create", n.fundraiser], ["/how-it-works", n.how], ["/about", n.about]];
  const isActive = (href: string) => path.startsWith(L(href)) || (href === "/explore" && path.startsWith(L("/campaigns")));
  const switchLocale = (next: string) => {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    location.assign(path.replace(/^\/(ht|en|fr)(?=\/|$)/, `/${next}`) + location.search);
  };
  const language = (id: string) => (
    <label className="lang" htmlFor={id}>
      <Icon name="globe" size={17} />
      <span className="sr">{d.nav.language}</span>
      <select id={id} value={locale} onChange={(e) => switchLocale(e.target.value)}>
        {locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}
      </select>
    </label>
  );
  const initials = viewer ? viewer.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
  const accountItems = viewer && (
    <>
      <Link href={L("/dashboard")}><Icon name="dashboard" size={18} />{n.dashboard}</Link>
      <Link href={L("/dashboard?tab=saved")}><Icon name="bookmark" size={18} />{n.saved}</Link>
      <Link href={L("/dashboard?tab=notifications")}><Icon name="bell" size={18} />{n.notifications}{viewer.unread > 0 && <span className="count" aria-label={n.unread(viewer.unread)}>{viewer.unread}</span>}</Link>
      <Link href={L("/dashboard?tab=profile")}><Icon name="user" size={18} />{n.profile}</Link>
      {viewer.admin && <Link href={L("/admin")}><Icon name="settings" size={18} />{n.admin}</Link>}
      <hr />
      <form action={signOut}><input type="hidden" name="locale" value={locale} /><button><Icon name="logout" size={18} />{n.signOut}</button></form>
    </>
  );

  return (
    <header className="site-header">
      <a className="skip" href="#main">{d.nav.skip}</a>
      <div className="wrap header-bar">
        <Link className="wordmark" href={L("")} aria-label="yon kout men"><Wordmark /></Link>
        <nav className="main-nav" aria-label={d.nav.menu}>
          {links.map(([href, label]) => <Link key={href} href={L(href)} aria-current={isActive(href) ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="header-tools">
          <span className="only-wide">{language("lang-wide")}</span>
          {viewer ? (
            <div className="acct only-wide" ref={acctRef}>
              <button aria-expanded={acct} aria-haspopup="menu" onClick={() => setAcct((v) => !v)}>
                <span className="avatar" aria-hidden="true">{initials}</span>
                <span>{viewer.name.split(" ")[0]}</span>
                {viewer.unread > 0 && <span className="count" aria-label={n.unread(viewer.unread)}>{viewer.unread}</span>}
                <Icon name="down" size={16} />
              </button>
              {acct && <div className="pop" role="menu"><p className="who"><strong>{viewer.name}</strong>{n.account}</p>{accountItems}</div>}
            </div>
          ) : (
            <Link className="btn quiet only-wide" href={L("/login")}>{n.signIn}</Link>
          )}
          <button className="btn icon-only only-narrow menu-btn" onClick={() => drawer.current?.showModal()} aria-label={n.openMenu}>
            <Icon name="menu" />{viewer && viewer.unread > 0 && <span className="count" aria-hidden="true">{viewer.unread}</span>}
          </button>
        </div>
      </div>


      <dialog ref={drawer} className="drawer" aria-label={d.nav.menu} onClick={(e) => e.target === drawer.current && drawer.current?.close()}>
        <div className="drawer-head">
          <Link className="wordmark" href={L("")}><Wordmark /></Link>
          <button className="btn icon-only" onClick={() => drawer.current?.close()} aria-label={n.closeMenu}><Icon name="close" /></button>
        </div>
        <div className="drawer-body">
          <nav className="drawer-nav" aria-label={d.nav.menu}>
            {[["", d.nav.home] as [string, string], ...links].map(([href, label]) => <Link key={href} href={L(href)} aria-current={(href ? isActive(href) : path === L("")) ? "page" : undefined}>{label}<Icon name="right" /></Link>)}
          </nav>
          {viewer ? <div className="pop" style={{ position: "static", width: "auto", animation: "none", boxShadow: "none" }}><p className="who"><strong>{viewer.name}</strong>{n.account}</p>{accountItems}</div>
            : <Link className="btn wide" href={L("/login")}>{n.signIn}</Link>}
          {language("lang-drawer")}
        </div>
      </dialog>
    </header>
  );
}
