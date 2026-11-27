"use client";
import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, isLocale, t, type Locale } from "@/lib/i18n";

/** Layout failures also get a retry screen, without rendering private error details. */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  useEffect(() => {
    const current = window.location.pathname.split("/")[1];
    if (isLocale(current)) setLocale(current);
    const digest = typeof error === "object" && error && "digest" in error ? error.digest : "unknown";
    console.error("[app] request unavailable", digest);
  }, [error]);
  const d = t(locale).common;
  return <html lang={locale}><head><style>{"body{font-size:16px}h1{font-size:33px}@media(min-width:744px){h1{font-size:45px}}"}</style></head><body style={{ margin: 0, padding: 32, color: "#111111", background: "#ffffff", fontFamily: "system-ui, sans-serif" }}>
    <main role="alert" style={{ maxWidth: 640, margin: "12vh auto" }}>
      <h1>{d.errorTitle}</h1><p>{d.error}</p>
      <button onClick={retry} style={{ marginTop: 16, padding: "12px 24px", border: "2px solid #111111", borderRadius: 12, background: "#111111", color: "white", font: "inherit", cursor: "pointer" }}>{d.retry}</button>
    </main>
  </body></html>;
}
