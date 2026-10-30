import Link from "next/link";
import { eventsInPeriod } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";
import type { Content, Dimension } from "@/lib/types";

/** Every period as a layer of rock: thicker bands hold more of the documented record. */
export default function Strata({ c }: { c: Content }) {
  const rows = c.periods.map((p) => {
    const evs = eventsInPeriod(c, p);
    const d = { inside: 0, abroad: 0, foreign: 0 } as Record<Dimension, number>;
    evs.forEach((e) => d[e.dimension]++);
    return { p, n: evs.length, d };
  });
  const max = Math.max(1, ...rows.map((r) => r.n));

  return (
    <ol className="border-t border-rule">
      {rows.map(({ p, n, d }) => {
        const [kicker, headline] = p.title.includes(":") ? p.title.split(/:\s(.+)/) : ["", p.title];
        const empty = n === 0 && !p.overview;
        return (
          <li key={p.slug}>
            <Link
              href={`/decades/${p.slug}`}
              data-period={p.slug}
              className={`group grid grid-cols-[6.5rem_1fr] items-center gap-x-5 gap-y-3 border-b border-rule py-5 transition-colors hover:bg-raise sm:grid-cols-[11rem_1fr_14rem] sm:px-4 ${empty ? "text-dim" : ""}`}
            >
              <span className={`wdth-tight font-display font-bold tabular-nums tracking-tight ${p.kind === "era" ? "text-lg leading-tight sm:text-2xl" : "text-[2rem] leading-none sm:text-[3.4rem]"}`}>
                {p.kind === "decade" ? `${p.start}s` : p.label}
              </span>
              <span className="min-w-0">
                {empty ? (
                  <span className="text-sm">Being researched</span>
                ) : (
                  <>
                    {kicker && <span className="block text-sm text-dim">{kicker}</span>}
                    <span className="block text-lg font-medium leading-snug group-hover:text-white sm:text-xl">{headline}</span>
                  </>
                )}
                <span className="mt-1 hidden text-xs text-sun group-data-[explored=true]:block">You've been here</span>
              </span>
              <span className="col-span-2 sm:col-span-1">
                <span className="flex h-2 w-full overflow-hidden rounded-full bg-raise" style={{ width: `${Math.max(8, (n / max) * 100)}%` }}>
                  {(Object.keys(d) as Dimension[]).map((k) =>
                    d[k] ? <span key={k} style={{ flex: d[k], background: DIMENSIONS[k].color }} title={`${DIMENSIONS[k].label}: ${d[k]}`} /> : null
                  )}
                </span>
                <span className="mt-1.5 block text-xs tabular-nums text-dim">
                  {n === 0 ? "No entries yet" : `${n} ${n === 1 ? "entry" : "entries"}`}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
