"use client";
import { useState } from "react";
import ActionForm, { Submit } from "./ActionForm";
import { magicLink, signIn, signUp } from "@/app/actions";
import { t, type Locale } from "@/lib/i18n";
export default function AuthForm({ locale, next, initial }: { locale: Locale; next: string; initial: "in" | "up" }) {
  const d = t(locale).auth;
  const [mode, setMode] = useState<"in" | "up" | "link">(initial);
  return (
    <div className="panel stack">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={mode !== "up"} onClick={() => setMode("in")}>{d.signIn}</button>
        <button role="tab" aria-selected={mode === "up"} onClick={() => setMode("up")}>{d.signUp}</button>
      </div>
      {mode === "in" && (
        <ActionForm key="in" action={signIn} locale={locale} className="stack">
          <input type="hidden" name="next" value={next} />
          <label className="field"><span>{d.email}</span><input className="input" type="email" name="email" required autoComplete="email" /></label>
          <label className="field"><span>{d.password}</span><input className="input" type="password" name="password" required autoComplete="current-password" /></label>
          <Submit>{d.signIn}</Submit>
          <button type="button" className="link" onClick={() => setMode("link")}>{d.magic}</button>
        </ActionForm>
      )}
      {mode === "link" && (
        <ActionForm key="link" action={magicLink} locale={locale} className="stack">
          <input type="hidden" name="next" value={next} />
          <label className="field"><span>{d.email}</span><input className="input" type="email" name="email" required autoComplete="email" /></label>
          <Submit>{d.magic}</Submit>
        </ActionForm>
      )}
      {mode === "up" && (
        <ActionForm key="up" action={signUp} locale={locale} className="stack">
          <input type="hidden" name="next" value={next} />
          <label className="field"><span>{d.name}</span><input className="input" name="name" required maxLength={80} autoComplete="name" /></label>
          <label className="field"><span>{d.email}</span><input className="input" type="email" name="email" required autoComplete="email" /></label>
          <label className="field"><span>{d.password}</span><input className="input" type="password" name="password" required minLength={8} autoComplete="new-password" /><small>{d.passwordHint}</small></label>
          <Submit>{d.signUp}</Submit>
        </ActionForm>
      )}
    </div>
  );
}
