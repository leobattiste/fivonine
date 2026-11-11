"use client";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { t, type Locale } from "@/lib/i18n";
export function CopyButton({ text, locale, label }: { text: string; locale: Locale; label?: string }) {
  const d = t(locale).common;
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="btn small ghost" onClick={async () => {
      try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1800); } catch {}
    }}>
      <Icon name={ok ? "check" : "copy"} size={16} />
      <span aria-live="polite">{ok ? d.copied : label ?? d.copy}</span>
    </button>
  );
}
export function ShareBar({ url, title, locale }: { url: string; title: string; locale: Locale }) {
  const d = t(locale).campaign;
  const [native, setNative] = useState(false);
  useEffect(() => setNative(typeof navigator !== "undefined" && "share" in navigator), []);
  return (
    <div className="row">
      <a className="btn small whatsapp" href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`} target="_blank" rel="noopener noreferrer">
        <Icon name="whatsapp" size={18} />{d.whatsapp}
      </a>
      <CopyButton text={url} locale={locale} label={d.copyLink} />
      {native && <button type="button" className="btn small ghost" onClick={() => navigator.share({ title, url }).catch(() => {})}><Icon name="share" size={16} />{d.share}</button>}
    </div>
  );
}
export function HowTabs({ locale }: { locale: Locale }) {
  const d = t(locale).home;
  const [tab, setTab] = useState<"need" | "give">("give");
  const steps = tab === "need" ? d.need : d.give;
  return (
    <div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "give"} onClick={() => setTab("give")}>{d.tabGive}</button>
        <button role="tab" aria-selected={tab === "need"} onClick={() => setTab("need")}>{d.tabNeed}</button>
      </div>
      <ol className="steps" role="tabpanel">
        {steps.map(([h, p], i) => (
          <li key={h}><span className="step-n">{i + 1}</span><h3>{h}</h3><p>{p}</p></li>
        ))}
      </ol>
    </div>
  );
}
export function DataSaver({ locale, on }: { locale: Locale; on: boolean }) {
  const d = t(locale).common;
  return (
    <button type="button" className="btn small ghost" aria-pressed={on} onClick={() => {
      document.cookie = `fivonine-lite=${on ? "0" : "1"};path=/;max-age=31536000;SameSite=Lax`;
      location.reload();
    }}>
      <Icon name="wifiOff" size={16} />{d.dataSaver}: {on ? d.on : d.off}
    </button>
  );
}
export function PrintButton({ label }: { label: string }) {
  return <button type="button" className="btn primary no-print" onClick={() => window.print()}><Icon name="print" size={18} />{label}</button>;
}
export function ClearDraft({ storageKey }: { storageKey: string }) {
  useEffect(() => { try { localStorage.removeItem(storageKey); } catch {} }, [storageKey]);
  return null;
}
export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
