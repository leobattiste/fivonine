"use client";
import { useParams } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const p = useParams<{ locale: string }>();
  const d = t(isLocale(p.locale) ? p.locale : "fr").common;
  return <div className="wrap page"><div className="empty" role="alert"><h1>{d.errorTitle}</h1><p>{d.error}</p><button className="btn primary" onClick={reset}>{d.retry}</button></div></div>;
}
