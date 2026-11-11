import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { causeCopy, platform } from "@/lib/platform-content";
import { editorial } from "@/lib/editorial";
import Icon from "@/components/Icon";
export default async function Causes({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    e = editorial[locale];
  return (
    <section className="page section causes-page">
      <header className="directory-heading">
        <p className="eyebrow">{platform[locale].causes}</p>
        <h1>{e.causes}</h1>
        <p>{e.causeIntro}</p>
      </header>
      <div className="cause-directory">
        {categoryKeys.map((key, i) => (
          <Link
            className="cause-directory-card"
            href={`/${locale}/causes/${key}`}
            key={key}
          >
            <span className="index-number">0{i + 1}</span>
            <div className="cause-name">
              <Icon
                name={
                  (["bookmark", "heart", "sparkle", "users", "door"] as const)[
                    i
                  ]
                }
              />
              <h2>{d[key]}</h2>
            </div>
            <p>{causeCopy[locale][key].body}</p>
            <span className="round-link" aria-hidden="true">
              <Icon name="arrowRight" />
            </span>
          </Link>
        ))}
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
  return isLocale(locale) ? { title: platform[locale].causes } : {};
}
