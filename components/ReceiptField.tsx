"use client";
import { useRef, useState } from "react";
import Icon from "./Icon";
import { uploadImage } from "@/lib/upload";
import { followUp } from "@/lib/dict/follow-up";
import type { Locale } from "@/lib/i18n";

/** Optional receipt photo or PDF for a transfer. Goes to the private bucket, never the public one. */
export default function ReceiptField({ locale }: { locale: Locale }) {
  const c = followUp[locale].send;
  const input = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function pick(file: File | undefined) {
    if (!file || busy) return;
    setBusy(true); setErr("");
    try { setPath(await uploadImage("documents", file, { max: 2000 })); setName(file.name); }
    catch { setErr(c.failed); }
    finally { setBusy(false); }
  }
  return (
    <div className="field">
      <span>{c.receipt}</span>
      <input type="hidden" name="receipt" value={path} />
      <input ref={input} type="file" accept="image/*,application/pdf" hidden onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; void pick(file); }} />
      <div className="row tight">
        <button type="button" className="btn small" disabled={busy} aria-busy={busy} onClick={() => input.current?.click()}><Icon name={busy ? "spinner" : path ? "check" : "camera"} size={16} />{busy ? c.uploading : path ? c.change : c.add}</button>
        {path && !busy && <button type="button" className="btn small ghost" onClick={() => { setPath(""); setName(""); }}>{c.remove}</button>}
        {name && <span className="xs muted">{name}</span>}
      </div>
      <small>{c.receiptHint}</small>
      {err && <p role="alert" className="notice err">{err}</p>}
    </div>
  );
}
