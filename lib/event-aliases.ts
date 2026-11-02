import type { HistEvent } from "./types";

/** Explicit equivalences only: neighboring stages of a crisis remain separate events. */
export const eventAliases: Record<string, string> = {
  "womens-world-cup-2023": "haiti-women-first-world-cup-2023",
  "mss-kenya-2024": "haiti-2024-kenyan-police-first-arrival",
  "unsc-mss-2023": "haiti-2023-un-mss-resolution-2699",
  "un-mss-authorization-2023": "haiti-2023-un-mss-resolution-2699",
  "henry-resigns-2024": "haiti-2024-transitional-presidential-council-installed",
  "transitional-presidential-council-installed-2024": "haiti-2024-transitional-presidential-council-installed",
  "haiti-gang-suppression-force-2025": "haiti-2025-un-gang-suppression-force-resolution",
  "un-gang-suppression-force-2025": "haiti-2025-un-gang-suppression-force-resolution",
  "haiti-transition-council-mandate-ends-2026": "haiti-2026-cpt-mandate-ends",
  "tpc-mandate-ends-2026": "haiti-2026-cpt-mandate-ends",
  "gsf-mandate-extended-2026": "haiti-2026-gsf-mandate-extended-september",
  "gsf-mandate-extended-september-2026": "haiti-2026-gsf-mandate-extended-september",
  "haiti-election-postponed-2026": "haiti-2026-october-election-calendar-postponed",
  "haiti-elections-postponed-october-2026": "haiti-2026-october-election-calendar-postponed",
  "cholera-resurgence-haiti-2022": "haiti-2022-cholera-resurgence-october",
  "haiti-2022-research-02-july-fighting-in-cit-soleil-causes": "haiti-2022-cite-soleil-gang-violence",
  "haiti-2022-research-07-security-council-establishes-target": "haiti-2022-un-sanctions-resolution-2653",
  "research-2023-03-the-bwa-kale-vigilante-movement-emerg": "haiti-2023-bwa-kale-movement",
  "research-2024-02-attacks-on-two-major-prisons-lead": "haiti-2024-prison-breaks-gang-offensive"
};
export const canonicalEventSlug = (slug: string) => eventAliases[slug] ?? slug;

/** Consolidate sources and graph edges, preserving the canonical record's account. */
export function consolidateEvents(events: HistEvent[]): HistEvent[] {
  const result = new Map<string, HistEvent>();
  const unique = (values: string[]) => [...new Set(values)];
  for (const event of events) {
    const slug = canonicalEventSlug(event.slug);
    const previous = result.get(slug);
    const preferred = !previous || event.slug === slug ? event : previous;
    const other = preferred === event ? previous : event;
    result.set(slug, {
      ...preferred, slug,
      sources: [...new Map([...(preferred.sources ?? []), ...(other?.sources ?? [])].map(s => [s.url ?? s.title, s])).values()],
      categories: unique([...preferred.categories, ...(other?.categories ?? [])]),
      countries: unique([...(preferred.countries ?? []), ...(other?.countries ?? [])]),
      highlight: preferred.highlight || other?.highlight,
      people: unique([...(preferred.people ?? []), ...(other?.people ?? [])]),
      records: unique([...(preferred.records ?? []), ...(other?.records ?? [])]),
      related: unique([...(preferred.related ?? []), ...(other?.related ?? [])].map(canonicalEventSlug)).filter(s => s !== slug),
    });
  }
  return [...result.values()];
}
