"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import L from "@/components/L";
import { useT } from "@/components/Prefs";
import type { SourceEntry, SourceKind } from "@/lib/sources-index";

const GROUPS: { id: SourceKind; en: string; fr: string }[] = [
  { id: "events", en: "Historical events", fr: "Événements historiques" },
  { id: "figures", en: "Notable figures", fr: "Personnalités marquantes" },
  { id: "records", en: "Historical records", fr: "Notices historiques" },
  { id: "reading", en: "Books & further reading", fr: "Livres et bibliographie" },
  { id: "collections", en: "Archive collections", fr: "Collections d’archives" },
  { id: "images", en: "Image credits", fr: "Crédits des images" },
];

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function SourcesBrowser({ entries }: { entries: SourceEntry[] }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SourceKind | "">("");
  const [limit, setLimit] = useState(50);
  const total = entries.length;
  const results = useMemo(() => {
    const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
    return entries.filter((entry) => {
      if (kind && entry.kind !== kind) return false;
      if (!terms.length) return true;
      const haystack = normalize([
        entry.title, entry.description ?? "", entry.credit ?? "", entry.language ?? "",
        ...entry.uses.map((use) => use.title),
      ].join(" "));
      return terms.every((term) => haystack.includes(term));
    });
  }, [entries, kind, query]);
  const displayed = results.slice(0, limit);

  return (
    <div>
      <div className="mt-10 grid gap-3 sm:grid-cols-[1fr_17rem]">
        <label className="block">
          <span className="sr-only"><L en="Search sources" fr="Rechercher une source" /></span>
          <input
            type="search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setLimit(50); }}
            placeholder={t("Search a publication, archive, author or event", "Chercher une publication, une archive, un auteur ou un événement")}
            className="h-12 w-full rounded-full border border-rule bg-base px-5 text-base text-fg outline-none focus:border-fg"
          />
        </label>
        <label className="block">
          <span className="sr-only"><L en="Filter source type" fr="Filtrer le type de source" /></span>
          <select
            value={kind}
            onChange={(event) => { setKind(event.target.value as SourceKind | ""); setLimit(50); }}
            className="h-12 w-full rounded-full border border-rule bg-base px-4 text-base text-fg outline-none focus:border-fg"
          >
            <option value="">{t("All source types", "Tous les types de sources")}</option>
            {GROUPS.map((group) => (
              <option key={group.id} value={group.id}>{t(group.en, group.fr)}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-7 text-sm tabular-nums text-dim" aria-live="polite">
        <L
          en={`${results.length} of ${total} references`}
          fr={`${results.length} références sur ${total}`}
        />
      </p>
      {results.length === 0 && (
        <p className="mt-8 text-dim"><L en="No references match this search." fr="Aucune référence ne correspond à cette recherche." /></p>
      )}
      <ol className="mt-3 divide-y divide-rule border-t border-rule">
        {displayed.map((entry) => {
          const group = GROUPS.find((item) => item.id === entry.kind)!;
          return (
            <li key={entry.id} className="grid gap-3 py-6 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <p className="text-xs font-medium text-dim"><L en={group.en} fr={group.fr} /></p>
              <div className="min-w-0">
                <div className="text-base font-medium leading-snug break-words">
                  {entry.url ? (
                    <a href={entry.url} target="_blank" rel="noopener noreferrer" className="underline decoration-rule underline-offset-4 hover:decoration-fg">
                      {entry.title}
                    </a>
                  ) : entry.title}
                </div>
                {entry.description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dim">{entry.description}</p>}
                {(entry.credit || entry.license || entry.language) && (
                  <p className="mt-2 text-xs text-dim">
                    {[entry.credit, entry.license, entry.language].filter(Boolean).join(" · ")}
                  </p>
                )}
                {entry.uses.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-dim">
                    <span><L en="Used in:" fr="Utilisée dans :" /></span>
                    {entry.uses.slice(0, 5).map((use) => (
                      <Link key={use.href} href={use.href} className="underline decoration-rule underline-offset-4 hover:text-fg">{use.title}</Link>
                    ))}
                    {entry.uses.length > 5 && (
                      <span><L en={`and ${entry.uses.length - 5} more`} fr={`et ${entry.uses.length - 5} autres`} /></span>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {results.length > limit && (
        <button
          type="button"
          onClick={() => setLimit((current) => current + 50)}
          className="mt-8 rounded-full border border-rule px-6 py-3 text-sm font-medium hover:border-fg"
        >
          <L en={`Load more sources (${results.length - limit} remaining)`} fr={`Afficher plus de sources (${results.length - limit} restantes)`} />
        </button>
      )}
    </div>
  );
}
