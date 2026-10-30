import Link from "next/link";
import { formatDate } from "@/lib/data";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";
import type { HistEvent } from "@/lib/types";

export function DimensionDot({ d }: { d: HistEvent["dimension"] }) {
  return <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: DIMENSIONS[d].color }} aria-hidden />;
}

/** A row in a list of moments: the year leads, a dot marks the dimension. */
export default function EventRow({ e }: { e: HistEvent }) {
  return (
    <Link href={`/events/${e.slug}`} className="group grid grid-cols-[4.5rem_1fr] gap-5 border-b border-rule py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline">
      <span className="wdth-tight text-3xl font-bold tabular-nums">
        <span className="mr-2 inline-block h-2 w-2 -translate-y-[0.3em] rounded-full align-middle" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
        {e.date.slice(0, 4)}
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-medium leading-snug group-hover:text-dim">{e.title}</span>
        <span className="mt-1 block font-serif text-[0.98rem] leading-relaxed text-dim line-clamp-2">{e.summary}</span>
      </span>
      <span className="col-start-2 text-sm text-dim sm:col-start-auto">
        {e.status !== "documented" ? <span className="status-note">{STATUS_LABEL[e.status]}</span> : formatDate(e)}
      </span>
    </Link>
  );
}
