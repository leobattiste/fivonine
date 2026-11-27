"use client";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import StoryEditor from "./StoryEditor";
import { saveCampaign } from "@/app/actions";
import { DEPARTMENTS, METHODS, RELATIONS, type MethodGroup } from "@/lib/constants";
import { t, type Locale } from "@/lib/i18n";
import { uploadImage } from "@/lib/upload";
import { fmtMoney, mediaUrl, campaignPlace } from "@/lib/format";
import { deviceDraft, restoreDeviceDraft, type FormState, type IdentityFileField } from "@/lib/form";
import { formText } from "@/lib/dict/form";
import type { Category } from "@/lib/types";
import { countryOptions, isCountry } from "@/lib/countries";
import { formatPayment, parsePayment, paymentFields, paymentLabel, paymentValid, paymentIssues, paymentRows, formatWalletNumber, splitContact, formatContact } from "@/lib/payment-fields";
import { createFlow } from "@/lib/dict/create-flow";
export type { FormState };

const LINK = /^https:\/\/[^\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
/** Minimal client-side sanitizer for the preview: the story editor only produces these tags. */
const PREVIEW_TAGS = new Set(["P", "BR", "STRONG", "EM", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE", "A"]);
function previewHtml(html: string): string {
  if (typeof window === "undefined" || !html) return "";
  const doc = new DOMParser().parseFromString(/^\s*</.test(html) ? html : `<p>${html.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`, "text/html");
  const walk = (el: Element) => {
    for (const child of Array.from(el.children)) {
      if (!PREVIEW_TAGS.has(child.tagName)) { child.replaceWith(...Array.from(child.childNodes)); continue; }
      for (const a of Array.from(child.attributes)) if (!(child.tagName === "A" && a.name === "href" && /^https:\/\//.test(a.value))) child.removeAttribute(a.name);
      if (child.tagName === "A") { child.setAttribute("target", "_blank"); child.setAttribute("rel", "noopener noreferrer nofollow"); }
      walk(child);
    }
  };
  walk(doc.body);
  return doc.body.innerHTML;
}
/** Rough minutes each unfinished item takes. "Time left" is the sum of what is still missing, not the step position. */
const ITEM_MINUTES: Record<string, number> = {
  beneficiary_relation: 0.3, beneficiary_name: 0.3, organization_role: 0.3, cause: 0.3, country_code: 0.3, department: 0.3, commune: 0.3,
  title: 0.7, story: 4, goal_amount: 0.5, budget: 0.7, cover_path: 2, video_url: 0.3, methods: 2,
  contact_name: 0.3, contact_email: 0.3, contact_details: 0.5, id_front_path: 1.5, selfie_path: 1.5, consent: 0.5, verificationConsent: 0.2,
};
const time = (locale: Locale) => new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date());

/** One visible section at a time, with shared draft state and final submission validation. */
export default function CampaignForm({ locale, cats, initial, draftKey, live, email, reviewNote, countryList, autosave = false, resetDevice = false }: { locale: Locale; cats: Category[]; initial: FormState; draftKey: string | null; live: boolean; email?: string; reviewNote?: string | null; countryList?: { code: string; name: string }[]; autosave?: boolean; resetDevice?: boolean }) {
  const d = t(locale), cf = createFlow[locale];
  const [f, setF] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [navigation, setNavigation] = useState<{ section: string; target: "tab" | "panel" | "error" } | null>(null);
  const activeStep = navigation?.section ?? "basics";
  const F = formText[locale], ui = F.ui, c = F.c, k = F.k, verification = F.verification, x = { ...F.x, editor: d.x.form.editor };
  const navCopy = { ...F.nav, basics: F.steps.basics, story: F.steps.story, goal: F.steps.goal, support: F.steps.receive, review: F.steps.submit };
  const countries = useMemo(() => countryList ?? countryOptions(locale), [countryList, locale]);
  const beneficiaryType = f.beneficiary_relation === "self" ? "self" : f.beneficiary_relation === "organization" ? "org" : f.beneficiary_relation ? "other" : "";
  const [busy, setBusy] = useState<string | null>(null);
  const [upErr, setUpErr] = useState<string | null>(null);
  const [deviceAt, setDeviceAt] = useState<string | null>(null);
  const [consent, setConsent] = useState([false, false, false]);
  const [verificationConsent, setVerificationConsent] = useState(false);
  const [beneficiaryConsent, setBeneficiaryConsent] = useState(false);
  const previewDialog = useRef<HTMLDialogElement | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [photoMenu, setPhotoMenu] = useState<string | null>(null);
  const [photoProgress, setPhotoProgress] = useState({done:0,total:0});
  const photoPicker = useRef<HTMLInputElement | null>(null);
  const [methodToAdd, setMethodToAdd] = useState("");
  const previews = useRef<Record<string, string>>({});
  const [state, action, pending] = useActionState(saveCampaign, null);
  useEffect(() => {
    if (!photoMenu) return;
    const close = (e: PointerEvent) => { if (!(e.target as HTMLElement)?.closest?.(".photo-tile")) setPhotoMenu(null); };
    document.addEventListener("pointerdown",close);
    return () => document.removeEventListener("pointerdown",close);
  }, [photoMenu]);

  // Restore from this device, then keep a copy as the organizer types.
  useEffect(() => {
    if (!draftKey) return;
    try {
      // "Start a new one": forget the unsaved answers on this device, then behave like a normal resume on refresh.
      if (resetDevice) { localStorage.removeItem(draftKey); window.history.replaceState(null, "", `${window.location.pathname}?resume=1`); return; }
      const raw = localStorage.getItem(draftKey);
      if (raw) setF(restoreDeviceDraft(initial, raw));
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
  const photos = Array.from(new Set([f.cover_path, ...f.gallery].filter((p): p is string => Boolean(p)))).slice(0, 10);
  const uploadedCover = Boolean(f.cover_path && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-z0-9-]{8,60}\.(webp|jpg|jpeg|png)$/i.test(f.cover_path));
  const illustrativeCover = Boolean(f.cover_path && !uploadedCover);
  const needsBeneficiaryConsent = !live && Boolean(beneficiaryType) && beneficiaryType !== "self";
  const consentOk = (live || consent.every(Boolean)) && (!needsBeneficiaryConsent || beneficiaryConsent) && verificationConsent;
  const budgetLines = f.budget.filter((l) => l.label.trim() || l.amount.trim());
  const budgetTotal = budgetLines.reduce((sum, l) => sum + (Number(l.amount) > 0 ? Number(l.amount) : 0), 0);

  // What is missing, by section. The checklist and the submit button read from the same rules.
  function check(): Record<string, string> {
    const e: Record<string, string> = {};
    if (f.title.trim().length < 4) e.title = x.err.title;
    if (!f.cause) e.cause = x.err.cause;
    if (!uploadedCover) e.cover_path = illustrativeCover ? k.cover.demoReplace : x.err.cover;
    if (plain(f.story).length < 40) e.story = ({en:"Write at least 40 characters.",fr:"Écrivez au moins 40 caractères.",ht:"Ekri omwen 40 karaktè.",es:"Escribe al menos 40 caracteres."})[locale];
    if (!isCountry(f.country_code)) e.country_code = ui.requiredCountry;
    if (f.country_code === "HT" && (!f.department || f.department === "Diaspora")) e.department = x.err.department;
    if (isCountry(f.country_code) && f.country_code !== "HT" && !f.commune.trim()) e.commune = ui.requiredLocation;
    if (f.beneficiary_relation === "organization" && !f.organization_role.trim()) e.organization_role = ui.requiredRole;
    if (f.goal_amount.trim() && (!Number.isFinite(Number(f.goal_amount)) || Number(f.goal_amount) <= 0)) e.goal_amount = ui.invalidGoal;
    if (f.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(f.deadline)) e.deadline = ui.invalidDate;
    if (f.beneficiary_relation && f.beneficiary_name.trim().length < 2) e.beneficiary_name = c.needRecipient;
    if (!(RELATIONS as readonly string[]).includes(f.beneficiary_relation)) e.beneficiary_relation = c.needRecipient;
    if (f.priv.contact_name.trim().length < 2) e.contact_name = c.needContact;
    if (!EMAIL.test(f.priv.contact_email.trim())) e.contact_email = c.needContact;
    if (splitContact(f.priv.contact_details).phone.trim().length < 3) e.contact_details = c.needContact;
    if (!f.priv.id_front_path) e.id_front_path = c.needIdentity;
    if (!f.priv.selfie_path) e.selfie_path = c.needIdentity;
    if (!methods.length) e.methods = x.err.method;
    for (const [id, v] of Object.entries(f.methods)) {
      const issues = paymentIssues(id, v.details, v.link);
      if (issues.length) e[`m.${id}`] = cf.pay[issues[0]];
      else if (!paymentValid(id, v.details, v.link)) e[`m.${id}`] = x.err.details;
      if (v.link.trim() && !LINK.test(v.link.trim())) e[`l.${id}`] = x.err.link;
    }
    if (f.video_url.trim() && !LINK.test(f.video_url.trim())) e.video_url = cf.video.invalid;
    if (budgetLines.some((l) => l.label.trim().length < 2 || !(Number(l.amount) > 0))) e.budget = cf.budget.invalid;
    if (!live && (!consent.every(Boolean) || (needsBeneficiaryConsent && !beneficiaryConsent))) e.consent = x.err.consent;
    if (!verificationConsent) e.verificationConsent = verification.consentError;
    return e;
  }
  const missing = useMemo(check, // eslint-disable-next-line react-hooks/exhaustive-deps
    [f, consent, methods, verificationConsent, beneficiaryConsent, live]);
  const verificationKeys = ["contact_name", "contact_email", "contact_details", "id_front_path", "selfie_path", "verificationConsent"];
  const sectionOf = (key: string) => verificationKeys.includes(key) ? "verification" : key.startsWith("beneficiary_") || ["cause", "department", "country_code", "commune", "organization_role"].includes(key) ? "basics" : key === "title" || key === "story" ? "story" : key === "goal_amount" || key === "deadline" || key === "budget" ? "goal" : key === "cover_path" || key === "video_url" ? "media" : key === "consent" ? "submit" : "receive";
  const items: [string, string][] = [
    ["basics", navCopy.basics], ["story", navCopy.story], ["goal", navCopy.goal],
    ["media", F.steps.media], ["receive", navCopy.support],
    ["verification", F.steps.verification], ["submit", navCopy.review],
  ];
  const stepIndex = items.findIndex(([id]) => id === activeStep);
  const lastStep = stepIndex === items.length - 1;
  const navigationLocked = pending || busy !== null;
  const jump = (section: string, target: "tab" | "panel" | "error" = "error") => {
    setNavigation({ section, target });
  };
  const nextStep = () => {
    if (navigationLocked || lastStep) return;
    const sectionErrors = Object.fromEntries(Object.entries(missing).filter(([key]) => sectionOf(key) === activeStep));
    setErrors((old) => ({ ...Object.fromEntries(Object.entries(old).filter(([key]) => sectionOf(key) !== activeStep)), ...sectionErrors }));
    if (Object.keys(sectionErrors).length) jump(activeStep, "error");
    else jump(items[stepIndex + 1][0], "panel");
  };
  // Keep all panels mounted so field values and the story editor survive navigation.
  // Scroll and focus only after React has revealed the selected panel.
  useEffect(() => {
    if (!navigation) return;
    const { section, target } = navigation;
    const tab = document.getElementById(`wizard-tab-${section}`);
    const rail = document.getElementById("wizard-tabs");
    if (tab && rail) {
      const tr = tab.getBoundingClientRect(), rr = rail.getBoundingClientRect();
      if (tr.left < rr.left || tr.right > rr.right) rail.scrollLeft += tr.left - rr.left - (rr.width - tr.width) / 2;
    }
    const panel = document.getElementById(`s-${section}`);
    if (target === "tab") { tab?.focus({ preventScroll: true }); return; }
    if (target === "error") {
      const field = (section === "media" ? panel?.querySelector<HTMLElement>('[data-cover-replace][aria-invalid="true"]') : null)
        ?? panel?.querySelector<HTMLElement>('[aria-invalid="true"]:not([type="hidden"])')
        ?? panel?.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea, button, [contenteditable=true]")
        ?? panel;
      field?.focus({ preventScroll: true });
      (field?.closest(".field") ?? panel)?.scrollIntoView({ block: "start", behavior: "auto" });
    } else {
      panel?.focus({ preventScroll: true });
      document.getElementById("wizard-top")?.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, [navigation]);

  // Server-side validation can reject a cover path that the browser could not verify.
  // Point the organizer at the exact field instead of showing an unexplained footer error.
  useEffect(() => {
    if (state?.ok === false && state.field === "cover_path") {
      setErrors((previous) => ({ ...previous, cover_path: state.message }));
      jump("media");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  async function run<T>(key: string, job: () => Promise<T>): Promise<T | null> {
    setBusy(key); setUpErr(null);
    try { return await job(); }
    catch (e) { setUpErr(e instanceof Error && e.message === "too-big" ? c.tooBig : c.uploadFailed); return null; }
    finally { setBusy(null); }
  }
  async function addPhotos(files: FileList | null) {
    if (!files || busy !== null || pending) return;
    const selected = Array.from(files).slice(0, Math.max(0, 10 - photos.length));
    if (!selected.length) return;
    setBusy("photos"); setUpErr(null); setPhotoProgress({done:0,total:selected.length});
    const paths: string[] = [];
    let failed = false;
    try {
      for (let i = 0; i < selected.length; i++) {
        try { paths.push(await uploadImage("media", selected[i], { max: 1600 })); }
        catch { failed = true; }
        setPhotoProgress({done:i + 1,total:selected.length});
      }
      if (paths.length) {
        setF((p) => {
          const old = Array.from(new Set([p.cover_path, ...p.gallery].filter((v): v is string => Boolean(v))));
          const cover = p.cover_path && !/^(pexels|demo):/.test(p.cover_path) ? p.cover_path : paths[0];
          const all = Array.from(new Set([cover, ...old, ...paths])).filter(v => !/^(pexels|demo):/.test(v)).slice(0, 10);
          return { ...p, cover_path: cover, gallery: all.filter(v => v !== cover) };
        });
        setErrors((old) => { const next = { ...old }; delete next.cover_path; return next; });
      }
      if (failed) setUpErr(ui.photoError);
    } finally { setBusy(null); }
  }
  function makeCover(path: string) {
    setF((p) => ({ ...p, cover_path: path, gallery: Array.from(new Set([p.cover_path, ...p.gallery].filter((v): v is string => Boolean(v && v !== path)))).slice(0, 9) }));
    setPhotoMenu(null);
    setErrors((old) => { const next = { ...old }; delete next.cover_path; return next; });
  }
  function deletePhoto(path: string) {
    setF((p) => {
      const all = Array.from(new Set([p.cover_path, ...p.gallery].filter((v): v is string => Boolean(v && v !== path))));
      const cover = p.cover_path === path ? all[0] ?? null : p.cover_path;
      return { ...p, cover_path: cover, gallery: all.filter(v => v !== cover).slice(0, 9) };
    });
    setPhotoMenu(null);
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
  const payload = JSON.stringify({ ...f, methods, budget: budgetLines, hadBudget: initial.budget.length > 0, consent: consentOk });
  // Save to the account on its own a few seconds after the organizer stops typing, so nothing is lost if they leave.
  const [auto, setAuto] = useState<{ kind: "idle" | "saving" | "saved" | "failed"; at?: string }>({ kind: "idle" });
  const lastSaved = useRef(payload);
  const inFlight = useRef(false);
  useEffect(() => {
    if (!autosave || live || f.title.trim().length < 4 || payload === lastSaved.current || inFlight.current) return;
    const timer = setTimeout(async () => {
      if (inFlight.current || busy !== null || pending) return; // the next change retries
      inFlight.current = true;
      setAuto({ kind: "saving" });
      const sent = payload;
      try {
        const fd = new FormData();
        fd.set("locale", locale); fd.set("payload", sent); fd.set("intent", "draft");
        const r = await saveCampaign(null, fd);
        if (r?.ok) {
          lastSaved.current = sent;
          setAuto({ kind: "saved", at: r.at ?? time(locale) });
          const newId = r.id;
          if (newId) {
            setF((p) => (p.id ? p : { ...p, id: newId }));
            if (window.location.pathname.endsWith("/create")) window.history.replaceState(null, "", `${window.location.pathname}?draft=${newId}`);
          }
        } else setAuto({ kind: "failed" });
      } catch { setAuto({ kind: "failed" }); }
      finally { inFlight.current = false; }
    }, 2500);
    return () => clearTimeout(timer);
  }, [payload, autosave, live, busy, pending, locale, f.title, auto.kind]);
  const setBudget = (i: number, patch: Partial<{ label: string; amount: string }> | null) => {
    setF((p) => ({ ...p, budget: patch === null ? p.budget.filter((_, j) => j !== i) : p.budget.map((l, j) => (j === i ? { ...l, ...patch } : l)) }));
    setErrors((e) => { const n = { ...e }; delete n.budget; return n; });
  };
  const inDays = (n: number) => { const t = new Date(); t.setDate(t.getDate() + n); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`; };
  const storyChars = plain(f.story).length;
  const prompts = cf.prompts.byCause[f.cause] ?? cf.prompts.fallback;
  const minutesLeft = Math.ceil(Object.keys(missing).reduce((sum, key) => sum + (key.startsWith("m.") || key.startsWith("l.") ? 0.5 : ITEM_MINUTES[key] ?? 0.3), 0)
    + (!missing.story && storyChars < 400 ? 1.5 : 0));
  const openPreview = () => { setPreviewOpen(true); requestAnimationFrame(() => previewDialog.current?.showModal()); };
  const closePreview = () => { previewDialog.current?.close(); setPreviewOpen(false); };
  const err = (key: string) => errors[key] ? <p className="field-error" id={`e-${key}`}><Icon name="alert" size={15} />{errors[key]}</p> : null;
  const inv = (key: string) => ({ "aria-invalid": errors[key] ? true : undefined, "aria-describedby": errors[key] ? `e-${key}` : undefined });
  // Only the field that is actually wrong is marked, not every field of the method.
  const fieldBad = (id: string, key: string, value: string, v: { details: string; link: string }) => {
    if (!errors[`m.${id}`]) return false;
    if (!value.trim()) return key === "handle" ? !v.link.trim() : true;
    return (paymentIssues(id, v.details, v.link) as string[]).includes(key);
  };
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
  const where = campaignPlace(f, locale);
  const amount = Number(f.goal_amount) > 0 ? fmtMoney(Number(f.goal_amount), f.goal_currency, locale) : null;
  const summaries: Record<string,string> = { basics: [beneficiaryType ? navCopy[beneficiaryType] : "", f.beneficiary_name, catName, where].filter(Boolean).join(" · "), story: f.title, goal: [amount ?? ui.noGoal, f.deadline].filter(Boolean).join(" · "), media: ui.summaryPhotos(photos.length), receive: ui.summaryMethods(methods.length), verification: ui.summaryDocs([f.priv.id_front_path, f.priv.id_back_path, f.priv.selfie_path, ...f.priv.documents].filter(Boolean).length) };
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
  const saveState = autosave && !live ? (
    <>
      {state && !state.ok && <p className="field-error" role="alert"><Icon name="alert" size={15} />{state.message}</p>}
      <p className={`save-state ${auto.kind === "saved" ? "ok" : ""}`} role="status">
        {auto.kind === "saving" ? <><Icon name="spinner" size={15} />{F.save.saving}</>
          : auto.kind === "saved" ? <><Icon name="done" size={16} />{F.save.saved(auto.at ?? "")}</>
          : auto.kind === "failed" ? <><Icon name="alert" size={15} />{F.save.failed}</>
          : f.title.trim().length < 4 ? <><Icon name="check" size={15} />{F.save.deviceOnly}</> : f.id ? <><Icon name="done" size={16} />{F.save.saved("").replace(/ · $/, "")}</> : null}
      </p>
    </>
  ) : (
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
    <form action={action} className="compose wizard-form" noValidate
      onKeyDown={(e) => { const el = e.target as HTMLElement; if (e.key === "Enter" && el.tagName === "INPUT" && !["checkbox", "radio", "file"].includes((el as HTMLInputElement).type)) e.preventDefault(); }}
      onSubmit={(e) => {
        if (busy !== null || pending) { e.preventDefault(); return; }
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.value === "submit") {
          const keys = Object.keys(missing);
          if (keys.length) {
            e.preventDefault();
            setErrors(missing);
            const first = items.find(([id]) => keys.some((key) => sectionOf(key) === id));
            jump(first?.[0] ?? "submit");
          }
        }
      }}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="payload" value={payload} />

      <div id="wizard-top" className="wizard-top">
        <div className="wizard-progress" aria-live="polite">
          <div className="row spread small"><strong>{cf.stepOf(stepIndex + 1, items.length)} · {items[stepIndex]?.[1]}</strong><span className="muted">{minutesLeft === 0 ? F.save.readyToSend : cf.minutesLeft(minutesLeft)}</span></div>
          <div className="wizard-progress-bar" role="progressbar" aria-label={cf.stepOf(stepIndex + 1, items.length)} aria-valuemin={1} aria-valuemax={items.length} aria-valuenow={stepIndex + 1}><span style={{ width: `${((stepIndex + 1) / items.length) * 100}%` }} /></div>
        </div>
        <details className="wizard-steps-mobile" key={activeStep}>
          <summary>{navCopy.allSteps}</summary>
          <ol>{items.map(([id, label], i) => {
            const todo = Object.keys(missing).some((key) => sectionOf(key) === id);
            return <li key={id}><button type="button" aria-current={activeStep === id ? "step" : undefined} disabled={navigationLocked} onClick={() => jump(id, "panel")}><span className="n">{i + 1}</span><span>{label}</span>{i < stepIndex && !todo && <Icon name="check" size={16} />}</button></li>;
          })}</ol>
        </details>
        <div id="wizard-tabs" className="wizard-tabs tabs" role="tablist" aria-label={x.title}>
          {items.map(([id, label], i) => (
            <button type="button" key={id} id={`wizard-tab-${id}`} role="tab"
              aria-selected={activeStep === id} aria-controls={`s-${id}`}
              tabIndex={activeStep === id ? 0 : -1} disabled={navigationLocked}
              onClick={() => jump(id, "tab")}
              onKeyDown={(e) => {
                let next = i;
                if (e.key === "ArrowRight") next = (i + 1) % items.length;
                else if (e.key === "ArrowLeft") next = (i + items.length - 1) % items.length;
                else if (e.key === "Home") next = 0;
                else if (e.key === "End") next = items.length - 1;
                else return;
                e.preventDefault();
                jump(items[next][0], "tab");
              }}>{i + 1}. {label}</button>
          ))}
        </div>
      </div>

      <div className="compose-main">
        {live && <p className="notice"><Icon name="info" size={18} />{x.liveNote}</p>}
        {reviewNote && <section className="notice" aria-labelledby="verification-correction"><Icon name="info" size={18} /><div><strong id="verification-correction">{verification.correction}</strong><p>{reviewNote}</p></div></section>}
        {upErr && <p className="notice err" role="alert"><Icon name="alert" size={18} />{upErr}</p>}

        <section id="s-basics" className="part wizard-panel" role="tabpanel" aria-labelledby="wizard-tab-basics" tabIndex={-1} hidden={activeStep !== "basics"}>
          <header><h2>{navCopy.who}</h2></header>
          <fieldset className="field">
            <legend className="sr">{navCopy.who}</legend>
            <div className="beneficiary-options">
              {(["self", "other", "org"] as const).map((type) => (
                <label className="beneficiary-choice" key={type}>
                  <input type="radio" name="beneficiary-type" value={type} checked={beneficiaryType === type} {...inv("beneficiary_relation")}
                    onChange={() => {
                      if (beneficiaryType === type) return;
                      setF((old) => ({ ...old, beneficiary_relation: type === "org" ? "organization" : type === "self" ? "self" : "other", beneficiary_name: type === "self" ? old.priv.contact_name : "", organization_role: "" }));
                      setVerificationConsent(false);
                      setErrors((old) => { const next = { ...old }; delete next.beneficiary_name; delete next.beneficiary_relation; return next; });
                    }} />
                  <span><strong>{navCopy[type]}</strong><small>{navCopy[type === "self" ? "selfHint" : type === "org" ? "orgHint" : "otherHint"]}</small></span>
                </label>
              ))}
            </div>
            {err("beneficiary_relation")}
          </fieldset>
          {beneficiaryType && <div className="stack">
            <label className="field"><span>{beneficiaryType === "self" ? navCopy.selfName : beneficiaryType === "org" ? navCopy.orgName : c.beneficiary}</span>
              <input className="input" value={f.beneficiary_name} maxLength={120} required aria-required="true" onChange={(e) => set("beneficiary_name", e.target.value)} {...inv("beneficiary_name")} />
              {err("beneficiary_name")}
            </label>
            {beneficiaryType === "org" && <label className="field"><span>{ui.role}</span><input className="input" maxLength={120} value={f.organization_role} onChange={(e) => set("organization_role", e.target.value)} {...inv("organization_role")} />{err("organization_role")}</label>}
            {beneficiaryType === "other" && <label className="field"><span>{c.relation}</span>
              <select className="input" value={f.beneficiary_relation} onChange={(e) => set("beneficiary_relation", e.target.value)}>
                {RELATIONS.filter((relation) => relation !== "self" && relation !== "organization").map((relation) => <option key={relation} value={relation}>{d.relations[relation]}</option>)}
              </select>
            </label>}
          </div>}
          <div className="wizard-group">
          <header><h3>{k.category.label}</h3></header>
          <fieldset className="field" {...(errors.cause ? { "aria-describedby": "e-cause" } : {})}>
            <legend className="sr">{k.category.label}</legend>
            <div className="choice-row">
              {cats.map((cat) => <label key={cat.slug} className="choice"><input type="radio" name="cause" checked={f.cause === cat.slug} onChange={() => set("cause", cat.slug)} /><span>{cat[`name_${locale}`]}</span></label>)}
            </div>
            {err("cause")}
          </fieldset>
          </div>
          <div className="wizard-group">
          <header><h3>{ui.location}</h3></header>
          <label className="field"><span>{ui.country}</span>
            <select className="input" value={f.country_code} {...inv("country_code")} onChange={(e) => { const code = e.target.value; setF(p => ({ ...p, country_code: code, goal_currency: p.goal_amount.trim() ? p.goal_currency : code && code !== "HT" ? "USD" : "HTG", department: code && code !== "HT" ? "Diaspora" : "", commune: !p.country_code && p.department === "Diaspora" ? p.commune : "" })); setErrors(old => { const next = {...old}; delete next.country_code; delete next.department; delete next.commune; return next; }); }}>
              <option value="">{c.choose}</option>
              {countries.map(({code, name}) => <option key={code} value={code}>{name}</option>)}
            </select>{err("country_code")}
          </label>
          {f.country_code === "HT" ? <div className="cols-2">
            <label className="field"><span>{c.department}</span><select className="input" value={f.department === "Diaspora" ? "" : f.department} onChange={(e) => set("department", e.target.value)} {...inv("department")}><option value="">{c.choose}</option>{DEPARTMENTS.filter(v => v !== "Diaspora").map(v => <option key={v}>{v}</option>)}</select>{err("department")}</label>
            <label className="field"><span>{c.commune}</span><input className="input" value={f.commune} maxLength={80} onChange={(e) => set("commune", e.target.value)} /></label>
          </div> : f.country_code && <label className="field"><span>{ui.city}</span><input className="input" value={f.commune} maxLength={80} onChange={(e) => set("commune", e.target.value)} {...inv("commune")} />{err("commune")}</label>}
          </div>
        </section>

        <section id="s-story" className="part wizard-panel" role="tabpanel" aria-labelledby="wizard-tab-story" tabIndex={-1} hidden={activeStep !== "story"}>
          <header><h2>{ui.story}</h2><p className="muted">{ui.storyHelp}</p></header>
          <label className="field"><span>{ui.title}</span>
            <input className="input" value={f.title} maxLength={Math.max(80, initial.title.length)} placeholder={k.title.ph} onChange={(e) => set("title", e.target.value)} {...inv("title")} />
            <small>{f.title.length}/{Math.max(80, initial.title.length)}</small>{err("title")}
          </label>
          <div className="field">
            <label htmlFor="story-editor">{ui.desc}</label>
            {!storyChars && <div><button type="button" className="btn small soft" onClick={() => set("story", cf.prompts.guideHeadings.map((h) => `<h3>${h}</h3><p></p>`).join(""))}><Icon name="guide" size={16} />{cf.prompts.useGuide}</button></div>}
            <StoryEditor id="story-editor" value={f.story} onChange={(html) => set("story", html)} placeholder={ui.storyHelp} labels={x.editor} invalid={Boolean(errors.story)} describedBy={errors.story ? "e-story story-meter" : "story-meter"} />
            <p id="story-meter" className={`story-meter ${storyChars < 40 ? "low" : storyChars < 400 ? "mid" : "high"}`}><span className="story-meter-bar"><span style={{ width: `${Math.min(100, (storyChars / 600) * 100)}%` }} /></span><span>{storyChars < 40 ? cf.meter.short : storyChars < 400 ? cf.meter.ok : cf.meter.good} · {cf.meter.chars(storyChars)}</span></p>
            {err("story")}
          </div>
          <details className="disclose story-help" open={storyChars < 400}>
            <summary>{cf.prompts.title}</summary>
            <ol className="story-prompts">{prompts.map((q) => <li key={q}>{q}</li>)}</ol>
          </details>
          <div className="story-tips"><p className="small"><strong>{cf.prompts.tipsTitle}</strong></p><ul className="small muted">{cf.prompts.tips.map((tip) => <li key={tip}><Icon name="check" size={14} />{tip}</li>)}</ul></div>
        </section>

        <section id="s-goal" className="part" role="tabpanel" aria-labelledby="wizard-tab-goal" tabIndex={-1} hidden={activeStep !== "goal"}>
          <header><h2>{ui.goal}</h2><p className="muted">{cf.goalHint}</p></header>
          <label className="field"><span>{k.goal.label}</span>
            <span className="joined">
              <input className="input" inputMode="decimal" value={f.goal_amount} placeholder="0.00" {...inv("goal_amount")} onChange={(e) => { const v = e.target.value.replace(",", "."); if (/^\d{0,9}(\.\d{0,2})?$/.test(v)) set("goal_amount", v); }} />
              <select className="input" aria-label={d.support.currency} value={f.goal_currency} onChange={(e) => set("goal_currency", e.target.value)}><option>HTG</option><option>USD</option></select>
            </span>
          </label>
          {err("goal_amount")}
          <p className="small muted">{ui.goalEmpty}</p>
          <label className="field"><span>{ui.deadline}</span><input className="input" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} {...inv("deadline")} /><small>{cf.deadlineHint}</small>{err("deadline")}</label>
          <div className="row tight" role="group" aria-label={cf.deadlinePick}>
            {[30, 60, 90].map((n) => <button key={n} type="button" className={`chip ${f.deadline === inDays(n) ? "on" : ""}`} aria-pressed={f.deadline === inDays(n)} onClick={() => set("deadline", inDays(n))}>{cf.days(n)}</button>)}
            <button type="button" className={`chip ${!f.deadline ? "on" : ""}`} aria-pressed={!f.deadline} onClick={() => set("deadline", "")}>{cf.noEnd}</button>
          </div>
          <div className="wizard-group budget-block">
            <header><h3>{cf.budget.title}</h3><p className="small muted">{cf.budget.hint}</p></header>
            {f.budget.map((l, i) => (
              <div className="budget-line" key={i}>
                <label className="field"><span className={i ? "sr" : undefined}>{cf.budget.label}</span><input className="input" value={l.label} maxLength={80} placeholder={cf.budget.labelPh} onChange={(e) => setBudget(i, { label: e.target.value })} {...inv("budget")} /></label>
                <label className="field"><span className={i ? "sr" : undefined}>{cf.budget.amount} ({f.goal_currency})</span><input className="input" inputMode="decimal" value={l.amount} placeholder="0" onChange={(e) => { const v = e.target.value.replace(",", "."); if (/^\d{0,9}(\.\d{0,2})?$/.test(v)) setBudget(i, { amount: v }); }} {...inv("budget")} /></label>
                <button type="button" className="btn small quiet" aria-label={`${cf.budget.remove} ${i + 1}`} onClick={() => setBudget(i, null)}><Icon name="close" size={18} /></button>
              </div>
            ))}
            {err("budget")}
            {f.budget.length < 6 && <div><button type="button" className="btn small soft" onClick={() => setF((p) => ({ ...p, budget: [...p.budget, { label: "", amount: "" }] }))}><Icon name="plus" size={16} />{cf.budget.add}</button></div>}
            {budgetTotal > 0 && (
              <div className="budget-total">
                <p><span>{cf.budget.total}</span><strong>{fmtMoney(budgetTotal, f.goal_currency, locale)}</strong></p>
                {Number(f.goal_amount) !== budgetTotal && <>
                  {Number(f.goal_amount) > 0 && <p className="small muted">{cf.budget.mismatch(fmtMoney(Number(f.goal_amount), f.goal_currency, locale), fmtMoney(budgetTotal, f.goal_currency, locale))}</p>}
                  <div><button type="button" className="btn small" onClick={() => set("goal_amount", String(budgetTotal))}>{cf.budget.useAsGoal}</button></div>
                </>}
              </div>
            )}
          </div>
        </section>

        <section id="s-media" className="part wizard-panel" role="tabpanel" aria-labelledby="wizard-tab-media" tabIndex={-1} hidden={activeStep !== "media"}>
          <header><h2>{ui.photoTitle}</h2><p className="muted">{ui.photoHelp}</p></header>
          <input ref={photoPicker} type="file" accept="image/*" multiple hidden disabled={navigationLocked} onChange={(e) => { const files = e.target.files; void addPhotos(files); e.target.value = ""; }} />
          <div className="photo-grid">
            {photos.map((p, i) => (
              <div className="photo-tile" key={p}>
                <div className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(p)} alt={`${ui.photos} ${i + 1}`} /></div>
                {f.cover_path === p && <span className="photo-cover-label">{ui.cover}</span>}
                <button type="button" className="photo-options-btn" aria-label={`${ui.photoMenu} ${i + 1}`} aria-expanded={photoMenu === p} disabled={navigationLocked} onClick={() => setPhotoMenu(photoMenu === p ? null : p)} onKeyDown={(e) => { if(e.key === "Escape") setPhotoMenu(null); }}><Icon name="more" size={20}/></button>
                {photoMenu === p && <div className="photo-options-menu">
                  {f.cover_path !== p && !/^(pexels|demo):/.test(p) && <button type="button" disabled={navigationLocked} onClick={() => makeCover(p)}>{ui.makeCover}</button>}
                  <button type="button" disabled={navigationLocked} onClick={() => deletePhoto(p)}>{ui.delete}</button>
                </div>}
              </div>
            ))}
            {photos.length < 10 && <button type="button" className="upload-zone photo-add" data-cover-replace aria-busy={busy === "photos"} disabled={navigationLocked} {...inv("cover_path")} onClick={() => photoPicker.current?.click()}><Icon name={busy === "photos" ? "spinner" : "plus"} size={24}/><span>{busy === "photos" ? ui.uploading : c.addPhoto}</span>{busy === "photos" && <small>{photoProgress.done}/{photoProgress.total}</small>}</button>}
          </div>
          <p className="xs muted">{photos.length}/10</p>
          {illustrativeCover && <p className="small muted">{k.cover.demoReplace}</p>}
          {err("cover_path")}
          <label className="field"><span>{cf.video.label}</span>
            <input className="input" type="url" inputMode="url" placeholder="https://" maxLength={300} value={f.video_url} onChange={(e) => set("video_url", e.target.value)} {...inv("video_url")} />
            <small>{cf.video.hint}</small>{err("video_url")}
          </label>
        </section>

        <section id="s-receive" className="part" role="tabpanel" aria-labelledby="wizard-tab-receive" tabIndex={-1} hidden={activeStep !== "receive"}>
          <header><h2>{k.receive.label}</h2></header>
          {err("methods")}
          <label className="field"><span>{ui.addMethod}</span><select className="input" value={methodToAdd} onChange={(e) => { const id=e.target.value; if(id) setMethod(id, {details:formatPayment(id,{},locale)}); setMethodToAdd(""); }} disabled={Object.keys(f.methods).length >= 12 || navigationLocked}><option value="">{ui.chooseMethod}</option>{groups.map(([group,label]) => <optgroup key={group} label={label}>{METHODS.filter(m => m.group === group && !f.methods[m.id]).map(m => <option key={m.id} value={m.id}>{m.name || d.support.other}</option>)}</optgroup>)}</select></label>
          <div className="method-groups">
            {Object.keys(f.methods).length > 0 && <p className="notice warn small"><Icon name="alert" size={16} />{cf.pay.doubleCheck}</p>}
            {Object.keys(f.methods).length > 0 && <p className="small muted">{({en:"Public payment details",fr:"Coordonnées de paiement publiques",ht:"Enfòmasyon peman piblik",es:"Datos de pago públicos"})[locale]}</p>}
            {groups.filter(([group]) => METHODS.some(m => m.group === group && f.methods[m.id])).map(([group, label, hint]) => (
              <fieldset key={group} className="field method-pick"><legend>{label}</legend>
                {METHODS.filter((m) => m.group === group && f.methods[m.id]).map((m) => {
                  const v = f.methods[m.id], on = Boolean(v), name = m.name || d.support.other, values = parsePayment(m.id,v.details);
                  return (
                    <div key={m.id} className={`opt-row ${on ? "on" : ""}`}>
                      <div className="row" style={{justifyContent:"space-between"}}><span>{name}</span><button type="button" className="btn small quiet" aria-label={ui.removeMethod + " " + name} onClick={() => setMethod(m.id, null)}><Icon name="close" size={18}/></button></div>
                      {on && (
                        <>
                          {values ? <div className="stack tight">{values.phone?.trim() && !errors[`m.${m.id}`] && <p className="pay-confirm small"><span className="muted">{cf.pay.sendsTo}</span> <strong>{values.holder?.trim() || "—"} · {formatWalletNumber(values.phone)}</strong></p>}{paymentFields(m.id).map(key => <label key={key} className="field"><span>{paymentLabel(key,locale)}{key==="handle" ? opt : null}</span><input className="input" inputMode={key==="phone"?"tel":undefined} maxLength={key==="instructions"?240:100} value={values[key]??""} onChange={e=>setMethod(m.id,{details:formatPayment(m.id,{...values,[key]:e.target.value},locale)})} {...(fieldBad(m.id, key, values[key] ?? "", v) ? { "aria-invalid": true, "aria-describedby": `e-m.${m.id}` } : {})} /></label>)}{err(`m.${m.id}`)}</div> : <label className="field"><span>{ui.details}</span><textarea className="input" rows={3} maxLength={600} placeholder={hint} value={v.details} onChange={(e) => setMethod(m.id, { details: e.target.value })} {...inv(`m.${m.id}`)} />{err(`m.${m.id}`)}</label>}
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

        <section id="s-verification" className="part" role="tabpanel" aria-labelledby="wizard-tab-verification" tabIndex={-1} hidden={activeStep !== "verification"} aria-busy={[...verificationKeys, "id_back_path"].includes(busy ?? "")}>
          <header><h2 id="verification-title">{verification.title}</h2><p className="muted">{verification.intro}</p></header>
          <section className="why-id" aria-labelledby="why-id-title">
            <h3 id="why-id-title"><Icon name="lock" size={18} />{cf.why.title}</h3>
            <dl>{cf.why.points.map(([term, body]) => <div key={term}><dt>{term}</dt><dd>{body}</dd></div>)}</dl>
          </section>
          <h3>{ui.contact}</h3>
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
          <label className="field"><span>{ui.phone}</span><input className="input" type="tel" inputMode="tel" autoComplete="tel" value={splitContact(f.priv.contact_details).phone} maxLength={60} onChange={(e)=>setPriv("contact_details",formatContact(e.target.value,splitContact(f.priv.contact_details).notes))} {...inv("contact_details")}/>{err("contact_details")}</label>
          <label className="field"><span>{ui.contactExtra}</span><textarea className="input" rows={2} maxLength={500} value={splitContact(f.priv.contact_details).notes} onChange={(e)=>setPriv("contact_details",formatContact(splitContact(f.priv.contact_details).phone,e.target.value))}/></label>
          <div className="stack">
            <h3>{ui.identity}</h3>
            <p className="muted" id="identity-hint">{verification.identityHint}</p>
            <small id="identity-format">{verification.format}</small>
            <div className="cols-2">
              {identityInput("id_front_path", c.idFront)}
              {identityInput("selfie_path", c.selfie)}
            </div>
            {identityInput("id_back_path", c.idBack, true)}
          </div>
          <details className="disclose more-proof" open={Boolean(f.priv.reference_name || f.priv.reference_contact || f.priv.documents.length || (beneficiaryType && beneficiaryType !== "self"))}>
            <summary>{ui.moreProof}</summary>
            <div className="stack">
            <p className="small muted">{ui.moreProofHint}</p>
          <div className="cols-2">
            <label className="field"><span>{c.referenceName}</span><input className="input" value={f.priv.reference_name} maxLength={120} onChange={(e) => setPriv("reference_name", e.target.value)} /></label>
            <label className="field"><span>{c.referenceContact}</span><input className="input" value={f.priv.reference_contact} maxLength={200} onChange={(e) => setPriv("reference_contact", e.target.value)} /></label>
          </div>
          {beneficiaryType && beneficiaryType !== "self" && <p className="muted">{navCopy.authorization}</p>}
          <div className="field"><span>{k.media.documents}</span>
            <small>{k.media.documentsHint}</small>
            <small>{verification.recipientEvidence}</small>
            {f.priv.documents.map((path, i) => <div className="row" key={path}><Icon name="done" size={16}/><span>{k.media.documents} {i + 1} · {c.uploaded}</span><button type="button" className="btn small quiet" onClick={() => setPriv("documents", f.priv.documents.filter(p => p !== path))}>{d.common.remove}</button></div>)}
            {f.priv.documents.length < 8 && (
              <label className="upload-zone small"><input type="file" accept="image/*,application/pdf" disabled={busy !== null} onChange={(e) => { addDocument(e.target.files?.[0]); e.target.value = ""; }} />
                <Icon name={busy === "documents" ? "spinner" : "file"} size={22} className={busy === "documents" ? "icon spin" : "icon"} /><span>{busy === "documents" ? c.uploading : c.addDocument}</span></label>
            )}
          </div>
            </div>
          </details>
          <label className="check"><input type="checkbox" checked={verificationConsent} required aria-required="true" onChange={(e) => { setVerificationConsent(e.target.checked); setErrors((old) => { const next = { ...old }; delete next.verificationConsent; return next; }); }} {...inv("verificationConsent")} /><span>{verification.consent}</span></label>
          {err("verificationConsent")}
          {draftKey && <p className="small muted"><Icon name="lock" size={15} />{verification.privateDraft}</p>}
        </section>

        <section id="s-submit" className="part submit-part" role="tabpanel" aria-labelledby="wizard-tab-submit" tabIndex={-1} hidden={activeStep !== "submit"}>
          <header><h2>{ui.reviewTitle}</h2><p className="muted">{live ? k.submit.changesHint : k.submit.hint}</p></header>
          <div className="wizard-review-preview stack tight"><p className="eyebrow">{k.side.preview}</p>{f.cover_path ? card : <button type="button" className="cover-missing" onClick={() => jump("media", "panel")}><Icon name="image" size={24} /><span>{ui.addCover}</span></button>}
            <div><button type="button" className="btn" onClick={openPreview}><Icon name="eye" size={18} />{cf.preview.open}</button></div>
          </div>
          <div className="wizard-review-sections">
            {items.slice(0, -1).map(([id, label]) => (
              <div className="wizard-review-row" key={id}>
                <div><span>{label}</span><small className="muted">{summaries[id] || ui.complete}</small>{Object.keys(missing).some((key) => sectionOf(key) === id) && <small className="field-error">{c.missing}</small>}</div>
                <button type="button" className="btn small quiet" disabled={navigationLocked} onClick={() => jump(id, "panel")}>{navCopy.edit}</button>
              </div>
            ))}
          </div>
          {!live && (
            <fieldset className="field stack" style={{ gap: 12 }}>
              <legend className="sr">{k.items.consent}</legend>
              {[c.consentTruth, c.consentTerms, c.consentOff].map((label, i) => (
                <label key={label} className="check"><input type="checkbox" checked={consent[i]} onChange={(e) => { setConsent((p) => p.map((v, j) => (j === i ? e.target.checked : v))); setErrors((er) => { const n = { ...er }; delete n.consent; return n; }); }} /><span>{label}</span></label>
              ))}
              {needsBeneficiaryConsent && <label className="check"><input type="checkbox" checked={beneficiaryConsent} onChange={(e) => { setBeneficiaryConsent(e.target.checked); setErrors((er) => { const n = { ...er }; delete n.consent; return n; }); }} /><span>{beneficiaryType === "org" ? cf.consentOrg(f.beneficiary_name.trim()) : cf.consentOther(f.beneficiary_name.trim())}</span></label>}
              {err("consent")}
            </fieldset>
          )}
          <ul className="next-list">
            <li><Icon name="clock" size={18} /><span>{k.submit.eta}</span></li>
            <li><Icon name="mail" size={18} /><span>{k.submit.reach(mail)}</span></li>
            {!live && <li><Icon name="group" size={18} /><span>{cf.coOrg}</span></li>}
          </ul>
          {Object.keys(missing).length > 0 && (
            <div className="notice err"><Icon name="alert" size={18} /><span><strong>{c.missing}</strong>
              <span className="row tight" style={{ marginTop: 8 }}>{items.filter(([id]) => Object.keys(missing).some((key) => sectionOf(key) === id)).map(([id, label]) => <button key={id} type="button" className="chip" disabled={navigationLocked} onClick={() => { setErrors(missing); jump(id); }}>{label}</button>)}</span></span></div>
          )}
        </section>
        <div className="wizard-footer">
          <div className="wizard-actions">
            <button type="button" className="btn" disabled={stepIndex === 0 || navigationLocked}
              onClick={() => jump(items[stepIndex - 1][0], "panel")}><Icon name="left" size={16} />{navCopy.previous}</button>
            <div className="wizard-action-end">
              {lastStep ? (
                <button className="btn primary" type="submit" name="intent" value="submit" disabled={navigationLocked} aria-busy={pending}>{pending ? <><Icon name="spinner" size={18} />{d.common.loading}</> : live ? x.submitChanges : k.submit.label}</button>
              ) : (
                <button className="btn primary" type="button" disabled={navigationLocked} onClick={nextStep}>{navCopy.next}<Icon name="arrow" size={16} /></button>
              )}
            </div>
          </div>
          <div className="wizard-save">{!autosave && draftBtn("small quiet")}<div className="stack tight">{saveState}</div></div>
        </div>
      </div>
      <dialog ref={previewDialog} className="modal preview-modal" aria-labelledby="preview-title" onClose={() => setPreviewOpen(false)} onClick={(e) => { if (e.target === e.currentTarget) closePreview(); }}>
        {previewOpen && <div className="stack">
          <div className="preview-head"><div><p className="eyebrow" id="preview-title">{cf.preview.title}</p><p className="small muted">{cf.preview.note}</p></div><button type="button" className="btn small quiet" aria-label={cf.preview.close} onClick={closePreview}><Icon name="close" size={20} /></button></div>
          {f.cover_path ? <div className="frame preview-cover">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src(f.cover_path)} alt="" /></div> : <div className="frame empty preview-cover"><Icon name="image" size={40} /></div>}
          <div className="stack tight">
            <p className="small muted">{[catName, where].filter(Boolean).join(" · ")}</p>
            <h2>{f.title.trim() || k.title.ph}</h2>
            <p className="small">{cf.preview.organizer} <strong>{f.priv.contact_name.trim() || "—"}</strong>{f.beneficiary_name.trim() && beneficiaryType !== "self" ? <> · {d.x.dash.fields.beneficiary_name}: <strong>{f.beneficiary_name.trim()}</strong></> : null}</p>
            {amount && <p className="preview-goal">{amount}</p>}
          </div>
          {f.video_url.trim() && LINK.test(f.video_url.trim()) && <p><a className="btn small" href={f.video_url.trim()} target="_blank" rel="noopener noreferrer nofollow"><Icon name="external" size={16} />{cf.preview.video}</a></p>}
          {storyChars ? <div className="story" dangerouslySetInnerHTML={{ __html: previewHtml(f.story) }} /> : <p className="muted">{cf.preview.noStory}</p>}
          {budgetTotal > 0 && <section className="stack tight"><h3>{cf.preview.budget}</h3><ul className="budget-list">{budgetLines.filter((l) => Number(l.amount) > 0).map((l, i) => <li key={i}><span>{l.label}</span><strong>{fmtMoney(Number(l.amount), f.goal_currency, locale)}</strong></li>)}</ul></section>}
          <section className="stack tight"><h3>{cf.preview.support}</h3>
            {methods.length ? <ul className="preview-methods">{methods.map((m) => <li key={m.method}><strong>{METHODS.find((v) => v.id === m.method)?.name || d.support.other}</strong>{(() => { const rows = paymentRows(m.method, m.details, locale); return rows ? <dl className="method-rows">{rows.map(([l, v]) => <div key={l}><dt>{l}</dt><dd>{v}</dd></div>)}</dl> : <span className="small" style={{ whiteSpace: "pre-line" }}>{m.details}</span>; })()}{m.link && <span className="small muted">{m.link}</span>}</li>)}</ul> : <p className="muted">{cf.preview.noMethods}</p>}
          </section>
          <div><button type="button" className="btn primary" onClick={closePreview}>{cf.preview.close}</button></div>
        </div>}
      </dialog>
    </form>
  );
}
