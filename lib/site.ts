export const SITE = {
  name: "Fivonine",
  tagline: "Haiti through the decades",
  description:
    "A connected history of Haiti and Haitians. Every decade, three ways: what happened inside Haiti, what Haitians did abroad, and what the world decided that changed Haiti.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

export const DIMENSIONS = {
  inside: { label: "Inside Haiti", labelFr: "En Haïti", short: "Inside Haiti", color: "#0E8A6A" },
  abroad: { label: "Haitians abroad", labelFr: "Haïtiens à l’étranger", short: "Abroad", color: "#C2650A" },
  foreign: { label: "The world acting on Haiti", labelFr: "Le monde face à Haïti", short: "World on Haiti", color: "#4655D6" },
} as const;

export const STATUS_LABEL = {
  documented: "Documented",
  interpretation: "Interpretation",
  disputed: "Figures disputed",
  investigative: "Under investigation",
} as const;

/** What readers can send through the Contribute page. */
export const CONTRIBUTION_KINDS = [
  { value: "correction", label: "A correction", labelFr: "Une correction", hintFr: "Quelque chose de faux ou d’incomplet sur Fivonine.", hint: "Something on Fivonine that's wrong or incomplete." },
  { value: "moment", label: "A moment we're missing", labelFr: "Un moment qui manque", hintFr: "Un événement, avec sa date et la source où vous l’avez appris.", hint: "An event, with its date and where you learned about it." },
  { value: "figure", label: "A person we're missing", labelFr: "Une personne qui manque", hintFr: "Qui elle était et pourquoi elle compte.", hint: "Who they were and why they matter." },
  { value: "source", label: "A source or document", labelFr: "Une source ou un document", hintFr: "Un livre, des archives, un article, une photo ou un enregistrement.", hint: "A book, archive, article, photo or recording." },
  { value: "story", label: "A family story", labelFr: "Une histoire de famille", hintFr: "Comment l’histoire a touché votre famille, en Haïti ou à l’étranger.", hint: "How history touched your family, in Haiti or abroad." },
  { value: "idea", label: "Feedback or an idea", labelFr: "Un avis ou une idée", hintFr: "Ce qui rendrait Fivonine meilleur pour vous.", hint: "What would make Fivonine better for you." },
] as const;
