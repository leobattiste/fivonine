"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home", match: (p: string) => p === "/", icon: "M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/decades", label: "Decades", match: (p: string) => p.startsWith("/decades"), icon: "M4 5h16M4 10h11M4 15h14M4 20h8" },
  { href: "/threads", label: "Threads", match: (p: string) => p.startsWith("/threads"), icon: "M5 6a2 2 0 1 0 0-.01M19 12a2 2 0 1 0 0-.01M5 18a2 2 0 1 0 0-.01M7 6.5l10 5M17 12.5l-10 5" },
  { href: "/explore", label: "Search", match: (p: string) => p.startsWith("/explore"), icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5" },
];

/** Bottom tab bar on phones, within thumb reach. Hidden from tablet width up. */
export default function MobileTabBar() {
  const path = usePathname() || "/";
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-base/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden">
      <ul className="grid grid-cols-4">
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
