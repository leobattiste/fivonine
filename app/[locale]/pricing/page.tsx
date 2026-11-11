import { editorial } from "@/lib/editorial";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { platform } from "@/lib/platform-content";
export default async function Pricing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = platform[locale],
    d = t(locale);
  return (
    <section className="page section fees-page">
      <header className="page-head">
        <p className="eyebrow">{editorial[locale].fees}</p>
        <h1>{editorial[locale].feesTitle}</h1>
        <p className="lead">{p.noPayments}</p>
      </header>
      <div className="pricing-grid">
        <article>
          <span className="fee-label">{editorial[locale].freeLabel}</span>
          <h2>{p.free}</h2>
          <p>{p.freeBody}</p>
          <Link className="button" href={`/${locale}/submit`}>
            {d.create}
          </Link>
        </article>
        <article>
          <span className="fee-label">{editorial[locale].externalLabel}</span>
          <h2>{p.external}</h2>
          <p>{p.externalBody}</p>
          <Link
            className="text-link"
            href={`/${locale}/resources/support-instructions`}
          >
            {p.guide} →
          </Link>
        </article>
      </div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: platform[locale].pricing } : {};
}
