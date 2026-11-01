import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import L from "@/components/L";
import { EventLink, PersonLink, RecordLink } from "@/components/PersonModal";
import { formatDate, formatDateFr, getContent, periodFor, yearOf } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getContent()).events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = (await getContent()).events.find((x) => x.slug === slug);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const e = c.events.find((x) => x.slug === slug);
  if (!e) notFound();
  const period = periodFor(e, c.periods);
  const people = c.people.filter((p) => e.people?.includes(p.slug));
  const records = (e.records ?? []).map((s) => c.records?.find((r) => r.slug === s)).filter(Boolean);
  const related = c.events.filter((x) => e.related?.includes(x.slug) || x.related?.includes(e.slug));
  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <Link href={period ? `/decades/${period.slug}` : "/explore"} className="text-sm text-dim underline underline-offset-4"><L en={period?.label ?? "Explore history"} fr={period?.fr?.label ?? "Explorer l'histoire"} /></Link>
      <header className="max-w-3xl border-b border-rule pb-10 pt-8">
        <p className="wdth-tight text-d-3 tabular-nums">{yearOf(e)}</p>
        <h1 className="mt-3 text-d-2 leading-tight"><L en={e.title} fr={e.fr?.title} /></h1>
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-dim"><L en="Date" fr="Date" /></dt><dd><L en={formatDate(e)} fr={formatDateFr(e)} /></dd></div>
          <div><dt className="text-dim"><L en="Place" fr="Lieu" /></dt><dd>{e.location}</dd></div>
        </dl>
        <p className="read mt-7"><L en={e.summary} fr={e.fr?.summary} /></p>
        {e.context && <><h2 className="mt-8 text-lg"><L en="Background" fr="Contexte" /></h2><p className="read mt-2"><L en={e.context} fr={e.fr?.context} /></p></>}
        {e.causes && <><h2 className="mt-8 text-lg"><L en="Causes" fr="Causes" /></h2><p className="read mt-2"><L en={e.causes} fr={e.fr?.causes} /></p></>}
        {e.consequences && <><h2 className="mt-8 text-lg"><L en="Consequences and significance" fr="Conséquences et portée" /></h2><p className="read mt-2"><L en={e.consequences} fr={e.fr?.consequences} /></p></>}
      </header>
      {people.length > 0 && <section className="mt-10"><h2 className="text-d-4"><L en="Notable figures" fr="Personnalités marquantes" /></h2><ul className="mt-4 flex flex-wrap gap-3">{people.map((p) => <li key={p.slug}><PersonLink slug={p.slug} className="pill">{p.name}</PersonLink></li>)}</ul></section>}
      {records.length > 0 && <section className="mt-10"><h2 className="text-d-4"><L en="Places, documents and related records" fr="Lieux, documents et notices associées" /></h2><ul className="mt-4 flex flex-wrap gap-3">{records.map((r) => r && <li key={r.slug}><RecordLink slug={r.slug} className="pill"><L en={r.title} fr={r.fr?.title} /></RecordLink></li>)}</ul></section>}
      {related.length > 0 && <section className="mt-10"><h2 className="text-d-4"><L en="Connected events" fr="Événements liés" /></h2><ul className="mt-4 space-y-3 border-t border-rule">{related.map((x) => <li key={x.slug} className="border-b border-rule py-3"><EventLink slug={x.slug} className="font-medium"><L en={x.title} fr={x.fr?.title} /></EventLink><p className="mt-1 text-sm text-dim">{formatDate(x)}</p></li>)}</ul></section>}
      {e.sources.length > 0 && <section className="mt-10 max-w-3xl"><h2 className="text-d-4"><L en="Sources" fr="Sources" /></h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-dim">{e.sources.map((s) => <li key={s.title}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{s.title}</a> : s.title}</li>)}</ul></section>}
    </article>
  );
}
