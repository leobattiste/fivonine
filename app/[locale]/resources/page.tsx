import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).x.pages.resources.title, description: t(locale).x.pages.resources.sub } : {};
}
export default async function Resources({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), r = d.x.pages.resources;
  return (
    <div className="wrap page" style={{ gap: 32 }}>
      <header className="page-head"><h1>{r.title}</h1><p className="lead">{r.sub}</p></header>
      <nav className="guide-index" aria-label={d.x.pages.toc}>{r.guides.map((g) => <a key={g.id} className="chip" href={`#${g.id}`}>{g.title}</a>)}</nav>
      <div className="guides">
        {r.guides.map((g) => (
          <section key={g.id} id={g.id} className="guide" aria-labelledby={`${g.id}-h`}>
            <h2 id={`${g.id}-h`} style={{ fontSize: "var(--t-lg)" }}>{g.title}</h2>
            <ul>{g.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>
        ))}
      </div>
      <section className="row spread panel mint">
        <h2>{r.cta}</h2>
        <div className="row"><Link className="btn primary" href={`/${locale}/create`}><Icon name="plus" size={18} />{d.x.nav.share}</Link><Link className="btn quiet" href={`/${locale}/help`}>{d.footer.help}</Link></div>
      </section>
    </div>
  );
}
