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

type ParsedQuery = {
  normalized: string;
  words: string[];
  kind?: SearchKind;
  month?: number;
  day?: number;
  year?: number;
  startYear?: number;
  endYear?: number;
  hasDate: boolean;
};

/** Interpret common questions without sending any user searches to a remote AI. */
const QUERY_STOPWORDS = new Set([
  "a", "an", "and", "are", "at", "about", "all", "any", "by", "during", "did", "do", "does",
  "event", "events", "for", "find", "from", "give", "happened", "happens", "history", "historical",
  "how", "in", "is", "me", "of", "on", "please", "records", "search", "show",
  "tell", "the", "there", "to", "was", "were", "what", "when", "where", "which", "who",
  "with", "year", "years", "date", "dates", "people", "person", "figure", "figures",
  "au", "aux", "ce", "ces", "cette", "dans", "de", "des", "du", "en", "est", "et", "il",
  "la", "le", "les", "me", "moi", "nous", "ou", "par", "passe", "passee", "passee", "passe",
  "pour", "que", "quel", "quelle", "quels", "quelles", "qui", "recherche", "sur", "un", "une",
  "evenement", "evenements", "personnes", "faits", "histoire", "annee", "annees",
  "qu", "s", "l", "d", "c", "se", "etait", "etaient", "ont", "eu", "lieu", "quoi", "passer", "happen",
]);

function parseQuery(raw: string, today?: { month: number; day: number } | null): ParsedQuery {
  const normalized = normalize(raw);
  const tokens = normalized.split(" ").filter(Boolean);
  const kind: SearchKind | undefined =
    /\b(who was|who is|qui etait|qui est|biography|biographie|notable figures|personnalites)\b/.test(normalized) ? "figure" :
    /\b(what happened|what took place|events|evenements|que s est il passe|qu est ce qui s est passe)\b/.test(normalized) ? "event" :
    /\b(decd|decade|decennie|decennies|historical period|periode historique)\b/.test(normalized) ? "decade" :
    undefined;

  let year: number | undefined;
  let startYear: number | undefined;
  let endYear: number | undefined;
  let month: number | undefined;
  let day: number | undefined;
  const ignored = new Set<string>();
  const iso = raw.match(/\b((?:1\d{3}|20\d{2}))-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])\b/);
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
    ignored.add(iso[2]);
    ignored.add(String(month));
  }

  // Support unambiguous numeric dates too: 5/18/1803 and 18/5/1803.
  // For ambiguous dates (e.g. 5/6/1803), require a named month instead of guessing.
  const numericDate = !iso ? raw.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](1\d{3}|20\d{2})\b/) : null;
  if (numericDate) {
    const first = Number(numericDate[1]);
    const second = Number(numericDate[2]);
    if (first >= 1 && first <= 12 && second > 12 && second <= 31) {
      month = first;
      day = second;
    } else if (first > 12 && first <= 31 && second >= 1 && second <= 12) {
      day = first;
      month = second;
    }
    if (month && day) {
      year = Number(numericDate[3]);
      ignored.add(numericDate[1]);
      ignored.add(numericDate[2]);
    }
  }

  if (!month) {
    const found = MONTHS.findIndex((name, index) => {
      const english = normalize(name);
      const french = normalize(MONTHS_FR[index]);
      const aliases = [english, french, english.slice(0, 3)];
      return tokens.some((token) => aliases.includes(token));
    });
    if (found >= 0) {
      month = found + 1;
      const monthTokenIndex = tokens.findIndex((token) =>
        [normalize(MONTHS[found]), normalize(MONTHS_FR[found]), normalize(MONTHS[found]).slice(0, 3)].includes(token)
      );
      if (monthTokenIndex >= 0) ignored.add(tokens[monthTokenIndex]);
      const candidates = [
        tokens[monthTokenIndex + 1],
        tokens[monthTokenIndex - 1],
        tokens[monthTokenIndex + 2],
        tokens[monthTokenIndex - 2],
      ];
      const numericDay = candidates.find((token) => token && /^\d{1,2}$/.test(token) && Number(token) >= 1 && Number(token) <= 31);
      if (numericDay) day = Number(numericDay);
    }
  }

  if (today && (/\b(today|on this day|aujourd hui|ce jour)\b/.test(normalized))) {
    month = today.month;
    day = today.day;
  } else if (today && /\b(this month|ce mois)\b/.test(normalized)) {
    month = today.month;
  }

  const years = [...normalized.matchAll(/\b(1\d{3}|20\d{2})\b/g)].map((value) => Number(value[1]));
  const decadeMatch = normalized.match(/\b(1\d{2}0|20\d0)s\b/);
  const range = /\b(between|from|entre|de)\b/.test(normalized) && years.length >= 2;
  if (range) {
    startYear = Math.min(years[0], years[1]);
    endYear = Math.max(years[0], years[1]);
  } else if (decadeMatch) {
    startYear = Number(decadeMatch[1]);
    endYear = startYear + 9;
  } else if (!year && years.length === 1) {
    year = years[0];
  }
  if (month) ignored.add(normalize(MONTHS[month - 1]));
  if (month) ignored.add(normalize(MONTHS_FR[month - 1]));
  if (day) ignored.add(String(day));
  for (const y of years) ignored.add(String(y));
  if (decadeMatch) ignored.add(decadeMatch[0]);

  const words = tokens.filter((word) => !ignored.has(word) && !QUERY_STOPWORDS.has(word));
  // "Haiti" adds no useful distinction when another term or date is provided.
  const meaningful = words.length > 1 || Boolean(month || year || startYear);
  const filtered = meaningful ? words.filter((word) => !["haiti", "haitian", "haitiens", "haitiennes"].includes(word)) : words;

  return { normalized, words: filtered, kind, month, day, year, startYear, endYear, hasDate: Boolean(month || year || startYear) };
}

