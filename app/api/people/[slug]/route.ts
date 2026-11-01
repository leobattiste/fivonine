import { NextResponse } from "next/server";
import { formatDate, formatDateFr, getContent, periodFor, sortEvents, yearOf } from "@/lib/data";

/** A figure's profile as JSON, for the in-page modal. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.people.find((x) => x.slug === slug);
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const evs = sortEvents(c.events.filter((e) => e.people?.includes(p.slug)));
  const periods = [...new Map(evs.map((e) => periodFor(e, c.periods)).filter(Boolean).map((x) => [x!.slug, { slug: x!.slug, label: x!.label, labelFr: x!.fr?.label }])).values()];
  return NextResponse.json(
    {
      person: p,
      subjects: [...new Set(evs.flatMap((e) => e.categories))],
      records: (c.records ?? []).filter((r) => (r.eventSlugs ?? []).some((s) => evs.some((e) => e.slug === s))).map((r) => ({ slug: r.slug, title: r.title, titleFr: r.fr?.title, type: r.type })),
      periods,
      events: evs.map((e) => ({ slug: e.slug, title: e.title, titleFr: e.fr?.title, labelFr: formatDateFr(e), label: formatDate(e), location: e.location, year: yearOf(e), dimension: e.dimension })),
    },
    { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
