import ArchiveMediaGallery from "@/components/ArchiveMediaGallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PersonLink } from "@/components/PersonModal";
import DecadeSwitcher from "@/components/DecadeSwitcher";
import DecadeTimeline, { type TLYear } from "@/components/DecadeTimeline";
import ShareButton from "@/components/ShareButton";
import Essay, { EssayBlocks } from "@/components/Essay";
import L from "@/components/L";
import { dateNode } from "@/components/dates";
import { eventsInPeriod, getContent, yearOf } from "@/lib/data";
import { SECTIONS } from "@/lib/sections";
import type { EssayBlock } from "@/lib/types";

export const revalidate = 3600;

export async function generateStaticParams() {
  const c = await getContent();
  return c.periods.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getContent();
  const p = c.periods.find((x) => x.slug === slug);
  if (!p) return {};
  const og = `/api/og?kind=period&slug=${p.slug}`;
  return { title: p.label, description: p.overview || p.title, openGraph: { images: [og] }, twitter: { images: [og] } };
}

/** Splits a chapter into its introduction and its year sections. */
function splitChapter(blocks: EssayBlock[] = []) {
  const intro: EssayBlock[] = [];
  const years: { year: number; title: string; titleFr?: string; blocks: EssayBlock[] }[] = [];
  for (const b of blocks) {
    if (b.type === "year") years.push({ year: parseInt(b.year, 10), title: b.title, titleFr: b.fr?.title, blocks: [] });
    else if (years.length) years[years.length - 1].blocks.push(b);
    else intro.push(b);
  }
  return { intro, years };
}

