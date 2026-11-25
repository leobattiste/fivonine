"use server";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/lib/supabase/server";
import { drainOutbox } from "@/lib/email";
import { TIERS } from "@/lib/constants";
import { locales } from "@/lib/i18n";
import type { ActionResult } from "@/lib/types";

const s = (f: FormData, k: string, max = 500) => String(f.get(k) ?? "").trim().slice(0, max);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const fail = (message: string): ActionResult => ({ ok: false, message });
const done = (message: string): ActionResult => ({ ok: true, message });

/** Row-level security is the real gate; this check only gives a clean error. */
async function admin() {
  const sb = await db();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  if (!data.user) return null;
  const { data: p } = await sb.from("profiles").select("role,banned").eq("id", data.user.id).maybeSingle();
  if (p?.role !== "admin" || p.banned) return null;
  const log = async (action: string, target_type: string, target_id: string, note = "") => {
    const { error } = await sb.from("audit_log").insert({ actor_id: data.user!.id, action, target_type, target_id: target_id.slice(0, 80), note: note.slice(0, 2000) || null });
    if (error) throw new Error("The operation could not be added to the audit log.");
  };
  return { sb, uid: data.user.id, log };
}
const refresh = () => revalidatePath("/", "layout");

export async function moderate(_: ActionResult, f: FormData): Promise<ActionResult> {
  const a = await admin();
  if (!a) return fail("Admin access required.");
  const id = s(f, "id"), decision = s(f, "decision"), note = s(f, "note", 2000), tier = s(f, "tier");
  if (!UUID.test(id)) return fail("Unknown campaign.");
  const map: Record<string, string> = { approve: "live", needs_changes: "needs_changes", reject: "rejected", suspend: "suspended", restore: "live" };
  if (decision !== "flags" && !map[decision]) return fail("Choose a decision.");
  if (["needs_changes", "reject", "suspend"].includes(decision) && note.length < 5) return fail("Write a reason. The organizer will read it.");
  if (!(TIERS as readonly string[]).includes(tier)) return fail("Choose a verification badge.");
  const { data, error } = await a.sb.rpc("review_campaign", {
    cid: id, decision, review_note: note, checked_identity: f.get("identity_checked") === "on", checked_recipient: f.get("recipient_checked") === "on", badge: tier,
    flags: { featured: f.get("featured") === "on", urgent: f.get("urgent") === "on", emergency: f.get("emergency") === "on" },
  });
  if (error || data !== "ok") return fail(error?.message ?? "The decision was not saved.");
  after(() => drainOutbox());
  refresh();
  return done(decision === "flags" ? "Settings saved." : `Decision recorded: ${map[decision].replace("_", " ")}.`);
}
export async function setBan(f: FormData) {
  const a = await admin();
  const id = s(f, "user_id"), banned = f.get("banned") === "1";
  if (!a || !UUID.test(id) || id === a.uid) return;
  const { data, error } = await a.sb.rpc("set_account_restriction", { uid: id, restricted: banned, reason: s(f, "note", 500) });
  if (error || data !== "ok") throw new Error(error?.message ?? "The account restriction was not saved.");
  after(() => drainOutbox());
  refresh();
}
export async function setRole(f: FormData) {
  const a = await admin();
  const id = s(f, "user_id"), role = s(f, "role") === "admin" ? "admin" : "user";
  if (!a || !UUID.test(id) || id === a.uid) return;
  const { data, error } = await a.sb.from("profiles").update({ role }).eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "The user was not found.");
  await a.log(`user_role_${role}`, "user", id);
  refresh();
}
export async function verifyOrg(f: FormData) {
  const a = await admin();
  const id = s(f, "user_id"), on = f.get("on") === "1";
  if (!a || !UUID.test(id)) return;
  const { data, error } = await a.sb.from("profiles").update({ org_verified: on }).eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "The organization was not found.");
  await a.log(on ? "org_verify" : "org_unverify", "user", id);
  refresh();
}
export async function resolveItem(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), table = s(f, "table"), handled = f.get("handled") !== "0";
  if (!a || !UUID.test(id) || !["reports", "contact_messages"].includes(table)) return;
  const { data, error } = await a.sb.from(table).update({ handled }).eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "The item was not found.");
  await a.log(`${table}_handled`, table, id);
  refresh();
}
export async function decideVouch(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), status = s(f, "status");
  if (!a || !UUID.test(id) || !["approved", "declined"].includes(status)) return;
  const { data, error } = await a.sb.from("vouches").update({ status }).eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "The vouch was not found.");
  await a.log(`vouch_${status}`, "vouch", id);
  after(() => drainOutbox());
  refresh();
}
export async function decideAppeal(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), status = s(f, "status");
  if (!a || !UUID.test(id) || !["accepted", "declined"].includes(status)) return;
  const note = s(f, "note", 1000);
  if (note.length < 5) throw new Error("Write a reply for the member.");
  const { data, error } = await a.sb.from("appeals").update({ status, admin_note: note }).eq("id", id).eq("status", "open").select("id").single();
  if (error || !data) throw new Error(error?.message ?? "This appeal is no longer waiting.");
  // The database records the decision and enqueues its member notification atomically.
  after(() => drainOutbox());
  refresh();
}
export async function setHidden(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), table = s(f, "table"), hidden = f.get("hidden") === "1";
  if (!a || !UUID.test(id) || !["campaign_updates", "contributions"].includes(table)) return;
  const { data, error } = await a.sb.from(table).update({ hidden }).eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "The item was not found.");
  await a.log(hidden ? "hide" : "unhide", table, id);
  refresh();
}
export async function saveSettings(_: ActionResult, f: FormData): Promise<ActionResult> {
  const a = await admin();
  if (!a) return fail("Admin access required.");
  const rate = Number(s(f, "rate", 12));
  if (!Number.isFinite(rate) || rate <= 0 || rate > 100000) return fail("Enter a valid exchange rate.");
  const { data: current, error: readError } = await a.sb.from("settings").select("value").eq("key", "emergency").maybeSingle();
  if (readError) return fail(readError.message);
  const banner = (locale: (typeof locales)[number]) => f.has(locale) ? s(f, locale, 300) : String(current?.value?.[locale] ?? "").slice(0, 300);
  const emergency = { active: f.get("active") === "on", ht: banner("ht"), fr: banner("fr"), en: banner("en"), es: banner("es") };
  if (emergency.active && locales.some((locale) => !emergency[locale].trim())) return fail("Write the banner in all four languages before turning emergency mode on.");
  const { error } = await a.sb.from("settings").upsert([{ key: "emergency", value: emergency }, { key: "rate", value: { htg_per_usd: rate } }], { onConflict: "key" });
  if (error) return fail(error.message);
  await a.log("settings_save", "settings", "site", emergency.active ? "emergency on" : "emergency off");
  refresh();
  return done("Settings saved.");
}
export async function saveCategory(_: ActionResult, f: FormData): Promise<ActionResult> {
  const a = await admin();
  if (!a) return fail("Admin access required.");
  const slug = s(f, "slug", 40).toLowerCase();
  const row = { slug, name_ht: s(f, "name_ht", 60), name_fr: s(f, "name_fr", 60), name_en: s(f, "name_en", 60), name_es: s(f, "name_es", 60), position: Number(s(f, "position", 4)) || 0, active: f.get("active") === "on" };
  if (!/^[a-z0-9-]{2,40}$/.test(slug) || !row.name_ht || !row.name_fr || !row.name_en || !row.name_es) return fail("Fill in the slug and all four names.");
  const { error } = await a.sb.from("categories").upsert(row, { onConflict: "slug" });
  if (error) return fail(error.message);
  await a.log("category_save", "category", slug);
  refresh();
  return done("Cause saved.");
}
export async function addBlock(_: ActionResult, f: FormData): Promise<ActionResult> {
  const a = await admin();
  if (!a) return fail("Admin access required.");
  const value = s(f, "value", 200).toLowerCase();
  if (value.length < 3) return fail("Enter at least 3 characters.");
  const { error } = await a.sb.from("blocklist").insert({ value, note: s(f, "note", 300) || null });
  if (error) return fail(error.code === "23505" ? "Already on the blocklist." : error.message);
  await a.log("blocklist_add", "blocklist", value.slice(0, 80));
  refresh();
  return done("Added to the blocklist.");
}
export async function removeBlock(f: FormData) {
  const a = await admin();
  const id = s(f, "id");
  if (!a || !UUID.test(id)) return;
  const { data, error } = await a.sb.from("blocklist").delete().eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "The blocklist item was not found.");
  await a.log("blocklist_remove", "blocklist", id);
  refresh();
}

