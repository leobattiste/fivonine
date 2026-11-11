import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignForm from "@/components/CampaignForm";
import { emptyForm } from "@/lib/form";
import { requireViewer } from "@/lib/auth";
import { getCategories } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).create.title } : {};
}
export default async function Create({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/create`);
  const d = t(locale), cats = await getCategories();
  return (
    <div className="wrap page narrow">
      <header className="page-head"><h1>{d.create.title}</h1><p className="lead">{d.create.sub}</p></header>
      {viewer.profile.banned ? <p className="notice err">{d.dash.restricted}</p> : (
        <CampaignForm locale={locale} cats={cats} initial={emptyForm(locale, viewer.profile.display_name === "Fivonine member" ? "" : viewer.profile.display_name, viewer.email)} draftKey={`fivonine-draft-${viewer.id}`} live={false} />
      )}
    </div>
  );
}
