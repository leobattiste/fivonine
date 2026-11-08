"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { serviceClient } from "@/lib/supabase/service";
import { SITE_URL } from "@/lib/supabase/config";
import { parseCampaign, type ActionState } from "@/lib/domain";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { humanCheck, rateLimit } from "@/lib/abuse";
const localeOf = (f: FormData): Locale => {
  const l = String(f.get("locale"));
  return isLocale(l) ? l : "ht";
};
const failed = (l: Locale): ActionState => ({
  ok: false,
  message: t(l).errors,
});
export async function loginAction(
  _: ActionState,
  f: FormData,
): Promise<ActionState> {
  const l = localeOf(f),
    db = await getServerClient();
  if (!db) return { ok: false, message: t(l).unavailable };
  const email = String(f.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, message: t(l).required };
  if (!(await humanCheck(f)) || !(await rateLimit("login"))) return failed(l);
  const { error } = await db.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${SITE_URL}/${l}/auth/callback` },
  });
  return error ? failed(l) : { ok: true, message: t(l).checkInbox };
}
export async function signOut(f: FormData) {
  const l = localeOf(f),
    db = await getServerClient();
  const result = await db?.auth.signOut();
  if (result?.error) throw new Error(t(l).errors);
  redirect(`/${l}`);
}
export async function submitCampaign(
  _: ActionState,
  f: FormData,
): Promise<ActionState> {
  const l = localeOf(f),
    db = await getServerClient();
  if (!db) return { ok: false, message: t(l).unavailable };
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user?.email_confirmed_at) return { ok: false, message: t(l).login };
  let content;
  try {
    content = parseCampaign(f);
  } catch {
    return { ok: false, message: t(l).required };
  }
  const id = String(f.get("campaign_id") ?? "") || null;
  if (id && !/^[a-f\d-]{36}$/i.test(id)) return failed(l);
  const { data, error } = await db.rpc("submit_campaign", {
    content: { ...content, consent: true, accuracy: true },
    campaign_id: id,
  });
  if (error) return failed(l);
  revalidatePath(`/${l}/dashboard`);
  return { ok: true, message: t(l).saved, id: data };
}
export async function organizerAction(
  _: ActionState,
  f: FormData,
): Promise<ActionState> {
  const l = localeOf(f),
    db = await getServerClient();
  if (!db) return failed(l);
  const id = String(f.get("campaign_id") ?? "");
  const kind = String(f.get("kind"));
  if (!["update", "remove"].includes(kind)) return failed(l);
  const title = String(f.get("title") ?? "").trim(),
    body = String(f.get("body") ?? "").trim();
  if (
    kind === "update" &&
    (!title || !body || title.length > 160 || body.length > 5000)
  )
    return failed(l);
  const { error } = await db.rpc("organizer_request", {
    campaign_id: id,
    request_kind: kind,
    update_title: title,
    update_body: body,
  });
  if (error) return failed(l);
  revalidatePath(`/${l}/dashboard`);
  return { ok: true, message: t(l).saved };
}
export async function messageAction(
  _: ActionState,
  f: FormData,
): Promise<ActionState> {
  const l = localeOf(f),
    db = serviceClient();
  if (!db) return { ok: false, message: t(l).unavailable };
  const kind = String(f.get("kind")) === "report" ? "report" : "contact";
  const body = String(f.get("body") ?? "").trim(),
    email = String(f.get("email") ?? "").trim();
  if (!body || body.length > 5000 || !/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, message: t(l).required };
  if (!(await humanCheck(f)) || !(await rateLimit(kind))) return failed(l);
  const row: Record<string, string> = {
    email,
    body,
    reason: String(f.get("reason") ?? "").slice(0, 120),
    ...(kind === "report"
      ? { campaign_id: String(f.get("campaign_id") ?? "") }
      : { name: String(f.get("name") ?? "").slice(0, 160) }),
  };
  const { error } = await db
    .from(kind === "report" ? "reports" : "contact_messages")
    .insert(row);
  return error
    ? failed(l)
    : {
        ok: true,
        message: kind === "report" ? t(l).reportSent : t(l).contactSent,
      };
}
export async function moderate(
  _: ActionState,
  f: FormData,
): Promise<ActionState> {
  const l = localeOf(f),
    db = await getServerClient();
  if (!db) return failed(l);
  const { error } = await db.rpc("moderate_campaign", {
    record_id: String(f.get("record_id")),
    record_kind: String(f.get("record_kind")),
    decision: String(f.get("decision")),
    review_note: String(f.get("review_note") ?? "").slice(0, 2000),
    links_checked: f.get("links_checked") === "on",
    organization_checked: f.get("organization_checked") === "on",
  });
  if (error) return failed(l);
  revalidatePath(`/${l}/admin`);
  revalidatePath(`/${l}/explore`);
  return { ok: true, message: t(l).saved };
}
