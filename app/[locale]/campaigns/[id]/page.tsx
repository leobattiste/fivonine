import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { publicCampaign } from "@/lib/data";
import CampaignDetail from "@/components/CampaignDetail";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const c = await publicCampaign(id);
  return c
    ? {
        title: c.public_content.title,
        description: c.public_content.story.slice(0, 155),
        alternates: { canonical: `/${locale}/campaigns/${id}` },
      }
    : { title: "Campaign unavailable" };
}
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const campaign = await publicCampaign(id);
  if (!campaign) notFound();
  return <CampaignDetail locale={locale} campaign={campaign} />;
}
