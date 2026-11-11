import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import { publicCampaigns } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";
import Icon from "@/components/Icon";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    b = brief[locale];
  const { items } = await publicCampaigns();
  const featured = items.filter((c) => c.featured).slice(0, 3);
  const recent = items
    .filter((c) => !featured.some((f) => f.id === c.id))
    .slice(0, 3);
  return (
    <>
      <section className="page home-hero" data-home-section="hero">
        <div className="hero-copy">
          <p className="eyebrow">{b.eyebrow}</p>
          <h1>{b.hero}</h1>
          <p className="lead">{b.intro}</p>
          <div className="actions">
            <Link className="button" href={`/${locale}/explore`}>
              {d.browse}
              <Icon name="arrowRight" />
            </Link>
            <Link className="button secondary" href={`/${locale}/submit`}>
              {d.create}
            </Link>
          </div>
        </div>
        <figure className="hero-photo">
          <Image
            src="/photos/together.webp"
            alt={
              locale === "en"
                ? "People joining hands in a circle"
                : locale === "fr"
                  ? "Des personnes unissent leurs mains"
                  : "Moun mete men yo ansanm"
            }
            fill
            priority
            sizes="(max-width: 799px) 100vw, 45vw"
          />
          <figcaption>Men anpil, chay pa lou.</figcaption>
        </figure>
      </section>
      <section className="page home-categories" data-home-section="categories">
        <div className="section-head">
          <h2>{b.categories}</h2>
          <Link className="text-link" href={`/${locale}/causes`}>
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="category-grid">
          {categoryKeys.map((c, i) => (
            <Link key={c} href={`/${locale}/causes/${c}`}>
              <Icon
                name={
                  (["bookmark", "heart", "sparkle", "users", "door"] as const)[
                    i
                  ]
                }
              />
              <span>{d[c]}</span>
              <Icon name="arrowRight" />
            </Link>
          ))}
        </div>
      </section>
      <section className="page section" data-home-section="featured">
        <div className="section-head">
          <h2>{b.featured}</h2>
          <Link className="text-link" href={`/${locale}/explore`}>
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="campaign-grid">
          {featured.map((c) => (
            <CampaignCard key={c.id} campaign={c} locale={locale} />
          ))}
        </div>
        {!featured.length && <p className="empty">{d.empty}</p>}
      </section>
      <section
        className="page section recent-section"
        data-home-section="recent"
      >
        <div className="section-head">
          <h2>{b.recent}</h2>
          <Link className="text-link" href={`/${locale}/explore?sort=created`}>
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="campaign-grid">
          {(recent.length ? recent : items.slice(0, 3)).map((c) => (
            <CampaignCard key={c.id} campaign={c} locale={locale} />
          ))}
        </div>
      </section>
      <section className="page section home-how" data-home-section="how">
        <div className="section-head">
          <h2>{d.how}</h2>
          <Link className="text-link" href={`/${locale}/how-it-works`}>
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="steps">
          {[1, 2, 3].map((n) => (
            <article key={n}>
              <span>0{n}</span>
              <div>
                <h3>{b[`step${n}` as "step1"]}</h3>
                <p>{b[`step${n}body` as "step1body"]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="trust-statement" data-home-section="trust">
        <div className="page">
          <span className="trust-icon">
            <Icon name="shield" />
          </span>
          <div>
            <h2>{b.trust}</h2>
            <p>{b.trustBody}</p>
          </div>
          <Link className="text-link" href={`/${locale}/safety`}>
            {d.safety}
            <Icon name="arrowRight" />
          </Link>
        </div>
      </section>
      <section
        className="page section submit-invitation"
        data-home-section="submit"
      >
        <div>
          <p className="eyebrow">pote kole.</p>
          <h2>{b.cta}</h2>
          <p>{b.ctaBody}</p>
        </div>
        <Link className="button" href={`/${locale}/submit`}>
          {d.create}
          <Icon name="plus" />
        </Link>
      </section>
    </>
  );
}
