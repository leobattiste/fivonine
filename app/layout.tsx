import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/bowlby-one/400.css";
import "./globals.css";
import { SITE } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import PersonModalProvider from "@/components/PersonModal";
import PrefsProvider, { PREFS_SCRIPT } from "@/components/Prefs";
import L from "@/components/L";

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
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: PREFS_SCRIPT }} /></head>
      <body className="min-h-screen font-display">
        <PrefsProvider>
        <SiteHeader />
        <PersonModalProvider>
          <main>{children}</main>
        </PersonModalProvider>
        <footer className="mt-24 border-t border-rule pb-[env(safe-area-inset-bottom)] sm:mt-32">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:grid-cols-[1.2fr_1fr_auto] sm:px-8">
            <div>
              <p className="wordmark text-lg">Fivonine</p>
              <p className="mt-3 max-w-xs text-sm text-dim"><L en="The story, the people, the legacy. A connected record of Haiti and Haitians." fr="L’histoire, les personnes, l’héritage. Un récit relié d’Haïti et des Haïtiens." /></p>
            </div>
            <p className="max-w-sm font-serif text-[0.95rem] leading-relaxed text-dim">
              <L en="Every entry is sourced. When a decade has gaps, we say so instead of filling them." fr="Chaque entrée est sourcée. Quand une décennie présente des lacunes, nous le disons au lieu de les combler." />
            </p>
            <div className="flex flex-col gap-2 text-sm text-dim sm:items-end">
              <Link href="/explore" className="hover:text-fg"><L en="Explore" fr="Explorer" /></Link>
              <Link href="/sources" className="hover:text-fg"><L en="Sources" fr="Sources" /></Link>
              <Link href="/donate" className="hover:text-fg"><L en="Donate" fr="Faire un don" /></Link>
              <Link href="/contribute" className="hover:text-fg"><L en="Contribute" fr="Contribuer" /></Link>
              <Link href="/about" className="hover:text-fg"><L en="About" fr="À propos" /></Link>
            </div>
          </div>
        </footer>
        </PrefsProvider>
      </body>
    </html>
  );
}
