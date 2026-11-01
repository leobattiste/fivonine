import { NextResponse } from "next/server";
import { formatDate, formatDateFr, getContent } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const record = c.records?.find((x) => x.slug === slug);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const events = c.events.filter((e) => (record.eventSlugs ?? []).includes(e.slug));
  const related = (record.related ?? []).map((s) => c.records?.find((r) => r.slug === s)).filter(Boolean)
    .map((r) => ({ slug: r!.slug, title: r!.title, titleFr: r!.fr?.title, type: r!.type }));
  return NextResponse.json({
    record,
    events: events.map((e) => ({ slug: e.slug, title: e.title, titleFr: e.fr?.title, label: formatDate(e), labelFr: formatDateFr(e) })),
    related
  }, { headers: { "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
