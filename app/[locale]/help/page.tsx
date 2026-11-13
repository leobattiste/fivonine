import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import HelpSearch from "@/components/HelpSearch";
import { contentMeta } from "@/components/Content";
import { isLocale, t } from "@/lib/i18n";
export const generateMetadata = contentMeta("help");
export default async function Help({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), p = d.pages.help, h = d.x.pages.help;
  const items = [...p.sections, ...d.home.faq] as [string, string][];
  return (
    <div className="wrap page">
      <header className="page-head"><h1>{p.title}</h1><p className="lead">{p.sub}</p></header>
      <div className="help-layout">
        <HelpSearch items={items} label={h.search} none={h.none} />
        <aside className="stack">
          <div className="panel mint"><h2>{h.still}</h2><p className="small">{d.x.pages.contact.reply}</p><div><Link className="btn primary" href={`/${locale}/contact`}><Icon name="mail" size={18} />{h.write}</Link></div></div>
          <div className="panel"><h2>{d.x.pages.resources.title}</h2><p className="small muted">{d.x.pages.resources.sub}</p><Link className="arrow-link small" href={`/${locale}/resources`}>{d.x.home.organizerLink}<Icon name="arrow" size={16} /></Link></div>
        </aside>
      </div>
    </div>
  );
}
