import Link from "next/link";
import Strata from "@/components/Strata";
import TimeScrubber from "@/components/TimeScrubber";
import NewsletterForm from "@/components/NewsletterForm";
import { JourneyMeter } from "@/components/Progress";
import { formatDate, getContent, onThisDay, periodFor, sortEvents, yearOf } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";

export const revalidate = 3600;

export default async function Home() {
  const c = await getContent();
  const otd = onThisDay(c);
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const points = sortEvents(c.events)
    .filter((e) => yearOf(e) >= 1490)
    .map((e) => {
      const p = periodFor(e, c.periods)!;
      return { slug: e.slug, title: e.title, year: yearOf(e), label: formatDate(e), location: e.location, dimension: e.dimension, period: p.slug, periodLabel: p.label.replace(/^The /, "the ") };
    });

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h1 className="max-w-xl text-xl font-medium leading-snug sm:text-2xl">
            Haiti, one decade at a time: what happened at home, what Haitians did abroad, and what the world did to Haiti.
          </h1>
          <ul className="flex flex-col gap-1.5 text-sm text-dim">
            {Object.values(DIMENSIONS).map((d) => (
              <li key={d.label} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} />{d.label}</li>
            ))}
          </ul>
        </div>
        <div className="mt-6 sm:mt-2"><TimeScrubber points={points} /></div>
      </section>

      <section className="mx-auto mb-24 max-w-[1240px] px-5 sm:px-8">
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { href: "/decades", title: "Decades", line: `${c.periods.length} periods, each a year-by-year timeline` },
            { href: "/events", title: "Events", line: `${c.events.length} moments on one timeline` },
            { href: "/people", title: "Figures", line: `${c.people.length} people who shaped Haiti` },
            { href: "/subjects", title: "Subjects", line: `${c.categories.length} subjects through the centuries` },
          ].map((x) => (
            <li key={x.href}>
              <Link href={x.href} className="flex h-full flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg">
                <span className="text-2xl font-semibold">{x.title}</span>
                <span className="mt-2 text-sm text-dim">{x.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="decades" className="mx-auto max-w-[1240px] scroll-mt-20 px-5 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-d-2 font-bold">Every period</h2>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <JourneyMeter total={c.periods.length} />
            <Link href="/decades" className="btn btn-ghost">Browse decades as a grid</Link>
          </div>
        </div>
        <Strata c={c} />
      </section>

      {otd.events.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1240px] px-5 sm:px-8">
          <h2 className="text-d-3 font-semibold">{otd.mode === "day" ? `On ${today}` : "This month, across the centuries"}</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-rule md:grid-cols-3">
            {otd.events.slice(0, 3).map((e) => (
              <li key={e.slug} className="bg-base">
                <Link href={`/events/${e.slug}`} className="group flex h-full flex-col p-7 hover:bg-raise">
                  <span className="wdth-tight text-6xl font-bold tabular-nums">{yearOf(e)}</span>
                  <span className="mt-2 flex items-center gap-2 text-sm text-dim"><span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} />{DIMENSIONS[e.dimension].label}</span>
                  <span className="mt-4 text-xl font-medium leading-snug group-hover:text-dim">{e.title}</span>
                  <span className="mt-3 font-serif text-[0.98rem] leading-relaxed text-dim line-clamp-3">{e.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto mt-32 max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-8 rounded-[2rem] bg-raise p-8 sm:p-14 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <h2 className="text-d-3 font-semibold">This week in Haitian history</h2>
            <p className="mt-4 max-w-md font-serif text-lg leading-relaxed text-dim">
              Every Sunday: three moments from the week ahead, from any century of Haitian history.
            </p>
          </div>
          <NewsletterForm source="home" />
        </div>
      </section>
    </>
  );
}
