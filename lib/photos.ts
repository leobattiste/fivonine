/**
 * Brand photography from Pexels (free to use under the Pexels license). Only places and hands: never people
 * presented as beneficiaries. Each entry links to its Pexels page for credit.
 */
export type Photo = { id: number; by: string | null; alt: { ht: string; fr: string; en: string }; w: number; h: number };
const p = (id: number, by: string | null, w: number, h: number, en: string, fr: string, ht: string): Photo => ({ id, by, w, h, alt: { en, fr, ht } });
export const PHOTOS = {
  jacmel: p(8742336, "Carl Jeudy", 3024, 4032, "Waves on the rocky coast at Jacmel, Haiti", "Vagues sur la côte rocheuse de Jacmel, Haïti", "Lanm lanmè sou kòt wòch Jakmèl, Ayiti"),
  coast: p(5045910, "Holger Wulschlaeger", 2515, 3596, "Thatched huts on stilts off the coast of Haiti", "Cases sur pilotis au large de la côte d'Haïti", "Ti kay sou pilotis bò lanmè ann Ayiti"),
  beach: p(4637298, null, 4000, 3000, "Aerial view of a beach in Haiti", "Vue aérienne d'une plage en Haïti", "Yon plaj ann Ayiti wè anwo"),
  hands: p(7322769, "cottonbro studio", 4000, 6000, "Hands joined together", "Des mains jointes", "Men ki mete ansanm"),
  huddle: p(8556402, "Edmond Dantès", 6000, 4000, "A group joining hands outdoors", "Un groupe qui joint les mains dehors", "Yon gwoup ki mete men ansanm deyò"),
  care: p(6646815, null, 6000, 4000, "A volunteer holding an older person's hand", "Une bénévole tient la main d'une personne âgée", "Yon volontè kenbe men yon granmoun"),
} as const;
export const photoSrc = (ph: Photo, w = 1400) => `https://images.pexels.com/photos/${ph.id}/pexels-photo-${ph.id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
export const photoSet = (ph: Photo) => [640, 1000, 1400, 2000].map((w) => `${photoSrc(ph, w)} ${w}w`).join(", ");
export const photoPage = (ph: Photo) => `https://www.pexels.com/photo/${ph.id}/`;
