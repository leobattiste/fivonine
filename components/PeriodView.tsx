"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";
import type { Category, Dimension, HistEvent } from "@/lib/types";

type Props = {
  events: (HistEvent & { label: string; year: number })[];
  categories: Category[];
  start: number;
  end: number;
  isDecade: boolean;
};

/** Decade body: switch between the three dimensions, filter by subject, read year by year. */
export default function PeriodView({ events, categories, start, end, isDecade }: Props) {
  const [dim, setDim] = useState<Dimension | "all">("all");
  const [cat, setCat] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const usedCats = categories.filter((c) => events.some((e) => e.categories.includes(c.slug)));
  const filtered = events.filter((e) => (dim === "all" || e.dimension === dim) && (!cat || e.categories.includes(cat)));
  const count = (d: Dimension) => events.filter((e) => e.dimension === d).length;

  const years = useMemo(() => {
    const ys = isDecade ? Array.from({ length: end - start + 1 }, (_, i) => start + i) : [...new Set(filtered.map((e) => e.year))];
    return ys.map((y) => ({ y, items: filtered.filter((e) => e.year === y) }));
  }, [filtered, isDecade, start, end]);

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
      {/* Controls */}
      <div className="lg:sticky lg:top-36 lg:self-start">
        <p className="label">Show</p>
        <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
          <button className="pill" data-on={dim === "all"} onClick={() => setDim("all")}>
            Everything <span className="tabular-nums opacity-60">{events.length}</span>
          </button>
          {(Object.keys(DIMENSIONS) as Dimension[]).map((d) => (
            <button key={d} className="pill" data-on={dim === d} onClick={() => setDim(d)} disabled={!count(d)} style={{ opacity: count(d) ? 1 : 0.4 }}>
              <span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[d].color }} />
              {DIMENSIONS[d].label} <span className="tabular-nums opacity-60">{count(d)}</span>
            </button>
          ))}
        </div>
        {usedCats.length > 1 && (
          <>
            <p className="label mt-8">Subject</p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
              <button onClick={() => setCat(null)} className={!cat ? "text-fg underline underline-offset-4" : "text-dim hover:text-fg"}>All</button>
              {usedCats.map((c) => (
                <button key={c.slug} onClick={() => setCat(cat === c.slug ? null : c.slug)}
                  className={cat === c.slug ? "text-fg underline underline-offset-4" : "text-dim hover:text-fg"}>
                  {c.short}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Year by year */}
      <ol className="border-t border-rule">
        {years.map(({ y, items }) => (
          <li key={y} id={`y${y}`} className="grid scroll-mt-24 grid-cols-[4.5rem_1fr] gap-5 border-b border-rule py-5 sm:grid-cols-[6rem_1fr]">
            <span className={`wdth-tight text-3xl font-bold tabular-nums ${items.length ? "" : "text-rule"}`}>{y}</span>
            <div className="min-w-0 self-center">
              {items.length === 0 ? (
                <p className="text-sm text-dim/60">{dim !== "all" || cat ? "Nothing for this filter" : "No documented entries yet"}</p>
              ) : (
                <ul className="space-y-1">
                  {items.map((e) => {
                    const isOpen = open === e.slug;
                    return (
                      <li key={e.slug}>
                        <button onClick={() => setOpen(isOpen ? null : e.slug)} aria-expanded={isOpen}
                          className="flex w-full items-start gap-3 rounded-xl py-2 text-left">
                          <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} />
                          <span className="flex-1">
                            <span className="block text-xl font-medium leading-snug">{e.title}</span>
                            <span className="block text-sm text-dim">{e.label}, {e.location}</span>
                          </span>
                          <svg className={`mt-2 shrink-0 text-dim transition-transform ${isOpen ? "rotate-45" : ""}`} width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" />
                          </svg>
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                          <div className="overflow-hidden">
                            <div className="pb-4 pl-5">
                              {e.status !== "documented" && <p className="mb-2 text-sm status-note">{STATUS_LABEL[e.status]}</p>}
                              <p className="read !text-[1.05rem]">{e.summary}</p>
                              {e.consequences && <p className="read mt-3 !text-[1.05rem] text-dim"><em>Afterwards:</em> {e.consequences}</p>}
                              <Link href={`/events/${e.slug}`} className="mt-4 inline-block text-sm text-dim underline-offset-4 hover:underline">
                                Sources and connections
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
