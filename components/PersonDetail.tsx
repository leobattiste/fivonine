import ArchiveMediaGallery from "@/components/ArchiveMediaGallery";
import L from "@/components/L";
import SubjectLinks from "@/components/SubjectLinks";
import { EventLink, RecordLink } from "@/components/PersonModal";
import { dateNode } from "@/components/dates";
import Link from "next/link";
import ShareButton from "@/components/ShareButton";
import { periodFor, sortEvents, yearOf } from "@/lib/data";
import type { Content, Person } from "@/lib/types";

/** Preserve the original biography while making longer, unbroken texts comfortable to read. */
function biographyParagraphs(text: string) {
  const explicit = text.trim().split(/\n\s*\n/).filter(Boolean);
  if (explicit.length > 1 || text.length < 500) return explicit;
  const sentences = text.trim().split(/(?<=[.!?])\s+(?=[A-ZÀÂÉÈÊËÎÏÔÙÛÜ])/);
  const result: string[] = [];
  let paragraph = "";
  for (const sentence of sentences) {
    paragraph = paragraph ? paragraph + " " + sentence : sentence;
    if (paragraph.length >= 330) { result.push(paragraph); paragraph = ""; }
  }
  if (paragraph) result.push(paragraph);
  return result;
}

export default function PersonDetail({ p, c, inModal = false }: { p: Person; c: Content; inModal?: boolean }) {
  const events = sortEvents(c.events.filter((event) => event.people?.includes(p.slug)));
  const subjects = [...new Set(events.flatMap((event) => event.categories))];
  const periods = [...new Map(events.map((event) => periodFor(event, c.periods)).filter(Boolean).map((period) => [period!.slug, period!])).values()];
  const records = (c.records ?? []).filter((record) =>
    (record.eventSlugs ?? []).some((slug) => events.some((event) => event.slug === slug))
  );
  const selected = events.filter((event) => event.highlight && event.summary.length > 25).slice(0, 3);
  const H = inModal ? "h2" : "h1";
  const bioEn = biographyParagraphs(p.bio);
  const bioFr = p.fr?.bio ? biographyParagraphs(p.fr.bio) : undefined;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm text-dim">
        {!inModal && <Link href="/people" className="underline decoration-rule underline-offset-4 hover:text-fg"><L en="All notable figures" fr="Toutes les personnalités" /></Link>}
        {!inModal && <ShareButton title={p.name} path={`/people/${p.slug}`} />}
      </div>
      <header className={inModal ? "mt-5" : "mt-10"}>
        <p className="label"><L en="Notable figure" fr="Personnalité marquante" /></p>
        <H className={`mt-3 max-w-5xl ${inModal ? "text-d-3" : "text-d-2"}`}>{p.name}</H>
        <p className="mt-4 text-sm tabular-nums text-dim"><L
          en={[p.born, p.died].filter(Boolean).join("–") || "Dates uncertain"}
          fr={[p.born, p.died].filter(Boolean).join("–") || "Dates incertaines"}
        /></p>
        <p className="mt-3 max-w-3xl text-lg leading-relaxed text-dim"><L en={p.roles.join(", ")} fr={p.fr?.roles?.join(", ")} /></p>
        {subjects.length > 0 && <SubjectLinks slugs={subjects} className="mt-6" />}
      </header>

      <ArchiveMediaGallery items={p.attachments} />
      <nav aria-label="In this biography" className="mt-10 flex flex-wrap gap-2 border-y border-rule py-3">
        <a href="#biography" className="pill"><L en="Biography" fr="Biographie" /></a>
        {selected.length > 0 && <a href="#selected-moments" className="pill"><L en="Key moments" fr="Moments clés" /></a>}
        {events.length > 0 && <a href="#figure-history" className="pill"><L en="Historical record" fr="Repères historiques" /></a>}
        {records.length > 0 && <a href="#figure-records" className="pill"><L en="Related records" fr="Notices associées" /></a>}
      </nav>

      <section id="biography" aria-labelledby="biography-heading" className="scroll-mt-32 mt-12">
        <p className="label"><L en="Life and work" fr="Vie et œuvre" /></p>
        <h2 id="biography-heading" className="mt-2 text-2xl font-semibold"><L en="Biography" fr="Biographie" /></h2>
        <div className="mx-auto mt-7 max-w-[45rem] space-y-5">
          <L
            en={<>{bioEn.map((paragraph, i) => <p key={i} className="read !max-w-none">{paragraph}</p>)}</>}
            fr={bioFr ? <>{bioFr.map((paragraph, i) => <p key={i} className="read !max-w-none">{paragraph}</p>)}</> : undefined}
          />
        </div>
      </section>

      {selected.length > 0 && (
        <section id="selected-moments" aria-labelledby="selected-heading" className="scroll-mt-32 mt-16 border-t border-rule pt-10">
          <p className="label"><L en="Selected from the archive" fr="Sélection des archives" /></p>
          <h2 id="selected-heading" className="mt-2 text-2xl font-semibold"><L en="Key historical moments" fr="Moments historiques clés" /></h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {selected.map((event) => (
              <EventLink slug={event.slug} key={event.slug} className="group flex h-full flex-col rounded-2xl border border-rule p-5 hover:border-fg">
                <span className="text-xs tabular-nums text-dim">{dateNode(event)}</span>
                <span className="mt-3 text-lg font-semibold leading-snug group-hover:underline"><L en={event.title} fr={event.fr?.title} /></span>
                <span className="mt-3 line-clamp-4 text-sm leading-relaxed text-dim"><L en={event.summary} fr={event.fr?.summary} /></span>
              </EventLink>
            ))}
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section id="figure-history" aria-labelledby="figure-history-heading" className="scroll-mt-32 mt-16 border-t border-rule pt-10">
          <p className="label"><L en="Timeline of connected events" fr="Chronologie des événements associés" /></p>
          <h2 id="figure-history-heading" className="mt-2 text-2xl font-semibold"><L en="In the historical record" fr="Dans les archives historiques" /></h2>
          <ul className="mt-6 divide-y divide-rule border-t border-rule">
            {events.map((event) => (
              <li key={event.slug}>
                <EventLink slug={event.slug} className="group grid gap-4 py-4 sm:grid-cols-[7rem_1fr]">
                  <span className="text-sm tabular-nums text-dim">{yearOf(event)}</span>
                  <span>
                    <span className="block font-medium leading-snug group-hover:underline"><L en={event.title} fr={event.fr?.title} /></span>
                    <span className="mt-1 block text-sm text-dim">{dateNode(event)} · {event.location}</span>
                  </span>
                </EventLink>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(records.length > 0 || periods.length > 0) && (
        <section id="figure-records" aria-labelledby="figure-records-heading" className="scroll-mt-32 mt-16 border-t border-rule pt-10">
          <p className="label"><L en="Further connections" fr="Pour aller plus loin" /></p>
          <h2 id="figure-records-heading" className="mt-2 text-2xl font-semibold"><L en="Related history" fr="Histoire associée" /></h2>
          {records.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {records.map((record) => <li key={record.slug}>
                <RecordLink slug={record.slug} className="pill"><L en={record.title} fr={record.fr?.title} /></RecordLink>
              </li>)}
            </ul>
          )}
          {periods.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold"><L en="Historical periods" fr="Périodes historiques" /></h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {periods.map((period) => <Link key={period.slug} href={`/decades/${period.slug}`} className="pill"><L en={period.label} fr={period.fr?.label} /></Link>)}
              </div>
            </div>
          )}
        </section>
      )}

      {inModal && <div className="mt-10"><ShareButton title={p.name} path={`/people/${p.slug}`} /></div>}
    </div>
  );
}

