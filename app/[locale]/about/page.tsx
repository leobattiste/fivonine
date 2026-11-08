import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
import { aboutCopy } from "@/lib/content";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  const ids: string[] = [];
  return (
    <article className="page narrow section">
      <header className="page-head">
        <p className="eyebrow">{d.tagline}</p>
        <h1>{d.about}</h1>
      </header>
      <div className="prose">
        {aboutCopy[locale].map((s, i) => (
          <section key={s.heading} id={ids[i]}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
      <Link className="button secondary" href={`/${locale}/contact`}>
        {d.contact}
      </Link>
    </article>
  );
}
