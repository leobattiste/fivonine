import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { publicCampaigns } from "@/lib/data";
import CampaignCard from "@/components/CampaignCard";
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
    page?: string;
  }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    sp = await searchParams;
  const page = Math.max(1, Math.min(100, Number(sp.page) || 1));
  const filters = {
    q: sp.q?.slice(0, 120),
    category: categoryKeys.includes(sp.category as never)
      ? sp.category
      : undefined,
    country: sp.country?.slice(0, 80),
    region: sp.region?.slice(0, 100),
    page,
  };
  const { items, hasMore, count } = await publicCampaigns(filters);
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) if (v) next.set(k, String(v));
  next.set("page", String(page + 1));
  return (
    <section className="page section">
      <header className="page-head">
        <p className="eyebrow">{d.tagline}</p>
        <h1>{d.explore}</h1>
        <p className="lead">{d.intro}</p>
      </header>
      <form className="explore-filters" action={`/${locale}/explore`}>
        <label className="search-field">
          <Icon name="search" />
          <input
            name="q"
            aria-label={d.search}
            placeholder={d.searchHint}
            defaultValue={sp.q}
          />
        </label>
        <label className="filter-select">
          <span>{d.category}</span>
          <select name="category" defaultValue={filters.category ?? ""}>
            <option value="">{d.any}</option>
            {categoryKeys.map((c) => (
              <option key={c} value={c}>
                {d[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-select">
          <span>{d.country}</span>
          <input
            name="country"
            defaultValue={filters.country}
            placeholder={d.any}
          />
        </label>
        <label className="filter-select">
          <span>{d.region}</span>
          <input
            name="region"
            defaultValue={filters.region}
            placeholder={d.any}
          />
        </label>
        <button className="button" type="submit" aria-label={d.search}>
          <Icon name="search" />
        </button>
      </form>
      <div className="results-meta">
        <span>
          {count} {d.results}
        </span>
        <span>{d.latest}</span>
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
