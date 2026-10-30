import type { Metadata } from "next";
import Link from "next/link";
import ExploreClient from "@/components/ExploreClient";
import { formatDate, getContent, periodFor, sortEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Explore", description: "Explore Haitian history by decade, event, figure or subject, or search everything." };

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
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2 font-extrabold">Explore</h1>
      <p className="read mt-4">Four ways into Haiti&apos;s history, or search everything at once.</p>
      <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { href: "/decades", title: "Decades", line: `${c.periods.length} periods, each a year-by-year timeline` },
          { href: "/events", title: "Events", line: `${c.events.length} moments on one timeline` },
          { href: "/people", title: "Figures", line: `${c.people.length} people who shaped Haiti` },
          { href: "/subjects", title: "Subjects", line: `${c.categories.length} subjects through the centuries` },
        ].map((x) => (
          <li key={x.href}>
            <Link href={x.href} className="flex h-full flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg">
              <span className="text-2xl font-semibold">{x.title}</span>
              <span className="mt-2 text-sm text-dim">{x.line}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section id="search" className="mt-20 scroll-mt-24">
        <h2 className="mb-6 text-lg font-semibold">Search everything</h2>
      <ExploreClient
        items={items}
        people={c.people.map((p) => ({ slug: p.slug, name: p.name, role: p.roles[0] ?? "" }))}
        categories={c.categories}
        periods={c.periods.map((p) => ({ slug: p.slug, label: p.label }))}
        countries={countries}
        initial={{ q: sp.q ?? "", category: sp.category ?? "", country: sp.country ?? "", period: sp.period ?? "" }}
      />
      </section>
    </div>
  );
}
