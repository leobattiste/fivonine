import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
import { legalCopy } from "@/lib/content";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  const ids = [
    "privacy",
    "terms",
    "guidelines",
    "review",
    "donations",
  ];
  return (
    <article className="page narrow section">
      <header className="page-head">
        <p className="eyebrow">{d.tagline}</p>
        <h1>{d.terms}</h1>
      </header>
      <nav className="tabs">
        {legalCopy[locale].map((s, i) => (
          <a key={s.heading} href={"#" + ids[i]}>
            {s.heading}
          </a>
        ))}
      </nav>
      <div className="prose">
        {legalCopy[locale].map((s, i) => (
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
