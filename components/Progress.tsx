"use client";
import { useEffect, useState } from "react";

const KEY = "fivonine:explored";

function read(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

/** Marks a period as explored on this device. */
export function MarkExplored({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const s = new Set(read());
      s.add(slug);
      localStorage.setItem(KEY, JSON.stringify([...s]));
    } catch { /* storage unavailable */ }
  }, [slug]);
  return null;
}

/** Highlights explored decades in the river and shows a "journey" meter. */
export function JourneyMeter({ total }: { total: number }) {
  const [done, setDone] = useState<string[] | null>(null);
  useEffect(() => {
    const d = read();
    setDone(d);
    for (const s of d) document.querySelectorAll(`[data-period="${s}"]`).forEach((el) => el.setAttribute("data-explored", "true"));
  }, []);
  if (!done || done.length === 0) return <p className="max-w-xs text-sm text-dim">Start anywhere. The periods you open are remembered on this device.</p>;
  const pct = Math.round((done.length / total) * 100);
  return (
    <div className="max-w-sm">
      <div className="flex justify-between gap-6 text-sm"><span>You've explored {done.length} of {total} periods</span><span className="tabular-nums text-dim">{pct}%</span></div>
      <div className="mt-2 h-1 w-64 overflow-hidden rounded-full bg-raise">
        <div className="h-full rounded-full bg-fg" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Fire-and-forget view counter for trending. */
export function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    const k = `fivonine:viewed:${slug}`;
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch {}
    fetch("/api/view", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug }) }).catch(() => {});
  }, [slug]);
  return null;
}
