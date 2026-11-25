import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { canIndexPublicSite } from "@/lib/launch-readiness";
export default function robots(): MetadataRoute.Robots {
  if (!canIndexPublicSite()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/*/admin", "/*/dashboard", "/*/login", "/*/create", "/api/"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
