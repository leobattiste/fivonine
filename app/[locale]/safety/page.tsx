import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).pages.safety.title, description: t(locale).pages.safety.sub } : {};
}
export default async function Safety({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), p = d.pages.safety, s = d.x.pages.safety;
  const block = (title: string, items: string[], icon: IconName, cls = "", ordered = false) => {
    const List = ordered ? "ol" : "ul";
    return <section className={cls}><h2 style={{ fontSize: "var(--t-lg)" }}>{title}</h2><List className="checklist">{items.map((i, n) => <li key={i}>{ordered ? <strong>{n + 1}.</strong> : <Icon name={icon} size={18} />}<span>{i}</span></li>)}</List></section>;
  };
  return (
    <div className="wrap page" style={{ gap: 32 }}>
      <header className="page-head"><h1>{p.title}</h1><p className="lead">{p.sub}</p></header>
      <div className="safety-grid">
        {block(s.giveTitle, s.give, "check")}
        {block(s.orgTitle, s.org, "check")}
        {block(s.scamTitle, s.scam, "alert", "alert")}
      </div>
      <section className="manage-grid">
        <div className="panel">{block(s.wrongTitle, s.wrong, "check", "", true)}<p className="small muted">{s.limits}</p></div>
        <div className="panel mint"><h2>{d.footer.report}</h2><p className="small">{d.report.pick}</p><div className="row"><Link className="btn" href={`/${locale}/explore`}>{d.x.nav.explore}</Link><Link className="btn quiet" href={`/${locale}/contact`}>{d.footer.contact}</Link></div></div>
      </section>
    </div>
  );
}
