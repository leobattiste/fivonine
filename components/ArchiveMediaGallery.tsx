"use client";

import { useState } from "react";
import L from "@/components/L";
import { useT } from "@/components/Prefs";
import type { ArchiveMedia } from "@/lib/types";

function ArchivePhoto({ item }: { item: ArchiveMedia }) {
  const [failed, setFailed] = useState(false);
  const t = useT();
  const photo = item.image!;
  return (
    <figure className="min-w-0">
      <a href={failed ? item.url : photo.src} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-rule bg-raise focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={t(`Open image: ${item.title}`, `Ouvrir l’image : ${item.fr.title}`)}>
        {failed ? <p className="p-8 text-sm underline"><L en="View photograph at its source" fr="Voir la photographie à sa source" /></p> : (
          // Archive reproductions keep their complete composition and intrinsic aspect ratio.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} width={photo.width} height={photo.height} alt={t(photo.alt, item.fr.alt ?? photo.alt)} loading="lazy" decoding="async" onError={() => setFailed(true)} className="max-h-[30rem] w-full rounded-xl object-contain" />
        )}
      </a>
      <figcaption className="mt-3 space-y-2 text-sm leading-relaxed">
        <p className="font-semibold"><L en={item.title} fr={item.fr.title} /></p>
        <p><L en={item.description} fr={item.fr.description} /></p>
        <p className="text-xs text-dim">{photo.credit} · <time dateTime={item.date}>{item.date}</time></p>
        <p className="text-xs text-dim"><a href={item.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4"><L en="Source" fr="Source" /></a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{photo.license}</a></p>
        <p className="text-xs text-dim"><L en={photo.changes} fr={item.fr.changes} /></p>
      </figcaption>
    </figure>
  );
}

export default function ArchiveMediaGallery({ items, compact = false, heading = true }: { items?: ArchiveMedia[]; compact?: boolean; heading?: boolean }) {
  const t = useT();
  if (!items?.length) return null;
  const photos = items.filter(m => m.kind === "image" && m.image);
  const documents = items.filter(m => m.kind !== "image");
  const H = compact ? "h3" : "h2";
  return (
    <section className="my-8" aria-label={t("Images and documents", "Images et documents")}>
      {heading && <H className="mb-5 text-xl font-semibold"><L en="Images & documents" fr="Images et documents" /></H>}
      {photos.length > 0 && <div className={`grid gap-8 ${!compact && photos.length > 1 ? "sm:grid-cols-2" : ""}`}>{photos.map(item => <ArchivePhoto key={item.id} item={item} />)}</div>}
      {documents.length > 0 && <div className={`grid gap-4 ${photos.length ? "mt-8" : ""} ${compact ? "" : "sm:grid-cols-2"}`}>
        {documents.map(item => (
          <article key={item.id} className="min-w-0 rounded-xl border border-rule p-5">
            <p className="text-xs text-dim">{item.publisher} · {item.date}{item.language ? ` · ${item.language}` : ""}</p>
            <h3 className="mt-2 text-lg leading-snug"><L en={item.title} fr={item.fr.title} /></h3>
            <p className="mt-3 text-sm leading-relaxed"><L en={item.description} fr={item.fr.description} /></p>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm underline underline-offset-4">
              <L en={item.format === "PDF" ? "Read PDF" : item.kind === "archive" ? "Explore archive" : "Read document"} fr={item.format === "PDF" ? "Lire le PDF" : item.kind === "archive" ? "Explorer les archives" : "Lire le document"} />
              <span aria-hidden>↗</span><span className="sr-only"><L en=" (opens in a new tab)" fr=" (nouvel onglet)" /></span>
            </a>
          </article>
        ))}
      </div>}
    </section>
  );
}
