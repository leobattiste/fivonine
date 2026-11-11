import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).about.title, description: t(locale).about.lead } : {};
}
export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), a = d.about;
  return (
    <>
      <div className="wrap page">
        <header className="page-head"><h1>{a.title}</h1><p className="statement">{a.lead}</p></header>
        <div className="prose narrow-left">{a.body.map((p) => <p key={p}>{p}</p>)}</div>
      </div>
      <section className="section tint">
        <div className="wrap">
          <h2>{a.valuesTitle}</h2>
          <ul className="trust-grid">{a.values.map(([h, p]) => <li key={h}><h3>{h}</h3><p>{p}</p></li>)}</ul>
          <div className="row"><Link className="btn" href={`/${locale}/transparency`}>{a.transparency}</Link><Link className="btn ghost" href={`/${locale}/contact`}>{d.footer.contact}</Link></div>
        </div>
      </section>
    </>
  );
}
