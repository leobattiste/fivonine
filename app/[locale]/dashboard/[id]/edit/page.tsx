import { notFound, redirect } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { currentUser, ownCampaigns } from "@/lib/data";
import { CampaignForm } from "@/components/Forms";
export const metadata = { robots: { index: false, follow: false } };
export default async function Edit({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  if (!(await currentUser())) redirect(`/${locale}/login`);
  const c = (await ownCampaigns()).find((c) => c.id === id);
  if (!c) notFound();
  const latest = c.campaign_revisions.toSorted((a, b) =>
    b.created_at.localeCompare(a.created_at),
  )[0];
  return (
    <section className="page narrow section">
      <header className="page-head">
        <h1>{t(locale).edit}</h1>
        <p className="lead">{t(locale).manageIntro}</p>
      </header>
      <CampaignForm
        locale={locale}
        id={id}
        initial={latest?.content ?? c.public_content}
        enabled={
          !["archived", "suspended", "removal_requested"].includes(c.status)
        }
      />
    </section>
  );
}
