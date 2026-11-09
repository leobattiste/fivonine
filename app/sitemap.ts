import type { MetadataRoute } from "next";
import { locales, categoryKeys } from "@/lib/i18n";
import { guides } from "@/lib/platform-content";
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
      "/causes",
      "/resources",
      "/safety",
      "/pricing",
      ...categoryKeys.map((category) => `/causes/${category}`),
      ...guides[l].map((guide) => `/resources/${guide.slug}`),
    ].map((path) => ({ url: `${SITE_URL}/${l}${path}` })),
  );
}
