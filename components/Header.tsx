"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { followUp } from "@/lib/dict/follow-up";
import Icon from "./Icon";
import { Wordmark } from "./Brand";
import { LOCALE_COOKIE, localeNames, locales, localizedPath, t, type Locale } from "@/lib/i18n";
import { signOut } from "@/app/actions";
import { mediaUrl } from "@/lib/format";

type Viewer = { name: string; admin: boolean; unread: number; avatar: string | null; mine: { id: string; title: string; status: string; cover: string | null }[] };

export default function Header({ locale, viewer }: { locale: Locale; viewer: Viewer | null }) {
  const d = t(locale), n = d.x.nav, m = followUp[locale].menu, path = usePathname();
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
  const switchLocale = (next: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    location.assign(localizedPath(path + location.search + location.hash, next));
  };
  const language = (id: string) => (
    <label className="lang" htmlFor={id}>
      <Icon name="language" size={17} />
      <span className="sr">{d.nav.language}</span>
      <select id={id} value={locale} onChange={(e) => switchLocale(e.target.value as Locale)}>
        {locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}
      </select>
    </label>
  );
  const initials = viewer ? viewer.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "";
  const accountItems = (includeProfile: boolean) => viewer && (
    <>
      {includeProfile && <Link href={L("/dashboard")}><Icon name="userCircle" size={18} />{n.profile}</Link>}
      <Link href={L("/dashboard?tab=campaigns")}><Icon name="hand" size={18} />{n.fundraisers}</Link>
      <Link href={L("/dashboard?tab=support")}><Icon name="heart" size={18} />{followUp[locale].mine.tab}</Link>
      <Link href={L("/dashboard?tab=saved")}><Icon name="bookmark" size={18} />{n.saved}</Link>
      <Link href={L("/dashboard?tab=notifications")}><Icon name="bell" size={18} />{n.notifications}{viewer.unread > 0 && <span className="count" aria-label={n.unread(viewer.unread)}>{viewer.unread}</span>}</Link>
      <Link href={L("/dashboard?tab=settings")}><Icon name="settings" size={18} />{n.settings}</Link>
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
              {acct && <div className="pop" role="menu"><p className="who"><strong>{viewer.name}</strong>{n.account}</p>{accountItems(true)}</div>}
            </div>
          ) : (
            <Link className="btn quiet only-wide" href={L("/login")}>{n.signIn}</Link>
          )}
          <label className="lang lang-icon only-narrow" htmlFor="lang-mobile">
            <Icon name="language" size={24} />
            <span className="sr">{d.nav.language}</span>
            <select id="lang-mobile" aria-label={d.nav.language} value={locale} onChange={(e) => switchLocale(e.target.value as Locale)}>
              {locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}
            </select>
          </label>
          <Link
            className="btn icon-only only-narrow header-account-icon"
            href={viewer ? L("/dashboard") : L("/login")}
            aria-label={viewer ? n.profile : n.signIn}
          >
            <Icon name="userCircle" size={24} />
          </Link>
          <button className="btn icon-only only-narrow menu-btn" onClick={() => drawer.current?.showModal()} aria-label={n.openMenu}>
            <Icon name="menu" size={26} />
          </button>
        </div>
      </div>


      <dialog ref={drawer} className="drawer" aria-label={d.nav.menu} onClick={(e) => e.target === drawer.current && drawer.current?.close()}>
        <div className="drawer-head">
          <Link className="wordmark" href={L("")}><Wordmark /></Link>
          <button className="btn icon-only close-control" autoFocus onClick={() => drawer.current?.close()} aria-label={n.closeMenu}><Icon name="x" size={26} /></button>
        </div>
        <div className="drawer-body">
          <nav className="drawer-menu" aria-label={d.nav.menu}>
            {viewer ? (
              <>
                <Link className="drawer-row" href={L("/dashboard")}><span className="r-t">{n.profile}</span><Icon name="right" size={22} /></Link>
                <Link className="drawer-row" href={L("/dashboard?tab=campaigns")}><span className="r-t">{m.fundraisers}</span><Icon name="right" size={22} /></Link>
                {viewer.mine.length > 0 ? viewer.mine.map((c) => {
                  const open = c.status === "draft" || c.status === "needs_changes";
                  const img = mediaUrl(c.cover);
                  return (
                    <Link key={c.id} className="drawer-camp" href={L(`/dashboard/campaigns/${c.id}${open ? "/edit" : ""}`)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {img ? <img src={img} alt="" width={64} height={64} /> : <span className="ph" aria-hidden="true" />}
                      <span><strong>{c.title}</strong><small>{(d.status as Record<string, string>)[c.status] ?? c.status}{open ? ` · ${m.cont}` : ""}</small></span>
                    </Link>
                  );
                }) : <Link className="drawer-camp empty" href={L("/create")}><span className="ph" aria-hidden="true"><Icon name="plus" size={22} /></span><span><strong>{m.start}</strong></span></Link>}
                <Link className="drawer-row" href={L("/dashboard?tab=support")}><span><span className="r-t">{m.impact}</span><small>{m.impactSub}</small></span><Icon name="right" size={22} /></Link>
                <Link className="drawer-row" href={L("/dashboard?tab=notifications")}><span className="r-t">{n.notifications}{viewer.unread > 0 && <span className="count" aria-label={n.unread(viewer.unread)}>{viewer.unread}</span>}</span><Icon name="right" size={22} /></Link>
                <Link className="drawer-row" href={L("/dashboard?tab=settings")}><span className="r-t">{n.settings}</span><Icon name="right" size={22} /></Link>
                {viewer.admin && <Link className="drawer-row" href={L("/admin")}><span className="r-t">{n.admin}</span><Icon name="right" size={22} /></Link>}
              </>
            ) : (
              <Link className="drawer-row" href={L("/login")}><span><span className="r-t">{m.signIn}</span><small>{m.signInSub}</small></span><Icon name="right" size={22} /></Link>
            )}
            <hr className="drawer-rule" />
            {([["/explore", n.explore, m.donateSub], ["/create", n.fundraiser, m.fundraiseSub]] as [string, string, string][]).map(([href, label, sub]) => (
              <Link key={href} className="drawer-row" href={L(href)} aria-current={isActive(href) ? "page" : undefined}><span><span className="r-t">{label}</span><small>{sub}</small></span><Icon name="right" size={22} /></Link>
            ))}
            <details className="drawer-about" open={["/about", "/how-it-works", "/help"].some(isActive) || undefined}>
              <summary className="drawer-row"><span className="r-t">{n.about}</span><span className="pm" aria-hidden="true" /></summary>
              <div className="drawer-sub">
                {([["/about", m.who], ["/how-it-works", m.how], ["/help", m.help]] as [string, string][]).map(([href, label]) => (
                  <Link key={href} href={L(href)} aria-current={isActive(href) ? "page" : undefined}>{label}</Link>
                ))}
              </div>
            </details>
            {viewer && <form action={signOut} className="drawer-out"><input type="hidden" name="locale" value={locale} /><button><Icon name="logout" size={20} />{n.signOut}</button></form>}
          </nav>
        </div>
      </dialog>
    </header>
  );
}
