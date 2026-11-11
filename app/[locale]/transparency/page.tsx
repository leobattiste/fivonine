import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStats } from "@/lib/data";
import { fmtMoney, fmtNumber } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).transparency.title } : {};
}
export default async function Transparency({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const x = t(locale).transparency, s = await getStats();
  const rows: [string, string][] = [
    [x.live, fmtNumber(s.live, locale)], [x.completed, fmtNumber(s.completed, locale)], [x.reviewed, fmtNumber(s.reviewed, locale)], [x.declined, fmtNumber(s.declined, locale)],
    [x.verified, fmtNumber(s.verified, locale)], [x.reports, fmtNumber(s.reports_handled, locale)], [x.supporters, fmtNumber(s.supporters, locale)],
    [x.reported, `${fmtMoney(Number(s.reported_htg), "HTG", locale)} + ${fmtMoney(Number(s.reported_usd), "USD", locale)}`],
  ];
  return (
    <div className="wrap page narrow">
      <header className="page-head"><h1>{x.title}</h1><p className="lead">{x.sub}</p></header>
      <dl className="stat-list">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <p className="small muted">{x.note}</p>
    </div>
  );
}
