import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import L from "@/components/L";
import { EventLink, PersonLink } from "@/components/PersonModal";
import ShareButton from "@/components/ShareButton";
import { dateNode } from "@/components/dates";
import { SUBJECT_OVERVIEWS } from "@/lib/subject-overviews";
import { eventsInPeriod, getContent, sortEvents } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getContent()).categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getContent()).categories.find((item) => item.slug === slug);
  return category ? { title: category.name, description: SUBJECT_OVERVIEWS[slug]?.en ?? category.name } : {};
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const category = c.categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const subjectEvents = sortEvents(c.events.filter((event) => event.categories.includes(slug)));
  const featured = [...subjectEvents]
    .filter((event) => event.editorial?.verification !== "inventory" && (event.body?.length ?? 0) >= 250)
    .sort((a, b) => Number(Boolean(b.highlight)) - Number(Boolean(a.highlight)) || (b.body?.length ?? 0) - (a.body?.length ?? 0))
    .slice(0, 3);
  const chapters = c.periods
    .map((period) => ({
      period,
      note: period.notes?.[slug],
      events: eventsInPeriod(c, period).filter((event) => event.categories.includes(slug)),
    }))
    .filter(({ note, events }) => Boolean(note) || events.length > 0);

  const peopleSlugs = new Set(subjectEvents.flatMap((event) => event.people ?? []));
  const figures = c.people.filter((person) => peopleSlugs.has(person.slug)).slice(0, 12);
  const others = c.categories.filter((item) => item.slug !== slug);

  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <header>
        <div className="flex items-center justify-between gap-4 text-sm text-dim">
          <Link href="/subjects" className="underline decoration-rule underline-offset-4 hover:text-fg"><L en="All subjects" fr="Tous les thèmes" /></Link>
          <ShareButton title={category.name} path={`/subjects/${slug}`} />
        </div>
        <p className="label mt-10"><L en="Historical subject" fr="Thème historique" /></p>
        <h1 className="mt-3 max-w-5xl text-d-2"><L en={category.name} fr={category.nameFr} /></h1>
        <p className="read mt-6"><L en={SUBJECT_OVERVIEWS[slug]?.en ?? category.name} fr={SUBJECT_OVERVIEWS[slug]?.fr ?? category.nameFr} /></p>
        <p className="mt-5 text-sm tabular-nums text-dim"><L
          en={`${subjectEvents.length} ${subjectEvents.length === 1 ? "entry" : "entries"} across ${chapters.length} historical periods`}
          fr={`${subjectEvents.length} ${subjectEvents.length === 1 ? "notice" : "notices"} sur ${chapters.length} périodes historiques`}
        /></p>
      </header>

      <nav aria-label="On this subject page" className="mt-10 flex flex-wrap gap-2 border-y border-rule py-3 text-sm">
        {featured.length > 0 && <a href="#featured" className="pill"><L en="Featured essays" fr="Essais à découvrir" /></a>}
        <a href="#chronology" className="pill"><L en="Through the decades" fr="À travers les décennies" /></a>
        {figures.length > 0 && <a href="#figures" className="pill"><L en="Notable figures" fr="Personnalités marquantes" /></a>}
      </nav>

      {featured.length > 0 && (
        <section id="featured" aria-labelledby="featured-heading" className="mt-16 scroll-mt-32">
          <p className="label"><L en="Selected reading" fr="Lectures choisies" /></p>
          <h2 id="featured-heading" className="mt-2 text-2xl font-semibold"><L en="Featured historical essays" fr="Essais historiques à découvrir" /></h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {featured.map((event) => (
              <EventLink key={event.slug} slug={event.slug} className="group flex h-full flex-col rounded-2xl border border-rule p-5 hover:border-fg">
                <span className="text-xs tabular-nums text-dim">{dateNode(event)}</span>
                <span className="mt-3 text-lg font-semibold leading-snug group-hover:underline"><L en={event.title} fr={event.fr?.title} /></span>
                <span className="mt-3 line-clamp-4 text-sm leading-relaxed text-dim"><L en={event.summary} fr={event.fr?.summary} /></span>
                <span className="mt-auto pt-6 text-xs text-dim"><L en="Read the essay" fr="Lire l’essai" /></span>
              </EventLink>
            ))}
          </div>
        </section>
      )}

      <section id="chronology" aria-labelledby="chronology-heading" className="mt-20 scroll-mt-32 border-t border-rule pt-10">
        <p className="label"><L en="Chronological archive" fr="Archives chronologiques" /></p>
        <h2 id="chronology-heading" className="mt-2 text-2xl font-semibold"><L en="Through the decades" fr="À travers les décennies" /></h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dim">
          <L en="Browse events connected to this subject, arranged by historical period. Open an entry to read its full account."
             fr="Parcourez les événements liés à ce thème, classés par période historique. Ouvrez une notice pour lire le récit complet." />
        </p>
        {chapters.length > 1 && (
          <nav aria-label="Jump to a historical period" className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap">
            {chapters.map(({ period }) => (
              <a key={period.slug} href={"#period-" + period.slug} className="pill shrink-0 tabular-nums">
                {period.kind === "decade" ? period.start + "s" : <L en={period.label} fr={period.fr?.label} />}
              </a>
            ))}
          </nav>
        )}
        {chapters.length === 0 && (
          <p className="mt-8 text-sm text-dim"><L en="Historical entries are still being researched for this subject." fr="Des notices historiques sont encore en cours de recherche pour ce thème." /></p>
        )}
        <div className="mt-8">
          {chapters.map(({ period, note, events }) => (
            <section key={period.slug} id={"period-" + period.slug} className="scroll-mt-32 grid gap-4 border-t border-rule py-9 lg:grid-cols-[11rem_1fr] lg:gap-12">
              <div>
                <Link href={`/decades/${period.slug}?section=${slug}`} className="text-2xl font-semibold hover:underline">
                  {period.kind === "decade" ? period.start + "s" : <L en={period.label} fr={period.fr?.label} />}
                </Link>
                <p className="mt-2 text-xs text-dim"><L
                  en={`${events.length} ${events.length === 1 ? "entry" : "entries"}`}
                  fr={`${events.length} ${events.length === 1 ? "notice" : "notices"}`}
                /></p>
              </div>
              <div className="min-w-0">
                {note && <p className="mb-5 max-w-[45rem] text-sm leading-relaxed text-dim">{note}</p>}
                {events.length > 0 && (
                  <ul className="divide-y divide-rule border-t border-rule">
                    {events.map((event) => (
                      <li key={event.slug}>
                        <EventLink slug={event.slug} className="group grid grid-cols-[5rem_1fr] gap-4 py-4 sm:grid-cols-[7rem_1fr]">
                          <span className="text-xs tabular-nums text-dim">{dateNode(event)}</span>
                          <span className="min-w-0">
                            <span className="block font-medium leading-snug group-hover:underline"><L en={event.title} fr={event.fr?.title} /></span>
                            <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-dim"><L en={event.summary} fr={event.fr?.summary} /></span>
                          </span>
                        </EventLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>

      {figures.length > 0 && (
        <section id="figures" aria-labelledby="figures-heading" className="mt-16 scroll-mt-32 border-t border-rule pt-10">
          <p className="label"><L en="People in this history" fr="Personnes liées à cette histoire" /></p>
          <h2 id="figures-heading" className="mt-2 text-2xl font-semibold"><L en="Notable figures" fr="Personnalités marquantes" /></h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {figures.map((person) => (
              <li key={person.slug}>
                <PersonLink slug={person.slug} className="block h-full rounded-xl border border-rule p-4 hover:border-fg">
                  <span className="block font-semibold">{person.name}</span>
                  <span className="mt-1 block text-sm text-dim"><L en={person.roles.join(", ")} fr={person.fr?.roles?.join(", ")} /></span>
                </PersonLink>
              </li>
            ))}
          </ul>
          <Link href={"/people?subject=" + slug} className="mt-5 inline-block text-sm font-medium underline underline-offset-4">
            <L en="Browse all related figures" fr="Voir toutes les personnalités associées" />
          </Link>
        </section>
      )}

      <nav aria-label="Other subjects" className="mt-20 border-t border-rule pt-10">
        <h2 className="text-xl font-semibold"><L en="Other subjects" fr="Autres thèmes" /></h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((other) => <Link key={other.slug} href={`/subjects/${other.slug}`} className="pill"><L en={other.short} fr={other.shortFr} /></Link>)}
        </div>
      </nav>
    </article>
  );
}
