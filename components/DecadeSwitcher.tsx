"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Item = { slug: string; short: string; empty: boolean };

/** Sticky strip of every period. The current one is centered; ← and → move between periods. */
export default function DecadeSwitcher({ items, current }: { items: Item[]; current: string }) {
  const router = useRouter();
  const strip = useRef<HTMLDivElement>(null);
  const i = items.findIndex((x) => x.slug === current);
  const prev = items[i - 1];
  const next = items[i + 1];

  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-current="true"]`);
    if (el && strip.current) {
      const s = strip.current;
      s.scrollLeft = el.offsetLeft - s.clientWidth / 2 + el.clientWidth / 2;
    }
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [role=slider]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft" && prev) router.push(`/decades/${prev.slug}`);
      if (e.key === "ArrowRight" && next) router.push(`/decades/${next.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);

  return (
    <nav aria-label="Periods" className="sticky top-[60px] z-30 border-y border-rule bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1240px] items-center gap-2 px-3 sm:px-6">
        <ArrowLink href={prev && `/decades/${prev.slug}`} label={prev ? `Earlier: ${prev.short}` : "No earlier period"} dir="left" />
        <div ref={strip} className="no-scrollbar flex flex-1 gap-1 overflow-x-auto scroll-smooth py-2">
          {items.map((x) => (
            <Link
              key={x.slug}
              href={`/decades/${x.slug}`}
              data-current={x.slug === current}
              aria-current={x.slug === current ? "page" : undefined}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm tabular-nums transition-colors ${
                x.slug === current ? "bg-fg text-base" : x.empty ? "text-dim/60 hover:text-fg" : "text-dim hover:bg-raise hover:text-fg"
              }`}
            >
              {x.short}
            </Link>
          ))}
        </div>
        <ArrowLink href={next && `/decades/${next.slug}`} label={next ? `Later: ${next.short}` : "No later period"} dir="right" />
      </div>
    </nav>
  );
}

function ArrowLink({ href, label, dir }: { href?: string; label: string; dir: "left" | "right" }) {
  const icon = (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path d={dir === "left" ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"} fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
  const cls = "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rule";
  return href ? (
    <Link href={href} aria-label={label} title={label} className={`${cls} hover:border-fg`}>{icon}</Link>
  ) : (
    <span aria-label={label} className={`${cls} text-rule`}>{icon}</span>
  );
}
