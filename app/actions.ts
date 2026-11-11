"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/lib/supabase/server";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { safeNext } from "@/lib/auth";
import { drainOutbox } from "@/lib/email";
import { slugify } from "@/lib/format";
import { METHOD_IDS, REASONS, RELATIONS, VOUCH_ROLES, DEPARTMENTS, SITE_URL } from "@/lib/constants";
import type { ActionResult } from "@/lib/types";

const L = (f: FormData): Locale => {
  const v = String(f.get("locale") ?? "");
  return isLocale(v) ? v : "ht";
};
const s = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const fail = (message: string): ActionResult => ({ ok: false, message });
const done = (message: string): ActionResult => ({ ok: true, message });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function ctx(f: FormData) {
  const locale = L(f), d = t(locale), sb = await db();
  const user = sb ? (await sb.auth.getUser()).data.user : null;
  return { locale, d, sb, user };
}
async function origin() {
  const h = await headers();
  const o = h.get("origin");
  if (o && /^https?:\/\//.test(o)) return o;
  return SITE_URL;
}

/* ---------- Accounts ---------- */
export async function signIn(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb } = await ctx(f);
  if (!sb) return fail(d.auth.notConfigured);
  const email = s(f, "email", 254).toLowerCase(), password = String(f.get("password") ?? "");
  if (!EMAIL.test(email) || !password) return fail(d.auth.invalid);
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return fail(error.status === 429 ? d.auth.rate : d.auth.invalid);
  redirect(safeNext(s(f, "next", 300), `/${locale}/dashboard`));
}
export async function signUp(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb } = await ctx(f);
  if (!sb) return fail(d.auth.notConfigured);
  const email = s(f, "email", 254).toLowerCase(), password = String(f.get("password") ?? ""), name = s(f, "name", 80);
  if (!EMAIL.test(email) || !name) return fail(d.common.required);
  if (password.length < 8) return fail(d.auth.weak);
  const next = safeNext(s(f, "next", 300), `/${locale}/dashboard`);
  const { data, error } = await sb.auth.signUp({
    email, password,
    options: { data: { display_name: name, locale }, emailRedirectTo: `${await origin()}/${locale}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error) return fail(error.status === 429 ? d.auth.rate : /registered|exists/i.test(error.message) ? d.auth.exists : /password/i.test(error.message) ? d.auth.weak : d.common.error);
  if (data.user && data.user.identities && data.user.identities.length === 0) return fail(d.auth.exists);
  if (data.session) redirect(next);
  return done(d.auth.confirmSent);
}
export async function magicLink(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb } = await ctx(f);
  if (!sb) return fail(d.auth.notConfigured);
  const email = s(f, "email", 254).toLowerCase();
  if (!EMAIL.test(email)) return fail(d.common.required);
  const next = safeNext(s(f, "next", 300), `/${locale}/dashboard`);
  const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${await origin()}/${locale}/auth/callback?next=${encodeURIComponent(next)}` } });
  if (error?.status === 429) return fail(d.auth.rate);
  return done(d.auth.magicSent);
}
export async function signOut(f: FormData) {
  const { locale, sb } = await ctx(f);
  await sb?.auth.signOut();
  redirect(`/${locale}`);
}
export async function changePassword(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const password = String(f.get("password") ?? "");
  if (password.length < 8) return fail(d.auth.weak);
  const { error } = await sb.auth.updateUser({ password });
  return error ? fail(d.common.error) : done(d.dash.passwordChanged);
}
export async function saveProfile(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const display_name = s(f, "display_name", 80);
  if (!display_name) return fail(d.common.required);
  const kind = s(f, "kind") === "organization" ? "organization" : "individual";
  const department = s(f, "department", 40), avatar = s(f, "avatar_path", 200), emailLocale = s(f, "email_locale");
  const patch: Record<string, unknown> = {
    display_name, bio: s(f, "bio", 600), city: s(f, "city", 80) || null,
    department: (DEPARTMENTS as readonly string[]).includes(department) ? department : null,
    kind, org_name: kind === "organization" ? s(f, "org_name", 120) || null : null, org_type: kind === "organization" ? s(f, "org_type", 60) || null : null,
    email_notifications: f.get("email_notifications") === "on", locale: isLocale(emailLocale) ? emailLocale : locale,
  };
  if (avatar && avatar.startsWith(`${user.id}/`)) patch.avatar_path = avatar;
  const { error } = await sb.from("profiles").update(patch).eq("id", user.id);
  if (error) return fail(d.common.error);
  revalidatePath(`/${locale}/dashboard`);
  return done(d.common.saved);
}

