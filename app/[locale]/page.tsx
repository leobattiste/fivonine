import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { causeIcon, type IconName } from "@/components/Icon";
import { Avatar, Cover, FundraiserCard, ReviewChecks, causeName, excerpt, ownerName, place } from "@/components/Campaign";
import { PexelsPhoto } from "@/components/Brand";
import { MethodCloud } from "@/components/Support";
import { featuredCampaigns, getCategories, listCampaigns } from "@/lib/data";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { PHOTOS } from "@/lib/photos";
import type { Campaign, Category } from "@/lib/types";

const TRUST_ICONS: IconName[] = ["badge", "hand", "coins"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), h = d.x.home, v = d.v3.home, L = (p: string) => `/${locale}${p}`;
  const [stories, cats, recent] = await Promise.all([featuredCampaigns(), getCategories(), listCampaigns({ perPage: 9, sort: "newest" })]);
  const seen = new Set(stories.map((c) => c.id));
  const more = recent.items.filter((c) => !seen.has(c.id)).slice(0, 8);
  const hasAny = stories.length > 0 || more.length > 0;

  return (
    <>
      <section className="wrap hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker"><Icon name="shield" size={16} />{v.kicker}</p>
          <h1 id="hero-title">{v.title}</h1>
          <p className="lead">{v.sub}</p>
          <form className="searchbar big hero-search" role="search" action={L("/explore")}>
            <Icon name="search" />
            <label htmlFor="home-q" className="sr">{d.x.nav.searchLabel}</label>
            <input id="home-q" name="q" type="search" placeholder={v.searchPh} maxLength={60} enterKeyHint="search" />
            <button className="btn primary" type="submit" aria-label={d.x.nav.go}><Icon name="arrow" size={20} /></button>
          </form>
          <div className="hero-ctas">
            <Link className="btn primary large" href={L("/explore")}><Icon name="hand" size={20} />{v.find}</Link>
            <Link className="btn large" href={L("/create")}><Icon name="plus" size={20} />{v.start}</Link>
          </div>
        </div>
        <div className="hero-media">
          <PexelsPhoto photo={PHOTOS.huddle} locale={locale} className="hero-image" priority sizes="(min-width: 1000px) 45vw, 100vw" />
          <div className="hero-proof" aria-hidden="true">
            <span className="ico"><Icon name="badge" size={20} /></span>
            <span><strong>{v.trust[0][0]}</strong><span>{v.trust[2][0]}</span></span>
          </div>
        </div>
      </section>

      <section className="wrap" aria-label={v.kicker}>
        <ul className="trust-strip">
          {v.trust.map(([title, body], i) => (
            <li key={title}><span className="ico"><Icon name={TRUST_ICONS[i]} size={22} /></span><strong>{title}</strong><p>{body}</p></li>
          ))}
        </ul>
      </section>

      {cats.length > 0 && (
        <section className="wrap band" aria-labelledby="browse-title">
          <div className="band-head"><h2 id="browse-title">{v.catsTitle}</h2></div>
          <nav className="cat-grid" aria-label={h.browse}>
            {cats.map((c) => (
              <Link key={c.slug} className="cat-tile" href={L(`/explore?cause=${c.slug}`)}>
                <span className="ico"><Icon name={causeIcon[c.slug] ?? "hand"} size={22} /></span>
                <span>{c[`name_${locale}`]}<Icon name="arrow" size={18} /></span>
              </Link>
            ))}
            <Link className="cat-tile all" href={L("/explore")}>
              <span className="ico"><Icon name="search" size={22} /></span>
              <span>{h.seeAll}<Icon name="arrow" size={18} /></span>
            </Link>
          </nav>
        </section>
      )}

      {hasAny ? (
        <>
          {stories.length > 0 && (
            <section className="wrap band" aria-labelledby="stories-title" style={{ paddingTop: 0 }}>
              <div className="band-head">
                <div><h2 id="stories-title">{h.stories}</h2><p>{h.storiesSub}</p></div>
                <Link className="arrow-link" href={L("/explore")}>{h.seeAll}<Icon name="arrow" size={18} /></Link>
              </div>
              <Stories items={stories} locale={locale} cats={cats} />
            </section>
          )}
          {more.length > 0 && (
            <section className="wrap band" aria-labelledby="more-title" style={{ paddingTop: 0 }}>
              <div className="band-head">
                <h2 id="more-title">{h.collection}</h2>
                <Link className="arrow-link" href={L("/explore")}>{h.seeAll}<Icon name="arrow" size={18} /></Link>
              </div>
              <div className="grid-cards">{more.map((c) => <FundraiserCard key={c.id} c={c} locale={locale} cats={cats} simplified />)}</div>
            </section>
          )}
        </>
      ) : (
        <section className="wrap band" aria-labelledby="empty-title" style={{ paddingTop: 0 }}>
          <div className="empty-home">
            <div className="stack">
              <h2 id="empty-title">{h.emptyTitle}</h2>
              <p>{h.emptyBody}</p>
              <div className="row">
                <Link className="btn primary" href={L("/create")}><Icon name="plus" size={18} />{v.start}</Link>
                <Link className="btn quiet" href={L("/how-it-works")}>{h.emptyHow}</Link>
              </div>
            </div>
            <div className="ghost-cards" aria-hidden="true"><span /><span /><span /></div>
          </div>
        </section>
      )}

      <section className="wrap" aria-labelledby="methods-title">
        <div className="methods-band">
          <div className="stack">
            <h2 id="methods-title">{v.methodsTitle}</h2>
            <p>{v.methodsSub}</p>
          </div>
          <MethodCloud />
        </div>
      </section>

      <section className="wrap band" aria-labelledby="know-title">
        <div className="band-head">
          <h2 id="know-title">{v.stepsTitle}</h2>
          <Link className="arrow-link" href={L("/how-it-works")}>{v.stepsCta}<Icon name="arrow" size={18} /></Link>
        </div>
        <ol className="steps3">
          {h.steps.map(([title, body], i) => <li key={title}><span className="n" aria-hidden="true">{i + 1}</span><h3>{title}</h3><p>{body}</p></li>)}
        </ol>
      </section>

      <section className="wrap" aria-labelledby="org-title">
        <div className="organizer-cta">
          <PexelsPhoto photo={PHOTOS.care} locale={locale} sizes="(min-width: 900px) 45vw, 100vw" />
          <div className="copy">
            <p className="eyebrow">{v.organizerKicker}</p>
            <h2 id="org-title">{h.organizerTitle}</h2>
            <p>{h.organizerBody}</p>
            <div className="actions">
              <Link className="btn primary large" href={L("/create")}><Icon name="plus" size={18} />{v.start}</Link>
              <Link className="arrow-link" href={L("/resources")}>{h.organizerLink}<Icon name="arrow" size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap band" aria-labelledby="safe-title">
        <div className="safety-band">
          <span className="ico"><Icon name="shield" size={24} /></span>
          <div className="stack tight"><h2 id="safe-title">{v.safetyTitle}</h2><p>{v.safetyBody}</p></div>
          <Link className="btn" href={L("/safety")}>{v.safetyCta}<Icon name="arrow" size={18} /></Link>
        </div>
      </section>
    </>
  );
}

