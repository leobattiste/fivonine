import Link from "next/link";
import L from "@/components/L";
import SubjectLinks from "@/components/SubjectLinks";
import { EventLink } from "@/components/PersonModal";
import { SUBJECT_OVERVIEWS } from "@/lib/subject-overviews";
import { dateNode } from "@/components/dates";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButton from "@/components/ShareButton";
import { eventsInPeriod, formatDate, getContent, yearOf } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getContent()).categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getContent()).categories.find((c) => c.slug === slug);
  return cat ? { title: cat.name, description: `${cat.name} in Haitian history, decade by decade.` } : {};
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const cat = c.categories.find((x) => x.slug === slug);
  if (!cat) notFound();
  const i = c.categories.indexOf(cat);
  const others = [...c.categories.slice(i + 1), ...c.categories.slice(0, i)];

  const chapters = c.periods
    .map((p) => ({ p, note: p.notes?.[slug], evs: eventsInPeriod(c, p).filter((e) => e.categories.includes(slug)) }))
    .filter((x) => x.note || x.evs.length);

  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <div className="flex items-center justify-between text-sm text-dim">
        <Link href="/subjects" className="hover:text-fg"><L en="All subjects" fr="Tous les thèmes" /></Link>
        <ShareButton title={`${cat.name} in Haitian history`} path={`/subjects/${slug}`} />
      </div>
      <h1 className="mt-8 max-w-4xl text-d-2"><L en={cat.name} fr={cat.nameFr} /></h1>
      <p className="read mt-4"><L en={SUBJECT_OVERVIEWS[slug]?.en ?? cat.name} fr={SUBJECT_OVERVIEWS[slug]?.fr ?? cat.nameFr} /></p>
      <p className="mt-4 text-sm text-dim">
        {chapters.length
          ? <L en={`Browse ${chapters.length} historical ${chapters.length === 1 ? "period" : "periods"} containing entries or research notes.`} fr={`Parcourez ${chapters.length} ${chapters.length === 1 ? "période historique" : "périodes historiques"} contenant des notices ou des notes de recherche.`} />
          : <L en="No entries recorded for this subject yet." fr="Aucune entrée enregistrée pour ce thème pour l’instant." />}
      </p>
      {chapters.length > 1 && (
        <nav aria-label="Jump to historical period" className="mt-8 flex flex-wrap gap-2">
          {chapters.map(({ p }) => (
            <a key={p.slug} href={`#period-${p.slug}`} className="pill">
              {p.kind === "decade" ? `${p.start}s` : <L en={p.label} fr={p.fr?.label} />}
            </a>
          ))}
        </nav>
      )}

      <div className="mt-12">
        {chapters.map(({ p, note, evs }) => (
          <section key={p.slug} id={`period-${p.slug}`} className="scroll-mt-28 grid gap-4 border-t border-rule py-10 lg:grid-cols-[14rem_1fr] lg:gap-10">
            <div>
              <Link href={`/decades/${p.slug}?section=${slug}`} className="wdth-tight text-3xl hover:text-dim">
                {p.kind === "decade" ? `${p.start}s` : <L en={p.label} fr={p.fr?.label} />}
              </Link>
            </div>
            <div className="min-w-0">
              {note && <p className="read !max-w-none">{note}</p>}
              {evs.length > 0 && (
                <ul className={`${note ? "mt-6" : ""} border-t border-rule`}>
                  {evs.map((e) => (
                    <li key={e.slug} className="border-b border-rule">
                      <EventLink slug={e.slug} className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-4 py-3">
                        <span className="wdth-tight whitespace-nowrap text-base tabular-nums">
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-[0.25em] rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                          {yearOf(e)}
                        </span>
                        <span>
                          <span className="block font-medium group-hover:text-dim"><L en={e.title} fr={e.fr?.title} /></span>
                          <span className="block text-sm text-dim">
                            {dateNode(e)}, {e.location}
                          </span>
                        </span>
                      </EventLink>
                      <SubjectLinks slugs={e.categories} compact className="mb-3 ml-[5.25rem]" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 border-t border-rule pt-10">
        <h2 className="text-lg"><L en="Other subjects" fr="Autres thèmes" /></h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((o) => <Link key={o.slug} href={`/subjects/${o.slug}`} className="pill"><L en={o.name} fr={o.nameFr} /></Link>)}
        </div>
      </section>
    </div>
  );
}
