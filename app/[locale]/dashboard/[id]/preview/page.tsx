import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { currentUser, ownCampaigns } from "@/lib/data";
import CampaignDetail from "@/components/CampaignDetail";
export const metadata = { robots: { index: false, follow: false } };
export default async function Preview({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  if (!(await currentUser()))
    redirect(`/${locale}/login?next=/${locale}/dashboard/${id}/preview`);
  const campaign = (await ownCampaigns()).find((c) => c.id === id);
  if (!campaign) notFound();
  const latest = campaign.campaign_revisions.toSorted((a, b) =>
    b.created_at.localeCompare(a.created_at),
  )[0];
  const content = latest?.content ?? campaign.public_content;
  if (!content?.title) notFound();
  return (
    <CampaignDetail
      locale={locale}
      campaign={{ ...campaign, public_content: content }}
      preview
    />
  );
}
