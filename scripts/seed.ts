/**
 * Pushes lib/content.ts into Supabase. Safe to re-run (upserts).
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import { content } from "../lib/content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

async function up(table: string, rows: object[], onConflict?: string) {
  if (!rows.length) return;
  const { error } = await db.from(table).upsert(rows, onConflict ? { onConflict } : undefined);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table} (${rows.length})`);
}

async function main() {
  const { categories, periods, events, people, threads } = content;

  await up("categories", categories.map((c, i) => ({ ...c, sort: i })));
  await up("periods", periods.map((p) => ({
    slug: p.slug, kind: p.kind, label: p.label, start_year: p.start, end_year: p.end,
    title: p.title, overview: p.overview, legacy: p.legacy ?? null, research_note: p.researchNote ?? null,
  })));
  await up("people", people);
  await up("events", events.map((e) => ({
    slug: e.slug, title: e.title, date_text: e.date, precision: e.precision, dimension: e.dimension,
    location: e.location, countries: e.countries ?? [], summary: e.summary, context: e.context ?? null,
    causes: e.causes ?? null, consequences: e.consequences ?? null, status: e.status,
  })));
  await up("event_categories", events.flatMap((e) => e.categories.map((c) => ({ event_slug: e.slug, category_slug: c }))), "event_slug,category_slug");
  await up("event_people", events.flatMap((e) => (e.people ?? []).map((p) => ({ event_slug: e.slug, person_slug: p }))), "event_slug,person_slug");
  await up("event_links", events.flatMap((e) => (e.related ?? []).map((r) => ({ from_slug: e.slug, to_slug: r }))), "from_slug,to_slug");

  // Sources have no natural key: replace them per event.
  await db.from("sources").delete().in("event_slug", events.map((e) => e.slug));
  await up("sources", events.flatMap((e) => e.sources.map((s, i) => ({ event_slug: e.slug, title: s.title, url: s.url ?? null, sort: i }))));

  await up("threads", threads.map(({ steps, ...t }) => t));
  await up("thread_steps", threads.flatMap((t) => t.steps.map((s, i) => ({ thread_slug: t.slug, position: i, event_slug: s.event, note: s.note }))), "thread_slug,position");
  console.log("Seed complete.");
}

main().catch((e) => { console.error(e); process.exit(1); });
