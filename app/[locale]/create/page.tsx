import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import CampaignForm from "@/components/CampaignForm";
import { emptyForm } from "@/lib/form";
import { requireViewer } from "@/lib/auth";
import { getCategories } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).x.form.title } : {};
}
export default async function Create({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/create`);
  const d = t(locale), cats = await getCategories();
  const name = /^(Fivonine member|Member)$/.test(viewer.profile.display_name) ? "" : viewer.profile.display_name;
  return (
    <div className="wrap page">
      <header className="row spread end">
        <div className="stack tight"><h1>{d.x.form.title}</h1><p className="lead">{d.x.form.sub}</p></div>
        <Link className="arrow-link small" href={`/${locale}/resources`}><Icon name="guide" size={18} />{d.x.home.organizerLink}</Link>
      </header>
      {viewer.profile.banned ? <p className="notice err"><Icon name="lock" size={18} />{d.dash.restricted}</p> : (
        <CampaignForm locale={locale} cats={cats} initial={emptyForm(locale, name, viewer.email)} draftKey={`fivonine-draft-${viewer.id}`} live={false} />
      )}
    </div>
  );
}
