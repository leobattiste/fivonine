import Link from "next/link";
import type { Metadata } from "next";
import { getContent } from "@/lib/data";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "What Fivonine is, how it's organized, and the editorial standards behind every entry.",
};

export default async function AboutPage() {
  const c = await getContent();
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2 font-extrabold">About Fivonine</h1>
      <div className="read mt-6">
        <p>
          Fivonine is a free, independent record of the entire history of Haiti and Haitians, from the Taíno island of Ayiti to today.
          It is organized decade by decade, so you can open any ten years and see everything that happened: politics and the economy,
          music and literature, wars, faith, sport, business and everyday life.
        </p>
        <p>
          Haiti&apos;s story has never stopped at its borders. Every period on Fivonine is told three ways: what happened inside Haiti,
          what Haitians did around the world, and what foreign governments and institutions did that changed Haiti.
        </p>
      </div>

      <section className="mt-16 grid gap-3 sm:grid-cols-3">
        {Object.values(DIMENSIONS).map((d) => (
          <div key={d.label} className="rounded-2xl border border-rule p-6">
            <span className="flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />{d.label}</span>
          </div>
        ))}
      </section>

      <section className="mt-20 border-t border-rule pt-10">
        <h2 className="text-d-3 font-semibold">How it&apos;s organized</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/decades", t: "Decades", d: "Every period has its own year-by-year timeline." },
            { href: "/events", t: "Events", d: "Every moment, created once and linked everywhere it belongs." },
            { href: "/people", t: "Figures", d: "Each person connected to every moment and decade they shaped." },
            { href: "/subjects", t: "Subjects", d: `${c.categories.length} subjects, from Politics & Government to Major Events & Disasters.` },
          ].map((x) => (
            <li key={x.href}>
              <Link href={x.href} className="block h-full rounded-2xl border border-rule p-6 hover:border-fg">
                <span className="block text-xl font-semibold">{x.t}</span>
                <span className="mt-1 block text-dim">{x.d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t border-rule pt-10">
        <h2 className="text-d-3 font-semibold">Our standards</h2>
        <div className="read mt-6">
          <p>Every entry links to its sources. We distinguish what is documented from what is interpreted, and we label entries accordingly:</p>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {Object.values(STATUS_LABEL).map((s) => <li key={s} className="pill !cursor-default">{s}</li>)}
        </ul>
        <div className="read mt-6">
          <p>
            We never invent history to fill a decade. Where the record is thin, the page says so, and we keep researching. When we get
            something wrong, we correct it.
          </p>
        </div>
      </section>

      <section className="mt-20 grid gap-3 sm:grid-cols-2">
        <Link href="/contribute" className="rounded-[2rem] bg-raise p-8 hover:bg-lift">
          <span className="block text-d-4 font-semibold">Contribute</span>
          <span className="mt-2 block text-dim">Send a correction, a source, a missing person or a family story.</span>
        </Link>
        <Link href="/donate" className="rounded-[2rem] bg-raise p-8 hover:bg-lift">
          <span className="block text-d-4 font-semibold">Donate</span>
          <span className="mt-2 block text-dim">Help fund the research and keep Fivonine free for everyone.</span>
        </Link>
      </section>

      <p className="mt-16 text-dim">
        Questions or partnerships: <a href="mailto:hello@fivonine.com" className="underline underline-offset-4 hover:text-fg">hello@fivonine.com</a>
      </p>
    </div>
  );
}
