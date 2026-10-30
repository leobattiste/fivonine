import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { formatDate, periodFor, sortEvents, yearOf } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";
import type { Content, Person } from "@/lib/types";

/** A figure's profile. Used as a full page and inside the modal. */
export default function PersonDetail({ p, c, inModal = false }: { p: Person; c: Content; inModal?: boolean }) {
  const evs = sortEvents(c.events.filter((e) => e.people?.includes(p.slug)));
  const periods = [...new Map(evs.map((e) => periodFor(e, c.periods)).filter(Boolean).map((x) => [x!.slug, x!])).values()];
  const H = inModal ? "h2" : "h1";

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="pt-2 tabular-nums text-dim">{[p.born, p.died].filter(Boolean).join(" to ") || "Dates uncertain"}</p>
        {!inModal && <ShareButton title={p.name} path={`/people/${p.slug}`} />}
      </div>
      <H className={`mt-2 max-w-4xl font-extrabold ${inModal ? "text-d-3" : "text-d-2"}`}>{p.name}</H>
      <p className="mt-3 text-lg text-dim">{p.roles.join(", ")}</p>
      <p className="read mt-6">{p.bio}</p>

      {periods.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {periods.map((x) => <Link key={x.slug} href={`/decades/${x.slug}`} className="pill">{x.label}</Link>)}
        </div>
      )}

      {evs.length > 0 && (
        <section className={inModal ? "mt-10" : "mt-16"}>
          <h3 className="text-lg font-semibold">In the record</h3>
          <ul className="mt-4 border-t border-rule">
            {evs.map((e) => (
              <li key={e.slug}>
                <Link href={`/events/${e.slug}`} className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-4 border-b border-rule py-3">
                  <span className="wdth-tight whitespace-nowrap text-xl font-bold tabular-nums">
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-[0.25em] rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                    {yearOf(e)}
                  </span>
                  <span>
                    <span className="block font-medium group-hover:text-dim">{e.title}</span>
                    <span className="block text-sm text-dim">{formatDate(e)}, {e.location}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {inModal && (
        <div className="mt-8 flex flex-wrap gap-2">
          <ShareButton title={p.name} path={`/people/${p.slug}`} />
        </div>
      )}
    </div>
  );
}
