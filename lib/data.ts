import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServerClient } from "./supabase/server";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  supabaseEnabled,
} from "./supabase/config";
import { demoCampaigns } from "./demo";
import type { Campaign, CampaignContent } from "./domain";
export const preview = !supabaseEnabled;
export async function publicCampaigns(
  filters: {
    q?: string;
    category?: string;
    country?: string;
    region?: string;
    page?: number;
  } = {},
) {
  const page = Math.max(1, Math.min(100, filters.page ?? 1));
  const size = 6;
  if (preview) {
    const all = demoCampaigns.filter((c) => {
      const d = c.public_content;
      return (
        (!filters.q ||
          `${d.title} ${d.story} ${d.organizer_name}`
            .toLowerCase()
            .includes(filters.q.toLowerCase())) &&
        (!filters.category || d.category === filters.category) &&
        (!filters.country ||
          d.country.toLowerCase().includes(filters.country.toLowerCase())) &&
        (!filters.region ||
          d.region.toLowerCase().includes(filters.region.toLowerCase()))
      );
    });
    return {
      items: all.slice(0, page * size),
      hasMore: all.length > page * size,
      count: all.length,
    };
  }
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  let query = db
    .from("campaigns")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .order("id")
    .range(0, page * size - 1);
  if (filters.q)
    query = query.textSearch("search_document", filters.q, {
      type: "websearch",
      config: "simple",
    });
  if (filters.category)
    query = query.eq("public_content->>category", filters.category);
  if (filters.country)
    query = query.ilike(
      "public_content->>country",
      `%${filters.country.replace(/[%_]/g, "")}%`,
    );
  if (filters.region)
    query = query.ilike(
      "public_content->>region",
      `%${filters.region.replace(/[%_]/g, "")}%`,
    );
  const { data, error, count } = await query;
  if (error) throw new Error("Campaigns could not be loaded.");
  return {
    items: data as Campaign[],
    hasMore: (count ?? 0) > page * size,
    count: count ?? 0,
  };
}
export async function publicCampaign(id: string) {
  if (preview) return demoCampaigns.find((c) => c.id === id) ?? null;
  if (!/^[a-f\d-]{36}$/i.test(id)) return null;
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const { data, error } = await db
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error("Campaign unavailable.");
  return data as Campaign | null;
}
export async function currentUser() {
  const db = await getServerClient();
  if (!db) return null;
  const {
    data: { user },
  } = await db.auth.getUser();
  return user;
}
export async function isAdmin() {
  const db = await getServerClient();
  if (!db) return false;
  const { data, error } = await db.rpc("is_fivonine_admin");
  return !error && data === true;
}
export async function ownCampaigns() {
  const db = await getServerClient();
  const user = await currentUser();
  if (!db || !user) return [];
  const { data, error } = await db
    .from("campaigns")
    .select("*,campaign_revisions(id,content,status,review_note,created_at)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load your campaigns.");
  return data as (Campaign & {
    campaign_revisions: {
      id: string;
      content: CampaignContent;
      status: string;
      review_note: string | null;
      created_at: string;
    }[];
  })[];
}
