import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys, type Category } from "@/lib/i18n";
import { causeCopy, causeMedia, platform } from "@/lib/platform-content";
import { publicCampaigns } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";
import ResourceCards from "@/components/ResourceCards";
import Icon from "@/components/Icon";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || !categoryKeys.includes(category as Category))
    return {};
  const c = causeCopy[locale][category as Category];
  return { title: t(locale)[category as Category], description: c.body };
}
export default async function Cause({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale) || !categoryKeys.includes(category as Category))
    notFound();
  const key = category as Category,
    d = t(locale),
    p = platform[locale],
    c = causeCopy[locale][key];
  const { items } = await publicCampaigns({ category: key });
  return (
    <>
      <section className="page section cause-landing">
        <Link className="text-link" href={`/${locale}/causes`}>
          <Icon name="arrowLeft" />
          {p.seeAll}
        </Link>
        <div className="cause-hero">
          <div className="cause-hero-copy">
            <p className="eyebrow">{d[key]}</p>
            <h1>{c.title}</h1>
            <p className="lead">{c.body}</p>
            <div className="actions">
              <Link
                className="button"
                href={`/${locale}/submit?category=${key}`}
              >
                {d.create}
                <Icon name="plus" />
              </Link>
              <a className="text-link" href="#fundraisers">
                {d.browse}
                <Icon name="arrowRight" />
              </a>
            </div>
          </div>
          <div className="cause-hero-photo">
            <Image
              src={causeMedia[key]}
              alt=""
              fill
              priority
              sizes="(max-width: 799px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="cause-ideas">
          {c.ideas.map((idea) => (
            <span key={idea}>
              <Icon name="check" />
              {idea}
            </span>
          ))}
        </div>
      </section>
      <section id="fundraisers" className="page section">
        <div className="section-head">
          <h2>{d.featured}</h2>
          <Link
            className="text-link"
            href={`/${locale}/explore?category=${key}`}
          >
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        {items.length ? (
          <div className="campaign-grid">
            {items.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <p className="empty">{p.empty}</p>
        )}
      </section>
      <section className="page section">
        <div className="section-head">
          <h2>{p.tips}</h2>
          <Link className="text-link" href={`/${locale}/resources`}>
            {d.all}
            <Icon name="arrowRight" />
          </Link>
        </div>
        <ResourceCards locale={locale} limit={3} />
      </section>
    </>
  );
}
