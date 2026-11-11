import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { platform } from "@/lib/platform-content";
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
      default: "Pote Kole — " + t(locale).tagline,
      template: "%s | Pote Kole",
    },
    description: t(locale).intro,
    robots: {
      index: process.env.PUBLIC_LAUNCH === "true" && !preview,
      follow: process.env.PUBLIC_LAUNCH === "true" && !preview,
    },
    openGraph: { siteName: "Pote Kole", type: "website" },
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
  const p = platform[locale];
  return (
    <html lang={locale}>
      <body className={GeistSans.variable}>
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
        <Footer locale={locale} />
      </body>
    </html>
  );
}
