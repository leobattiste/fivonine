import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import CampaignForm, { type FormState } from "@/components/CampaignForm";
import { requireViewer } from "@/lib/auth";
import { getCategories, getChange, getManaged } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
export default async function Edit({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard/campaigns/${id}/edit`);
  const [data, cats, change] = await Promise.all([getManaged(id), getCategories(), getChange(id)]);
  if (!data || data.campaign.owner_id !== viewer.id) notFound();
  const d = t(locale), p = data.priv;
  // When changes are already proposed, keep editing those rather than the published version.
  const c = { ...data.campaign, ...((change?.payload.row ?? {}) as Partial<typeof data.campaign>) };
  const methods = change?.payload.methods ?? data.methods;
  const locked = ["suspended", "completed", "closed"].includes(data.campaign.status) || viewer.profile.banned;
  const initial: FormState = {
    id: c.id, title: c.title, story: c.story, cause: c.cause ?? "", department: c.department ?? "", commune: c.commune ?? "", beneficiary_name: c.beneficiary_name ?? "",
    beneficiary_relation: c.beneficiary_relation ?? "", goal_amount: c.goal_amount ? String(Math.round(Number(c.goal_amount))) : "", goal_currency: c.goal_currency, deadline: c.deadline ?? "",
    urgent: c.urgent, cover_path: c.cover_path, gallery: c.gallery ?? [], video_url: c.video_url ?? "", voice_path: c.voice_path, language: c.language,
    methods: Object.fromEntries(methods.map((m) => [m.method, { details: m.details, link: m.link ?? "" }])),
    priv: { contact_name: p?.contact_name ?? "", contact_email: p?.contact_email ?? viewer.email, contact_details: p?.contact_details ?? "", id_front_path: p?.id_front_path ?? null, id_back_path: p?.id_back_path ?? null, selfie_path: p?.selfie_path ?? null, reference_name: p?.reference_name ?? "", reference_contact: p?.reference_contact ?? "", documents: p?.documents ?? [] },
  };
  return (
    <div className="wrap page">
      <Link className="crumb" href={`/${locale}/dashboard/campaigns/${id}`}><Icon name="left" size={18} />{d.common.back}</Link>
      <header className="page-head"><h1>{d.x.form.editTitle}</h1><p className="lead">{data.campaign.title}</p></header>
      {locked ? <p className="notice err"><Icon name="lock" size={18} />{viewer.profile.banned ? d.dash.restricted : d.x.dash.explain[data.campaign.status]}</p>
        : <CampaignForm locale={locale} cats={cats} initial={initial} draftKey={null} live={data.campaign.status === "live"} />}
    </div>
  );
}