export default async function PeriodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const i = c.periods.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = c.periods[i];
  const prev = c.periods[i - 1];
  const next = c.periods[i + 1];
  const evs = eventsInPeriod(c, p);
  const people = c.people.filter((person) => evs.some((e) => e.people?.includes(person.slug)));

  const range = p.kind === "decade" ? `${p.start} to ${p.end}` : p.start < 0 ? `Before ${p.end + 1}` : `${p.start} to ${p.end}`;
  const rangeFr = p.kind === "decade" ? `${p.start} à ${p.end}` : p.start < 0 ? `Avant ${p.end + 1}` : `${p.start} à ${p.end}`;
  const split = (t: string) => (t.includes(":") ? t.split(/:\s(.+)/) : ["", t]);
  const [kicker, headline] = split(p.title);
  const [kickerFr, headlineFr] = p.fr?.title ? split(p.fr.title.replace(/\s:\s/, ": ")) : [undefined, undefined];
  const big = p.kind === "decade" ? `${p.start}s` : p.label;
  const bigFr = p.kind === "decade" ? `${p.start}` : p.fr?.label ?? p.label;
  const label = p.kind === "decade" ? `the ${p.start}s` : p.label;
  const labelFr = p.kind === "decade" ? `les années ${p.start}` : p.fr?.label ?? p.label;

  const { intro, years: chapterYears } = splitChapter(p.essay);
  const thematic = (p.essay?.length ?? 0) > 0 && chapterYears.length === 0; // e.g. Indigenous Ayiti
  const historicalEssays = chapterYears.filter((chapter) => chapter.blocks.some((block) => block.type !== "biblio"));

  // Every year of a decade is listed; eras list the years that have a story or a moment.
  const yearNums = p.kind === "decade"
    ? Array.from({ length: (p.slug === "2020s" ? Math.min(p.end, 2026) : p.end) - p.start + 1 }, (_, k) => p.start + k)
    : [...new Set([...chapterYears.map((y) => y.year), ...evs.map(yearOf)])].sort((a, b) => a - b);
  const years: TLYear[] = yearNums.map((yr) => {
    return {
      year: yr,
      events: evs.filter((e) => yearOf(e) === yr).map((e) => ({
        slug: e.slug, title: e.title, fr: e.fr, label: dateNode(e), date: e.date, location: e.location, dimension: e.dimension,
        categories: e.categories, status: e.status, highlight: e.highlight,
      })),
    };
  });

  const switcher = c.periods.map((x) => ({
    slug: x.slug,
    short: x.kind === "decade" ? `${x.start}s` : x.label,
    empty: !x.overview && eventsInPeriod(c, x).length === 0,
  }));

  return (
    <>
      <DecadeSwitcher items={switcher} current={p.slug} />
      <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">

        <header className="pb-12">
          <div className="flex items-center justify-between text-sm text-dim">
            <span><L en={`Haiti, ${range}`} fr={`Haïti, ${rangeFr}`} /></span>
            <ShareButton title={`${p.label} | Fivonine`} path={`/decades/${p.slug}`} text={`${p.label} in Haitian history: ${headline}`} />
          </div>
          <h1 className={`wdth-tight mt-6 ${p.kind === "decade" ? "text-d-1" : "text-d-2"}`}><L en={big} fr={bigFr !== big ? bigFr : undefined} /></h1>
          {kicker && <p className="mt-8 text-lg text-dim"><L en={kicker} fr={kickerFr} /></p>}
          <p className={`${kicker ? "mt-1" : "mt-8"} max-w-3xl text-d-3`}><L en={headline} fr={headlineFr} /></p>
        </header>


        <nav aria-label="In this period" className="sticky top-[60px] z-20 -mx-5 flex gap-2 overflow-x-auto border-y border-rule bg-base/95 px-5 py-3 text-sm backdrop-blur-sm sm:mx-0 sm:flex-wrap sm:px-0">
          {Boolean(p.attachments?.length) && <a href="#archive" className="pill shrink-0"><L en="Images & documents" fr="Images et documents" /></a>}
          <a href="#overview" className="pill shrink-0"><L en="Overview" fr="Aperçu" /></a>
          {years.length > 0 && <a href="#timeline" className="pill shrink-0"><L en="Timeline" fr="Chronologie" /></a>}
          {historicalEssays.length > 0 && <a href="#essays" className="pill shrink-0"><L en="Historical essays" fr="Essais historiques" /></a>}
          {people.length > 0 && <a href="#people" className="pill shrink-0"><L en="Notable figures" fr="Personnalités marquantes" /></a>}
          {(p.notes?.next || p.legacy) && <a href="#legacy" className="pill shrink-0"><L en="Legacy" fr="Héritage" /></a>}
        </nav>

        <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-36 pt-12 sm:pt-16">
          <div className="border-b border-rule pb-4">
            <p className="label"><L en="Historical context" fr="Contexte historique" /></p>
            <h2 id="overview-heading" className="mt-2 text-2xl font-semibold"><L en="Overview" fr="Aperçu" /></h2>
          </div>
          <div className="mt-7">
            {thematic && p.essay
              ? <Essay blocks={p.essay} title={p.label} />
              : intro.length > 0
                ? <EssayBlocks blocks={intro} />
                : <p className="read"><L en={p.overview} fr={p.fr?.overview} /></p>}
          </div>
          {p.researchNote && (
            <p className="mx-auto mt-8 max-w-[45rem] border-l-2 border-rule pl-4 text-sm leading-relaxed text-dim">{p.researchNote}</p>
          )}
        </section>

        {years.length > 0 && (
          <section id="timeline" aria-labelledby="timeline-heading" className="scroll-mt-36 mt-20 border-t border-rule pt-10">
            <p className="label"><L en="Chronological record" fr="Repères chronologiques" /></p>
            <h2 id="timeline-heading" className="mb-8 mt-2 text-2xl font-semibold"><L en="Timeline" fr="Chronologie" /></h2>
            <DecadeTimeline
              sections={SECTIONS}
              years={years}
              notes={p.notes}
              label={label}
              labelFr={labelFr}
              showEmptyYears={p.kind === "decade"}
            />
          </section>
        )}

        {historicalEssays.length > 0 && (
          <section id="essays" aria-labelledby="essays-heading" className="scroll-mt-36 mt-20 border-t border-rule pt-10">
            <p className="label"><L en="Extended reading" fr="Pour approfondir" /></p>
            <h2 id="essays-heading" className="mt-2 text-2xl font-semibold"><L en="Historical essays" fr="Essais historiques" /></h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dim">
              <L en="Read longer accounts organized by year. The timeline above offers a concise chronological index."
                 fr="Lisez les récits détaillés par année. La chronologie ci-dessus offre un index plus concis des événements." />
            </p>
            <nav aria-label="Jump to historical essay" className="mt-6 flex flex-wrap gap-2">
              {historicalEssays.map((chapter) => (
                <a key={chapter.year} href={"#essay-year-" + chapter.year} className="pill tabular-nums">{chapter.year}</a>
              ))}
            </nav>
            <div className="mt-10">
              {historicalEssays.map((chapter) => (
                <section key={chapter.year} id={"essay-year-" + chapter.year} className="scroll-mt-36 border-t border-rule py-10 first:border-0 first:pt-0">
                  <div className="mx-auto max-w-[45rem]">
                    <p className="text-sm tabular-nums text-dim">{chapter.year}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug"><L en={chapter.title} fr={chapter.titleFr} /></h3>
                  </div>
                  <div className="mt-4"><EssayBlocks blocks={chapter.blocks} /></div>
                </section>
              ))}
            </div>
          </section>
        )}

        {Boolean(p.attachments?.length) && <section id="archive" aria-labelledby="archive-heading" className="mt-20 scroll-mt-36 border-t border-rule pt-10">
          <h2 id="archive-heading" className="text-2xl font-semibold"><L en="Images & documents" fr="Images et documents" /></h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dim"><L en="Photographs, original documents and archival records connected to this decade. Captions distinguish the date of an image from the event it illustrates." fr="Photographies, documents originaux et notices d’archives liés à cette décennie. Les légendes distinguent la date d’une image de l’événement qu’elle illustre." /></p>
          <ArchiveMediaGallery items={p.attachments} heading={false} />
        </section>}

        {/* 4. People of the decade */}
        {people.length > 0 && (
          <section id="people" aria-labelledby="people-heading" className="mt-20 scroll-mt-36 border-t border-rule pt-10">
            <h2 id="people-heading" className="text-2xl font-semibold"><L en={`People who shaped ${label}`} fr={`Les personnes qui ont façonné ${labelFr}`} /></h2>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((x) => (
                <li key={x.slug}>
                  <PersonLink slug={x.slug} className="block h-full rounded-2xl border border-rule p-4 hover:border-fg">
                    <span className="block font-semibold">{x.name}</span>
                    <span className="block text-sm text-dim"><L en={x.roles.join(", ")} fr={x.fr?.roles?.join(", ")} /></span>
                  </PersonLink>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Legacy and connections */}
        {(p.notes?.next || p.legacy) && (
          <section id="legacy" aria-labelledby="legacy-heading" className="mt-20 scroll-mt-36 border-t border-rule pt-10">
            <h2 id="legacy-heading" className="text-2xl font-semibold"><L en="Legacy and connections" fr="Héritage et liens" /></h2>
            <p className="mt-4 max-w-3xl text-[1.2rem] leading-snug sm:text-[1.4rem]"><L en={p.notes?.next ?? p.legacy} fr={p.fr?.legacy} /></p>
            {next && <Link href={`/decades/${next.slug}`} className="btn btn-solid mt-6"><L en="Continue to" fr="Continuer vers" /> {next.kind === "decade" ? <L en={`the ${next.start}s`} fr={`les années ${next.start}`} /> : <L en={next.label} fr={next.fr?.label} />}</Link>}
          </section>
        )}

        <nav className="mt-16 grid gap-px overflow-hidden rounded-[2rem] bg-rule sm:grid-cols-2">
          {prev ? (
            <Link href={`/decades/${prev.slug}`} className="group bg-base p-8 hover:bg-raise">
              <span className="label"><L en="Earlier" fr="Avant" /></span>
              <span className="wdth-tight mt-2 block text-3xl group-hover:text-dim">{prev.kind === "decade" ? `${prev.start}s` : <L en={prev.label} fr={prev.fr?.label} />}</span>
            </Link>
          ) : <span className="bg-base" />}
          {next ? (
            <Link href={`/decades/${next.slug}`} className="group bg-base p-8 text-right hover:bg-raise">
              <span className="label"><L en="Later" fr="Après" /></span>
              <span className="wdth-tight mt-2 block text-3xl group-hover:text-dim">{next.kind === "decade" ? `${next.start}s` : <L en={next.label} fr={next.fr?.label} />}</span>
            </Link>
          ) : <span className="bg-base" />}
        </nav>
        <p className="mt-6 hidden text-center text-sm text-dim sm:block"><L en="Tip: use the ← and → keys to move between periods." fr="Astuce : utilisez les touches ← et → pour passer d’une période à l’autre." /></p>
      </article>
    </>
  );
}

