import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { MethodChips } from "@/components/Support";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).how.title, description: t(locale).how.sub } : {};
}
export default async function How({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), h = d.how;
  const steps = (items: string[][]) => (
    <ol className="steps">{items.map(([title, body], i) => <li key={title}><span className="step-n">{i + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
  );
  return (
    <>
      <div className="wrap page">
        <header className="page-head"><h1>{h.title}</h1><p className="lead measure">{h.sub}</p></header>
        <section className="how-block"><h2>{h.giveTitle}</h2>{steps(d.home.give)}<Link className="btn primary" href={`/${locale}/donate`}>{d.home.explore}</Link></section>
        <section className="how-block"><h2>{h.needTitle}</h2>{steps(d.home.need)}<Link className="btn primary" href={`/${locale}/create`}>{d.home.create}</Link></section>
      </div>
      <section className="section tint">
        <div className="wrap two-col">
          <div><h2>{h.reviewTitle}</h2><ul className="checklist">{h.review.map((r) => <li key={r}><Icon name="check" size={18} />{r}</li>)}</ul></div>
          <div><h2>{h.methodsTitle}</h2><p>{h.methodsBody}</p><MethodChips /></div>
        </div>
      </section>
      <section className="section">
        <div className="wrap narrow"><h2>{h.moneyTitle}</h2><p className="lead">{h.moneyBody}</p><Link className="btn small ghost" href={`/${locale}/safety`}>{d.footer.safety}</Link></div>
      </section>
    </>
  );
}
