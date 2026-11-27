import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { followUp } from "@/lib/dict/follow-up";
import { isLocale, t } from "@/lib/i18n";
import type { Tier } from "@/lib/types";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: followUp[locale].ver.title, description: followUp[locale].ver.lead } : {};
}
const TIERS: Tier[] = ["none", "id_checked", "community", "organization"];
export default async function Verification({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), v = followUp[locale].ver;
  return (
    <div className="wrap page" style={{ gap: 40 }}>
      <header className="stack" style={{ gap: 12 }}><h1>{v.title}</h1><p className="muted measure">{v.lead}</p></header>
      <section className="stack" aria-labelledby="ver-b">
        <h2 id="ver-b">{v.badges}</h2>
        <ul className="ver-tiers">
          {TIERS.map((k) => <li key={k} id={k}><span className="check-tag"><Icon name={k === "none" ? "check" : "badge"} size={16} />{d.tiers[k]}</span><p>{d.tierHelp[k]}</p></li>)}
        </ul>
      </section>
      <section className="stack" aria-labelledby="ver-s">
        <h2 id="ver-s">{v.steps}</h2>
        <ol className="ver-steps">{v.stepList.map((x, i) => <li key={x}><span className="num" aria-hidden="true">{i + 1}</span><p>{x}</p></li>)}</ol>
      </section>
      <section className="panel stack" aria-labelledby="ver-n">
        <h2 id="ver-n">{v.not}</h2>
        <ul className="checklist">{v.notList.map((x) => <li key={x}><Icon name="info" size={18} /><span>{x}</span></li>)}</ul>
        <div className="row"><Link className="btn small" href={`/${locale}/safety`}><Icon name="shield" size={16} />{d.footer.safety}</Link><Link className="btn small ghost" href={`/${locale}/report`}><Icon name="flag" size={16} />{d.footer.report}</Link></div>
      </section>
    </div>
  );
}
