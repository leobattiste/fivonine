import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PersonLink } from "@/components/PersonModal";
import DecadeSwitcher from "@/components/DecadeSwitcher";
import DecadeTimeline, { type TLYear } from "@/components/DecadeTimeline";
import ShareButton from "@/components/ShareButton";
import Essay, { EssayBlocks } from "@/components/Essay";
import EssayImage from "@/components/EssayImage";
import { MarkExplored } from "@/components/Progress";
import L from "@/components/L";
import { dateNode } from "@/components/dates";
import { eventsInPeriod, formatDate, getContent, yearOf } from "@/lib/data";
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
  const years: { year: number; title: string; blocks: EssayBlock[] }[] = [];
  for (const b of blocks) {
    if (b.type === "year") years.push({ year: parseInt(b.year, 10), title: b.title, blocks: [] });
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
  const sources = [...new Map(evs.flatMap((e) => e.sources).map((x) => [x.url ?? x.title, x])).values()];
  const images = (p.essay ?? []).filter((b): b is Extract<EssayBlock, { type: "img" }> => b.type === "img");
  const highlights = evs.filter((e) => e.highlight);

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

  // Every year of a decade is listed; eras list the years that have a story or a moment.
  const yearNums = p.kind === "decade"
    ? Array.from({ length: p.end - p.start + 1 }, (_, k) => p.start + k)
    : [...new Set([...chapterYears.map((y) => y.year), ...evs.map(yearOf)])].sort((a, b) => a - b);
  const years: TLYear[] = yearNums.map((yr) => {
    const ch = chapterYears.find((y) => y.year === yr);
    const story = ch?.blocks;
    return {
      year: yr,
      title: ch?.title,
      content: story && story.length ? <EssayBlocks blocks={story} /> : undefined,
      events: evs.filter((e) => yearOf(e) === yr).map((e) => ({
        slug: e.slug, title: e.title, fr: e.fr, label: dateNode(e), location: e.location, dimension: e.dimension,
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
        <MarkExplored slug={p.slug} />

        <header className="pb-12">
          <div className="flex items-center justify-between text-sm text-dim">
            <span><L en={`Haiti, ${range}`} fr={`Haïti, ${rangeFr}`} /></span>
            <ShareButton title={`${p.label} | Fivonine`} path={`/decades/${p.slug}`} text={`${p.label} in Haitian history: ${headline}`} />
          </div>
          <h1 className={`wdth-tight mt-6 ${p.kind === "decade" ? "text-d-1" : "text-d-2"}`}><L en={big} fr={bigFr !== big ? bigFr : undefined} /></h1>
          {kicker && <p className="mt-8 text-lg text-dim"><L en={kicker} fr={kickerFr} /></p>}
          <p className={`${kicker ? "mt-1" : "mt-8"} max-w-3xl text-d-3`}><L en={headline} fr={headlineFr} /></p>
        </header>

        {/* 1. Decade overview */}
        <section aria-labelledby="overview" className="border-t border-rule pt-10">
          <h2 id="overview" className="label">{p.kind === "decade" ? <L en="Decade overview" fr="Aperçu de la décennie" /> : <L en="Overview" fr="Aperçu" />}</h2>
          {intro.length > 0 ? (
            <div className="-mx-0 mt-2"><EssayBlocks blocks={intro} /></div>
          ) : (
            p.overview && <p className="read mt-3"><L en={p.overview} fr={p.fr?.overview} /></p>
          )}
          {p.researchNote && <p className="read mt-6 border-l-2 border-fg pl-4 !text-[1rem] text-dim">{p.researchNote}</p>}
          {highlights.length > 0 && (
            <div className="mx-auto mt-10 w-full max-w-[45rem]">
              <p className="text-sm font-medium"><L en="Highlights" fr="Moments clés" /></p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {highlights.map((e) => (
                  <li key={e.slug}>
                    <a href={`#y${yearOf(e)}`} className="block h-full rounded-2xl border border-rule p-4 hover:border-fg">
                      <span className="block text-sm tabular-nums text-dim">{dateNode(e)}</span>
                      <span className="mt-1 block font-semibold leading-snug"><L en={e.title} fr={e.fr?.title} /></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* A thematic chapter (periods before written chronology) */}
        {thematic && p.essay && (
          <section className="mt-16 border-t border-rule pt-12">
            <h2 className="mb-10 text-d-3"><L en="The chapter" fr="Le chapitre" /></h2>
            <Essay blocks={p.essay} title={p.label} />
          </section>
        )}

        {/* 2–3. Explore the decade, browse by year, and the year-by-year timeline */}
        {(years.length > 0) && (
          <section className="mt-16 border-t border-rule pt-12">
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

        {/* 4. People of the decade */}
        {people.length > 0 && (
          <section aria-labelledby="people" className="mt-20 border-t border-rule pt-10">
            <h2 id="people" className="text-d-4"><L en={`People who shaped ${label}`} fr={`Les personnes qui ont façonné ${labelFr}`} /></h2>
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

        {/* 5. Historical archives */}
        {(images.length > 0 || (p.media?.length ?? 0) > 0 || sources.length > 0 || (p.biblio?.length ?? 0) > 0) && (
          <section aria-labelledby="archives" className="mt-20 border-t border-rule pt-10">
            <h2 id="archives" className="text-d-4"><L en="Historical archives" fr="Archives historiques" /></h2>
            {images.length > 0 && (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img) => <li key={img.src}><EssayImage {...img} compact /></li>)}
              </ul>
            )}
            {p.media && p.media.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-medium"><L en="Digitized collections and archival media" fr="Collections numérisées et archives audiovisuelles" /></p>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {p.media.map((item) => (
                    <li key={item.url + item.title} className="overflow-hidden rounded-2xl border border-rule">
                      {item.image && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.alt ?? item.title} loading="lazy" className="aspect-[16/10] w-full bg-raise object-cover" />
                        </a>
                      )}
                      <div className="p-4">
                        <a href={item.url} target="_blank" rel="noreferrer" className="font-semibold underline decoration-rule underline-offset-4 hover:decoration-fg">{item.title}</a>
                        <p className="mt-2 text-sm leading-relaxed text-dim">{item.description}</p>
                        {item.credit && <p className="mt-3 text-xs leading-relaxed text-dim">{item.credit}{item.license ? " · " + item.license : ""}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(sources.length > 0 || (p.biblio?.length ?? 0) > 0) && (
              <div className="mx-auto mt-8 w-full max-w-[45rem]">
                {sources.length > 0 && <p className="text-sm font-medium"><L en="Documents and sources" fr="Documents et sources" /></p>}
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[0.95rem] text-dim marker:text-dim/60">
                  {sources.map((x) => (
                    <li key={x.title + (x.url ?? "")}>
                      {x.url ? <a href={x.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-4 hover:text-fg hover:decoration-fg">{x.title}</a> : x.title}
                    </li>
                  ))}
                </ol>
                {p.biblio && p.biblio.length > 0 && (
                  <>
                    <p className="mt-8 text-sm font-medium"><L en="Further reading" fr="Pour aller plus loin" /></p>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem] text-dim marker:text-dim/60">
                      {p.biblio.map((b) => <li key={b}>{b}</li>)}
                    </ul>
                  </>
                )}
                <p className="mt-4 text-sm text-dim">
                  <L en={`Have a photograph, document or recording from ${label}?`} fr={`Vous avez une photographie, un document ou un enregistrement de ${labelFr} ?`} />{" "}
                  <Link href={`/contribute?type=source&page=${encodeURIComponent(`/decades/${p.slug}`)}`} className="underline underline-offset-4 hover:text-fg"><L en="Share it with us" fr="Partagez-le avec nous" /></Link>.
                </p>
              </div>
            )}
          </section>
        )}

        {/* 6. Legacy and connections */}
        {(p.notes?.next || p.legacy) && (
          <section aria-labelledby="legacy" className="mt-20 rounded-[2rem] bg-raise p-8 sm:p-12">
            <h2 id="legacy" className="label"><L en="Legacy and connections" fr="Héritage et liens" /></h2>
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
