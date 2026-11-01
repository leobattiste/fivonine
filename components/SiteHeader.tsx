"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import L from "@/components/L";
import PrefsControls from "@/components/PrefsControls";
import { useT } from "@/components/Prefs";

const BROWSE = [
  { href: "/decades", titleEn: "Decades", titleFr: "Décennies", detailEn: "Browse history year by year", detailFr: "Parcourir l’histoire année par année" },
  { href: "/subjects", titleEn: "Subjects", titleFr: "Thèmes", detailEn: "Browse history by subject", detailFr: "Parcourir l’histoire par thème" },
  { href: "/people", titleEn: "Notable Figures", titleFr: "Personnalités marquantes", detailEn: "Explore the people who shaped Haiti", detailFr: "Découvrir les personnalités qui ont marqué Haïti" },
];
const OTHER = [
  { href: "/sources", label: <L en="Sources" fr="Sources" /> },
  { href: "/contribute", label: <L en="Contribute" fr="Contribuer" /> },
  { href: "/donate", label: <L en="Donate" fr="Faire un don" /> },
  { href: "/about", label: <L en="About" fr="À propos" /> },
];

export default function SiteHeader() {
  const path = usePathname() || "/";
  const t = useT();
  const [menu, setMenu] = useState(false);
  const active = (href: string) => path === href || path.startsWith(href + "/");

  useEffect(() => { setMenu(false); }, [path]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-base/95 backdrop-blur-md">
        <nav className="mx-auto flex h-[60px] max-w-[1240px] items-center justify-between px-4 sm:px-8" aria-label="Main navigation">
          <Link href="/" className="wordmark text-[1.15rem]">Fivonine</Link>
          <ul className="hidden items-center gap-1 text-sm lg:flex">
            {BROWSE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active(item.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 font-medium transition-colors ${active(item.href) ? "text-fg" : "text-dim hover:text-fg"}`}
                >{t(item.titleEn, item.titleFr)}</Link>
              </li>
            ))}
            <li aria-hidden="true" className="mx-1 h-5 w-px bg-rule" />
            {OTHER.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active(item.href) ? "page" : undefined}
                  className={`rounded-full px-3 py-2 transition-colors ${active(item.href) ? "text-fg" : "text-dim hover:text-fg"}`}
                >{item.label}</Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setMenu((value) => !value)}
            aria-expanded={menu}
            aria-controls="phone-menu"
            className="flex h-10 items-center gap-2 rounded-full border border-rule px-4 text-sm font-medium lg:hidden"
          >
            {menu ? <L en="Close" fr="Fermer" /> : <L en="Menu" fr="Menu" />}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
              {menu
                ? <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" />
                : <path d="M2 5h12M2 11h12" stroke="currentColor" strokeWidth="1.6" />}
            </svg>
          </button>
        </nav>
      </header>
      {menu && (
        <div id="phone-menu" className="fixed inset-x-0 bottom-0 top-[60px] z-40 overflow-y-auto bg-base px-5 pb-10 pt-4 lg:hidden">
          <h1 className="text-d-4"><L en="Explore" fr="Explorer" /></h1>
          <ul className="mt-2">
            {BROWSE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={active(item.href) ? "page" : undefined} onClick={() => setMenu(false)} className="block border-b border-rule py-3.5">
                  <span className="block text-base font-normal leading-relaxed text-fg">{t(item.titleEn, item.titleFr)}</span>
                  <span className="mt-1 block text-sm text-dim">{t(item.detailEn, item.detailFr)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/explore#search" onClick={() => setMenu(false)} className="mt-4 block border-b border-rule py-3 text-sm text-dim">
            <L en="Search the archive" fr="Rechercher dans les archives" />
          </Link>
          <ul className="mt-8 space-y-1">
            {OTHER.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={active(item.href) ? "page" : undefined} onClick={() => setMenu(false)} className="block py-2"><h1 className="text-d-4">{item.label}</h1></Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-rule pt-6"><PrefsControls /></div>
        </div>
      )}
    </>
  );
}
