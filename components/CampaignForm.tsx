"use client";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import StoryEditor from "./StoryEditor";
import { saveCampaign } from "@/app/actions";
import { DEPARTMENTS, METHODS, RELATIONS, type MethodGroup } from "@/lib/constants";
import { storyLanguages, t, type Locale } from "@/lib/i18n";
import { uploadBlob, uploadImage } from "@/lib/upload";
import { fmtMoney, mediaUrl } from "@/lib/format";
import { deviceDraft, restoreDeviceDraft, type FormState, type IdentityFileField } from "@/lib/form";
import { verificationCopy } from "@/lib/dict/verification";
import type { Category } from "@/lib/types";
export type { FormState };

const LINK = /^https:\/\/[^\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const time = (locale: Locale) => new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date());

/** One page, in the order a supporter reads it: title, category, photo, story, place, media, goal, how to help. */
export default function CampaignForm({ locale, cats, initial, draftKey, live, email, reviewNote }: { locale: Locale; cats: Category[]; initial: FormState; draftKey: string | null; live: boolean; email?: string; reviewNote?: string | null }) {
  const d = t(locale), c = d.create, x = d.x.form, k = x.compose, verification = verificationCopy[locale];
  const [f, setF] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [upErr, setUpErr] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [deviceAt, setDeviceAt] = useState<string | null>(null);
  const [consent, setConsent] = useState([false, false, false]);
  const [verificationConsent, setVerificationConsent] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const coverPicker = useRef<HTMLInputElement | null>(null);
  const previews = useRef<Record<string, string>>({});
  const [state, action, pending] = useActionState(saveCampaign, null);

  // Restore from this device, then keep a copy as the organizer types.
  useEffect(() => {
    if (!draftKey) return;
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) { setF(restoreDeviceDraft(initial, raw)); setRestored(true); }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);
  useEffect(() => {
    if (!draftKey) return;
    const id = setTimeout(() => { try { localStorage.setItem(draftKey, deviceDraft(f)); setDeviceAt(time(locale)); } catch {} }, 700);
    return () => clearTimeout(id);
  }, [f, draftKey, locale]);
  // A saved draft gets an id so the next save updates it.
  useEffect(() => { if (state?.ok && state.id) setF((p) => (p.id ? p : { ...p, id: state.id })); }, [state]);

  const set = <K extends keyof FormState>(key: K, v: FormState[K]) => { setF((p) => ({ ...p, [key]: v })); setErrors((e) => { const n = { ...e }; delete n[key as string]; return n; }); };
  const setPriv = <K extends keyof FormState["priv"]>(key: K, v: FormState["priv"][K]) => {
    setF((p) => ({ ...p, priv: { ...p.priv, [key]: v } }));
    setVerificationConsent(false);
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };
  const setMethod = (id: string, patch: Partial<{ details: string; link: string }> | null) => setF((p) => {
    const next = { ...p.methods };
    if (patch === null) delete next[id]; else next[id] = Object.assign({ details: "", link: "" }, next[id], patch);
    return { ...p, methods: next };
  });
  const src = (path: string) => previews.current[path] ?? mediaUrl(path) ?? "";

  const methods = useMemo(() => Object.entries(f.methods).filter(([, v]) => v.details.trim().length >= 3).map(([method, v]) => ({ method, details: v.details.trim(), link: v.link.trim() })), [f.methods]);
  // A stock/demo preview is not a valid fundraiser cover for review.
  // Only an image uploaded to the organizer's media folder can satisfy this requirement.
  const uploadedCover = Boolean(f.cover_path && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-z0-9-]{8,60}\.(webp|jpg|jpeg|png)$/i.test(f.cover_path));
  const illustrativeCover = Boolean(f.cover_path && !uploadedCover);
  const consentOk = (live || consent.every(Boolean)) && verificationConsent;

  // What is missing, by section. The checklist and the submit button read from the same rules.
  function check(): Record<string, string> {
    const e: Record<string, string> = {};
    if (f.title.trim().length < 4) e.title = x.err.title;
    if (!f.cause) e.cause = x.err.cause;
    if (!uploadedCover) e.cover_path = illustrativeCover ? k.cover.demoReplace : x.err.cover;
    if (plain(f.story).length < 40 && !f.voice_path) e.story = x.err.story;
    if (!f.department) e.department = x.err.department;
    if (f.beneficiary_name.trim().length < 2) e.beneficiary_name = c.needRecipient;
    if (!(RELATIONS as readonly string[]).includes(f.beneficiary_relation)) e.beneficiary_relation = c.needRecipient;
    if (f.priv.contact_name.trim().length < 2) e.contact_name = c.needContact;
    if (!EMAIL.test(f.priv.contact_email.trim())) e.contact_email = c.needContact;
    if (f.priv.contact_details.trim().length < 3) e.contact_details = c.needContact;
    if (!f.priv.id_front_path) e.id_front_path = c.needIdentity;
    if (!f.priv.selfie_path) e.selfie_path = c.needIdentity;
    if (!methods.length) e.methods = x.err.method;
    for (const [id, v] of Object.entries(f.methods)) {
      if (v.details.trim().length < 3) e[`m.${id}`] = x.err.details;
      if (v.link.trim() && !LINK.test(v.link.trim())) e[`l.${id}`] = x.err.link;
    }
    if (!live && !consent.every(Boolean)) e.consent = x.err.consent;
    if (!verificationConsent) e.verificationConsent = verification.consentError;
    return e;
  }
  const missing = useMemo(check, // eslint-disable-next-line react-hooks/exhaustive-deps
    [f, consent, methods, verificationConsent, live]);
  const verificationKeys = ["contact_name", "contact_email", "contact_details", "id_front_path", "selfie_path", "verificationConsent"];
  const sectionOf = (key: string) => (verificationKeys.includes(key) ? "verification" : key.startsWith("beneficiary_") ? "beneficiary" : key === "title" ? "title" : key === "cause" ? "category" : key === "cover_path" ? "cover" : key === "story" ? "story" : key === "department" ? "location" : key === "consent" ? "submit" : "receive");
  const items: [string, string, boolean][] = [
    ["title", k.items.title, !missing.title], ["category", k.items.category, !missing.cause], ["cover", k.items.cover, !missing.cover_path],
    ["story", k.items.story, !missing.story], ["location", k.items.location, !missing.department],
    ["beneficiary", c.s1, !missing.beneficiary_name && !missing.beneficiary_relation],
    ["receive", k.items.receive, !Object.keys(missing).some((m) => m === "methods" || m.startsWith("m.") || m.startsWith("l."))],
    ["verification", verification.title, !verificationKeys.some((key) => missing[key])],
    ...(live ? [] : [["submit", k.items.consent, consent.every(Boolean)] as [string, string, boolean]]),
  ];
  const doneCount = items.filter(([, , ok]) => ok).length;

  const jump = (section: string) => {
    const el = document.getElementById(`s-${section}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => ((section === "cover" ? el?.querySelector<HTMLElement>("[data-cover-replace]") : null)
      ?? el?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?? el?.querySelector<HTMLElement>("input:not([type=radio]), select, textarea, button, [contenteditable=true]"))?.focus({ preventScroll: true }));
  };

  // Server-side validation can reject a cover path that the browser could not verify.
  // Point the organizer at the exact field instead of showing an unexplained footer error.
  useEffect(() => {
    if (state?.ok === false && state.field === "cover_path") {
      setErrors((previous) => ({ ...previous, cover_path: state.message }));
      jump("cover");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  async function run<T>(key: string, job: () => Promise<T>): Promise<T | null> {
    setBusy(key); setUpErr(null);
    try { return await job(); }
    catch (e) { setUpErr(e instanceof Error && e.message === "too-big" ? c.tooBig : c.uploadFailed); return null; }
    finally { setBusy(null); }
  }
  async function addCover(file: File | undefined) {
    if (!file || busy !== null || pending) return;
    setBusy("cover");
    setUpErr(null);
    setErrors((old) => { const next = { ...old }; delete next.cover_path; return next; });
    try {
      const path = await uploadImage("media", file, { max: 1600, ratio: 1 });
      set("cover_path", path);
    } catch {
      setErrors((old) => ({ ...old, cover_path: k.cover.uploadError }));
    } finally {
      setBusy(null);
    }
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
  async function addIdentity(key: IdentityFileField, file: File | undefined) {
    if (!file) return;
    if (!ID_IMAGE_TYPES.includes(file.type)) { setUpErr(verification.invalidFile); return; }
    const path = await run(key, () => uploadImage("documents", file, { max: 2400 }));
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
  const identityInput = (key: IdentityFileField, label: string, optional = false) => (
    <div className="field">
      <strong id={`${key}-label`}>{label}{optional ? opt : null}</strong>
      {f.priv[key] && <p className="small" role="status"><Icon name="lock" size={16} /> {verification.uploaded}</p>}
      <label className="upload-zone small">
        <input id={`verify-${key}`} type="file" accept="image/jpeg,image/png,image/webp" capture={key === "selfie_path" ? "user" : "environment"}
          disabled={busy !== null || pending} aria-labelledby={`${key}-label`} aria-required={!optional} {...inv(key)}
          aria-describedby={`identity-hint identity-format${errors[key] ? ` e-${key}` : ""}`}
          onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; void addIdentity(key, file); }} />
        <Icon name={busy === key ? "spinner" : "camera"} size={22} className={busy === key ? "icon spin" : "icon"} />
        <span>{busy === key ? c.uploading : f.priv[key] ? verification.replace : c.addPhoto}</span>
      </label>
      {f.priv[key] && <button type="button" className="btn small quiet" disabled={busy !== null || pending} aria-label={verification.remove(label)} onClick={() => setPriv(key, null)}>{d.common.remove}</button>}
      {err(key)}
    </div>
  );
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
    <button className={`btn ${cls}`} name="intent" value="draft" disabled={pending || busy !== null || recording || !canDraft} aria-busy={pending} title={canDraft ? undefined : x.err.title}>{pending ? x.saving : x.saveDraft}</button>
  );

  return (
    <form action={action} className="compose" noValidate
      onKeyDown={(e) => { const el = e.target as HTMLElement; if (e.key === "Enter" && el.tagName === "INPUT" && !["checkbox", "radio", "file"].includes((el as HTMLInputElement).type)) e.preventDefault(); }}
      onSubmit={(e) => {
        if (busy !== null || pending || recording) { e.preventDefault(); return; }
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.value === "submit") {
          const keys = Object.keys(missing);
          if (keys.length) {
            e.preventDefault();
            setErrors(missing);
            // A missing or illustrative cover is especially easy to miss when a preview is visible.
            jump(sectionOf(keys.includes("cover_path") ? "cover_path" : keys[0]));
          }
        }
      }}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="payload" value={payload} />

      <div className="compose-bar" role="status">
        <span className="step-progress" aria-hidden="true"><span style={{ width: `${(doneCount / items.length) * 100}%` }} /></span>
        <span className="small"><strong>{k.side.ready(doneCount, items.length)}</strong></span>
        {!live && <span className="grow-end">{draftBtn("small")}</span>}
      </div>

      <div className="compose-main">
        {live && <p className="notice"><Icon name="info" size={18} />{x.liveNote}</p>}
        {reviewNote && <section className="notice" aria-labelledby="verification-correction"><Icon name="info" size={18} /><div><strong id="verification-correction">{verification.correction}</strong><p>{reviewNote}</p></div></section>}
        {restored && <p className="notice"><Icon name="undo" size={18} /><span>{x.restored} <button type="button" className="link" onClick={() => { setF(initial); setRestored(false); if (draftKey) localStorage.removeItem(draftKey); }}>{x.startOver}</button></span></p>}
        {upErr && <p className="notice err" role="alert"><Icon name="alert" size={18} />{upErr}</p>}

        <section id="s-title" className="part">
          <header><h2>{k.title.label}</h2><p className="muted">{k.title.hint}</p></header>
          <label className="field"><span className="sr">{k.title.label}</span>
            <input className="input big" value={f.title} maxLength={120} placeholder={k.title.ph} onChange={(e) => set("title", e.target.value)} {...inv("title")} />
            <small>{f.title.length}/120</small>{err("title")}
          </label>
        </section>

        <section id="s-category" className="part">
          <header><h2>{k.category.label}</h2><p className="muted">{k.category.hint}</p></header>
          <fieldset className="field" {...(errors.cause ? { "aria-describedby": "e-cause" } : {})}>
            <legend className="sr">{k.category.label}</legend>
            <div className="choice-row">
              {cats.map((cat) => <label key={cat.slug} className="choice"><input type="radio" name="cause" checked={f.cause === cat.slug} onChange={() => set("cause", cat.slug)} /><span>{cat[`name_${locale}`]}</span></label>)}
            </div>
            {err("cause")}
          </fieldset>
        </section>

        <section id="s-cover" className="part">
          <header><h2>{k.cover.label}</h2><p className="muted">{k.cover.hint}</p></header>
          <div className="field">
            <input ref={coverPicker} id="cover-file" type="file" accept="image/*" hidden disabled={busy !== null || pending}
              onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; void addCover(file); }} />
            {f.cover_path ? (
              <div className="stack">
                <div className="frame cover-preview">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(f.cover_path)} alt="" /></div>
                {illustrativeCover && <p className="small muted">{k.cover.demoReplace}</p>}
                <div className="row">
                  <button type="button" className="btn small" data-cover-replace disabled={busy !== null || pending}
                    aria-describedby={errors.cover_path ? "e-cover_path" : undefined}
                    onClick={() => coverPicker.current?.click()}><Icon name={busy === "cover" ? "spinner" : "camera"} size={16} />{busy === "cover" ? c.uploading : x.crop.change}</button>
                  <button type="button" className="btn small quiet" disabled={busy !== null || pending} onClick={() => set("cover_path", null)}>{x.crop.remove}</button>
                </div>
              </div>
            ) : (
              <button type="button" className="upload-zone cover-upload" data-cover-replace
                disabled={busy !== null || pending} aria-busy={busy === "cover"} {...inv("cover_path")}
                onClick={() => coverPicker.current?.click()}>
                <Icon name={busy === "cover" ? "spinner" : "camera"} size={28} />
                <span>{busy === "cover" ? c.uploading : c.addPhoto}</span>
              </button>
            )}
            {err("cover_path")}
          </div>
        </section>

        <section id="s-story" className="part">
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

        <section id="s-location" className="part">
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

        <section id="s-beneficiary" className="part">
          <header><h2>{c.s1}</h2><p className="muted" id="beneficiary-hint">{verification.beneficiaryHint}</p></header>
          <div className="cols-2">
            <label className="field"><span>{c.beneficiary}</span>
              <input className="input" value={f.beneficiary_name} maxLength={120} required aria-required="true" onChange={(e) => set("beneficiary_name", e.target.value)} {...inv("beneficiary_name")} />
              {err("beneficiary_name")}
            </label>
            <label className="field"><span>{c.relation}</span>
              <select className="input" value={f.beneficiary_relation} required aria-required="true" onChange={(e) => set("beneficiary_relation", e.target.value)} {...inv("beneficiary_relation")}>
                <option value="">{c.choose}</option>
                {RELATIONS.map((relation) => <option key={relation} value={relation}>{d.relations[relation]}</option>)}
              </select>{err("beneficiary_relation")}
            </label>
          </div>
        </section>

        <section id="s-media" className="part">
          <header><h2>{k.media.label}{opt}</h2><p className="muted">{k.media.hint}</p></header>
          <div className="field"><span>{k.media.photos}</span>
            {f.gallery.length > 0 && (
              <div className="thumbs">
                {f.gallery.map((p) => (
                  <span key={p} className="thumb"><span className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(p)} alt="" /></span>
                    <button type="button" className="close-control" aria-label={d.common.remove} onClick={() => set("gallery", f.gallery.filter((v) => v !== p))}><Icon name="close" size={14} /></button></span>
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
          <div className="field"><span>{k.media.documents}</span>
            <small>{k.media.documentsHint}</small>
            <small>{verification.recipientEvidence}</small>
            {f.priv.documents.length > 0 && <p className="small"><Icon name="done" size={16} /> {f.priv.documents.length} {c.uploaded.toLowerCase()} <button type="button" className="link" onClick={() => setPriv("documents", [])}>{d.common.remove}</button></p>}
            {f.priv.documents.length < 8 && (
              <label className="upload-zone small"><input type="file" accept="image/*,application/pdf" disabled={busy !== null} onChange={(e) => { addDocument(e.target.files?.[0]); e.target.value = ""; }} />
                <Icon name={busy === "documents" ? "spinner" : "file"} size={22} className={busy === "documents" ? "icon spin" : "icon"} /><span>{busy === "documents" ? c.uploading : c.addDocument}</span></label>
            )}
          </div>
        </section>

        <section id="s-goal" className="part">
          <header><h2>{k.goal.label}{opt}</h2><p className="muted">{k.goal.hint}</p></header>
          <label className="field narrow"><span className="sr">{k.goal.label}</span>
            <span className="joined">
              <input className="input" inputMode="numeric" value={f.goal_amount} placeholder="50000" onChange={(e) => set("goal_amount", e.target.value.replace(/[^\d]/g, "").slice(0, 9))} />
              <select className="input" aria-label={d.support.currency} value={f.goal_currency} onChange={(e) => set("goal_currency", e.target.value)}><option>HTG</option><option>USD</option></select>
            </span>
          </label>
        </section>

        <section id="s-receive" className="part">
          <header><h2>{k.receive.label}</h2><p className="muted">{k.receive.hint}</p></header>
          <p className="notice"><Icon name="eye" size={18} />{c.methodsWarn}</p>
          <p className="small muted">{verification.recipientHint}</p>
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

        <section id="s-verification" className="part" aria-labelledby="verification-title" aria-busy={[...verificationKeys, "id_back_path"].includes(busy ?? "")}>
          <header><h2 id="verification-title">{verification.title}</h2><p className="muted">{verification.intro}</p></header>
          <p className="notice"><Icon name="lock" size={18} />{c.privateNote}</p>
          <p className="small muted" id="verification-contact-hint">{verification.contactHint}</p>
          <div className="cols-2">
            <label className="field"><span>{c.contactName}</span>
              <input className="input" autoComplete="name" value={f.priv.contact_name} maxLength={120} required aria-required="true" onChange={(e) => setPriv("contact_name", e.target.value)} {...inv("contact_name")} />
              {err("contact_name")}
            </label>
            <label className="field"><span>{c.contactEmail}</span>
              <input className="input" type="email" inputMode="email" autoComplete="email" value={f.priv.contact_email} maxLength={254} required aria-required="true" onChange={(e) => setPriv("contact_email", e.target.value)} {...inv("contact_email")} />
              {err("contact_email")}
            </label>
          </div>
          <label className="field"><span>{c.contactDetails}</span>
            <textarea className="input" rows={4} value={f.priv.contact_details} maxLength={600} required aria-required="true" onChange={(e) => setPriv("contact_details", e.target.value)} {...inv("contact_details")} aria-describedby={`verification-recipient-hint${errors.contact_details ? " e-contact_details" : ""}`} />
            <small id="verification-recipient-hint">{verification.contactDetailsHint}</small>{err("contact_details")}
          </label>
          <div className="stack">
            <p className="muted" id="identity-hint">{verification.identityHint}</p>
            <small id="identity-format">{verification.format}</small>
            <div className="cols-2">
              {identityInput("id_front_path", c.idFront)}
              {identityInput("selfie_path", c.selfie)}
            </div>
            {identityInput("id_back_path", c.idBack, true)}
          </div>
          <div className="cols-2">
            <label className="field"><span>{c.referenceName}{opt}</span><input className="input" value={f.priv.reference_name} maxLength={120} onChange={(e) => setPriv("reference_name", e.target.value)} /></label>
            <label className="field"><span>{c.referenceContact}{opt}</span><input className="input" value={f.priv.reference_contact} maxLength={200} onChange={(e) => setPriv("reference_contact", e.target.value)} /></label>
          </div>
          <label className="check"><input type="checkbox" checked={verificationConsent} required aria-required="true" onChange={(e) => { setVerificationConsent(e.target.checked); setErrors((old) => { const next = { ...old }; delete next.verificationConsent; return next; }); }} {...inv("verificationConsent")} /><span>{verification.consent}</span></label>
          {err("verificationConsent")}
          {draftKey && <p className="small muted"><Icon name="lock" size={15} />{verification.privateDraft}</p>}
        </section>

        <section id="s-submit" className="part submit-part">
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
            <button className="btn primary" name="intent" value="submit" disabled={pending || busy !== null || recording} aria-busy={pending}>{pending ? <><Icon name="spinner" size={18} />{d.common.loading}</> : live ? x.submitChanges : k.submit.label}</button>
          </div>
          <div className="stack tight">{saveState}</div>
        </section>
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
