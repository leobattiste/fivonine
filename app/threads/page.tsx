import Link from "next/link";
import type { Metadata } from "next";
import { getContent, yearOf } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";

export const metadata: Metadata = { title: "Threads", description: "Follow lines of cause and consequence across Haiti's decades." };
export const revalidate = 3600;

export default async function ThreadsPage() {
  const c = await getContent();
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-12 sm:px-8">
      <h1 className="text-d-2 font-extrabold">Threads</h1>
      <p className="read mt-6">
        History is connected. Each thread follows one line through several decades so you can see how a decision in one era
        shaped the next. They are research pathways, not claims that one event alone caused another.
      </p>
      <ul className="mt-16 space-y-6">
        {c.threads.map((t) => {
          const steps = t.steps.map((s) => c.events.find((e) => e.slug === s.event)).filter(Boolean);
          const ys = steps.map((e) => yearOf(e!));
          const min = Math.min(...ys), max = Math.max(...ys);
          return (
            <li key={t.slug}>
              <Link href={`/threads/${t.slug}`} className="group block rounded-[2rem] bg-raise p-8 hover:bg-lift sm:p-10">
                <span className="block text-d-4 font-semibold group-hover:text-dim">{t.title}</span>
                <span className="mt-2 block max-w-2xl font-serif text-lg text-dim">{t.dek}</span>
                {/* miniature of the thread on a time axis */}
                <span className="relative mt-8 block h-10" aria-hidden>
                  <span className="absolute inset-x-0 top-1/2 h-px bg-rule" />
                  {steps.map((e) => (
                    <span key={e!.slug} className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-raise group-hover:ring-lift"
                      style={{ left: `${((yearOf(e!) - min) / Math.max(1, max - min)) * 100}%`, background: DIMENSIONS[e!.dimension].color }} />
                  ))}
                </span>
                <span className="flex justify-between text-sm tabular-nums text-dim"><span>{min}</span><span>{max}</span></span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
