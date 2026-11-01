import "server-only";
import { cache } from "react";
import { content as bundled } from "./content";
import { getServiceClient, hasSupabase } from "./supabase";
import type { Content, HistEvent, Period } from "./types";
import { historicalRecords, haitianIndependenceEvent } from "./historical-records";
import { archivalBiographies } from "./archival-biographies";

/**
 * Single read path for the whole site. With Supabase configured, content comes from
 * the database (rows are assembled into the same shape as lib/content.ts). Without it,
 * the bundled content is used, so the site works on first deploy.
 */
const localContent: Content = {
  ...bundled,
  events: [
    ...bundled.events.map((e) => ({ ...e, records: [...new Set([...(e.records ?? []), ...historicalRecords.filter((r) => r.eventSlugs?.includes(e.slug)).map((r) => r.slug)])] })),
    haitianIndependenceEvent,
  ],
  records: historicalRecords,
};

export const getContent = cache(async (): Promise<Content> => {
  if (!hasSupabase()) return localContent;
  try {
    const db = getServiceClient();
    const [cats, pers, evs, evCats, evPeople, links, srcs, people] = await Promise.all([
      db.from("categories").select("*").order("sort"),
      db.from("periods").select("*").order("start_year"),
      db.from("events").select("*").eq("published", true),
      db.from("event_categories").select("*"),
      db.from("event_people").select("*"),
      db.from("event_links").select("*"),
      db.from("sources").select("*").order("sort"),
      db.from("people").select("*"),
    ]);
    const err = [cats, pers, evs, evCats, evPeople, links, srcs, people].find((r) => r.error);
    if (err?.error) throw err.error;

    const group = <T extends Record<string, any>>(rows: T[] | null, key: string) => {
      const m = new Map<string, T[]>();
      for (const r of rows ?? []) m.set(r[key], [...(m.get(r[key]) ?? []), r]);
      return m;
    };
    const gc = group(evCats.data, "event_slug");
    const gp = group(evPeople.data, "event_slug");
    const gl = group(links.data, "from_slug");
    const gs = group(srcs.data, "event_slug");

    const localEvents = new Map(localContent.events.map((e) => [e.slug, e]));
    const localPeople = new Map(localContent.people.map((p) => [p.slug, p]));
    const localPeriods = new Map(localContent.periods.map((p) => [p.slug, p]));
    const localCategories = new Map(localContent.categories.map((c) => [c.slug, c]));
    const databasePeriodSlugs = new Set((pers.data ?? []).map((p) => p.slug));
    const databaseCategorySlugs = new Set((cats.data ?? []).map((c) => c.slug));
    const databaseEventSlugs = new Set((evs.data ?? []).map((e) => e.slug));
    const databasePersonSlugs = new Set((people.data ?? []).map((p) => p.slug));

    const result: Content = {
      categories: [
        ...(cats.data ?? []).map((c) => ({
          ...localCategories.get(c.slug),
          slug: c.slug,
          name: c.name ?? localCategories.get(c.slug)?.name ?? c.slug,
          short: c.short ?? localCategories.get(c.slug)?.short ?? c.slug,
        })),
        ...localContent.categories.filter((c) => !databaseCategorySlugs.has(c.slug)),
      ],
      periods: [
        ...(pers.data ?? []).map((p) => ({
          ...localPeriods.get(p.slug),
          slug: p.slug, kind: p.kind, label: p.label, start: p.start_year, end: p.end_year,
          title: p.title ?? localPeriods.get(p.slug)?.title ?? p.label,
          overview: p.overview ?? localPeriods.get(p.slug)?.overview ?? "",
          legacy: p.legacy ?? localPeriods.get(p.slug)?.legacy,
          researchNote: p.research_note ?? localPeriods.get(p.slug)?.researchNote,
          notes: p.notes ?? localPeriods.get(p.slug)?.notes,
          essay: p.essay ?? localPeriods.get(p.slug)?.essay,
          media: localPeriods.get(p.slug)?.media,
          biblio: p.biblio ?? localPeriods.get(p.slug)?.biblio,
        })),
        ...localContent.periods.filter((p) => !databasePeriodSlugs.has(p.slug)),
      ],
      events: [...(evs.data ?? []).map((e) => ({
        ...localEvents.get(e.slug),
        slug: e.slug, title: e.title, date: e.date_text, precision: e.precision, dimension: e.dimension,
        location: e.location, countries: e.countries ?? localEvents.get(e.slug)?.countries ?? [], summary: e.summary,
        body: e.body ?? localEvents.get(e.slug)?.body,
        fr: e.fr ?? localEvents.get(e.slug)?.fr,
        highlight: e.highlight ?? localEvents.get(e.slug)?.highlight,
        context: e.context ?? localEvents.get(e.slug)?.context,
        causes: e.causes ?? localEvents.get(e.slug)?.causes, consequences: e.consequences ?? localEvents.get(e.slug)?.consequences, status: e.status,
        categories: (gc.get(e.slug) ?? []).length ? (gc.get(e.slug) ?? []).map((r) => r.category_slug) : localEvents.get(e.slug)?.categories ?? [],
        people: (gp.get(e.slug) ?? []).length ? (gp.get(e.slug) ?? []).map((r) => r.person_slug) : localEvents.get(e.slug)?.people ?? [],
        related: (gl.get(e.slug) ?? []).length ? (gl.get(e.slug) ?? []).map((r) => r.to_slug) : localEvents.get(e.slug)?.related ?? [],
        records: localEvents.get(e.slug)?.records,
        sources: (gs.get(e.slug) ?? []).length ? (gs.get(e.slug) ?? []).map((r) => ({ title: r.title, url: r.url ?? undefined })) : localEvents.get(e.slug)?.sources ?? [],
      })), ...localContent.events.filter((x) => !databaseEventSlugs.has(x.slug))],
      records: historicalRecords,
      people: [...(people.data ?? []).map((p) => ({
        ...localPeople.get(p.slug),
        slug: p.slug, name: p.name, born: p.born ?? undefined, died: p.died ?? undefined, roles: p.roles ?? [], bio: localPeople.get(p.slug)?.bio ?? archivalBiographies[p.slug]?.en ?? p.bio,
        fr: localPeople.get(p.slug)?.fr ?? (archivalBiographies[p.slug] ? { bio: archivalBiographies[p.slug].fr } : undefined),
      })), ...localContent.people.filter((p) => !databasePersonSlugs.has(p.slug))],
    };
    // An empty database (not yet seeded) falls back to bundled content.
    return result.events.length ? result : localContent;
  } catch (e) {
    console.error("[fivonine] Supabase read failed, using bundled content", e);
    return localContent;
  }
});

