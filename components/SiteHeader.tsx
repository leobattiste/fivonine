"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const EXPLORE = [
  { href: "/decades", label: "Decades", line: "Each period as a year-by-year timeline" },
  { href: "/events", label: "Events", line: "The whole history on one timeline" },
  { href: "/people", label: "Figures", line: "The people who shaped Haiti" },
  { href: "/subjects", label: "Subjects", line: "Politics, music, the economy and more" },
  { href: "/explore#search", label: "Search", line: "Find a year, a name, a place" },
];
const MAIN = [
  { href: "/donate", label: "Donate" },
  { href: "/contribute", label: "Contribute" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const path = usePathname() || "/";
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const dropRef = useRef<HTMLLIElement>(null);

  // Close menus on navigation
  useEffect(() => { setMenu(false); setDrop(false); }, [path]);

  // Lock page scroll behind the phone menu; Escape closes everything
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setDrop(false); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [menu]);

  // Click outside closes the Explore dropdown
  useEffect(() => {
    if (!drop) return;
    const onDown = (e: MouseEvent) => { if (!dropRef.current?.contains(e.target as Node)) setDrop(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [drop]);

  const exploreOn = EXPLORE.some((x) => path.startsWith(x.href.split("#")[0])) || path.startsWith("/explore");
  const isOn = (href: string) => path.startsWith(href);

  return (
    <>
    <header className="sticky top-0 z-40 bg-base/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[60px] max-w-[1240px] items-center justify-between px-4 sm:px-8" aria-label="Main">
        <Link href="/" className="text-[1.25rem] font-bold tracking-tight">Fivonine</Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 text-sm sm:flex">
          <li ref={dropRef} className="relative">
            <button
              onClick={() => setDrop((d) => !d)}
              aria-expanded={drop}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 ${exploreOn ? "text-fg" : "text-dim hover:text-fg"}`}
            >
              Explore
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`transition-transform ${drop ? "rotate-180" : ""}`}>
                <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            {drop && (
              <div className="absolute left-1/2 top-full mt-2 w-80 -translate-x-1/2 rounded-2xl border border-rule bg-base p-2 shadow-xl shadow-black/5">
                {EXPLORE.map((x) => (
                  <Link key={x.href} href={x.href} className="block rounded-xl px-4 py-3 hover:bg-raise">
                    <span className="block font-medium">{x.label}</span>
                    <span className="block text-sm text-dim">{x.line}</span>
                  </Link>
                ))}
              </div>
            )}
          </li>
          {MAIN.map((x) => (
            <li key={x.href}>
              <Link href={x.href} className={`rounded-full px-3 py-2 ${isOn(x.href) ? "text-fg" : "text-dim hover:text-fg"}`}>{x.label}</Link>
            </li>
          ))}
        </ul>

        {/* Phone */}
        <button
          onClick={() => setMenu((m) => !m)}
          aria-expanded={menu}
          aria-controls="phone-menu"
          className="flex h-10 items-center gap-2 rounded-full border border-rule px-4 text-sm font-medium sm:hidden"
        >
          {menu ? "Close" : "Menu"}
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            {menu ? <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" /> : <path d="M2 5h12M2 11h12" stroke="currentColor" strokeWidth="1.6" />}
          </svg>
        </button>
      </nav>
    </header>

      {/* Outside the header: its blur would otherwise trap this fixed panel inside the bar */}
      {menu && (
        <div id="phone-menu" className="fixed inset-x-0 bottom-0 top-[60px] z-40 overflow-y-auto bg-base px-5 pb-10 pt-4 sm:hidden">
          <p className="label">Explore</p>
          <ul className="mt-2">
            {EXPLORE.map((x) => (
              <li key={x.href}>
                <Link href={x.href} className="block border-b border-rule py-3.5">
                  <span className="block text-xl font-semibold">{x.label}</span>
                  <span className="block text-sm text-dim">{x.line}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-8 space-y-1">
            {MAIN.map((x) => (
              <li key={x.href}>
                <Link href={x.href} className="block py-2 text-3xl font-bold tracking-tight">{x.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
