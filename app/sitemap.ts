import type { MetadataRoute } from "next";
import { getContent } from "@/lib/data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u("/"), priority: 1 },
    { url: u("/decades"), priority: 0.9 },
    { url: u("/events"), priority: 0.9 },
    { url: u("/people"), priority: 0.8 },
    { url: u("/subjects"), priority: 0.8 },
    ...c.categories.map((x) => ({ url: u(`/subjects/${x.slug}`), priority: 0.7 })),
    { url: u("/threads"), priority: 0.8 },
    { url: u("/explore"), priority: 0.6 },
    ...c.periods.map((p) => ({ url: u(`/decades/${p.slug}`), priority: 0.9 })),
    ...c.events.map((e) => ({ url: u(`/events/${e.slug}`), priority: 0.7 })),
    ...c.people.map((p) => ({ url: u(`/people/${p.slug}`), priority: 0.6 })),
    ...c.threads.map((t) => ({ url: u(`/threads/${t.slug}`), priority: 0.8 })),
  ];
}
