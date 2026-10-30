import L from "@/components/L";
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
        const frt = p.fr?.title ? p.fr.title.replace(/\s:\s/, ": ") : "";
        const [kickerFr, headlineFr] = frt ? (frt.includes(":") ? frt.split(/:\s(.+)/) : ["", frt]) : [undefined, undefined];
        const empty = n === 0 && !p.overview;
        return (
          <li key={p.slug}>
            <Link
              href={`/decades/${p.slug}`}
              data-period={p.slug}
              className={`group grid grid-cols-[5.75rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 border-b border-rule py-5 transition-colors hover:bg-raise sm:grid-cols-[11rem_1fr_14rem] sm:px-4 ${empty ? "text-dim" : ""}`}
            >
              <span className={`wdth-tight tabular-nums ${p.kind === "era" ? "text-base leading-tight sm:text-2xl" : "text-[1.5rem] leading-none sm:text-[2.6rem]"}`}>
                {p.kind === "decade" ? `${p.start}s` : <L en={p.label} fr={p.fr?.label} />}
              </span>
              <span className="min-w-0">
                {empty ? (
                  <span className="text-sm"><L en="Being researched" fr="En cours de recherche" /></span>
                ) : (
                  <>
                    {kicker && <span className="block text-sm text-dim"><L en={kicker} fr={kickerFr} /></span>}
                    <span className="block text-lg font-medium leading-snug group-hover:text-dim sm:text-xl"><L en={headline} fr={headlineFr} /></span>
                  </>
                )}
                <span className="mt-1 hidden text-xs status-note group-data-[explored=true]:block"><L en="You've been here" fr="Vous êtes déjà passé ici" /></span>
              </span>
              <span className="col-span-2 sm:col-span-1">
                <span className="flex h-2 w-full overflow-hidden rounded-full bg-raise" style={{ width: `${Math.max(8, (n / max) * 100)}%` }}>
                  {(Object.keys(d) as Dimension[]).map((k) =>
                    d[k] ? <span key={k} style={{ flex: d[k], background: DIMENSIONS[k].color }} title={`${DIMENSIONS[k].label}: ${d[k]}`} /> : null
                  )}
                </span>
                <span className="mt-1.5 block text-xs tabular-nums text-dim">
                  {n === 0 ? <L en="No entries yet" fr="Aucune entrée pour l’instant" /> : <L en={`${n} ${n === 1 ? "entry" : "entries"}`} fr={`${n} ${n === 1 ? "entrée" : "entrées"}`} />}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
