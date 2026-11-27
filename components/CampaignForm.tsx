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
import { verificationCopy } from "@/lib/dict/verification";
import type { Category } from "@/lib/types";
import { countryOptions, isCountry } from "@/lib/countries";
import { formatPayment, parsePayment, paymentFields, paymentLabel, paymentValid, splitContact, formatContact } from "@/lib/payment-fields";
export type { FormState };

const LINK = /^https:\/\/[^\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const time = (locale: Locale) => new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date());

/** One visible section at a time, with shared draft state and final submission validation. */
export default function CampaignForm({ locale, cats, initial, draftKey, live, email, reviewNote, countryList }: { locale: Locale; cats: Category[]; initial: FormState; draftKey: string | null; live: boolean; email?: string; reviewNote?: string | null; countryList?: { code: string; name: string }[] }) {
  const d = t(locale), c = d.create, x = d.x.form, k = x.compose, verification = verificationCopy[locale];
  const [f, setF] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [navigation, setNavigation] = useState<{ section: string; target: "tab" | "panel" | "error" } | null>(null);
  const activeStep = navigation?.section ?? "basics";
  const navCopy = {
    en: { previous: "Previous", next: "Next", basics: "About", story: "Story", goal: "Goal", media: "Media", support: "Donations", review: "Review", who: "Who are you fundraising for?", self: "Myself", other: "Someone else", org: "An organization", selfHint: "For my own needs.", otherHint: "For another person, family or community.", orgHint: "For an organization or community group.", orgName: "Organization name", selfName: "Your name", authorization: "Include supporting evidence that you have permission to fundraise for the recipient or organization.", diaspora: "City, state or region, and country", noGoal: "I don't have a specific goal", edit: "Edit" },
    fr: { previous: "Précédent", next: "Suivant", basics: "À propos", story: "Histoire", goal: "Objectif", media: "Médias", support: "Dons", review: "Vérifier", who: "Pour qui organisez-vous cette collecte ?", self: "Moi-même", other: "Une autre personne", org: "Une organisation", selfHint: "Pour mes propres besoins.", otherHint: "Pour une personne, une famille ou une communauté.", orgHint: "Pour une organisation ou un groupe communautaire.", orgName: "Nom de l'organisation", selfName: "Votre nom", authorization: "Ajoutez des justificatifs de votre autorisation à collecter pour le bénéficiaire ou l’organisation.", diaspora: "Ville, région et pays", noGoal: "Je n'ai pas d'objectif précis", edit: "Modifier" },
    ht: { previous: "Anvan", next: "Apre", basics: "Konsènan", story: "Istwa", goal: "Objektif", media: "Medya", support: "Don", review: "Revize", who: "Pou kiyès w ap ranmase sipò?", self: "Pou tèt mwen", other: "Yon lòt moun", org: "Yon òganizasyon", selfHint: "Pou pwòp bezwen mwen.", otherHint: "Pou yon lòt moun, yon fanmi oswa yon kominote.", orgHint: "Pou yon òganizasyon oswa yon gwoup kominotè.", orgName: "Non òganizasyon an", selfName: "Non w", authorization: "Ajoute dokiman ki montre ou gen pèmisyon pou ranmase sipò pou moun nan oswa òganizasyon an.", diaspora: "Vil, rejyon ak peyi", noGoal: "Mwen pa gen yon objektif presi", edit: "Modifye" },
    es: { previous: "Anterior", next: "Siguiente", basics: "Acerca de", story: "Historia", goal: "Meta", media: "Multimedia", support: "Donaciones", review: "Revisar", who: "¿Para quién recaudas fondos?", self: "Para mí", other: "Para otra persona", org: "Una organización", selfHint: "Para mis propias necesidades.", otherHint: "Para otra persona, familia o comunidad.", orgHint: "Para una organización o un grupo comunitario.", orgName: "Nombre de la organización", selfName: "Tu nombre", authorization: "Adjunta documentación que acredite tu autorización para recaudar fondos para el destinatario o la organización.", diaspora: "Ciudad, región y país", noGoal: "No tengo una meta específica", edit: "Editar" },
  }[locale];
  const ui = {"en":{"country":"Country","location":"Where is the beneficiary located?","city":"City, state or region","role":"Your role in the organization","story":"Tell your story","title":"Fundraiser title","desc":"Description","storyHelp":"Explain why you are fundraising and how donations will help.","goal":"How much would you like to raise?","deadline":"End date","photos":"Photos","photoTitle":"Add photos to your fundraiser","photoHelp":"Upload up to 10 photos. Choose one as your cover.","cover":"Cover","makeCover":"Make cover","delete":"Delete","photoMenu":"Photo options","uploading":"Uploading photos","photoError":"Some photos could not be uploaded. Try again.","requiredCountry":"Choose a country.","requiredLocation":"Enter the city, state or region.","requiredRole":"Enter your role.","invalidDate":"Choose a valid end date.","invalidGoal":"Enter a positive amount.","contact":"Contact information","identity":"Identity documents","evidence":"Supporting evidence","phone":"Phone or WhatsApp","contactExtra":"Additional contact or recipient details","privacy":"Share only the payment information supporters need. It will appear on your fundraiser.","reviewTitle":"Review your fundraiser","complete":"Complete","noGoal":"No fixed goal","summaryPhotos":"photos","summaryMethods":"receiving methods","summaryDocs":"private documents provided","details":"Payment details","addMethod":"Add method","removeMethod":"Remove method","chooseMethod":"Choose a payment method"},"fr":{"country":"Pays","location":"Où se trouve le bénéficiaire ?","city":"Ville, État ou région","role":"Votre rôle dans l’organisation","story":"Racontez votre histoire","title":"Titre de la collecte","desc":"Description","storyHelp":"Expliquez pourquoi vous collectez des fonds et comment les dons aideront.","goal":"Combien souhaitez-vous collecter ?","deadline":"Date de fin","photos":"Photos","photoTitle":"Ajoutez des photos à votre collecte","photoHelp":"Ajoutez jusqu’à 10 photos. Choisissez une photo de couverture.","cover":"Couverture","makeCover":"Définir comme couverture","delete":"Supprimer","photoMenu":"Options de la photo","uploading":"Envoi des photos","photoError":"Certaines photos n’ont pas pu être envoyées. Réessayez.","requiredCountry":"Choisissez un pays.","requiredLocation":"Indiquez la ville, l’État ou la région.","requiredRole":"Indiquez votre rôle.","invalidDate":"Choisissez une date valide.","invalidGoal":"Saisissez un montant positif.","contact":"Coordonnées","identity":"Pièces d’identité","evidence":"Justificatifs","phone":"Téléphone ou WhatsApp","contactExtra":"Autres coordonnées ou précisions sur le destinataire","privacy":"Partagez uniquement les coordonnées de paiement nécessaires. Elles apparaîtront sur votre collecte.","reviewTitle":"Vérifiez votre collecte","complete":"Terminé","noGoal":"Sans objectif fixe","summaryPhotos":"photos","summaryMethods":"moyens de réception","summaryDocs":"documents privés fournis","details":"Coordonnées de paiement","addMethod":"Ajouter un moyen","removeMethod":"Retirer le moyen","chooseMethod":"Choisir un moyen de paiement"},"ht":{"country":"Peyi","location":"Ki kote benefisyè a ye?","city":"Vil, eta oswa rejyon","role":"Wòl ou nan òganizasyon an","story":"Rakonte istwa w","title":"Tit ranmasaj la","desc":"Deskripsyon","storyHelp":"Esplike poukisa w ap ranmase sipò ak kijan don yo pral ede.","goal":"Konbyen ou ta renmen ranmase?","deadline":"Dat fen","photos":"Foto","photoTitle":"Ajoute foto nan ranmasaj ou a","photoHelp":"Ajoute jiska 10 foto. Chwazi youn kòm foto kouvèti.","cover":"Kouvèti","makeCover":"Mete kòm kouvèti","delete":"Efase","photoMenu":"Opsyon foto","uploading":"N ap voye foto yo","photoError":"Gen foto ki pa t voye. Eseye ankò.","requiredCountry":"Chwazi yon peyi.","requiredLocation":"Antre vil, eta oswa rejyon an.","requiredRole":"Antre wòl ou.","invalidDate":"Chwazi yon dat ki valab.","invalidGoal":"Antre yon montan ki pozitif.","contact":"Enfòmasyon kontak","identity":"Pyès idantite","evidence":"Dokiman prèv","phone":"Telefòn oswa WhatsApp","contactExtra":"Lòt detay kontak oswa sou moun k ap resevwa a","privacy":"Pataje sèlman enfòmasyon peman moun bezwen. Yo pral parèt sou ranmasaj ou a.","reviewTitle":"Revize ranmasaj ou a","complete":"Konplè","noGoal":"Pa gen objektif fiks","summaryPhotos":"foto","summaryMethods":"fason pou resevwa","summaryDocs":"dokiman prive bay","details":"Detay peman","addMethod":"Ajoute yon fason","removeMethod":"Retire fason an","chooseMethod":"Chwazi yon fason pou resevwa"},"es":{"country":"País","location":"¿Dónde se encuentra el beneficiario?","city":"Ciudad, estado o región","role":"Tu función en la organización","story":"Cuenta tu historia","title":"Título de la recaudación","desc":"Descripción","storyHelp":"Explica por qué recaudas fondos y cómo ayudarán las donaciones.","goal":"¿Cuánto te gustaría recaudar?","deadline":"Fecha de finalización","photos":"Fotos","photoTitle":"Añade fotos a tu recaudación","photoHelp":"Sube hasta 10 fotos. Elige una como portada.","cover":"Portada","makeCover":"Establecer como portada","delete":"Eliminar","photoMenu":"Opciones de foto","uploading":"Subiendo fotos","photoError":"No se pudieron subir algunas fotos. Inténtalo de nuevo.","requiredCountry":"Selecciona un país.","requiredLocation":"Introduce la ciudad, estado o región.","requiredRole":"Introduce tu función.","invalidDate":"Selecciona una fecha válida.","invalidGoal":"Introduce un importe positivo.","contact":"Información de contacto","identity":"Documentos de identidad","evidence":"Documentos justificativos","phone":"Teléfono o WhatsApp","contactExtra":"Otros datos de contacto o del destinatario","privacy":"Comparte solo los datos necesarios para recibir pagos. Aparecerán en tu recaudación.","reviewTitle":"Revisa tu recaudación","complete":"Completo","noGoal":"Sin meta fija","summaryPhotos":"fotos","summaryMethods":"métodos de recepción","summaryDocs":"documentos privados aportados","details":"Datos de pago","addMethod":"Añadir método","removeMethod":"Quitar método","chooseMethod":"Elegir método de pago"}}[locale];
  // Country names come from the server when given, so server and browser render the same list (their Intl data can differ).
  const countries = useMemo(() => countryList ?? countryOptions(locale), [countryList, locale]);
  const beneficiaryType = f.beneficiary_relation === "self" ? "self" : f.beneficiary_relation === "organization" ? "org" : f.beneficiary_relation ? "other" : "";
  const [noGoal, setNoGoal] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [upErr, setUpErr] = useState<string | null>(null);
  const [deviceAt, setDeviceAt] = useState<string | null>(null);
  const [consent, setConsent] = useState([false, false, false]);
  const [verificationConsent, setVerificationConsent] = useState(false);
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
  const consentOk = (live || consent.every(Boolean)) && verificationConsent;

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
      if (!paymentValid(id, v.details, v.link)) e[`m.${id}`] = x.err.details;
      if (v.link.trim() && !LINK.test(v.link.trim())) e[`l.${id}`] = x.err.link;
    }
    if (!live && !consent.every(Boolean)) e.consent = x.err.consent;
    if (!verificationConsent) e.verificationConsent = verification.consentError;
    return e;
  }
  const missing = useMemo(check, // eslint-disable-next-line react-hooks/exhaustive-deps
    [f, consent, methods, verificationConsent, live]);
  const verificationKeys = ["contact_name", "contact_email", "contact_details", "id_front_path", "selfie_path", "verificationConsent"];
  const sectionOf = (key: string) => verificationKeys.includes(key) ? "verification" : key.startsWith("beneficiary_") || ["cause", "department", "country_code", "commune", "organization_role"].includes(key) ? "basics" : key === "title" || key === "story" ? "story" : key === "goal_amount" || key === "deadline" ? "goal" : key === "cover_path" ? "media" : key === "consent" ? "submit" : "receive";
  const items: [string, string][] = [
    ["basics", navCopy.basics], ["story", navCopy.story], ["goal", navCopy.goal],
    ["media", ui.photos], ["receive", navCopy.support],
    ["verification", c.s5], ["submit", navCopy.review],
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
  const where = campaignPlace(f, locale);
  const amount = Number(f.goal_amount) > 0 ? fmtMoney(Number(f.goal_amount), f.goal_currency, locale) : null;
  const summaries: Record<string,string> = { basics: [beneficiaryType ? navCopy[beneficiaryType] : "", f.beneficiary_name, catName, where].filter(Boolean).join(" · "), story: f.title, goal: [amount ?? ui.noGoal, f.deadline].filter(Boolean).join(" · "), media: `${photos.length} ${ui.summaryPhotos}`, receive: `${methods.length} ${ui.summaryMethods}`, verification: `${[f.priv.id_front_path, f.priv.id_back_path, f.priv.selfie_path, ...f.priv.documents].filter(Boolean).length} ${ui.summaryDocs}` };
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
          <header><h2>{k.category.label}</h2><p className="muted">{k.category.hint}</p></header>
          <fieldset className="field" {...(errors.cause ? { "aria-describedby": "e-cause" } : {})}>
            <legend className="sr">{k.category.label}</legend>
            <div className="choice-row">
              {cats.map((cat) => <label key={cat.slug} className="choice"><input type="radio" name="cause" checked={f.cause === cat.slug} onChange={() => set("cause", cat.slug)} /><span>{cat[`name_${locale}`]}</span></label>)}
            </div>
            {err("cause")}
          </fieldset>
          </div>
          <div className="wizard-group">
          <header><h2>{ui.location}</h2></header>
          <label className="field"><span>{ui.country}</span>
            <select className="input" value={f.country_code} {...inv("country_code")} onChange={(e) => { const code = e.target.value; setF(p => ({ ...p, country_code: code, department: code && code !== "HT" ? "Diaspora" : "", commune: !p.country_code && p.department === "Diaspora" ? p.commune : "" })); setErrors(old => { const next = {...old}; delete next.country_code; delete next.department; delete next.commune; return next; }); }}>
              <option value="">{c.choose}</option>
              {countries.map(({code, name}) => <option key={code} value={code}>{name}</option>)}
            </select>{err("country_code")}
          </label>
          {f.country_code === "HT" ? <div className="cols-2">
            <label className="field"><span>{c.department}</span><select className="input" value={f.department === "Diaspora" ? "" : f.department} onChange={(e) => set("department", e.target.value)} {...inv("department")}><option value="">{c.choose}</option>{DEPARTMENTS.filter(v => v !== "Diaspora").map(v => <option key={v}>{v}</option>)}</select>{err("department")}</label>
            <label className="field"><span>{c.commune}{opt}</span><input className="input" value={f.commune} maxLength={80} onChange={(e) => set("commune", e.target.value)} /></label>
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
            <StoryEditor id="story-editor" value={f.story} onChange={(html) => set("story", html)} placeholder={ui.storyHelp} labels={x.editor} invalid={Boolean(errors.story)} describedBy={errors.story ? "e-story" : undefined} />
            {err("story")}
          </div>
        </section>

        <section id="s-goal" className="part" role="tabpanel" aria-labelledby="wizard-tab-goal" tabIndex={-1} hidden={activeStep !== "goal"}>
          <header><h2>{ui.goal}</h2></header>
          <label className="field"><span>{k.goal.label}{opt}</span>
            <span className="joined">
              <input className="input" inputMode="decimal" value={f.goal_amount} disabled={noGoal} placeholder="0.00" {...inv("goal_amount")} onChange={(e) => { const v = e.target.value.replace(",", "."); if (/^\d{0,9}(\.\d{0,2})?$/.test(v)) set("goal_amount", v); }} />
              <select className="input" aria-label={d.support.currency} value={f.goal_currency} disabled={noGoal} onChange={(e) => set("goal_currency", e.target.value)}><option>HTG</option><option>USD</option></select>
            </span>
          </label>
          {err("goal_amount")}
          <label className="check"><input type="checkbox" checked={noGoal} onChange={(e) => { setNoGoal(e.target.checked); if (e.target.checked) set("goal_amount", ""); }} /><span>{navCopy.noGoal}</span></label>
          <label className="field"><span>{ui.deadline}{opt}</span><input className="input" type="date" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} {...inv("deadline")} />{err("deadline")}</label>
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
        </section>

        <section id="s-receive" className="part" role="tabpanel" aria-labelledby="wizard-tab-receive" tabIndex={-1} hidden={activeStep !== "receive"}>
          <header><h2>{k.receive.label}</h2></header>
          {err("methods")}
          <label className="field"><span>{ui.addMethod}</span><select className="input" value={methodToAdd} onChange={(e) => { const id=e.target.value; if(id) setMethod(id, {details:formatPayment(id,{},locale)}); setMethodToAdd(""); }} disabled={Object.keys(f.methods).length >= 12 || navigationLocked}><option value="">{ui.chooseMethod}</option>{groups.map(([group,label]) => <optgroup key={group} label={label}>{METHODS.filter(m => m.group === group && !f.methods[m.id]).map(m => <option key={m.id} value={m.id}>{m.name || d.support.other}</option>)}</optgroup>)}</select></label>
          <div className="method-groups">
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
                          {values ? <div className="stack tight">{paymentFields(m.id).map(key => <label key={key} className="field"><span>{paymentLabel(key,locale)}{key==="handle" ? opt : null}</span><input className="input" inputMode={key==="phone"?"tel":undefined} maxLength={key==="instructions"?240:100} value={values[key]??""} onChange={e=>setMethod(m.id,{details:formatPayment(m.id,{...values,[key]:e.target.value},locale)})} {...inv(`m.${m.id}`)} /></label>)}{err(`m.${m.id}`)}</div> : <label className="field"><span>{ui.details}</span><textarea className="input" rows={3} maxLength={600} placeholder={hint} value={v.details} onChange={(e) => setMethod(m.id, { details: e.target.value })} {...inv(`m.${m.id}`)} />{err(`m.${m.id}`)}</label>}
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
          <label className="field"><span>{ui.contactExtra}{opt}</span><textarea className="input" rows={3} maxLength={500} value={splitContact(f.priv.contact_details).notes} onChange={(e)=>setPriv("contact_details",formatContact(splitContact(f.priv.contact_details).phone,e.target.value))}/></label>
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
          <div className="cols-2">
            <label className="field"><span>{c.referenceName}{opt}</span><input className="input" value={f.priv.reference_name} maxLength={120} onChange={(e) => setPriv("reference_name", e.target.value)} /></label>
            <label className="field"><span>{c.referenceContact}{opt}</span><input className="input" value={f.priv.reference_contact} maxLength={200} onChange={(e) => setPriv("reference_contact", e.target.value)} /></label>
          </div>
          <h3>{ui.evidence}</h3>
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
          <label className="check"><input type="checkbox" checked={verificationConsent} required aria-required="true" onChange={(e) => { setVerificationConsent(e.target.checked); setErrors((old) => { const next = { ...old }; delete next.verificationConsent; return next; }); }} {...inv("verificationConsent")} /><span>{verification.consent}</span></label>
          {err("verificationConsent")}
          {draftKey && <p className="small muted"><Icon name="lock" size={15} />{verification.privateDraft}</p>}
        </section>

        <section id="s-submit" className="part submit-part" role="tabpanel" aria-labelledby="wizard-tab-submit" tabIndex={-1} hidden={activeStep !== "submit"}>
          <header><h2>{ui.reviewTitle}</h2><p className="muted">{live ? k.submit.changesHint : k.submit.hint}</p></header>
          <div className="wizard-review-preview stack tight"><p className="eyebrow">{k.side.preview}</p>{card}</div>
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
              {err("consent")}
            </fieldset>
          )}
          <ul className="next-list">
            <li><Icon name="clock" size={18} /><span>{k.submit.eta}</span></li>
            <li><Icon name="mail" size={18} /><span>{k.submit.reach(mail)}</span></li>
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
              {draftBtn()}
              {lastStep ? (
                <button className="btn primary" type="submit" name="intent" value="submit" disabled={navigationLocked} aria-busy={pending}>{pending ? <><Icon name="spinner" size={18} />{d.common.loading}</> : live ? x.submitChanges : k.submit.label}</button>
              ) : (
                <button className="btn primary" type="button" disabled={navigationLocked} onClick={nextStep}>{navCopy.next}<Icon name="arrow" size={16} /></button>
              )}
            </div>
          </div>
          <div className="stack tight">{saveState}</div>
        </div>
      </div>
    </form>
  );
}
