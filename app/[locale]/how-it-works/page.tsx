import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
export default async function How({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  return (
    <article className="page narrow section">
      <header className="page-head">
        <h1>{d.how}</h1>
        <p className="lead">{d.intro}</p>
      </header>
      <div className="steps">
        {[1, 2, 3].map((n) => (
          <article key={n}>
            <span>0{n}</span>
            <div>
              <h2>{d[`step${n}` as "step1"]}</h2>
              <p>{d[`step${n}body` as "step1body"]}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="notice">{d.disclosure}</div>
      <h2>{d.safety}</h2>
      <p className="lead">{d.safetyBody}</p>
      <div className="actions">
        <Link className="button" href={`/${locale}/submit`}>
          {d.create}
        </Link>
        <Link className="text-link" href={`/${locale}/help`}>
          {d.help} →
        </Link>
      </div>
    </article>
  );
}
