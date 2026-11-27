"use client";
import ActionForm, { Submit } from "./ActionForm";
import { completeCampaign } from "@/app/actions";
import { followUp } from "@/lib/dict/follow-up";
import type { Locale } from "@/lib/i18n";

/** Closing a fundraiser asks for a short account of how the money was used. */
export default function FinalReport({ locale, id }: { locale: Locale; id: string }) {
  const f = followUp[locale].final;
  return (
    <details className="final-report">
      <summary className="btn small">{f.title}</summary>
      <ActionForm action={completeCampaign} locale={locale} className="stack tight">
        <input type="hidden" name="id" value={id} />
        <label className="field"><span>{f.label}</span><textarea className="input" name="body" rows={5} required minLength={20} maxLength={4000} /><small>{f.hint}</small></label>
        <Submit>{f.button}</Submit>
      </ActionForm>
    </details>
  );
}
