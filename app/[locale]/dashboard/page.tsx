import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ActionForm, { Submit } from "@/components/ActionForm";
import { CampaignCard, StatusPill } from "@/components/Campaign";
import { AvatarInput } from "@/components/Uploads";
import { changePassword, markNotificationsRead, saveProfile, signOut, submitAppeal } from "@/app/actions";
import { requireViewer } from "@/lib/auth";
import { getCategories, getSettings, myBookmarks, myCampaigns, myNotifications } from "@/lib/data";
import { DEPARTMENTS } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import { isLocale, localeNames, locales, t } from "@/lib/i18n";
import { isLite } from "@/lib/prefs";
export const metadata: Metadata = { robots: { index: false } };
const TABS = ["campaigns", "saved", "notifications", "profile"] as const;
export default async function Dashboard({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard`);
  const d = t(locale), x = d.dash, sp = await searchParams;
  const tab = (TABS as readonly string[]).includes(sp.tab ?? "") ? (sp.tab as (typeof TABS)[number]) : "campaigns";
  const p = viewer.profile;
  return (
    <div className="wrap page">
      <header className="page-head row spread">
        <div><h1>{x.title}</h1><p className="muted">{p.display_name}, {viewer.email}</p></div>
        <div className="row">
          <Link className="btn small ghost" href={`/${locale}/u/${viewer.id}`}>{x.publicProfile}</Link>
          <form action={signOut}><input type="hidden" name="locale" value={locale} /><button className="btn small">{d.auth.signOut}</button></form>
        </div>
      </header>
      {p.banned && <p className="notice err">{x.restricted}</p>}
      <nav className="tabs links" aria-label={x.title}>
        {TABS.map((k) => <Link key={k} href={`/${locale}/dashboard?tab=${k}`} aria-current={tab === k ? "page" : undefined}>{x[k]}</Link>)}
      </nav>

      {tab === "campaigns" && <Campaigns locale={locale} viewerId={viewer.id} />}
      {tab === "saved" && <Saved locale={locale} viewerId={viewer.id} />}
      {tab === "notifications" && <Notifications locale={locale} viewerId={viewer.id} />}
      {tab === "profile" && (
        <div className="two-col">
          <ActionForm action={saveProfile} locale={locale} className="stack panel">
            <h2>{x.profile}</h2>
            <label className="field"><span>{x.displayName}</span><input className="input" name="display_name" required maxLength={80} defaultValue={p.display_name} /></label>
            <AvatarInput locale={locale} initial={p.avatar_path} />
            <label className="field"><span>{x.bio}</span><textarea className="input" name="bio" rows={3} maxLength={600} defaultValue={p.bio} /></label>
            <div className="grid-2">
              <label className="field"><span>{d.create.department}</span><select className="input" name="department" defaultValue={p.department ?? ""}><option value="">{d.create.choose}</option>{DEPARTMENTS.map((v) => <option key={v}>{v}</option>)}</select></label>
              <label className="field"><span>{x.city}</span><input className="input" name="city" maxLength={80} defaultValue={p.city ?? ""} /></label>
            </div>
            <label className="field"><span>{x.accountType}</span>
              <select className="input" name="kind" defaultValue={p.kind}><option value="individual">{x.individual}</option><option value="organization">{x.organization}</option></select>
            </label>
            <div className="grid-2">
              <label className="field"><span>{x.orgName}</span><input className="input" name="org_name" maxLength={120} defaultValue={p.org_name ?? ""} /></label>
              <label className="field"><span>{x.orgType}</span><input className="input" name="org_type" maxLength={60} placeholder={x.orgTypeHint} defaultValue={p.org_type ?? ""} /></label>
            </div>
            {p.kind === "organization" && <p className="small muted">{p.org_verified ? x.orgVerified : x.orgPending}</p>}
            <label className="field"><span>{x.appLanguage}</span><select className="input" name="email_locale" defaultValue={p.locale}>{locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}</select></label>
            <label className="check"><input type="checkbox" name="email_notifications" defaultChecked={p.email_notifications} /><span>{x.emailNotifications}</span></label>
            <Submit>{d.common.save}</Submit>
          </ActionForm>
          <div className="stack">
            <ActionForm action={changePassword} locale={locale} className="stack panel" reset>
              <h2>{x.changePassword}</h2>
              <label className="field"><span>{x.newPassword}</span><input className="input" type="password" name="password" minLength={8} required autoComplete="new-password" /><small>{d.auth.passwordHint}</small></label>
              <Submit className="btn">{x.changePassword}</Submit>
            </ActionForm>
            <ActionForm action={submitAppeal} locale={locale} className="stack panel" reset>
              <h2>{x.appealTitle}</h2>
              <label className="field"><span>{x.appealHint}</span><textarea className="input" name="body" rows={4} minLength={10} maxLength={2000} required /></label>
              <Submit className="btn">{x.appealSend}</Submit>
            </ActionForm>
          </div>
        </div>
      )}
    </div>
  );
}
async function Campaigns({ locale, viewerId }: { locale: "ht" | "fr" | "en"; viewerId: string }) {
  const d = t(locale), items = await myCampaigns(viewerId);
  if (!items.length) return <div className="empty"><p>{d.dash.noCampaigns}</p><Link className="btn primary" href={`/${locale}/create`}>{d.home.create}</Link></div>;
  return (
    <>
      <ul className="rows">
        {items.map((c) => (
          <li key={c.id}>
            <div><StatusPill status={c.status} locale={locale} /><h2><Link href={`/${locale}/dashboard/campaigns/${c.id}`}>{c.title}</Link></h2><p className="small muted">{fmtDate(c.updated_at, locale)}</p></div>
            <div className="row">
              <Link className="btn small ghost" href={`/${locale}/campaigns/${c.slug}`}><Icon name="eye" size={16} />{d.dash.view}</Link>
              <Link className="btn small" href={`/${locale}/dashboard/campaigns/${c.id}`}>{d.dash.manage}</Link>
            </div>
          </li>
        ))}
      </ul>
      <Link className="btn primary" href={`/${locale}/create`}><Icon name="plus" size={18} />{d.home.create}</Link>
    </>
  );
}
async function Saved({ locale, viewerId }: { locale: "ht" | "fr" | "en"; viewerId: string }) {
  const d = t(locale);
  const [items, cats, settings, lite] = await Promise.all([myBookmarks(viewerId), getCategories(true), getSettings(), isLite()]);
  if (!items.length) return <div className="empty"><p>{d.dash.noSaved}</p><Link className="btn" href={`/${locale}/donate`}>{d.home.explore}</Link></div>;
  return <div className="card-grid">{items.map((c) => <CampaignCard key={c.id} c={c} locale={locale} settings={settings} cats={cats} lite={lite} />)}</div>;
}
async function Notifications({ locale, viewerId }: { locale: "ht" | "fr" | "en"; viewerId: string }) {
  const d = t(locale), items = await myNotifications(viewerId);
  if (!items.length) return <div className="empty"><p>{d.dash.noNotifications}</p></div>;
  const text = d.notif as Record<string, (title: string) => string>;
  return (
    <>
      <form action={markNotificationsRead} className="row"><input type="hidden" name="locale" value={locale} /><button className="btn small ghost">{d.dash.markRead}</button></form>
      <ul className="rows">
        {items.map((n) => {
          const href = n.kind.startsWith("admin_") ? `/${locale}/admin` : n.campaign_id && ["campaign_needs_changes", "campaign_rejected", "campaign_suspended", "campaign_live", "new_contribution", "vouch_approved"].includes(n.kind) ? `/${locale}/dashboard/campaigns/${n.campaign_id}` : n.payload.slug ? `/${locale}/campaigns/${n.payload.slug}` : `/${locale}/dashboard`;
          return (
            <li key={n.id} className={n.read_at ? "" : "unread"}>
              <div><p><Link href={href}>{text[n.kind]?.(n.payload.title ?? "") ?? n.kind}</Link></p>{n.payload.note && <p className="muted">{n.payload.note}</p>}<p className="small muted">{fmtDate(n.created_at, locale)}</p></div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
