import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { platform } from "@/lib/platform-content";
import Icon from "@/components/Icon";
export default async function Safety({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    p = platform[locale];
  return (
    <section className="page section">
      <header className="page-head">
        <p className="eyebrow">fivonine</p>
        <h1>{p.safety}</h1>
        <p className="lead">{p.safetyIntro}</p>
      </header>
      <div className="safety-layout">
        <section className="safety-checklist">
          <h2>{p.before}</h2>
          <ul>
            {p.beforeItems.map((item) => (
              <li key={item}>
                <Icon name="check" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link
            className="text-link"
            href={`/${locale}/resources/support-instructions`}
          >
            {p.supportMethods}
            <Icon name="arrowRight" />
          </Link>
        </section>
        <div className="prose">
          <section>
            <h2>{p.responsible}</h2>
            <p>{p.responsibleBody}</p>
            <Link className="text-link" href={`/${locale}/legal#review`}>
              {d.verification} →
            </Link>
          </section>
          <section>
            <h2>{p.privacy}</h2>
            <p>{p.privacyBody}</p>
            <Link
              className="text-link"
              href={`/${locale}/resources/privacy-and-consent`}
            >
              {p.guide} →
            </Link>
          </section>
          <section>
            <h2>{p.problems}</h2>
            <p>{p.problemsBody}</p>
            <div className="actions">
              <Link className="button secondary" href={`/${locale}/contact`}>
                {d.contact}
              </Link>
              <Link className="text-link" href={`/${locale}/explore`}>
                {d.explore} →
              </Link>
            </div>
          </section>
        </div>
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
  return isLocale(locale) ? { title: platform[locale].safety } : {};
}
