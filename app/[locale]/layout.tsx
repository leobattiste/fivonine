import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { ServiceWorker } from "@/components/Bits";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { htmlLang, isLocale, t } from "@/lib/i18n";
import { getViewer } from "@/lib/auth";
import { getSettings, unreadCount } from "@/lib/data";
import { isLite } from "@/lib/prefs";
import { SITE_URL } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = t(locale);
  const open = process.env.PUBLIC_LAUNCH === "true";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `yon kout men: ${d.x.home.title}`, template: "%s | yon kout men" },
    description: d.meta.description,
    robots: { index: open, follow: open },
    openGraph: { siteName: "yon kout men", type: "website", locale: htmlLang[locale] },
    alternates: { languages: { ht: "/ht", fr: "/fr", en: "/en" } },
    appleWebApp: { capable: true, title: "yon kout men", statusBarStyle: "default" },
  };
}
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [viewer, settings, lite] = await Promise.all([getViewer(), getSettings(), isLite()]);
  const unread = viewer ? await unreadCount(viewer.id) : 0;
  const banner = settings.emergency.active ? settings.emergency[locale] || settings.emergency.ht : "";
  return (
    <html lang={htmlLang[locale]} className={GeistSans.variable} suppressHydrationWarning>
      <body>
        {banner && (
          <a className="emergency no-print" href={`/${locale}/explore?emergency=1`}>
            <Icon name="megaphone" size={18} />
            <span>{banner}</span>
          </a>
        )}
        <Suspense fallback={null}><Loader /></Suspense>
        <Header locale={locale} viewer={viewer ? { name: viewer.profile.display_name, admin: viewer.profile.role === "admin", unread, avatar: viewer.profile.avatar_path } : null} />
        <main id="main">{children}</main>
        <Footer locale={locale} lite={lite} />
        <ServiceWorker />
      </body>
    </html>
  );
}
