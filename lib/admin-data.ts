import "server-only";
import { db } from "./supabase/server";
import { checked, unavailable } from "./data-errors";
import { FIXTURES, fxCampaigns, fxCategories, fxMethods, fxMine, fxPrivate, fxProfile } from "./fixtures";
import type { Campaign, CampaignChange, CampaignPrivate, Category, Contribution, Profile, SupportMethod, Update } from "./types";

const OWNER = "owner:profiles!campaigns_owner_id_fkey(id,display_name,avatar_path,kind,org_name,org_verified)";
async function adminDb() { return (await db()) ?? unavailable("admin_connection"); }
export type Counts = { changes: number; pending: number; reports: number; messages: number; vouches: number; appeals: number; orgs: number };
export async function adminCounts(): Promise<Counts> {
  if (FIXTURES) return { changes: 0, pending: 2, reports: 1, messages: 0, vouches: 1, appeals: 0, orgs: 1 };
  const sb = await adminDb();
  const n = async (table: string, f: (q: any) => any) => checked(await f(sb.from(table).select("*", { count: "exact", head: true })), `admin_count_${table}`).count ?? 0; // eslint-disable-line @typescript-eslint/no-explicit-any
  const [changes, pending, reports, messages, vouches, appeals, orgs] = await Promise.all([
    n("campaign_changes", (q) => q.eq("status", "pending")),
    n("campaigns", (q) => q.eq("status", "pending")), n("reports", (q) => q.eq("handled", false)), n("contact_messages", (q) => q.eq("handled", false)),
    n("vouches", (q) => q.eq("status", "pending")), n("appeals", (q) => q.eq("status", "open")), n("profiles", (q) => q.eq("kind", "organization").eq("org_verified", false)),
  ]);
  return { changes, pending, reports, messages, vouches, appeals, orgs };
}
export async function adminCampaigns(status: string, q: string): Promise<Campaign[]> {
  if (FIXTURES) return status === "pending" ? fxMine.slice(1) : fxCampaigns;
  const sb = await adminDb();
  let query = sb.from("campaigns").select(`*, ${OWNER}`).limit(100);
  if (status && status !== "all") query = query.eq("status", status);
  const term = q.replace(/[,()%*\\"':]/g, " ").trim().slice(0, 60);
  if (term) query = query.ilike("title", `%${term}%`);
  query = status === "pending" ? query.order("emergency", { ascending: false }).order("urgent", { ascending: false }).order("submitted_at", { ascending: true }) : query.order("updated_at", { ascending: false });
  return (checked(await query, "admin_campaigns").data ?? []) as Campaign[];
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
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const sb = await adminDb();
  const { data } = checked(await sb.from("campaigns").select("*").eq("id", id).maybeSingle(), "admin_campaign");
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
  for (const result of [owner, priv, methods, updates, contributions, signals, reports, audit, count]) checked(result, "admin_campaign_detail");
  const p = (priv.data ?? null) as CampaignPrivate | null;
  const paths: [string, string | null][] = [["ID, front", p?.id_front_path ?? null], ["ID, back", p?.id_back_path ?? null], ["Selfie with ID", p?.selfie_path ?? null], ...(p?.documents ?? []).map((d, i): [string, string] => [`Document ${i + 1}`, d])];
  const docs = await Promise.all(paths.map(async ([label, path]) => ({ label, url: path ? (await sb.storage.from("documents").createSignedUrl(path, 600)).data?.signedUrl ?? null : null })));
  return { campaign: c, owner: (owner.data ?? null) as Profile | null, priv: p, methods: (methods.data ?? []) as SupportMethod[], updates: (updates.data ?? []) as Update[], contributions: (contributions.data ?? []) as Contribution[], docs, signals: (signals.data ?? []) as Signal[], reports: reports.data ?? [], audit: audit.data ?? [], ownerCampaigns: count.count ?? 0 };
}
export async function adminUsers(q: string, only: string): Promise<Profile[]> {
  if (FIXTURES) return [fxProfile];
  const sb = await adminDb();
  let query = sb.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
  const term = q.replace(/[,()%*\\"':]/g, " ").trim().slice(0, 60);
  if (term) query = query.or(`display_name.ilike.%${term}%,org_name.ilike.%${term}%`);
  if (only === "banned") query = query.eq("banned", true);
  if (only === "admins") query = query.eq("role", "admin");
  if (only === "orgs") query = query.eq("kind", "organization");
  return (checked(await query, "admin_users").data ?? []) as Profile[];
}
type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
async function rows(table: string, select: string, order = "created_at", limit = 100): Promise<Row[]> {
  if (FIXTURES) return [];
  const sb = await adminDb();
  return (checked(await sb.from(table).select(select).order(order, { ascending: false }).limit(limit), `admin_${table}`).data ?? []) as unknown as Row[];
}
export const adminReports = () => FIXTURES ? Promise.resolve<Row[]>([{ id: "r1", reason: "payout_mismatch", body: "Nimewo MonCash la pa sou non òganizatè a.", handled: false, created_at: "2026-11-10T10:00:00Z", campaign: { id: "c4", title: fxCampaigns[3].title, slug: fxCampaigns[3].slug } }]) : rows("reports", "*, campaign:campaigns(id,title,slug)");
export const adminMessages = () => rows("contact_messages", "*");
export const adminVouches = () => FIXTURES ? Promise.resolve<Row[]>([{ id: "v9", role: "church", organization: "Legliz Batis Lafwa", statement: "Nou konnen fanmi sa a e nou konfime bezwen an.", status: "pending", created_at: "2026-11-10T10:00:00Z", campaign: { id: "c1", title: fxCampaigns[0].title, slug: fxCampaigns[0].slug }, voucher: { id: "x", display_name: "Pastè Samuel Charles" } }]) : rows("vouches", "*, campaign:campaigns(id,title,slug), voucher:profiles!vouches_voucher_id_fkey(id,display_name)");
export const adminAppeals = () => rows("appeals", "*, user:profiles!appeals_user_id_fkey(id,display_name), campaign:campaigns(id,title)");
export const adminAudit = () => rows("audit_log", "*, actor:profiles!audit_log_actor_id_fkey(display_name)", "created_at", 150);
export const adminBlocklist = () => rows("blocklist", "*");
export async function adminCategories(): Promise<Category[]> {
  if (FIXTURES) return fxCategories;
  const sb = await adminDb();
  return (checked(await sb.from("categories").select("*").order("position"), "admin_categories").data ?? []) as Category[];
}
export type ChangeRow = CampaignChange & { campaign: Pick<Campaign, "id" | "title" | "slug" | "status"> | null };
export async function adminChanges(): Promise<ChangeRow[]> {
  if (FIXTURES) return [];
  const sb = await adminDb();
  return (checked(await sb.from("campaign_changes").select("*, campaign:campaigns(id,title,slug,status)").order("submitted_at"), "admin_changes").data ?? []) as ChangeRow[];
}
export async function adminChange(id: string): Promise<CampaignChange | null> {
  if (FIXTURES) return null;
  const sb = await adminDb();
  return (checked(await sb.from("campaign_changes").select("*").eq("campaign_id", id).maybeSingle(), "admin_change").data ?? null) as CampaignChange | null;
}
