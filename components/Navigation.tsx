"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { t, type Locale } from "@/lib/i18n";
export default function Navigation({ locale }: { locale: Locale }) {
  const d = t(locale),
    path = usePathname(),
    dialog = useRef<HTMLDialogElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    dialog.current?.close();
    const read = () => setScrolled(scrollY > 300);
    read();
    addEventListener("scroll", read, { passive: true });
    return () => removeEventListener("scroll", read);
  }, [path]);
  const tabs = [
    ["explore", "search", d.explore],
    ["submit", "plus", d.submit],
    ["dashboard", "userCircle", d.dashboard],
    ["about", "heart", d.about],
  ] as const;
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
        <span className="header-note">{d.tagline}</span>
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
      </header>
      <nav className="tab-bar" aria-label={d.explore}>
        {tabs.map(([href, icon, label]) => (
          <Link
            key={href}
            href={`/${locale}/${href}`}
            aria-label={label}
            title={label}
            aria-current={
              path.startsWith(`/${locale}/${href}`) ? "page" : undefined
            }
          >
            <Icon name={icon} />
          </Link>
        ))}
        <button
          type="button"
          aria-label={d.menu}
          title={d.menu}
          onClick={() => dialog.current?.showModal()}
        >
          <Icon name="moreCircle" />
        </button>
      </nav>
      {scrolled && (
        <button
          type="button"
          className="back-to-top"
          aria-label={d.top}
          title={d.top}
          onClick={() => {
            scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
            document
              .querySelector<HTMLElement>("#main")
              ?.focus({ preventScroll: true });
          }}
        >
          <Icon name="arrowUp" />
        </button>
      )}
      <dialog
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
            className="bare"
            aria-label={d.close}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <nav className="menu-list">
          {[
            ["help", d.help],
            ["how-it-works", d.how],
            ["contact", d.contact],
            ["admin", d.admin],
            ["login", d.login],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={`/${locale}/${href}`}
              onClick={() => dialog.current?.close()}
            >
              {label}
              <Icon name="arrowRight" />
            </Link>
          ))}
        </nav>
        <div className="menu-foot">
          {["about", "contact", "legal"].map((href, i) => (
            <Link
              key={href}
              href={`/${locale}/${href}`}
              onClick={() => dialog.current?.close()}
            >
              {[d.about, d.contact, d.terms][i]}
            </Link>
          ))}
          <p>{d.rights}</p>
        </div>
      </dialog>
    </>
  );
}
