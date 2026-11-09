import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys, type Category } from "@/lib/i18n";
import { currentUser, preview } from "@/lib/data";
import { CampaignForm } from "@/components/Forms";
import { platform } from "@/lib/platform-content";
export const dynamic = "force-dynamic";
export default async function Submit({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const requested = (await searchParams).category;
  const category = categoryKeys.includes(requested as Category)
    ? (requested as Category)
    : undefined;
  const p = platform[locale];
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
      <details className="submission-checklist">
        <summary>{p.checklist}</summary>
        <ul>
          {p.checklistItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link
          className="text-link"
          href={`/${locale}/resources/tell-your-story`}
        >
          {p.guide} →
        </Link>
      </details>
      <CampaignForm
        locale={locale}
        enabled={!!user && !preview}
        defaultCategory={category}
      />
      <p className="disclosure">{d.disclosure}</p>
    </section>
  );
}
