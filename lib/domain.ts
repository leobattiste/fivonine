import { categoryKeys, isLocale, type Category, type Locale } from "./i18n";
export type CampaignContent = {
  fundraising_url?: string;
  lifecycle?: "active" | "completed";
  title: string;
  story: string;
  category: Category;
  country: string;
  region: string;
  organizer_name: string;
  relationship: string;
  beneficiary: string;
  intended_use: string;
  distribution: string;
  support_text: string;
  photo_url: string;
  goal: number | null;
  currency: string;
  language: Locale;
};
export type Campaign = {
  id: string;
  public_content: CampaignContent;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  contact_confirmed: boolean;
  links_checked_at: string | null;
  organization_reviewed_at: string | null;
  demo?: boolean;
};
export type ActionState = { ok: boolean; message: string; id?: string };
export const initialState: ActionState = { ok: false, message: "" };
export function safeExternal(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !["localhost", "localhost.localdomain"].includes(u.hostname) &&
      u.hostname.includes(".") &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)
      ? u.href
      : null;
  } catch {
    return null;
  }
}
export function supportParts(text: string): { text: string; url?: string }[] {
  return text
    .split(/(https?:\/\/[^\s<>]+)/g)
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(https?:\/\/.*?)([.,;!?)]*)$/);
      if (!match) return { text: part };
      const url = safeExternal(match[1]);
      return url ? { text: part, url } : { text: part };
    });
}
export function parseCampaign(form: FormData): CampaignContent {
  const read = (key: string, max: number, required = false) => {
    const value = String(form.get(key) ?? "").trim();
    if ((required && !value) || value.length > max)
      throw new Error(`Invalid ${key}`);
    return value;
  };
  const category = read("category", 30);
  const language = read("language", 5);
  if (!categoryKeys.includes(category as Category) || !isLocale(language))
    throw new Error("Choose a category and story language.");
  const raw = read("goal", 15);
  const goal = raw ? Number(raw) : null;
  if (
    goal !== null &&
    (!Number.isFinite(goal) || goal <= 0 || goal > 100000000)
  )
    throw new Error("Enter a valid fundraising goal.");
  const currency = read("currency", 3, true).toUpperCase();
  if (!["USD", "HTG", "CAD", "EUR", "GBP", "DOP"].includes(currency))
    throw new Error("Choose a currency.");
  const photo = read("photo_url", 1000);
  if (photo && !safeExternal(photo))
    throw new Error("The image needs a valid HTTPS URL.");
  if (
    form.get("consent") !== "on" ||
    form.get("accuracy") !== "on" ||
    form.get("terms") !== "on"
  )
    throw new Error("Confirm permissions and accuracy.");
  const support = read("support_text", 4000, true);
  for (const u of support.match(/https?:\/\/[^\s<>]+/g) ?? [])
    if (!safeExternal(u.replace(/[.,;!?)]+$/, "")))
      throw new Error("Support links must use HTTPS and a public website.");
  const link = read("fundraising_url", 1000);
  if (link && !safeExternal(link))
    throw new Error("Use a public HTTPS fundraising link.");
  const lifecycle = read("lifecycle", 20) || "active";
  if (!["active", "completed"].includes(lifecycle))
    throw new Error("Choose a campaign status.");
  return {
    fundraising_url: link,
    lifecycle: lifecycle as "active" | "completed",
    title: read("title", 160, true),
    story: read("story", 10000, true),
    category: category as Category,
    language,
    country: read("country", 80, true),
    region: read("region", 100, true),
    organizer_name: read("organizer_name", 160, true),
    relationship: read("relationship", 200, true),
    beneficiary: read("beneficiary", 300, true),
    intended_use: read("intended_use", 3000, true),
    distribution: read("distribution", 3000, true),
    support_text: support,
    photo_url: photo,
    goal,
    currency,
  };
}
