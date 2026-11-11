import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import { editorial } from "@/lib/editorial";
import Icon from "@/components/Icon";
export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    b = brief[locale],
    e = editorial[locale];
  return (
    <article className="about-editorial">
      <header className="page section about-opening">
        <p className="eyebrow">{d.about} / pote kole.</p>
        <h1>{e.aboutTitle}</h1>
        <p className="lead">{e.aboutIntro}</p>
      </header>
      <section className="definition-band">
        <div className="page">
          <h2>
            {e.definition}
            <span> /pɔ.te kɔ.le/</span>
          </h2>
          <p>{e.definitionBody}</p>
        </div>
      </section>
      <div className="page about-chapters">
        {b.about.slice(1).map((title, i) => (
          <section key={title}>
            <div>
              <span className="index-number">0{i + 1}</span>
              <h2>{title}</h2>
            </div>
            <p>{b.aboutBody[i + 1]}</p>
          </section>
        ))}
      </div>
      <section className="page invitation-section">
        <div>
          <h2>{e.invitation}</h2>
          <p>{e.whyBody}</p>
        </div>
        <Link
          className="round-link"
          href={`/${locale}/explore`}
          aria-label={d.browse}
        >
          <Icon name="arrowRight" />
        </Link>
      </section>
    </article>
  );
}
