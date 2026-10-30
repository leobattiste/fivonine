"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";
import type { Category, Dimension, HistEvent } from "@/lib/types";

type Props = {
  events: (HistEvent & { label: string; year: number })[];
  categories: Category[];
  notes?: Partial<Record<string, string>>;
  start: number;
  end: number;
  isDecade: boolean;
};

/** A decade as a timeline: every year in order, filterable by subject and by where it happened. */
export default function PeriodView({ events, categories, notes = {}, start, end, isDecade }: Props) {
  const [subject, setSubject] = useState<string>("");
  const [dim, setDim] = useState<Dimension | "">("");

  // Shareable: ?subject=music
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("subject");
    if (s && categories.some((c) => c.slug === s)) setSubject(s);
  }, [categories]);
  useEffect(() => {
    const u = new URL(window.location.href);
    if (subject) u.searchParams.set("subject", subject); else u.searchParams.delete("subject");
    window.history.replaceState(null, "", u);
  }, [subject]);

  const subjects = categories
    .map((c) => ({ ...c, n: events.filter((e) => e.categories.includes(c.slug)).length, note: Boolean(notes[c.slug]) }))
    .filter((c) => c.n || c.note);
  const filtered = events.filter((e) => (!subject || e.categories.includes(subject)) && (!dim || e.dimension === dim));
  const filtering = Boolean(subject || dim);

  const years = useMemo(() => {
    const ys = isDecade ? Array.from({ length: end - start + 1 }, (_, i) => start + i) : [...new Set(filtered.map((e) => e.year))];
    return ys.map((y) => ({ y, items: filtered.filter((e) => e.year === y) }));
  }, [filtered, isDecade, start, end]);

  const active = categories.find((c) => c.slug === subject);
  const areaShort = (slug: string) => categories.find((c) => c.slug === slug)?.short ?? slug;

  return (
    <div>
      {/* Subjects */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <button className="pill shrink-0" data-on={!subject} onClick={() => setSubject("")}>
          All subjects <span className="tabular-nums opacity-60">{events.length}</span>
        </button>
        {subjects.map((c) => (
          <button key={c.slug} className="pill shrink-0" data-on={subject === c.slug} onClick={() => setSubject(subject === c.slug ? "" : c.slug)}>
            {c.name} <span className="tabular-nums opacity-60">{c.n}</span>
          </button>
        ))}
      </div>

      {/* Where it happened */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {(Object.keys(DIMENSIONS) as Dimension[]).map((d) => (
          <button key={d} onClick={() => setDim(dim === d ? "" : d)} aria-pressed={dim === d}
            className={`flex items-center gap-2 rounded-full py-1 ${dim === d ? "font-medium text-fg underline underline-offset-4" : dim ? "text-dim/60" : "text-dim hover:text-fg"}`}>
            <span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[d].color }} />
            {DIMENSIONS[d].label}
          </button>
        ))}
        {filtering && <button onClick={() => { setSubject(""); setDim(""); }} className="text-dim underline underline-offset-4 hover:text-fg">Show everything</button>}
      </div>

      {/* Subject note for this decade */}
      {active && (
        <div className="mt-8 rounded-2xl bg-raise p-6 sm:p-8">
          <p className="text-sm font-medium">{active.name} in {isDecade ? `the ${start}s` : "this period"}</p>
          {notes[active.slug] ? (
            <p className="read mt-3">{notes[active.slug]}</p>
          ) : (
            <p className="mt-2 text-dim">No overview written yet. The timeline below shows every recorded moment for this subject.</p>
          )}
        </div>
      )}

      {/* Timeline */}
      <ol className="relative mt-10">
        <span className="absolute bottom-2 left-[3.4rem] top-2 w-px bg-rule sm:left-[5.4rem]" aria-hidden />
        {years.map(({ y, items }) =>
          items.length === 0 ? (
            isDecade && (
              <li key={y} id={`y${y}`} className="grid scroll-mt-40 grid-cols-[3.4rem_1fr] items-center sm:grid-cols-[5.4rem_1fr]">
                <span className="pr-3 text-right text-sm tabular-nums text-dim/50 sm:pr-6">{y}</span>
                <span className="relative pl-6 text-xs text-dim/50 sm:pl-8">
                  <span className="absolute left-[-3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-rule" aria-hidden />
                  {filtering ? "—" : "Nothing recorded yet"}
                </span>
              </li>
            )
          ) : (
            <li key={y} id={`y${y}`} className="grid scroll-mt-40 grid-cols-[3.4rem_1fr] py-4 sm:grid-cols-[5.4rem_1fr]">
              <span className="wdth-tight pr-3 text-right text-2xl font-bold tabular-nums sm:pr-6 sm:text-3xl">{y}</span>
              <ul className="space-y-6 pl-6 sm:pl-8">
                {items.map((e) => (
                  <li key={e.slug} className="relative">
                    <span className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-base sm:-left-[2.35rem]" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                    <p className="text-sm text-dim">{e.label}, {e.location}</p>
                    <Link href={`/events/${e.slug}`} className="mt-0.5 block text-xl font-semibold leading-snug hover:text-dim">{e.title}</Link>
                    <p className="mt-2 max-w-2xl font-serif text-[1.05rem] leading-relaxed text-[#2a2a28]">{e.summary}</p>
                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-dim">
                      {e.categories.map((c) => (
                        <button key={c} onClick={() => setSubject(c)} className="hover:text-fg hover:underline">{areaShort(c)}</button>
                      ))}
                      {e.status !== "documented" && <span className="status-note">{STATUS_LABEL[e.status]}</span>}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
      </ol>
      {filtered.length === 0 && (
        <p className="mt-4 max-w-lg text-dim">Nothing recorded for this filter yet. We add moments only when they&apos;re sourced.</p>
      )}
    </div>
  );
}
