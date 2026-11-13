import "server-only";
import { cache } from "react";
import { db } from "./supabase/server";
import { cleanSearch } from "./format";
import { PER_PAGE } from "./constants";
import { FIXTURES, fxCampaigns, fxCategories, fxContributions, fxMethods, fxMine, fxNotifications, fxPrivate, fxUpdates, fxVouches } from "./fixtures";
import type { Campaign, CampaignChange, CampaignPrivate, Category, Contribution, Notification, Profile, Progress, Settings, SupportMethod, Update, Vouch } from "./types";

const OWNER = "owner:profiles!campaigns_owner_id_fkey(id,display_name,avatar_path,kind,org_name,org_verified)";
const CONTRIB_COLS = "id,campaign_id,amount,currency,method,display_name,anonymous,message,hidden,created_at";
const defaults: Settings = { emergency: { active: false, ht: "", fr: "", en: "" }, rate: { htg_per_usd: 131 } };

export const getSettings = cache(async (): Promise<Settings> => {
  if (FIXTURES) return process.env.FIVONINE_FIXTURE_EMERGENCY ? { ...defaults, emergency: { active: true, ht: "Siklòn Melissa: n ap verifye kanpay ijans yo an premye.", fr: "Ouragan Melissa : les campagnes d'urgence sont vérifiées en priorité.", en: "Hurricane Melissa: emergency campaigns are reviewed first." } } : defaults;
  const sb = await db();
  if (!sb) return defaults;
  const { data } = await sb.from("settings").select("key,value");
  const out = structuredClone(defaults);
  for (const row of data ?? []) {
    if (row.key === "emergency") out.emergency = { ...out.emergency, ...row.value };
    if (row.key === "rate" && Number(row.value?.htg_per_usd) > 0) out.rate = { htg_per_usd: Number(row.value.htg_per_usd) };
  }
  return out;
});

export const getCategories = cache(async (all = false): Promise<Category[]> => {
  if (FIXTURES) return fxCategories;
  const sb = await db();
  if (!sb) return [];
  let q = sb.from("categories").select("*").order("position");
  if (!all) q = q.eq("active", true);
  return ((await q).data ?? []) as Category[];
});

async function withProgress(items: Campaign[]): Promise<Campaign[]> {
  if (!items.length) return items;
  const sb = await db();
  if (!sb) return items;
  const { data } = await sb.from("campaign_progress").select("*").in("campaign_id", items.map((c) => c.id));
  const map = new Map<string, Progress>((data ?? []).map((p: Progress & { campaign_id: string }) => [p.campaign_id, p]));
  return items.map((c) => ({ ...c, progress: map.get(c.id) ?? { total_htg: 0, total_usd: 0, supporters: 0 } }));
}

export type ListOpts = { q?: string; cause?: string; department?: string; verified?: boolean; urgent?: boolean; completed?: boolean; status?: "open" | "completed" | "all"; emergency?: boolean; sort?: string; page?: number; perPage?: number; owner?: string; featured?: boolean };
export async function listCampaigns(o: ListOpts = {}): Promise<{ items: Campaign[]; total: number }> {
  const per = o.perPage ?? PER_PAGE, page = Math.max(1, o.page ?? 1);
  if (FIXTURES) {
    const q = (o.q ?? "").toLowerCase();
    const want = o.status ?? (o.completed ? "all" : "open");
    let items = fxCampaigns.filter((c) => (want === "all" ? true : want === "completed" ? c.status === "completed" : c.status === "live") && (!o.cause || c.cause === o.cause) && (!o.department || c.department === o.department) && (!o.verified || c.tier !== "none") && (!o.urgent || c.urgent) && (!q || c.title.toLowerCase().includes(q)));
    if (o.owner) items = items.filter((c) => c.owner_id === o.owner);
    return { items: items.slice((page - 1) * per, page * per), total: items.length };
  }
  const sb = await db();
  if (!sb) return { items: [], total: 0 };
  let q = sb.from("campaigns").select(`*, ${OWNER}`, { count: "exact" });
  const want = o.status ?? (o.completed ? "all" : "open");
  q = want === "all" ? q.in("status", ["live", "completed"]) : want === "completed" ? q.eq("status", "completed") : q.eq("status", "live");
  if (o.cause) q = q.eq("cause", o.cause);
  if (o.department) q = q.eq("department", o.department);
  if (o.verified) q = q.neq("tier", "none");
  if (o.urgent) q = q.eq("urgent", true);
  if (o.emergency) q = q.eq("emergency", true);
  if (o.featured) q = q.eq("featured", true);
  if (o.owner) q = q.eq("owner_id", o.owner);
  const term = cleanSearch(o.q ?? "");
  if (term) q = q.or(["title", "story", "commune", "department", "beneficiary_name"].map((c) => `${c}.ilike.%${term}%`).join(","));
  if (o.sort === "updated") q = q.order("updated_at", { ascending: false });
  else if (o.sort === "urgent") q = q.order("urgent", { ascending: false }).order("published_at", { ascending: false });
  else q = q.order("published_at", { ascending: false, nullsFirst: false });
  const { data, count } = await q.range((page - 1) * per, page * per - 1);
  return { items: (data ?? []) as Campaign[], total: count ?? 0 };
}

