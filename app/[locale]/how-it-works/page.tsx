import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { MethodCloud } from "@/components/Support";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).how.title, description: t(locale).how.sub } : {};
}
export default async function How({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), h = d.how, y = d.x.pages.how;
  const steps = (items: string[][]) => <ol>{items.map(([title, body], i) => <li key={title}><span className="n" aria-hidden="true">{i + 1}</span><h3 style={{ fontSize: "var(--t-md)" }}>{title}</h3><p>{body}</p></li>)}</ol>;
  return (
    <div className="wrap page" style={{ gap: 48 }}>
      <header className="page-head"><h1 style={{ fontSize: "var(--t-3xl)", letterSpacing: "-0.045em", maxWidth: "14ch" }}>{h.title}</h1><p className="lead">{h.sub}</p></header>

      <section className="stack" aria-labelledby="flow-h">
        <h2 id="flow-h">{y.flowTitle}</h2>
        <div className="flow">
          <div className="node"><Icon name="user" size={22} />{y.flowSupporter}</div>
          <div className="via">{y.flowVia}</div>
          <div className="node"><Icon name="hand" size={22} />{y.flowOrganizer}</div>
          <p className="us"><Icon name="shield" size={16} /> {y.flowUs}</p>
        </div>
      </section>

      <div className="tracks">
        <section className="track" aria-labelledby="give-h"><h2 id="give-h">{h.giveTitle}</h2>{steps(d.home.give)}<Link className="btn primary" href={`/${locale}/explore`}>{y.giveCta}</Link></section>
        <section className="track dark" aria-labelledby="need-h"><h2 id="need-h">{h.needTitle}</h2>{steps(d.home.need)}<Link className="btn" href={`/${locale}/create`}><Icon name="plus" size={18} />{y.needCta}</Link></section>
      </div>

      <section className="manage-grid" style={{ alignItems: "start" }}>
        <div className="stack"><h2>{h.reviewTitle}</h2><ul className="checklist">{h.review.map((r) => <li key={r}><Icon name="check" size={18} /><span>{r}</span></li>)}</ul></div>
        <div className="panel mint"><h2>{h.methodsTitle}</h2><p className="small">{h.methodsBody}</p><MethodCloud /></div>
      </section>
      <section className="notice" style={{ padding: 24 }}><Icon name="lock" size={22} /><span><strong style={{ fontSize: "var(--t-lg)" }}>{h.moneyTitle}</strong>{h.moneyBody} <Link className="link" href={`/${locale}/safety`}>{d.footer.safety}</Link></span></section>
    </div>
  );
}
