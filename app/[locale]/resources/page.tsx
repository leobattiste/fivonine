import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
import { platform } from "@/lib/platform-content";
import ResourceCards from "@/components/ResourceCards";
export default async function Resources({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = platform[locale],
    d = t(locale);
  return (
    <section className="page section">
      <header className="page-head">
        <p className="eyebrow">{d.tagline}</p>
        <h1>{p.resources}</h1>
        <p className="lead">{p.resourceIntro}</p>
      </header>
      <ResourceCards locale={locale} />
      <aside className="resource-help">
        <h2>{d.help}</h2>
        <p>{p.noPayments}</p>
        <div className="actions">
          <Link className="button secondary" href={`/${locale}/help`}>
            {p.faq}
          </Link>
          <Link className="text-link" href={`/${locale}/safety`}>
            {p.safety} →
          </Link>
        </div>
      </aside>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: platform[locale].resources } : {};
}