export async function featuredCampaigns(): Promise<Campaign[]> {
  const featured = await listCampaigns({ featured: true, perPage: 3, sort: "urgent" });
  if (featured.items.length >= 3 || FIXTURES) return featured.items.slice(0, 3);
  const recent = await listCampaigns({ perPage: 6, sort: "newest" });
  const seen = new Set(featured.items.map((c) => c.id));
  return [...featured.items, ...recent.items.filter((c) => !seen.has(c.id))].slice(0, 3);
}

export type CampaignDetail = { campaign: Campaign; methods: SupportMethod[]; updates: Update[]; contributions: Contribution[]; vouches: Vouch[]; team: { user_id: string; profile: { display_name: string } | null }[] };
export const getCampaign = cache(async (slug: string): Promise<CampaignDetail | null> => {
  if (FIXTURES) {
    const campaign = [...fxCampaigns, ...fxMine].find((c) => c.slug === slug);
    if (!campaign) return null;
    return { campaign, methods: fxMethods, updates: campaign.id === "c1" ? fxUpdates : [], contributions: campaign.id === "c1" ? fxContributions : [], vouches: campaign.id === "c1" ? fxVouches : [], team: [] };
  }
  const sb = await db();
  if (!sb || !/^[a-z0-9-]{3,120}$/.test(slug)) return null;
  const { data } = await sb.from("campaigns").select(`*, ${OWNER}`).eq("slug", slug).maybeSingle();
  if (!data) return null;
  const campaign = data as Campaign;
  const [m, u, k, v, team] = await Promise.all([
    sb.from("support_methods").select("*").eq("campaign_id", data.id).order("position"),
    sb.from("campaign_updates").select("*, author:profiles!campaign_updates_author_id_fkey(display_name)").eq("campaign_id", data.id).eq("hidden", false).order("created_at", { ascending: false }).limit(30),
    sb.from("contributions").select(CONTRIB_COLS).eq("campaign_id", data.id).eq("hidden", false).order("created_at", { ascending: false }).limit(30),
    sb.from("vouches").select("*, voucher:profiles!vouches_voucher_id_fkey(display_name,org_verified)").eq("campaign_id", data.id).eq("status", "approved").order("created_at"),
    sb.from("campaign_members").select("user_id, profile:profiles!campaign_members_user_id_fkey(display_name)").eq("campaign_id", data.id),
  ]);
  return { campaign, methods: (m.data ?? []) as SupportMethod[], updates: (u.data ?? []) as Update[], contributions: (k.data ?? []) as Contribution[], vouches: (v.data ?? []) as Vouch[], team: (team.data ?? []) as unknown as CampaignDetail["team"] };
});

export async function getViewerState(campaignId: string, viewerId: string) {
  if (FIXTURES) return { bookmarked: false, remind: false, vouched: false };
  const sb = await db();
  if (!sb) return { bookmarked: false, remind: false, vouched: false };
  const [b, v] = await Promise.all([
    sb.from("bookmarks").select("remind").eq("campaign_id", campaignId).eq("user_id", viewerId).maybeSingle(),
    sb.from("vouches").select("id").eq("campaign_id", campaignId).eq("voucher_id", viewerId).maybeSingle(),
  ]);
  return { bookmarked: Boolean(b.data), remind: Boolean(b.data?.remind), vouched: Boolean(v.data) };
}

export async function myCampaigns(viewerId: string): Promise<Campaign[]> {
  if (FIXTURES) return fxMine;
  const sb = await db();
  if (!sb) return [];
  const { data } = await sb.from("campaigns").select("*").eq("owner_id", viewerId).order("updated_at", { ascending: false });
  const { data: member } = await sb.from("campaign_members").select("campaign:campaigns(*)").eq("user_id", viewerId);
  const teamOf = ((member ?? []) as unknown as { campaign: Campaign | null }[]).map((r) => r.campaign).filter((c): c is Campaign => Boolean(c));
  return withProgress([...((data ?? []) as Campaign[]), ...teamOf]);
}

