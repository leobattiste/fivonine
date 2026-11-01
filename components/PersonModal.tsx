"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import L from "@/components/L";
import SubjectLinks from "@/components/SubjectLinks";
import { useT } from "@/components/Prefs";
import ShareButton from "@/components/ShareButton";
import { DIMENSIONS } from "@/lib/site";
import type { Dimension, HistEvent, HistoricalRecord, Person } from "@/lib/types";

type Profile = {
  person: Person;
  records: { slug: string; title: string; titleFr?: string; type: string }[];
  periods: { slug: string; label: string; labelFr?: string }[];
  events: { titleFr?: string; labelFr?: string; slug: string; title: string; label: string; location: string; year: number; dimension: Dimension }[];
};

type EventData = {
  event: HistEvent; year: number; when: string; whenFr: string; period: { slug: string; label: string; labelFr?: string } | null;
  sections: { en: string; fr?: string }[]; people: { slug: string; name: string }[]; records: { slug: string; title: string; titleFr?: string; type: string }[]; linked: { slug: string; title: string; titleFr?: string; label: string; labelFr?: string }[];
};
type RecordData = { record: HistoricalRecord; events: { slug: string; title: string; titleFr?: string; label: string; labelFr?: string }[]; related: { slug: string; title: string; titleFr?: string; type: string }[] };
type Target = { kind: "people" | "events" | "records"; slug: string };
const Ctx = createContext<(kind: Target["kind"], slug: string) => void>(() => {});

