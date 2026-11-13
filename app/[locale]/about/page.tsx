import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import { PexelsPhoto } from "@/components/Brand";
import { isLocale, t } from "@/lib/i18n";
import { PHOTOS } from "@/lib/photos";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).about.title, description: t(locale).about.lead } : {};
}
const ICONS: IconName[] = ["shield", "heart", "home", "eye"];
export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), a = d.about;
  return (
    <div className="wrap page" style={{ gap: 48 }}>
      <section className="about-hero">
        <div className="stack" style={{ gap: 24 }}>
          <p className="eyebrow">{a.title}</p>
          <h1>{a.lead}</h1>
          <div className="columns">{a.body.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
        <PexelsPhoto photo={PHOTOS.jacmel} locale={locale} priority sizes="(min-width: 900px) 40vw, 100vw" />
      </section>
      <section className="stack" aria-labelledby="values">
        <h2 id="values">{a.valuesTitle}</h2>
        <ul className="values">{a.values.map(([h, p], i) => <li key={h}><span className="ico"><Icon name={ICONS[i]} size={20} /></span><h3>{h}</h3><p>{p}</p></li>)}</ul>
      </section>
      <section className="organizer-cta">
        <PexelsPhoto photo={PHOTOS.hands} locale={locale} sizes="(min-width: 900px) 45vw, 100vw" />
        <div className="copy">
          <h2>{d.x.home.organizerTitle}</h2>
          <p>{d.x.home.organizerBody}</p>
          <div className="row"><Link className="btn large" href={`/${locale}/create`}><Icon name="plus" size={18} />{d.x.nav.share}</Link></div>
          <Link className="arrow-link" href={`/${locale}/transparency`}>{a.transparency}<Icon name="arrow" size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
