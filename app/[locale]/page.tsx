export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import { editorial } from "@/lib/editorial";
import { publicCampaigns } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";
import Media from "@/components/Media";
import Icon from "@/components/Icon";
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    b = brief[locale],
    e = editorial[locale];
  const { items } = await publicCampaigns();
  const lead = items.find((c) => c.featured);
  const recent = items.filter((c) => c.id !== lead?.id).slice(0, 3);
  return (
    <>
      <section className="page editorial-hero" data-home-section="hero">
        <p className="eyebrow">
          <span className="status-dot" />
          {e.territory}
        </p>
        <h1>
          <span>{e.home[0]}</span>
          <span>{e.home[1]}</span>
        </h1>
        <div className="hero-baseline">
          <p>{e.intro}</p>
          <form action={`/${locale}/explore`} className="hero-search">
            <label>
              <span className="sr-only">{e.searchLabel}</span>
              <Icon name="search" />
              <input name="q" placeholder={e.search} maxLength={120} />
            </label>
            <button aria-label={e.searchLabel}>
              <Icon name="arrowRight" />
            </button>
          </form>
        </div>
      </section>
      <section
        className="page cause-index-section"
        data-home-section="categories"
      >
        <div className="editorial-section-intro">
          <h2>{e.causes}</h2>
          <p>{e.causeIntro}</p>
        </div>
        <div className="cause-index">
          {categoryKeys.map((key, i) => (
            <Link href={`/${locale}/causes/${key}`} key={key}>
              <span className="index-number">0{i + 1}</span>
              <Icon
                name={
                  (["bookmark", "heart", "sparkle", "users", "door"] as const)[
                    i
                  ]
                }
              />
              <span>{d[key]}</span>
              <Icon name="arrowRight" />
            </Link>
          ))}
        </div>
      </section>
      {lead && (
        <section className="page section" data-home-section="featured">
          <p className="eyebrow section-kicker">{e.selected}</p>
          <Link href={`/${locale}/campaigns/${lead.id}`} className="lead-story">
            <Media
              src={lead.public_content.photo_url}
              alt={lead.public_content.title}
              category={lead.public_content.category}
            />
            <div>
              <p className="eyebrow">
                {d[lead.public_content.category]} · {lead.public_content.region}
              </p>
              <h2>{lead.public_content.title}</h2>
              <p>{lead.public_content.story.slice(0, 240)}</p>
              <span className="text-link">
                {b.view}
                <Icon name="arrowRight" />
              </span>
            </div>
          </Link>
        </section>
      )}
      {recent.length > 0 && (
        <section className="page section" data-home-section="recent">
          <div className="section-head">
            <h2>{e.recent}</h2>
            <Link className="text-link" href={`/${locale}/explore`}>
              {e.all}
              <Icon name="arrowRight" />
            </Link>
          </div>
          <div className="campaign-grid">
            {recent.map((c) => (
              <CampaignCard key={c.id} campaign={c} locale={locale} />
            ))}
          </div>
        </section>
      )}
      <section className="home-manifesto" data-home-section="trust">
        <div className="page manifesto-inner">
          <p className="eyebrow">pote kole. / {d.about}</p>
          <h2>{e.why}</h2>
          <div>
            <p>{e.whyBody}</p>
            <Link className="text-link" href={`/${locale}/about`}>
              {e.whyLink}
              <Icon name="arrowRight" />
            </Link>
          </div>
        </div>
      </section>
      <section className="page section home-how" data-home-section="how">
        <div className="section-head">
          <h2>{e.method}</h2>
          <Link className="text-link" href={`/${locale}/how-it-works`}>
            {d.how}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <div className="process-row">
          {[1, 2, 3].map((n) => (
            <article key={n}>
              <span className="process-mark">
                <Icon
                  name={(["content", "reviews", "globe"] as const)[n - 1]}
                />
              </span>
              <h3>{b[`step${n}` as "step1"]}</h3>
              <p>{b[`step${n}body` as "step1body"]}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="page invitation-section" data-home-section="submit">
        <div>
          <h2>{e.invitation}</h2>
          <p>{e.invitationBody}</p>
        </div>
        <Link
          href={`/${locale}/submit`}
          className="round-link"
          aria-label={d.create}
        >
          <Icon name="arrowRight" />
        </Link>
      </section>
    </>
  );
}
