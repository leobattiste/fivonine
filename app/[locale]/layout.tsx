import type { Metadata, Viewport } from "next";
import { Ms_Madi } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { ServiceWorker } from "@/components/Bits";
import Loader from "@/components/Loader";
import { Suspense } from "react";
import { htmlLang, isLocale, locales, t } from "@/lib/i18n";
import { getViewer } from "@/lib/auth";
import { getSettings, myCampaigns, unreadCount } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";
import { canIndexPublicSite } from "@/lib/launch-readiness";

const msMadi = Ms_Madi({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-ms-madi" });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = t(locale);
  const open = canIndexPublicSite();
  const pathname = (await headers()).get("x-fivonine-pathname") ?? `/${locale}`;
  const suffix = pathname.startsWith(`/${locale}/`) ? pathname.slice(locale.length + 1) : "";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `yon kout men: ${d.x.home.title}`, template: "%s | yon kout men" },
    description: d.meta.description,
    robots: { index: open, follow: open },
    openGraph: { siteName: "yon kout men", type: "website", locale: htmlLang[locale] },
    alternates: { canonical: `/${locale}${suffix}`, languages: Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}${suffix}`])) },
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
  const [viewer, settings] = await Promise.all([getViewer(), getSettings()]);
  const [unread, mine] = viewer ? await Promise.all([unreadCount(viewer.id), myCampaigns(viewer.id)]) : [0, []];
  const banner = settings.emergency.active ? settings.emergency[locale] || settings.emergency.fr : "";
  return (
    <html lang={htmlLang[locale]} className={msMadi.variable} suppressHydrationWarning>
      <body>
        {banner && (
          <a className="emergency no-print" href={`/${locale}/explore?emergency=1`}>
            <Icon name="megaphone" size={18} />
            <span>{banner}</span>
          </a>
        )}
        <Suspense fallback={null}><Loader /></Suspense>
        <Header locale={locale} viewer={viewer ? { name: viewer.profile.display_name, admin: viewer.profile.role === "admin", unread, avatar: viewer.profile.avatar_path, mine: mine.slice(0, 2).map((c) => ({ id: c.id, title: c.title, status: c.status, cover: c.cover_path })) } : null} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <ServiceWorker />
      </body>
    </html>
  );
}
