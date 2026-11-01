"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import L from "@/components/L";
import { useT } from "@/components/Prefs";
import type { SearchKind, SearchRecord } from "@/lib/search-index";

const TYPES: { id: SearchKind; en: string; fr: string }[] = [
  { id: "event", en: "Events", fr: "Événements" },
  { id: "figure", en: "Notable figures", fr: "Personnalités" },
  { id: "decade", en: "Decades", fr: "Décennies" },
  { id: "subject", en: "Subjects", fr: "Thèmes" },
  { id: "record", en: "Records", fr: "Notices" },
];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const normalize = (text: string) => text
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/\b(\d{1,2})(st|nd|rd|th)\b/g, "$1")
  .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");

function dateIntent(query: string): { month: number; day: number } | null {
  const parts = normalize(query).split(" ");
  const month = MONTHS.findIndex((name, index) =>
    parts.includes(normalize(name)) || parts.includes(normalize(MONTHS_FR[index]))
  );
  if (month < 0) return null;
  const day = parts.map(Number).find((n) => Number.isInteger(n) && n >= 1 && n <= 31);
  return day ? { month: month + 1, day } : null;
}

function score(entry: SearchRecord, raw: string): number {
  const q = normalize(raw);
  if (!q) return -1;
  const title = normalize([entry.title, entry.titleFr].filter(Boolean).join(" "));
  const titleEnglish = normalize(entry.title);
  const description = normalize([entry.description, entry.descriptionFr, entry.detail, entry.detailFr].filter(Boolean).join(" "));
  const extra = normalize(entry.terms);
  const exactDate = dateIntent(q);
  if (exactDate) {
    if (entry.kind === "event" && entry.month === exactDate.month && entry.day === exactDate.day) return 280;
    if (!title.includes(q) && !description.includes(q)) return -1;
  }
  const tokens = q.split(" ").filter(Boolean);
  const haystack = title + " " + description + " " + extra;
  const matchedYear = /^\d{4}$/.test(q) && Number(q) === entry.year;
  const inPeriod = /^\d{4}$/.test(q) && entry.kind === "decade"
    && entry.year != null && entry.yearEnd != null
    && Number(q) >= entry.year && Number(q) <= entry.yearEnd;
  if (!tokens.every((term) => haystack.includes(term)) && !matchedYear && !inPeriod) return -1;

  let result = 10;
  if (titleEnglish === q || normalize(entry.titleFr ?? "") === q) result += 200;
  else if (titleEnglish.startsWith(q) || normalize(entry.titleFr ?? "").startsWith(q)) result += 135;
  else if (title.includes(q)) result += 100;
  else if (tokens.every((term) => title.includes(term))) result += 65;
  else if (description.includes(q)) result += 45;
  else if (extra.includes(q)) result += 18;

  if (matchedYear) result += entry.kind === "event" ? 100 : 45;
  if (inPeriod) result += 85;
  if (entry.kind === "subject" && tokens.every((term) => title.includes(term))) result += 35;
  if (entry.kind === "figure" && title.includes(q)) result += 25;
  if (entry.kind === "event" && entry.month && entry.day && exactDate) result += 80;
  return result;
}

type Ranked = { item: SearchRecord; score: number };

function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[b.length];
}

