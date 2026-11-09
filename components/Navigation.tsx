"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Icon from "./Icon";
import { t, categoryKeys, type Locale } from "@/lib/i18n";
import { platform } from "@/lib/platform-content";
export default function Navigation({ locale }: { locale: Locale }) {
  const d = t(locale);
  const p = platform[locale];
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.close();
    document
      .querySelectorAll(".nav-dropdown[open]")
      .forEach((el) => el.removeAttribute("open"));
  }, [path]);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) =>
      document
        .querySelectorAll<HTMLDetailsElement>(".nav-dropdown[open]")
        .forEach((el) => {
          if (!el.contains(event.target as Node)) el.open = false;
        });
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        document
          .querySelectorAll<HTMLDetailsElement>(".nav-dropdown[open]")
          .forEach((el) => {
            el.open = false;
            el.querySelector<HTMLElement>("summary")?.focus();
          });
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
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
          <details className="nav-dropdown">
            <summary>
              {p.fundraise}
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="nav-dropdown-panel">
              <Link href={`/${locale}/causes`}>{p.causes}</Link>
              {categoryKeys.map((c) => link(`causes/${c}`, d[c]))}
              {link("resources", p.resources)}
              {link("how-it-works", d.how)}
            </div>
          </details>
          <details className="nav-dropdown">
            <summary>
              {d.about}
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="nav-dropdown-panel">
              {link("about", d.about)}
              {link("safety", p.safety)}
              {link("pricing", p.pricing)}
              {link("help", d.help)}
              {link("contact", d.contact)}
            </div>
          </details>
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
            ["causes", p.causes],
            ["resources", p.resources],
            ["safety", p.safety],
            ["pricing", p.pricing],
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