/** Date constraints are strict: match the event's dated record, never invent an answer. */
function dateMatch(entry: SearchRecord, query: ParsedQuery): boolean {
  if (!query.hasDate) return true;
  if (entry.kind !== "event" && entry.kind !== "decade") return false;
  if (entry.kind === "decade" && (query.month || query.kind === "event")) return false;
  if (query.month && entry.month !== query.month) return false;
  if (query.day && entry.day !== query.day) return false;
  if (query.year != null) {
    if (entry.kind === "event" && entry.year !== query.year) return false;
    if (entry.kind === "decade" && !(entry.year != null && entry.yearEnd != null && query.year >= entry.year && query.year <= entry.yearEnd)) return false;
  }
  if (query.startYear != null && query.endYear != null) {
    if (entry.year == null) return false;
    if (entry.kind === "event" && (entry.year < query.startYear || entry.year > query.endYear)) return false;
    if (entry.kind === "decade" && (entry.year > query.endYear || (entry.yearEnd ?? entry.year) < query.startYear)) return false;
  }
  return true;
}

function score(entry: SearchRecord, query: ParsedQuery): number {
  if (!query.normalized || (query.kind && entry.kind !== query.kind) || !dateMatch(entry, query)) return -1;
  const title = normalize([entry.title, entry.titleFr].filter(Boolean).join(" "));
  const titleEnglish = normalize(entry.title);
  const frenchTitle = normalize(entry.titleFr ?? "");
  const description = normalize([entry.description, entry.descriptionFr, entry.detail, entry.detailFr].filter(Boolean).join(" "));
  const extra = normalize(entry.terms);
  const haystack = title + " " + description + " " + extra;

  if (query.words.length && !query.words.every((word) => haystack.includes(word))) return -1;
  if (!query.words.length && !query.hasDate && !query.kind) return -1;

  const phrase = query.words.join(" ");
  let result = 20;
  if (phrase) {
    if (titleEnglish === phrase || frenchTitle === phrase) result += 240;
    else if (titleEnglish.startsWith(phrase) || frenchTitle.startsWith(phrase)) result += 145;
    else if (title.includes(phrase)) result += 110;
    else if (query.words.every((word) => title.includes(word))) result += 75;
    else if (description.includes(phrase)) result += 45;
    else if (extra.includes(phrase)) result += 20;
  }
  if (query.month && query.day && entry.kind === "event") result += 235;
  else if (query.month && entry.kind === "event") result += 155;
  if (query.year != null && entry.kind === "event") result += 115;
  if (query.startYear != null && entry.kind === "event") result += 95;
  if (entry.kind === "decade" && query.hasDate) result += 60;
  if (entry.kind === "figure" && query.kind === "figure") result += 90;
  if (entry.kind === "event" && query.kind === "event") result += 50;
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

  const parsedQuery = useMemo(() => parseQuery(query, today), [query, today]);
  const ranked = useMemo<Ranked[]>(() => {
    if (!parsedQuery.normalized) return [];
    return entries
      .map((item) => ({ item, score: score(item, parsedQuery) }))
      .filter((hit) => hit.score >= 0)
      .sort((a, b) =>
        b.score - a.score ||
        a.item.title.localeCompare(b.item.title, "en", { sensitivity: "base" })
      );
  }, [entries, parsedQuery]);

  const interpretedSearch = useMemo(() => {
    if (parsedQuery.month) {
      const dateEnglish = MONTHS[parsedQuery.month - 1] + (parsedQuery.day ? " " + parsedQuery.day : "");
      const dateFrench = (parsedQuery.day ? parsedQuery.day + " " : "") + MONTHS_FR[parsedQuery.month - 1];
      const yearEnglish = parsedQuery.year != null ? ", " + parsedQuery.year : " across recorded years";
      const yearFrench = parsedQuery.year != null ? " " + parsedQuery.year : ", toutes années confondues";
      return {
        en: "Searching dated events for " + dateEnglish + yearEnglish,
        fr: "Recherche des événements datés du " + dateFrench + yearFrench,
      };
    }
    if (parsedQuery.startYear != null && parsedQuery.endYear != null) {
      return {
        en: "Searching records from " + parsedQuery.startYear + " to " + parsedQuery.endYear,
        fr: "Recherche des notices de " + parsedQuery.startYear + " à " + parsedQuery.endYear,
      };
    }
    if (parsedQuery.year != null) {
      return {
        en: "Searching the year " + parsedQuery.year,
        fr: "Recherche dans l’année " + parsedQuery.year,
      };
    }
    if (parsedQuery.kind === "figure") return { en: "Searching notable figures", fr: "Recherche de personnalités marquantes" };
    if (parsedQuery.kind === "event") return { en: "Searching historical events", fr: "Recherche d’événements historiques" };
    return null;
  }, [parsedQuery]);

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
      output.push({ key: "flag-day", label: "May 18 · Haitian Flag Day", labelFr: "18 mai · Fête du Drapeau", query: "What happened on May 18?" });
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
    const dated = entries.find((entry) => entry.kind === "event" && entry.month && entry.day);
    const available = [
      { label: "What happened in 1804?", query: "What happened in 1804?" },
      { label: "Who was Toussaint Louverture?", query: "Who was Toussaint Louverture?" },
      { label: "Music in the 1950s", query: "Music in the 1950s" },
      ...(dated ? [{
        label: "What happened on " + MONTHS[dated.month! - 1] + " " + dated.day + "?",
        query: "What happened on " + MONTHS[dated.month! - 1] + " " + dated.day + "?",
      }] : []),
    ];
    return available.filter((value) => entries.some((entry) => score(entry, parseQuery(value.query)) >= 0));
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
          {interpretedSearch && (
            <p className="mt-6 text-sm leading-relaxed text-dim" aria-live="polite">
              <L en={interpretedSearch.en} fr={interpretedSearch.fr} />
            </p>
          )}
          <p className="mt-5 text-sm tabular-nums text-dim" aria-live="polite">
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
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-dim">
                {parsedQuery.hasDate
                  ? <L en="No matching dated entries have been added to this archive yet. Try a broader period or topic. This does not mean nothing happened on that date."
                       fr="Aucune notice correspondant à cette date n’a encore été ajoutée aux archives. Essayez une période ou un thème plus large. Cela ne signifie pas qu’aucun événement n’a eu lieu." />
                  : <L en="Try another spelling, a shorter phrase, or remove the filter."
                       fr="Essayez une autre orthographe, une expression plus courte ou retirez le filtre." />}
              </p>
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
