import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { causeIcon } from "@/components/Icon";
import { Avatar, Cover, FundraiserCard, ReviewChecks, causeName, excerpt, ownerName, place } from "@/components/Campaign";
import { PexelsPhoto } from "@/components/Brand";
import { featuredCampaigns, getCategories, listCampaigns } from "@/lib/data";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { isLite } from "@/lib/prefs";
import { PHOTOS } from "@/lib/photos";
import type { Campaign, Category } from "@/lib/types";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), h = d.x.home, L = (p: string) => `/${locale}${p}`;
  const [stories, cats, lite, recent] = await Promise.all([featuredCampaigns(), getCategories(), isLite(), listCampaigns({ perPage: 9, sort: "newest" })]);
  const seen = new Set(stories.map((c) => c.id));
  const more = recent.items.filter((c) => !seen.has(c.id)).slice(0, 6);
  const hasAny = stories.length > 0;

  return (
    <>
      <section className="wrap hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">{h.title}</h1>
          <p className="lead">{h.sub}</p>
          <form role="search" className="searchbar big" action={L("/explore")} method="get">
            <Icon name="search" size={22} />
            <label htmlFor="hero-q" className="sr">{d.x.nav.searchLabel}</label>
            <input id="hero-q" name="q" type="search" placeholder={d.x.nav.searchHint} maxLength={60} enterKeyHint="search" />
            <button className="btn primary">{d.x.nav.go}</button>
          </form>
          <div className="row">
            <Link className="arrow-link" href={L("/create")}>{h.organizerCta}<Icon name="arrow" size={18} /></Link>
          </div>
        </div>
        <div className="hero-art">
          <PexelsPhoto photo={PHOTOS.jacmel} locale={locale} priority sizes="(min-width: 900px) 28vw, 55vw" />
          <PexelsPhoto photo={PHOTOS.huddle} locale={locale} sizes="(min-width: 900px) 22vw, 45vw" />
          <div className="note">
            <Icon name="hand" size={26} />
            <strong>{h.steps[0][0]}</strong>
            <p>{h.steps[1][0]}.</p>
          </div>
        </div>
      </section>

      {cats.length > 0 && (
        <section className="wrap" aria-labelledby="browse-title" style={{ paddingBottom: 8 }}>
          <h2 id="browse-title" className="sr">{h.browse}</h2>
          <nav className="causes-rail" aria-label={h.browse}>
            {cats.map((c) => (
              <Link key={c.slug} className="cause-link" href={L(`/explore?cause=${c.slug}`)}><span className="ico"><Icon name={causeIcon[c.slug] ?? "hand"} size={18} /></span>{c[`name_${locale}`]}</Link>
            ))}
          </nav>
        </section>
      )}

      {hasAny ? (
        <>
          <section className="wrap band" aria-labelledby="stories-title">
            <div className="band-head">
              <div><h2 id="stories-title">{h.stories}</h2><p>{h.storiesSub}</p></div>
              <Link className="arrow-link" href={L("/explore")}>{h.seeAll}<Icon name="arrow" size={18} /></Link>
            </div>
            <Stories items={stories} locale={locale} cats={cats} lite={lite} />
          </section>
          {more.length > 0 && (
            <section className="wrap band" aria-labelledby="more-title" style={{ paddingTop: 8 }}>
              <div className="band-head"><h2 id="more-title">{h.collection}</h2></div>
              <div className="grid-cards">{more.map((c) => <FundraiserCard key={c.id} c={c} locale={locale} cats={cats} lite={lite} />)}</div>
            </section>
          )}
        </>
      ) : (
        <section className="wrap band" aria-labelledby="empty-title">
          <div className="empty-home">
            <div className="stack">
              <h2 id="empty-title">{h.emptyTitle}</h2>
              <p>{h.emptyBody}</p>
              <div className="row">
                <Link className="btn primary" href={L("/create")}><Icon name="plus" size={18} />{h.organizerCta}</Link>
                <Link className="btn quiet" href={L("/how-it-works")}>{h.emptyHow}</Link>
              </div>
            </div>
            <div className="ghost-cards" aria-hidden="true"><span /><span /><span /></div>
          </div>
        </section>
      )}

      <section className="wrap band" aria-labelledby="know-title">
        <div className="band-head"><h2 id="know-title">{h.stepsTitle}</h2><Link className="arrow-link" href={L("/how-it-works")}>{d.x.nav.how}<Icon name="arrow" size={18} /></Link></div>
        <ol className="steps3">
          {h.steps.map(([title, body], i) => <li key={title}><span className="n" aria-hidden="true">{i + 1}</span><h3>{title}</h3><p>{body}</p></li>)}
        </ol>
      </section>

      <section className="wrap band" aria-labelledby="org-title" style={{ paddingTop: 8 }}>
        <div className="organizer-cta">
          <PexelsPhoto photo={PHOTOS.care} locale={locale} sizes="(min-width: 900px) 45vw, 100vw" />
          <div className="copy">
            <h2 id="org-title">{h.organizerTitle}</h2>
            <p>{h.organizerBody}</p>
            <Link className="btn large" href={L("/create")}><Icon name="plus" size={18} />{h.organizerCta}</Link>
            <Link className="arrow-link" href={L("/resources")}>{h.organizerLink}<Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stories({ items, locale, cats, lite }: { items: Campaign[]; locale: Locale; cats: Category[]; lite: boolean }) {
  const d = t(locale);
  const [lead, ...side] = items;
  const href = (c: Campaign) => `/${locale}/campaigns/${c.slug}`;
  return (
    <div className="stories">
      <article className="story-lead fcard">
        <Cover c={lead} lite={lite} priority sizes="(min-width: 900px) 40vw, 100vw" />
        <div className="stack">
          <p className="meta">{lead.cause && <span>{causeName(cats, lead.cause, locale)}</span>}{place(lead) && <span><Icon name="pin" size={14} /> {place(lead)}</span>}</p>
          <h3><Link href={href(lead)}>{lead.title}</Link></h3>
          {lead.story && <p className="excerpt" style={{ WebkitLineClamp: 4 }}>{excerpt(lead.story, 240)}</p>}
          <div className="foot">
            <div className="stack tight">
              {ownerName(lead) && <p className="by"><Avatar name={ownerName(lead)} path={lite ? null : lead.owner?.avatar_path} size={26} /><span>{d.x.card.by} {ownerName(lead)}</span></p>}
              <ReviewChecks tier={lead.tier} locale={locale} />
            </div>
            <span className="go" aria-hidden="true"><Icon name="arrow" size={18} /></span>
          </div>
        </div>
      </article>
      {side.length > 0 && (
        <div className="story-side">
          {side.map((c) => (
            <article key={c.id} className="story-sm fcard">
              <Cover c={c} lite={lite} sizes="170px" />
              <div className="stack tight">
                <p className="meta">{c.cause && <span>{causeName(cats, c.cause, locale)}</span>}</p>
                <h3><Link href={href(c)}>{c.title}</Link></h3>
                {place(c) && <p className="meta"><span><Icon name="pin" size={14} /> {place(c)}</span></p>}
                <ReviewChecks tier={c.tier} locale={locale} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