/* ---------- Campaigns ---------- */
type Payload = {
  id?: string; title?: string; story?: string; cause?: string; department?: string; commune?: string; beneficiary_name?: string; beneficiary_relation?: string;
  goal_amount?: string | number | null; goal_currency?: string; deadline?: string; urgent?: boolean; cover_path?: string | null; gallery?: string[];
  video_url?: string; voice_path?: string | null; language?: string; methods?: { method: string; details: string }[];
  priv?: { contact_name?: string; contact_email?: string; contact_details?: string; id_front_path?: string | null; id_back_path?: string | null; selfie_path?: string | null; reference_name?: string; reference_contact?: string; documents?: string[] };
  consent?: boolean;
};
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export async function saveCampaign(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  let p: Payload;
  try {
    p = JSON.parse(String(f.get("payload") ?? "{}"));
  } catch {
    return fail(d.common.error);
  }
  const submit = f.get("intent") === "submit";
  const own = (v: unknown) => (typeof v === "string" && new RegExp(`^${user.id}/[a-z0-9-]{8,60}\\.(webp|jpg|jpeg|png|webm|m4a|mp4|ogg|mp3|pdf)$`).test(v) ? v : null);
  const title = str(p.title, 120), story = str(p.story, 8000);
  const goal = Number(p.goal_amount);
  const video = str(p.video_url, 300);
  const row = {
    title, story,
    cause: str(p.cause, 40) || null,
    department: (DEPARTMENTS as readonly string[]).includes(str(p.department, 40)) ? str(p.department, 40) : null,
    commune: str(p.commune, 80) || null,
    beneficiary_name: str(p.beneficiary_name, 120) || null,
    beneficiary_relation: (RELATIONS as readonly string[]).includes(str(p.beneficiary_relation, 40)) ? str(p.beneficiary_relation, 40) : null,
    goal_amount: Number.isFinite(goal) && goal > 0 ? Math.min(Math.round(goal), 999999999) : null,
    goal_currency: p.goal_currency === "USD" ? "USD" : "HTG",
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(str(p.deadline, 10)) ? str(p.deadline, 10) : null,
    urgent: p.urgent === true,
    cover_path: own(p.cover_path),
    gallery: (Array.isArray(p.gallery) ? p.gallery : []).map(own).filter((x): x is string => Boolean(x)).slice(0, 6),
    video_url: /^https:\/\/[^\s]+$/.test(video) ? video : null,
    voice_path: own(p.voice_path),
    language: isLocale(str(p.language, 2)) ? str(p.language, 2) : locale,
  };
  const seen = new Set<string>();
  const methods = (Array.isArray(p.methods) ? p.methods : [])
    .map((m) => ({ method: str(m?.method, 30), details: str(m?.details, 600) }))
    .filter((m) => METHOD_IDS.includes(m.method) && m.details.length >= 3 && !seen.has(m.method) && seen.add(m.method))
    .slice(0, 12);
  const pv = p.priv ?? {};
  const priv = {
    contact_name: str(pv.contact_name, 120) || null,
    contact_email: EMAIL.test(str(pv.contact_email, 254)) ? str(pv.contact_email, 254) : null,
    contact_details: str(pv.contact_details, 600) || null,
    id_front_path: own(pv.id_front_path), id_back_path: own(pv.id_back_path), selfie_path: own(pv.selfie_path),
    reference_name: str(pv.reference_name, 120) || null, reference_contact: str(pv.reference_contact, 200) || null,
    documents: (Array.isArray(pv.documents) ? pv.documents : []).map(own).filter((x): x is string => Boolean(x)).slice(0, 8),
  };
  if (title.length < 4) return fail(`${d.create.missing} ${d.create.needTitle}`);
  if (submit) {
    const missing: string[] = [];
    if (!row.beneficiary_name) missing.push(d.create.needBeneficiary);
    if (!row.cause) missing.push(d.create.needCause);
    if (!row.department) missing.push(d.create.needPlace);
    if (story.length < 40 && !row.voice_path) missing.push(d.create.needStory);
    if (!methods.length) missing.push(d.create.needMethod);
    if (!priv.contact_name || !priv.contact_email) missing.push(d.create.needContact);
    if (!priv.id_front_path || !priv.selfie_path) missing.push(d.create.needId);
    if (!p.consent) missing.push(d.create.needConsent);
    if (missing.length) return fail(`${d.create.missing} ${missing.join(", ")}`);
  }
  let id = typeof p.id === "string" && UUID.test(p.id) ? p.id : "";
  let status = "draft";
  if (id) {
    const { data: existing } = await sb.from("campaigns").select("id,status,owner_id").eq("id", id).maybeSingle();
    if (!existing || existing.owner_id !== user.id) return fail(d.common.error);
    status = existing.status;
    const { error } = await sb.from("campaigns").update(row).eq("id", id);
    if (error) return fail(error.message.includes("no longer") ? error.message : d.common.error);
  } else {
    const { data, error } = await sb.from("campaigns").insert({ ...row, slug: slugify(title), owner_id: user.id, status: "draft" }).select("id").single();
    if (error || !data) return fail(/limit|restricted/i.test(error?.message ?? "") ? (error?.message ?? d.common.error) : d.common.error);
    id = data.id;
  }
  const privRow = { campaign_id: id, ...priv, ...(submit && p.consent ? { consent_at: new Date().toISOString() } : {}) };
  const { error: pe } = await sb.from("campaign_private").upsert(privRow, { onConflict: "campaign_id" });
  if (pe) return fail(d.common.error);
  const { data: current } = await sb.from("support_methods").select("method,details,position").eq("campaign_id", id).order("position");
  const same = (current ?? []).length === methods.length && (current ?? []).every((c, i) => c.method === methods[i].method && c.details === methods[i].details);
  if (!same) {
    const { error: de } = await sb.from("support_methods").delete().eq("campaign_id", id);
    if (de) return fail(d.common.error);
    if (methods.length) {
      const { error: ie } = await sb.from("support_methods").insert(methods.map((m, i) => ({ campaign_id: id, ...m, position: i })));
      if (ie) return fail(d.common.error);
    }
  }
  if (submit && ["draft", "needs_changes", "rejected"].includes(status)) {
    const { error } = await sb.from("campaigns").update({ status: "pending" }).eq("id", id);
    if (error) return fail(d.common.error);
  }
  after(() => drainOutbox());
  revalidatePath(`/${locale}/dashboard`);
  redirect(`/${locale}/dashboard/campaigns/${id}?${submit ? "sent" : "saved"}=1`);
}
export async function setCampaignStatus(f: FormData) {
  const { locale, sb, user } = await ctx(f);
  const id = s(f, "id"), to = s(f, "to");
  if (!sb || !user || !UUID.test(id) || !["pending", "draft", "completed", "closed"].includes(to)) return;
  await sb.from("campaigns").update({ status: to }).eq("id", id).eq("owner_id", user.id);
  after(() => drainOutbox());
  revalidatePath(`/${locale}`, "layout");
}
export async function deleteCampaign(f: FormData) {
  const { locale, sb, user } = await ctx(f);
  const id = s(f, "id");
  if (!sb || !user || !UUID.test(id)) return;
  await sb.from("campaigns").delete().eq("id", id).eq("owner_id", user.id);
  revalidatePath(`/${locale}/dashboard`);
  redirect(`/${locale}/dashboard`);
}
export async function postUpdate(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const id = s(f, "id"), body = s(f, "body", 4000);
  if (!UUID.test(id) || !body) return fail(d.common.required);
  let proof: string[] = [];
  try {
    proof = (JSON.parse(String(f.get("proof") || "[]")) as unknown[]).filter((x): x is string => typeof x === "string" && x.startsWith(`${user.id}/`)).slice(0, 6);
  } catch {}
  const { error } = await sb.from("campaign_updates").insert({ campaign_id: id, author_id: user.id, body, proof });
  if (error) return fail(d.common.error);
  after(() => drainOutbox());
  revalidatePath(`/${locale}`, "layout");
  return done(d.dash.updatePosted);
}
export async function deleteUpdate(f: FormData) {
  const { locale, sb, user } = await ctx(f);
  const id = s(f, "id");
  if (!sb || !user || !UUID.test(id)) return;
  await sb.from("campaign_updates").delete().eq("id", id);
  revalidatePath(`/${locale}`, "layout");
}
export async function addTeamMember(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const id = s(f, "id"), email = s(f, "email", 254);
  if (!UUID.test(id) || !EMAIL.test(email)) return fail(d.common.required);
  const { data, error } = await sb.rpc("add_team_member", { cid: id, member_email: email });
  if (error) return fail(d.common.error);
  revalidatePath(`/${locale}/dashboard/campaigns/${id}`);
  return data === "ok" ? done(d.dash.teamAdded) : fail(data === "full" ? d.dash.teamFull : data === "not_found" || data === "self" ? d.dash.teamNotFound : d.common.error);
}
export async function removeTeamMember(f: FormData) {
  const { locale, sb, user } = await ctx(f);
  const id = s(f, "id"), member = s(f, "user_id");
  if (!sb || !user || !UUID.test(id) || !UUID.test(member)) return;
  await sb.from("campaign_members").delete().eq("campaign_id", id).eq("user_id", member);
  revalidatePath(`/${locale}/dashboard/campaigns/${id}`);
}