// ——— Helpers ———

export const yearOf = (e: HistEvent) => parseInt(e.date.slice(0, 4), 10);

export function periodFor(e: HistEvent, periods: Period[]) {
  const y = yearOf(e);
  // Prefer the decade over the era when both overlap.
  return (
    periods.find((p) => p.kind === "decade" && y >= p.start && y <= p.end) ??
    periods.find((p) => y >= p.start && y <= p.end)
  );
}

export function sortEvents(list: HistEvent[]) {
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

export function formatDate(e: HistEvent) {
  const [y, m, d] = e.date.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  if (e.precision === "year" || !m) return String(y);
  if (e.precision === "month" || !d) return `${months[m - 1]} ${y}`;
  const s = `${d} ${months[m - 1]} ${y}`;
  return e.precision === "circa" ? `c. ${s}` : s;
}

export function formatDateFr(e: HistEvent) {
  const [y, m, d] = e.date.split("-").map(Number);
  const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
  if (e.precision === "year" || !m) return e.precision === "circa" ? `vers ${y}` : String(y);
  if (e.precision === "month" || !d) return `${months[m - 1]} ${y}`;
  const s = `${d === 1 ? "1er" : d} ${months[m - 1]} ${y}`;
  return e.precision === "circa" ? `vers ${s}` : s;
}

export function eventsInPeriod(c: Content, p: Period) {
  return sortEvents(c.events.filter((e) => periodFor(e, c.periods)?.slug === p.slug));
}

/** Events that happened on this month/day in any year — "On this day". */
export function onThisDay(c: Content, now = new Date()) {
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const exact = c.events.filter((e) => e.precision === "day" && e.date.slice(5) === `${mm}-${dd}`);
  if (exact.length) return { mode: "day" as const, events: exact };
  const month = c.events.filter((e) => e.date.slice(5, 7) === mm && e.precision !== "year");
  return { mode: "month" as const, events: sortEvents(month) };
}

/** Bidirectional graph neighbours: events this one links to, and events linking to it. */
export function connectedEvents(c: Content, e: HistEvent) {
  const out = new Set(e.related ?? []);
  for (const other of c.events) if (other.related?.includes(e.slug)) out.add(other.slug);
  return sortEvents(c.events.filter((x) => out.has(x.slug) && x.slug !== e.slug));
}
