"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";
import type { Dimension, EvidenceStatus } from "@/lib/types";

export type TLSection = { slug: string; name: string; short: string; items: string[] };
export type TLEvent = {
  slug: string; title: string; label: string; location: string; dimension: Dimension;
  categories: string[]; status: EvidenceStatus; highlight?: boolean;
};
export type TLYear = { year: number; title?: string; content?: React.ReactNode; events: TLEvent[] };

/**
 * The year-by-year timeline: each year's story, then its moments grouped under the 10 sections.
 * Choosing a section narrows every year to that section.
 */
export default function DecadeTimeline({ sections, years, notes = {}, label, showEmptyYears }: {
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
  const current = sections.find((s) => s.slug === active);
  const visible = years.filter((y) => !active || y.events.some((e) => e.categories.includes(active)));
  const shortOf = (slug: string) => sections.find((s) => s.slug === slug)?.short ?? slug;

  return (
    <div>
      {/* Explore the decade */}
      <section aria-labelledby="explore-decade">
        <h2 id="explore-decade" className="text-d-4 font-semibold">Explore {label}</h2>
        <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {sections.map((s, i) => {
            const n = count(s.slug);
            const on = active === s.slug;
            return (
              <li key={s.slug}>
                <button
                  onClick={() => setActive(on ? "" : s.slug)}
                  aria-pressed={on}
                  title={s.items.join(", ")}
                  className={`flex h-full w-full flex-col rounded-2xl border p-4 text-left transition-colors ${on ? "border-fg bg-fg text-base" : n ? "border-rule hover:border-fg" : "border-dashed border-rule text-dim"}`}
                >
                  <span className={`text-sm tabular-nums ${on ? "text-base/70" : "text-dim"}`}>{i + 1}</span>
                  <span className="mt-1 font-semibold leading-snug">{s.short}</span>
                  <span className={`mt-auto pt-3 text-xs tabular-nums ${on ? "text-base/70" : "text-dim"}`}>{n ? `${n} ${n === 1 ? "moment" : "moments"}` : "Being researched"}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Browse by year */}
      <section aria-labelledby="browse-year" className="mt-10">
        <h2 id="browse-year" className="label">Browse by year</h2>
        <ol className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {years.map((y) => {
            const has = Boolean(y.content) || y.events.length > 0;
            const dim = active ? !y.events.some((e) => e.categories.includes(active)) : !has;
            return (
              <li key={y.year} className="shrink-0">
                <a href={`#y${y.year}`} className={`block rounded-full border px-3.5 py-1.5 text-sm tabular-nums ${dim ? "border-rule text-dim/50" : "border-rule hover:border-fg"}`}>{y.year}</a>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Section focus */}
      {current && (
        <div className="mt-10 rounded-[1.5rem] bg-raise p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-dim">Showing only</p>
              <p className="text-xl font-semibold">{current.name}</p>
            </div>
            <button onClick={() => setActive("")} className="btn btn-ghost !py-2 shrink-0">Show everything</button>
          </div>
          {notes[current.slug] && <p className="read mt-4">{notes[current.slug]}</p>}
          <p className="mt-4 text-sm text-dim">Covers: {current.items.join(", ")}.</p>
        </div>
      )}

      {/* The years */}
      <ol className="mt-12">
        {visible.map((y) => {
          const evs = active ? y.events.filter((e) => e.categories.includes(active)) : y.events;
          const empty = !y.content && evs.length === 0;
          if (empty && !showEmptyYears) return null;
          if (empty)
            return (
              <li key={y.year} id={`y${y.year}`} className="flex scroll-mt-40 items-baseline gap-5 border-t border-rule py-4">
                <span className="wdth-tight w-20 shrink-0 text-2xl font-bold tabular-nums text-rule">{y.year}</span>
                <span className="text-sm text-dim/70">Nothing documented yet for this year.</span>
              </li>
            );
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
                  <p className="text-sm font-medium">{active ? `${y.year} in ${current?.short}` : `Moments of ${y.year}`}</p>
                  <div className="mt-2 space-y-4">
                    {groups.map(({ s, items }) => (
                      <div key={s.slug}>
                        {!active && (
                          <button onClick={() => setActive(s.slug)} className="text-xs font-medium text-dim hover:text-fg">{s.short}</button>
                        )}
                        <ul className="mt-1 divide-y divide-rule">
                          {items.map((e) => (
                            <li key={e.slug}>
                              <Link href={`/events/${e.slug}`} className="group flex gap-3 py-2.5">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                                <span className="min-w-0">
                                  <span className={`block leading-snug group-hover:text-dim ${e.highlight ? "font-semibold" : "font-medium"}`}>
                                    {e.title}
                                    {e.highlight && <span className="ml-2 inline-block rounded-full bg-fg px-2 py-0.5 align-middle text-[10px] font-semibold text-base">Highlight</span>}
                                  </span>
                                  <span className="block text-sm text-dim">
                                    {e.label}, {e.location}
                                    {e.categories.length > 1 && !active && <span> · also {e.categories.slice(1).map(shortOf).join(", ")}</span>}
                                    {e.status !== "documented" && <span className="status-note ml-2">{STATUS_LABEL[e.status]}</span>}
                                  </span>
                                </span>
                              </Link>
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
        <p className="mt-6 text-dim">Nothing recorded in this section for {label} yet.</p>
      )}
    </div>
  );
}
