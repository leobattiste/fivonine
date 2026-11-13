import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ActionForm, { Submit } from "@/components/ActionForm";
import DashNav from "@/components/DashNav";
import { Cover, FundraiserCard, StatusPill } from "@/components/Campaign";
import { AvatarInput } from "@/components/Uploads";
import { changePassword, markNotificationsRead, saveProfile, submitAppeal } from "@/app/actions";
import { requireViewer } from "@/lib/auth";
import { getCategories, myBookmarks, myCampaigns, myChanges, myNotifications, reviewNotes, unreadCount } from "@/lib/data";
import { DEPARTMENTS } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import { isLocale, localeNames, locales, t, type Locale } from "@/lib/i18n";
import { isLite } from "@/lib/prefs";
import type { Campaign, Status } from "@/lib/types";
export const metadata: Metadata = { robots: { index: false } };
const TABS = ["campaigns", "saved", "notifications", "profile"] as const;

export default async function Dashboard({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard`);
  const d = t(locale), sp = await searchParams;
  const tab = (TABS as readonly string[]).includes(sp.tab ?? "") ? (sp.tab as (typeof TABS)[number]) : "campaigns";
  const unread = await unreadCount(viewer.id);
  return (
    <div className="wrap page">
      <div className="dash-shell">
        <DashNav locale={locale} tab={tab} unread={unread} />
        <div className="stack" style={{ gap: 28, minWidth: 0 }}>
          {viewer.profile.banned && <p className="notice err"><Icon name="lock" size={18} />{d.dash.restricted}</p>}
          {tab === "campaigns" && <Overview locale={locale} viewerId={viewer.id} name={viewer.profile.display_name} />}
          {tab === "saved" && <Saved locale={locale} viewerId={viewer.id} />}
          {tab === "notifications" && <Notifications locale={locale} viewerId={viewer.id} />}
          {tab === "profile" && <Profile locale={locale} viewer={viewer} />}
        </div>
      </div>
    </div>
  );
}

const ATTN: Status[] = ["needs_changes", "draft", "rejected", "suspended"];
async function Overview({ locale, viewerId, name }: { locale: Locale; viewerId: string; name: string }) {
  const d = t(locale), x = d.x.dash, L = (p: string) => `/${locale}${p}`;
  const [items, changes, lite] = await Promise.all([myCampaigns(viewerId), myChanges(viewerId), isLite()]);
  const notes = await reviewNotes(items.map((c) => c.id));
  const changeOf = new Map(changes.map((c) => [c.campaign_id, c]));
  const attention = items.filter((c) => ATTN.includes(c.status) || changeOf.get(c.id)?.status === "needs_changes");
  const rest = items.filter((c) => !attention.includes(c));
  const row = (c: Campaign) => {
    const ch = changeOf.get(c.id);
    const note = ch?.status === "needs_changes" ? ch.review_note : ["needs_changes", "rejected", "suspended"].includes(c.status) ? notes[c.id] : null;
    const manage = L(`/dashboard/campaigns/${c.id}`);
    const primary = c.status === "draft" || c.status === "needs_changes" || ch?.status === "needs_changes" ? L(`/dashboard/campaigns/${c.id}/edit`) : c.status === "live" ? `${manage}#update` : c.status === "completed" || c.status === "closed" ? L(`/campaigns/${c.slug}`) : manage;
    const label = ch?.status === "needs_changes" ? x.action.needs_changes : x.action[c.status];
    return (
      <li key={c.id} className={`f-row ${note ? "has-feedback attn" : ""}`}>
        <Cover c={c} lite={lite} className="thumbnail" sizes="150px" />
        <div className="stack tight" style={{ minWidth: 0 }}>
          <div className="row tight"><StatusPill status={c.status} locale={locale} />{ch && <span className="tag line">{ch.status === "pending" ? x.changesPending : x.changesNeeded}</span>}</div>
          <h3><Link href={manage}>{c.title}</Link></h3>
          <p className="explain">{ch?.status === "pending" ? x.changesPendingBody : x.explain[c.status]}</p>
          <p className="xs muted">{x.updatedOn} {fmtDate(c.updated_at, locale)}</p>
        </div>
        {note && <div className="feedback"><strong>{x.feedback}</strong>{note}</div>}
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <Link className={`btn small ${ATTN.includes(c.status) || ch?.status === "needs_changes" ? "primary" : ""}`} href={primary}>{label}</Link>
          <Link className="btn small quiet icon-only" href={manage} aria-label={`${d.dash.manage}: ${c.title}`}><Icon name="more" size={18} /></Link>
        </div>
      </li>
    );
  };
  return (
    <>
      <header className="row spread end">
        <div className="stack tight"><h1>{x.hello(name.split(" ")[0])}</h1><p className="muted">{x.title}</p></div>
        <Link className="btn primary" href={L("/create")}><Icon name="plus" size={18} />{d.x.nav.share}</Link>
      </header>
      {!items.length ? (
        <div className="empty">
          <span className="icon-box"><Icon name="hand" size={26} /></span>
          <h2>{x.none}</h2><p>{x.noneBody}</p>
          <div className="row"><Link className="btn primary" href={L("/create")}><Icon name="plus" size={18} />{d.x.nav.share}</Link><Link className="btn quiet" href={L("/resources")}>{d.x.home.organizerLink}</Link></div>
        </div>
      ) : (
        <>
          {attention.length > 0 && <section className="stack" aria-labelledby="attn"><h2 id="attn">{x.attention}</h2><ul className="f-rows">{attention.map(row)}</ul></section>}
          {rest.length > 0 && <section className="stack" aria-labelledby="all"><h2 id="all">{x.all}</h2><ul className="f-rows">{rest.map(row)}</ul></section>}
        </>
      )}
    </>
  );
}
async function Saved({ locale, viewerId }: { locale: Locale; viewerId: string }) {
  const d = t(locale);
  const [items, cats, lite] = await Promise.all([myBookmarks(viewerId), getCategories(true), isLite()]);
  return (
    <>
      <h1>{d.x.nav.saved}</h1>
      {!items.length ? <div className="empty"><span className="icon-box"><Icon name="bookmark" size={24} /></span><p>{d.dash.noSaved}</p><Link className="btn" href={`/${locale}/explore`}>{d.x.nav.explore}</Link></div>
        : <div className="grid-cards">{items.map((c) => <FundraiserCard key={c.id} c={c} locale={locale} cats={cats} lite={lite} />)}</div>}
    </>
  );
}
async function Notifications({ locale, viewerId }: { locale: Locale; viewerId: string }) {
  const d = t(locale), items = await myNotifications(viewerId);
  const text = d.notif as Record<string, (title: string) => string>;
  return (
    <>
      <header className="row spread"><h1>{d.x.nav.notifications}</h1>
        {items.some((n) => !n.read_at) && <form action={markNotificationsRead}><input type="hidden" name="locale" value={locale} /><button className="btn small"><Icon name="done" size={16} />{d.dash.markRead}</button></form>}
      </header>
      {!items.length ? <div className="empty"><span className="icon-box"><Icon name="bell" size={24} /></span><p>{d.dash.noNotifications}</p></div> : (
        <ul className="list">
          {items.map((n) => {
            const toManage = ["campaign_needs_changes", "campaign_rejected", "campaign_suspended", "campaign_live", "new_contribution", "vouch_approved", "changes_needed", "changes_approved"].includes(n.kind);
            const href = n.kind.startsWith("admin_") ? `/${locale}/admin` : n.campaign_id && toManage ? `/${locale}/dashboard/campaigns/${n.campaign_id}` : n.payload.slug ? `/${locale}/campaigns/${n.payload.slug}` : `/${locale}/dashboard`;
            return (
              <li key={n.id} className={n.read_at ? "" : "unread"}>
                <div className="stack tight" style={{ flex: "1 1 300px" }}>
                  <Link href={href}>{text[n.kind]?.(n.payload.title ?? "") ?? n.kind}</Link>
                  {n.payload.note && <p className="small muted" style={{ fontWeight: 400 }}>{n.payload.note}</p>}
                </div>
                <time className="xs muted" dateTime={n.created_at}>{fmtDate(n.created_at, locale)}</time>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
function Profile({ locale, viewer }: { locale: Locale; viewer: Awaited<ReturnType<typeof requireViewer>> }) {
  const d = t(locale), x = d.dash, p = viewer.profile;
  return (
    <>
      <header className="row spread end"><div className="stack tight"><h1>{d.x.nav.profile}</h1><p className="muted">{viewer.email}</p></div><Link className="arrow-link small" href={`/${locale}/u/${viewer.id}`}>{x.publicProfile}<Icon name="arrow" size={16} /></Link></header>
      <div className="manage-grid">
        <ActionForm action={saveProfile} locale={locale} className="panel">
          <label className="field"><span>{x.displayName}</span><input className="input" name="display_name" required maxLength={80} defaultValue={p.display_name} /></label>
          <AvatarInput locale={locale} initial={p.avatar_path} />
          <label className="field"><span>{x.bio}</span><textarea className="input" name="bio" rows={3} maxLength={600} defaultValue={p.bio} /></label>
          <div className="cols-2">
            <label className="field"><span>{d.create.department}</span><select className="input" name="department" defaultValue={p.department ?? ""}><option value="">{d.create.choose}</option>{DEPARTMENTS.map((v) => <option key={v}>{v}</option>)}</select></label>
            <label className="field"><span>{x.city}</span><input className="input" name="city" maxLength={80} defaultValue={p.city ?? ""} /></label>
          </div>
          <label className="field"><span>{x.accountType}</span><select className="input" name="kind" defaultValue={p.kind}><option value="individual">{x.individual}</option><option value="organization">{x.organization}</option></select></label>
          <div className="cols-2">
            <label className="field"><span>{x.orgName}</span><input className="input" name="org_name" maxLength={120} defaultValue={p.org_name ?? ""} /></label>
            <label className="field"><span>{x.orgType}</span><input className="input" name="org_type" maxLength={60} placeholder={x.orgTypeHint} defaultValue={p.org_type ?? ""} /></label>
          </div>
          {p.kind === "organization" && <p className="small muted">{p.org_verified ? x.orgVerified : x.orgPending}</p>}
          <label className="field"><span>{x.appLanguage}</span><select className="input" name="email_locale" defaultValue={p.locale}>{locales.map((l) => <option key={l} value={l}>{localeNames[l]}</option>)}</select></label>
          <label className="check"><input type="checkbox" name="email_notifications" defaultChecked={p.email_notifications} /><span>{x.emailNotifications}</span></label>
          <div><Submit>{d.common.save}</Submit></div>
        </ActionForm>
        <div className="stack">
          <ActionForm action={changePassword} locale={locale} className="panel" reset>
            <h2>{x.changePassword}</h2>
            <label className="field"><span>{x.newPassword}</span><input className="input" type="password" name="password" minLength={8} required autoComplete="new-password" /><small>{d.auth.passwordHint}</small></label>
            <div><Submit className="btn">{x.changePassword}</Submit></div>
          </ActionForm>
          <ActionForm action={submitAppeal} locale={locale} className="panel mint" reset>
            <h2>{x.appealTitle}</h2>
            <label className="field"><span>{x.appealHint}</span><textarea className="input" name="body" rows={4} minLength={10} maxLength={2000} required /></label>
            <div><Submit className="btn">{x.appealSend}</Submit></div>
          </ActionForm>
        </div>
      </div>
    </>
  );
}
