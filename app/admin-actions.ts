"use server";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { db } from "@/lib/supabase/server";
import { drainOutbox } from "@/lib/email";
import { TIERS } from "@/lib/constants";
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
  const log = (action: string, target_type: string, target_id: string, note = "") =>
    sb.from("audit_log").insert({ actor_id: data.user!.id, action, target_type, target_id, note: note.slice(0, 2000) || null });
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
  const patch: Record<string, unknown> = { featured: f.get("featured") === "on", urgent: f.get("urgent") === "on", emergency: f.get("emergency") === "on" };
  if ((TIERS as readonly string[]).includes(tier)) patch.tier = tier;
  if (decision !== "flags") {
    patch.status = map[decision];
    const { error: ne } = await a.sb.from("campaign_private").upsert({ campaign_id: id, review_note: note || null }, { onConflict: "campaign_id" });
    if (ne) return fail(ne.message);
  }
  const { error } = await a.sb.from("campaigns").update(patch).eq("id", id);
  if (error) return fail(error.message);
  await a.log(`campaign_${decision}`, "campaign", id, note);
  after(() => drainOutbox());
  refresh();
  return done(decision === "flags" ? "Settings saved." : `Decision recorded: ${map[decision].replace("_", " ")}.`);
}
export async function setBan(f: FormData) {
  const a = await admin();
  const id = s(f, "user_id"), banned = f.get("banned") === "1";
  if (!a || !UUID.test(id) || id === a.uid) return;
  await a.sb.from("profiles").update({ banned }).eq("id", id);
  if (banned) await a.sb.from("campaigns").update({ status: "suspended" }).eq("owner_id", id).in("status", ["live", "pending", "needs_changes"]);
  await a.log(banned ? "user_ban" : "user_unban", "user", id, s(f, "note", 500));
  refresh();
}
export async function setRole(f: FormData) {
  const a = await admin();
  const id = s(f, "user_id"), role = s(f, "role") === "admin" ? "admin" : "user";
  if (!a || !UUID.test(id) || id === a.uid) return;
  await a.sb.from("profiles").update({ role }).eq("id", id);
  await a.log(`user_role_${role}`, "user", id);
  refresh();
}
export async function verifyOrg(f: FormData) {
  const a = await admin();
  const id = s(f, "user_id"), on = f.get("on") === "1";
  if (!a || !UUID.test(id)) return;
  await a.sb.from("profiles").update({ org_verified: on }).eq("id", id);
  await a.log(on ? "org_verify" : "org_unverify", "user", id);
  refresh();
}
export async function resolveItem(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), table = s(f, "table"), handled = f.get("handled") !== "0";
  if (!a || !UUID.test(id) || !["reports", "contact_messages"].includes(table)) return;
  await a.sb.from(table).update({ handled }).eq("id", id);
  await a.log(`${table}_handled`, table, id);
  refresh();
}
export async function decideVouch(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), status = s(f, "status");
  if (!a || !UUID.test(id) || !["approved", "declined"].includes(status)) return;
  await a.sb.from("vouches").update({ status }).eq("id", id);
  await a.log(`vouch_${status}`, "vouch", id);
  after(() => drainOutbox());
  refresh();
}
export async function decideAppeal(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), status = s(f, "status");
  if (!a || !UUID.test(id) || !["accepted", "declined"].includes(status)) return;
  await a.sb.from("appeals").update({ status, admin_note: s(f, "note", 1000) || null }).eq("id", id);
  await a.log(`appeal_${status}`, "appeal", id, s(f, "note", 1000));
  refresh();
}
export async function setHidden(f: FormData) {
  const a = await admin();
  const id = s(f, "id"), table = s(f, "table"), hidden = f.get("hidden") === "1";
  if (!a || !UUID.test(id) || !["campaign_updates", "contributions"].includes(table)) return;
  await a.sb.from(table).update({ hidden }).eq("id", id);
  await a.log(hidden ? "hide" : "unhide", table, id);
  refresh();
}
export async function saveSettings(_: ActionResult, f: FormData): Promise<ActionResult> {
  const a = await admin();
  if (!a) return fail("Admin access required.");
  const rate = Number(s(f, "rate", 12));
  if (!Number.isFinite(rate) || rate <= 0 || rate > 100000) return fail("Enter a valid exchange rate.");
  const emergency = { active: f.get("active") === "on", ht: s(f, "ht", 300), fr: s(f, "fr", 300), en: s(f, "en", 300) };
  if (emergency.active && !emergency.ht) return fail("Write the banner text in Creole before turning emergency mode on.");
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
  const row = { slug, name_ht: s(f, "name_ht", 60), name_fr: s(f, "name_fr", 60), name_en: s(f, "name_en", 60), position: Number(s(f, "position", 4)) || 0, active: f.get("active") === "on" };
  if (!/^[a-z0-9-]{2,40}$/.test(slug) || !row.name_ht || !row.name_fr || !row.name_en) return fail("Fill in the slug and all three names.");
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
  await a.sb.from("blocklist").delete().eq("id", id);
  await a.log("blocklist_remove", "blocklist", id);
  refresh();
}
