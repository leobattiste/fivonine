"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ActionForm, { Submit } from "./ActionForm";
import Icon from "./Icon";
import MfaPanel from "./MfaPanel";
import { changePassword, changeAccountEmail, deleteEmptyAccount, requestAccountDeletion, saveAccountSettings, signOut, signOutOtherSessions } from "@/app/actions";
import { accountCopy } from "@/lib/account-copy";
import { localeNames, locales, type Locale } from "@/lib/i18n";
import type { Profile } from "@/lib/types";

type Session = { session_id: string; created_at: string; last_seen_at: string; device: string; is_current: boolean };
type Activity = { action: string; occurred_at: string };

export default function AccountSettings({ locale, profile, email, verified, sessions, activity, deletionRequested }: {
  locale: Locale; profile: Profile; email: string; verified: boolean;
  sessions: Session[]; activity: Activity[]; deletionRequested: boolean;
}) {
  const c = accountCopy(locale), router = useRouter();
  const [pending, setPending] = useState(deletionRequested);
  useEffect(() => setPending(deletionRequested), [deletionRequested]);
  const refresh = () => router.refresh();
  const yes = (name: string, checked: boolean, label: string, help?: string) => (
    <label className="settings-toggle" key={name}>
      <span><span>{label}</span>{help && <small className="muted">{help}</small>}</span>
      <input type="checkbox" name={name} defaultChecked={checked} />
    </label>
  );
  const timestamp = (value: string) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat(locale === "ht" ? "fr-HT" : locale, {
      dateStyle: profile.date_style === "short" ? "short" : "medium", timeStyle: "short"
    }).format(d);
  };
  return (
    <div className="stack account-settings" style={{ gap: 22 }}>
      <ActionForm action={saveAccountSettings} locale={locale} className="panel" onSuccess={refresh}>
        <input type="hidden" name="scope" value="general" />
        <h2>{c.general}</h2>
        <label className="field"><span>{c.preferredLanguage}</span>
          <select className="input" name="display_locale" defaultValue={profile.display_locale ?? locale}>
            {locales.map(l => <option key={l} value={l}>{localeNames[l]}</option>)}
          </select>
        </label>
        <label className="field"><span>{c.emailLanguage}</span>
          <select className="input" name="email_locale" defaultValue={profile.locale}>
            {locales.map(l => <option key={l} value={l}>{localeNames[l]}</option>)}
          </select>
        </label>
        <div className="cols-2">
          <label className="field"><span>{c.dateFormat}</span>
            <select className="input" name="date_style" defaultValue={profile.date_style}>
              <option value="long">{c.long}</option><option value="short">{c.short}</option>
            </select>
          </label>
          <label className="field"><span>{c.currencyFormat}</span>
            <select className="input" name="currency_style" defaultValue={profile.currency_style}>
              <option value="code">{c.code}</option><option value="symbol">{c.symbol}</option>
            </select>
          </label>
        </div>
        {yes("reduce_motion", profile.reduce_motion, c.reducedMotion)}
        {yes("large_text", profile.large_text, c.largeText)}
        {yes("high_contrast", profile.high_contrast, c.highContrast)}
        <div><Submit>{c.save}</Submit></div>
      </ActionForm>

      <ActionForm action={saveAccountSettings} locale={locale} className="panel" onSuccess={refresh}>
        <input type="hidden" name="scope" value="notifications" />
        <h2>{c.notifications}</h2>
        {yes("email_notifications", profile.email_notifications, c.emailOn)}
        {yes("notify_fundraisers", profile.notify_fundraisers, c.fundraiserUpdates)}
        {yes("notify_bookmarks", profile.notify_bookmarks, c.bookmarkedUpdates)}
        {yes("notify_reminders", profile.notify_reminders, c.monthlyReminders)}
        {yes("notify_marketing", profile.notify_marketing, c.marketing)}
        <p className="small muted">{c.essential}</p>
        <div><Submit>{c.save}</Submit></div>
      </ActionForm>

      <ActionForm action={saveAccountSettings} locale={locale} className="panel" onSuccess={refresh}>
        <input type="hidden" name="scope" value="privacy" />
        <h2>{c.privacy}</h2>
        {yes("public_profile", profile.public_profile, c.profilePublic)}
        {yes("show_bio", profile.show_bio, c.bioPublic)}
        {yes("show_location", profile.show_location, c.locationPublic)}
        {yes("default_anonymous", profile.default_anonymous, c.anonymous)}
        <p className="small muted">{c.privacyHint}</p>
        <div><Submit>{c.save}</Submit></div>
      </ActionForm>
      <section className="panel">
        <h2>{c.download}</h2>
        <p className="small muted">{c.dataHint}</p>
        <div><a className="btn" href="/api/account/export"><Icon name="down" size={18}/>{c.download}</a></div>
      </section>

      <section className="panel">
        <h2>{c.security}</h2>
        <div className="field"><span>{email}</span><p className="small muted">{verified ? c.verified : c.notVerified}</p></div>
        <ActionForm action={changeAccountEmail} locale={locale} className="stack">
          <label className="field"><span>{c.newEmail}</span><input className="input" type="email" name="new_email" required maxLength={254} autoComplete="email" /></label>
          <div><Submit className="btn">{c.updateEmail}</Submit></div>
        </ActionForm>
        <div className="divider" aria-hidden="true" />
        <ActionForm action={changePassword} locale={locale} className="stack" reset>
          <label className="field"><span>{c.newPassword}</span><input className="input" type="password" name="password" minLength={8} autoComplete="new-password" required /></label>
          <div><Submit className="btn">{c.changePassword}</Submit></div>
        </ActionForm>
      </section>
      <MfaPanel locale={locale}/>
      <section className="panel">
        <h2>{c.activeSessions}</h2>
        {sessions.length ? <ul className="settings-session-list">{sessions.map(s => (
          <li key={s.session_id}><div><p>{s.device}</p><p className="small muted">{timestamp(s.last_seen_at)}</p></div>
          {s.is_current && <span className="tag line">{c.current}</span>}</li>
        ))}</ul> : <p className="small muted">{c.noActivity}</p>}
        <ActionForm action={signOutOtherSessions} locale={locale} onSuccess={refresh}>
          <Submit className="btn">{c.otherSessions}</Submit>
        </ActionForm>
        <p className="small muted">{c.sessionNote}</p>
      </section>
      <section className="panel">
        <h2>{c.recentActivity}</h2>
        {activity.length ? <ul className="settings-session-list">{activity.map((a,i) =>
          <li key={i}><span>{a.action.replace(/_/g," ")}</span><time className="small muted" dateTime={a.occurred_at}>{timestamp(a.occurred_at)}</time></li>)}</ul> :
          <p className="small muted">{c.noActivity}</p>}
      </section>

      <section className="panel">
        <h2>{c.deletion}</h2>
        <p className="small muted">{c.deletionHint}</p>
        {pending && <p className="notice">{c.requested}</p>}
        <ActionForm action={requestAccountDeletion} locale={locale} onSuccess={() => { setPending(true); refresh(); }} className="stack">
          <label className="field"><span>{c.confirm}</span><input className="input" name="confirm" autoComplete="off" placeholder="DELETE" required pattern="DELETE" /></label>
          <div><Submit className="btn">{c.request}</Submit></div>
        </ActionForm>
        <p className="small muted">{c.deleteHint}</p>
        <ActionForm action={deleteEmptyAccount} locale={locale} className="stack">
          <label className="field"><span>{c.confirm}</span><input className="input" name="confirm" autoComplete="off" placeholder="DELETE" required pattern="DELETE" /></label>
          <label className="field"><span>{c.password}</span><input className="input" type="password" name="password" autoComplete="current-password" required /></label>
          <div><Submit className="btn danger">{c.permanently}</Submit></div>
        </ActionForm>
      </section>
      <form action={signOut} className="row">
        <input type="hidden" name="locale" value={locale} />
        <button className="btn" type="submit"><Icon name="logout" size={18}/>{c.signOut}</button>
      </form>
    </div>
  );
}
