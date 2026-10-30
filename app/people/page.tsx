import type { Metadata } from "next";
import L from "@/components/L";
import FiguresClient, { type Figure } from "@/components/FiguresClient";
import { getContent, periodFor, yearOf } from "@/lib/data";

export const metadata: Metadata = { title: "Figures", description: "The people who shaped Haiti's history, at home and abroad." };
export const revalidate = 3600;

export default async function FiguresPage() {
  const c = await getContent();
  const figures: Figure[] = c.people.map((p) => {
    const evs = c.events.filter((e) => e.people?.includes(p.slug));
    const subjects = [...new Set(evs.flatMap((e) => e.categories))];
    const eras = [...new Map(evs.map((e) => periodFor(e, c.periods)).filter(Boolean).map((x) => [x!.slug, { slug: x!.slug, label: x!.label }])).values()];
    const born = parseInt((p.born ?? "").replace(/\D/g, ""), 10);
    const sortYear = Number.isFinite(born) ? born : Math.min(...evs.map(yearOf), 9999);
    return { slug: p.slug, name: p.name, rolesFr: p.fr?.roles, years: [p.born, p.died].filter(Boolean).join(" to ") || "Dates uncertain", roles: p.roles, subjects, eras, sortYear, count: evs.length };
  }).sort((a, b) => a.sortYear - b.sortYear);

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2"><L en="Figures" fr="Personnages" /></h1>
      <p className="read mt-4"><L en="The people who shaped Haiti, at home and abroad, in order of when they lived." fr="Les personnes qui ont façonné Haïti, sur place et à l’étranger, dans l’ordre où elles ont vécu." /></p>
      <div className="mt-10">
        <FiguresClient figures={figures} categories={c.categories} eras={c.periods.map((p) => ({ slug: p.slug, label: p.label }))} />
      </div>
    </div>
  );
}
