"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { editorial } from "@/lib/editorial";
export default function Recovery({ reset }: { reset?: () => void }) {
  const value = usePathname().split("/")[1];
  const locale = isLocale(value) ? value : "ht",
    e = editorial[locale];
  return (
    <section className="page error-page">
      <p className="eyebrow">{reset ? "Pote Kole" : "404 / Pote Kole"}</p>
      <h1>{reset ? e.error : e.notFound}</h1>
      <p>{reset ? e.errorBody : e.notFoundBody}</p>
      {reset ? (
        <button className="button" onClick={reset}>
          {e.retry}
        </button>
      ) : (
        <Link className="button" href={`/${locale}/explore`}>
          {e.back}
        </Link>
      )}
    </section>
  );
}
