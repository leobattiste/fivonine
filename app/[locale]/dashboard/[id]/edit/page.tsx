import { editorial } from "@/lib/editorial";
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
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login?next=/${locale}/dashboard/${id}/edit`);
  const c = (await ownCampaigns()).find((c) => c.id === id);
  if (!c) notFound();
  const latest = c.campaign_revisions.toSorted((a, b) =>
    b.created_at.localeCompare(a.created_at),
  )[0];
  return (
    <section className="page task-page edit-page">
      <div className="task-layout">
        <header className="task-aside">
          <p className="eyebrow">{editorial[locale].workspace}</p>
          <h1>{t(locale).edit}</h1>
          <p className="lead">{t(locale).manageIntro}</p>
        </header>
        <div className="task-surface">
          <CampaignForm
            locale={locale}
            email={user.email}
            id={id}
            initial={latest?.content ?? c.public_content}
            enabled={
              !["archived", "suspended", "removal_requested"].includes(c.status)
            }
          />
        </div>
      </div>
    </section>
  );
}
