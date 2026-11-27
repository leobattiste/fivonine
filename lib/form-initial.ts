import type { Campaign, CampaignChange, CampaignPrivate, SupportMethod } from "./types";
import { normalizeBudget, type FormState } from "./form";

/** Rebuild the form from a saved fundraiser, including private verification files, so organizers resume where they stopped. */
export function formFromSaved(data: { campaign: Campaign; priv: CampaignPrivate | null; methods: SupportMethod[] }, change: CampaignChange | null, email: string): FormState {
  const p = data.priv;
  // When changes are already proposed, keep editing those rather than the published version.
  const c = { ...data.campaign, ...((change?.payload.row ?? {}) as Partial<Campaign>) };
  const methods = (change?.payload.methods ?? data.methods) as { method: string; details: string; link?: string | null }[];
  return {
    id: c.id, title: c.title, story: c.story, cause: c.cause ?? "", country_code: c.country_code ?? (c.department && c.department !== "Diaspora" ? "HT" : ""), organization_role: c.organization_role ?? "", department: c.department ?? "", commune: c.commune ?? "", beneficiary_name: c.beneficiary_name ?? "",
    beneficiary_relation: c.beneficiary_relation ?? "", goal_amount: c.goal_amount ? String(Number(c.goal_amount)) : "", goal_currency: c.goal_currency, deadline: c.deadline ?? "",
    urgent: c.urgent, cover_path: c.cover_path, gallery: c.gallery ?? [], video_url: c.video_url ?? "", budget: normalizeBudget(c.budget), voice_path: c.voice_path, language: c.language,
    methods: Object.fromEntries(methods.map((m) => [m.method, { details: m.details, link: m.link ?? "" }])),
    priv: { contact_name: p?.contact_name ?? "", contact_email: p?.contact_email ?? email, contact_details: p?.contact_details ?? "", id_front_path: p?.id_front_path ?? null, id_back_path: p?.id_back_path ?? null, selfie_path: p?.selfie_path ?? null, reference_name: p?.reference_name ?? "", reference_contact: p?.reference_contact ?? "", documents: p?.documents ?? [] },
  };
}
/** Statuses an organizer can keep working on privately. Autosave is safe only for these. */
export const RESUMABLE = ["draft", "needs_changes", "rejected"] as const;
