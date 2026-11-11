import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import { publicCampaigns } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";
import ExploreFilters from "@/components/ExploreFilters";
import Icon from "@/components/Icon";
export default async function Explore({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    country?: string;
    region?: string;
    location?: string;
    lifecycle?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    b = brief[locale],
    sp = await searchParams;
  const page = Math.max(1, Math.min(100, Number(sp.page) || 1));
  const filters = {
    q: sp.q?.slice(0, 120),
    category: categoryKeys.includes(sp.category as never)
      ? sp.category
      : undefined,
    location: sp.location?.slice(0, 100),
    country: sp.country?.slice(0, 80),
    region: sp.region?.slice(0, 100),
    lifecycle:
      sp.lifecycle === "active" || sp.lifecycle === "completed"
        ? sp.lifecycle
        : undefined,
    sort: sp.sort === "updated" ? "updated" : "created",
    page,
  } as const;
  const { items, hasMore, count } = await publicCampaigns(filters);
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) if (v) next.set(k, String(v));
  next.set("page", String(page + 1));
  return (
    <section className="page section explore-page">
      <header className="page-head">
        <p className="eyebrow">{b.eyebrow}</p>
        <h1>{d.browse}</h1>
        <p className="lead">{b.intro}</p>
      </header>
      <ExploreFilters
        key={JSON.stringify(sp)}
        locale={locale}
        values={filters}
      />
      <div className="results-meta">
        <span>
          {count} {d.results}
        </span>
        <div>
          <span>{filters.sort === "updated" ? b.updated : b.recent}</span>
          {(filters.q ||
            filters.category ||
            filters.location ||
            filters.lifecycle) && (
            <Link href={`/${locale}/explore`}>{b.clear}</Link>
          )}
        </div>
      </div>
      <div className="campaign-grid">
        {items.map((c, i) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            locale={locale}
            priority={i < 3}
          />
        ))}
      </div>
      {!items.length && <p className="empty">{d.empty}</p>}
      {hasMore && (
        <Link
          className="button secondary load-more"
          href={`/${locale}/explore?${next}`}
        >
          {d.more}
          <Icon name="plus" />
        </Link>
      )}
    </section>
  );
}
