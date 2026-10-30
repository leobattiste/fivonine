import type { Category, HistEvent } from "./types";

/** The 10 permanent sections of every decade. `items` lists what each section covers. */
export const SECTIONS: (Category & { items: string[] })[] = [
  { slug: "politics", nameFr: "Politique, gouvernement et affaires nationales", shortFr: "Politique et gouvernement", name: "Politics, Government & National Affairs", short: "Politics & Government",
    items: ["Presidents and political leaders", "Government and administrations", "Elections, laws and constitutions", "Political movements and protests", "Wars, conflicts and national security", "Diplomacy and foreign relations"] },
  { slug: "economy", nameFr: "Économie, commerce et développement", shortFr: "Économie et commerce", name: "Economy, Business & Development", short: "Economy & Business",
    items: ["Economy, finance and national debt", "Banking, currency and trade", "Business and entrepreneurship", "Agriculture and farming", "Industry and manufacturing", "Infrastructure, transportation and technology"] },
  { slug: "society", nameFr: "Population, société et vie quotidienne", shortFr: "Population et société", name: "People, Society & Everyday Life", short: "People & Society",
    items: ["Population and demographics", "Family and community life", "Social classes and living conditions", "Women, men, children and youth", "Workers and labor movements", "Migration within Haiti", "Social movements and civil rights"] },
  { slug: "culture", nameFr: "Culture, religion et traditions", shortFr: "Culture et traditions", name: "Culture, Religion & Traditions", short: "Culture & Traditions",
    items: ["Haitian identity and heritage", "Vodou and spirituality", "Catholicism and Protestantism", "Food and culinary traditions", "Folklore and oral traditions", "Carnival, festivals and celebrations", "Clothing, dance and customs"] },
  { slug: "arts", nameFr: "Musique, arts et divertissement", shortFr: "Musique et arts", name: "Music, Arts & Entertainment", short: "Music & Arts",
    items: ["Konpa, rara, jazz, gospel and other music", "Musicians, singers, bands and producers", "Albums and recordings", "Painting, sculpture and visual arts", "Literature, poetry and theater", "Cinema, photography and entertainment", "Architecture and creative expression"] },
  { slug: "education", nameFr: "Éducation, sciences et santé", shortFr: "Éducation et santé", name: "Education, Science & Health", short: "Education & Health",
    items: ["Schools, universities and literacy", "Teachers, scholars and intellectuals", "Scientific research and discoveries", "Technology and innovation", "Hospitals, doctors and medicine", "Public health and epidemics"] },
  { slug: "sports", nameFr: "Sports et réalisations", shortFr: "Sports et réalisations", name: "Sports & Achievements", short: "Sports & Achievements",
    items: ["Football and other sports", "Haitian athletes and teams", "National and international competitions", "Records, awards and milestones", "Major individual achievements"] },
  { slug: "abroad", nameFr: "Les Haïtiens dans le monde", shortFr: "Haïtiens du monde", name: "Haitians Around the World", short: "Haitians Worldwide",
    items: ["Haitian diaspora and migration abroad", "Haitian communities and organizations", "Haitian artists, athletes and entrepreneurs abroad", "Political and intellectual contributions", "Haiti's influence on other countries", "Haitian participation in international movements"] },
  { slug: "world", nameFr: "Le monde et son impact sur Haïti", shortFr: "Monde et Haïti", name: "The World & Its Impact on Haiti", short: "World & Haiti",
    items: ["Foreign interventions and occupations", "International policies and decisions", "Foreign debt, treaties and agreements", "International trade and economic pressures", "Wars and conflicts affecting Haiti", "Foreign governments and international organizations", "International events that changed Haiti's direction"] },
  { slug: "environment", nameFr: "Environnement, géographie et phénomènes naturels", shortFr: "Environnement et géographie", name: "Environment, Geography & Natural Events", short: "Environment & Geography",
    items: ["Departments, cities and communities", "Mountains, rivers, forests and natural resources", "Hurricanes, earthquakes and floods", "Agriculture and environmental changes", "Conservation and environmental challenges", "Important places and heritage sites"] },
];

const DISASTER = /earthquake|hurricane|flood|storm|tsunami|jeanne|hazel|flora|matthew|cyclone/i;
const HEALTH = /cholera|smallpox|aids|epidemic|swine fever/i;

/**
 * Files a moment under the 10 sections. Written content uses finer tags; this maps them once, at load.
 * The old "major events" tag becomes a highlight flag rather than a section.
 */
export function toSections(e: HistEvent): HistEvent {
  const text = `${e.slug} ${e.title}`;
  const out: string[] = [];
  const add = (s: string) => { if (!out.includes(s)) out.push(s); };
  for (const c of e.categories) {
    switch (c) {
      case "politics": case "wars": add("politics"); break;
      case "economy": case "business": add("economy"); break;
      case "society": add(HEALTH.test(text) ? "education" : "society"); break;
      case "religion": case "culture": add("culture"); break;
      case "music": case "arts": add("arts"); break;
      case "education": add("education"); break;
      case "sports": add("sports"); break;
      case "contributions": add("abroad"); break;
      case "foreign-relations": add(e.dimension === "foreign" ? "world" : "politics"); break;
      case "major-events": if (DISASTER.test(text)) add("environment"); break;
      default: if (SECTIONS.some((s) => s.slug === c)) add(c);
    }
  }
  if (e.dimension === "abroad") add("abroad");
  if (e.dimension === "foreign") add("world");
  if (DISASTER.test(text)) add("environment");
  if (HEALTH.test(text)) add("education");
  if (!out.length) add("politics");
  return { ...e, categories: out, highlight: e.highlight ?? e.categories.includes("major-events") };
}

/** Merges per-subject decade notes written under the old tags into the 10 sections. */
export function notesToSections(notes?: Partial<Record<string, string>>) {
  if (!notes) return notes;
  const map: Record<string, string> = { wars: "politics", business: "economy", religion: "culture", music: "arts", "foreign-relations": "world", contributions: "abroad" };
  const out: Partial<Record<string, string>> = {};
  for (const [k, v] of Object.entries(notes)) {
    if (!v) continue;
    const key = map[k] ?? k;
    out[key] = out[key] ? `${out[key]} ${v}` : v;
  }
  return out;
}
