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
  answers?: Partial<Record<string, string>>; // keyed by question id (lib/questions.ts)
}

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

export interface ThreadStep {
  event: string; // event slug
  note: string; // why this step matters in the chain
}

export interface Thread {
  slug: string;
  title: string;
  dek: string;
  caveat: string;
  steps: ThreadStep[];
}

export interface Content {
  categories: Category[];
  periods: Period[];
  events: HistEvent[];
  people: Person[];
  threads: Thread[];
}
