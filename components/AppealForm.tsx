"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import ActionForm, { Submit } from "./ActionForm";
import { submitAppeal } from "@/app/actions";
import { t, type Locale } from "@/lib/i18n";

export default function AppealForm({ locale }: { locale: Locale }) {
  const [body, setBody] = useState("");
  return (
    <ActionForm action={submitAppeal} locale={locale} className="panel mint" reset onSuccess={() => setBody("")}>
      <AppealFields locale={locale} body={body} setBody={setBody} />
    </ActionForm>
  );
}

function AppealFields({ locale, body, setBody }: { locale: Locale; body: string; setBody: (body: string) => void }) {
  const x = t(locale).dash;
  const { pending } = useFormStatus();
  return (
    <>
      <h2 id="appeals-title">{x.appealTitle}</h2>
      <label className="field"><span>{x.appealHint}</span><textarea className="input" name="body" rows={4} minLength={10} maxLength={2000} required value={body} onChange={(e) => setBody(e.target.value)} disabled={pending} /></label>
      <div><Submit className="btn">{x.appealSend}</Submit></div>
    </>
  );
}