export default function SmartSearch({ entries, initialQuery = "", initialType = "" }: {
  entries: SearchRecord[];
  initialQuery?: string;
  initialType?: string;
}) {
  const t = useT();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [kind, setKind] = useState<SearchKind | "">(
    TYPES.some((type) => type.id === initialType) ? initialType as SearchKind : ""
  );
  const [focused, setFocused] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [limit, setLimit] = useState(24);
  const [today, setToday] = useState<{ month: number; day: number } | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday({ month: now.getMonth() + 1, day: now.getDate() });
    const onKey = (event: KeyboardEvent) => {
      const active = document.activeElement;
      const typing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || (active instanceof HTMLElement && active.isContentEditable);
      if ((event.key === "/" && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    if (kind) params.set("type", kind);
    else params.delete("type");
    const next = params.toString();
    const path = window.location.pathname + (next ? "?" + next : "");
    window.history.replaceState(window.history.state, "", path);
  }, [query, kind]);

  useEffect(() => {
    setSelectedSuggestion(-1);
    setLimit(24);
  }, [query, kind]);

  const ranked = useMemo<Ranked[]>(() => {
    if (!normalize(query)) return [];
    return entries
      .map((item) => ({ item, score: score(item, query) }))
      .filter((hit) => hit.score >= 0)
      .sort((a, b) =>
        b.score - a.score ||
        a.item.title.localeCompare(b.item.title, "en", { sensitivity: "base" })
      );
  }, [entries, query]);

  const counts = useMemo(() => {
    const output: Partial<Record<SearchKind, number>> = {};
    for (const hit of ranked) output[hit.item.kind] = (output[hit.item.kind] ?? 0) + 1;
    return output;
  }, [ranked]);

  const filtered = kind ? ranked.filter((hit) => hit.item.kind === kind) : ranked;
  const suggestions = filtered.slice(0, 6);
  const suggestionsOpen = focused && normalize(query).length >= 2 && suggestions.length > 0;

  const monthSuggestions = useMemo(() => {
    if (!today) return [] as { key: string; label: string; labelFr: string; query: string }[];
    const relevant = entries.filter((entry) => entry.kind === "event" && entry.month === today.month && entry.day != null);
    const byDay = [...relevant].sort((a, b) =>
      Math.abs((a.day ?? 0) - today.day) - Math.abs((b.day ?? 0) - today.day) ||
      (a.day ?? 0) - (b.day ?? 0)
    );
    const seen = new Set<number>();
    const output: { key: string; label: string; labelFr: string; query: string }[] = [];
    if (today.month === 5) {
      // Haiti's Flag Day falls on May 18. Show it as a search prompt, never as an invented archive result.
      output.push({ key: "flag-day", label: "May 18 · Haitian Flag Day", labelFr: "18 mai · Fête du Drapeau", query: "flag" });
      seen.add(18);
    }
    for (const entry of byDay) {
      if (output.length >= 4) break;
      const day = entry.day!;
      if (seen.has(day)) continue;
      seen.add(day);
      const date = MONTHS[today.month - 1] + " " + day;
      const dateFr = day + " " + MONTHS_FR[today.month - 1];
      output.push({
        key: entry.id,
        label: date + " · " + entry.title,
        labelFr: dateFr + " · " + (entry.titleFr ?? entry.title),
        query: date,
      });
    }
    return output;
  }, [entries, today]);

  const starterQueries = useMemo(() => {
    const available = [
      { label: "Independence", query: "independence" },
      { label: "1804", query: "1804" },
      { label: "Haitian music", query: "music" },
      { label: "Toussaint Louverture", query: "Toussaint Louverture" },
    ];
    return available.filter((value) => entries.some((entry) => score(entry, value.query) >= 0));
  }, [entries]);

  const alternative = useMemo(() => {
    const q = normalize(query);
    if (ranked.length || q.length < 4 || q.includes(" ") || q.length > 24) return [] as string[];
    const options = new Set<string>();
    for (const entry of entries) {
      for (const candidate of [entry.title, entry.titleFr]) {
        if (!candidate) continue;
        for (const word of normalize(candidate).split(" ")) {
          if (word.length >= 4 && Math.abs(word.length - q.length) <= 2 && editDistance(q, word) <= 2) {
            options.add(word);
            if (options.size >= 5) return [...options];
          }
        }
      }
    }
    return [...options];
  }, [entries, query, ranked.length]);

  const applyQuery = (next: string) => {
    setQuery(next);
    setKind("");
    setFocused(false);
    inputRef.current?.focus();
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setFocused(false);
      setSelectedSuggestion(-1);
      return;
    }
    if (event.key === "ArrowDown" && suggestionsOpen) {
      event.preventDefault();
      setSelectedSuggestion((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestionsOpen) {
      event.preventDefault();
      setSelectedSuggestion((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      if (suggestionsOpen && selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        event.preventDefault();
        setFocused(false);
        router.push(suggestions[selectedSuggestion].item.href);
      } else {
        setFocused(false);
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div>
      <div className="relative mt-9" onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
      }}>
        <label htmlFor="archive-search" className="sr-only"><L en="Search Haitian history" fr="Rechercher dans l’histoire d’Haïti" /></label>
        <div className="relative">
          <svg className="pointer-events-none absolute left-4 top-[1.15rem] text-dim" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5"/>
          </svg>
          <input
            ref={inputRef}
            id="archive-search"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="search-autocomplete"
            aria-expanded={suggestionsOpen}
            aria-activedescendant={selectedSuggestion >= 0 && suggestionsOpen ? "suggestion-" + selectedSuggestion : undefined}
            placeholder={t("Search a name, year, subject, date, or event…", "Cherchez un nom, une année, un thème, une date ou un événement…")}
            value={query}
            onFocus={() => setFocused(true)}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            className="h-16 w-full rounded-2xl border border-rule bg-base pl-12 pr-12 text-base text-fg outline-none placeholder:text-dim focus:border-fg sm:text-lg"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="absolute right-3 top-3 rounded-full px-3 py-2 text-xl text-dim hover:text-fg" aria-label={t("Clear search", "Effacer la recherche")}>×</button>
          )}
        </div>
        {suggestionsOpen && (
          <ul id="search-autocomplete" role="listbox" aria-label={t("Search suggestions", "Suggestions de recherche")} className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-30 max-h-[22rem] overflow-y-auto rounded-2xl border border-rule bg-base p-2 shadow-xl shadow-black/10">
            {suggestions.map(({ item }, index) => (
              <li id={"suggestion-" + index} key={item.id} role="option" aria-selected={selectedSuggestion === index}>
                <Link href={item.href} onMouseDown={(event) => event.preventDefault()} onClick={() => setFocused(false)}
                  className={"flex items-center justify-between gap-4 rounded-xl px-3 py-3 hover:bg-raise " + (selectedSuggestion === index ? "bg-raise" : "")}>
                  <span className="min-w-0 truncate text-sm font-medium"><L en={item.title} fr={item.titleFr} /></span>
                  <span className="shrink-0 text-xs text-dim">{t(TYPES.find((type) => type.id === item.kind)?.en ?? "", TYPES.find((type) => type.id === item.kind)?.fr)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!normalize(query) ? (
        <div className="mt-12 space-y-10">
          {monthSuggestions.length > 0 && (
            <section>
              <h2 className="text-xl"><L en="This month in Haitian history" fr="Ce mois-ci dans l’histoire d’Haïti" /></h2>
              <p className="mt-2 text-sm text-dim"><L en="Calendar-based suggestions from the historical archive." fr="Suggestions liées au calendrier et aux archives historiques." /></p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {monthSuggestions.map((suggestion) => (
                  <button type="button" key={suggestion.key} onClick={() => applyQuery(suggestion.query)}
                    className="rounded-xl border border-rule px-4 py-4 text-left text-sm leading-relaxed hover:border-fg">
                    <L en={suggestion.label} fr={suggestion.labelFr} />
                  </button>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="text-xl"><L en="Search ideas" fr="Idées de recherche" /></h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {starterQueries.map((entry) => (
                <button type="button" key={entry.query} onClick={() => applyQuery(entry.query)} className="pill">
                  {entry.label}
                </button>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-dim">
              <L en="Results appear when you search. Try a date such as May 18, a person, or an event. Press / or Ctrl+K to focus search."
                 fr="Les résultats apparaissent dès que vous saisissez une recherche. Essayez une date comme le 18 mai, une personne ou un événement. Appuyez sur / ou Ctrl+K pour rechercher." />
            </p>
          </section>
        </div>
      ) : (
        <section className="mt-8" aria-label={t("Search results", "Résultats de recherche")}>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label={t("Filter result type", "Filtrer le type de résultat")}>
            <button type="button" aria-pressed={!kind} onClick={() => setKind("")} className="pill shrink-0" data-on={!kind}>
              <L en="All" fr="Tous" /> <span className="text-xs opacity-70">{ranked.length}</span>
            </button>
            {TYPES.map((type) => (
              <button key={type.id} type="button" aria-pressed={kind === type.id} data-on={kind === type.id}
                onClick={() => setKind(kind === type.id ? "" : type.id)} className="pill shrink-0">
                {t(type.en, type.fr)} <span className="text-xs opacity-70">{counts[type.id] ?? 0}</span>
              </button>
            ))}
          </div>
          <p className="mt-8 text-sm tabular-nums text-dim" aria-live="polite">
            <L en={filtered.length + (filtered.length === 1 ? " result" : " results")}
               fr={filtered.length + (filtered.length === 1 ? " résultat" : " résultats")} />
          </p>
          {filtered.length > 0 ? (
            <>
              <ul className="mt-3 divide-y divide-rule border-t border-rule">
                {filtered.slice(0, limit).map(({ item }) => (
                  <li key={item.id}>
                    <Link href={item.href} className="group block py-5">
                      <span className="text-xs text-dim">
                        {t(TYPES.find((type) => type.id === item.kind)?.en ?? "", TYPES.find((type) => type.id === item.kind)?.fr)}
                        {item.detail && <> · <L en={item.detail} fr={item.detailFr} /></>}
                      </span>
                      <span className="mt-1.5 block text-lg font-medium leading-snug group-hover:underline"><L en={item.title} fr={item.titleFr} /></span>
                      {item.description && (
                        <span className="mt-2 block max-w-[48rem] line-clamp-2 text-sm leading-relaxed text-dim">
                          <L en={item.description} fr={item.descriptionFr} />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              {filtered.length > limit && (
                <button type="button" onClick={() => setLimit((value) => value + 24)}
                  className="mt-8 rounded-full border border-rule px-6 py-3 text-sm hover:border-fg">
                  <L en={"Show more (" + (filtered.length - limit) + " remaining)"}
                     fr={"Afficher plus (" + (filtered.length - limit) + " restants)"} />
                </button>
              )}
            </>
          ) : (
            <div className="mt-6 border-t border-rule pt-7">
              <h2 className="text-xl"><L en="No matching results" fr="Aucun résultat correspondant" /></h2>
              <p className="mt-3 text-sm text-dim"><L en="Try another spelling, a shorter phrase, or remove the filter." fr="Essayez une autre orthographe, une expression plus courte ou retirez le filtre." /></p>
              {alternative.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-dim"><L en="Did you mean" fr="Vouliez-vous dire" /></span>
                  {alternative.map((word) => (
                    <button key={word} type="button" className="pill" onClick={() => applyQuery(word)}>{word}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
