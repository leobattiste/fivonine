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
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <div className="grid gap-x-12 gap-y-12 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,1fr))] lg:py-20">
              <div className="sm:col-span-2 lg:col-span-1">
                <Link href="/" className="wordmark text-xl hover:opacity-75">Fivonine</Link>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-dim">
                  <L en="The story, the people, the legacy. A connected record of Haiti and Haitians."
                     fr="L’histoire, les personnes, l’héritage. Un récit relié d’Haïti et des Haïtiens." />
                </p>
              </div>
              <nav aria-label="Explore the archive">
                <h2 className="text-base"><L en="Explore" fr="Explorer" /></h2>
                <ul className="mt-5 space-y-3 text-sm text-dim">
                  <li><Link href="/decades" className="hover:text-fg"><L en="Decades" fr="Décennies" /></Link></li>
                  <li><Link href="/subjects" className="hover:text-fg"><L en="Subjects" fr="Thèmes" /></Link></li>
                  <li><Link href="/people" className="hover:text-fg"><L en="Notable Figures" fr="Personnalités marquantes" /></Link></li>
                  <li><Link href="/search" className="hover:text-fg"><L en="Search" fr="Recherche" /></Link></li>
                </ul>
              </nav>
              <nav aria-label="Participate">
                <h2 className="text-base"><L en="Get involved" fr="Participer" /></h2>
                <ul className="mt-5 space-y-3 text-sm text-dim">
                  <li><Link href="/contribute" className="hover:text-fg"><L en="Contribute" fr="Contribuer" /></Link></li>
                  <li><Link href="/donate" className="hover:text-fg"><L en="Donate" fr="Faire un don" /></Link></li>
                </ul>
              </nav>
              <nav aria-label="About Fivonine">
                <h2 className="text-base"><L en="Information" fr="Informations" /></h2>
                <ul className="mt-5 space-y-3 text-sm text-dim">
                  <li><Link href="/about" className="hover:text-fg"><L en="About" fr="À propos" /></Link></li>
                  <li><Link href="/sources" className="hover:text-fg"><L en="Sources" fr="Sources" /></Link></li>
                </ul>
              </nav>
            </div>
            <div className="flex flex-col gap-2 border-t border-rule py-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Fivonine</p>
              <p><L en="A connected history of Haiti and Haitians." fr="Une histoire reliée d’Haïti et des Haïtiens." /></p>
            </div>
          </div>
        </footer>
        </PrefsProvider>
      </body>
    </html>
  );
}
