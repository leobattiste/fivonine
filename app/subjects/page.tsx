import Link from "next/link";
import type { Metadata } from "next";
import L from "@/components/L";
import { SUBJECT_OVERVIEWS } from "@/lib/subject-overviews";
import { getContent, sortEvents, yearOf } from "@/lib/data";

export const metadata: Metadata = { title: "Subjects", description: "Follow politics, music, the economy, the diaspora and more through every decade of Haitian history." };
export const revalidate = 3600;

export default async function SubjectsPage() {
  const c = await getContent();
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2"><L en="Subjects" fr="Thèmes" /></h1>
      <p className="read mt-4"><L en="Ten subjects, each traced from the beginning to today." fr="Dix thèmes, chacun suivi depuis les origines jusqu’à aujourd’hui." /></p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {c.categories.map((cat) => {
          const evs = sortEvents(c.events.filter((e) => e.categories.includes(cat.slug)));
          const span = evs.length ? <L en={`${yearOf(evs[0])} to ${yearOf(evs[evs.length - 1])}`} fr={`${yearOf(evs[0])} à ${yearOf(evs[evs.length - 1])}`} /> : <L en="Being researched" fr="En cours de recherche" />;
          return (
            <li key={cat.slug}>
              <Link href={`/subjects/${cat.slug}`} className="flex h-full min-h-[9rem] flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg">
                <span className="text-xl leading-tight"><L en={cat.name} fr={cat.nameFr} /></span>
                <span className="mt-3 text-sm leading-relaxed text-dim"><L en={SUBJECT_OVERVIEWS[cat.slug]?.en ?? cat.name} fr={SUBJECT_OVERVIEWS[cat.slug]?.fr ?? cat.nameFr} /></span>
                <span className="mt-auto pt-6 text-sm tabular-nums text-dim">
                  <L en={`${evs.length} ${evs.length === 1 ? "moment" : "moments"}`} fr={`${evs.length} ${evs.length === 1 ? "moment" : "moments"}`} />
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
