import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import OperatorDetails from "@/components/OperatorDetails";
import { followUp } from "@/lib/dict/follow-up";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: followUp[locale].menu.who, description: t(locale).about.lead } : {};
}
const ICONS: IconName[] = ["shield", "heart", "home", "eye"];
export default async function WhoWeAre({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const a = t(locale).about, title = followUp[locale].menu.who;
  return (
    <div className="wrap page" style={{ gap: 40 }}>
      <header className="stack" style={{ gap: 16 }}>
        <p className="eyebrow">{title}</p>
        <h1>{a.lead}</h1>
        <div className="columns">{a.body.map((p) => <p key={p}>{p}</p>)}</div>
      </header>
      <section className="stack" aria-labelledby="values">
        <h2 id="values">{a.valuesTitle}</h2>
        <ul className="values">{a.values.map(([h, p], i) => <li key={h}><span className="ico"><Icon name={ICONS[i]} size={20} /></span><h3>{h}</h3><p>{p}</p></li>)}</ul>
      </section>
      <OperatorDetails locale={locale} />
      <p><Link className="arrow-link" href={`/${locale}/transparency`}>{a.transparency}<Icon name="arrow" size={18} /></Link></p>
    </div>
  );
}
