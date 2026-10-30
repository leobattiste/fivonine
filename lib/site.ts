export const SITE = {
  name: "Fivonine",
  tagline: "Haiti through the decades",
  description:
    "A connected history of Haiti and Haitians. Every decade, three ways: what happened inside Haiti, what Haitians did abroad, and what the world decided that changed Haiti.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
};

export const DIMENSIONS = {
  inside: { label: "Inside Haiti", short: "Inside Haiti", color: "#7FE0C2" },
  abroad: { label: "Haitians abroad", short: "Abroad", color: "#F4C76A" },
  foreign: { label: "The world acting on Haiti", short: "World on Haiti", color: "#A9B5FF" },
} as const;

export const STATUS_LABEL = {
  documented: "Documented",
  interpretation: "Interpretation",
  disputed: "Figures disputed",
  investigative: "Under investigation",
} as const;
