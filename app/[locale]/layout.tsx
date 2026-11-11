import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/bricolage-grotesque";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { ServiceWorker } from "@/components/Bits";
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
    title: { default: `Fivonine: ${d.home.headline}`, template: "%s | Fivonine" },
    description: d.meta.description,
    robots: { index: open, follow: open },
    openGraph: { siteName: "Fivonine", type: "website", locale: htmlLang[locale] },
    alternates: { languages: { ht: "/ht", fr: "/fr", en: "/en" } },
    appleWebApp: { capable: true, title: "Fivonine", statusBarStyle: "default" },
  };
}
export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#0b1711" }],
  width: "device-width",
  initialScale: 1,
};
const themeScript = `try{var t=localStorage.getItem("fivonine-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [viewer, settings, lite] = await Promise.all([getViewer(), getSettings(), isLite()]);
  const unread = viewer ? await unreadCount(viewer.id) : 0;
  const banner = settings.emergency.active ? settings.emergency[locale] || settings.emergency.ht : "";
  return (
    <html lang={htmlLang[locale]} className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {banner && (
          <a className="emergency no-print" href={`/${locale}/donate?emergency=1`}>
            <Icon name="megaphone" size={18} />
            <span>{banner}</span>
          </a>
        )}
        <Header locale={locale} viewer={viewer ? { name: viewer.profile.display_name, admin: viewer.profile.role === "admin", unread } : null} />
        <main id="main">{children}</main>
        <Footer locale={locale} lite={lite} />
        <ServiceWorker />
      </body>
    </html>
  );
}
