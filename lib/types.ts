export type Profile = {
  id: string; display_name: string; bio: string; avatar_path: string | null; department: string | null; city: string | null;
  kind: "individual" | "organization"; org_name: string | null; org_type: string | null; org_verified: boolean;
  role: "user" | "admin"; banned: boolean; locale: "ht" | "fr" | "en"; email_notifications: boolean; created_at: string;
};
export type OwnerLite = Pick<Profile, "id" | "display_name" | "avatar_path" | "kind" | "org_name" | "org_verified">;
export type Status = "draft" | "pending" | "needs_changes" | "live" | "completed" | "closed" | "rejected" | "suspended";
export type Tier = "none" | "id_checked" | "community" | "organization";
export type Progress = { total_htg: number; total_usd: number; supporters: number };
export type Campaign = {
  id: string; slug: string; owner_id: string; status: Status; title: string; story: string; cause: string | null;
  department: string | null; commune: string | null; beneficiary_name: string | null; beneficiary_relation: string | null;
  goal_amount: number | null; goal_currency: "HTG" | "USD"; deadline: string | null; urgent: boolean; emergency: boolean;
  cover_path: string | null; gallery: string[]; video_url: string | null; voice_path: string | null; tier: Tier;
  featured: boolean; language: "ht" | "fr" | "en"; created_at: string; updated_at: string; submitted_at: string | null;
  published_at: string | null; owner?: OwnerLite | null; progress?: Progress;
};
export type CampaignPrivate = {
  campaign_id: string; contact_name: string | null; contact_email: string | null; contact_details: string | null;
  id_front_path: string | null; id_back_path: string | null; selfie_path: string | null; reference_name: string | null;
  reference_contact: string | null; documents: string[]; consent_at: string | null; review_note: string | null;
};
export type SupportMethod = { id: string; campaign_id: string; method: string; details: string; link: string | null; position: number };
export type CampaignChange = { campaign_id: string; author_id: string; payload: { row: Record<string, unknown>; methods: { method: string; details: string; link: string | null }[] }; status: "pending" | "needs_changes"; review_note: string | null; submitted_at: string };
export type Update = { id: string; campaign_id: string; author_id: string; body: string; proof: string[]; hidden: boolean; created_at: string; author?: { display_name: string } | null };
export type Contribution = { id: string; campaign_id: string; amount: number; currency: "HTG" | "USD"; method: string | null; display_name: string | null; anonymous: boolean; message: string | null; hidden: boolean; created_at: string };
export type Vouch = { id: string; campaign_id: string; voucher_id: string; role: string; organization: string | null; statement: string; status: string; created_at: string; voucher?: { display_name: string; org_verified: boolean } | null };
export type Category = { slug: string; name_ht: string; name_fr: string; name_en: string; position: number; active: boolean };
export type Settings = { emergency: { active: boolean; ht: string; fr: string; en: string }; rate: { htg_per_usd: number } };
export type Notification = { id: string; kind: string; campaign_id: string | null; payload: { title?: string; slug?: string; note?: string }; read_at: string | null; created_at: string };
export type ActionResult = { ok: boolean; message: string; id?: string; at?: string; undo?: string } | null;
