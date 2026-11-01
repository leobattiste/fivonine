import Link from "next/link";
import type { Metadata } from "next";
import L from "@/components/L";
import { SUBJECT_OVERVIEWS } from "@/lib/subject-overviews";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Subjects",
  description: "Explore ten themes in Haitian history, from politics and society to the arts and the diaspora.",
};
export const revalidate = 3600;

export default async function SubjectsPage() {
  const c = await getContent();
  const counts = new Map(c.categories.map((category) => [
    category.slug,
    c.events.filter((event) => event.categories.includes(category.slug)).length,
  ]));
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <header>
        <h1 className="text-d-2"><L en="Subjects" fr="Thèmes" /></h1>
        <p className="read mt-4"><L
          en="Explore Haitian history by theme. Each subject brings together important events, historical essays, and the people connected to them."
          fr="Explorez l’histoire d’Haïti par thème. Chaque sujet réunit des événements, des essais historiques et les personnes qui leur sont liées."
        /></p>
      </header>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {c.categories.map((category) => {
          const total = counts.get(category.slug) ?? 0;
          return (
            <li key={category.slug}>
              <Link href={`/subjects/${category.slug}`} className="group flex h-full min-h-[11rem] flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg">
                <h2 className="text-lg font-semibold leading-snug"><L en={category.name} fr={category.nameFr} /></h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-dim">
                  <L en={SUBJECT_OVERVIEWS[category.slug]?.en ?? category.name} fr={SUBJECT_OVERVIEWS[category.slug]?.fr ?? category.nameFr} />
                </p>
                <p className="mt-auto pt-5 text-xs tabular-nums text-dim">
                  <L en={`${total} ${total === 1 ? "historical entry" : "historical entries"}`}
                     fr={`${total} ${total === 1 ? "notice historique" : "notices historiques"}`} />
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
