import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
export default function robots(): MetadataRoute.Robots {
  if (process.env.PUBLIC_LAUNCH !== "true") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/*/admin", "/*/dashboard", "/*/login", "/*/create", "/api/"] }, sitemap: `${SITE_URL}/sitemap.xml` };
}
