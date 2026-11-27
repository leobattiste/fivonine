"use client";
import ActionForm, { Submit } from "./ActionForm";
import { sendMessage } from "@/app/actions";
import { followUp } from "@/lib/dict/follow-up";
import type { Locale } from "@/lib/i18n";

/** Write to the organizers (supporter) or answer a thread (organizer, with `withId`). */
export default function MessageForm({ locale, id, withId }: { locale: Locale; id: string; withId?: string }) {
  const m = followUp[locale].msg;
  return (
    <ActionForm action={sendMessage} locale={locale} className="stack tight" reset>
      <input type="hidden" name="id" value={id} />
      {withId && <input type="hidden" name="with" value={withId} />}
      <label className="field"><span className="sr">{m.placeholder}</span><textarea className="input" name="body" rows={3} maxLength={1500} placeholder={m.placeholder} required /></label>
      <p className="xs muted">{m.privacy}</p>
      <div><Submit>{m.send}</Submit></div>
    </ActionForm>
  );
}
