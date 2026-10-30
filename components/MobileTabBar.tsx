"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/decades", label: "Decades", match: (p: string) => p === "/" || p.startsWith("/decades"), icon: "M4 5h16M4 10h11M4 15h14M4 20h8" },
  { href: "/events", label: "Events", match: (p: string) => p.startsWith("/events"), icon: "M12 3v18M12 7h6M12 12H6M12 17h6M18 7a1 1 0 1 0 0 .01M6 12a1 1 0 1 0 0 .01M18 17a1 1 0 1 0 0 .01" },
  { href: "/people", label: "Figures", match: (p: string) => p.startsWith("/people"), icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { href: "/subjects", label: "Subjects", match: (p: string) => p.startsWith("/subjects") || p.startsWith("/threads"), icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { href: "/explore", label: "Search", match: (p: string) => p.startsWith("/explore"), icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5" },
];

/** Bottom tab bar on phones, within thumb reach. Hidden from tablet width up. */
export default function MobileTabBar() {
  const path = usePathname() || "/";
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-base/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
      <ul className="grid grid-cols-5">
        {TABS.map((t) => {
          const on = t.match(path);
          return (
            <li key={t.href}>
              <Link href={t.href} aria-current={on ? "page" : undefined} className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${on ? "text-fg" : "text-dim"}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={t.icon} />
                </svg>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
