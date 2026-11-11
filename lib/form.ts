import type { Locale } from "./i18n";
export type FormState = {
  id?: string; title: string; story: string; cause: string; department: string; commune: string; beneficiary_name: string; beneficiary_relation: string;
  goal_amount: string; goal_currency: string; deadline: string; urgent: boolean; cover_path: string | null; gallery: string[]; video_url: string;
  voice_path: string | null; language: string; methods: Record<string, string>;
  priv: { contact_name: string; contact_email: string; contact_details: string; id_front_path: string | null; id_back_path: string | null; selfie_path: string | null; reference_name: string; reference_contact: string; documents: string[] };
};
export const emptyForm = (locale: Locale, name = "", email = ""): FormState => ({
  title: "", story: "", cause: "", department: "", commune: "", beneficiary_name: "", beneficiary_relation: "", goal_amount: "", goal_currency: "HTG", deadline: "",
  urgent: false, cover_path: null, gallery: [], video_url: "", voice_path: null, language: locale, methods: {},
  priv: { contact_name: name, contact_email: email, contact_details: "", id_front_path: null, id_back_path: null, selfie_path: null, reference_name: "", reference_contact: "", documents: [] },
});
