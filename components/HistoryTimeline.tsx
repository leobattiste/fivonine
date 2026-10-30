"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";
import type { Category, Dimension, EvidenceStatus } from "@/lib/types";

export type TimelineItem = {
  slug: string; title: string; summary: string; label: string; year: number; location: string;
  dimension: Dimension; categories: string[]; status: EvidenceStatus; period: string; periodLabel: string;
};

/** The entire history on one continuous timeline, grouped by period, filterable by subject. */
export default function HistoryTimeline({ items, categories }: { items: TimelineItem[]; categories: Category[] }) {
  const [subject, setSubject] = useState("");
  const [dim, setDim] = useState<Dimension | "">("");

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("subject");
    if (s && categories.some((c) => c.slug === s)) setSubject(s);
  }, [categories]);
  useEffect(() => {
    const u = new URL(window.location.href);
    if (subject) u.searchParams.set("subject", subject); else u.searchParams.delete("subject");
    window.history.replaceState(null, "", u);
  }, [subject]);

  const filtered = items.filter((i) => (!subject || i.categories.includes(subject)) && (!dim || i.dimension === dim));
  const groups = useMemo(() => {
    const m = new Map<string, { label: string; slug: string; items: TimelineItem[] }>();
    for (const i of filtered) {
      if (!m.has(i.period)) m.set(i.period, { label: i.periodLabel, slug: i.period, items: [] });
      m.get(i.period)!.items.push(i);
    }
    return [...m.values()];
  }, [filtered]);
  const count = (slug: string) => items.filter((i) => i.categories.includes(slug)).length;
  const areaShort = (slug: string) => categories.find((c) => c.slug === slug)?.short ?? slug;

  return (
    <div>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <button className="pill shrink-0" data-on={!subject} onClick={() => setSubject("")}>All subjects <span className="tabular-nums opacity-60">{items.length}</span></button>
        {categories.map((c) => (
          <button key={c.slug} className="pill shrink-0" data-on={subject === c.slug} onClick={() => setSubject(subject === c.slug ? "" : c.slug)}>
            {c.name} <span className="tabular-nums opacity-60">{count(c.slug)}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {(Object.keys(DIMENSIONS) as Dimension[]).map((d) => (
          <button key={d} onClick={() => setDim(dim === d ? "" : d)} aria-pressed={dim === d}
            className={`flex items-center gap-2 py-1 ${dim === d ? "font-medium text-fg underline underline-offset-4" : dim ? "text-dim/60" : "text-dim hover:text-fg"}`}>
            <span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[d].color }} />{DIMENSIONS[d].label}
          </button>
        ))}
        <span className="ml-auto tabular-nums text-dim" aria-live="polite">{filtered.length} {filtered.length === 1 ? "moment" : "moments"}</span>
      </div>

      <div className="mt-10">
        {groups.map((g) => (
          <section key={g.slug} className="relative">
            <div className="sticky top-[60px] z-10 -mx-5 border-b border-rule bg-base/95 px-5 py-3 backdrop-blur-md sm:mx-0 sm:px-0">
              <Link href={`/decades/${g.slug}`} className="flex items-baseline justify-between gap-4">
                <span className="wdth-tight text-2xl font-bold">{g.label}</span>
                <span className="text-sm text-dim underline-offset-4 hover:underline">Open this period</span>
              </Link>
            </div>
            <ol className="relative py-4">
              <span className="absolute bottom-6 left-[3.4rem] top-6 w-px bg-rule sm:left-[5.4rem]" aria-hidden />
              {g.items.map((e) => (
                <li key={e.slug} className="grid grid-cols-[3.4rem_1fr] py-4 sm:grid-cols-[5.4rem_1fr]">
                  <span className="wdth-tight pr-3 text-right text-xl font-bold tabular-nums sm:pr-6 sm:text-2xl">{e.year}</span>
                  <div className="relative pl-6 sm:pl-8">
                    <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-base" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                    <p className="text-sm text-dim">{e.label}, {e.location}</p>
                    <Link href={`/events/${e.slug}`} className="mt-0.5 block text-lg font-semibold leading-snug hover:text-dim sm:text-xl">{e.title}</Link>
                    <p className="mt-1.5 max-w-2xl font-serif text-[1rem] leading-relaxed text-[#2a2a28] line-clamp-3">{e.summary}</p>
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-dim">
                      {e.categories.map((c) => <button key={c} onClick={() => setSubject(c)} className="hover:text-fg hover:underline">{areaShort(c)}</button>)}
                      {e.status !== "documented" && <span className="status-note">{STATUS_LABEL[e.status]}</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
        {filtered.length === 0 && <p className="text-dim">Nothing recorded for this filter yet.</p>}
      </div>
    </div>
  );
}