function Stories({ items, locale, cats }: { items: Campaign[]; locale: Locale; cats: Category[] }) {
  const d = t(locale);
  const [lead, ...side] = items;
  const href = (c: Campaign) => `/${locale}/campaigns/${c.slug}`;
  return (
    <div className="stories">
      <article className="story-lead fcard">
        <div className="fcard-media">
          <Cover c={lead} priority sizes="(min-width: 1000px) 55vw, 100vw" />
          {lead.urgent && lead.status === "live" && <div className="badges"><span className="tag urgent">{d.v3.card.urgent}</span></div>}
        </div>
        <div className="stack">
          <p className="meta">{lead.cause && <span>{causeName(cats, lead.cause, locale)}</span>}{place(lead, locale) && <span><Icon name="pin" size={14} />{place(lead, locale)}</span>}</p>
          <h3><Link href={href(lead)}>{lead.title}</Link></h3>
          {lead.story && <p className="excerpt">{excerpt(lead.story, 220)}</p>}
          <div className="foot">
            {ownerName(lead) ? <p className="by"><Avatar name={ownerName(lead)} path={lead.owner?.avatar_path} size={28} /><span>{d.x.card.by} {ownerName(lead)}</span></p> : <span />}
            <span className="go" aria-hidden="true"><Icon name="arrow" size={18} /></span>
          </div>
          <ReviewChecks tier={lead.tier} locale={locale} />
        </div>
      </article>
      {side.length > 0 && (
        <div className="story-side">
          {side.map((c) => (
            <article key={c.id} className="story-sm fcard">
              <Cover c={c} sizes="132px" />
              <div className="stack tight">
                <p className="meta">{c.cause && <span>{causeName(cats, c.cause, locale)}</span>}{place(c, locale) && <span><Icon name="pin" size={14} />{place(c, locale)}</span>}</p>
                <h3><Link href={href(c)}>{c.title}</Link></h3>
                <ReviewChecks tier={c.tier} locale={locale} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
