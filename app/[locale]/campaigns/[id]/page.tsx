import { brief } from "@/lib/brief";
import { safeExternal, supportParts } from "@/lib/domain";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { publicCampaign, publicCampaigns } from "@/lib/data";
import { getServerClient } from "@/lib/supabase/server";
import Media from "@/components/Media";
import Icon from "@/components/Icon";
import SupportText from "@/components/SupportText";
import ShareButton from "@/components/ShareButton";
import ShareTools from "@/components/ShareTools";
import CampaignCard from "@/components/CampaignCard";
import { platform } from "@/lib/platform-content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const c = await publicCampaign(id);
  return c
    ? {
        title: c.public_content.title,
        description: c.public_content.story.slice(0, 155),
        alternates: { canonical: `/${locale}/campaigns/${id}` },
      }
    : { title: "Campaign unavailable" };
}
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const campaign = await publicCampaign(id);
  if (!campaign) notFound();
  const d = t(locale),
    c = campaign.public_content;
  const p = platform[locale],
    b = brief[locale];
  const external =
    safeExternal(c.fundraising_url ?? "") ??
    supportParts(c.support_text).find((part) => part.url)?.url;
  const outbound =
    external && !campaign.demo
      ? `/api/out?campaign=${encodeURIComponent(id)}&url=${encodeURIComponent(external)}`
      : null;
  const related = (await publicCampaigns({ category: c.category })).items
    .filter((item) => item.id !== id)
    .slice(0, 3);
  const db = await getServerClient();
  const updates = campaign.demo
    ? []
    : ((
        await db
          ?.from("campaign_updates")
          .select("id,title,body,created_at")
          .eq("campaign_id", id)
          .eq("status", "approved")
          .order("created_at", { ascending: false })
      )?.data ?? []);
  return (
    <article className="page campaign-page">
      <Link className="text-link breadcrumb" href={`/${locale}/explore`}>
        <Icon name="arrowLeft" />
        {d.explore}
      </Link>
      <header className="campaign-heading">
        <p className="eyebrow">
          {d[c.category]} · {c.region}, {c.country}
        </p>
        <h1>{c.title}</h1>
        <div className="campaign-byline">
          <span>
            <Icon name="user" />
            {c.organizer_name}
          </span>
          <span>
            {d.sourceLanguage}: {c.language.toUpperCase()}
          </span>
        </div>
      </header>
      <a
        className="button mobile-support-jump"
        href={outbound ?? "#support"}
        target={outbound ? "_blank" : undefined}
        rel={outbound ? "noopener noreferrer nofollow ugc" : undefined}
      >
        {outbound ? b.view : d.support}
        <Icon name="arrowRight" />
      </a>
      <div className="campaign-detail-grid">
        <div className="campaign-main">
          <Media
            src={c.photo_url}
            alt={c.title}
            category={c.category}
            priority
          />
          <nav className="campaign-section-nav" aria-label={p.overview}>
            <a href="#story">{p.storyTab}</a>
            <a href="#updates">{p.updatesTab}</a>
            <a href="#organizer">{p.organizerTab}</a>
            <a href="#share">{d.share}</a>
          </nav>
          <section id="story" className="prose" lang={c.language}>
            <h2>{d.story}</h2>
            <p className="preserve-lines">{c.story}</p>
            <h2>{d.use}</h2>
            <p className="preserve-lines">{c.intended_use}</p>
            <h2>{d.beneficiary}</h2>
            <p>{c.beneficiary}</p>
            <h2>{d.distribution}</h2>
            <p className="preserve-lines">{c.distribution}</p>
          </section>
          <section id="updates" className="prose">
            <h2>{d.updates}</h2>
            {updates.length ? (
              updates.map((u) => (
                <article key={u.id} className="update">
                  <small>
                    {new Date(u.created_at).toLocaleDateString(
                      locale === "ht" ? "fr-HT" : locale,
                    )}
                  </small>
                  <h3>{u.title}</h3>
                  <p className="preserve-lines">{u.body}</p>
                </article>
              ))
            ) : (
              <p className="muted">{d.noUpdates}</p>
            )}
          </section>
          <section id="organizer" className="prose organizer-profile">
            <h2>{p.organizer}</h2>
            <div className="organizer-identity">
              <span className="organizer-avatar" aria-hidden="true">
                {Array.from(c.organizer_name)[0]}
              </span>
              <div>
                <h3>{c.organizer_name}</h3>
                <p>{c.relationship}</p>
                <p className="muted">
                  {c.region}, {c.country}
                </p>
              </div>
            </div>
            <dl className="organizer-beneficiary">
              <dt>{p.recipient}</dt>
              <dd>{c.beneficiary}</dd>
            </dl>
          </section>
          <section id="share" className="prose">
            <h2>{p.shareTitle}</h2>
            <p>{p.shareBody}</p>
            <ShareTools title={c.title} locale={locale} />
          </section>
        </div>
        <aside className="support-panel" id="support">
          <div className="support-card">
            {outbound && (
              <>
                <p className="hosted-label">
                  {b.hosted}{" "}
                  <strong>
                    {new URL(external!).hostname.replace(/^www\./, "")}
                  </strong>
                </p>
                <a
                  className="button"
                  href={outbound}
                  target="_blank"
                  rel="noopener noreferrer nofollow ugc"
                >
                  {b.view}
                  <Icon name="external" />
                </a>
              </>
            )}
            <span className="eyebrow">{d.support}</span>
            {c.goal && (
              <div className="goal">
                <strong>
                  {new Intl.NumberFormat(locale === "ht" ? "fr-HT" : locale, {
                    style: "currency",
                    currency: c.currency,
                    maximumFractionDigits: 0,
                  }).format(c.goal)}
                </strong>
                <span>{d.goal}</span>
              </div>
            )}
            <div lang={c.language}>
              <SupportText
                text={c.support_text}
                campaignId={campaign.demo ? undefined : id}
              />
            </div>
            <p className="disclosure">
              <Icon name="external" />
              {d.disclosure}
            </p>
            <ShareButton title={c.title} locale={locale} />
          </div>
          <div className="trust-card">
            <h3>{d.review}</h3>
            {campaign.contact_confirmed && (
              <p className="review-indicator">
                <Icon name="check" />
                {d.emailConfirmed}
              </p>
            )}
            {campaign.links_checked_at && (
              <p className="review-indicator">
                <Icon name="check" />
                {d.linkChecked}
              </p>
            )}
            {campaign.organization_reviewed_at && (
              <p className="review-indicator">
                <Icon name="check" />
                {d.orgReviewed}
              </p>
            )}
            <p>{d.reviewBody}</p>
            <small>
              {d.updated}:{" "}
              {new Date(campaign.updated_at).toLocaleDateString(
                locale === "ht" ? "fr-HT" : locale,
              )}
            </small>
          </div>
          <Link
            className="text-link muted"
            href={`/${locale}/report?campaign=${id}`}
          >
            <Icon name="flag" />
            {d.report}
          </Link>
        </aside>
      </div>
      {outbound && (
        <div className="mobile-campaign-action">
          <a
            className="button"
            href={outbound}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
          >
            {b.view}
            <Icon name="external" />
          </a>
        </div>
      )}
      {related.length > 0 && (
        <section className="related-campaigns">
          <div className="section-head">
            <h2>{p.related}</h2>
            <Link
              className="text-link"
              href={`/${locale}/causes/${c.category}`}
            >
              {d[c.category]}
              <Icon name="arrowRight" />
            </Link>
          </div>
          <div className="campaign-grid">
            {related.map((item) => (
              <CampaignCard key={item.id} campaign={item} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
