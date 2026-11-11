"use client";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import { saveCampaign } from "@/app/actions";
import { DEPARTMENTS, METHODS, RELATIONS, type MethodGroup } from "@/lib/constants";
import { localeNames, locales, t, type Locale } from "@/lib/i18n";
import { uploadBlob, uploadImage } from "@/lib/upload";
import { SUPABASE_URL } from "@/lib/supabase/config";
import type { Category } from "@/lib/types";

import { type FormState } from "@/lib/form";
export type { FormState };
const publicUrl = (path: string) => `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;

export default function CampaignForm({ locale, cats, initial, draftKey, live }: { locale: Locale; cats: Category[]; initial: FormState; draftKey: string | null; live: boolean }) {
  const d = t(locale), c = d.create;
  const [f, setF] = useState<FormState>(initial);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [consent, setConsent] = useState([false, false, false]);
  const [focusY, setFocusY] = useState(50);
  const [recording, setRecording] = useState(false);
  const coverFile = useRef<File | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const previews = useRef<Record<string, string>>({});
  const top = useRef<HTMLDivElement>(null);
  const [state, action, pending] = useActionState(saveCampaign, null);

  useEffect(() => {
    if (!draftKey) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) { setF({ ...initial, ...JSON.parse(raw) }); setRestored(true); }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);
  useEffect(() => {
    if (!draftKey) return;
    const id = setTimeout(() => { try { localStorage.setItem(draftKey, JSON.stringify(f)); } catch {} }, 600);
    return () => clearTimeout(id);
  }, [f, draftKey]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));
  const setPriv = <K extends keyof FormState["priv"]>(k: K, v: FormState["priv"][K]) => setF((p) => ({ ...p, priv: { ...p.priv, [k]: v } }));
  const src = (path: string) => previews.current[path] ?? publicUrl(path);
  const go = (n: number) => { setStep(n); top.current?.scrollIntoView({ block: "start" }); };

  async function run<T>(key: string, job: () => Promise<T>): Promise<T | null> {
    setBusy(key); setErr(null);
    try { return await job(); }
    catch (e) { setErr(e instanceof Error && e.message === "too-big" ? c.tooBig : c.uploadFailed); return null; }
    finally { setBusy(null); }
  }
  async function pickCover(file: File | undefined, y = focusY) {
    if (!file) return;
    coverFile.current = file;
    const path = await run("cover", () => uploadImage("media", file, { max: 1600, ratio: 4 / 3, focusY: y }));
    if (path) set("cover_path", path);
  }
  async function addGallery(file: File | undefined) {
    if (!file) return;
    const path = await run("gallery", () => uploadImage("media", file, { max: 1600 }));
    if (path) { previews.current[path] = URL.createObjectURL(file); setF((p) => ({ ...p, gallery: [...p.gallery, path].slice(0, 6) })); }
  }
  async function pickDoc(key: "id_front_path" | "id_back_path" | "selfie_path" | "documents", file: File | undefined) {
    if (!file) return;
    const path = await run(key, () => uploadImage("documents", file, { max: 2000 }));
    if (!path) return;
    if (key === "documents") setF((p) => ({ ...p, priv: { ...p.priv, documents: [...p.priv.documents, path].slice(0, 8) } }));
    else setPriv(key, path);
  }
  async function toggleRecord() {
    if (recording) { recorder.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const type = ["audio/webm", "audio/mp4", "audio/ogg"].find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
      const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        setRecording(false);
        const blob = new Blob(chunks, { type: (rec.mimeType || "audio/webm").split(";")[0] });
        const path = await run("voice", () => uploadBlob("media", blob));
        if (path) { previews.current[path] = URL.createObjectURL(blob); set("voice_path", path); }
      };
      recorder.current = rec;
      rec.start();
      setRecording(true);
      setTimeout(() => rec.state === "recording" && rec.stop(), 120000);
    } catch { setErr(c.micDenied); }
  }

  const methods = useMemo(() => Object.entries(f.methods).filter(([, v]) => v.trim().length >= 3).map(([method, details]) => ({ method, details })), [f.methods]);
  const missing = [
    !f.beneficiary_name.trim() && c.needBeneficiary, !f.cause && c.needCause, !f.department && c.needPlace, f.title.trim().length < 4 && c.needTitle,
    f.story.trim().length < 40 && !f.voice_path && c.needStory, !methods.length && c.needMethod,
    (!f.priv.contact_name.trim() || !f.priv.contact_email.trim()) && c.needContact, (!f.priv.id_front_path || !f.priv.selfie_path) && c.needId, !consent.every(Boolean) && c.needConsent,
  ].filter(Boolean) as string[];
  const payload = JSON.stringify({ ...f, methods, consent: consent.every(Boolean) });
  const groups: [MethodGroup, string, string][] = [["transfer", c.groupTransfer, c.hintTransfer], ["wallet", c.groupWallet, c.hintWallet], ["bank", c.groupBank, c.hintBank], ["app", c.groupApp, c.hintApp], ["other", d.support.other, c.hintOther]];
  const file = (key: string, label: string, onPick: (file: File | undefined) => void, accept = "image/*", has = false) => (
    <label className={`upload ${has ? "has" : ""}`}>
      <input type="file" accept={accept} hidden disabled={busy !== null} onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = ""; }} />
      <Icon name={has ? "check" : "camera"} size={18} />
      <span>{busy === key ? c.uploading : has ? `${label}: ${c.uploaded}` : label}</span>
    </label>
  );

  return (
    <div className="c-form" ref={top}>
      <ol className="stepper" aria-label={c.title}>
        {c.steps.map((label, i) => (
          <li key={label}><button type="button" aria-current={i === step ? "step" : undefined} className={i < step ? "past" : ""} onClick={() => go(i)}><span>{i + 1}</span>{label}</button></li>
        ))}
      </ol>
      {live && <p className="notice warn">{c.reReview}</p>}
      {restored && (
        <p className="notice ok">{c.draftRestored} <button type="button" className="link" onClick={() => { setF(initial); setRestored(false); if (draftKey) localStorage.removeItem(draftKey); }}>{c.discardDraft}</button></p>
      )}
      {err && <p className="notice err" role="alert">{err}</p>}

      {step === 0 && (
        <section className="stack">
          <h2>{c.s1}</h2>
          <label className="field"><span>{c.beneficiary}</span><input className="input" value={f.beneficiary_name} maxLength={120} onChange={(e) => set("beneficiary_name", e.target.value)} /></label>
          <label className="field"><span>{c.relation}</span>
            <select className="input" value={f.beneficiary_relation} onChange={(e) => set("beneficiary_relation", e.target.value)}>
              <option value="">{c.choose}</option>
              {RELATIONS.map((r) => <option key={r} value={r}>{d.relations[r]}</option>)}
            </select>
          </label>
          <fieldset className="field"><legend>{c.cause}</legend>
            <div className="choice-grid">
              {cats.map((cat) => (
                <label key={cat.slug} className="choice"><input type="radio" name="cause" checked={f.cause === cat.slug} onChange={() => set("cause", cat.slug)} /><span>{cat[`name_${locale}`]}</span></label>
              ))}
            </div>
          </fieldset>
          <div className="grid-2">
            <label className="field"><span>{c.department}</span>
              <select className="input" value={f.department} onChange={(e) => set("department", e.target.value)}>
                <option value="">{c.choose}</option>
                {DEPARTMENTS.map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label className="field"><span>{c.commune}</span><input className="input" value={f.commune} maxLength={80} onChange={(e) => set("commune", e.target.value)} /></label>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="stack">
          <h2>{c.s2}</h2>
          <label className="field"><span>{c.campaignTitle}</span><input className="input" value={f.title} maxLength={120} onChange={(e) => set("title", e.target.value)} /><small>{c.titleHint}</small></label>
          <label className="field"><span>{c.story}</span><textarea className="input" rows={10} value={f.story} maxLength={8000} onChange={(e) => set("story", e.target.value)} /><small>{c.storyHint}</small></label>
          <label className="field"><span>{c.language}</span>
            <select className="input" value={f.language} onChange={(e) => set("language", e.target.value)}>{locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}</select>
          </label>
          <div className="grid-2">
            <label className="field"><span>{c.goal} <em>({d.common.optional})</em></span>
              <span className="joined">
                <input className="input" inputMode="numeric" value={f.goal_amount} onChange={(e) => set("goal_amount", e.target.value.replace(/[^\d]/g, "").slice(0, 9))} />
                <select className="input" aria-label={d.support.currency} value={f.goal_currency} onChange={(e) => set("goal_currency", e.target.value)}><option>HTG</option><option>USD</option></select>
              </span>
              <small>{c.goalHint}</small>
            </label>
            <label className="field"><span>{c.deadline} <em>({d.common.optional})</em></span><input className="input" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></label>
          </div>
          <label className="check"><input type="checkbox" checked={f.urgent} onChange={(e) => set("urgent", e.target.checked)} /><span><strong>{c.urgent}</strong><br /><small>{c.urgentHint}</small></span></label>
        </section>
      )}

      {step === 2 && (
        <section className="stack">
          <h2>{c.s3}</h2>
          <div className="field"><span>{c.cover}</span>
            {f.cover_path && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cover-preview" src={src(f.cover_path)} alt="" />
            )}
            {file("cover", f.cover_path ? c.changePhoto : c.addPhoto, (x) => pickCover(x))}
            {f.cover_path && coverFile.current && (
              <label className="field"><span>{c.position}</span>
                <input type="range" min={0} max={100} value={focusY} onChange={(e) => setFocusY(Number(e.target.value))} onPointerUp={() => pickCover(coverFile.current ?? undefined)} onKeyUp={() => pickCover(coverFile.current ?? undefined)} />
              </label>
            )}
            <small>{c.coverHint}</small>
          </div>
          <div className="field"><span>{c.gallery} <em>({d.common.optional})</em></span>
            <div className="thumbs">
              {f.gallery.map((p) => (
                <span key={p} className="thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src(p)} alt="" />
                  <button type="button" aria-label={d.common.remove} onClick={() => set("gallery", f.gallery.filter((x) => x !== p))}><Icon name="close" size={14} /></button>
                </span>
              ))}
            </div>
            {f.gallery.length < 6 && file("gallery", c.addPhoto, addGallery)}
          </div>
          <div className="field"><span>{c.voice} <em>({d.common.optional})</em></span>
            <small>{c.voiceHint}</small>
            <div className="row">
              <button type="button" className={`btn small ${recording ? "danger" : ""}`} onClick={toggleRecord} disabled={busy !== null}><Icon name={recording ? "stop" : "mic"} size={16} />{recording ? c.stop : c.record}</button>
              {busy === "voice" && <span className="small muted">{c.uploading}</span>}
              {f.voice_path && !recording && <><audio controls preload="none" src={src(f.voice_path)} /><button type="button" className="btn small ghost" onClick={() => set("voice_path", null)}>{d.common.remove}</button></>}
            </div>
          </div>
          <label className="field"><span>{c.video} <em>({d.common.optional})</em></span><input className="input" type="url" placeholder="https://" value={f.video_url} maxLength={300} onChange={(e) => set("video_url", e.target.value)} /><small>{c.videoHint}</small></label>
        </section>
      )}

      {step === 3 && (
        <section className="stack">
          <h2>{c.s4}</h2>
          <p>{c.methodsHint}</p>
          <p className="notice warn">{c.methodsWarn}</p>
          {groups.map(([group, label, hint]) => (
            <fieldset key={group} className="method-group"><legend>{label}</legend>
              {METHODS.filter((m) => m.group === group).map((m) => {
                const on = m.id in f.methods;
                return (
                  <div key={m.id} className={on ? "method on" : "method"}>
                    <label className="check"><input type="checkbox" checked={on} onChange={(e) => setF((p) => { const next = { ...p.methods }; if (e.target.checked) next[m.id] = ""; else delete next[m.id]; return { ...p, methods: next }; })} /><span>{m.name || d.support.other}</span></label>
                    {on && <textarea className="input" rows={3} maxLength={600} placeholder={hint} aria-label={`${m.name || d.support.other}: ${hint}`} value={f.methods[m.id]} onChange={(e) => setF((p) => ({ ...p, methods: { ...p.methods, [m.id]: e.target.value } }))} />}
                  </div>
                );
              })}
            </fieldset>
          ))}
        </section>
      )}

      {step === 4 && (
        <section className="stack">
          <h2>{c.s5}</h2>
          <p className="notice"><Icon name="shield" size={18} /> {c.privateNote}</p>
          <div className="grid-2">
            <label className="field"><span>{c.contactName}</span><input className="input" value={f.priv.contact_name} maxLength={120} onChange={(e) => setPriv("contact_name", e.target.value)} /></label>
            <label className="field"><span>{c.contactEmail}</span><input className="input" type="email" value={f.priv.contact_email} maxLength={254} onChange={(e) => setPriv("contact_email", e.target.value)} /></label>
          </div>
          <label className="field"><span>{c.contactDetails} <em>({d.common.optional})</em></span><textarea className="input" rows={2} maxLength={600} placeholder={c.contactDetailsHint} value={f.priv.contact_details} onChange={(e) => setPriv("contact_details", e.target.value)} /></label>
          <div className="upload-grid">
            {file("id_front_path", c.idFront, (x) => pickDoc("id_front_path", x), "image/*", Boolean(f.priv.id_front_path))}
            {file("id_back_path", c.idBack, (x) => pickDoc("id_back_path", x), "image/*", Boolean(f.priv.id_back_path))}
            {file("selfie_path", c.selfie, (x) => pickDoc("selfie_path", x), "image/*", Boolean(f.priv.selfie_path))}
          </div>
          <div className="grid-2">
            <label className="field"><span>{c.referenceName} <em>({d.common.optional})</em></span><input className="input" value={f.priv.reference_name} maxLength={120} onChange={(e) => setPriv("reference_name", e.target.value)} /></label>
            <label className="field"><span>{c.referenceContact}</span><input className="input" value={f.priv.reference_contact} maxLength={200} onChange={(e) => setPriv("reference_contact", e.target.value)} /></label>
          </div>
          <div className="field"><span>{c.documents} <em>({d.common.optional})</em></span>
            <small>{c.documentsHint}</small>
            {f.priv.documents.length > 0 && <p className="small"><Icon name="check" size={15} /> {f.priv.documents.length} {c.uploaded.toLowerCase()} <button type="button" className="link" onClick={() => setPriv("documents", [])}>{d.common.remove}</button></p>}
            {f.priv.documents.length < 8 && file("documents", c.addDocument, (x) => pickDoc("documents", x), "image/*,application/pdf")}
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="stack">
          <h2>{c.s6}</h2>
          <div className="review">
            <h3>{f.title || "—"}</h3>
            <p className="muted">{[f.beneficiary_name, cats.find((x) => x.slug === f.cause)?.[`name_${locale}`], f.commune, f.department].filter(Boolean).join(" / ") || "—"}</p>
            {f.story && <p className="clamp">{f.story}</p>}
            <ul className="method-chips">{methods.map((m) => <li key={m.method}>{METHODS.find((x) => x.id === m.method)?.name || d.support.other}</li>)}</ul>
          </div>
          {[c.consentTruth, c.consentTerms, c.consentOff].map((label, i) => (
            <label key={label} className="check"><input type="checkbox" checked={consent[i]} onChange={(e) => setConsent((p) => p.map((v, j) => (j === i ? e.target.checked : v)))} /><span>{label}</span></label>
          ))}
          {missing.length > 0 && <div className="notice warn"><strong>{c.missing}</strong><ul>{missing.map((m) => <li key={m}>{m}</li>)}</ul></div>}
        </section>
      )}

      <form action={action} className="form-nav">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="payload" value={payload} />
        {state && !state.ok && <p className="notice err" role="alert">{state.message}</p>}
        <div className="row spread">
          <div className="row">
            {step > 0 && <button type="button" className="btn ghost" onClick={() => go(step - 1)}>{d.common.back}</button>}
            {!live && <button className="btn ghost" name="intent" value="draft" disabled={pending || busy !== null || f.title.trim().length < 4}>{c.saveDraft}</button>}
          </div>
          {step < 5 ? (
            <button type="button" className="btn primary" onClick={() => go(step + 1)}>{d.common.next}</button>
          ) : (
            <button className="btn primary" name="intent" value="submit" disabled={pending || busy !== null || missing.length > 0}>{pending ? d.common.loading : live ? d.common.save : c.submit}</button>
          )}
        </div>
      </form>
    </div>
  );
}
