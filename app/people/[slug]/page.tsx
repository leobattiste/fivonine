import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import EventRow from "@/components/EventCard";
import ShareButton from "@/components/ShareButton";
import { getContent, periodFor, sortEvents } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const c = await getContent();
  return c.people.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getContent()).people.find((x) => x.slug === slug);
  return p ? { title: p.name, description: p.bio } : {};
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const p = c.people.find((x) => x.slug === slug);
  if (!p) notFound();
  const evs = sortEvents(c.events.filter((e) => e.people?.includes(p.slug)));
  const periods = [...new Map(evs.map((e) => periodFor(e, c.periods)).filter(Boolean).map((x) => [x!.slug, x!])).values()];

  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <div className="flex justify-end"><ShareButton title={p.name} path={`/people/${p.slug}`} /></div>
      <p className="mt-6 text-dim">{[p.born, p.died].filter(Boolean).join(" to ") || "Dates uncertain"}</p>
      <h1 className="mt-2 max-w-4xl text-d-2 font-extrabold">{p.name}</h1>
      <p className="mt-4 text-lg text-mint">{p.roles.join(", ")}</p>
      <p className="read mt-8">{p.bio}</p>

      {periods.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {periods.map((x) => <Link key={x.slug} href={`/decades/${x.slug}`} className="pill">{x.label}</Link>)}
        </div>
      )}

      <section className="mt-20">
        <h2 className="text-d-3 font-semibold">In the record</h2>
        <div className="mt-8 border-t border-rule">{evs.map((e) => <EventRow key={e.slug} e={e} />)}</div>
      </section>
    </article>
  );
}
