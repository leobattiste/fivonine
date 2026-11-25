import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ActionForm, { Submit } from "@/components/ActionForm";
import DashNav from "@/components/DashNav";
import AccountSettings from "@/components/AccountSettings";
import { Cover, FundraiserCard, StatusPill } from "@/components/Campaign";
import { AvatarInput } from "@/components/Uploads";
import { markNotificationsRead, saveProfile } from "@/app/actions";
import { db } from "@/lib/supabase/server";
import { requireViewer } from "@/lib/auth";
import { getCategories, myBookmarks, myCampaigns, myChanges, myNotifications, reviewNotes, unreadCount } from "@/lib/data";
import { DEPARTMENTS } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import { isLocale, t, type Locale } from "@/lib/i18n";
import type { Campaign, Status } from "@/lib/types";
export const metadata: Metadata = { robots: { index: false } };
const TABS = ["profile", "campaigns", "saved", "notifications", "settings"] as const;

export default async function Dashboard({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard`);
  const d = t(locale), sp = await searchParams;
  const tab = (TABS as readonly string[]).includes(sp.tab ?? "") ? (sp.tab as (typeof TABS)[number]) : "profile";
  const unread = await unreadCount(viewer.id);
  return (
    <div className="wrap page">
      <div className="dash-shell">
        <DashNav locale={locale} tab={tab} unread={unread} />
        <div className="stack" style={{ gap: 28, minWidth: 0 }}>
          {viewer.profile.banned && <p className="notice err"><Icon name="lock" size={18} />{d.dash.restricted}</p>}
          {tab === "campaigns" && <Overview locale={locale} viewerId={viewer.id} dateStyle={viewer.profile.date_style} />}
          {tab === "saved" && <Saved locale={locale} viewerId={viewer.id} currencyStyle={viewer.profile.currency_style} />}
          {tab === "notifications" && <Notifications locale={locale} viewerId={viewer.id} dateStyle={viewer.profile.date_style} />}
          {tab === "profile" && <Profile locale={locale} viewer={viewer} />}
          {tab === "settings" && <Settings locale={locale} viewer={viewer} />}
        </div>
      </div>
    </div>
  );
}

const ATTN: Status[] = ["needs_changes", "draft", "rejected", "suspended"];
async function Overview({ locale, viewerId, dateStyle }: { locale: Locale; viewerId: string; dateStyle: "long" | "short" }) {
  const d = t(locale), x = d.x.dash, L = (p: string) => `/${locale}${p}`;
  const [items, changes] = await Promise.all([myCampaigns(viewerId), myChanges(viewerId)]);
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
        <Cover c={c} className="thumbnail" sizes="150px" />
        <div className="stack tight" style={{ minWidth: 0 }}>
          <div className="row tight"><StatusPill status={c.status} locale={locale} />{ch && <span className="tag line">{ch.status === "pending" ? x.changesPending : x.changesNeeded}</span>}</div>
          <h3><Link href={manage}>{c.title}</Link></h3>
          <p className="explain">{ch?.status === "pending" ? x.changesPendingBody : x.explain[c.status]}</p>
          <p className="xs muted">{x.updatedOn} {fmtDate(c.updated_at, locale, dateStyle)}</p>
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
        <div className="stack tight"><h1>{d.x.nav.fundraisers}</h1></div>
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
async function Saved({ locale, viewerId, currencyStyle }: { locale: Locale; viewerId: string; currencyStyle: "code" | "symbol" }) {
  const d = t(locale);
  const [items, cats] = await Promise.all([myBookmarks(viewerId), getCategories(true)]);
  return (
    <>
      <h1>{d.x.nav.saved}</h1>
      {!items.length ? <div className="empty"><span className="icon-box"><Icon name="bookmark" size={24} /></span><p>{d.dash.noSaved}</p><Link className="btn" href={`/${locale}/explore`}>{d.x.nav.explore}</Link></div>
        : <div className="grid-cards">{items.map((c) => <FundraiserCard key={c.id} c={c} locale={locale} cats={cats} currencyStyle={currencyStyle} />)}</div>}
    </>
  );
}
async function Notifications({ locale, viewerId, dateStyle }: { locale: Locale; viewerId: string; dateStyle: "long" | "short" }) {
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
            const href = n.kind === "appeal_accepted" || n.kind === "appeal_declined" ? `/${locale}/dashboard?tab=settings#appeals` : n.kind.startsWith("admin_") ? `/${locale}/admin` : n.campaign_id && toManage ? `/${locale}/dashboard/campaigns/${n.campaign_id}` : n.payload.slug ? `/${locale}/campaigns/${n.payload.slug}` : `/${locale}/dashboard`;
            return (
              <li key={n.id} className={n.read_at ? "" : "unread"}>
                <div className="stack tight" style={{ flex: "1 1 300px" }}>
                  <Link href={href}>{text[n.kind]?.(n.payload.title ?? "") ?? n.kind}</Link>
                  {n.payload.note && <p className="small muted" style={{ fontWeight: 400 }}>{n.payload.note}</p>}
                </div>
                <time className="xs muted" dateTime={n.created_at}>{fmtDate(n.created_at, locale, dateStyle)}</time>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
async function Profile({ locale, viewer }: { locale: Locale; viewer: Awaited<ReturnType<typeof requireViewer>> }) {
  const d = t(locale), x = d.dash, p = viewer.profile;
  return (
    <>
      <header className="row spread end"><h1>{d.x.nav.profile}</h1><Link className="arrow-link small" href={`/${locale}/u/${viewer.id}`}>{x.publicProfile}<Icon name="arrow" size={16} /></Link></header>
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
          <div><Submit>{d.common.save}</Submit></div>
        </ActionForm>
      </div>
    </>
  );
}

async function Settings({ locale, viewer }: { locale: Locale; viewer: Awaited<ReturnType<typeof requireViewer>> }) {
  const sb = await db();
  if (!sb) return <h1>{t(locale).x.nav.settings}</h1>;
  const [sessionResult, activityResult, deletionResult, authResult] = await Promise.all([
    sb.rpc("my_active_sessions"),
    sb.rpc("my_security_activity"),
    sb.from("account_deletion_requests").select("status").eq("user_id", viewer.id).maybeSingle(),
    sb.auth.getUser(),
  ]);
  return <AccountSettings
    locale={locale}
    profile={viewer.profile}
    email={viewer.email}
    verified={Boolean(authResult.data.user?.email_confirmed_at)}
    sessions={(sessionResult.data ?? []) as {session_id:string;created_at:string;last_seen_at:string;device:string;is_current:boolean}[]}
    activity={(activityResult.data ?? []) as {action:string;occurred_at:string}[]}
    deletionRequested={Boolean(deletionResult.data)}
  />;
}