/** Bulk moderation from the campaigns table. Suspending needs a reason; every change can be undone. */
export async function bulkCampaigns(_: ActionResult, f: FormData): Promise<ActionResult> {
  const a = await admin();
  if (!a) return fail("Admin access required.");
  const ids = f.getAll("ids").map(String).filter((v) => UUID.test(v)).slice(0, 100);
  const op = s(f, "op"), note = s(f, "note", 2000);
  if (!ids.length) return fail("Select at least one fundraiser.");
  if (op === "suspend" && note.length < 5) return fail("Write a reason. The organizers will read it.");
  const { data: before, error: readError } = await a.sb.from("campaigns").select("id,status,featured").in("id", ids);
  if (readError || !before?.length) return fail(readError?.message ?? "No selected fundraisers were found.");
  let patch: Record<string, unknown>;
  if (op === "feature") patch = { featured: true };
  else if (op === "unfeature") patch = { featured: false };
  else if (op === "suspend") patch = { status: "suspended" };
  else if (op === "undo") {
    let snapshot: { id: string; status: string; featured: boolean }[] = [];
    try { snapshot = JSON.parse(s(f, "snapshot", 20000)); } catch { return fail("Nothing to undo."); }
    const { data, error } = await a.sb.rpc("undo_campaign_flags", { snapshot });
    if (error || data !== "ok") return fail(error?.message ?? "The previous settings could not be restored.");
    await a.log("bulk_undo", "campaign", snapshot.map((r) => r.id).join(",").slice(0, 200));
    refresh();
    return done(`Undone for ${snapshot.length}.`);
  } else return fail("Choose an action.");
  if (op === "suspend") {
    const live = (before ?? []).filter((r) => ["live", "pending", "needs_changes"].includes(r.status)).map((r) => r.id);
    if (!live.length) return fail("None of the selected fundraisers can be suspended.");
    const { data, error } = await a.sb.rpc("suspend_campaigns", { ids: live, reason: note });
    if (error || data !== live.length) return fail(error?.message ?? "The selected fundraisers could not all be suspended.");
  } else {
    const { data, error } = await a.sb.from("campaigns").update(patch).in("id", ids).select("id");
    if (error || data?.length !== ids.length) return fail(error?.message ?? "Some selected fundraisers were not found. Refresh and retry.");
  }
  await a.log(`bulk_${op}`, "campaign", ids.join(",").slice(0, 200), note);
  after(() => drainOutbox());
  refresh();
  return { ok: true, message: `${op === "feature" ? "Featured" : op === "unfeature" ? "Removed from home" : "Suspended"}: ${ids.length}.`, undo: JSON.stringify(before ?? []) };
}
export async function decideChanges(_: ActionResult, f: FormData): Promise<ActionResult> {
  const a = await admin();
  if (!a) return fail("Admin access required.");
  const id = s(f, "id"), decision = s(f, "decision"), note = s(f, "note", 2000);
  if (!UUID.test(id)) return fail("Unknown fundraiser.");
  if (decision === "approve") {
    const { data, error } = await a.sb.rpc("apply_campaign_changes", { cid: id, checked_identity: f.get("identity_checked") === "on", checked_recipient: f.get("recipient_checked") === "on" });
    if (error || data !== "ok") return fail(error?.message ?? "These changes are no longer waiting.");
  } else if (decision === "needs_changes") {
    if (note.length < 5) return fail("Write what needs to change. The organizer will read it.");
    const { data, error } = await a.sb.from("campaign_changes").update({ status: "needs_changes", review_note: note }).eq("campaign_id", id).eq("status", "pending").select("campaign_id").single();
    if (error || !data) return fail(error?.message ?? "These changes are no longer waiting.");
  } else if (decision === "discard") {
    if (note.length < 5) return fail("Write a reason. The organizer will read it.");
    const { data, error } = await a.sb.rpc("discard_campaign_changes", { cid: id, reason: note });
    if (error || data !== "ok") return fail(error?.message ?? "These changes are no longer waiting.");
  } else return fail("Choose a decision.");
  if (decision === "needs_changes") await a.log(`changes_${decision}`, "campaign", id, note);
  after(() => drainOutbox());
  refresh();
  return done(decision === "approve" ? "Changes published." : decision === "discard" ? "Changes discarded." : "Sent back to the organizer.");
}
