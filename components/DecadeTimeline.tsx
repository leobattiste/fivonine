"use client";
import L from "@/components/L";
import { EventLink } from "@/components/PersonModal";
import { useEffect, useState } from "react";
import { DIMENSIONS } from "@/lib/site";
import type { Dimension, EventFr, EvidenceStatus } from "@/lib/types";

export type TLSection = { slug: string; name: string; short: string; shortFr?: string; items: string[] };
export type TLEvent = {
  slug: string; title: string; fr?: EventFr; label: React.ReactNode; location: string; dimension: Dimension;
  categories: string[]; status: EvidenceStatus; highlight?: boolean;
};
export type TLYear = { year: number; title?: string; content?: React.ReactNode; events: TLEvent[] };

/**
 * The year-by-year timeline: each year's story, then its moments grouped under the 10 sections.
 * Choosing a section narrows every year to that section.
 */
export default function DecadeTimeline({ sections, years, notes = {}, label, labelFr, showEmptyYears }: {
  labelFr?: string;
  sections: TLSection[]; years: TLYear[]; notes?: Partial<Record<string, string>>; label: string; showEmptyYears: boolean;
}) {
  const [active, setActive] = useState("");

  // Shareable: ?section=arts
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
  const visible = years.filter((y) => !active || y.events.some((e) => e.categories.includes(active)));
  const shortOf = (slug: string) => { const s = sections.find((x) => x.slug === slug); return s ? <L key={slug} en={s.short} fr={s.shortFr} /> : slug; };

  return (
    <div>
      {/* Explore the decade: filters, styled like the year chips */}
      <section aria-labelledby="explore-decade">
        <h2 id="explore-decade" className="label"><L en={`Explore ${label}`} fr={`Explorer ${labelFr ?? label}`} /></h2>
        <ol className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {sections.map((s) => {
            const n = count(s.slug);
            const on = active === s.slug;
            return (
              <li key={s.slug} className="shrink-0">
                <button
                  onClick={() => setActive(on ? "" : s.slug)}
                  aria-pressed={on}
                  title={s.items.join(", ")}
                  className={`rounded-full border px-3.5 py-1.5 text-sm ${on ? "border-fg bg-fg text-base" : n ? "border-rule hover:border-fg" : "border-rule text-dim/50"}`}
                >
                  <L en={s.short} fr={s.shortFr} />
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Browse by year */}
      <section aria-labelledby="browse-year" className="mt-8">
        <h2 id="browse-year" className="label"><L en="Browse by year" fr="Parcourir par année" /></h2>
        <ol className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {years.map((y) => {
            const has = Boolean(y.content) || y.events.length > 0;
            if (!has) return null;
            const dim = active ? !y.events.some((e) => e.categories.includes(active)) : false;
            return (
              <li key={y.year} className="shrink-0">
                <a href={`#y${y.year}`} className={`block rounded-full border px-3.5 py-1.5 text-sm tabular-nums ${dim ? "border-rule text-dim/50" : "border-rule hover:border-fg"}`}>{y.year}</a>
              </li>
            );
          })}
        </ol>
      </section>

      {/* The years */}
      <ol className="mt-12">
        {visible.map((y) => {
          const evs = active ? y.events.filter((e) => e.categories.includes(active)) : y.events;
          const empty = !y.content && evs.length === 0;
          if (empty && !showEmptyYears) return null;
          if (empty) return null;
          // Group moments under their first section
          const groups = sections.map((s) => ({ s, items: evs.filter((e) => (active ? active : e.categories[0]) === s.slug) })).filter((g) => g.items.length);
          return (
            <li key={y.year} id={`y${y.year}`} className="scroll-mt-40 border-t border-rule pb-6 pt-10">
              <div className="mx-auto w-full max-w-[45rem]">
                <p className="wdth-tight text-5xl font-extrabold tabular-nums">{y.year}</p>
                {y.title && !active && <p className="mt-2 text-2xl font-semibold leading-snug">{y.title}</p>}
              </div>
              {!active && y.content && <div className="mt-2">{y.content}</div>}
              {groups.length > 0 && (
                <div className="mx-auto mt-8 w-full max-w-[45rem] rounded-2xl border border-rule p-4 sm:p-5">
                  <p className="text-sm font-medium">{active ? <L en={`${y.year} in ${sections.find((s) => s.slug === active)?.short}`} fr={`${y.year} : ${sections.find((s) => s.slug === active)?.shortFr}`} /> : <L en={`Moments of ${y.year}`} fr={`Moments de ${y.year}`} />}</p>
                  <div className="mt-2 space-y-4">
                    {groups.map(({ s, items }) => (
                      <div key={s.slug}>
                        {!active && (
                          <button onClick={() => setActive(s.slug)} className="text-xs font-medium text-dim hover:text-fg"><L en={s.short} fr={s.shortFr} /></button>
                        )}
                        <ul className="mt-1 divide-y divide-rule">
                          {items.map((e) => (
                            <li key={e.slug}>
                              <EventLink slug={e.slug} className="group flex gap-3 py-2.5">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                                <span className="min-w-0">
                                  <span className={`block leading-snug group-hover:text-dim ${e.highlight ? "font-semibold" : "font-medium"}`}>
                                    <L en={e.title} fr={e.fr?.title} />
                                  </span>
                                  <span className="block text-sm text-dim">
                                    {e.label}, {e.location}
                                    {e.categories.length > 1 && !active && <span> · <L en="also" fr="aussi" /> {e.categories.slice(1).map((c, k) => <span key={c}>{k > 0 && ", "}{shortOf(c)}</span>)}</span>}
                                  </span>
                                </span>
                              </EventLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {active && visible.length === 0 && (
        <p className="mt-6 text-dim"><L en={`Nothing recorded in this section for ${label} yet.`} fr={`Rien d’enregistré dans cette section pour ${labelFr ?? label} pour l’instant.`} /></p>
      )}
    </div>
  );
}
