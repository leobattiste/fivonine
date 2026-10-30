import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "./globals.css";
import { SITE } from "@/lib/site";
import MobileTabBar from "@/components/MobileTabBar";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, type: "website", images: ["/api/og"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#FFFFFF", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] font-display sm:pb-0">
        <header className="sticky top-0 z-40 bg-base/95 backdrop-blur-md">
          <nav className="mx-auto flex h-[60px] max-w-[1240px] items-center justify-between px-4 sm:px-8">
            <Link href="/" className="flex items-center gap-2.5 text-[1.05rem] font-semibold tracking-tight">
              <Mark /> Fivonine
            </Link>
            <div className="flex items-center text-sm text-dim">
              {[["/decades", "Decades"], ["/events", "Events"], ["/people", "Figures"], ["/subjects", "Subjects"]].map(([href, label]) => (
                <Link key={href} href={href} className="hidden rounded-full px-3 py-2 hover:text-fg sm:block">{label}</Link>
              ))}
              <Link href="/explore" aria-label="Search" className="ml-1 hidden h-10 w-10 place-items-center rounded-full border border-rule text-fg hover:border-fg sm:flex sm:h-auto sm:w-auto sm:gap-2 sm:px-3.5 sm:py-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <span className="hidden sm:inline">Search</span>
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <MobileTabBar />
        <footer className="mt-24 border-t border-rule sm:mt-32">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:grid-cols-[1.2fr_1fr_auto] sm:px-8">
            <div>
              <p className="flex items-center gap-2.5 font-semibold"><Mark /> Fivonine</p>
              <p className="mt-3 max-w-xs text-sm text-dim">The story, the people, the legacy. A connected record of Haiti and Haitians.</p>
            </div>
            <p className="max-w-sm font-serif text-[0.95rem] leading-relaxed text-dim">
              Every entry links to its sources. Interpretations, disputed figures and open investigations are marked. When a decade
              has gaps, we say so instead of filling them.
            </p>
            <div className="flex flex-col gap-2 text-sm text-dim sm:items-end">
              <Link href="/explore" className="hover:text-fg">Search the record</Link>
              <Link href="/events" className="hover:text-fg">Every event</Link>
              <Link href="/people" className="hover:text-fg">Figures</Link>
              <Link href="/threads" className="hover:text-fg">Threads</Link>
              <a href="mailto:hello@fivonine.com?subject=Correction" className="hover:text-fg">Suggest a correction</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

/** Logomark: three stacked strata, one per dimension. */
function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <rect x="1" y="3" width="20" height="4" rx="2" fill="#0A0A0A" />
      <rect x="1" y="9" width="14" height="4" rx="2" fill="#8A8A87" />
      <rect x="1" y="15" width="17" height="4" rx="2" fill="#C8C8C5" />
    </svg>
  );
}