/** Wraps the site so any figure link can open that person over the current page. */
export default function PersonModalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [target, setTarget] = useState<Target | null>(null);
  const slug = target?.slug ?? null;
  const kind = target?.kind ?? "people";
  const base = `/${kind}/${slug}`;
  const [data, setData] = useState<Profile | null>(null);
  const [evData, setEvData] = useState<EventData | null>(null);
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [error, setError] = useState(false);
  const cache = useRef(new Map<string, Profile | EventData | RecordData>());
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const reached = useRef(false);
  const depth = useRef(0);
  const open = useCallback((k: Target["kind"], s: string) => {
    if (!returnFocus.current) returnFocus.current = document.activeElement as HTMLElement | null;
    reached.current = false;
    setTarget({ kind: k, slug: s });
    setError(false);
    const hit = cache.current.get(`${k}/${s}`);
    setData(k === "people" ? ((hit as Profile) ?? null) : null);
    setEvData(k === "events" ? ((hit as EventData) ?? null) : null);
    setRecordData(k === "records" ? ((hit as RecordData) ?? null) : null);
    // Update the address so it can be shared; Back closes it.
    depth.current += 1;
    window.history.pushState({ fivonineFigure: s }, "", `/${k}/${s}`);
  }, []);

  const close = useCallback(() => {
    // Go back past every modal we opened, to the page underneath
    if (depth.current > 0 && window.history.state?.fivonineFigure) window.history.go(-depth.current);
    else setTarget(null);
  }, []);

  // Close whenever the address moves away from this figure (Back, or a link inside the modal).
  // Wait until the address has first reached the figure, so the modal doesn't close itself on open.
  useEffect(() => {
    if (!slug) { reached.current = false; return; }
    if (pathname === base) reached.current = true;
    else if (reached.current) setTarget(null);
  }, [pathname, slug, base]);

  // Browser Back (or close, which calls Back) leaves the figure's address
  useEffect(() => {
    if (!slug) return;
    const onPop = () => {
      const m = window.location.pathname.match(/^\/(people|events|records)\/([^/]+)$/);
      if (m && window.history.state?.fivonineFigure) {
        // Back from a chained modal shows the previous one
        depth.current = Math.max(0, depth.current - 1);
        reached.current = true;
        setError(false);
        setTarget({ kind: m[1] as Target["kind"], slug: m[2] });
      } else { depth.current = 0; setTarget(null); }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [slug, base]);

  // Load the profile
  useEffect(() => {
    if (!slug) return;
    const key = `${kind}/${slug}`;
    const hit = cache.current.get(key);
    if (hit) { if (kind === "people") setData(hit as Profile); else if (kind === "events") setEvData(hit as EventData); else setRecordData(hit as RecordData); return; }
    let live = true;
    fetch(`/api/${kind}/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => { cache.current.set(key, j); if (live) { if (kind === "people") setData(j); else if (kind === "events") setEvData(j); else setRecordData(j); } })
      .catch(() => live && setError(true));
    return () => { live = false; };
  }, [slug, kind]);

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
    };
  }, [slug, close]);

  useEffect(() => {
    if (slug) return;
    returnFocus.current?.focus?.();
    returnFocus.current = null;
  }, [slug]);

  const t = useT();
  const p = kind === "people" ? data?.person : undefined;
  const ev = kind === "events" ? evData?.event : undefined;
  const record = kind === "records" ? recordData?.record : undefined;
  const placeRecord = evData?.records.find((x) => x.type === "place");

  return (
    <Ctx.Provider value={open}>
      {children}
      {slug && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={p?.name ?? ev?.title ?? record?.title ?? "Details"}>
          <div onClick={close} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden />
          <div ref={panel} tabIndex={-1}
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-base px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] shadow-2xl outline-none sm:max-h-[88vh] sm:max-w-2xl sm:rounded-[1.75rem] sm:px-10 sm:pb-10">
            <div className="sticky top-0 z-10 -mx-5 flex h-14 items-center justify-center bg-base/95 px-5 backdrop-blur sm:-mx-10 sm:h-16 sm:px-10">
              <span className="h-1.5 w-10 rounded-full bg-rule sm:hidden" aria-hidden />
              <button onClick={close} className="absolute right-4 top-2 grid h-10 w-10 place-items-center rounded-full border border-rule bg-base hover:border-fg sm:right-6 sm:top-3" aria-label={t("Close", "Fermer")}>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>

            {error && <p className="py-10 text-dim"><L en="This couldn’t load." fr="Le chargement a échoué." /> <a className="underline" href={base}><L en="Open it as a page" fr="Ouvrir comme page" /></a>.</p>}
            {!error && !p && !ev && !record && (
              <div className="animate-pulse space-y-4 py-4" aria-label="Loading">
                <div className="h-4 w-24 rounded bg-raise" /><div className="h-10 w-2/3 rounded bg-raise" /><div className="h-24 rounded bg-raise" />
              </div>
            )}
            {ev && evData && (
              <div className="pt-1">
                <p className="wdth-tight text-d-3 tabular-nums">{evData.year}</p>
                <h2 className="mt-2 text-d-4 leading-tight"><L en={ev.title} fr={ev.fr?.title} /></h2>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div><dt className="text-dim"><L en="Date" fr="Date" /></dt><dd className="mt-0.5"><L en={evData.when} fr={evData.whenFr} /></dd></div>
                  <div><dt className="text-dim"><L en="Place" fr="Lieu" /></dt><dd className="mt-0.5">{placeRecord ? <RecordLink slug={placeRecord.slug} className="underline underline-offset-4">{ev.location}</RecordLink> : ev.location}</dd></div>
                  <div><dt className="text-dim"><L en="Dimension" fr="Dimension" /></dt><dd className="mt-0.5 flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[ev.dimension].color }} /><L en={DIMENSIONS[ev.dimension].label} fr={DIMENSIONS[ev.dimension].labelFr} /></dd></div>
                </dl>
                <SubjectLinks slugs={ev.categories} compact className="mt-5" />
                <p className="read mt-6"><L en={ev.summary} fr={ev.fr?.summary} /></p>
                {ev.body && <p className="read mt-4"><L en={ev.body} fr={ev.fr?.body} /></p>}
                {ev.context && <><h3 className="mt-6 text-lg"><L en="Background" fr="Contexte" /></h3><p className="read mt-1"><L en={ev.context} fr={ev.fr?.context} /></p></>}
                {ev.causes && <><h3 className="mt-6 text-lg"><L en="Causes" fr="Causes" /></h3><p className="read mt-1"><L en={ev.causes} fr={ev.fr?.causes} /></p></>}
                {ev.consequences && <><h3 className="mt-6 text-lg"><L en="What it changed" fr="Ce que cela a changé" /></h3><p className="read mt-1"><L en={ev.consequences} fr={ev.fr?.consequences} /></p></>}
                {evData.sections.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">{evData.sections.map((x) => <span key={x.en} className="pill"><L en={x.en} fr={x.fr} /></span>)}</div>
                )}
                {evData.people.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-dim"><L en="People" fr="Personnes" /></p>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {evData.people.map((x) => <li key={x.slug}><PersonLink slug={x.slug} className="font-medium underline decoration-rule underline-offset-4 hover:decoration-fg">{x.name}</PersonLink></li>)}
                    </ul>
                  </div>
                )}
                {evData.records.length > 0 && (
                  <section className="mt-8">
                    <h3 className="text-lg"><L en="Places, documents and related records" fr="Lieux, documents et notices associées" /></h3>
                    <ul className="mt-3 border-t border-rule">
                      {evData.records.map((x) => <li key={x.slug} className="border-b border-rule py-3"><RecordLink slug={x.slug} className="block font-medium hover:text-dim"><L en={x.title} fr={x.titleFr} /></RecordLink><span className="mt-0.5 block text-xs uppercase tracking-wide text-dim">{x.type}</span></li>)}
                    </ul>
                  </section>
                )}
                {evData.linked.length > 0 && (
                  <section className="mt-8">
                    <h3 className="text-lg"><L en="Connected moments" fr="Moments liés" /></h3>
                    <ul className="mt-3 border-t border-rule">
                      {evData.linked.map((x) => (
                        <li key={x.slug} className="border-b border-rule py-2.5">
                          <EventLink slug={x.slug} className="block font-medium hover:text-dim"><L en={x.title} fr={x.titleFr} /></EventLink>
                          <span className="block text-sm text-dim"><L en={x.label} fr={x.labelFr} /></span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {(ev.sources.length > 0 || ev.editorial?.verification === "inventory") && (
                  <section className="mt-7">
                    <h3 className="text-sm font-medium"><L en="Sources" fr="Sources" /></h3>{ev.editorial?.verification === "inventory" && <p className="mt-2 text-sm text-dim"><L en="Verification: archival inventory only. Full manuscript not examined." fr="Vérification : inventaire d’archives uniquement. Manuscrit intégral non examiné." /></p>}
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-dim">
                      {ev.sources.map((s) => <li key={s.title}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{s.title}</a> : s.title}</li>)}
                    </ul>
                  </section>
                )}
                <div className="mt-8 flex items-center gap-4">
                  <ShareButton title={ev.title} path={`/events/${ev.slug}`} />
                  <Link href={`/events/${ev.slug}`} className="text-sm underline underline-offset-4 hover:text-dim"><L en="Open as a page" fr="Ouvrir comme page" /></Link>
                </div>
              </div>
            )}
            {record && recordData && (
              <div className="pt-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dim"><L en={record.type} fr={record.type === "place" ? "Lieu" : record.type === "document" ? "Document" : record.type === "institution" ? "Institution" : record.type === "organization" ? "Organisation" : record.type === "object" ? "Objet" : record.type === "work" ? "Œuvre" : "Autre"} /></p>
                <h2 className="mt-2 text-d-4 leading-tight"><L en={record.title} fr={record.fr?.title} /></h2>
                {(record.dates || record.location) && <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{record.dates && <div><dt className="text-dim"><L en="Date" fr="Date" /></dt><dd className="mt-0.5"><L en={record.dates} fr={record.fr?.dates} /></dd></div>}{record.location && <div><dt className="text-dim"><L en="Location" fr="Lieu" /></dt><dd className="mt-0.5"><L en={record.location} fr={record.fr?.location} /></dd></div>}</dl>}
                <p className="read mt-6"><L en={record.summary} fr={record.fr?.summary} /></p>
                {record.body && <p className="read mt-4"><L en={record.body} fr={record.fr?.body} /></p>}
                {recordData.events.length > 0 && <section className="mt-8"><h3 className="text-lg"><L en="Connected events" fr="Événements liés" /></h3><ul className="mt-3 border-t border-rule">{recordData.events.map((x) => <li key={x.slug} className="border-b border-rule py-3"><EventLink slug={x.slug} className="font-medium hover:text-dim"><L en={x.title} fr={x.titleFr} /></EventLink><span className="block text-sm text-dim"><L en={x.label} fr={x.labelFr} /></span></li>)}</ul></section>}
                {recordData.related.length > 0 && <section className="mt-8"><h3 className="text-lg"><L en="Related records" fr="Notices associées" /></h3><ul className="mt-3 border-t border-rule">{recordData.related.map((x) => <li key={x.slug} className="border-b border-rule py-3"><RecordLink slug={x.slug} className="font-medium hover:text-dim"><L en={x.title} fr={x.titleFr} /></RecordLink><span className="block text-xs uppercase tracking-wide text-dim">{x.type}</span></li>)}</ul></section>}
                {record.sources.length > 0 && <section className="mt-8"><h3 className="text-lg"><L en="Sources" fr="Sources" /></h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-dim">{record.sources.map((s) => <li key={s.title}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{s.title}</a> : s.title}</li>)}</ul></section>}
                <div className="mt-8"><Link href={`/records/${record.slug}`} className="text-sm underline underline-offset-4"><L en="Open as a page" fr="Ouvrir comme une page" /></Link></div>
              </div>
            )}
            {p && data && (
              <div className="pt-1">
                <p className="tabular-nums text-dim"><L en={[p.born, p.died].filter(Boolean).join(" to ") || "Dates uncertain"} fr={[p.born, p.died].filter(Boolean).join(" à ") || "Dates incertaines"} /></p>
                <h2 className="mt-2 text-d-3">{p.name}</h2>
                <p className="mt-3 text-lg text-dim"><L en={p.roles.join(", ")} fr={p.fr?.roles?.join(", ")} /></p>
                <p className="read mt-6"><L en={p.bio} fr={p.fr?.bio} /></p>
                {data.periods.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {data.periods.map((x) => <Link key={x.slug} href={`/decades/${x.slug}`} className="pill"><L en={x.label} fr={x.labelFr} /></Link>)}
                  </div>
                )}
                {data.records.length > 0 && (
                  <section className="mt-8">
                    <h3 className="text-lg"><L en="Connected records" fr="Notices associées" /></h3>
                    <ul className="mt-3 border-t border-rule">
                      {data.records.map((x) => <li key={x.slug} className="border-b border-rule py-3"><RecordLink slug={x.slug} className="font-medium hover:text-dim"><L en={x.title} fr={x.titleFr} /></RecordLink><span className="block text-xs uppercase tracking-wide text-dim">{x.type}</span></li>)}
                    </ul>
                  </section>
                )}
                {data.events.length > 0 && (
                  <section className="mt-10">
                    <h3 className="text-lg"><L en="In the record" fr="Dans le registre" /></h3>
                    <ul className="mt-4 border-t border-rule">
                      {data.events.map((e) => (
                        <li key={e.slug}>
                          <EventLink slug={e.slug} className="group grid grid-cols-[4.25rem_1fr] items-baseline gap-4 border-b border-rule py-3">
                            <span className="wdth-tight whitespace-nowrap text-base tabular-nums">
                              <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-[0.25em] rounded-full" style={{ background: DIMENSIONS[e.dimension].color }} aria-hidden />
                              {e.year}
                            </span>
                            <span>
                              <span className="block font-medium group-hover:text-dim"><L en={e.title} fr={e.titleFr} /></span>
                              <span className="block text-sm text-dim"><L en={e.label} fr={e.labelFr} />, {e.location}</span>
                            </span>
                          </EventLink>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {p.sources && p.sources.length > 0 && (
                  <section className="mt-8">
                    <h3 className="text-lg"><L en="Sources" fr="Sources" /></h3>
                    <ul className="mt-3 space-y-2 text-sm text-dim">
                      {p.sources.map((source, i) => (
                        <li key={source.url ?? `${source.title}-${i}`}>
                          {source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg">{source.title}</a> : source.title}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                <div className="mt-8 flex items-center gap-4"><ShareButton title={p.name} path={`/people/${p.slug}`} /><Link href={`/people/${p.slug}`} className="text-sm underline underline-offset-4"><L en="Open as a page" fr="Ouvrir comme une page" /></Link></div>
              </div>
            )}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

function useModalLink(kind: Target["kind"], slug: string) {
  const open = useContext(Ctx);
  return {
    href: `/${kind}/${slug}`,
    onClick: (e: React.MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open(kind, slug);
    },
  };
}

/** A link to a figure. A plain click opens the modal; new-tab clicks and shared links go to the full page. */
export function PersonLink({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  return <a {...useModalLink("people", slug)} className={className}>{children}</a>;
}

/** A link to a moment, opened over the current page the same way. */
export function EventLink({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  return <a {...useModalLink("events", slug)} className={className}>{children}</a>;
}

export function RecordLink({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  return <a {...useModalLink("records", slug)} className={className}>{children}</a>;
}
