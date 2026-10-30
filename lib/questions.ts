import type { Dimension } from "./types";

/**
 * The ten questions every decade answers, in reading order.
 * `areas` decides which moments appear under each question; `dimensions`
 * pulls in moments by where they happened (e.g. anything involving Haitians abroad).
 */
export const QUESTIONS = [
  { id: "politics", nav: "Politics", q: "What was happening politically in Haiti?", areas: ["politics"] },
  { id: "economy", nav: "Economy", q: "What was happening economically?", areas: ["economy"] },
  { id: "society", nav: "Society", q: "What was happening socially?", areas: ["society"] },
  { id: "music", nav: "Music", q: "What music were Haitians listening to and creating?", areas: ["music"] },
  { id: "arts", nav: "Artists & writers", q: "Who were the important artists, writers, and intellectuals?", areas: ["arts"] },
  { id: "wars", nav: "Wars", q: "What wars or international conflicts involved Haitians?", areas: ["wars"] },
  { id: "diaspora", nav: "Diaspora", q: "What was happening in the Haitian diaspora?", areas: ["contributions"], dimensions: ["abroad"] as Dimension[] },
  { id: "foreign", nav: "The world & Haiti", q: "What were foreign governments or international institutions doing that affected Haiti?", areas: ["foreign-relations"], dimensions: ["foreign"] as Dimension[] },
  { id: "daily", nav: "Everyday life", q: "What was happening in education, religion, agriculture, business, and everyday life?", areas: ["education", "religion", "business", "sports"] },
  { id: "next", nav: "What came next", q: "What events would shape the next decade?", areas: [] },
] as const;

export type QuestionId = (typeof QUESTIONS)[number]["id"];
