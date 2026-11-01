"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import L from "@/components/L";
import PrefsControls from "@/components/PrefsControls";
import { useT } from "@/components/Prefs";

const BROWSE = [
  { href: "/decades", titleEn: "Decades", titleFr: "Décennies", detailEn: "Browse history year by year", detailFr: "Parcourir l’histoire année par année" },
  { href: "/subjects", titleEn: "Subjects", titleFr: "Thèmes", detailEn: "Browse history by subject", detailFr: "Parcourir l’histoire par thème" },
  { href: "/people", titleEn: "Notable Figures", titleFr: "Personnalités marquantes", detailEn: "Explore the people who shaped Haiti", detailFr: "Découvrir les personnalités qui ont marqué Haïti" },
];
const OTHER = [
  { href: "/search", label: <L en="Search" fr="Recherche" /> },
  { href: "/contribute", label: <L en="Contribute" fr="Contribuer" /> },
  { href: "/donate", label: <L en="Donate" fr="Faire un don" /> },
];

function MenuContent({
  currentPath, onNavigate, t,
}: {
  currentPath: string;
  onNavigate: () => void;
  t: (en: string, fr?: string) => string;
}) {
  const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + "/");

  return (
    <>
      <h1 className="text-d-4"><L en="Explore" fr="Explorer" /></h1>
      <ul className="mt-2">
        {BROWSE.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={onNavigate}
              className="block border-b border-rule py-3.5 hover:text-dim"
            >
              <span className="block text-base font-normal leading-relaxed text-fg">
                {t(item.titleEn, item.titleFr)}
              </span>
              <span className="mt-1 block text-sm text-dim">
                {t(item.detailEn, item.detailFr)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="mt-8 space-y-1">
        {OTHER.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={onNavigate}
              className="block py-2 hover:text-dim"
            >
              <h1 className="text-d-4">{item.label}</h1>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 border-t border-rule pt-6"><PrefsControls /></div>
    </>
  );
}

export default function SiteHeader() {
  const path = usePathname() || "/";
  const t = useT();
  const [menu, setMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenu(false); }, [path]);

  useEffect(() => {
    if (!menu) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (!isDesktop) document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return;
      const target = event.target as Node;
      if (!buttonRef.current?.contains(target) && !floatingRef.current?.contains(target)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menu]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-base/95 backdrop-blur-md">
        <nav className="mx-auto flex h-[60px] max-w-[1240px] items-center justify-between px-4 sm:px-8" aria-label="Main navigation">
          <Link href="/" className="wordmark text-[1.15rem]">Fivonine</Link>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMenu((value) => !value)}
            aria-expanded={menu}
            aria-controls="mobile-site-menu desktop-site-menu"
            className="flex h-10 items-center gap-2 rounded-full border border-rule px-4 text-sm font-medium hover:border-fg"
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
        <>
          <div
            id="mobile-site-menu"
            className="fixed inset-x-0 bottom-0 top-[60px] z-40 overflow-y-auto bg-base px-5 pb-10 pt-4 lg:hidden"
          >
            <MenuContent currentPath={path} onNavigate={() => setMenu(false)} t={t} />
          </div>
          <div
            ref={floatingRef}
            id="desktop-site-menu"
            className="fixed right-8 top-[72px] z-50 hidden max-h-[calc(100dvh-90px)] w-[26rem] overflow-y-auto rounded-2xl border border-rule bg-base px-7 pb-7 pt-6 shadow-xl shadow-black/10 lg:block"
          >
            <MenuContent currentPath={path} onNavigate={() => setMenu(false)} t={t} />
          </div>
        </>
      )}
    </>
  );
}
