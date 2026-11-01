import type { Metadata } from "next";
import L from "@/components/L";
import SmartSearch from "@/components/SmartSearch";
import { getContent } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Haitian history, decades, subjects, notable figures, events and archival records in English or French.",
};
export const revalidate = 3600;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const type = typeof params.type === "string" ? params.type : "";
  const content = await getContent();
  const index = buildSearchIndex(content);
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <header>
        <h1 className="text-d-2"><L en="Search" fr="Recherche" /></h1>
        <p className="read mt-4">
          <L
            en="Find historical events, notable figures, subjects, decades, and records across Haiti’s history."
            fr="Retrouvez des événements historiques, des personnalités, des thèmes, des décennies et des notices de l’histoire d’Haïti."
          />
        </p>
      </header>
      <SmartSearch entries={index} initialQuery={q} initialType={type} />
    </div>
  );
}
