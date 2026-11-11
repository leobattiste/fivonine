import Link from "next/link";
import { notFound } from "next/navigation";
import Icon, { causeIcon, type IconName } from "@/components/Icon";
import { CampaignCard } from "@/components/Campaign";
import { HowTabs } from "@/components/Bits";
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
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1 className="display">{h.headline}</h1>
            <p className="lead">{h.sub}</p>
            <div className="row">
              <Link className="btn primary large" href={`/${locale}/donate`}>{h.explore}</Link>
              <Link className="btn large" href={`/${locale}/create`}>{h.create}</Link>
            </div>
            {stats.live > 0 && (
              <dl className="hero-stats">
                <div><dt>{fmtNumber(stats.live, locale)}</dt><dd>{h.stats.live}</dd></div>
                <div><dt>{fmtNumber(stats.completed, locale)}</dt><dd>{h.stats.completed}</dd></div>
                <div><dt>{fmtNumber(stats.verified, locale)}</dt><dd>{h.stats.verified}</dd></div>
              </dl>
            )}
          </div>
          <figure className="hero-slip" aria-label={h.slipTitle}>
            <div className="slip tilt">
              <p className="slip-title">{d.support.title}</p>
              {["Western Union", "MonCash", "Unibank"].map((name, i) => (
                <div className="slip-row" key={name}>
                  <div className="slip-head"><strong>{name}</strong><span className="ghost-copy"><Icon name="copy" size={15} />{d.common.copy}</span></div>
                  <p className="slip-details muted">{[h.slipLine1, h.slipLine3, h.slipLine3][i]}{i === 0 && <><br />{h.slipLine2}</>}</p>
                </div>
              ))}
            </div>
            <figcaption className="small muted">{h.slipNote}</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>{h.featured}</h2>
            <Link className="btn small ghost" href={`/${locale}/donate`}>{d.common.seeAll}</Link>
          </div>
          {featured.length ? (
            <div className="card-grid feature">
              {featured.map((c, i) => <CampaignCard key={c.id} c={c} locale={locale} settings={settings} cats={cats} lite={lite} wide={i === 0 && featured.length === 4} />)}
            </div>
          ) : (
            <div className="empty"><p>{h.featuredEmpty}</p><Link className="btn primary" href={`/${locale}/create`}>{h.create}</Link></div>
          )}
        </div>
      </section>

      <section className="section tint">
        <div className="wrap">
          <h2>{h.howTitle}</h2>
          <HowTabs locale={locale} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="measure">{h.trustTitle}</h2>
          <ul className="trust-grid">
            {h.trust.map(([title, body], i) => (
              <li key={title}><Icon name={trustIcons[i]} size={26} /><h3>{title}</h3><p>{body}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {cats.length > 0 && (
        <section className="section tint">
          <div className="wrap">
            <h2>{h.causesTitle}</h2>
            <ul className="cause-grid">
              {cats.map((c) => (
                <li key={c.slug}><Link href={`/${locale}/donate?cause=${c.slug}`}><Icon name={causeIcon[c.slug] ?? "hand"} size={22} />{c[`name_${locale}`]}</Link></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap faq-grid">
          <h2>{h.faqTitle}</h2>
          <div className="faq">
            {h.faq.map(([q, a]) => (
              <details key={q}><summary>{q}</summary><p>{a}</p></details>
            ))}
            <Link className="btn small ghost" href={`/${locale}/help`}>{d.footer.help}</Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap cta-inner">
          <div><h2>{h.ctaTitle}</h2><p>{h.ctaBody}</p></div>
          <Link className="btn large invert" href={`/${locale}/create`}>{h.create}</Link>
        </div>
      </section>
    </>
  );
}
