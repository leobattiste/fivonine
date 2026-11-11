"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Icon from "./Icon";
import { t, type Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-content";
export default function Navigation({ locale }: { locale: Locale }) {
  const d = t(locale),
    p = platform[locale],
    path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.close();
  }, [path]);
  const links = [
    ["explore", d.explore],
    ["how-it-works", d.how],
    ["about", d.about],
  ];
  const renderLink = ([href, label]: string[]) => (
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
        <div className="header-inner">
          <Link
            className="wordmark"
            href={`/${locale}`}
            aria-label="Pote Kole home"
          >
            pote kole<span>.</span>
          </Link>
          <nav className="desktop-nav" aria-label={d.menu}>
            {links.map(renderLink)}
          </nav>
          <div className="header-actions">
            <label className="language">
              <Icon name="globe" />
              <select
                aria-label="Language"
                value={locale}
                onChange={(e) => {
                  document.cookie = `pote-kole-locale=${e.target.value};path=/;max-age=31536000;SameSite=Lax`;
                  location.assign(
                    path.replace(
                      /^\/(ht|en|fr)(?=\/|$)/,
                      `/${e.target.value}`,
                    ) + location.search,
                  );
                }}
              >
                <option value="ht">Kreyòl</option>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </label>
            <Link className="button header-submit" href={`/${locale}/submit`}>
              {d.create}
              <Icon name="plus" />
            </Link>
            <button
              className="menu-toggle bare"
              type="button"
              aria-label={d.menu}
              aria-controls="site-menu"
              aria-haspopup="dialog"
              onClick={() => dialog.current?.showModal()}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <dialog
        className="menu-sheet"
        id="site-menu"
        ref={dialog}
        aria-label={d.menu}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="modal-head">
          <Link className="wordmark" href={`/${locale}`}>
            pote kole.
          </Link>
          <button
            className="bare"
            type="button"
            aria-label={d.close}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className="menu-list">
          {[
            ...links,
            ["help", d.help],
            ["resources", p.resources],
            ["safety", p.safety],
            ["dashboard", d.dashboard],
            ["login", d.login],
          ].map(renderLink)}
        </nav>
        <Link
          className="button menu-submit"
          href={`/${locale}/submit`}
          onClick={() => dialog.current?.close()}
        >
          {d.create}
          <Icon name="plus" />
        </Link>
        <p className="menu-foot">{d.tagline}</p>
      </dialog>
    </>
  );
}
