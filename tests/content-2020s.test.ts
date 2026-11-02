import assert from "node:assert/strict";
import { test } from "node:test";
import { content } from "../lib/content";
import { completion2020s } from "../lib/research-2020s-completion";
import { research2022 } from "../lib/research-2022";
import { research2023 } from "../lib/research-2023";
import { research2024 } from "../lib/research-2024";
import { research2025 } from "../lib/research-2025";
import { research2026 } from "../lib/research-2026";
import { canonicalEventSlug, consolidateEvents, eventAliases } from "../lib/event-aliases";
import { collectSources } from "../lib/sources-index";

const additions = [...completion2020s, ...research2022, ...research2023, ...research2024, ...research2025, ...research2026];
const bySlug = new Map(content.events.map(e => [e.slug, e]));

test("all researched additions reach the archive with bilingual text and indexed sources", () => {
  const sources = collectSources(content);
  for (const e of additions) {
    const slug = canonicalEventSlug(e.slug);
    assert.ok(bySlug.has(slug), e.slug);
    assert.ok(e.title && e.summary && e.body && e.fr?.title && e.fr.summary && e.fr.body, e.slug);
    assert.ok(e.date >= "2020" && e.date <= "2026-11-01", e.slug);
    assert.ok(e.sources.length, e.slug);
    for (const s of e.sources) {
      assert.equal(new URL(s.url!).protocol, "https:");
      assert.ok(sources.some(x => x.url === s.url && x.uses.some(u => u.href === `/events/${slug}`)), s.url);
    }
  }
  for (const e of completion2020s) {
    for (const related of e.related ?? []) assert.ok(bySlug.has(canonicalEventSlug(related)), related);
    for (const person of e.people ?? []) assert.ok(content.people.some(p => p.slug === person), person);
  }
});

test("aliases resolve to one canonical event without losing citations or graph links", () => {
  assert.equal(content.events.length, bySlug.size);
  for (const [alias, canonical] of Object.entries(eventAliases)) {
    assert.ok(bySlug.has(canonical), canonical);
    assert.ok(!bySlug.has(alias), alias);
  }
  const canonical = bySlug.get("haiti-2023-un-mss-resolution-2699")!;
  const alias = { ...canonical, slug: "unsc-mss-2023", title: "Older title", sources: [{ title: "Additional source", url: "https://example.org/report" }], related: ["mss-kenya-2024"] };
  for (const order of [[canonical, alias], [alias, canonical]]) {
    const [merged] = consolidateEvents(order);
    assert.equal(merged.title, canonical.title);
    assert.ok(merged.sources.some(s => s.url === "https://example.org/report"));
    assert.ok(merged.related?.includes("haiti-2024-kenyan-police-first-arrival"));
  }
  assert.ok(bySlug.has("haiti-women-first-world-cup-2023"));
  assert.ok(bySlug.has("research-2023-06-haiti-makes-its-first-appearance-at-t"));
});

test("every covered year has bilingual narrative and events, with no future history", () => {
  const p = content.periods.find(p => p.slug === "2020s")!;
  assert.match(p.researchNote!, /1 November 2026/);
  const years = p.essay!.filter(b => b.type === "year").map(b => b.year);
  assert.deepEqual(years, ["2020", "2021", "2022", "2023", "2024", "2025", "2026"]);
  for (const year of years) assert.ok(content.events.some(e => e.date.startsWith(year)));
  for (const e of content.events.filter(e => e.date >= "2020")) {
    assert.ok(e.fr?.title && e.fr.summary, e.slug);
    assert.ok(e.date <= "2026-11-01", e.slug);
  }
});
