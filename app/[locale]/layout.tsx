import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { isLocale, t, locales } from "@/lib/i18n";
import { preview } from "@/lib/data";
import { SITE_URL } from "@/lib/supabase/config";
import "../globals.css";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "fivonine — " + t(locale).tagline,
      template: "%s | fivonine",
    },
    description: t(locale).intro,
    robots: {
      index: process.env.PUBLIC_LAUNCH === "true" && !preview,
      follow: process.env.PUBLIC_LAUNCH === "true" && !preview,
    },
    openGraph: { siteName: "fivonine", type: "website" },
  };
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  return (
    <html lang={locale}>
      <body>
        <a className="skip" href="#main">
          {locale === "ht"
            ? "Ale nan kontni an"
            : locale === "fr"
              ? "Aller au contenu"
              : "Skip to content"}
        </a>
        <Navigation locale={locale} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="footer">
          <div>
            <Link className="wordmark" href={`/${locale}`}>
              fivonine.
            </Link>
            <p>{d.footer}</p>
          </div>
          <nav aria-label={d.help}>
            {[
              ["about", d.about],
              ["how-it-works", d.how],
              ["help", d.help],
              ["contact", d.contact],
              ["legal#privacy", d.privacy],
              ["legal#terms", d.terms],
              ["legal#guidelines", d.guidelines],
              ["legal#review", d.verification],
              ["legal#donations", d.disclosures],
            ].map(([href, label]) => (
              <Link key={href} href={`/${locale}/${href}`}>
                {label}
              </Link>
            ))}
          </nav>
          <p className="footer-disclosure">{d.disclosure}</p>
          <small>{d.rights}</small>
        </footer>
      </body>
    </html>
  );
}
