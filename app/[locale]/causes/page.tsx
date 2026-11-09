import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { causeCopy, causeMedia, platform } from "@/lib/platform-content";
import Icon from "@/components/Icon";
export default async function Causes({
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
        <p className="eyebrow">{d.tagline}</p>
        <h1>{p.causes}</h1>
        <p className="lead">{p.causeIntro}</p>
      </header>
      <div className="cause-directory">
        {categoryKeys.map((category) => (
          <Link
            className="cause-directory-card"
            key={category}
            href={`/${locale}/causes/${category}`}
          >
            <div className="cause-directory-image">
              <Image
                src={causeMedia[category]}
                alt=""
                fill
                sizes="(max-width: 799px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="eyebrow">{d[category]}</p>
              <h2>{causeCopy[locale][category].title}</h2>
              <p>{causeCopy[locale][category].body}</p>
              <span className="text-link">
                {p.browse}
                <Icon name="arrowRight" />
              </span>
            </div>
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
