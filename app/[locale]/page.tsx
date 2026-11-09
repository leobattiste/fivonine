import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { publicCampaigns } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";
import Icon from "@/components/Icon";
import Image from "next/image";
import { designCopy } from "@/lib/design-copy";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  const copy = designCopy[locale];
  const { items } = await publicCampaigns();
  const featured = items.filter((c) => c.featured);
  const cards = (featured.length ? featured : items).slice(0, 3);
  return (
    <>
      <section className="hero page">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-rule" />
            {d.tagline}
          </span>
          <h1>
            {d.hero.split("\n").map((line, i) => (
              <span key={line} className={i ? "hero-accent" : ""}>
                {line}
              </span>
            ))}
          </h1>
          <p className="lead">{d.intro}</p>
          <div className="actions">
            <Link className="button" href={`/${locale}/explore`}>
              {d.browse}
              <Icon name="arrowRight" />
            </Link>
            <Link className="button secondary" href={`/${locale}/submit`}>
              {d.create}
              <Icon name="plus" />
            </Link>
          </div>
          <div className="hero-facts">
            <span>
              <Icon name="globe" />
              {locale === "ht"
                ? "Ayiti ak dyaspora a"
                : locale === "fr"
                  ? "Haïti et sa diaspora"
                  : "Haiti & the diaspora"}
            </span>
            <span>
              <Icon name="heart" />
              {locale === "ht"
                ? "Kominote an premye"
                : locale === "fr"
                  ? "La communauté d’abord"
                  : "Community first"}
            </span>
          </div>
        </div>
        <figure className="hero-visual">
          <Image
            src="/photos/together.webp"
            alt={copy.heroAlt}
            fill
            priority
            sizes="(max-width: 799px) 100vw, 50vw"
          />
          <div className="hero-image-shade" />
          <figcaption>
            <span>{copy.sharedRoots}</span>
            <strong>
              Men anpil,
              <br />
              chay pa lou.
            </strong>
          </figcaption>
          <div className="hero-image-index" aria-hidden="true">
            HT / 509
          </div>
        </figure>
      </section>
      <div className="principles-strip">
        <div className="page principles-inner">
          <span>
            <Icon name="globe" />
            {copy.community}
          </span>
          <span>
            <Icon name="users" />
            {copy.reviewed}
          </span>
          <span>
            <Icon name="external" />
            {copy.direct}
          </span>
        </div>
      </div>
      <section className="section page">
        <div className="section-head">
          <div>
            <p className="eyebrow">{copy.discover}</p>
            <h2>{d.featured}</h2>
          </div>
          <Link className="text-link" href={`/${locale}/explore`}>
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="campaign-grid">
          {cards.map((c, i) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              locale={locale}
              priority={i < 3}
            />
          ))}
        </div>
        {!cards.length && <p className="empty">{d.empty}</p>}
      </section>
      <section className="category-section section page">
        <h2>{d.categories}</h2>
        <div className="category-grid">
          {categoryKeys.map((c, i) => (
            <Link key={c} href={`/${locale}/explore?category=${c}`}>
              <span className={`category-symbol symbol-${i}`}>
                <Icon
                  name={
                    (
                      ["bookmark", "heart", "sparkle", "users", "door"] as const
                    )[i]
                  }
                />
              </span>
              <span>{d[c]}</span>
              <Icon name="arrowRight" />
            </Link>
          ))}
        </div>
      </section>
      <section className="how-section section page">
        <div>
          <p className="eyebrow">{copy.simple}</p>
          <h2>{d.how}</h2>
          <p className="muted">{d.disclosure}</p>
        </div>
        <div className="steps">
          {[1, 2, 3].map((n) => (
            <article key={n}>
              <span>0{n}</span>
              <div>
                <h3>{d[`step${n}` as "step1"]}</h3>
                <p>{d[`step${n}body` as "step1body"]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="community-cta page">
        <div>
          <p className="eyebrow">{d.tagline}</p>
          <h2>{copy.cta}</h2>
          <p>{copy.ctaBody}</p>
        </div>
        <Link className="button" href={`/${locale}/submit`}>
          {d.create}
          <Icon name="arrowRight" />
        </Link>
      </section>
    </>
  );
}
