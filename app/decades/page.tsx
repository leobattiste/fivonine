import Link from "next/link";
import type { Metadata } from "next";
import L from "@/components/L";
import { JourneyMeter } from "@/components/Progress";
import { eventsInPeriod, getContent } from "@/lib/data";
import type { Period } from "@/lib/types";

export const metadata: Metadata = {
  title: "Decades",
  description: "Browse Haitian history chronologically, from Indigenous Ayiti through the present.",
};
export const revalidate = 3600;

const GROUPS: { title: string; fr: string; test: (p: Period) => boolean }[] = [
  { title: "Before independence", fr: "Avant l’indépendance", test: (p) => p.kind === "era" },
  { title: "19th century", fr: "XIXe siècle", test: (p) => p.kind === "decade" && p.start < 1900 },
  { title: "20th century", fr: "XXe siècle", test: (p) => p.kind === "decade" && p.start >= 1900 && p.start < 2000 },
  { title: "21st century", fr: "XXIe siècle", test: (p) => p.kind === "decade" && p.start >= 2000 },
];

export default async function DecadesPage() {
  const c = await getContent();
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-d-2"><L en="Decades" fr="Décennies" /></h1>
          <p className="read mt-4"><L
            en="Follow Haiti’s history from one period to the next. Choose a decade to read its overview and explore the events that shaped it."
            fr="Suivez l’histoire d’Haïti d’une période à l’autre. Choisissez une décennie pour lire son aperçu et découvrir les événements qui l’ont marquée."
          /></p>
        </div>
        <JourneyMeter total={c.periods.length} />
      </header>

      {GROUPS.map((group) => {
        const periods = c.periods.filter(group.test).sort((a, b) => a.start - b.start);
        if (!periods.length) return null;
        return (
          <section key={group.title} className="mt-16 sm:mt-20">
            <h2 className="border-b border-rule pb-4 text-xl font-semibold"><L en={group.title} fr={group.fr} /></h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {periods.map((period) => {
                const entryCount = eventsInPeriod(c, period).length;
                const headline = period.title.includes(":") ? period.title.split(/:\s(.+)/)[1] : period.title;
                const headlineFr = period.fr?.title?.includes(":")
                  ? period.fr.title.split(/:\s(.+)/)[1]
                  : period.fr?.title;
                return (
                  <li key={period.slug}>
                    <Link
                      href={`/decades/${period.slug}`}
                      data-period={period.slug}
                      className="group flex h-full min-h-[11rem] flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg data-[explored=true]:bg-raise"
                    >
                      {period.kind === "decade"
                        ? <span className="wdth-tight text-[2.3rem] leading-none tabular-nums">{period.start}s</span>
                        : <span className="text-lg font-semibold leading-snug"><L en={period.label} fr={period.fr?.label} /></span>}
                      <span className="mt-3 line-clamp-2 text-sm leading-relaxed text-dim">
                        <L en={headline} fr={headlineFr} />
                      </span>
                      <span className="mt-auto pt-5 text-xs tabular-nums text-dim">
                        <L en={`${entryCount} ${entryCount === 1 ? "historical entry" : "historical entries"}`}
                           fr={`${entryCount} ${entryCount === 1 ? "notice historique" : "notices historiques"}`} />
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