export async function myBookmarks(viewerId: string): Promise<(Campaign & { remind: boolean })[]> {
  if (FIXTURES) return fxCampaigns.slice(1, 3).map((c) => ({ ...c, remind: false }));
  const sb = await db();
  if (!sb) return [];
  const { data } = await sb.from("bookmarks").select(`remind, campaign:campaigns(*, ${OWNER})`).eq("user_id", viewerId).order("created_at", { ascending: false });
  const rows = ((data ?? []) as unknown as { remind: boolean; campaign: Campaign | null }[]).filter((r) => r.campaign);
  const items = await withProgress(rows.map((r) => r.campaign as Campaign));
  return items.map((c, i) => ({ ...c, remind: rows[i].remind }));
}

export async function myNotifications(viewerId: string): Promise<Notification[]> {
  if (FIXTURES) return fxNotifications;
  const sb = await db();
  if (!sb) return [];
  const { data } = await sb.from("notifications").select("*").eq("user_id", viewerId).order("created_at", { ascending: false }).limit(40);
  return (data ?? []) as Notification[];
}

export async function unreadCount(viewerId: string) {
  if (FIXTURES) return 1;
  const sb = await db();
  if (!sb) return 0;
  const { count } = await sb.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", viewerId).is("read_at", null);
  return count ?? 0;
}

export type ManageData = { campaign: Campaign; priv: CampaignPrivate | null; methods: SupportMethod[]; updates: Update[]; team: { user_id: string; profile: { display_name: string } | null }[] };
export async function getManaged(id: string): Promise<ManageData | null> {
  if (FIXTURES) {
    const campaign = fxMine.find((c) => c.id === id) ?? fxMine[0];
    return { campaign, priv: fxPrivate, methods: fxMethods, updates: fxUpdates, team: [] };
  }
  const sb = await db();
  if (!sb || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await sb.from("campaigns").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const [p, m, u, team] = await Promise.all([
    sb.from("campaign_private").select("*").eq("campaign_id", id).maybeSingle(),
    sb.from("support_methods").select("*").eq("campaign_id", id).order("position"),
    sb.from("campaign_updates").select("*").eq("campaign_id", id).order("created_at", { ascending: false }),
    sb.from("campaign_members").select("user_id, profile:profiles!campaign_members_user_id_fkey(display_name)").eq("campaign_id", id),
  ]);
  return { campaign: data as Campaign, priv: (p.data ?? null) as CampaignPrivate | null, methods: (m.data ?? []) as SupportMethod[], updates: (u.data ?? []) as Update[], team: (team.data ?? []) as unknown as ManageData["team"] };
}

export async function getProfile(id: string): Promise<Profile | null> {
  if (FIXTURES) return (await import("./fixtures")).fxProfile;
  const sb = await db();
  if (!sb || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await sb.from("profiles").select("*").eq("id", id).maybeSingle();
  return (data ?? null) as Profile | null;
}

export type Stats = { live: number; completed: number; reviewed: number; declined: number; verified: number; reports_handled: number; supporters: number; reported_htg: number; reported_usd: number };
export const getStats = cache(async (): Promise<Stats> => {
  const zero: Stats = { live: 0, completed: 0, reviewed: 0, declined: 0, verified: 0, reports_handled: 0, supporters: 0, reported_htg: 0, reported_usd: 0 };
  if (FIXTURES) return { live: 5, completed: 1, reviewed: 9, declined: 2, verified: 5, reports_handled: 3, supporters: 98, reported_htg: 293200, reported_usd: 1850 };
  const sb = await db();
  if (!sb) return zero;
  const { data } = await sb.rpc("public_stats");
  return { ...zero, ...(data ?? {}) };
});

export async function getChange(campaignId: string): Promise<CampaignChange | null> {
  if (FIXTURES) return null;
  const sb = await db();
  if (!sb) return null;
  const { data } = await sb.from("campaign_changes").select("*").eq("campaign_id", campaignId).maybeSingle();
  return (data ?? null) as CampaignChange | null;
}
export async function myChanges(viewerId: string): Promise<CampaignChange[]> {
  if (FIXTURES) return [];
  const sb = await db();
  if (!sb) return [];
  const { data } = await sb.from("campaign_changes").select("*").eq("author_id", viewerId);
  return (data ?? []) as CampaignChange[];
}
export async function ownerSince(id: string) {
  if (FIXTURES) return "2026-09-02T12:00:00Z";
  const sb = await db();
  if (!sb) return null;
  const { data } = await sb.from("profiles").select("created_at").eq("id", id).maybeSingle();
  return (data?.created_at as string | undefined) ?? null;
}
export async function reviewNotes(ids: string[]): Promise<Record<string, string>> {
  if (FIXTURES) return { c7: fxPrivate.review_note ?? "" };
  const sb = await db();
  if (!sb || !ids.length) return {};
  const { data } = await sb.from("campaign_private").select("campaign_id,review_note").in("campaign_id", ids);
  return Object.fromEntries((data ?? []).filter((r) => r.review_note).map((r) => [r.campaign_id, r.review_note as string]));
}
