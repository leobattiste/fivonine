"use client";

import L from "@/components/L";
import SubjectLinks from "@/components/SubjectLinks";
import { EventLink } from "@/components/PersonModal";
import { useEffect, useMemo, useState } from "react";
import { DIMENSIONS } from "@/lib/site";
import type { Dimension, EventFr, EvidenceStatus } from "@/lib/types";

export type TLSection = { slug: string; name: string; short: string; shortFr?: string; items: string[] };
export type TLEvent = {
  slug: string; title: string; fr?: EventFr; label: React.ReactNode; date: string; location: string;
  dimension: Dimension; categories: string[]; status: EvidenceStatus; highlight?: boolean;
};
export type TLYear = { year: number; title?: string; content?: React.ReactNode; events: TLEvent[] };

const MONTHS = [
  ["January", "Janvier"], ["February", "Février"], ["March", "Mars"], ["April", "Avril"],
  ["May", "Mai"], ["June", "Juin"], ["July", "Juillet"], ["August", "Août"],
  ["September", "Septembre"], ["October", "Octobre"], ["November", "Novembre"], ["December", "Décembre"]
];

/** Chronological timeline: every year, then its events in calendar order. */
export default function DecadeTimeline({ sections, years, notes = {}, label, labelFr, showEmptyYears }: {
  labelFr?: string;
  sections: TLSection[]; years: TLYear[]; notes?: Partial<Record<string, string>>; label: string; showEmptyYears: boolean;
}) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("section");
    if (s && sections.some((x) => x.slug === s)) setActive(s);
  }, [sections]);

  useEffect(() => {
    const u = new URL(window.location.href);
    if (active) u.searchParams.set("section", active); else u.searchParams.delete("section");
    window.history.replaceState(window.history.state, "", u);
  }, [active]);

  const count = (slug: string) => years.reduce((n, y) => n + y.events.filter((e) => e.categories.includes(slug)).length, 0);
  const visible = useMemo(() => years.filter((y) => !active || y.events.some((e) => e.categories.includes(active))), [years, active]);

  return (
    <div>
      <section aria-labelledby="explore-decade">
        <div className="flex items-end justify-between gap-4">
          <h2 id="explore-decade" className="label"><L en={`Explore ${label}`} fr={`Explorer ${labelFr ?? label}`} /></h2>
          <span className="text-xs text-dim tabular-nums">{years.reduce((n, y) => n + y.events.length, 0)} <L en="documented moments" fr="moments documentés" /></span>
        </div>
        <ol className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {sections.map((s) => {
            const n = count(s.slug);
            const on = active === s.slug;
            return (
              <li key={s.slug} className="shrink-0">
                <button onClick={() => setActive(on ? "" : s.slug)} aria-pressed={on} title={s.items.join(", ")}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? "border-fg bg-fg text-base" : n ? "border-rule hover:border-fg" : "border-rule text-dim/50"}`}>
                  <L en={s.short} fr={s.shortFr} /> <span className="ml-1 text-xs opacity-65">{n}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="browse-year" className="mt-8">
        <h2 id="browse-year" className="label"><L en="Jump to year" fr="Accéder à une année" /></h2>
        <ol className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {years.map((y) => <li key={y.year} className="shrink-0">
            <a href={`#y${y.year}`} className="block rounded-full border border-rule px-3.5 py-1.5 text-sm tabular-nums hover:border-fg">{y.year}</a>
          </li>)}
        </ol>
      </section>

      <ol className="mt-12">
        {years.map((y) => {
          const evs = active ? y.events.filter((e) => e.categories.includes(active)) : y.events;
          const empty = evs.length === 0;
          if (empty && !showEmptyYears) return null;
          const months = new Map<string, TLEvent[]>();
          for (const e of evs) {
            const m = e.date.match(/^\d{4}-(\d{2})/);
            const key = m ? String(Number(m[1])) : "0";
            months.set(key, [...(months.get(key) ?? []), e]);
          }
          const monthGroups = [...months.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
          return (
            <li key={y.year} id={`y${y.year}`} className="scroll-mt-36 border-t border-rule pb-10 pt-9">
              <div className="mx-auto w-full max-w-[52rem]">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="wdth-tight text-5xl font-extrabold tabular-nums sm:text-6xl">{y.year}</p>
                  <span className="text-xs text-dim tabular-nums">{evs.length} <L en={evs.length === 1 ? "entry" : "entries"} fr={evs.length === 1 ? "entrée" : "entrées"} /></span>
                </div>
                {y.title && !active && <p className="mt-2 text-xl font-semibold leading-snug">{y.title}</p>}
                {!active && y.content && <div className="mt-3">{y.content}</div>}
                {empty ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-rule p-4 text-sm text-dim">
                    <L en="No documented highlights have been added for this year yet. This does not mean that nothing happened." fr="Aucun moment marquant documenté n'a encore été ajouté pour cette année. Cela ne signifie pas qu'il ne s'est rien passé." />
                  </p>
                ) : (
                  <div className="mt-7 space-y-7">
                    {monthGroups.map(([month, items]) => (
                      <section key={month} aria-label={month === "0" ? "Date not specified" : MONTHS[Number(month) - 1][0]}>
                        <h3 className="border-b border-rule pb-2 text-sm font-semibold">
                          {month === "0" ? <L en="Date not specified" fr="Date non précisée" /> : <L en={MONTHS[Number(month) - 1][0]} fr={MONTHS[Number(month) - 1][1]} />}
                        </h3>
                        <ul className="divide-y divide-rule">
                          {items.map((e) => (
                            <li key={e.slug} className="py-4">
                              <EventLink slug={e.slug} className="group block">
                                <div className="flex items-start gap-3">
                                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                                  <span className="min-w-0 flex-1">
                                    <span className={`block leading-snug group-hover:text-dim ${e.highlight ? "text-base font-semibold" : "font-medium"}`}>
                                      <L en={e.title} fr={e.fr?.title} />
                                    </span>
                                    <span className="mt-1 block text-sm text-dim">{e.label} · {e.fr?.location ?? e.location}</span>
                                  </span>
                                  <span className="pt-0.5 text-dim transition-transform group-hover:translate-x-0.5" aria-hidden>↗</span>
                                </div>
                              </EventLink>
                              <div className="ml-5 mt-2 flex flex-wrap gap-1.5">
                                <SubjectLinks slugs={e.categories} compact />
                                <span className="rounded-full border border-rule px-2 py-0.5 text-[10px] text-dim"><L en={e.dimension === "inside" ? "Inside Haiti" : e.dimension === "abroad" ? "Haitians abroad" : "World impact"} fr={e.dimension === "inside" ? "En Haïti" : e.dimension === "abroad" ? "Haïtiens à l'étranger" : "Impact mondial"} /></span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {active && visible.length === 0 && <p className="mt-6 text-dim"><L en={`Nothing recorded in this section for ${label} yet.`} fr={`Rien d'enregistré dans cette section pour ${labelFr ?? label} pour l'instant.`} /></p>}
    </div>
  );
}
