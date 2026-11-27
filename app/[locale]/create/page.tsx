import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Icon from "@/components/Icon";
import CampaignForm from "@/components/CampaignForm";
import CreateIntro from "@/components/CreateIntro";
import { emptyForm } from "@/lib/form";
import { formFromSaved, RESUMABLE } from "@/lib/form-initial";
import ProfileSetup from "@/components/ProfileSetup";
import { profileReady, requireViewer } from "@/lib/auth";
import { getCategories, getChange, getManaged, myCampaigns } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
import { countryOptions } from "@/lib/countries";
import { formText } from "@/lib/dict/form";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).x.form.title } : {};
}
/**
 * /create            start screen: what to prepare, and drafts to continue
 * /create?new=1      a fresh form (forgets unsaved answers on this device)
 * /create?resume=1   continue answers kept on this device
 * /create?draft=id   continue a draft saved to the account, private files included
 */
export default async function Create({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ draft?: string; new?: string; resume?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const viewer = await requireViewer(locale, `/${locale}/create`);
  const d = t(locale), F = formText[locale];
  const name = /^(Fivonine member|Member)$/.test(viewer.profile.display_name) ? "" : viewer.profile.display_name;
  const deviceKey = `fivonine-draft-${viewer.id}`;
  const resumable = (s: string) => (RESUMABLE as readonly string[]).includes(s);

  if (viewer.profile.banned) return <div className="wrap page"><p className="notice err"><Icon name="lock" size={18} />{d.dash.restricted}</p></div>;
  if (!profileReady(viewer.profile)) return <div className="wrap page"><h1>{F.x.title}</h1><ProfileSetup locale={locale} profile={viewer.profile} next={`/${locale}/create`} /></div>;

  if (!sp.draft && !sp.new && !sp.resume) {
    const mine = (await myCampaigns(viewer.id)).filter((c) => c.owner_id === viewer.id && resumable(c.status)).slice(0, 5);
    return (
      <div className="wrap page">
        <CreateIntro locale={locale} deviceKey={deviceKey} guideHref={`/${locale}/resources`} guideLabel={d.x.home.organizerLink}
          drafts={mine.map((c) => ({ id: c.id, title: c.title, status: c.status, updated_at: c.updated_at }))} />
      </div>
    );
  }

  const cats = await getCategories();
  let initial = emptyForm(locale, name, viewer.email), key = deviceKey;
  if (sp.draft) {
    const [data, change] = await Promise.all([getManaged(sp.draft), getChange(sp.draft)]);
    if (!data || data.campaign.owner_id !== viewer.id || !resumable(data.campaign.status)) redirect(`/${locale}/create`);
    initial = formFromSaved(data, change, viewer.email);
    key = `${deviceKey}-${data.campaign.id}`;
  }
  return (
    <div className="wrap page">
      <header className="row spread end"><div className="stack tight"><h1>{F.x.title}</h1></div></header>
      <CampaignForm locale={locale} cats={cats} initial={initial} draftKey={key} live={false} autosave resetDevice={Boolean(sp.new)} email={viewer.email} countryList={countryOptions(locale)} />
    </div>
  );
}
