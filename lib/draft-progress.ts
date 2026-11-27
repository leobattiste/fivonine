import type { Campaign } from "./types";
/** How far a draft has got, worked out from what is already filled in. Matches the create form's order. */
export const DRAFT_STEPS = 5;
export function draftStep(c: Pick<Campaign, "title" | "story" | "cause" | "country_code" | "department" | "commune" | "cover_path">, hasMethods: boolean): number {
  const plain = (c.story ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const done = [
    Boolean(c.cause && (c.department || c.commune || c.country_code)),
    c.title.trim().length >= 4 && plain.length >= 40,
    Boolean(c.cover_path && !c.cover_path.startsWith("pexels:")),
    hasMethods,
  ];
  const first = done.indexOf(false);
  return first === -1 ? DRAFT_STEPS : first + 1;
}
