import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import CampaignForm from "@/components/CampaignForm";
import { requireViewer } from "@/lib/auth";
import { getCategories, getChange, getManaged } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
import { formFromSaved, RESUMABLE } from "@/lib/form-initial";
import { countryOptions } from "@/lib/countries";
export const metadata: Metadata = { robots: { index: false } };
export default async function Edit({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard/campaigns/${id}/edit`);
  const [data, cats, change] = await Promise.all([getManaged(id), getCategories(), getChange(id)]);
  if (!data || data.campaign.owner_id !== viewer.id) notFound();
  const d = t(locale), p = data.priv;
  const locked = ["suspended", "completed", "closed"].includes(data.campaign.status) || viewer.profile.banned;
  const initial = formFromSaved(data, change, viewer.email);
  const autosave = (RESUMABLE as readonly string[]).includes(data.campaign.status);
  return (
    <div className="wrap page">
      <Link className="crumb" href={`/${locale}/dashboard/campaigns/${id}`}><Icon name="left" size={18} />{d.common.back}</Link>
      <header className="page-head"><h1>{d.x.form.editTitle}</h1><p className="lead">{data.campaign.title}</p></header>
      {locked ? <p className="notice err"><Icon name="lock" size={18} />{viewer.profile.banned ? d.dash.restricted : d.x.dash.explain[data.campaign.status]}</p>
        : <CampaignForm locale={locale} cats={cats} initial={initial} draftKey={null} autosave={autosave} live={data.campaign.status === "live"} email={viewer.email} reviewNote={p?.review_note} countryList={countryOptions(locale)} />}
    </div>
  );
}
