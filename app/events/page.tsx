import type { Metadata } from "next";
import HistoryTimeline from "@/components/HistoryTimeline";
import { formatDate, getContent, periodFor, sortEvents, yearOf } from "@/lib/data";

export const metadata: Metadata = { title: "Events", description: "Every recorded moment in Haitian history, on one timeline from 1492 to today." };
export const revalidate = 3600;

export default async function EventsPage() {
  const c = await getContent();
  const items = sortEvents(c.events).map((e) => {
    const p = periodFor(e, c.periods);
    return {
      slug: e.slug, title: e.title, summary: e.summary, label: formatDate(e), year: yearOf(e), location: e.location,
      dimension: e.dimension, categories: e.categories, status: e.status,
      period: p?.slug ?? "", periodLabel: p ? (p.kind === "decade" ? `${p.start}s` : p.label) : "",
    };
  });
  const first = items[0]?.year;

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2 font-extrabold">Events</h1>
      <p className="read mt-4">
        Every moment recorded so far, from {first} to today, on one timeline. Pick a subject to follow it through the centuries.
      </p>
      <div className="mt-10"><HistoryTimeline items={items} categories={c.categories} /></div>
    </div>
  );
}