/* ---------- Supporter actions ---------- */
export async function toggleBookmark(f: FormData) {
  const { locale, sb, user } = await ctx(f);
  const id = s(f, "campaign_id"), back = safeNext(s(f, "back", 300), `/${locale}/donate`);
  if (!user) redirect(`/${locale}/login?next=${encodeURIComponent(back)}`);
  if (!sb || !UUID.test(id)) return;
  if (f.get("on") === "1") await sb.from("bookmarks").upsert({ user_id: user.id, campaign_id: id }, { onConflict: "user_id,campaign_id", ignoreDuplicates: true });
  else await sb.from("bookmarks").delete().eq("user_id", user.id).eq("campaign_id", id);
  revalidatePath(back);
  revalidatePath(`/${locale}/dashboard`);
}
export async function toggleRemind(f: FormData) {
  const { locale, sb, user } = await ctx(f);
  const id = s(f, "campaign_id");
  if (!sb || !user || !UUID.test(id)) return;
  await sb.from("bookmarks").update({ remind: f.get("on") === "1" }).eq("user_id", user.id).eq("campaign_id", id);
  revalidatePath(`/${locale}`, "layout");
}
export async function addContribution(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { locale, d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const id = s(f, "campaign_id"), amount = Number(s(f, "amount", 20).replace(/[\s,]/g, "")), method = s(f, "method", 30);
  if (!UUID.test(id) || !Number.isFinite(amount) || amount <= 0 || amount > 50000000) return fail(d.common.required);
  const anonymous = f.get("anonymous") === "on";
  const { error } = await sb.from("contributions").insert({
    campaign_id: id, user_id: user.id, amount: Math.round(amount * 100) / 100, currency: s(f, "currency") === "USD" ? "USD" : "HTG",
    method: METHOD_IDS.includes(method) ? method : null, display_name: anonymous ? null : s(f, "display_name", 80) || null, anonymous, message: s(f, "message", 500) || null,
  });
  if (error) return fail(/limit/i.test(error.message) ? error.message : d.common.error);
  after(() => drainOutbox());
  revalidatePath(`/${locale}`, "layout");
  return done(d.support.sentDone);
}
export async function addVouch(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const id = s(f, "campaign_id"), role = s(f, "role"), statement = s(f, "statement", 600);
  if (!UUID.test(id) || !(VOUCH_ROLES as readonly string[]).includes(role) || statement.length < 10) return fail(d.common.required);
  const { error } = await sb.from("vouches").insert({ campaign_id: id, voucher_id: user.id, role, organization: s(f, "organization", 120) || null, statement });
  if (error) return fail(d.common.error);
  return done(d.campaign.vouchSent);
}
export async function reportCampaign(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const id = s(f, "campaign_id"), reason = s(f, "reason");
  if (!UUID.test(id) || !(REASONS as readonly string[]).includes(reason)) return fail(d.common.required);
  const { error } = await sb.from("reports").insert({ campaign_id: id, reporter_id: user.id, reason, body: s(f, "body", 2000) });
  if (error) return fail(/limit/i.test(error.message) ? error.message : d.common.error);
  return done(d.report.sent);
}
export async function sendContact(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { d, sb, user } = await ctx(f);
  if (f.get("website")) return done(d.contact.sent);
  if (!sb) return fail(d.common.error);
  const email = s(f, "email", 254), body = s(f, "body", 4000);
  if (!EMAIL.test(email) || !body) return fail(d.common.required);
  const { error } = await sb.from("contact_messages").insert({ user_id: user?.id ?? null, name: s(f, "name", 120) || null, email, topic: s(f, "topic", 60) || null, body });
  if (error) return fail(/Too many/i.test(error.message) ? error.message : d.common.error);
  return done(d.contact.sent);
}
export async function submitAppeal(_: ActionResult, f: FormData): Promise<ActionResult> {
  const { d, sb, user } = await ctx(f);
  if (!sb || !user) return fail(d.common.signInFirst);
  const body = s(f, "body", 2000), cid = s(f, "campaign_id");
  if (body.length < 10) return fail(d.common.required);
  const { error } = await sb.from("appeals").insert({ user_id: user.id, campaign_id: UUID.test(cid) ? cid : null, body });
  return error ? fail(d.common.error) : done(d.dash.appealSent);
}
export async function markNotificationsRead(f: FormData) {
  const { locale, sb, user } = await ctx(f);
  if (!sb || !user) return;
  await sb.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null);
  revalidatePath(`/${locale}`, "layout");
}
