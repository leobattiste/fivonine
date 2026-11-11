import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import Icon from "@/components/Icon";
export default async function How({
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
        <p className="eyebrow">pote kole.</p>
        <h1>{d.how}</h1>
        <p className="lead">{b.intro}</p>
      </header>
      <div className="steps">
        {[1, 2, 3].map((n) => (
          <article key={n}>
            <span>0{n}</span>
            <div>
              <h2>{b[`step${n}` as "step1"]}</h2>
              <p>{b[`step${n}body` as "step1body"]}</p>
            </div>
          </article>
        ))}
      </div>
      <section className="supporter-guide prose">
        <h2>{b.supporters}</h2>
        <p>{b.supporterBody}</p>
        <div className="actions">
          <Link className="button secondary" href={`/${locale}/explore`}>
            {d.browse}
          </Link>
          <Link className="text-link" href={`/${locale}/safety`}>
            {d.safety}
            <Icon name="arrowRight" />
          </Link>
        </div>
      </section>
      <p className="disclosure">{d.disclosure}</p>
      <div className="actions">
        <Link className="button" href={`/${locale}/submit`}>
          {d.create}
        </Link>
      </div>
    </article>
  );
}
