"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Icon from "./Icon";
import { t, type Locale } from "@/lib/i18n";
export default function Navigation({ locale }: { locale: Locale }) {
  const d = t(locale);
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.close();
  }, [path]);
  const link = (href: string, label: string) => (
    <Link
      key={href}
      href={`/${locale}/${href}`}
      aria-current={path.startsWith(`/${locale}/${href}`) ? "page" : undefined}
      onClick={() => dialog.current?.close()}
    >
      {label}
    </Link>
  );
  return (
    <>
      <header className="site-header">
        <Link
          href={`/${locale}`}
          className="wordmark"
          aria-label="fivonine home"
        >
          fivonine<span className="brand-dot">.</span>
        </Link>
        <nav className="desktop-nav" aria-label={d.menu}>
          {link("explore", d.explore)}
          {link("how-it-works", d.how)}
          {link("about", d.about)}
          {link("dashboard", d.dashboard)}
        </nav>
        <div className="header-actions">
          <label className="language">
            <Icon name="globe" />
            <select
              aria-label="Language"
              value={locale}
              onChange={(e) =>
                location.assign(
                  path.replace(/^\/(ht|en|fr)(?=\/|$)/, `/${e.target.value}`) +
                    location.search,
                )
              }
            >
              <option value="ht">Kreyòl</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>
          <Link className="header-signin" href={`/${locale}/login`}>
            {d.login}
          </Link>
          <Link className="button header-submit" href={`/${locale}/submit`}>
            {d.create}
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={d.menu}
            aria-haspopup="dialog"
            aria-controls="site-menu"
            onClick={() => dialog.current?.showModal()}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <dialog
        id="site-menu"
        className="menu-sheet"
        ref={dialog}
        aria-label={d.menu}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="modal-head">
          <span className="wordmark">fivonine.</span>
          <button
            type="button"
            className="bare"
            aria-label={d.close}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className="menu-list">
          {[
            ["explore", d.explore],
            ["submit", d.create],
            ["dashboard", d.dashboard],
            ["how-it-works", d.how],
            ["about", d.about],
            ["help", d.help],
            ["contact", d.contact],
            ["admin", d.admin],
            ["login", d.login],
          ].map(([href, label]) => link(href, label))}
        </nav>
        <p className="menu-foot">{d.tagline}</p>
      </dialog>
    </>
  );
}
