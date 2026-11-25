import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/constants";
import { locales } from "@/lib/i18n";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "@/lib/supabase/config";
import { canIndexPublicSite } from "@/lib/launch-readiness";
import { checked } from "@/lib/data-errors";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["", "/explore", "/how-it-works", "/about", "/resources", "/safety", "/guidelines", "/terms", "/privacy", "/help", "/contact", "/transparency"];
  const out: MetadataRoute.Sitemap = locales.flatMap((l) => paths.map((p) => ({ url: `${SITE_URL}/${l}${p}` })));
  if (supabaseEnabled && canIndexPublicSite()) {
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
    const { data } = checked(await sb.from("campaigns").select("slug,updated_at,language").in("status", ["live", "completed"]).order("published_at", { ascending: false }).limit(2000), "sitemap");
    for (const c of data ?? []) for (const l of locales) out.push({ url: `${SITE_URL}/${l}/campaigns/${c.slug}`, lastModified: c.updated_at });
  }
  return out;
}
