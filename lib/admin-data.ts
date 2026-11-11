import "server-only";
import { db } from "./supabase/server";
import { FIXTURES, fxCampaigns, fxCategories, fxMethods, fxMine, fxPrivate, fxProfile } from "./fixtures";
import type { Campaign, CampaignPrivate, Category, Contribution, Profile, SupportMethod, Update } from "./types";

const OWNER = "owner:profiles!campaigns_owner_id_fkey(id,display_name,avatar_path,kind,org_name,org_verified)";
export type Counts = { pending: number; reports: number; messages: number; vouches: number; appeals: number; orgs: number };
export async function adminCounts(): Promise<Counts> {
  if (FIXTURES) return { pending: 2, reports: 1, messages: 0, vouches: 1, appeals: 0, orgs: 1 };
  const sb = await db();
  const zero = { pending: 0, reports: 0, messages: 0, vouches: 0, appeals: 0, orgs: 0 };
  if (!sb) return zero;
  const n = async (table: string, f: (q: any) => any) => (await f(sb.from(table).select("*", { count: "exact", head: true }))).count ?? 0; // eslint-disable-line @typescript-eslint/no-explicit-any
  const [pending, reports, messages, vouches, appeals, orgs] = await Promise.all([
    n("campaigns", (q) => q.eq("status", "pending")), n("reports", (q) => q.eq("handled", false)), n("contact_messages", (q) => q.eq("handled", false)),
    n("vouches", (q) => q.eq("status", "pending")), n("appeals", (q) => q.eq("status", "open")), n("profiles", (q) => q.eq("kind", "organization").eq("org_verified", false)),
  ]);
  return { pending, reports, messages, vouches, appeals, orgs };
}
export async function adminCampaigns(status: string, q: string): Promise<Campaign[]> {
  if (FIXTURES) return status === "pending" ? fxMine.slice(1) : fxCampaigns;
  const sb = await db();
  if (!sb) return [];
  let query = sb.from("campaigns").select(`*, ${OWNER}`).limit(100);
  if (status && status !== "all") query = query.eq("status", status);
  const term = q.replace(/[,()%*\\"':]/g, " ").trim().slice(0, 60);
  if (term) query = query.ilike("title", `%${term}%`);
  query = status === "pending" ? query.order("emergency", { ascending: false }).order("urgent", { ascending: false }).order("submitted_at", { ascending: true }) : query.order("updated_at", { ascending: false });
  return ((await query).data ?? []) as Campaign[];
}
export type Signal = { kind: string; other_id: string | null; other_title: string | null; detail: string };
export type AdminDetail = {
  campaign: Campaign; owner: Profile | null; ownerEmail?: string; priv: CampaignPrivate | null; methods: SupportMethod[]; updates: Update[]; contributions: Contribution[];
  docs: { label: string; url: string | null }[]; signals: Signal[]; reports: { id: string; reason: string; body: string; handled: boolean; created_at: string }[];
  audit: { id: number; action: string; note: string | null; created_at: string }[]; ownerCampaigns: number;
};
export async function adminCampaign(id: string): Promise<AdminDetail | null> {
  if (FIXTURES)
    return { campaign: fxMine[1], owner: fxProfile, priv: fxPrivate, methods: fxMethods, updates: [], contributions: [], docs: [{ label: "ID, front", url: null }, { label: "ID, back", url: null }, { label: "Selfie with ID", url: null }], signals: [{ kind: "shared_payout", other_id: "c3", other_title: fxCampaigns[2].title, detail: "50937120000" }], reports: [], audit: [], ownerCampaigns: 3 };
  const sb = await db();
  if (!sb || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await sb.from("campaigns").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const c = data as Campaign;
  const [owner, priv, methods, updates, contributions, signals, reports, audit, count] = await Promise.all([
    sb.from("profiles").select("*").eq("id", c.owner_id).maybeSingle(),
    sb.from("campaign_private").select("*").eq("campaign_id", id).maybeSingle(),
    sb.from("support_methods").select("*").eq("campaign_id", id).order("position"),
    sb.from("campaign_updates").select("*").eq("campaign_id", id).order("created_at", { ascending: false }),
    sb.from("contributions").select("id,campaign_id,amount,currency,method,display_name,anonymous,message,hidden,created_at").eq("campaign_id", id).order("created_at", { ascending: false }).limit(50),
    sb.rpc("fraud_signals", { cid: id }),
    sb.from("reports").select("id,reason,body,handled,created_at").eq("campaign_id", id).order("created_at", { ascending: false }),
    sb.from("audit_log").select("id,action,note,created_at").eq("target_id", id).order("created_at", { ascending: false }).limit(30),
    sb.from("campaigns").select("id", { count: "exact", head: true }).eq("owner_id", c.owner_id),
  ]);
  const p = (priv.data ?? null) as CampaignPrivate | null;
  const paths: [string, string | null][] = [["ID, front", p?.id_front_path ?? null], ["ID, back", p?.id_back_path ?? null], ["Selfie with ID", p?.selfie_path ?? null], ...(p?.documents ?? []).map((d, i): [string, string] => [`Document ${i + 1}`, d])];
  const docs = await Promise.all(paths.map(async ([label, path]) => ({ label, url: path ? (await sb.storage.from("documents").createSignedUrl(path, 600)).data?.signedUrl ?? null : null })));
  return { campaign: c, owner: (owner.data ?? null) as Profile | null, priv: p, methods: (methods.data ?? []) as SupportMethod[], updates: (updates.data ?? []) as Update[], contributions: (contributions.data ?? []) as Contribution[], docs, signals: (signals.data ?? []) as Signal[], reports: reports.data ?? [], audit: audit.data ?? [], ownerCampaigns: count.count ?? 0 };
}
export async function adminUsers(q: string, only: string): Promise<Profile[]> {
  if (FIXTURES) return [fxProfile];
  const sb = await db();
  if (!sb) return [];
  let query = sb.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
  const term = q.replace(/[,()%*\\"':]/g, " ").trim().slice(0, 60);
  if (term) query = query.or(`display_name.ilike.%${term}%,org_name.ilike.%${term}%`);
  if (only === "banned") query = query.eq("banned", true);
  if (only === "admins") query = query.eq("role", "admin");
  if (only === "orgs") query = query.eq("kind", "organization");
  return ((await query).data ?? []) as Profile[];
}
type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
async function rows(table: string, select: string, order = "created_at", limit = 100): Promise<Row[]> {
  if (FIXTURES) return [];
  const sb = await db();
  if (!sb) return [];
  return ((await sb.from(table).select(select).order(order, { ascending: false }).limit(limit)).data ?? []) as unknown as Row[];
}
export const adminReports = () => FIXTURES ? Promise.resolve<Row[]>([{ id: "r1", reason: "payout_mismatch", body: "Nimewo MonCash la pa sou non òganizatè a.", handled: false, created_at: "2026-11-10T10:00:00Z", campaign: { id: "c4", title: fxCampaigns[3].title, slug: fxCampaigns[3].slug } }]) : rows("reports", "*, campaign:campaigns(id,title,slug)");
export const adminMessages = () => rows("contact_messages", "*");
export const adminVouches = () => FIXTURES ? Promise.resolve<Row[]>([{ id: "v9", role: "church", organization: "Legliz Batis Lafwa", statement: "Nou konnen fanmi sa a e nou konfime bezwen an.", status: "pending", created_at: "2026-11-10T10:00:00Z", campaign: { id: "c1", title: fxCampaigns[0].title, slug: fxCampaigns[0].slug }, voucher: { id: "x", display_name: "Pastè Samuel Charles" } }]) : rows("vouches", "*, campaign:campaigns(id,title,slug), voucher:profiles!vouches_voucher_id_fkey(id,display_name)");
export const adminAppeals = () => rows("appeals", "*, user:profiles!appeals_user_id_fkey(id,display_name), campaign:campaigns(id,title)");
export const adminAudit = () => rows("audit_log", "*, actor:profiles!audit_log_actor_id_fkey(display_name)", "created_at", 150);
export const adminBlocklist = () => rows("blocklist", "*");
export async function adminCategories(): Promise<Category[]> {
  if (FIXTURES) return fxCategories;
  const sb = await db();
  return sb ? (((await sb.from("categories").select("*").order("position")).data ?? []) as Category[]) : [];
}
