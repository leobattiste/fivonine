export const SITE = {
  name: "Fivonine",
  tagline: "Haiti through the decades",
  description:
    "A connected history of Haiti and Haitians. Every decade, three ways: what happened inside Haiti, what Haitians did abroad, and what the world decided that changed Haiti.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

export const DIMENSIONS = {
  inside: { label: "Inside Haiti", short: "Inside Haiti", color: "#0E8A6A" },
  abroad: { label: "Haitians abroad", short: "Abroad", color: "#C2650A" },
  foreign: { label: "The world acting on Haiti", short: "World on Haiti", color: "#4655D6" },
} as const;

export const STATUS_LABEL = {
  documented: "Documented",
  interpretation: "Interpretation",
  disputed: "Figures disputed",
  investigative: "Under investigation",
} as const;

/** What readers can send through the Contribute page. */
export const CONTRIBUTION_KINDS = [
  { value: "correction", label: "A correction", hint: "Something on Fivonine that's wrong or incomplete." },
  { value: "moment", label: "A moment we're missing", hint: "An event, with its date and where you learned about it." },
  { value: "figure", label: "A person we're missing", hint: "Who they were and why they matter." },
  { value: "source", label: "A source or document", hint: "A book, archive, article, photo or recording." },
  { value: "story", label: "A family story", hint: "How history touched your family, in Haiti or abroad." },
  { value: "idea", label: "Feedback or an idea", hint: "What would make Fivonine better for you." },
] as const;
