import type { MetadataRoute } from "next";
import { SITE_URL, supabaseEnabled } from "@/lib/supabase/config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.PUBLIC_LAUNCH === "true" && supabaseEnabled
        ? {
            userAgent: "*",
            allow: "/",
            disallow: [
              "/*/admin",
              "/*/dashboard",
              "/*/login",
              "/*/report",
              "/api/",
            ],
          }
        : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
