import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { causeIcon, type IconName } from "@/components/Icon";
import { CampaignCard } from "@/components/Campaign";
import { HowTabs } from "@/components/Bits";
import Row from "@/components/Row";
import { featuredCampaigns, getCategories, getSettings, getStats } from "@/lib/data";
import { isLocale, t } from "@/lib/i18n";
import { isLite } from "@/lib/prefs";
import { fmtNumber } from "@/lib/format";

const trustIcons: IconName[] = ["eye", "badge", "church", "shield"];
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), h = d.home;
  const [allFeatured, cats, settings, stats, lite] = await Promise.all([featuredCampaigns(), getCategories(), getSettings(), getStats(), isLite()]);
  const featured = allFeatured.length >= 4 ? allFeatured.slice(0, 4) : allFeatured.slice(0, 3);
  const row = { prev: d.common.back, next: d.common.next };
  return (
    <>
      <div className="home-lead">
        <section className="statement is-hero" aria-labelledby="home-title">
          <div className="statement-body">
            <h1 id="home-title" className="display">{h.headline}</h1>
            <p className="lead">{h.sub}</p>
            <div className="actions">
              <Link className="btn primary large" href={`/${locale}/donate`}>{h.explore}</Link>
              <Link className="btn large" href={`/${locale}/create`}>{h.create}</Link>
            </div>
          </div>
        </section>
        {featured.length ? (
          <Row label={h.featured} {...row}>
            {featured.map((c) => <li key={c.id}><CampaignCard c={c} locale={locale} settings={settings} cats={cats} lite={lite} /></li>)}
          </Row>
        ) : (
          <div className="empty narrow"><p>{h.featuredEmpty}</p><Link className="btn primary" href={`/${locale}/create`}>{h.create}</Link></div>
        )}
      </div>

      <div className="home-block">
        <section className="statement" aria-labelledby="trust-title">
          <div className="statement-body">
            <h2 id="trust-title">{h.trustTitle}</h2>
            {stats.live > 0 && <p>{fmtNumber(stats.live, locale)} {h.stats.live} · {fmtNumber(stats.verified, locale)} {h.stats.verified}</p>}
          </div>
        </section>
        <Row label={h.trustTitle} {...row}>
          {h.trust.map(([title, body], i) => (
            <li key={title}><div className="tile"><Icon name={trustIcons[i]} size={28} /><h3>{title}</h3><p>{body}</p></div></li>
          ))}
        </Row>
      </div>

      <div className="home-block">
        <section className="statement" aria-labelledby="how-title">
          <div className="statement-body"><h2 id="how-title">{h.howTitle}</h2></div>
        </section>
        <div className="wrap narrow how-wrap"><HowTabs locale={locale} /></div>
      </div>

      {cats.length > 0 && (
        <div className="home-block">
          <section className="statement" aria-labelledby="cause-title">
            <div className="statement-body"><h2 id="cause-title">{h.causesTitle}</h2></div>
          </section>
          <Row label={h.causesTitle} {...row}>
            {cats.map((c) => (
              <li key={c.slug}><Link className="tile cause" href={`/${locale}/donate?cause=${c.slug}`}><Icon name={causeIcon[c.slug] ?? "hand"} size={28} /><h3>{c[`name_${locale}`]}</h3></Link></li>
            ))}
          </Row>
        </div>
      )}

      <div className="home-block">
        <section className="faq-home" aria-labelledby="faq-title">
          <div className="faq-body">
            <h2 id="faq-title">{h.faqTitle}</h2>
            <div className="faq-list">
              {h.faq.map(([q, a], i) => (
                <details key={q} name="faq" className="faq-card" open={i === 0}><summary><span>{q}</span><span className="plus" aria-hidden="true" /></summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="home-block home-end">
        <section className="statement is-cta" aria-labelledby="join-title">
          <div className="statement-body cta-card">
            <h2 id="join-title">{h.ctaTitle}</h2>
            <p>{h.ctaBody}</p>
            <div className="actions"><Link className="btn primary large" href={`/${locale}/create`}>{h.create}</Link></div>
          </div>
        </section>
      </div>
    </>
  );
}
