import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "./globals.css";
import { SITE } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";

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
      <body className="min-h-screen font-display">
        <SiteHeader />
        <main>{children}</main>
        <footer className="mt-24 border-t border-rule pb-[env(safe-area-inset-bottom)] sm:mt-32">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:grid-cols-[1.2fr_1fr_auto] sm:px-8">
            <div>
              <p className="text-lg font-bold tracking-tight">Fivonine</p>
              <p className="mt-3 max-w-xs text-sm text-dim">The story, the people, the legacy. A connected record of Haiti and Haitians.</p>
            </div>
            <p className="max-w-sm font-serif text-[0.95rem] leading-relaxed text-dim">
              Every entry links to its sources. Interpretations, disputed figures and open investigations are marked. When a decade
              has gaps, we say so instead of filling them.
            </p>
            <div className="flex flex-col gap-2 text-sm text-dim sm:items-end">
              <Link href="/explore" className="hover:text-fg">Explore</Link>
              <Link href="/donate" className="hover:text-fg">Donate</Link>
              <Link href="/contribute" className="hover:text-fg">Contribute</Link>
              <Link href="/about" className="hover:text-fg">About</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
