import Link from "next/link";
import type { Metadata } from "next";
import L from "@/components/L";
import { JourneyMeter } from "@/components/Progress";
import { eventsInPeriod, getContent } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";
import type { Dimension, Period } from "@/lib/types";

export const metadata: Metadata = {
  title: "Decades",
  description: "Every period of Haitian history, from Indigenous Ayiti to the 2020s, each with its own page.",
};
export const revalidate = 3600;

const GROUPS: { title: string; fr: string; test: (p: Period) => boolean }[] = [
  { title: "Before the revolution", fr: "Avant la révolution", test: (p) => p.kind === "era" },
  { title: "Revolution and the 19th century", fr: "La révolution et le XIXe siècle", test: (p) => p.kind === "decade" && p.start < 1900 },
  { title: "The 20th century", fr: "Le XXe siècle", test: (p) => p.kind === "decade" && p.start >= 1900 && p.start < 2000 },
  { title: "The 21st century", fr: "Le XXIe siècle", test: (p) => p.kind === "decade" && p.start >= 2000 },
];

export default async function DecadesPage() {
  const c = await getContent();

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-d-2"><L en="Decades" fr="Décennies" /></h1>
          <p className="read mt-4"><L en="Every period has its own page. Pick one to read it year by year." fr="Chaque période a sa propre page. Choisissez-en une pour la lire année par année." /></p>
        </div>
        <JourneyMeter total={c.periods.length} />
      </div>

      {GROUPS.map((g) => {
        const list = c.periods.filter(g.test);
        if (!list.length) return null;
        return (
          <section key={g.title} className="mt-16">
            <h2 className="border-b border-rule pb-3 text-lg"><L en={g.title} fr={g.fr} /></h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {list.map((p) => {
                const evs = eventsInPeriod(c, p);
                const d = { inside: 0, abroad: 0, foreign: 0 } as Record<Dimension, number>;
                evs.forEach((e) => d[e.dimension]++);
                const researched = evs.length > 0 || Boolean(p.overview);
                const headline = p.title.includes(":") ? p.title.split(/:\s(.+)/)[1] : p.title;
                const headlineFr = p.fr?.title ? (p.fr.title.includes(":") ? p.fr.title.split(/:\s(.+)/)[1] : p.fr.title) : undefined;
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/decades/${p.slug}`}
                      data-period={p.slug}
                      className={`group flex h-full min-h-[11rem] flex-col rounded-2xl border p-4 transition-colors hover:border-fg data-[explored=true]:bg-raise ${researched ? "border-rule" : "border-dashed border-rule"}`}
                    >
                      <span className={`wdth-tight ${p.kind === "era" ? "text-xl leading-tight" : "text-[2rem] leading-none tabular-nums"} ${researched ? "" : "text-dim"}`}>
                        {p.kind === "decade" ? `${p.start}s` : <L en={p.label} fr={p.fr?.label} />}
                      </span>
                      <span className={`mt-3 line-clamp-3 text-sm leading-snug ${researched ? "text-fg" : "text-dim"}`}>
                        {researched ? <L en={headline} fr={headlineFr} /> : <L en="Being researched" fr="En cours de recherche" />}
                      </span>
                      <span className="mt-auto flex items-center gap-2 pt-4 text-xs text-dim">
                        {(Object.keys(d) as Dimension[]).map((k) =>
                          d[k] ? <span key={k} className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[k].color }} title={`${DIMENSIONS[k].label}: ${d[k]}`} /> : null
                        )}
                        <span className="tabular-nums">{evs.length ? <L en={`${evs.length} ${evs.length === 1 ? "entry" : "entries"}`} fr={`${evs.length} ${evs.length === 1 ? "entrée" : "entrées"}`} /> : <L en="No entries yet" fr="Aucune entrée" />}</span>
                        <span className="ml-auto hidden group-data-[explored=true]:inline"><L en="Visited" fr="Visitée" /></span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
