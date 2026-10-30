// The three geographic dimensions every period must document.
export type Dimension = "inside" | "abroad" | "foreign";

// Editorial status — the platform must distinguish fact from interpretation.
export type EvidenceStatus = "documented" | "interpretation" | "disputed" | "investigative";

export type DatePrecision = "day" | "month" | "year" | "circa";

export interface Category {
  slug: string;
  name: string;
  short: string;
}

export interface Period {
  slug: string; // "1920s" or "saint-domingue"
  kind: "era" | "decade";
  label: string; // "The 1920s"
  start: number;
  end: number;
  title: string; // one-line headline for the period
  overview: string;
  legacy?: string;
  researchNote?: string; // transparent note when coverage is thin
  essay?: EssayBlock[];
  biblio?: string[]; // further reading, shown only at the bottom of the page
  notes?: Partial<Record<string, string>>; // short note per subject (area slug); "next" leads into the following decade
}

/** One block of a decade essay. Years in `year` headings become anchors linked from the timeline. */
export type EssayBlock =
  | { type: "year"; year: string; title: string }
  | { type: "section"; n?: string; title: string }
  | { type: "sub"; title: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; label: string; text: string }
  | { type: "table"; head: [string, string]; rows: [string, string][]; caption?: string }
  | { type: "people"; items: { name: string; slug?: string; text: string }[] }
  | { type: "biblio"; items: string[] }
  | { type: "img"; src: string; alt: string; caption: string; credit: string; license: string; source: string };

export interface Source {
  title: string;
  url?: string;
}

export interface HistEvent {
  slug: string;
  title: string;
  date: string; // ISO "1825-04-17" or "1928" for year precision
  precision: DatePrecision;
  dimension: Dimension;
  categories: string[];
  location: string;
  countries?: string[]; // international relationships, e.g. ["France"]
  summary: string;
  context?: string;
  causes?: string;
  consequences?: string;
  status: EvidenceStatus;
  highlight?: boolean; // a defining moment of its period
  people?: string[]; // person slugs
  related?: string[]; // event slugs (graph edges)
  sources: Source[];
}

export interface Person {
  slug: string;
  name: string;
  born?: string;
  died?: string;
  roles: string[];
  bio: string;
}

export interface Content {
  categories: Category[];
  periods: Period[];
  events: HistEvent[];
  people: Person[];
}
