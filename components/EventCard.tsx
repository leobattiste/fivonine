import Link from "next/link";
import { formatDate } from "@/lib/data";
import { DIMENSIONS, STATUS_LABEL } from "@/lib/site";
import type { HistEvent } from "@/lib/types";

export function DimensionDot({ d }: { d: HistEvent["dimension"] }) {
  return <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: DIMENSIONS[d].color }} aria-hidden />;
}

/** A row in a list of moments — year leads, colored by dimension. */
export default function EventRow({ e }: { e: HistEvent }) {
  return (
    <Link href={`/events/${e.slug}`} className="group grid grid-cols-[4.5rem_1fr] gap-5 border-b border-rule py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline">
      <span className="wdth-tight text-3xl font-bold tabular-nums" style={{ color: DIMENSIONS[e.dimension].color }}>
        {e.date.slice(0, 4)}
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-medium leading-snug group-hover:text-white">{e.title}</span>
        <span className="mt-1 block font-serif text-[0.98rem] leading-relaxed text-dim line-clamp-2">{e.summary}</span>
      </span>
      <span className="col-start-2 text-sm text-dim sm:col-start-auto">
        {e.status !== "documented" ? <span className="text-sun">{STATUS_LABEL[e.status]}</span> : formatDate(e)}
      </span>
    </Link>
  );
}
