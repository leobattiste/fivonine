import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { SITE_URL, supabaseEnabled } from "@/lib/supabase/config";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.PUBLIC_LAUNCH !== "true" || !supabaseEnabled) return [];
  return locales.flatMap((l) =>
    [
      "",
      "/explore",
      "/about",
      "/help",
      "/how-it-works",
      "/contact",
      "/legal",
    ].map((path) => ({ url: `${SITE_URL}/${l}${path}` })),
  );
}
