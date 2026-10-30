import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EventRow from "@/components/EventCard";
import ShareButton from "@/components/ShareButton";
import NewsletterForm from "@/components/NewsletterForm";
import { ViewPing } from "@/components/Progress";
import { connectedEvents, formatDate, getContent, periodFor, yearOf } from "@/lib/data";
import { DIMENSIONS, SITE, STATUS_LABEL } from "@/lib/site";

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
  const threads = c.threads.filter((t) => t.steps.some((s) => s.event === e.slug));
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
        {period ? <Link href={`/decades/${period.slug}`} className="hover:text-fg">Back to {period.label.replace(/^The /, "the ")}</Link> : <span />}
        <ShareButton title={e.title} path={`/events/${e.slug}`} text={`${formatDate(e)}: ${e.title}`} />
      </div>

      <header className="mt-10">
        <p className="wdth-tight text-d-2 font-extrabold tabular-nums">{yearOf(e)}</p>
        <h1 className="mt-4 max-w-4xl text-d-3 font-semibold">{e.title}</h1>
        <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">
          <div><dt className="text-dim">Date</dt><dd className="mt-0.5">{formatDate(e)}</dd></div>
          <div><dt className="text-dim">Place</dt><dd className="mt-0.5">{e.location}</dd></div>
          <div><dt className="text-dim">Dimension</dt><dd className="mt-0.5 flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: color }} />{DIMENSIONS[e.dimension].label}</dd></div>
          <div><dt className="text-dim">Evidence</dt><dd className={`mt-0.5 ${e.status === "documented" ? "" : "status-note"}`}>{STATUS_LABEL[e.status]}</dd></div>
        </dl>
      </header>

      <div className="mt-14 grid gap-14 border-t border-rule pt-12 lg:grid-cols-[1fr_20rem]">
        <div className="read">
          <p className="!text-[1.35rem] !leading-relaxed text-fg">{e.summary}</p>
          {e.context && (<><h2 className="mt-10 font-display text-lg font-semibold text-fg">Background</h2><p className="mt-2">{e.context}</p></>)}
          {e.causes && (<><h2 className="mt-10 font-display text-lg font-semibold text-fg">Causes</h2><p className="mt-2">{e.causes}</p></>)}
          {e.consequences && (<><h2 className="mt-10 font-display text-lg font-semibold text-fg">What it changed</h2><p className="mt-2">{e.consequences}</p></>)}

          <h2 className="mt-14 font-display text-lg font-semibold text-fg">Sources</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[1rem]">
            {e.sources.map((s, i) => (
              <li key={i}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-4 hover:text-dim hover:decoration-fg">{s.title}</a> : s.title}</li>
            ))}
          </ol>
          <p className="mt-6 font-display text-sm text-dim">
            See something wrong? <a className="underline underline-offset-4 hover:text-fg" href={`mailto:hello@fivonine.com?subject=${encodeURIComponent("Correction: " + e.title)}`}>Send a correction</a>.
          </p>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          {e.countries && e.countries.length > 0 && (
            <div>
              <p className="label">Countries involved</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {e.countries.map((x) => <Link key={x} href={`/explore?country=${encodeURIComponent(x)}`} className="pill">{x}</Link>)}
              </div>
            </div>
          )}
          <div>
            <p className="label">Subjects</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cats.map((x) => <Link key={x.slug} href={`/subjects/${x.slug}`} className="pill">{x.short}</Link>)}
            </div>
          </div>
          {people.length > 0 && (
            <div>
              <p className="label">People</p>
              <ul className="mt-3 space-y-2">
                {people.map((p) => <li key={p.slug}><Link href={`/people/${p.slug}`} className="font-medium hover:text-dim">{p.name}</Link></li>)}
              </ul>
            </div>
          )}
          {threads.map((t) => (
            <Link key={t.slug} href={`/threads/${t.slug}`} className="block rounded-2xl bg-raise p-5 hover:bg-lift">
              <span className="label">Part of the thread</span>
              <span className="mt-1 block text-lg font-semibold">{t.title}</span>
            </Link>
          ))}
        </aside>
      </div>

      {linked.length > 0 && (
        <section className="mt-24">
          <h2 className="text-d-3 font-semibold">Connected moments</h2>
          <p className="mt-3 max-w-xl font-serif text-lg text-dim">What led here, and what came after.</p>
          <div className="mt-8 border-t border-rule">{linked.map((x) => <EventRow key={x.slug} e={x} />)}</div>
        </section>
      )}

      <section className="mt-24 grid gap-8 rounded-[2rem] bg-raise p-8 sm:p-14 md:grid-cols-[1.3fr_1fr] md:items-center">
        <p className="text-d-4 font-semibold">One connected story like this, every Sunday.</p>
        <NewsletterForm source={`event:${e.slug}`} />
      </section>
    </article>
  );
}
