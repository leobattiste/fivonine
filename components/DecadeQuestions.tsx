import Link from "next/link";
import { formatDate } from "@/lib/data";
import { QUESTIONS } from "@/lib/questions";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";
import type { Category, HistEvent, Period } from "@/lib/types";

type Props = { period: Period; next?: Period; events: HistEvent[]; categories: Category[] };

/** The decade as ten questions, each answered in prose and backed by the moments filed under its areas. */
export default function DecadeQuestions({ period, next, events, categories }: Props) {
  const majors = events.filter((e) => e.categories.includes("major-events"));
  const sections = QUESTIONS.map((q) => {
    const dims: readonly string[] = "dimensions" in q ? q.dimensions : [];
    const moments = events.filter((e) => e.categories.some((c) => (q.areas as readonly string[]).includes(c)) || dims.includes(e.dimension));
    const answer = period.answers?.[q.id] ?? (q.id === "next" ? period.legacy : undefined);
    return { q, moments, answer, has: Boolean(answer || moments.length) };
  });
  const answered = sections.filter((s) => s.has).length;
  const areaName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      {/* Question index */}
      <nav aria-label="Questions" className="min-w-0 lg:sticky lg:top-36 lg:self-start">
        <p className="label">{answered} of {QUESTIONS.length} questions answered so far</p>
        <ol className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
          {sections.map(({ q, has }) => (
            <li key={q.id} className="shrink-0">
              <a href={`#${q.id}`} className={`flex items-center gap-2.5 whitespace-nowrap rounded-full border border-rule px-3 py-1.5 text-sm lg:rounded-lg lg:border-0 lg:px-2 hover:bg-raise ${has ? "text-fg" : "text-dim/70"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${has ? "bg-fg" : "border border-dim/60"}`} aria-hidden />
                {q.nav}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0">
        {/* Major events & disasters lead the chapter */}
        {majors.length > 0 && (
          <section aria-labelledby="defining" className="mb-16">
            <h2 id="defining" className="text-sm font-medium text-dim">{areaName("major-events")}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {majors.map((e) => (
                <li key={e.slug}>
                  <Link href={`/events/${e.slug}`} className="group block h-full rounded-2xl border border-rule p-5 hover:border-fg">
                    <span className="flex items-center gap-2 text-sm text-dim">
                      <span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                      {formatDate(e)}
                    </span>
                    <span className="mt-2 block text-xl font-semibold leading-snug">{e.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="space-y-16">
          {sections.map(({ q, moments, answer, has }) => (
            <section key={q.id} id={q.id} className="scroll-mt-40 border-t border-rule pt-8">
              <h2 className="max-w-2xl text-d-4 font-semibold">{q.q}</h2>
              {q.areas.length > 0 && (
                <p className="mt-2 text-sm text-dim">
                  {[...q.areas.map(areaName), ...("dimensions" in q ? q.dimensions.map((d) => DIMENSIONS[d].label) : [])].join(", ")}
                </p>
              )}

              {answer && <p className="read mt-5">{answer}</p>}

              {moments.length > 0 && (
                <ul className="mt-6 border-t border-rule">
                  {moments.map((e) => (
                    <li key={e.slug}>
                      <Link href={`/events/${e.slug}`} className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-4 border-b border-rule py-3">
                        <span className="wdth-tight whitespace-nowrap text-xl font-bold tabular-nums">
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-[0.25em] rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                          {e.date.slice(0, 4)}
                        </span>
                        <span>
                          <span className="font-medium group-hover:text-dim">{e.title}</span>
                          {e.status !== "documented" && <span className="status-note ml-2 text-sm">{STATUS_LABEL[e.status]}</span>}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {q.id === "next" && next && (
                <Link href={`/decades/${next.slug}`} className="btn btn-solid mt-6">
                  Continue to {next.kind === "decade" ? `the ${next.start}s` : next.label}
                </Link>
              )}

              {!has && (
                <p className="mt-5 max-w-xl text-dim">
                  Not researched yet for this {period.kind === "decade" ? "decade" : "period"}. We'd rather leave this empty than guess.{" "}
                  <a className="underline underline-offset-4 hover:text-fg" href={`mailto:hello@fivonine.com?subject=${encodeURIComponent(`${period.label}: ${q.nav}`)}`}>
                    Know a source?
                  </a>
                </p>
              )}
              {has && !answer && q.id !== "next" && (
                <p className="mt-4 text-sm text-dim">A written overview for this question is still being prepared.</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
