import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
import { brief } from "@/lib/brief";
export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    b = brief[locale];
  return (
    <article className="page narrow section">
      <header className="page-head">
        <p className="eyebrow">{b.eyebrow}</p>
        <h1>{b.about[0]}</h1>
        <p className="lead">{b.intro}</p>
      </header>
      <div className="prose">
        {b.about.map((title, i) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{b.aboutBody[i]}</p>
          </section>
        ))}
      </div>
      <div className="actions">
        <Link className="button" href={`/${locale}/explore`}>
          {d.browse}
        </Link>
        <Link className="text-link" href={`/${locale}/contact`}>
          {d.contact} →
        </Link>
      </div>
    </article>
  );
}
