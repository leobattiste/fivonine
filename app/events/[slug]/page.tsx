import Link from "next/link";
import L from "@/components/L";
import { dateNode } from "@/components/dates";
import { PersonLink } from "@/components/PersonModal";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EventRow from "@/components/EventCard";
import ShareButton from "@/components/ShareButton";
import NewsletterForm from "@/components/NewsletterForm";
import { ViewPing } from "@/components/Progress";
import { connectedEvents, formatDate, getContent, periodFor, yearOf } from "@/lib/data";
import { DIMENSIONS, SITE } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const c = await getContent();
  return c.events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getContent();
  const e = c.events.find((x) => x.slug === slug);
  if (!e) return {};
  const og = `/api/og?kind=event&slug=${e.slug}`;
  return { title: e.title, description: e.summary, openGraph: { type: "article", images: [og] }, twitter: { images: [og] } };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const e = c.events.find((x) => x.slug === slug);
  if (!e) notFound();
  const period = periodFor(e, c.periods);
  const people = c.people.filter((p) => e.people?.includes(p.slug));
  const cats = c.categories.filter((x) => e.categories.includes(x.slug));
  const linked = connectedEvents(c, e);
  const color = DIMENSIONS[e.dimension].color;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    location: { "@type": "Place", name: e.location },
    description: e.summary,
    url: `${SITE.url}/events/${e.slug}`,
  };

  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <ViewPing slug={e.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="flex items-center justify-between text-sm text-dim">
        {period ? <Link href={`/decades/${period.slug}`} className="hover:text-fg"><L en={`Back to ${period.label.replace(/^The /, "the ")}`} fr={`Retour à ${period.fr?.label ?? period.label}`} /></Link> : <span />}
        <ShareButton title={e.title} path={`/events/${e.slug}`} text={`${formatDate(e)}: ${e.title}`} />
      </div>

      <header className="mt-10">
        <p className="wdth-tight text-d-2 tabular-nums">{yearOf(e)}</p>
        <h1 className="mt-4 max-w-4xl text-d-3"><L en={e.title} fr={e.fr?.title} /></h1>
        <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-3">
          <div><dt className="text-dim"><L en="Date" fr="Date" /></dt><dd className="mt-0.5">{dateNode(e)}</dd></div>
          <div><dt className="text-dim"><L en="Place" fr="Lieu" /></dt><dd className="mt-0.5">{e.location}</dd></div>
          <div><dt className="text-dim"><L en="Dimension" fr="Dimension" /></dt><dd className="mt-0.5 flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: color }} /><L en={DIMENSIONS[e.dimension].label} fr={DIMENSIONS[e.dimension].labelFr} /></dd></div>
        </dl>
      </header>

      <div className="mt-14 grid gap-14 border-t border-rule pt-12 lg:grid-cols-[1fr_20rem]">
        <div className="read">
          <p className="!text-[1.2rem] !leading-relaxed text-fg"><L en={e.summary} fr={e.fr?.summary} /></p>
          {e.context && (<><h2 className="mt-10 text-lg text-fg"><L en="Background" fr="Contexte" /></h2><p className="mt-2"><L en={e.context} fr={e.fr?.context} /></p></>)}
          {e.causes && (<><h2 className="mt-10 text-lg text-fg"><L en="Causes" fr="Causes" /></h2><p className="mt-2"><L en={e.causes} fr={e.fr?.causes} /></p></>)}
          {e.consequences && (<><h2 className="mt-10 text-lg text-fg"><L en="What it changed" fr="Ce que cela a changé" /></h2><p className="mt-2"><L en={e.consequences} fr={e.fr?.consequences} /></p></>)}

          <p className="mt-6 text-sm text-dim">
            <L en="See something wrong?" fr="Une erreur ?" /> <Link className="underline underline-offset-4 hover:text-fg" href={`/contribute?type=correction&page=${encodeURIComponent(`/events/${e.slug}`)}`}><L en="Send a correction" fr="Envoyer une correction" /></Link>.
          </p>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          {e.countries && e.countries.length > 0 && (
            <div>
              <p className="label"><L en="Countries involved" fr="Pays concernés" /></p>
              <div className="mt-3 flex flex-wrap gap-2">
                {e.countries.map((x) => <Link key={x} href={`/explore?country=${encodeURIComponent(x)}`} className="pill">{x}</Link>)}
              </div>
            </div>
          )}
          <div>
            <p className="label"><L en="Subjects" fr="Thèmes" /></p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cats.map((x) => <Link key={x.slug} href={`/subjects/${x.slug}`} className="pill"><L en={x.short} fr={x.shortFr} /></Link>)}
            </div>
          </div>
          {people.length > 0 && (
            <div>
              <p className="label"><L en="People" fr="Personnes" /></p>
              <ul className="mt-3 space-y-2">
                {people.map((p) => <li key={p.slug}><PersonLink slug={p.slug} className="font-medium hover:text-dim">{p.name}</PersonLink></li>)}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {linked.length > 0 && (
        <section className="mt-24">
          <h2 className="text-d-3"><L en="Connected moments" fr="Moments liés" /></h2>
          <p className="mt-3 max-w-xl text-lg text-dim"><L en="What led here, and what came after." fr="Ce qui a mené jusque-là, et ce qui a suivi." /></p>
          <div className="mt-8 border-t border-rule">{linked.map((x) => <EventRow key={x.slug} e={x} />)}</div>
        </section>
      )}

      <section className="mt-24 grid gap-8 rounded-[2rem] bg-raise p-8 sm:p-14 md:grid-cols-[1.3fr_1fr] md:items-center">
        <p className="text-d-4"><L en="One connected story like this, every Sunday." fr="Une histoire reliée comme celle-ci, chaque dimanche." /></p>
        <NewsletterForm source={`event:${e.slug}`} />
      </section>
    </article>
  );
}
