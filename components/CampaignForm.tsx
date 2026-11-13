"use client";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import Cropper from "./Cropper";
import { saveCampaign } from "@/app/actions";
import { DEPARTMENTS, METHODS, RELATIONS, type MethodGroup } from "@/lib/constants";
import { localeNames, locales, t, type Locale } from "@/lib/i18n";
import { uploadBlob, uploadImage, type Crop } from "@/lib/upload";
import { mediaUrl } from "@/lib/format";
import { normalizeMethods, type FormState } from "@/lib/form";
import type { Category } from "@/lib/types";
export type { FormState };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINK = /^https:\/\/[^\s]+$/;
const time = (locale: Locale) => new Intl.DateTimeFormat(locale === "ht" ? "fr-HT" : locale, { hour: "numeric", minute: "2-digit" }).format(new Date());

export default function CampaignForm({ locale, cats, initial, draftKey, live }: { locale: Locale; cats: Category[]; initial: FormState; draftKey: string | null; live: boolean }) {
  const d = t(locale), c = d.create, x = d.x.form;
  const [f, setF] = useState<FormState>(initial);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [upErr, setUpErr] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [deviceAt, setDeviceAt] = useState<string | null>(null);
  const [consent, setConsent] = useState([false, false, false]);
  const [recording, setRecording] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const previews = useRef<Record<string, string>>({});
  const panel = useRef<HTMLDivElement>(null);
  const [state, action, pending] = useActionState(saveCampaign, null);
  const N = x.steps.length;

  // Restore from this device, then keep a copy as the organizer types.
  useEffect(() => {
    if (!draftKey) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) { const saved = JSON.parse(raw); setF({ ...initial, ...saved, methods: normalizeMethods(saved.methods), priv: { ...initial.priv, ...saved.priv } }); setRestored(true); }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);
  useEffect(() => {
    if (!draftKey) return;
    const id = setTimeout(() => { try { localStorage.setItem(draftKey, JSON.stringify(f)); setDeviceAt(time(locale)); } catch {} }, 700);
    return () => clearTimeout(id);
  }, [f, draftKey, locale]);
  // A saved draft gets an id so the next save updates it.
  useEffect(() => { if (state?.ok && state.id) setF((p) => (p.id ? p : { ...p, id: state.id })); }, [state]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => { const n = { ...e }; delete n[k as string]; return n; }); };
  const setPriv = <K extends keyof FormState["priv"]>(k: K, v: FormState["priv"][K]) => { setF((p) => ({ ...p, priv: { ...p.priv, [k]: v } })); setErrors((e) => { const n = { ...e }; delete n[`priv.${k}`]; return n; }); };
  const setMethod = (id: string, patch: Partial<{ details: string; link: string }> | null) => setF((p) => {
    const next = { ...p.methods };
    if (patch === null) delete next[id]; else next[id] = Object.assign({ details: "", link: "" }, next[id], patch);
    return { ...p, methods: next };
  });
  const src = (path: string) => previews.current[path] ?? mediaUrl(path) ?? "";

  const methods = useMemo(() => Object.entries(f.methods).filter(([, v]) => v.details.trim().length >= 3).map(([method, v]) => ({ method, details: v.details.trim(), link: v.link.trim() })), [f.methods]);
  function check(s: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!f.beneficiary_name.trim()) e.beneficiary_name = x.err.beneficiary;
      if (!f.cause) e.cause = x.err.cause;
      if (!f.department) e.department = x.err.department;
    }
    if (s === 1) {
      if (f.title.trim().length < 4) e.title = x.err.title;
      if (f.story.trim().length < 40 && !f.voice_path) e.story = x.err.story;
    }
    if (s === 2 && !f.cover_path) e.cover_path = x.err.cover;
    if (s === 3) {
      const picked = Object.entries(f.methods);
      if (!methods.length) e.methods = x.err.method;
      for (const [id, v] of picked) {
        if (v.details.trim().length < 3) e[`m.${id}`] = x.err.details;
        if (v.link.trim() && !LINK.test(v.link.trim())) e[`l.${id}`] = x.err.link;
      }
    }
    if (s === 4) {
      if (!f.priv.contact_name.trim()) e["priv.contact_name"] = x.err.contactName;
      if (!EMAIL.test(f.priv.contact_email.trim())) e["priv.contact_email"] = x.err.contactEmail;
      if (!f.priv.id_front_path || !f.priv.selfie_path) e["priv.id"] = x.err.id;
    }
    if (s === 5 && !live && !consent.every(Boolean)) e.consent = x.err.consent;
    return e;
  }
  const allErrors = useMemo(() => Array.from({ length: N }, (_, i) => Object.keys(check(i)).length), // eslint-disable-next-line react-hooks/exhaustive-deps
    [f, consent, methods]);
  const focusFirst = () => requestAnimationFrame(() => {
    const el = panel.current?.querySelector<HTMLElement>("[aria-invalid='true'], .field-error");
    (el?.closest(".field")?.querySelector<HTMLElement>("input, select, textarea, button") ?? el)?.focus();
  });
  const go = (n: number) => {
    if (n > step) {
      const e = check(step);
      if (Object.keys(e).length) { setErrors(e); focusFirst(); return; }
    }
    setErrors({}); setDir(n > step ? "fwd" : "back"); setStep(n);
    requestAnimationFrame(() => { panel.current?.scrollIntoView({ block: "start", behavior: "smooth" }); panel.current?.querySelector<HTMLElement>("h2")?.focus(); });
  };

  async function run<T>(key: string, job: () => Promise<T>): Promise<T | null> {
    setBusy(key); setUpErr(null);
    try { return await job(); }
    catch (e) { setUpErr(e instanceof Error && e.message === "too-big" ? c.tooBig : c.uploadFailed); return null; }
    finally { setBusy(null); }
  }
  async function useCover(crop: Crop) {
    if (!cropFile) return;
    const file = cropFile;
    const path = await run("cover", () => uploadImage("media", file, { max: 1600, crop }));
    if (path) {
      const blobUrl = URL.createObjectURL(file);
      previews.current[path] = blobUrl;
      set("cover_path", path); setCropFile(null);
    }
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
    else { setPriv(key, path); setErrors((e) => { const n = { ...e }; delete n["priv.id"]; return n; }); }
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
      rec.start(); setRecording(true);
      setTimeout(() => rec.state === "recording" && rec.stop(), 120000);
    } catch { setUpErr(c.micDenied); }
  }

  const payload = JSON.stringify({ ...f, methods, consent: live || consent.every(Boolean) });
  const err = (k: string) => errors[k] ? <p className="field-error" id={`e-${k}`}><Icon name="alert" size={15} />{errors[k]}</p> : null;
  const inv = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `e-${k}` : undefined });
  const opt = <span className="opt"> ({x.optional})</span>;
  const groups: [MethodGroup, string, string][] = [["transfer", c.groupTransfer, c.hintTransfer], ["wallet", c.groupWallet, c.hintWallet], ["bank", c.groupBank, c.hintBank], ["app", c.groupApp, c.hintApp], ["other", d.support.other, c.hintOther]];
  const docUpload = (key: "id_front_path" | "id_back_path" | "selfie_path", label: string, isOpt = false) => {
    const has = Boolean(f.priv[key]);
    return (
      <label className={`upload-zone small ${has ? "has" : ""}`}>
        <input type="file" accept="image/*" disabled={busy !== null} onChange={(e) => { pickDoc(key, e.target.files?.[0]); e.target.value = ""; }} />
        <Icon name={busy === key ? "spinner" : has ? "done" : "camera"} size={22} className={busy === key ? "icon spin" : "icon"} />
        <span>{label}{isOpt && opt}</span>
        <span className="hint">{busy === key ? c.uploading : has ? c.uploaded : c.addPhoto}</span>
      </label>
    );
  };
  const catName = cats.find((x) => x.slug === f.cause)?.[`name_${locale}`] ?? "";
  const where = [f.commune, f.department].filter(Boolean).join(", ");
  const savedAccount = state?.ok && state.at ? x.savedAccount(state.at) : null;

  return (
    <div className="form-shell">
      <div className="stack">
        <p className="eyebrow" aria-live="polite">{x.stepOf(step + 1, N)}</p>
        <div className="step-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / N) * 100}%` }} /></div>
        <ol className="stepper" aria-label={x.title}>
          {x.steps.map((label, i) => {
            const st = i < step ? "done" : i === step ? "current" : "upcoming";
            return (
              <li key={label}>
                <button type="button" className={st === "done" ? "done" : ""} aria-current={st === "current" ? "step" : undefined} onClick={() => (i <= step ? go(i) : go(Math.min(i, step + 1)))}>
                  <span className="dot">{st === "done" ? <Icon name="check" size={16} /> : i + 1}</span>
                  <span className="lbl">{label}</span>
                  <span className="sr">, {x[st === "done" ? "done" : st === "current" ? "current" : "upcoming"]}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="stack" style={{ gap: 20, minWidth: 0 }}>
        {live && <p className="notice"><Icon name="info" size={18} />{x.liveNote}</p>}
        {restored && <p className="notice"><Icon name="undo" size={18} /><span>{x.restored} <button type="button" className="link" onClick={() => { setF(initial); setRestored(false); if (draftKey) localStorage.removeItem(draftKey); }}>{x.startOver}</button></span></p>}
        {upErr && <p className="notice err" role="alert"><Icon name="alert" size={18} />{upErr}</p>}
        {Object.keys(errors).length > 0 && <p className="notice err" role="alert"><Icon name="alert" size={18} />{x.err.fix}</p>}

        <div ref={panel} key={step} className="step-panel" data-dir={dir}>
          <header><h2 tabIndex={-1}>{x.steps[step]}</h2></header>

          {step === 0 && (
            <>
              <label className="field"><span>{c.beneficiary}</span><input className="input" value={f.beneficiary_name} maxLength={120} placeholder={x.ex.beneficiary} onChange={(e) => set("beneficiary_name", e.target.value)} {...inv("beneficiary_name")} />{err("beneficiary_name")}</label>
              <label className="field"><span>{c.relation}{opt}</span>
                <select className="input" value={f.beneficiary_relation} onChange={(e) => set("beneficiary_relation", e.target.value)}>
                  <option value="">{c.choose}</option>
                  {RELATIONS.map((r) => <option key={r} value={r}>{d.relations[r]}</option>)}
                </select>
              </label>
              <fieldset className="field" {...(errors.cause ? { "aria-describedby": "e-cause" } : {})}><legend>{c.cause}</legend>
                <div className="choice-grid" style={{ marginTop: 6 }}>
                  {cats.map((cat) => <label key={cat.slug} className="choice"><input type="radio" name="cause" checked={f.cause === cat.slug} onChange={() => set("cause", cat.slug)} /><span>{cat[`name_${locale}`]}</span></label>)}
                </div>
                {err("cause")}
              </fieldset>
              <div className="cols-2">
                <label className="field"><span>{c.department}</span>
                  <select className="input" value={f.department} onChange={(e) => set("department", e.target.value)} {...inv("department")}>
                    <option value="">{c.choose}</option>
                    {DEPARTMENTS.map((v) => <option key={v}>{v}</option>)}
                  </select>{err("department")}
                </label>
                <label className="field"><span>{c.commune}{opt}</span><input className="input" value={f.commune} maxLength={80} placeholder={x.ex.commune} onChange={(e) => set("commune", e.target.value)} /></label>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <label className="field"><span>{c.campaignTitle}</span><input className="input" value={f.title} maxLength={120} placeholder={x.ex.title} onChange={(e) => set("title", e.target.value)} {...inv("title")} /><small>{f.title.length}/120</small>{err("title")}</label>
              <label className="field"><span>{c.story}</span><textarea className="input" rows={11} value={f.story} maxLength={8000} onChange={(e) => set("story", e.target.value)} {...inv("story")} /><small>{c.storyHint} {f.story.trim().length < 40 ? `(${f.story.trim().length}/40)` : ""}</small>{err("story")}</label>
              <div className="field"><span>{c.voice}{opt}</span>
                <small>{c.voiceHint}</small>
                <div className="row">
                  <button type="button" className={`btn small ${recording ? "danger" : ""}`} onClick={toggleRecord} disabled={busy !== null && busy !== "voice"}><Icon name={recording ? "stop" : "mic"} size={16} />{recording ? c.stop : c.record}</button>
                  {busy === "voice" && <span className="small muted">{c.uploading}</span>}
                  {f.voice_path && !recording && <><audio controls preload="none" src={src(f.voice_path)} /><button type="button" className="btn small quiet" onClick={() => set("voice_path", null)}>{d.common.remove}</button></>}
                </div>
              </div>
              <div className="cols-2">
                <label className="field"><span>{c.language}</span>
                  <select className="input" value={f.language} onChange={(e) => set("language", e.target.value)}>{locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}</select>
                </label>
                <label className="field"><span>{c.deadline}{opt}</span><input className="input" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></label>
              </div>
              <label className="field"><span>{c.goal}{opt}</span>
                <span className="joined">
                  <input className="input" inputMode="numeric" value={f.goal_amount} placeholder="50000" onChange={(e) => set("goal_amount", e.target.value.replace(/[^\d]/g, "").slice(0, 9))} />
                  <select className="input" aria-label={d.support.currency} value={f.goal_currency} onChange={(e) => set("goal_currency", e.target.value)}><option>HTG</option><option>USD</option></select>
                </span>
                <small>{c.goalHint}</small>
              </label>
              <label className="check"><input type="checkbox" checked={f.urgent} onChange={(e) => set("urgent", e.target.checked)} /><span><strong>{c.urgent}</strong><br /><small className="muted">{c.urgentHint}</small></span></label>
            </>
          )}

          {step === 2 && (
            <>
              <div className="field">
                <span>{c.cover}</span>
                {cropFile ? (
                  <Cropper file={cropFile} labels={{ ...x.crop }} busy={busy === "cover"} onUse={useCover} onCancel={() => setCropFile(null)} />
                ) : f.cover_path ? (
                  <div className="stack">
                    <div className="frame" style={{ aspectRatio: "4 / 3", maxWidth: 560 }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(f.cover_path)} alt="" /></div>
                    <div className="row">
                      <label className="btn small"><input type="file" accept="image/*" hidden onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) setCropFile(file); }} /><Icon name="camera" size={16} />{x.crop.change}</label>
                      <button type="button" className="btn small quiet" onClick={() => set("cover_path", null)}>{x.crop.remove}</button>
                    </div>
                  </div>
                ) : (
                  <label className="upload-zone" {...(errors.cover_path ? { "aria-describedby": "e-cover_path" } : {})}>
                    <input type="file" accept="image/*" aria-invalid={errors.cover_path ? true : undefined} onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) { if (file.size > 25 * 1024 * 1024) setUpErr(c.tooBig); else setCropFile(file); } }} />
                    <Icon name="camera" size={28} />
                    <span>{c.addPhoto}</span>
                    <span className="hint">{c.coverHint}</span>
                  </label>
                )}
                {err("cover_path")}
              </div>
              <div className="field"><span>{c.gallery}{opt}</span>
                {f.gallery.length > 0 && (
                  <div className="thumbs">
                    {f.gallery.map((p) => (
                      <span key={p} className="thumb"><span className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(p)} alt="" /></span>
                        <button type="button" aria-label={d.common.remove} onClick={() => set("gallery", f.gallery.filter((v) => v !== p))}><Icon name="close" size={14} /></button></span>
                    ))}
                  </div>
                )}
                {f.gallery.length < 6 && (
                  <label className="upload-zone small">
                    <input type="file" accept="image/*" disabled={busy !== null} onChange={(e) => { addGallery(e.target.files?.[0]); e.target.value = ""; }} />
                    <Icon name={busy === "gallery" ? "spinner" : "plus"} size={22} className={busy === "gallery" ? "icon spin" : "icon"} />
                    <span>{busy === "gallery" ? c.uploading : c.addPhoto}</span>
                  </label>
                )}
              </div>
              <label className="field"><span>{c.video}{opt}</span><input className="input" type="url" placeholder="https://" value={f.video_url} maxLength={300} onChange={(e) => set("video_url", e.target.value)} /><small>{c.videoHint}</small></label>
            </>
          )}

          {step === 3 && (
            <>
              <p className="measure">{c.methodsHint}</p>
              <p className="notice"><Icon name="eye" size={18} />{c.methodsWarn}</p>
              {err("methods")}
              <div className="method-groups">
                {groups.map(([group, label, hint]) => (
                  <fieldset key={group} className="field method-pick"><legend>{label}</legend>
                    {METHODS.filter((m) => m.group === group).map((m) => {
                      const v = f.methods[m.id], on = Boolean(v), name = m.name || d.support.other;
                      return (
                        <div key={m.id} className={`opt-row ${on ? "on" : ""}`}>
                          <label className="check"><input type="checkbox" checked={on} onChange={(e) => setMethod(m.id, e.target.checked ? {} : null)} /><span><strong>{name}</strong></span></label>
                          {on && (
                            <>
                              <label className="field"><span className="sr">{name}</span><textarea className="input" rows={3} maxLength={600} placeholder={hint} value={v.details} onChange={(e) => setMethod(m.id, { details: e.target.value })} {...inv(`m.${m.id}`)} />{err(`m.${m.id}`)}</label>
                              {(group === "app" || group === "other" || v.link) && (
                                <label className="field"><span>{x.link}{opt}</span><input className="input" type="url" inputMode="url" placeholder="https://" maxLength={300} value={v.link} onChange={(e) => setMethod(m.id, { link: e.target.value })} {...inv(`l.${m.id}`)} /><small>{x.linkHint}</small>{err(`l.${m.id}`)}</label>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </fieldset>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="notice"><Icon name="lock" size={18} />{c.privateNote}</p>
              <div className="cols-2">
                <label className="field"><span>{c.contactName}</span><input className="input" value={f.priv.contact_name} maxLength={120} autoComplete="name" onChange={(e) => setPriv("contact_name", e.target.value)} {...inv("priv.contact_name")} />{err("priv.contact_name")}</label>
                <label className="field"><span>{c.contactEmail}</span><input className="input" type="email" value={f.priv.contact_email} maxLength={254} autoComplete="email" onChange={(e) => setPriv("contact_email", e.target.value)} {...inv("priv.contact_email")} />{err("priv.contact_email")}</label>
              </div>
              <label className="field"><span>{c.contactDetails}{opt}</span><textarea className="input" rows={2} maxLength={600} placeholder={c.contactDetailsHint} value={f.priv.contact_details} onChange={(e) => setPriv("contact_details", e.target.value)} /></label>
              <div className="field">
                <div className="cols-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))" }}>
                  {docUpload("id_front_path", c.idFront)}
                  {docUpload("id_back_path", c.idBack, true)}
                  {docUpload("selfie_path", c.selfie)}
                </div>
                {err("priv.id")}
              </div>
              <div className="cols-2">
                <label className="field"><span>{c.referenceName}{opt}</span><input className="input" value={f.priv.reference_name} maxLength={120} onChange={(e) => setPriv("reference_name", e.target.value)} /></label>
                <label className="field"><span>{c.referenceContact}{opt}</span><input className="input" value={f.priv.reference_contact} maxLength={200} onChange={(e) => setPriv("reference_contact", e.target.value)} /></label>
              </div>
              <div className="field"><span>{c.documents}{opt}</span>
                <small>{c.documentsHint}</small>
                {f.priv.documents.length > 0 && <p className="small"><Icon name="done" size={16} /> {f.priv.documents.length} {c.uploaded.toLowerCase()} <button type="button" className="link" onClick={() => setPriv("documents", [])}>{d.common.remove}</button></p>}
                {f.priv.documents.length < 8 && (
                  <label className="upload-zone small"><input type="file" accept="image/*,application/pdf" disabled={busy !== null} onChange={(e) => { pickDoc("documents", e.target.files?.[0]); e.target.value = ""; }} />
                    <Icon name={busy === "documents" ? "spinner" : "file"} size={22} className={busy === "documents" ? "icon spin" : "icon"} /><span>{busy === "documents" ? c.uploading : c.addDocument}</span></label>
                )}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <p className="muted">{x.preview}</p>
              <div className="preview-grid">
                <div className="stack tight">
                  <p className="eyebrow">{x.previewCard}</p>
                  <article className="fcard" aria-hidden="true">
                    {f.cover_path ? <div className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(f.cover_path)} alt="" /></div> : <div className="frame empty"><Icon name="image" size={40} /></div>}
                    <p className="meta">{catName && <span>{catName}</span>}{where && <span><Icon name="pin" size={14} /> {where}</span>}</p>
                    <h3>{f.title || "—"}</h3>
                    <p className="excerpt">{f.story.replace(/\s+/g, " ").slice(0, 170)}</p>
                  </article>
                </div>
                <div className="stack tight">
                  <p className="eyebrow">{x.previewPage}</p>
                  <div className="preview-page">
                    <h3>{f.title || "—"}</h3>
                    <p className="small muted">{[f.beneficiary_name && `${d.x.detail.beneficiary} ${f.beneficiary_name}`, where, f.goal_amount && `${d.x.detail.goal}: ${Number(f.goal_amount).toLocaleString()} ${f.goal_currency}`].filter(Boolean).join(" · ")}</p>
                    <div className="story" lang={f.language}>{f.story.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
                    <div className="support" style={{ position: "static", padding: 16 }}>
                      <strong>{d.x.detail.support}</strong>
                      {methods.length ? <ul className="stack tight">{methods.map((m) => <li key={m.method} className="method"><strong>{METHODS.find((v) => v.id === m.method)?.name || d.support.other}</strong><pre>{m.details}</pre>{m.link && <span className="host">{d.x.detail.opens(m.link.replace(/^https:\/\/(www\.)?/, "").split("/")[0])}</span>}</li>)}</ul> : <p className="small muted">—</p>}
                    </div>
                  </div>
                </div>
              </div>
              {allErrors.slice(0, 5).some(Boolean) && (
                <div className="notice err"><Icon name="alert" size={18} /><span><strong>{c.missing}</strong>
                  <span className="row tight" style={{ marginTop: 8 }}>{allErrors.slice(0, 5).map((n, i) => n ? <button key={i} type="button" className="chip" onClick={() => { setDir("back"); setStep(i); setErrors(check(i)); }}>{x.steps[i]}</button> : null)}</span></span></div>
              )}
              {!live && (
                <fieldset className="field stack" style={{ gap: 12 }}>
                  <legend className="sr">{x.steps[5]}</legend>
                  {[c.consentTruth, c.consentTerms, c.consentOff].map((label, i) => (
                    <label key={label} className="check"><input type="checkbox" checked={consent[i]} onChange={(e) => { setConsent((p) => p.map((v, j) => (j === i ? e.target.checked : v))); setErrors({}); }} /><span>{label}</span></label>
                  ))}
                  {err("consent")}
                </fieldset>
              )}
            </>
          )}
        </div>

        <form action={action} className="form-bar" onSubmit={(e) => {
          const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
          if (submitter?.value === "submit") {
            const first = allErrors.findIndex(Boolean);
            if (first !== -1) { e.preventDefault(); setDir("back"); setStep(first); setErrors(check(first)); focusFirst(); }
          }
        }}>
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="payload" value={payload} />
          <div className="stack tight" style={{ flex: "1 1 220px" }}>
            {state && !state.ok && <p className="field-error" role="alert"><Icon name="alert" size={15} />{state.message}</p>}
            {savedAccount ? <p className="save-state ok" role="status"><Icon name="done" size={16} />{savedAccount}</p>
              : draftKey && deviceAt ? <p className="save-state"><Icon name="check" size={15} />{x.savedDeviceAt(deviceAt)}</p> : null}
          </div>
          <div className="row">
            {step > 0 && <button type="button" className="btn quiet" onClick={() => go(step - 1)}><Icon name="left" size={18} />{x.back}</button>}
            {!live && <button className="btn" name="intent" value="draft" disabled={pending || busy !== null || f.title.trim().length < 4} aria-busy={pending} title={f.title.trim().length < 4 ? x.err.title : undefined}>{pending ? x.saving : x.saveDraft}</button>}
            {step < N - 1 ? (
              <button type="button" className="btn primary" onClick={() => go(step + 1)}>{x.continue}<Icon name="right" size={18} /></button>
            ) : (
              <button className="btn primary" name="intent" value="submit" disabled={pending || busy !== null} aria-busy={pending}>{pending ? <><Icon name="spinner" size={18} />{d.common.loading}</> : live ? x.submitChanges : x.submit}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
