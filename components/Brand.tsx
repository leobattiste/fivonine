import { photoPage, photoSet, photoSrc, type Photo } from "@/lib/photos";
import type { Locale } from "@/lib/i18n";
/** The mark: two rounded squares, one held out to the other, each with the kout corner. */
export function Mark({ className = "mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26 26" aria-hidden="true">
      <path d="M2 8a6 6 0 0 1 6-6h10a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H3.5A1.5 1.5 0 0 1 2 22.5Z" fill="#1f503b" />
      <path d="M11 11.5a2.5 2.5 0 0 1 2.5-2.5h3a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 1-2.5 2.5H11.6a.6.6 0 0 1-.6-.6Z" fill="#f0faef" />
    </svg>
  );
}
export function Wordmark() {
  return <><Mark /><span>yonkoutmen</span></>;
}
/** A Pexels photograph in a kout frame, credited and linked to its source page. */
export function PexelsPhoto({ photo, locale, className = "", sizes = "(min-width: 900px) 50vw, 100vw", priority, credit = true, style }: { photo: Photo; locale: Locale; className?: string; sizes?: string; priority?: boolean; credit?: boolean; style?: React.CSSProperties }) {
  return (
    <figure className={`frame ${className}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoSrc(photo)} srcSet={photoSet(photo)} sizes={sizes} alt={photo.alt[locale]} width={photo.w} height={photo.h} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : undefined} />
      {credit && <a className="credit-over" href={photoPage(photo)} target="_blank" rel="noopener noreferrer">{photo.by ? `${photo.by} / Pexels` : "Pexels"}</a>}
    </figure>
  );
}
