import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).x.nav.fundraiser, description: t(locale).x.home.organizerBody } : {};
}
export default async function Fundraise({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), n = d.x.nav;
  const cards: [string, string, IconName][] = [["/resources", d.x.pages.resources.title, "guide"], ["/how-it-works", n.how, "check"], ["/safety", d.footer.safety, "shield"], ["/guidelines", d.footer.guidelines, "book"]];
  return (
    <div className="wrap page" style={{ gap: 32 }}>
      <header className="stack" style={{ gap: 16 }}>
        <h1>{n.fundraiser}</h1>
        <p className="muted measure">{d.x.home.organizerBody}</p>
        <div className="row"><Link className="btn large" href={`/${locale}/create`}><Icon name="plus" size={18} />{n.share}</Link></div>
      </header>
      <nav className="help-topics" aria-label={n.fundraiser}>
        {cards.map(([href, label, icon]) => <Link key={href} href={`/${locale}${href}`}><Icon name={icon} size={22} /><span>{label}</span></Link>)}
      </nav>
    </div>
  );
}
