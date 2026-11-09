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
      <section className="hero page giving-hero">
        <div className="hero-copy">
          <span className="eyebrow">{d.tagline}</span>
          <h1>
            {d.hero.split("\n").map((line, i) => (
              <span key={line} className={i ? "hero-accent" : ""}>
                {line}
              </span>
            ))}
          </h1>
          <p className="lead">{d.intro}</p>
          <div className="actions">
            <Link className="button" href={`/${locale}/submit`}>
              {d.create}
              <Icon name="plus" />
            </Link>
            <Link className="text-link" href={`/${locale}/explore`}>
              {d.browse}
              <Icon name="arrowRight" />
            </Link>
          </div>
        </div>
        <div className="cause-orbit" aria-label={d.categories}>
          {categoryKeys.map((category, i) => (
            <Link
              className={`orbit-cause orbit-cause-${i}`}
              key={category}
              href={`/${locale}/explore?category=${category}`}
            >
              <span className="orbit-photo">
                <Image
                  src={
                    [
                      "/photos/learning.webp",
                      "/photos/care.webp",
                      "/photos/growing.webp",
                      "/photos/together.webp",
                      "/photos/learning.webp",
                    ][i]
                  }
                  alt=""
                  fill
                  priority={i < 2}
                  sizes="(max-width: 520px) 110px, (max-width: 959px) 140px, 200px"
                />
              </span>
              <span className="orbit-label">
                {d[category]}
                <Icon name="arrowRight" />
              </span>
            </Link>
          ))}
        </div>
        <div className="hero-community-line">
          <p>Men anpil, chay pa lou.</p>
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
      <section className="section page home-discovery">
        <header className="discovery-heading">
          <p className="eyebrow">{copy.discover}</p>
          <h2>{d.categories}</h2>
        </header>
        <form
          className="home-search search-field"
          action={`/${locale}/explore`}
        >
          <Icon name="search" />
          <input name="q" aria-label={d.search} placeholder={d.searchHint} />
          <button className="button" type="submit">
            {d.search}
            <Icon name="arrowRight" />
          </button>
        </form>
        <nav className="discovery-categories" aria-label={d.categories}>
          <Link
            className="category-chip category-chip-all"
            href={`/${locale}/explore`}
          >
            {d.any}
          </Link>
          {categoryKeys.map((category, i) => (
            <Link
              className="category-chip"
              key={category}
              href={`/${locale}/explore?category=${category}`}
            >
              <Icon
                name={
                  (["bookmark", "heart", "sparkle", "users", "door"] as const)[
                    i
                  ]
                }
              />
              {d[category]}
            </Link>
          ))}
        </nav>
        <div className="section-head">
          <div>
            <h2>{d.featured}</h2>
          </div>
          <Link className="text-link" href={`/${locale}/explore`}>
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="campaign-grid home-campaigns">
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
