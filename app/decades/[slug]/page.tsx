import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PeriodView from "@/components/PeriodView";
import DecadeSwitcher from "@/components/DecadeSwitcher";
import ShareButton from "@/components/ShareButton";
import { MarkExplored } from "@/components/Progress";
import { eventsInPeriod, formatDate, getContent, yearOf } from "@/lib/data";

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
  const threads = c.threads.filter((t) => t.steps.some((s) => evs.some((e) => e.slug === s.event)));
  const range = p.kind === "decade" ? `${p.start} to ${p.end}` : p.start < 0 ? `Before ${p.end + 1}` : `${p.start} to ${p.end}`;
  const [kicker, headline] = p.title.includes(":") ? p.title.split(/:\s(.+)/) : ["", p.title];
  const big = p.kind === "decade" ? `${p.start}s` : p.label;

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

      <header className="relative pb-14">
        <div className="flex items-center justify-between text-sm text-dim">
          <span>{range}</span>
          <ShareButton title={`${p.label} | Fivonine`} path={`/decades/${p.slug}`} text={`${p.label} in Haitian history: ${headline}`} />
        </div>
        <h1 className={`wdth-tight mt-6 font-extrabold ${p.kind === "decade" ? "text-d-1" : "text-d-2"}`}>{big}</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div>
            {kicker && <p className="text-lg text-dim">{kicker}</p>}
            <p className="mt-1 max-w-3xl text-d-3 font-semibold">{headline}</p>
          </div>
        </div>
      </header>

      {(p.overview || p.researchNote) && (
        <section className="border-t border-rule pt-10">
          <p className="label">The decade in brief</p>
          <div className="read mt-3">
            {p.overview && <p>{p.overview}</p>}
            {p.researchNote && <p className={`${p.overview ? "mt-6 border-l-2 border-fg pl-4 text-[1rem]" : ""} text-dim`}>{p.researchNote}</p>}
          </div>
        </section>
      )}

      {(evs.length > 0 || p.kind === "decade") && (
        <section className="mt-14">
          <h2 className="mb-6 text-d-3 font-semibold">{p.kind === "decade" ? `${p.start} to ${p.end}, year by year` : "Timeline"}</h2>
          <PeriodView
            events={evs.map((e) => ({ ...e, label: formatDate(e), year: yearOf(e) }))}
            categories={c.categories}
            notes={p.notes}
            start={p.start}
            end={p.end}
            isDecade={p.kind === "decade"}
          />
        </section>
      )}

      {(p.notes?.next || p.legacy) && (
        <section className="mt-20 rounded-[2rem] bg-raise p-8 sm:p-12">
          <p className="label">How it led to {next ? (next.kind === "decade" ? `the ${next.start}s` : next.label) : "today"}</p>
          <p className="mt-4 max-w-3xl font-serif text-[1.4rem] leading-snug sm:text-[1.6rem]">{p.notes?.next ?? p.legacy}</p>
          {next && <Link href={`/decades/${next.slug}`} className="btn btn-solid mt-6">Continue to {next.kind === "decade" ? `the ${next.start}s` : next.label}</Link>}
        </section>
      )}

      {(people.length > 0 || threads.length > 0) && (
        <section className="mt-20 grid gap-10 border-t border-rule pt-10 sm:grid-cols-2">
          {people.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">People in this {p.kind === "decade" ? "decade" : "period"}</h2>
              <ul className="mt-4 space-y-3">
                {people.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/people/${x.slug}`} className="group block">
                      <span className="block font-medium group-hover:text-dim">{x.name}</span>
                      <span className="block text-sm text-dim">{x.roles[0]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {threads.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">Stories that continue across decades</h2>
              <ul className="mt-4 space-y-3">
                {threads.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/threads/${t.slug}`} className="group block">
                      <span className="block font-medium group-hover:text-dim">{t.title}</span>
                      <span className="block text-sm text-dim">{t.dek}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}


      <nav className="mt-24 grid gap-px overflow-hidden rounded-[2rem] bg-rule sm:grid-cols-2">
        {prev ? (
          <Link href={`/decades/${prev.slug}`} className="group bg-base p-8 hover:bg-raise">
            <span className="label">Earlier</span>
            <span className="wdth-tight mt-2 block text-5xl font-bold group-hover:text-dim">{prev.kind === "decade" ? `${prev.start}s` : prev.label}</span>
          </Link>
        ) : <span className="bg-base" />}
        {next ? (
          <Link href={`/decades/${next.slug}`} className="group bg-base p-8 text-right hover:bg-raise">
            <span className="label">Later</span>
            <span className="wdth-tight mt-2 block text-5xl font-bold group-hover:text-dim">{next.kind === "decade" ? `${next.start}s` : next.label}</span>
          </Link>
        ) : <span className="bg-base" />}
      </nav>
      <p className="mt-6 hidden text-center text-sm text-dim sm:block">Tip: use the ← and → keys to move between periods.</p>
    </article>
    </>
  );
}
