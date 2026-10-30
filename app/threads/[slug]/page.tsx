import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButton from "@/components/ShareButton";
import { formatDate, getContent, yearOf } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getContent()).threads.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = (await getContent()).threads.find((x) => x.slug === slug);
  if (!t) return {};
  const og = `/api/og?kind=thread&slug=${t.slug}`;
  return { title: t.title, description: t.dek, openGraph: { images: [og] }, twitter: { images: [og] } };
}

export default async function ThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getContent();
  const t = c.threads.find((x) => x.slug === slug);
  if (!t) notFound();
  const steps = t.steps.map((s) => ({ ...s, e: c.events.find((e) => e.slug === s.event)! })).filter((s) => s.e);

  return (
    <article className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8">
      <div className="flex items-center justify-between text-sm text-dim">
        <Link href="/threads" className="hover:text-fg">All threads</Link>
        <ShareButton title={t.title} path={`/threads/${t.slug}`} text={`${t.title}: ${t.dek}`} />
      </div>
      <h1 className="mt-10 max-w-4xl text-d-2 font-extrabold">{t.title}</h1>
      <p className="read mt-6 !text-[1.35rem]">{t.dek}</p>

      {/* The chain: a real sequence, so it is numbered by its years */}
      <ol className="relative mt-20">
        <span className="absolute bottom-6 left-[2.75rem] top-6 w-px bg-rule sm:left-[4.25rem]" aria-hidden />
        {steps.map((s, i) => {
          const gap = i > 0 ? yearOf(s.e) - yearOf(steps[i - 1].e) : 0;
          return (
            <li key={s.event} className="relative">
              {i > 0 && gap > 0 && (
                <p className="py-3 pl-[4.5rem] text-sm text-dim sm:pl-[6rem]">{gap} {gap === 1 ? "year" : "years"} later</p>
              )}
              <Link href={`/events/${s.e.slug}`} className="group grid grid-cols-[5.5rem_1fr] items-start gap-4 sm:grid-cols-[8.5rem_1fr]">
                <span className="relative z-10 flex flex-col items-center bg-base py-2">
                  <span className="wdth-tight text-3xl font-bold tabular-nums sm:text-4xl" style={{ color: DIMENSIONS[s.e.dimension].color }}>{yearOf(s.e)}</span>
                </span>
                <span className="rounded-2xl p-4 transition-colors group-hover:bg-raise sm:p-5">
                  <span className="block text-xl font-semibold leading-snug sm:text-2xl">{s.e.title}</span>
                  <span className="mt-2 block font-serif text-lg leading-relaxed text-dim">{s.note}</span>
                  <span className="mt-2 block text-sm text-dim">{formatDate(s.e)}, {s.e.location}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="read mt-16 border-l-2 border-sun pl-5 !text-[1rem] text-dim">{t.caveat}</p>
    </article>
  );
}
