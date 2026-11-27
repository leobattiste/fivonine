import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { requireViewer } from "@/lib/auth";
import { mySupport, updatesFrom } from "@/lib/data";
import { followUp } from "@/lib/dict/follow-up";
import { fmtDate, fmtMoney } from "@/lib/format";
import { isLocale } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
export default async function Impact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard/impact`);
  const fu = followUp[locale], im = fu.imp, v = fu.ver, items = await mySupport(viewer.id);
  const news = await updatesFrom([...new Set(items.map((k) => k.campaign_id))]);
  const totals = new Map<string, number>();
  for (const k of items) totals.set(k.currency, (totals.get(k.currency) ?? 0) + k.amount);
  const causes = new Set(items.map((k) => k.campaign_id)).size;
  const stats: [string, string][] = [[im.helped, String(items.length)], [im.confirmed, String(items.filter((k) => k.received_at).length)], [im.causes, String(causes)]];
  return (
    <div className="wrap page">
      <header className="stack tight"><h1>{fu.menu.impact}</h1><p className="muted measure">{fu.menu.impactSub}</p></header>
      {!items.length ? (
        <div className="empty"><span className="icon-box"><Icon name="heart" size={24} /></span><p>{fu.mine.empty}</p><Link className="btn" href={`/${locale}/explore`}>{fu.mine.find}</Link></div>
      ) : (
        <>
          <dl className="stat-row">
            {stats.map(([k, v]) => <div key={k}><dd>{v}</dd><dt>{k}</dt></div>)}
            {[...totals].map(([cur, sum]) => <div key={cur}><dd>{fmtMoney(sum, cur, locale)}</dd><dt>{im.given}</dt></div>)}
          </dl>
          <section className="stack" aria-labelledby="news">
            <h2 id="news">{v.fromHelped}</h2>
            {news.length === 0 ? <p className="muted">{v.noNews}</p> : (
              <ul className="list">
                {news.slice(0, 6).map((u) => (
                  <li key={u.id}><div className="stack tight">
                    {u.campaign && <Link href={`/${locale}/campaigns/${u.campaign.slug}#updates`}><strong>{u.campaign.title}</strong></Link>}
                    <span className="small muted">{fmtDate(u.created_at, locale)}</span>
                    <p className="clamp-2">{u.body}</p>
                  </div></li>
                ))}
              </ul>
            )}
          </section>
          <section className="stack" aria-labelledby="recent">
            <h2 id="recent">{v.timeline}</h2>
            <ol className="timeline">
              {items.slice(0, 12).map((k) => (
                <li key={k.id}>
                  <strong>{fmtMoney(k.amount, k.currency, locale)}</strong> <span className="muted small">· {fmtDate(k.created_at, locale)}</span>
                  {k.campaign && ["live", "completed"].includes(k.campaign.status) ? <p><Link href={`/${locale}/campaigns/${k.campaign.slug}`}>{k.campaign.title}</Link></p> : <p className="small muted">{fu.mine.gone}</p>}
                  <p className="small muted">{k.received_at ? fu.mine.confirmed(fmtDate(k.received_at, locale)) : fu.mine.waiting}</p>
                </li>
              ))}
            </ol>
            <p><Link className="arrow-link" href={`/${locale}/dashboard?tab=support`}>{im.all}<Icon name="arrow" size={18} /></Link></p>
          </section>
        </>
      )}
    </div>
  );
}
