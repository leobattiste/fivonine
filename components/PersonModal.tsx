"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import ShareButton from "@/components/ShareButton";
import { DIMENSIONS } from "@/lib/site";
import type { Dimension, Person } from "@/lib/types";

type Profile = {
  person: Person;
  periods: { slug: string; label: string }[];
  events: { slug: string; title: string; label: string; location: string; year: number; dimension: Dimension }[];
};

const Ctx = createContext<(slug: string) => void>(() => {});

/** Wraps the site so any figure link can open that person over the current page. */
export default function PersonModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [slug, setSlug] = useState<string | null>(null);
  const [data, setData] = useState<Profile | null>(null);
  const [error, setError] = useState(false);
  const cache = useRef(new Map<string, Profile>());
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((s: string) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setSlug(s);
    setError(false);
    setData(cache.current.get(s) ?? null);
    // Update the address so the profile can be shared; Back closes it.
    window.history.pushState({ fivonineFigure: s }, "", `/people/${s}`);
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.fivonineFigure) window.history.back();
    else setSlug(null);
  }, []);

  // Close whenever the address moves away from this figure (Back, or a link inside the modal).
  // Wait until the address has first reached the figure, so the modal doesn't close itself on open.
  const reached = useRef(false);
  useEffect(() => {
    if (!slug) { reached.current = false; return; }
    if (pathname === `/people/${slug}`) reached.current = true;
    else if (reached.current) setSlug(null);
  }, [pathname, slug]);

  // Browser Back (or close, which calls Back) leaves the figure's address
  useEffect(() => {
    if (!slug) return;
    const onPop = () => { if (window.location.pathname !== `/people/${slug}`) setSlug(null); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [slug]);

  // Load the profile
  useEffect(() => {
    if (!slug || cache.current.has(slug)) return;
    let live = true;
    fetch(`/api/people/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: Profile) => { cache.current.set(slug, j); if (live) setData(j); })
      .catch(() => live && setError(true));
    return () => { live = false; };
  }, [slug]);

  // Scroll lock, focus and Escape while open
  useEffect(() => {
    if (!slug) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus?.();
    };
  }, [slug, close]);

  const p = data?.person;

  return (
    <Ctx.Provider value={open}>
      {children}
      {slug && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={p?.name ?? "Figure"}>
          <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden />
          <div ref={panel} tabIndex={-1}
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-base px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-2xl outline-none sm:max-h-[88vh] sm:max-w-2xl sm:rounded-[1.75rem] sm:px-10 sm:pb-10">
            <div className="sticky top-0 z-10 -mx-5 flex h-14 items-center justify-center bg-base/95 px-5 backdrop-blur sm:-mx-10 sm:h-16 sm:px-10">
              <span className="h-1.5 w-10 rounded-full bg-rule sm:hidden" aria-hidden />
              <button onClick={close} className="absolute right-4 top-2 grid h-10 w-10 place-items-center rounded-full border border-rule bg-base hover:border-fg sm:right-6 sm:top-3" aria-label="Close profile">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>

            {error && <p className="py-10 text-dim">This profile couldn&apos;t load. <a className="underline" href={`/people/${slug}`}>Open it as a page</a>.</p>}
            {!error && !p && (
              <div className="animate-pulse space-y-4 py-4" aria-label="Loading">
                <div className="h-4 w-24 rounded bg-raise" /><div className="h-10 w-2/3 rounded bg-raise" /><div className="h-24 rounded bg-raise" />
              </div>
            )}
            {p && data && (
              <div className="pt-1">
                <p className="tabular-nums text-dim">{[p.born, p.died].filter(Boolean).join(" to ") || "Dates uncertain"}</p>
                <h2 className="mt-2 text-d-3 font-extrabold">{p.name}</h2>
                <p className="mt-3 text-lg text-dim">{p.roles.join(", ")}</p>
                <p className="read mt-6">{p.bio}</p>
                {data.periods.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {data.periods.map((x) => <Link key={x.slug} href={`/decades/${x.slug}`} className="pill">{x.label}</Link>)}
                  </div>
                )}
                {data.events.length > 0 && (
                  <section className="mt-10">
                    <h3 className="text-lg font-semibold">In the record</h3>
                    <ul className="mt-4 border-t border-rule">
                      {data.events.map((e) => (
                        <li key={e.slug}>
                          <Link href={`/events/${e.slug}`} className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-4 border-b border-rule py-3">
                            <span className="wdth-tight whitespace-nowrap text-xl font-bold tabular-nums">
                              <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-[0.25em] rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                              {e.year}
                            </span>
                            <span>
                              <span className="block font-medium group-hover:text-dim">{e.title}</span>
                              <span className="block text-sm text-dim">{e.label}, {e.location}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                <div className="mt-8"><ShareButton title={p.name} path={`/people/${p.slug}`} /></div>
              </div>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/** A link to a figure. A plain click opens the modal; new-tab clicks and shared links go to the full page. */
export function PersonLink({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  const open = useContext(Ctx);
  return (
    <a
      href={`/people/${slug}`}
      className={className}
      onClick={(e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        open(slug);
      }}
    >
      {children}
    </a>
  );
}
