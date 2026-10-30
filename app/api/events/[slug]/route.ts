import { NextResponse } from "next/server";
import { connectedEvents, formatDate, getContent, periodFor, yearOf } from "@/lib/data";

/** A moment as JSON, for the in-page modal. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const e = c.events.find((x) => x.slug === slug);
  if (!e) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const period = periodFor(e, c.periods);
  return NextResponse.json(
    {
      event: e,
      year: yearOf(e),
      when: formatDate(e),
      period: period ? { slug: period.slug, label: period.label } : null,
      sections: c.categories.filter((x) => e.categories.includes(x.slug)).map((x) => x.short),
      people: c.people.filter((p) => e.people?.includes(p.slug)).map((p) => ({ slug: p.slug, name: p.name })),
      linked: connectedEvents(c, e).map((x) => ({ slug: x.slug, title: x.title, label: formatDate(x) })),
    },
    { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
