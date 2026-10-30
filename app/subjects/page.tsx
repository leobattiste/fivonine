import Link from "next/link";
import type { Metadata } from "next";
import { getContent, sortEvents, yearOf } from "@/lib/data";

export const metadata: Metadata = { title: "Subjects", description: "Follow politics, music, the economy, the diaspora and more through every decade of Haitian history." };
export const revalidate = 3600;

export default async function SubjectsPage() {
  const c = await getContent();
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2 font-extrabold">Subjects</h1>
      <p className="read mt-4">Thirteen subjects, each traced from the beginning to today.</p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {c.categories.map((cat) => {
          const evs = sortEvents(c.events.filter((e) => e.categories.includes(cat.slug)));
          const notes = c.periods.filter((p) => p.notes?.[cat.slug]).length;
          const span = evs.length ? `${yearOf(evs[0])} to ${yearOf(evs[evs.length - 1])}` : "Being researched";
          return (
            <li key={cat.slug}>
              <Link href={`/subjects/${cat.slug}`} className="flex h-full min-h-[9rem] flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg">
                <span className="text-2xl font-semibold leading-tight">{cat.name}</span>
                <span className="mt-auto pt-4 text-sm tabular-nums text-dim">
                  {evs.length} {evs.length === 1 ? "moment" : "moments"}{notes ? `, ${notes} decade ${notes === 1 ? "overview" : "overviews"}` : ""}
                </span>
                <span className="text-sm tabular-nums text-dim">{span}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
