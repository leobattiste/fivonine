import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import L from "@/components/L";
import { EventLink, PersonLink, RecordLink } from "@/components/PersonModal";
import { getContent } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  return ((await getContent()).records ?? []).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = (await getContent()).records?.find((r) => r.slug === slug);
  return record ? { title: record.title, description: record.summary } : {};
}

export default async function RecordPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const record = c.records?.find((r) => r.slug === slug);
  if (!record) notFound();
  const events = c.events.filter((e) => (record.eventSlugs ?? []).includes(e.slug));
  const related = (record.related ?? []).map((s) => c.records?.find((r) => r.slug === s)).filter(Boolean);
  const people = c.people.filter((p) => events.some((e) => e.people?.includes(p.slug)));
  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <Link href="/explore" className="text-sm text-dim underline underline-offset-4"><L en="Explore history" fr="Explorer l'histoire" /></Link>
      <header className="max-w-3xl border-b border-rule pb-10 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dim"><L en={record.type} fr={record.type === "place" ? "Lieu" : record.type === "document" ? "Document" : record.type === "institution" ? "Institution" : record.type === "organization" ? "Organisation" : record.type === "object" ? "Objet" : record.type === "work" ? "Œuvre" : "Autre"} /></p>
        <h1 className="mt-3 text-d-2"><L en={record.title} fr={record.fr?.title} /></h1>
        {(record.dates || record.location) && <p className="mt-4 text-sm text-dim"><L en={record.dates ?? ""} fr={record.fr?.dates} />{record.dates && record.location ? " · " : ""}<L en={record.location ?? ""} fr={record.fr?.location} /></p>}
        <p className="read mt-7"><L en={record.summary} fr={record.fr?.summary} /></p>
        {record.body && <p className="read mt-5"><L en={record.body} fr={record.fr?.body} /></p>}
      </header>
      {people.length > 0 && <section className="mt-10"><h2 className="text-d-4"><L en="Notable figures" fr="Personnalités marquantes" /></h2><ul className="mt-4 flex flex-wrap gap-3">{people.map((p) => <li key={p.slug}><PersonLink slug={p.slug} className="pill">{p.name}</PersonLink></li>)}</ul></section>}
      {events.length > 0 && <section className="mt-10"><h2 className="text-d-4"><L en="Connected events" fr="Événements liés" /></h2><ul className="mt-4 space-y-3 border-t border-rule">{events.map((e) => <li key={e.slug} className="border-b border-rule py-3"><EventLink slug={e.slug} className="font-medium"><L en={e.title} fr={e.fr?.title} /></EventLink><p className="mt-1 text-sm text-dim">{e.date}</p></li>)}</ul></section>}
      {related.length > 0 && <section className="mt-10"><h2 className="text-d-4"><L en="Related records" fr="Notices associées" /></h2><ul className="mt-4 flex flex-wrap gap-3">{related.map((r) => r && <li key={r.slug}><RecordLink slug={r.slug} className="pill"><L en={r.title} fr={r.fr?.title} /></RecordLink></li>)}</ul></section>}
      {record.sources.length > 0 && <section className="mt-10 max-w-3xl"><h2 className="text-d-4"><L en="Sources" fr="Sources" /></h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-dim">{record.sources.map((s) => <li key={s.title}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{s.title}</a> : s.title}</li>)}</ul></section>}
    </article>
  );
}
