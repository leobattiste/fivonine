"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionForm, { Submit } from "./ActionForm";
import Icon from "./Icon";
import MfaPanel from "./MfaPanel";
import { changePassword, changeAccountEmail, requestAccountDeletion, saveAccountSettings, signOut } from "@/app/actions";
import { accountCopy } from "@/lib/account-copy";
import { localeNames, locales, t, type Locale } from "@/lib/i18n";
import type { Profile } from "@/lib/types";

/** Account essentials only; advanced protections remain available without dominating the page. */
export default function AccountSettings({ locale, profile, email, verified, deletionRequested }: {
  locale: Locale; profile: Profile; email: string; verified: boolean; deletionRequested: boolean;
}) {
  const c = accountCopy(locale), d = t(locale), router = useRouter();
  const [pending, setPending] = useState(deletionRequested);
  useEffect(() => setPending(deletionRequested), [deletionRequested]);
  const refresh = () => router.refresh();

  return (
    <div className="account-settings">
      <section className="settings-section" aria-labelledby="setting-email">
        <h2 id="setting-email">{d.auth.email}</h2>
        <div className="stack tight">
          <p>{email}</p>
          <p className="small muted">{verified ? c.verified : c.notVerified}</p>
        </div>
        <ActionForm action={changeAccountEmail} locale={locale} className="stack">
          <label className="field"><span>{c.newEmail}</span><input className="input" type="email" name="new_email" required maxLength={254} autoComplete="email" /></label>
          <div><Submit className="btn">{c.updateEmail}</Submit></div>
        </ActionForm>
      </section>

      <section className="settings-section" aria-labelledby="setting-password">
        <h2 id="setting-password">{d.auth.password}</h2>
        <ActionForm action={changePassword} locale={locale} className="stack" reset>
          <label className="field"><span>{c.newPassword}</span><input className="input" type="password" name="password" minLength={8} autoComplete="new-password" required /></label>
          <div><Submit className="btn">{c.changePassword}</Submit></div>
        </ActionForm>
        <details className="settings-advanced">
          <summary>{c.mfa}</summary>
          <MfaPanel locale={locale} />
        </details>
      </section>

      <section className="settings-section" aria-labelledby="setting-notifications">
        <h2 id="setting-notifications">{c.notifications}</h2>
        <ActionForm action={saveAccountSettings} locale={locale} className="stack" onSuccess={refresh}>
          <input type="hidden" name="scope" value="simple_notifications" />
          <label className="settings-toggle"><span>{c.emailOn}</span><input type="checkbox" name="email_notifications" defaultChecked={profile.email_notifications} /></label>
          <label className="settings-toggle"><span>{c.bookmarkedUpdates}</span><input type="checkbox" name="notify_bookmarks" defaultChecked={profile.notify_bookmarks} /></label>
          <p className="small muted">{c.essential}</p>
          <div><Submit className="btn">{c.save}</Submit></div>
        </ActionForm>
      </section>

      <section className="settings-section" aria-labelledby="setting-language">
        <h2 id="setting-language">{c.preferredLanguage}</h2>
        <ActionForm action={saveAccountSettings} locale={locale} className="stack" onSuccess={refresh}>
          <input type="hidden" name="scope" value="simple_language" />
          <label className="field"><span>{c.preferredLanguage}</span>
            <select className="input" name="display_locale" defaultValue={profile.display_locale ?? locale}>
              {locales.map(l => <option key={l} value={l}>{localeNames[l]}</option>)}
            </select>
          </label>
          <div><Submit className="btn">{c.save}</Submit></div>
        </ActionForm>
      </section>

      <section className="settings-section" aria-labelledby="setting-deletion">
        <h2 id="setting-deletion">{c.deletion}</h2>
        <p className="small muted">{c.deletionHint}</p>
        {pending && <p className="notice">{c.requested}</p>}
        {!pending && (
          <ActionForm action={requestAccountDeletion} locale={locale} onSuccess={() => { setPending(true); refresh(); }} className="stack">
            <label className="field"><span>{c.confirm}</span><input className="input" name="confirm" autoComplete="off" placeholder="DELETE" required pattern="DELETE" /></label>
            <div><Submit className="btn danger">{c.request}</Submit></div>
          </ActionForm>
        )}
      </section>

      <form action={signOut} className="settings-signout">
        <input type="hidden" name="locale" value={locale} />
        <button className="btn" type="submit"><Icon name="logout" size={18} />{c.signOut}</button>
      </form>
    </div>
  );
}
