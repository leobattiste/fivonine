import L from "@/components/L";
import { EventLink, RecordLink } from "@/components/PersonModal";
import { dateNode } from "@/components/dates";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { periodFor, sortEvents, yearOf } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";
import type { Content, Person } from "@/lib/types";

/** A figure's profile. Used as a full page and inside the modal. */
export default function PersonDetail({ p, c, inModal = false }: { p: Person; c: Content; inModal?: boolean }) {
  const evs = sortEvents(c.events.filter((e) => e.people?.includes(p.slug)));
  const periods = [...new Map(evs.map((e) => periodFor(e, c.periods)).filter(Boolean).map((x) => [x!.slug, x!])).values()];
  const records = (c.records ?? []).filter((r) => (r.eventSlugs ?? []).some((s) => evs.some((e) => e.slug === s)));
  const H = inModal ? "h2" : "h1";

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="pt-2 tabular-nums text-dim"><L en={[p.born, p.died].filter(Boolean).join(" to ") || "Dates uncertain"} fr={[p.born, p.died].filter(Boolean).join(" à ") || "Dates incertaines"} /></p>
        {!inModal && <ShareButton title={p.name} path={`/people/${p.slug}`} />}
      </div>
      <H className={`mt-2 max-w-4xl ${inModal ? "text-d-3" : "text-d-2"}`}>{p.name}</H>
      <p className="mt-3 text-lg text-dim"><L en={p.roles.join(", ")} fr={p.fr?.roles?.join(", ")} /></p>
      <p className="read mt-6"><L en={p.bio} fr={p.fr?.bio} /></p>
      {periods.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {periods.map((x) => <Link key={x.slug} href={`/decades/${x.slug}`} className="pill"><L en={x.label} fr={x.fr?.label} /></Link>)}
        </div>
      )}

      {evs.length > 0 && (
        <section className={inModal ? "mt-10" : "mt-16"}>
          <h3 className="text-lg"><L en="In the record" fr="Dans le registre" /></h3>
          <ul className="mt-4 border-t border-rule">
            {evs.map((e) => (
              <li key={e.slug}>
                <EventLink slug={e.slug} className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-4 border-b border-rule py-3">
                  <span className="wdth-tight whitespace-nowrap text-base tabular-nums">
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-[0.25em] rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                    {yearOf(e)}
                  </span>
                  <span>
                    <span className="block font-medium group-hover:text-dim"><L en={e.title} fr={e.fr?.title} /></span>
                    <span className="block text-sm text-dim">{dateNode(e)}, {e.location}</span>
                  </span>
                </EventLink>
              </li>
            ))}
          </ul>
        </section>
      )}
      {records.length > 0 && (
        <section className={inModal ? "mt-8" : "mt-10"}>
          <h3 className="text-lg"><L en="Connected records" fr="Notices associées" /></h3>
          <ul className="mt-3 flex flex-wrap gap-2">{records.map((r) => <li key={r.slug}><RecordLink slug={r.slug} className="pill"><L en={r.title} fr={r.fr?.title} /></RecordLink></li>)}</ul>
        </section>
      )}
      {p.sources && p.sources.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg"><L en="Sources and further reading" fr="Sources et lectures complémentaires" /></h3>
          <ul className="mt-3 space-y-2 text-sm text-dim">
            {p.sources.map((source, i) => (
              <li key={source.url ?? `${source.title}-${i}`}>
                {source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg">{source.title}</a> : source.title}
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
