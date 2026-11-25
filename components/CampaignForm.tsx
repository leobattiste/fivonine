"use client";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import Cropper from "./Cropper";
import StoryEditor from "./StoryEditor";
import { saveCampaign } from "@/app/actions";
import { DEPARTMENTS, METHODS, RELATIONS, type MethodGroup } from "@/lib/constants";
import { storyLanguages, t, type Locale } from "@/lib/i18n";
import { uploadBlob, uploadImage, type Crop } from "@/lib/upload";
import { fmtMoney, mediaUrl } from "@/lib/format";
import { normalizeMethods, type FormState } from "@/lib/form";
import type { Category } from "@/lib/types";
export type { FormState };

const WIZARD: Record<Locale, { steps: string[]; back: string; next: string; progress: string; section: string }> = {
  en: { steps: ["Basics", "Your story", "Photos & media", "How to help", "Verification", "Review & submit"], back: "Back", next: "Continue", progress: "Step", section: "Fundraiser steps" },
  fr: { steps: ["Informations", "Votre histoire", "Photos et médias", "Moyens d’aide", "Vérification", "Vérifier et envoyer"], back: "Retour", next: "Continuer", progress: "Étape", section: "Étapes de la collecte" },
  ht: { steps: ["Enfòmasyon", "Istwa ou", "Foto ak medya", "Kijan pou ede", "Verifikasyon", "Revize epi voye"], back: "Retounen", next: "Kontinye", progress: "Etap", section: "Etap kanpay la" },
  es: { steps: ["Datos básicos", "Tu historia", "Fotos y medios", "Cómo ayudar", "Verificación", "Revisar y enviar"], back: "Atrás", next: "Continuar", progress: "Paso", section: "Pasos de la campaña" },
};

const LINK = /^https:\/\/[^\s]+$/;
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const time = (locale: Locale) => new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date());

