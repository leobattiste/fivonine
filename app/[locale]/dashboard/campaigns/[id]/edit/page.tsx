import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CampaignForm, { type FormState } from "@/components/CampaignForm";
import { requireViewer } from "@/lib/auth";
import { getCategories, getManaged } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
export default async function Edit({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard/campaigns/${id}/edit`);
  const [data, cats] = await Promise.all([getManaged(id), getCategories()]);
  if (!data || data.campaign.owner_id !== viewer.id) notFound();
  const d = t(locale), c = data.campaign, p = data.priv;
  const locked = ["suspended", "completed", "closed"].includes(c.status) || viewer.profile.banned;
  const initial: FormState = {
    id: c.id, title: c.title, story: c.story, cause: c.cause ?? "", department: c.department ?? "", commune: c.commune ?? "", beneficiary_name: c.beneficiary_name ?? "",
    beneficiary_relation: c.beneficiary_relation ?? "", goal_amount: c.goal_amount ? String(Math.round(Number(c.goal_amount))) : "", goal_currency: c.goal_currency, deadline: c.deadline ?? "",
    urgent: c.urgent, cover_path: c.cover_path, gallery: c.gallery, video_url: c.video_url ?? "", voice_path: c.voice_path, language: c.language,
    methods: Object.fromEntries(data.methods.map((m) => [m.method, m.details])),
    priv: { contact_name: p?.contact_name ?? "", contact_email: p?.contact_email ?? viewer.email, contact_details: p?.contact_details ?? "", id_front_path: p?.id_front_path ?? null, id_back_path: p?.id_back_path ?? null, selfie_path: p?.selfie_path ?? null, reference_name: p?.reference_name ?? "", reference_contact: p?.reference_contact ?? "", documents: p?.documents ?? [] },
  };
  return (
    <div className="wrap page narrow">
      <p><Link className="back" href={`/${locale}/dashboard/campaigns/${c.id}`}>{d.common.back}</Link></p>
      <header className="page-head"><h1>{d.create.editTitle}</h1><p className="lead">{c.title}</p></header>
      {locked ? <p className="notice err">{viewer.profile.banned ? d.dash.restricted : d.status[c.status]}</p> : <CampaignForm locale={locale} cats={cats} initial={initial} draftKey={null} live={c.status === "live"} />}
    </div>
  );
}
