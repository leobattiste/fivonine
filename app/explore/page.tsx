import type { Metadata } from "next";
import Link from "next/link";
import L from "@/components/L";
import ExploreClient from "@/components/ExploreClient";
import { formatDate, formatDateFr, getContent, periodFor, sortEvents } from "@/lib/data";

export const metadata: Metadata = { title: "Explore", description: "Explore Haitian history by decade, event, figure or subject, or search everything." };

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
      <p className="read mt-4"><L en="Four ways into Haiti’s history, or search everything at once." fr="Quatre portes d’entrée dans l’histoire d’Haïti, ou une recherche dans tout à la fois." /></p>
      <ul className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { href: "/decades", title: <L en="Decades" fr="Décennies" />, line: <L en={`${c.periods.length} periods, each a year-by-year timeline`} fr={`${c.periods.length} périodes, chacune année par année`} /> },
          { href: "/events", title: <L en="Events" fr="Événements" />, line: <L en={`${c.events.length} moments on one timeline`} fr={`${c.events.length} moments sur une seule frise`} /> },
          { href: "/people", title: <L en="Figures" fr="Personnages" />, line: <L en={`${c.people.length} people who shaped Haiti`} fr={`${c.people.length} personnes qui ont façonné Haïti`} /> },
          { href: "/subjects", title: <L en="Subjects" fr="Thèmes" />, line: <L en={`${c.categories.length} subjects through the centuries`} fr={`${c.categories.length} thèmes à travers les siècles`} /> },
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
