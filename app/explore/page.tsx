import type { Metadata } from "next";
import ExploreClient from "@/components/ExploreClient";
import { formatDate, getContent, periodFor, sortEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Search", description: "Search every event, person, place and country in Fivonine." };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const c = await getContent();
  const items = sortEvents(c.events).map((e) => ({
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    year: parseInt(e.date.slice(0, 4), 10),
    label: formatDate(e),
    location: e.location,
    dimension: e.dimension,
    categories: e.categories,
    countries: e.countries ?? [],
    period: periodFor(e, c.periods)?.slug ?? "",
    people: (e.people ?? []).map((s) => c.people.find((p) => p.slug === s)?.name ?? ""),
    status: e.status,
  }));
  const countries = [...new Set(items.flatMap((i) => i.countries))].sort();

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-12 sm:px-8">
      <ExploreClient
        items={items}
        people={c.people.map((p) => ({ slug: p.slug, name: p.name, role: p.roles[0] ?? "" }))}
        categories={c.categories}
        periods={c.periods.map((p) => ({ slug: p.slug, label: p.label }))}
        countries={countries}
        initial={{ q: sp.q ?? "", category: sp.category ?? "", country: sp.country ?? "", period: sp.period ?? "" }}
      />
    </div>
  );
}
