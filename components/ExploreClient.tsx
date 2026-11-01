"use client";
import L from "@/components/L";
import SubjectLinks from "@/components/SubjectLinks";
import { useT } from "@/components/Prefs";
import Link from "next/link";
import { PersonLink } from "@/components/PersonModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { DIMENSIONS } from "@/lib/site";
import type { Category, Dimension, EventFr, EvidenceStatus } from "@/lib/types";

type Item = {
  fr?: EventFr; labelFr?: string; slug: string; title: string; summary: string; year: number; label: string; location: string;
  dimension: Dimension; categories: string[]; countries: string[]; period: string; people: string[]; status: EvidenceStatus;
};

type Props = {
  items: Item[];
  people: { slug: string; name: string; role: string }[];
  categories: Category[];
  periods: { slug: string; label: string; labelFr?: string }[];
  countries: string[];
  initial: { q: string; category: string; country: string; period: string };
};

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function ExploreClient({ items, people, categories, periods, countries, initial }: Props) {
  const t = useT();
  const [q, setQ] = useState(initial.q);
  const [dim, setDim] = useState<Dimension | "">("");
  const [category, setCategory] = useState(initial.category);
  const [country, setCountry] = useState(initial.country);
  const [period, setPeriod] = useState(initial.period);
  const input = useRef<HTMLInputElement>(null);

  // "/" focuses search, like the tools people already know
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); input.current?.focus(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // Keep the URL shareable
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (country) p.set("country", country);
    if (period) p.set("period", period);
    const s = p.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  }, [q, category, country, period]);

  const terms = norm(q).split(/\s+/).filter(Boolean);
  const results = useMemo(() => items.filter((i) => {
    if (dim && i.dimension !== dim) return false;
    if (category && !i.categories.includes(category)) return false;
    if (country && !i.countries.includes(country)) return false;
    if (period && i.period !== period) return false;
    if (!terms.length) return true;
    const hay = norm([i.title, i.summary, i.location, String(i.year), ...i.countries, ...i.people].join(" "));
    return terms.every((t) => hay.includes(t));
  }), [items, dim, category, country, period, terms.join(" ")]);

  const personHits = terms.length ? people.filter((p) => terms.every((t) => norm(p.name + " " + p.role).includes(t))) : [];
  const active = Boolean(q || dim || category || country || period);

  const select = "h-11 rounded-full border border-rule bg-base px-4 text-base text-fg outline-none focus:border-fg sm:h-auto sm:py-2 sm:text-sm";

  return (
    <div>
      <label htmlFor="q" className="sr-only">{t("Search", "Recherche")}</label>
      <input
        id="q"
        ref={input}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("A year, a name, a place…", "Une année, un nom, un lieu…")}
        type="search"
        enterKeyHint="search"
        className="w-full rounded-none border-b-2 border-rule bg-transparent pb-3 text-xl placeholder:text-dim/50 focus:border-fg focus:outline-none focus-visible:outline-none"
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(DIMENSIONS) as Dimension[]).map((d) => (
          <button key={d} className="pill" data-on={dim === d} onClick={() => setDim(dim === d ? "" : d)}>
            <span className="h-2 w-2 rounded-full" style={{ background: DIMENSIONS[d].color }} /><L en={DIMENSIONS[d].label} fr={DIMENSIONS[d].labelFr} />
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <select aria-label={t("Subject", "Thème")} value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
          <option value="">{t("Any subject", "Tout thème")}</option>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{t(c.name, c.nameFr)}</option>)}
        </select>
        <select aria-label={t("Period", "Période")} value={period} onChange={(e) => setPeriod(e.target.value)} className={select}>
          <option value="">{t("Any period", "Toute période")}</option>
          {periods.map((p) => <option key={p.slug} value={p.slug}>{t(p.label, p.labelFr)}</option>)}
        </select>
        <select aria-label={t("Country", "Pays")} value={country} onChange={(e) => setCountry(e.target.value)} className={select}>
          <option value="">{t("Any country", "Tout pays")}</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {active && (
          <button className="h-11 px-3 text-left text-sm text-dim hover:text-fg sm:h-auto" onClick={() => { setQ(""); setDim(""); setCategory(""); setCountry(""); setPeriod(""); }}>
            <L en="Clear all" fr="Tout effacer" />
          </button>
        )}
      </div>

      {personHits.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3">
          {personHits.map((p) => (
            <PersonLink key={p.slug} slug={p.slug} className="rounded-2xl bg-raise px-5 py-3 hover:bg-lift">
              <span className="block font-semibold">{p.name}</span>
              <span className="block text-sm text-dim">{p.role}</span>
            </PersonLink>
          ))}
        </div>
      )}

      <p className="mt-10 text-sm text-dim" aria-live="polite">{results.length} {results.length === 1 ? "moment" : "moments"}</p>
      <ul className="mt-3 border-t border-rule">
        {results.map((i) => (
          <li key={i.slug} className="border-b border-rule pb-4">
            <Link href={`/events/${i.slug}`} className="group grid grid-cols-[4.5rem_1fr] gap-5 py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline">
              <span className="wdth-tight whitespace-nowrap text-2xl tabular-nums"><span className="mr-2 inline-block h-2 w-2 -translate-y-[0.3em] rounded-full align-middle" style={{ background: DIMENSIONS[i.dimension].color }} aria-hidden />{i.year}</span>
              <span className="min-w-0">
                <span className="block text-lg font-medium leading-snug group-hover:text-dim"><L en={i.title} fr={i.fr?.title} /></span>
                <span className="mt-1 block text-[0.95rem] leading-relaxed text-dim line-clamp-2"><L en={i.summary} fr={i.fr?.summary} /></span>
              </span>
              <span className="col-start-2 text-sm text-dim sm:col-start-auto">
                {i.location}
              </span>
            </Link>
            <SubjectLinks slugs={i.categories} compact className="ml-[5.75rem] sm:ml-[7.25rem]" />
          </li>
        ))}
      </ul>
      {results.length === 0 && (
        <p className="mt-10 max-w-lg text-lg text-dim">
          <L en="Nothing matches yet. Try a broader word, remove a filter, or browse a decade from the home page." fr="Rien ne correspond pour l’instant. Essayez un mot plus large, retirez un filtre ou parcourez une décennie depuis l’accueil." />
        </p>
      )}
    </div>
  );
}
