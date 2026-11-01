import type { Metadata } from "next";
import L from "@/components/L";
import SourcesBrowser from "@/components/SourcesBrowser";
import { getContent } from "@/lib/data";
import { collectSources } from "@/lib/sources-index";

export const metadata: Metadata = {
  title: "Sources",
  description: "Browse the documents, publications, archival collections, bibliographies and image credits used throughout Fivonine's history of Haiti.",
};
export const revalidate = 3600;

export default async function SourcesPage() {
  const entries = collectSources(await getContent());
  return (
    <main className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2"><L en="Sources" fr="Sources" /></h1>
      <p className="read mt-4">
        <L
          en="Explore the documents, books, historical archives, reference materials, and image credits used throughout Fivonine. Sources are collected here in one place and linked to the entries where they appear."
          fr="Parcourez les documents, livres, archives historiques, références et crédits d’images utilisés dans Fivonine. Toutes les sources sont réunies ici et reliées aux notices qu’elles documentent."
        />
      </p>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-dim">
        <L
          en="Some references point to archival inventories rather than complete manuscripts. An inventory confirms the description of a document, but not every interpretation of its contents. Image credits and license information appear in this catalog."
          fr="Certaines références renvoient à des inventaires d’archives plutôt qu’aux manuscrits complets. Un inventaire confirme la description d’un document, sans vérifier toutes les interprétations de son contenu. Les crédits d’images et les informations de licence figurent dans ce catalogue."
        />
      </p>
      <SourcesBrowser entries={entries} />
    </main>
  );
}
