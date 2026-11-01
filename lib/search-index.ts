import type { Content } from "./types";

/** Compact, multilingual, searchable archive records sent to the search interface. */
export type SearchKind = "event" | "figure" | "decade" | "subject" | "record";

export interface SearchRecord {
  id: string;
  kind: SearchKind;
  href: string;
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  detail?: string;
  detailFr?: string;
  terms: string;
  year?: number;
  month?: number;
  day?: number;
  period?: string;
  subjects?: string[];
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const monthNamesFr = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const subjectKeywords: Record<string, string> = {
  politics: "government presidents elections law constitution revolution guerre combat independence pouvoir politique",
  economy: "trade business finance agriculture industry commerce economie economie dette",
  society: "people families labor society rights population immigration migration societe",
  culture: "vodou religion food folklore cultural traditions culture",
  arts: "music musicians konpa compas rara rap painting literature cinema poetry books musique arts",
  education: "schools education medicine science health science sante universite",
  sports: "football soccer olympics athletes sport jeux sportifs",
  abroad: "diaspora haitians overseas exile migration etranger",
  world: "foreign intervention france united states international occupation etranger",
  environment: "earthquake hurricane geography cities disaster geography environnement climat",
};

export function buildSearchIndex(c: Content): SearchRecord[] {
  const result: SearchRecord[] = [];
  for (const category of c.categories) {
    result.push({
      id: "subject:" + category.slug,
      kind: "subject",
      href: "/subjects/" + category.slug,
      title: category.name,
      titleFr: category.nameFr,
      description: category.short,
      descriptionFr: category.shortFr,
      terms: [category.slug, subjectKeywords[category.slug] ?? ""].join(" "),
    });
  }
  for (const period of c.periods) {
    result.push({
      id: "decade:" + period.slug,
      kind: "decade",
      href: "/decades/" + period.slug,
      title: period.kind === "decade" ? period.start + "s" : period.label,
      titleFr: period.kind === "decade" ? period.start + "s" : period.fr?.label,
      description: period.title,
      descriptionFr: period.fr?.title,
      terms: [
        period.label, period.fr?.label, period.overview, period.fr?.overview,
        period.start, period.end, period.kind === "decade" ? "decade decade history" : "era history",
      ].filter(Boolean).join(" ").slice(0, 2000),
      year: period.start,
      period: period.slug,
    });
  }
  for (const person of c.people) {
    result.push({
      id: "figure:" + person.slug,
      kind: "figure",
      href: "/people/" + person.slug,
      title: person.name,
      description: person.bio,
      descriptionFr: person.fr?.bio,
      detail: person.roles.slice(0, 3).join(", "),
      detailFr: person.fr?.roles?.slice(0, 3).join(", "),
      terms: [person.roles.join(" "), person.fr?.roles?.join(" "), person.born, person.died, person.slug].filter(Boolean).join(" "),
    });
  }
  for (const record of c.records ?? []) {
    result.push({
      id: "record:" + record.slug,
      kind: "record",
      href: "/records/" + record.slug,
      title: record.title,
      titleFr: record.fr?.title,
      description: record.summary,
      descriptionFr: record.fr?.summary,
      detail: record.type,
      terms: [record.body?.slice(0, 1200), record.fr?.body?.slice(0, 1200), record.location, record.dates, record.type].filter(Boolean).join(" "),
    });
  }
  for (const event of c.events) {
    const match = event.date.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
    const year = match ? Number(match[1]) : undefined;
    const month = match?.[2] ? Number(match[2]) : undefined;
    const day = match?.[3] ? Number(match[3]) : undefined;
    const mn = month ? monthNames[month - 1] : undefined;
    const mnFr = month ? monthNamesFr[month - 1] : undefined;
    const dateText = [
      year != null ? String(year) : "", 
      month != null ? `${mn} ${year}` : "",
      month != null ? `${mnFr} ${year}` : "",
      month != null && day != null ? `${mn} ${day}` : "",
      month != null && day != null ? `${day} ${mn}` : "",
      month != null && day != null ? `${day} ${mnFr}` : "",
      month != null && day != null ? `${mnFr} ${day}` : "",
      month != null && day != null ? `${mn} ${day} ${year}` : "",
      month != null && day != null ? `${day} ${mnFr} ${year}` : "",
    ].join(" ");
    result.push({
      id: "event:" + event.slug,
      kind: "event",
      href: "/events/" + event.slug,
      title: event.title,
      titleFr: event.fr?.title,
      description: event.summary,
      descriptionFr: event.fr?.summary,
      detail: [event.location, year].filter(Boolean).join(" · "),
      detailFr: [event.fr?.location ?? event.location, year].filter(Boolean).join(" · "),
      terms: [
        event.slug.replace(/-/g, " "), event.body?.slice(0, 1600), event.fr?.body?.slice(0, 1600),
        event.context?.slice(0, 500), event.fr?.context?.slice(0, 500),
        event.categories.map((slug) => subjectKeywords[slug] ?? "").join(" "),
        event.countries?.join(" "), event.people?.map((slug) => c.people.find((p) => p.slug === slug)?.name).join(" "),
        event.location, event.fr?.location, dateText,
      ].filter(Boolean).join(" "),
      year,
      month,
      day,
      subjects: event.categories,
    });
  }
  return result;
}
