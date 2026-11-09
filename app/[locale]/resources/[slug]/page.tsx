import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { guides, platform } from "@/lib/platform-content";
import Icon from "@/components/Icon";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const g = guides[locale].find((g) => g.slug === slug);
  return g ? { title: g.title, description: g.intro } : {};
}
export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const p = platform[locale],
    d = t(locale),
    guide = guides[locale].find((g) => g.slug === slug);
  if (!guide) notFound();
  return (
    <article className="page section guide-page">
      <Link className="text-link" href={`/${locale}/resources`}>
        <Icon name="arrowLeft" />
        {p.guideBack}
      </Link>
      <header className="page-head">
        <p className="eyebrow">{p.resources}</p>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.intro}</p>
      </header>
      <div className="guide-layout">
        <nav className="guide-toc" aria-label={p.overview}>
          {guide.sections.map((s, i) => (
            <a key={s.heading} href={`#step-${i}`}>
              {s.heading}
            </a>
          ))}
          <Link href={`/${locale}/submit`}>{d.create} →</Link>
        </nav>
        <div className="prose">
          {guide.sections.map((s, i) => (
            <section key={s.heading} id={`step-${i}`}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
          <div className="actions">
            <Link className="button" href={`/${locale}/submit`}>
              {d.create}
            </Link>
            <Link className="text-link" href={`/${locale}/help`}>
              {d.help} →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
