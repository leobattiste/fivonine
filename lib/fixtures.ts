/** Local preview data. Loaded only when FIVONINE_FIXTURES=1, which is never set in production. */
import type { Campaign, Category, Contribution, Notification, Profile, SupportMethod, Update, Vouch, CampaignPrivate } from "./types";
export const FIXTURES = process.env.FIVONINE_FIXTURES === "1";
export const fxProfile: Profile = { id: "00000000-0000-0000-0000-000000000001", display_name: "Roseline Pierre", bio: "Enfimyè nan Okap. M ap ede fanmi ak vwazen m yo.", avatar_path: null, department: "Nord", city: "Cap-Haïtien", kind: "individual", org_name: null, org_type: null, org_verified: false, role: (process.env.FIVONINE_FIXTURE_USER === "admin" ? "admin" : "user"), banned: false, locale: "ht", email_notifications: true, created_at: "2026-09-02T12:00:00Z" };
const owner = { id: fxProfile.id, display_name: fxProfile.display_name, avatar_path: null, kind: "individual" as const, org_name: null, org_verified: false };
const org = { id: "00000000-0000-0000-0000-000000000002", display_name: "Lekòl Kominotè Bèl Fontèn", avatar_path: null, kind: "organization" as const, org_name: "Lekòl Kominotè Bèl Fontèn", org_verified: true };
const base = { owner_id: owner.id, story: "", gallery: [], video_url: null, voice_path: null, featured: true, language: "ht" as const, created_at: "2026-10-20T12:00:00Z", updated_at: "2026-11-08T12:00:00Z", submitted_at: "2026-10-20T12:00:00Z", published_at: "2026-10-22T12:00:00Z", emergency: false, deadline: null };
export const fxCampaigns: Campaign[] = [
  { ...base, id: "c1", slug: "ede-marie-peye-operasyon-li", status: "live", title: "Ede Marie peye operasyon li nan Okap", cause: "medical", department: "Nord", commune: "Cap-Haïtien", beneficiary_name: "Marie Joseph", beneficiary_relation: "family", goal_amount: 180000, goal_currency: "HTG", urgent: true, cover_path: "fixture:1", gallery: ["fixture:4", "fixture:5"], tier: "community", owner, progress: { total_htg: 64500, total_usd: 220, supporters: 14 }, deadline: "2026-12-15",
    story: "Marie se kouzin mwen. Li gen 34 an e li gen de timoun. Doktè nan Lopital Jistinyen di li bezwen yon operasyon anvan fen mwa a.\n\nFanmi an deja ranmase yon pati, men nou poko rive. Lajan an pral peye operasyon an, medikaman yo ak de semèn swen apre sa.\n\nN ap mete resi lopital la isit la depi nou peye." },
  { ...base, id: "c2", slug: "twati-pou-lekol-bel-fonten", status: "live", title: "Yon twati pou lekòl Bèl Fontèn anvan sezon lapli", cause: "education", department: "Ouest", commune: "Belle-Fontaine", beneficiary_name: "120 elèv lekòl la", beneficiary_relation: "organization", goal_amount: 3500, goal_currency: "USD", urgent: false, cover_path: "fixture:2", tier: "organization", owner: org, owner_id: org.id, progress: { total_htg: 20000, total_usd: 1480, supporters: 31 }, story: "Twati lekòl la pati nan dènye gwo van an. Timoun yo ap aprann anba prela." },
  { ...base, id: "c3", slug: "anteman-papa-jean", status: "live", title: "Antèman papa Jean nan Jakmèl", cause: "funeral", department: "Sud-Est", commune: "Jacmel", beneficiary_name: "Fanmi Jean Baptiste", beneficiary_relation: "neighbor", goal_amount: 95000, goal_currency: "HTG", urgent: true, cover_path: "fixture:3", tier: "id_checked", owner, progress: { total_htg: 81000, total_usd: 0, supporters: 22 }, story: "Papa Jean te yon bòs ebenis tout katye a te konnen." },
  { ...base, id: "c4", slug: "ti-komes-pou-manman-nadeje", status: "live", title: "Relanse ti kòmès manman Nadège", cause: "business", department: "Artibonite", commune: "Gonaïves", beneficiary_name: "Nadège Louis", beneficiary_relation: "friend", goal_amount: 60000, goal_currency: "HTG", urgent: false, cover_path: "fixture:4", tier: "none", owner, progress: { total_htg: 9500, total_usd: 0, supporters: 4 }, story: "Dife nan mache a boule tout machandiz li." },
  { ...base, id: "c5", slug: "dlo-pwop-pou-katye-a", status: "live", title: "Dlo pwòp pou 60 fanmi nan Fon Parizyen", cause: "community", department: "Ouest", commune: "Fonds-Parisien", beneficiary_name: "Katye Nan Pon", beneficiary_relation: "community", goal_amount: null, goal_currency: "HTG", urgent: false, cover_path: "fixture:5", tier: "community", owner, progress: { total_htg: 42000, total_usd: 150, supporters: 9 }, story: "Ponp lan kraze depi twa mwa." },
  { ...base, id: "c6", slug: "ane-lekol-pou-twa-timoun", status: "completed", title: "Yon ane lekòl pou twa timoun", cause: "education", department: "Sud", commune: "Les Cayes", beneficiary_name: "Fanmi Dorval", beneficiary_relation: "family", goal_amount: 75000, goal_currency: "HTG", urgent: false, cover_path: "fixture:6", tier: "id_checked", owner, progress: { total_htg: 76200, total_usd: 0, supporters: 18 }, story: "Mèsi anpil. Twa timoun yo lekòl." },
];
export const fxMine: Campaign[] = [
  fxCampaigns[0],
  { ...fxCampaigns[3], id: "c7", slug: "bouyon", status: "needs_changes", title: "Medikaman pou grann Solange" },
  { ...fxCampaigns[3], id: "c8", slug: "nan-verifikasyon", status: "pending", title: "Repare kay la apre inondasyon an" },
];
export const fxMethods: SupportMethod[] = [
  { id: "m1", campaign_id: "c1", method: "moncash", details: "Roseline Pierre\n+509 3712 0000", link: null, position: 0 },
  { id: "m2", campaign_id: "c1", method: "western_union", details: "Receiver: Roseline Pierre\nCap-Haïtien, Haiti", link: null, position: 1 },
  { id: "m3", campaign_id: "c1", method: "unibank", details: "Unibank, kont epay an goud\nNon: Roseline Pierre\nNimewo: 120-0000-00000000", link: null, position: 2 },
  { id: "m4", campaign_id: "c1", method: "zelle", details: "Jean Pierre (frè m nan Miami)\njeanpierre@example.com", link: null, position: 3 },
];
export const fxUpdates: Update[] = [
  { id: "u1", campaign_id: "c1", author_id: owner.id, body: "Nou peye premye depo lopital la jodi a. Operasyon an fikse pou 28 novanm. Mèsi pou tout moun ki ede nou rive la.", proof: ["fixture:2"], hidden: false, created_at: "2026-11-08T15:00:00Z", author: { display_name: owner.display_name } },
  { id: "u2", campaign_id: "c1", author_id: owner.id, body: "Doktè a ban nou lis medikaman yo. N ap achte yo semèn sa a.", proof: [], hidden: false, created_at: "2026-11-02T15:00:00Z", author: { display_name: owner.display_name } },
];
export const fxContributions: Contribution[] = [
  { id: "k1", campaign_id: "c1", amount: 5000, currency: "HTG", method: "moncash", display_name: "Wideline", anonymous: false, message: "Kouraj Marie, n ap priye pou ou.", hidden: false, created_at: "2026-11-09T10:00:00Z" },
  { id: "k2", campaign_id: "c1", amount: 100, currency: "USD", method: "zelle", display_name: null, anonymous: true, message: null, hidden: false, created_at: "2026-11-07T10:00:00Z" },
  { id: "k3", campaign_id: "c1", amount: 2500, currency: "HTG", method: "moncash", display_name: "Pastè Samuel", anonymous: false, message: null, hidden: false, created_at: "2026-11-05T10:00:00Z" },
];
export const fxVouches: Vouch[] = [
  { id: "v1", campaign_id: "c1", voucher_id: "x", role: "church", organization: "Legliz Batis Lafwa, Okap", statement: "Marie se manm legliz nou an depi dizan. Nou konnen maladi li a e nou te wè papye lopital la.", status: "approved", created_at: "2026-10-25T10:00:00Z", voucher: { display_name: "Pastè Samuel Charles", org_verified: false } },
  { id: "v2", campaign_id: "c1", voucher_id: "y", role: "clinic", organization: "Sant Sante Sen Rafayèl", statement: "Mwen se enfimyè ki te resevwa li. Bezwen operasyon an reyèl.", status: "approved", created_at: "2026-10-27T10:00:00Z", voucher: { display_name: "Mis Darline", org_verified: false } },
];
export const fxCategories: Category[] = [
  ["medical", "Swen sante", "Soins médicaux", "Medical care"], ["education", "Edikasyon", "Éducation", "Education"], ["emergency", "Ijans ak katastwòf", "Urgence et catastrophe", "Emergency and disaster"],
  ["funeral", "Antèman", "Funérailles", "Funeral"], ["housing", "Kay ak lwaye", "Logement", "Housing"], ["food", "Manje", "Alimentation", "Food"],
  ["business", "Ti biznis", "Petit commerce", "Small business"], ["community", "Pwojè kominotè", "Projet communautaire", "Community project"], ["other", "Lòt bezwen", "Autre besoin", "Other need"],
].map(([slug, name_ht, name_fr, name_en], i) => ({ slug, name_ht, name_fr, name_en, position: i, active: true }));
export const fxNotifications: Notification[] = [
  { id: "n1", kind: "new_contribution", campaign_id: "c1", payload: { title: fxCampaigns[0].title, slug: fxCampaigns[0].slug }, read_at: null, created_at: "2026-11-09T10:00:00Z" },
  { id: "n2", kind: "campaign_needs_changes", campaign_id: "c7", payload: { title: "Medikaman pou grann Solange", slug: "bouyon", note: "Foto pyès idantite a pa klè. Tanpri reprann li nan limyè." }, read_at: "2026-11-06T10:00:00Z", created_at: "2026-11-05T10:00:00Z" },
];
export const fxPrivate: CampaignPrivate = { campaign_id: "c1", contact_name: "Roseline Pierre", contact_email: "roseline@example.com", contact_details: "WhatsApp +509 3712 0000, apre 4è", id_front_path: null, id_back_path: null, selfie_path: null, reference_name: "Pastè Samuel Charles", reference_contact: "Legliz Batis Lafwa", documents: [], consent_at: "2026-10-20T12:00:00Z", review_note: "Foto pyès idantite a pa klè. Tanpri reprann li nan limyè." };
