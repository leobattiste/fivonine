import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ActionForm, { Submit } from "@/components/ActionForm";
import { reportCampaign } from "@/app/actions";
import { getViewer } from "@/lib/auth";
import { getCampaign } from "@/lib/data";
import { REASONS } from "@/lib/constants";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).report.title, robots: { index: false } } : {};
}
export default async function Report({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ campaign?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), x = d.report, sp = await searchParams;
  const [viewer, data] = await Promise.all([getViewer(), sp.campaign ? getCampaign(sp.campaign) : null]);
  const next = `/${locale}/report${sp.campaign ? `?campaign=${sp.campaign}` : ""}`;
  return (
    <div className="wrap page narrow">
      <header className="page-head"><h1>{x.title}</h1><p className="lead">{x.sub}</p></header>
      {!data ? (
        <div className="empty"><p>{x.pick}</p><Link className="btn" href={`/${locale}/donate`}>{d.common.seeAll}</Link></div>
      ) : !viewer ? (
        <div className="empty"><p>{d.auth.sub}</p><Link className="btn primary" href={`/${locale}/login?next=${encodeURIComponent(next)}`}>{d.nav.signIn}</Link></div>
      ) : (
        <ActionForm action={reportCampaign} locale={locale} className="stack panel" reset>
          <input type="hidden" name="campaign_id" value={data.campaign.id} />
          <p><Link href={`/${locale}/campaigns/${data.campaign.slug}`}><strong>{data.campaign.title}</strong></Link></p>
          <fieldset className="field"><legend>{x.reason}</legend>
            {REASONS.map((r, i) => <label key={r} className="check"><input type="radio" name="reason" value={r} required defaultChecked={i === 0} /><span>{d.reasons[r]}</span></label>)}
          </fieldset>
          <label className="field"><span>{x.details}</span><textarea className="input" name="body" rows={5} maxLength={2000} /></label>
          <Submit>{x.send}</Submit>
        </ActionForm>
      )}
    </div>
  );
}
