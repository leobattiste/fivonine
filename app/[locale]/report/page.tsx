import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { preview, publicCampaign } from "@/lib/data";
import { MessageForm } from "@/components/Forms";
export const metadata = { robots: { index: false, follow: false } };
export default async function Report({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ campaign?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { id } = { id: (await searchParams).campaign ?? "" };
  const c = await publicCampaign(id);
  if (!c) notFound();
  const d = t(locale);
  return (
    <section className="page section report-page narrow">
      <header className="page-head">
        <h1>{d.report}</h1>
        <p className="lead">{d.reportIntro}</p>
      </header>
      <div className="report-context">
        <span className="eyebrow">
          {d[c.public_content.category]} · {c.public_content.region}
        </span>
        <h2>{c.public_content.title}</h2>
      </div>
      <MessageForm locale={locale} campaignId={id} enabled={!preview} />
    </section>
  );
}
