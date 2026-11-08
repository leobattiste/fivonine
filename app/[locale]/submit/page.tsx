import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { currentUser, preview } from "@/lib/data";
import { CampaignForm } from "@/components/Forms";
export const dynamic = "force-dynamic";
export default async function Submit({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    user = await currentUser();
  return (
    <section className="page narrow section">
      <header className="page-head">
        <p className="eyebrow">{d.tagline}</p>
        <h1>{d.submit}</h1>
        <p className="lead">{d.submitIntro}</p>
      </header>
      {preview ? (
        <p className="notice">{d.unavailable}</p>
      ) : (
        !user && (
          <p className="notice">
            <Link href={`/${locale}/login`}>{d.login}</Link> — {d.loginIntro}
          </p>
        )
      )}
      <CampaignForm locale={locale} enabled={!!user && !preview} />
      <p className="disclosure">{d.disclosure}</p>
    </section>
  );
}
