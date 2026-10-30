"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "@/components/L";
import { useT } from "@/components/Prefs";
import { DIMENSIONS } from "@/lib/site";
import type { Dimension } from "@/lib/types";

type Pt = { titleFr?: string; labelFr?: string; slug: string; title: string; year: number; label: string; location: string; dimension: Dimension; period: string; periodLabel: string };

const MIN = 1490;
const MAX = 2030;
const START = 1804;

/** The hero: a giant year you can drag through five centuries. */
export default function TimeScrubber({ points }: { points: Pt[] }) {
  const t = useT();
  const [year, setYear] = useState(MIN + 2);
  const [dragging, setDragging] = useState(false);
  const track = useRef<HTMLDivElement>(null);

  // One orchestrated moment: count up from 1492 to 1804 on first load.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setYear(START); return; }
    const from = 1492, dur = 1600, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const ease = 1 - Math.pow(1 - k, 4);
      setYear(Math.round(from + (START - from) * ease));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pct = (y: number) => ((y - MIN) / (MAX - MIN)) * 100;

  const nearest = useMemo(() => {
    let best = points[0];
    for (const p of points) if (Math.abs(p.year - year) < Math.abs(best.year - year)) best = p;
    return best;
  }, [points, year]);

  const fromPointer = useCallback((clientX: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r) return;
    const k = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setYear(Math.round(MIN + k * (MAX - MIN)));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const jump = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { setYear((y) => Math.min(MAX, y + jump)); e.preventDefault(); }
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") { setYear((y) => Math.max(MIN, y - jump)); e.preventDefault(); }
    if (e.key === "PageUp") setYear((y) => Math.min(MAX, y + 50));
    if (e.key === "PageDown") setYear((y) => Math.max(MIN, y - 50));
  };

  const centuries = [1500, 1600, 1700, 1800, 1900, 2000];

  return (
    <div className="select-none">
      {/* The year */}
      <p className="wdth-tight -ml-[0.04em] text-d-0 tabular-nums" aria-live="polite" aria-atomic>
        {year}
      </p>

      {/* Ruler */}
      <div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label={t("Choose a year", "Choisir une année")}
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={year}
        onKeyDown={onKey}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); setDragging(true); fromPointer(e.clientX); }}
        onPointerMove={(e) => dragging && fromPointer(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        className={`relative mt-10 h-24 touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* decade ticks */}
        <div className="absolute inset-x-0 top-8 h-px bg-rule" />
        {Array.from({ length: (MAX - MIN) / 10 + 1 }, (_, i) => MIN + i * 10).map((y) => (
          <span key={y} className="absolute top-8 w-px bg-rule" style={{ left: `${pct(y)}%`, height: y % 100 === 0 ? 18 : 7 }} />
        ))}
        {centuries.map((c) => (
          <span key={c} className="absolute top-[58px] -translate-x-1/2 text-xs tabular-nums text-dim" style={{ left: `${pct(c)}%` }}>{c}</span>
        ))}
        {/* events */}
        {points.map((p) => (
          <span
            key={p.slug}
            className="absolute top-[26px] h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-base transition-transform"
            style={{ left: `${pct(p.year)}%`, background: DIMENSIONS[p.dimension].color, transform: `translateX(-50%) scale(${p.slug === nearest.slug ? 1.5 : 1})` }}
          />
        ))}
        {/* handle */}
        <span className="absolute top-0 h-16 w-[2px] -translate-x-1/2 rounded-full bg-fg" style={{ left: `${pct(year)}%` }}>
          <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-fg" />
        </span>
      </div>

      {/* Nearest moment */}
      <div className="mt-4 grid gap-6 border-t border-rule pt-8 md:grid-cols-[1fr_auto] md:items-end">
        <div className="min-h-[7.5rem]">
          <p className="flex items-center gap-2 text-sm text-dim">
            <span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[nearest.dimension].color }} />
            <L en={nearest.label} fr={nearest.labelFr} />, {nearest.location}
          </p>
          <p className="mt-2 max-w-2xl text-d-4 font-semibold"><L en={nearest.title} fr={nearest.titleFr} /></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/events/${nearest.slug}`} className="btn btn-solid"><L en="Read this moment" fr="Lire ce moment" /></Link>
          <Link href={`/decades/${nearest.period}`} className="btn btn-ghost"><L en="Open" fr="Ouvrir" /> {nearest.periodLabel}</Link>
        </div>
      </div>
      <p className="mt-6 text-sm text-dim"><L en="Drag the line, or use the arrow keys. Shift jumps a decade." fr="Faites glisser la ligne ou utilisez les flèches. Maj saute une décennie." /></p>
    </div>
  );
}