/** Six guided steps. Draft, validation, private fields and payment methods use the existing server action. */
export default function CampaignForm({ locale, cats, initial, draftKey, live, email }: { locale: Locale; cats: Category[]; initial: FormState; draftKey: string | null; live: boolean; email?: string }) {
  const d = t(locale), c = d.create, x = d.x.form, k = x.compose;
  const [f, setF] = useState<FormState>(initial);
  const [activeStep, setActiveStep] = useState(0);
  const wizard = WIZARD[locale];
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
  const [state, action, pending] = useActionState(saveCampaign, null);

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

  const set = <K extends keyof FormState>(key: K, v: FormState[K]) => { setF((p) => ({ ...p, [key]: v })); setErrors((e) => { const n = { ...e }; delete n[key as string]; return n; }); };
  const setPriv = <K extends keyof FormState["priv"]>(key: K, v: FormState["priv"][K]) => setF((p) => ({ ...p, priv: { ...p.priv, [key]: v } }));
  const setMethod = (id: string, patch: Partial<{ details: string; link: string }> | null) => setF((p) => {
    const next = { ...p.methods };
    if (patch === null) delete next[id]; else next[id] = Object.assign({ details: "", link: "" }, next[id], patch);
    return { ...p, methods: next };
  });
  const src = (path: string) => previews.current[path] ?? mediaUrl(path) ?? "";

  const methods = useMemo(() => Object.entries(f.methods).filter(([, v]) => v.details.trim().length >= 3).map(([method, v]) => ({ method, details: v.details.trim(), link: v.link.trim() })), [f.methods]);
  const consentOk = live || consent.every(Boolean);

  // What is missing, by section. The checklist and the submit button read from the same rules.
  function check(): Record<string, string> {
    const e: Record<string, string> = {};
    if (f.title.trim().length < 4) e.title = x.err.title;
    if (!f.cause) e.cause = x.err.cause;
    if (!f.cover_path) e.cover_path = x.err.cover;
    if (plain(f.story).length < 40 && !f.voice_path) e.story = x.err.story;
    if (!f.department) e.department = x.err.department;
    if (!methods.length) e.methods = x.err.method;
    for (const [id, v] of Object.entries(f.methods)) {
      if (v.details.trim().length < 3) e[`m.${id}`] = x.err.details;
      if (v.link.trim() && !LINK.test(v.link.trim())) e[`l.${id}`] = x.err.link;
    }
    if (!consentOk) e.consent = x.err.consent;
    return e;
  }
  const missing = useMemo(check, // eslint-disable-next-line react-hooks/exhaustive-deps
    [f, consent, methods]);
  const sectionOf = (key: string) => (key === "title" ? "title" : key === "cause" ? "category" : key === "cover_path" ? "cover" : key === "story" ? "story" : key === "department" ? "location" : key === "consent" ? "submit" : "receive");
  const items: [string, string, boolean][] = [
    ["title", k.items.title, !missing.title], ["category", k.items.category, !missing.cause], ["cover", k.items.cover, !missing.cover_path],
    ["story", k.items.story, !missing.story], ["location", k.items.location, !missing.department],
    ["receive", k.items.receive, !Object.keys(missing).some((m) => m === "methods" || m.startsWith("m.") || m.startsWith("l."))],
    ...(live ? [] : [["submit", k.items.consent, consentOk] as [string, string, boolean]]),
  ];
  const doneCount = items.filter(([, , ok]) => ok).length;

  const stepOf = (section: string) =>
    ["title", "category", "location"].includes(section) ? 0 :
    section === "story" ? 1 : ["cover", "media"].includes(section) ? 2 :
    ["goal", "receive"].includes(section) ? 3 : section === "verify" ? 4 : 5;
  const navigateStep = (n: number) => {
    setActiveStep(Math.max(0, Math.min(5, n)));
    requestAnimationFrame(() => document.getElementById("wizard-top")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const jump = (section: string) => {
    setActiveStep(stepOf(section));
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = document.getElementById(`s-${section}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      el?.querySelector<HTMLElement>("input:not([type=file]):not([type=radio]), select, textarea, button, [contenteditable=true]")?.focus({ preventScroll: true });
    }));
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
    if (path) { previews.current[path] = URL.createObjectURL(file); set("cover_path", path); setCropFile(null); }
  }
  async function addGallery(file: File | undefined) {
    if (!file) return;
    const path = await run("gallery", () => uploadImage("media", file, { max: 1600 }));
    if (path) { previews.current[path] = URL.createObjectURL(file); setF((p) => ({ ...p, gallery: [...p.gallery, path].slice(0, 6) })); }
  }
  async function addDocument(file: File | undefined) {
    if (!file) return;
    const path = await run("documents", () => uploadImage("documents", file, { max: 2000 }));
    if (path) setF((p) => ({ ...p, priv: { ...p.priv, documents: [...p.priv.documents, path].slice(0, 8) } }));
  }
  async function addPrivateImage(key: "id_front_path" | "id_back_path" | "selfie_path", file?: File) {
    if (!file) return;
    const path = await run(key, () => uploadImage("documents", file, { max: 2000 }));
    if (path) setPriv(key, path);
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

  const payload = JSON.stringify({ ...f, methods, consent: consentOk });
  const err = (key: string) => errors[key] ? <p className="field-error" id={`e-${key}`}><Icon name="alert" size={15} />{errors[key]}</p> : null;
  const inv = (key: string) => ({ "aria-invalid": errors[key] ? true : undefined, "aria-describedby": errors[key] ? `e-${key}` : undefined });
  const opt = <span className="opt"> ({x.optional})</span>;
  const groups: [MethodGroup, string, string][] = [["transfer", c.groupTransfer, c.hintTransfer], ["wallet", c.groupWallet, c.hintWallet], ["bank", c.groupBank, c.hintBank], ["app", c.groupApp, c.hintApp], ["other", d.support.other, c.hintOther]];
  const catName = cats.find((v) => v.slug === f.cause)?.[`name_${locale}`] ?? "";
  const where = [f.commune, f.department].filter(Boolean).join(", ");
  const amount = Number(f.goal_amount) > 0 ? fmtMoney(Number(f.goal_amount), f.goal_currency, locale) : null;
  const savedAccount = state?.ok && state.at ? x.savedAccount(state.at) : null;
  const mail = f.priv.contact_email || email || "";
  const canDraft = f.title.trim().length >= 4;

  const card = (
    <article className="fcard preview-card" aria-hidden="true">
      {f.cover_path ? <div className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(f.cover_path)} alt="" /></div> : <div className="frame empty"><Icon name="image" size={40} /></div>}
      <p className="meta"><span>{catName || "—"}</span></p>
      <h3>{f.title.trim() || k.title.ph}</h3>
      <p className="foot">
        <span className="where">{where ? <><Icon name="pin" size={15} />{where}</> : null}</span>
        <span className="amount">{amount ?? <span className="muted">{d.x.card.noGoal}</span>}</span>
      </p>
    </article>
  );
  const saveState = (
    <>
      {state && !state.ok && <p className="field-error" role="alert"><Icon name="alert" size={15} />{state.message}</p>}
      {savedAccount ? <p className="save-state ok" role="status"><Icon name="done" size={16} />{savedAccount}</p>
        : draftKey && deviceAt ? <p className="save-state"><Icon name="check" size={15} />{x.savedDeviceAt(deviceAt)}</p> : null}
    </>
  );
  const draftBtn = (cls = "") => !live && (
    <button className={`btn ${cls}`} name="intent" value="draft" disabled={pending || busy !== null || !canDraft} aria-busy={pending} title={canDraft ? undefined : x.err.title}>{pending ? x.saving : x.saveDraft}</button>
  );

  return (
    <form action={action} className="compose" noValidate
      onKeyDown={(e) => { const el = e.target as HTMLElement; if (e.key === "Enter" && el.tagName === "INPUT" && !["checkbox", "radio", "file"].includes((el as HTMLInputElement).type)) e.preventDefault(); }}
      onSubmit={(e) => {
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.value === "submit") {
          const keys = Object.keys(missing);
          if (keys.length) { e.preventDefault(); setErrors(missing); jump(sectionOf(keys[0])); }
        }
      }}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="payload" value={payload} />

      <div id="wizard-top" className="wizard-head">
        <div className="wizard-intro">
          <p className="eyebrow">{wizard.progress} {activeStep + 1} / {wizard.steps.length}</p>
          <h2>{wizard.steps[activeStep]}</h2>
          <span className="small muted">{k.side.ready(doneCount, items.length)}</span>
        </div>
        <nav aria-label={wizard.section} className="wizard-nav">
          <ol>{wizard.steps.map((label, i) => (
            <li key={label}><button type="button" aria-current={activeStep === i ? "step" : undefined} onClick={() => navigateStep(i)}><span className="wizard-number">{i + 1}</span><span className="wizard-label">{label}</span></button></li>
          ))}</ol>
        </nav>
      </div>

      <div className="compose-bar" role="status">
        <span className="step-progress" aria-hidden="true"><span style={{ width: `${(doneCount / items.length) * 100}%` }} /></span>
        <span className="small"><strong>{k.side.ready(doneCount, items.length)}</strong></span>
        {!live && <span className="grow-end">{draftBtn("small")}</span>}
      </div>

      <div className="compose-main">
        {live && <p className="notice"><Icon name="info" size={18} />{x.liveNote}</p>}
        {restored && <p className="notice"><Icon name="undo" size={18} /><span>{x.restored} <button type="button" className="link" onClick={() => { setF(initial); setRestored(false); if (draftKey) localStorage.removeItem(draftKey); }}>{x.startOver}</button></span></p>}
        {upErr && <p className="notice err" role="alert"><Icon name="alert" size={18} />{upErr}</p>}

        <section id="s-title" className="part" hidden={activeStep !== 0}>
          <header><h2>{k.title.label}</h2><p className="muted">{k.title.hint}</p></header>
          <label className="field"><span className="sr">{k.title.label}</span>
            <input className="input big" value={f.title} maxLength={120} placeholder={k.title.ph} onChange={(e) => set("title", e.target.value)} {...inv("title")} />
            <small>{f.title.length}/120</small>{err("title")}
          </label>
          <div className="cols-2">
            <label className="field"><span>{c.beneficiary}{opt}</span>
              <input className="input" maxLength={120} value={f.beneficiary_name} onChange={(e) => set("beneficiary_name", e.target.value)} placeholder={x.ex.beneficiary} />
            </label>
            <label className="field"><span>{c.relation}{opt}</span>
              <select className="input" value={f.beneficiary_relation} onChange={(e) => set("beneficiary_relation", e.target.value)}>
                <option value="">{c.choose}</option>
                {RELATIONS.map((relation) => <option key={relation} value={relation}>{d.relations[relation]}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section id="s-category" className="part" hidden={activeStep !== 0}>
          <header><h2>{k.category.label}</h2><p className="muted">{k.category.hint}</p></header>
          <fieldset className="field" {...(errors.cause ? { "aria-describedby": "e-cause" } : {})}>
            <legend className="sr">{k.category.label}</legend>
            <div className="choice-row">
              {cats.map((cat) => <label key={cat.slug} className="choice"><input type="radio" name="cause" checked={f.cause === cat.slug} onChange={() => set("cause", cat.slug)} /><span>{cat[`name_${locale}`]}</span></label>)}
            </div>
            {err("cause")}
          </fieldset>
        </section>

        <section id="s-cover" className="part" hidden={activeStep !== 2}>
          <header><h2>{k.cover.label}</h2><p className="muted">{k.cover.hint}</p></header>
          <div className="field">
            {cropFile ? (
              <Cropper file={cropFile} labels={{ ...x.crop }} busy={busy === "cover"} onUse={useCover} onCancel={() => setCropFile(null)} />
            ) : f.cover_path ? (
              <div className="stack">
                <div className="frame cover-preview">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(f.cover_path)} alt="" /></div>
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
        </section>

        <section id="s-story" className="part" hidden={activeStep !== 1}>
          <header><h2>{k.story.label}</h2><p className="muted" id="story-hint">{k.story.hint}</p></header>
          <div className="field">
            <label htmlFor="story-editor" className="sr">{k.story.label}</label>
            <StoryEditor id="story-editor" value={f.story} onChange={(html) => set("story", html)} placeholder={x.editor.placeholder} labels={x.editor} invalid={Boolean(errors.story)} describedBy={errors.story ? "e-story story-hint" : "story-hint"} />
            {err("story")}
          </div>
          <div className="voice-box">
            <div className="stack tight">
              <strong>{k.story.voice}{opt}</strong>
              <small className="muted">{k.story.voiceHint}</small>
            </div>
            <div className="row">
              <button type="button" className={`btn small ${recording ? "danger" : ""}`} onClick={toggleRecord} disabled={busy !== null && busy !== "voice"}><Icon name={recording ? "stop" : "mic"} size={16} />{recording ? c.stop : f.voice_path ? c.record : c.record}</button>
              {busy === "voice" && <span className="small muted">{c.uploading}</span>}
              {f.voice_path && !recording && <><audio controls preload="none" src={src(f.voice_path)} /><button type="button" className="btn small quiet" onClick={() => set("voice_path", null)}>{d.common.remove}</button></>}
            </div>
          </div>
          <label className="field narrow"><span>{c.language}</span>
            <select className="input" value={f.language} onChange={(e) => set("language", e.target.value)}>{Object.entries(storyLanguages).map(([l, name]) => <option key={l} value={l}>{name}</option>)}</select>
          </label>
        </section>

        <section id="s-location" className="part" hidden={activeStep !== 0}>
          <header><h2>{k.location.label}</h2><p className="muted">{k.location.hint}</p></header>
          <div className="cols-2">
            <label className="field"><span>{c.department}</span>
              <select className="input" value={f.department} onChange={(e) => set("department", e.target.value)} {...inv("department")}>
                <option value="">{c.choose}</option>
                {DEPARTMENTS.map((v) => <option key={v}>{v}</option>)}
              </select>{err("department")}
            </label>
            <label className="field"><span>{c.commune}{opt}</span><input className="input" value={f.commune} maxLength={80} placeholder={x.ex.commune} onChange={(e) => set("commune", e.target.value)} /></label>
          </div>
        </section>

        <section id="s-media" className="part" hidden={activeStep !== 2}>
          <header><h2>{k.media.label}{opt}</h2><p className="muted">{k.media.hint}</p></header>
          <div className="field"><span>{k.media.photos}</span>
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
          <label className="field"><span>{k.media.video}</span><input className="input" type="url" placeholder="https://" value={f.video_url} maxLength={300} onChange={(e) => set("video_url", e.target.value)} /><small>{c.videoHint}</small></label>

        </section>

        <section id="s-verify" className="part" hidden={activeStep !== 4}>
          <header><h2>{c.s5}</h2><p className="muted">{c.privateNote}</p></header>
          <p className="notice"><Icon name="lock" size={18} />{c.privateNote}</p>
          <div className="cols-2">
            <label className="field"><span>{c.contactName}{opt}</span><input className="input" value={f.priv.contact_name} maxLength={120} autoComplete="name" onChange={(e) => setPriv("contact_name", e.target.value)} /></label>
            <label className="field"><span>{c.contactEmail}{opt}</span><input className="input" type="email" value={f.priv.contact_email} maxLength={254} autoComplete="email" onChange={(e) => setPriv("contact_email", e.target.value)} /></label>
          </div>
          <label className="field"><span>{c.contactDetails}{opt}</span><textarea className="input" rows={2} maxLength={600} placeholder={c.contactDetailsHint} value={f.priv.contact_details} onChange={(e) => setPriv("contact_details", e.target.value)} /></label>
          <div className="verify-grid">
            {([
              ["id_front_path", c.idFront],
              ["id_back_path", c.idBack],
              ["selfie_path", c.selfie],
            ] as const).map(([key, label]) => (
              <div key={key} className="private-upload field">
                <span>{label}{opt}</span>
                {f.priv[key] ? (
                  <div className="private-upload-status">
                    <span className="row tight"><Icon name="done" size={18} />{c.uploaded}</span>
                    <button type="button" className="btn small quiet" onClick={() => setPriv(key, null)}>{d.common.remove}</button>
                  </div>
                ) : (
                  <label className="upload-zone small">
                    <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy !== null} onChange={(e) => { addPrivateImage(key, e.target.files?.[0]); e.target.value = ""; }} />
                    <Icon name={busy === key ? "spinner" : "camera"} size={21} />
                    <span>{busy === key ? c.uploading : c.addPhoto}</span>
                  </label>
                )}
              </div>
            ))}
          </div>
          <div className="cols-2">
            <label className="field"><span>{c.referenceName}{opt}</span><input className="input" maxLength={120} value={f.priv.reference_name} onChange={(e) => setPriv("reference_name", e.target.value)} /></label>
            <label className="field"><span>{c.referenceContact}{opt}</span><input className="input" maxLength={200} value={f.priv.reference_contact} onChange={(e) => setPriv("reference_contact", e.target.value)} /></label>
          </div>
          <div className="field"><span>{c.documents}{opt}</span>
            <small>{c.documentsHint}</small>
            {f.priv.documents.length > 0 && <p className="small"><Icon name="done" size={16} /> {f.priv.documents.length} {c.uploaded.toLowerCase()} <button type="button" className="link" onClick={() => setPriv("documents", [])}>{d.common.remove}</button></p>}
            {f.priv.documents.length < 8 && (
              <label className="upload-zone small"><input type="file" accept="image/*,application/pdf" disabled={busy !== null} onChange={(e) => { addDocument(e.target.files?.[0]); e.target.value = ""; }} />
                <Icon name={busy === "documents" ? "spinner" : "file"} size={22} className={busy === "documents" ? "icon spin" : "icon"} /><span>{busy === "documents" ? c.uploading : c.addDocument}</span></label>
            )}
          </div>
        </section>


        <section id="s-goal" className="part" hidden={activeStep !== 3}>
          <header><h2>{k.goal.label}{opt}</h2><p className="muted">{k.goal.hint}</p></header>
          <label className="field narrow"><span className="sr">{k.goal.label}</span>
            <span className="joined">
              <input className="input" inputMode="numeric" value={f.goal_amount} placeholder="50000" onChange={(e) => set("goal_amount", e.target.value.replace(/[^\d]/g, "").slice(0, 9))} />
              <select className="input" aria-label={d.support.currency} value={f.goal_currency} onChange={(e) => set("goal_currency", e.target.value)}><option>HTG</option><option>USD</option></select>
            </span>
          </label>
          <div className="cols-2">
            <label className="field"><span>{c.deadline}{opt}</span><input className="input" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></label>
            <label className="check urgency-check"><input type="checkbox" checked={f.urgent} onChange={(e) => set("urgent", e.target.checked)} /><span><strong>{c.urgent}</strong><small>{c.urgentHint}</small></span></label>
          </div>
        </section>

        <section id="s-receive" className="part" hidden={activeStep !== 3}>
          <header><h2>{k.receive.label}</h2><p className="muted">{k.receive.hint}</p></header>
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
        </section>

        <section id="s-submit" className="part submit-part" hidden={activeStep !== 5}>
          <header><h2>{live ? x.submitChanges : k.submit.label}</h2><p className="muted">{live ? k.submit.changesHint : k.submit.hint}</p></header>
          <div className="only-compact stack tight"><p className="eyebrow">{k.side.preview}</p>{card}</div>
          {!live && (
            <fieldset className="field stack" style={{ gap: 12 }}>
              <legend className="sr">{k.items.consent}</legend>
              {[c.consentTruth, c.consentTerms, c.consentOff].map((label, i) => (
                <label key={label} className="check"><input type="checkbox" checked={consent[i]} onChange={(e) => { setConsent((p) => p.map((v, j) => (j === i ? e.target.checked : v))); setErrors((er) => { const n = { ...er }; delete n.consent; return n; }); }} /><span>{label}</span></label>
              ))}
              {err("consent")}
            </fieldset>
          )}
          <ul className="next-list">
            <li><Icon name="clock" size={18} /><span>{k.submit.eta}</span></li>
            <li><Icon name="mail" size={18} /><span>{k.submit.reach(mail)}</span></li>
          </ul>
          {Object.keys(errors).length > 0 && (
            <div className="notice err" role="alert"><Icon name="alert" size={18} /><span><strong>{c.missing}</strong>
              <span className="row tight" style={{ marginTop: 8 }}>{items.filter(([, , ok]) => !ok).map(([id, label]) => <button key={id} type="button" className="chip" onClick={() => jump(id)}>{label}</button>)}</span></span></div>
          )}
          <div className="row end-row">
            {draftBtn()}
            <button className="btn primary" name="intent" value="submit" disabled={pending || busy !== null} aria-busy={pending}>{pending ? <><Icon name="spinner" size={18} />{d.common.loading}</> : live ? x.submitChanges : k.submit.label}</button>
          </div>
          <div className="stack tight">{saveState}</div>
        </section>
        <div className="wizard-actions">
          {activeStep > 0 && <button type="button" className="btn" onClick={() => navigateStep(activeStep - 1)}><Icon name="left" size={18} />{wizard.back}</button>}
          {activeStep < wizard.steps.length - 1 && <button type="button" className="btn primary" onClick={() => navigateStep(activeStep + 1)}>{wizard.next}<Icon name="right" size={18} /></button>}
        </div>
      </div>

      <aside className="compose-side" aria-label={k.side.preview}>
        <div className="stack tight">
          <p className="eyebrow">{k.side.preview}</p>
          {card}
          <p className="small muted">{k.side.previewHint}</p>
        </div>
        <div className="stack tight">
          <p className="eyebrow">{k.side.list} · {k.side.ready(doneCount, items.length)}</p>
          <ul className="checklist-side">
            {items.map(([id, label, ok]) => (
              <li key={id}><button type="button" onClick={() => jump(id)} className={ok ? "ok" : ""}><span className="dot">{ok ? <Icon name="check" size={14} /> : null}</span>{label}</button></li>
            ))}
          </ul>
        </div>
        <div className="stack tight">
          {draftBtn()}
          {saveState}
        </div>
      </aside>
    </form>
  );
}
