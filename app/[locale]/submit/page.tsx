import { editorial } from "@/lib/editorial";
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
    <section className="page task-page submission-page">
      <div className="task-layout">
        <aside className="task-aside">
          <header className="page-head">
            <p className="eyebrow">{editorial[locale].workspace}</p>
            <h1>{d.submit}</h1>
            <p className="lead">{d.submitIntro}</p>
          </header>
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
          <p className="disclosure">{editorial[locale].saveExit}</p>
        </aside>
        <div className="task-surface">
          {!user && (
            <div className="submission-signin">
              <Link
                className="button"
                href={`/${locale}/login?next=/${locale}/submit`}
              >
                {d.login}
              </Link>
              <p>{d.loginIntro}</p>
            </div>
          )}
          <CampaignForm
            locale={locale}
            enabled={!!user && !preview}
            defaultCategory={category}
            email={user?.email}
          />
          <p className="disclosure">{d.disclosure}</p>
        </div>
      </div>
    </section>
  );
}
