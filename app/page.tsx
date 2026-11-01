import Link from "next/link";
import Strata from "@/components/Strata";
import TimeScrubber from "@/components/TimeScrubber";
import NewsletterForm from "@/components/NewsletterForm";
import L from "@/components/L";
import { dateNode } from "@/components/dates";
import { formatDate, formatDateFr, getContent, onThisDay, periodFor, sortEvents, yearOf } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";

export const revalidate = 3600;

export default async function Home() {
  const c = await getContent();
  const otd = onThisDay(c);
  const now = new Date();
  const today = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const todayFr = now.toLocaleDateString("fr-FR", { month: "long", day: "numeric" });
  const points = sortEvents(c.events)
    .filter((e) => yearOf(e) >= 1490)
    .map((e) => {
      const p = periodFor(e, c.periods)!;
      return { slug: e.slug, title: e.title, titleFr: e.fr?.title, year: yearOf(e), label: formatDate(e), labelFr: formatDateFr(e), location: e.location, dimension: e.dimension, period: p.slug, periodLabel: p.label.replace(/^The /, "the ") };
    });

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h1 className="max-w-xl text-xl font-medium leading-snug sm:text-2xl">
            <L en="Haiti, one decade at a time: what happened at home, what Haitians did abroad, and what the world did to Haiti." fr="Haïti, une décennie à la fois : ce qui s’est passé sur place, ce que les Haïtiens ont accompli à l’étranger, et ce que le monde a fait à Haïti." />
          </h1>
          <ul className="flex flex-col gap-1.5 text-sm text-dim">
            {Object.values(DIMENSIONS).map((d) => (
              <li key={d.label} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} /><L en={d.label} fr={d.labelFr} /></li>
            ))}
          </ul>
        </div>
        <div className="mt-6 sm:mt-2"><TimeScrubber points={points} /></div>
      </section>

      <section className="mx-auto mb-24 max-w-[1240px] px-5 sm:px-8">
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            { href: "/decades", title: <L en="Decades" fr="Décennies" />, line: <L en={`${c.periods.length} historical periods, year by year`} fr={`${c.periods.length} périodes historiques, année par année`} /> },
          { href: "/subjects", title: <L en="Subjects" fr="Thèmes" />, line: <L en={`${c.categories.length} subjects across Haitian history`} fr={`${c.categories.length} thèmes de l’histoire haïtienne`} /> },
          { href: "/people", title: <L en="Notable Figures" fr="Personnalités marquantes" />, line: <L en={`${c.people.length} historical figures`} fr={`${c.people.length} personnalités historiques`} /> },
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
          <h2 className="text-d-2 font-bold"><L en="Every period" fr="Chaque période" /></h2>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <Link href="/decades" className="btn btn-ghost"><L en="Browse decades as a grid" fr="Parcourir les décennies" /></Link>
          </div>
        </div>
        <Strata c={c} />
      </section>

      {otd.events.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1240px] px-5 sm:px-8">
          <h2 className="text-d-3 font-semibold">{otd.mode === "day" ? <L en={`On ${today}`} fr={`Le ${todayFr}`} /> : <L en="This month, across the centuries" fr="Ce mois-ci, à travers les siècles" />}</h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-3xl bg-rule md:grid-cols-3">
            {otd.events.slice(0, 3).map((e) => (
              <li key={e.slug} className="bg-base">
                <Link href={`/events/${e.slug}`} className="group flex h-full flex-col p-7 hover:bg-raise">
                  <span className="wdth-tight text-4xl tabular-nums">{yearOf(e)}</span>
                  <span className="mt-2 flex items-center gap-2 text-sm text-dim"><span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} /><L en={DIMENSIONS[e.dimension].label} fr={DIMENSIONS[e.dimension].labelFr} /></span>
                  <span className="mt-4 text-xl font-medium leading-snug group-hover:text-dim"><L en={e.title} fr={e.fr?.title} /></span>
                  <span className="mt-3 text-[0.95rem] leading-relaxed text-dim line-clamp-3"><L en={e.summary} fr={e.fr?.summary} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto mt-32 max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-8 rounded-[2rem] bg-raise p-8 sm:p-14 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <h2 className="text-d-3 font-semibold"><L en="This week in Haitian history" fr="Cette semaine dans l’histoire d’Haïti" /></h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-dim">
              <L en="Every Sunday: three moments from the week ahead, from any century of Haitian history." fr="Chaque dimanche : trois moments de la semaine à venir, tirés de n’importe quel siècle de l’histoire d’Haïti." />
            </p>
          </div>
          <NewsletterForm source="home" />
        </div>
      </section>
    </>
  );
}
