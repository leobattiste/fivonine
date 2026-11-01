import type { Metadata } from "next";
import Link from "next/link";
import L from "@/components/L";
import ExploreClient from "@/components/ExploreClient";
import { formatDate, formatDateFr, getContent, periodFor, sortEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Explore", description: "Explore Haitian history through decades, subjects and notable figures, or search the archive." };

export default async function ExplorePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const c = await getContent();
  const items = sortEvents(c.events).map((e) => ({
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    fr: e.fr,
    year: parseInt(e.date.slice(0, 4), 10),
    label: formatDate(e),
    labelFr: formatDateFr(e),
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
      <h1 className="text-d-2"><L en="Explore" fr="Explorer" /></h1>
      <p className="read mt-4"><L en="Explore Haitian history through decades, subjects, and notable figures." fr="Parcourez l’histoire d’Haïti par décennie, par thème ou à travers les personnalités marquantes." /></p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-3">
        {[
          { href: "/decades", title: <L en="Decades" fr="Décennies" />, line: <L en={`${c.periods.length} historical periods to explore year by year`} fr={`${c.periods.length} périodes historiques à explorer année par année`} /> },
          { href: "/subjects", title: <L en="Subjects" fr="Thèmes" />, line: <L en={`${c.categories.length} subjects spanning Haiti's history`} fr={`${c.categories.length} thèmes couvrant l’histoire d’Haïti`} /> },
          { href: "/people", title: <L en="Notable Figures" fr="Personnalités marquantes" />, line: <L en={`${c.people.length} people connected to Haiti's history`} fr={`${c.people.length} personnes liées à l’histoire d’Haïti`} /> },
        ].map((x) => (
          <li key={x.href}>
            <Link href={x.href} className="flex h-full flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg">
              <span className="text-2xl font-semibold">{x.title}</span>
              <span className="mt-2 text-sm text-dim">{x.line}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section id="search" className="mt-16 scroll-mt-24">
        <h2 className="mb-6 text-lg"><L en="Search everything" fr="Tout rechercher" /></h2>
      <ExploreClient
        items={items}
        people={c.people.map((p) => ({ slug: p.slug, name: p.name, role: p.roles[0] ?? "" }))}
        categories={c.categories}
        periods={c.periods.map((p) => ({ slug: p.slug, label: p.label, labelFr: p.fr?.label }))}
        countries={countries}
        initial={{ q: sp.q ?? "", category: sp.category ?? "", country: sp.country ?? "", period: sp.period ?? "" }}
      />
      </section>
    </div>
  );
}
