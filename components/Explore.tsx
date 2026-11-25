"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";
import Icon from "./Icon";
import { t, type Locale } from "@/lib/i18n";

type Opt = [string, string];
export type ExploreOptions = { causes: Opt[]; places: Opt[] };
const KEYS = ["q", "cause", "place", "status", "sort"] as const;

/** Filters apply as soon as they change; results dim while the next set loads. */
export default function ExploreShell({ locale, options, total, children }: { locale: Locale; options: ExploreOptions; total: number; children: React.ReactNode }) {
  const x = t(locale).x.explore, n = t(locale).x.nav;
  const router = useRouter(), path = usePathname(), sp = useSearchParams();
  const [busy, start] = useTransition();
  const drawer = useRef<HTMLDialogElement>(null);
  const get = (k: string) => sp.get(k) ?? "";
  const push = (patch: Record<string, string>) => {
    const next = new URLSearchParams(sp);
    for (const [k, v] of Object.entries(patch)) { if (v) next.set(k, v); else next.delete(k); }
    next.delete("page");
    const s = next.toString();
    start(() => router.replace(`${path}${s ? `?${s}` : ""}`, { scroll: false }));
  };
  const statusOpts: Opt[] = [["", x.open], ["completed", x.completed], ["all", x.all]];
  const sortOpts: Opt[] = [["", x.newest], ["updated", x.updated], ["urgent", x.urgent]];
  const label = (opts: Opt[], v: string) => opts.find(([k]) => k === v)?.[1] ?? v;
  const chips: [string, string][] = [];
  if (get("q")) chips.push(["q", `“${get("q")}”`]);
  if (get("cause")) chips.push(["cause", label(options.causes, get("cause"))]);
  if (get("place")) chips.push(["place", label(options.places, get("place"))]);
  if (get("status")) chips.push(["status", label(statusOpts, get("status"))]);
  if (get("emergency")) chips.push(["emergency", t(locale).campaign.emergency]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const live = (v: string) => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => push({ q: v.trim() }), 450); };
  const active = chips.filter(([k]) => k !== "q").length;
  return (
    <>
      <div className="explore-head">
        <div className="stack tight"><h1>{x.title}</h1><p className="muted">{x.sub}</p></div>
        <div className="finder">
          <form role="search" className="searchbar" onSubmit={(e) => { e.preventDefault(); if (timer.current) clearTimeout(timer.current); push({ q: String(new FormData(e.currentTarget).get("q") ?? "").trim() }); }}>
            <Icon name="search" />
            <label htmlFor="explore-q" className="sr">{n.searchLabel}</label>
            <input key={get("q")} id="explore-q" name="q" type="search" defaultValue={get("q")} placeholder={n.searchHint} maxLength={60} enterKeyHint="search" onChange={(e) => live(e.target.value)} />
          </form>
          <button type="button" className="btn filter-btn" onClick={() => drawer.current?.showModal()} aria-haspopup="dialog">
            <Icon name="filter" size={18} /><span>{x.filters}</span>{active > 0 && <span className="count">{active}</span>}
          </button>
        </div>
      </div>

      <div className="results-line" aria-live="polite">
        <span><strong>{x.results(total)}</strong>{get("q") ? ` ${x.matching(get("q"))}` : ""}</span>
        {busy && <span className="row tight"><Icon name="spinner" size={16} className="icon spin" />{x.searching}</span>}
      </div>
      {chips.length > 0 && (
        <div className="active-filters">
          {chips.map(([k, v]) => (
            <span key={k} className="chip on">{v}<button type="button" aria-label={x.removeFilter(v)} onClick={() => push({ [k]: "" })}><Icon name="close" size={14} /></button></span>
          ))}
          <button type="button" className="link small" onClick={() => start(() => router.replace(path, { scroll: false }))}>{x.clearAll}</button>
        </div>
      )}

      <div className="results" data-busy={busy} aria-busy={busy}>{children}</div>

      <dialog ref={drawer} className="drawer" aria-label={x.filters} onClick={(e) => e.target === drawer.current && drawer.current?.close()}>
        <div className="drawer-head"><h2>{x.filters}</h2><button type="button" className="btn icon-only" autoFocus onClick={() => drawer.current?.close()} aria-label={t(locale).x.common.close}><Icon name="close" /></button></div>
        <div className="drawer-body">
          {([["cause", x.cause, options.causes, x.anyCause], ["place", x.location, options.places, x.anywhere], ["status", x.status, statusOpts, null], ["sort", x.sort, sortOpts, null]] as [string, string, Opt[], string | null][]).map(([key, title, opts, all]) => (
            <fieldset key={key} className="field">
              <legend>{title}</legend>
              <div className="row tight" style={{ marginTop: 6 }}>
                {all !== null && <button type="button" className={`chip ${!get(key) ? "on" : ""}`} aria-pressed={!get(key)} onClick={() => push({ [key]: "" })}>{all}</button>}
                {opts.filter(([k]) => all === null || k).map(([k, v]) => <button key={k} type="button" className={`chip ${get(key) === k ? "on" : ""}`} aria-pressed={get(key) === k} onClick={() => push({ [key]: k })}>{v}</button>)}
              </div>
            </fieldset>
          ))}
        </div>
        <div className="drawer-foot">
          {chips.length > 0 && <button className="btn" onClick={() => start(() => router.replace(path, { scroll: false }))}>{x.clearAll}</button>}
          <button className="btn primary grow" onClick={() => drawer.current?.close()}>{x.showResults} ({total})</button>
        </div>
      </dialog>
    </>
  );
}
