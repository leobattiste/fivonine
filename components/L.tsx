import type { ReactNode } from "react";

/**
 * Bilingual text. Both versions are in the page and CSS shows the one that matches the reader's language,
 * so it works in server components and never flashes. Without a French version it simply shows the English.
 */
export default function L({ en, fr }: { en: ReactNode; fr?: ReactNode }) {
  if (fr == null || fr === "") return <>{en}</>;
  return (
    <>
      <span className="l-en">{en}</span>
      <span className="l-fr">{fr}</span>
    </>
  );
}
