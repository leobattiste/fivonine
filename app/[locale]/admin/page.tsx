import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ActionForm, { Confirm, Submit } from "@/components/ActionForm";
import Icon, { type IconName } from "@/components/Icon";
import AdminTable from "@/components/AdminTable";
import { addBlock, decideAppeal, decideVouch, removeBlock, resolveItem, saveCategory, saveSettings, setBan, setRole, verifyOrg } from "@/app/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { adminAppeals, adminAudit, adminBlocklist, adminCampaigns, adminCategories, adminChanges, adminCounts, adminMessages, adminReports, adminUsers, adminVouches } from "@/lib/admin-data";
import { getSettings } from "@/lib/data";
import { STATUSES } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import { isLocale, type Locale } from "@/lib/i18n";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };
const TABS: [string, string, IconName][] = [["queue", "Review queue", "clock"], ["campaigns", "Fundraisers", "dashboard"], ["users", "People", "group"], ["reports", "Reports", "flag"], ["vouches", "Vouches", "badge"], ["messages", "Messages", "mail"], ["appeals", "Appeals", "note"], ["settings", "Settings", "settings"], ["audit", "Audit log", "file"]];
type SP = { tab?: string; status?: string; q?: string; only?: string };
const Hidden = ({ v }: { v: Record<string, string> }) => <>{Object.entries(v).map(([k, val]) => <input key={k} type="hidden" name={k} value={val} />)}</>;
export default async function Admin({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SP> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const me = await requireAdmin(locale);
  const sp = await searchParams;
  const tab = TABS.some(([k]) => k === sp.tab) ? sp.tab! : "queue";
  const counts = await adminCounts();
  const badge: Record<string, number> = { queue: counts.pending + counts.changes, reports: counts.reports, vouches: counts.vouches, messages: counts.messages, appeals: counts.appeals, users: counts.orgs };
  const base = `/${locale}/admin`;
  const title = TABS.find(([k]) => k === tab)![1];
  return (
    <div className="wrap page" style={{ paddingTop: 8 }}>
      <div className="admin-shell">
        <nav className="side-nav" aria-label="Admin sections">
          {TABS.map(([k, label, icon]) => <Link key={k} href={`${base}?tab=${k}`} aria-current={tab === k ? "page" : undefined}><Icon name={icon} size={18} />{label}{badge[k] > 0 && <span className="count">{badge[k]}</span>}</Link>)}
        </nav>
        <div className="stack" style={{ gap: 20, minWidth: 0 }}>
          <header className="row spread end"><div className="stack tight"><h1>{title}</h1><p className="xs muted">Signed in as {me.profile.display_name}. Every decision is recorded in the audit log.</p></div></header>
          {tab === "queue" && <Queue locale={locale} />}
          {tab === "campaigns" && (
            <>
              <form className="toolbar" method="get" action={base} role="search">
                <input type="hidden" name="tab" value="campaigns" />
                <label className="searchbar"><Icon name="search" size={18} /><span className="sr">Search titles</span><input name="q" type="search" defaultValue={sp.q ?? ""} placeholder="Search titles" /><button className="btn primary small">Search</button></label>
                <label><span className="sr">Status</span><select name="status" defaultValue={sp.status ?? "all"}><option value="all">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}</select></label>
                <button className="btn small">Apply</button>
              </form>
              <CampaignTable locale={locale} status={sp.status ?? "all"} q={sp.q ?? ""} />
            </>
          )}
          {tab === "users" && <Users locale={locale} q={sp.q ?? ""} only={sp.only ?? ""} meId={me.id} />}
          {tab === "reports" && <Reports locale={locale} />}
          {tab === "vouches" && <Vouches locale={locale} />}
          {tab === "messages" && <Messages locale={locale} />}
          {tab === "appeals" && <Appeals locale={locale} />}
          {tab === "settings" && <SettingsTab />}
          {tab === "audit" && <Audit locale={locale} />}
        </div>
      </div>
    </div>
  );
}
async function CampaignTable({ locale, status, q }: { locale: Locale; status: string; q: string }) {
  const [items, changes] = await Promise.all([adminCampaigns(status, q), adminChanges()]);
  const withChanges = new Set(changes.map((c) => c.campaign_id));
  const rows = items.map((c) => ({ id: c.id, title: c.title, slug: c.slug, status: c.status, tier: c.tier, featured: c.featured, urgent: c.urgent, emergency: c.emergency, owner: c.owner?.display_name ?? "Unknown", place: [c.commune, c.department].filter(Boolean).join(", "), date: fmtDate(c.updated_at, "en"), changes: withChanges.has(c.id) }));
  return <AdminTable rows={rows} base={`/${locale}/admin`} />;
}
async function Queue({ locale }: { locale: Locale }) {
  const [items, changes] = await Promise.all([adminCampaigns("pending", ""), adminChanges()]);
  const pendingChanges = changes.filter((c) => c.status === "pending");
  if (!items.length && !pendingChanges.length) return <div className="empty"><span className="icon-box"><Icon name="done" size={24} /></span><h2>All caught up</h2><p>No new fundraiser or proposed change is waiting for review.</p></div>;
  return (
    <div className="stack" style={{ gap: 24 }}>
      {items.length > 0 && (
        <section className="stack tight"><h2>New fundraisers ({items.length})</h2>
          <ul className="list">
            {items.map((c) => (
              <li key={c.id}>
                <div className="stack tight" style={{ flex: "1 1 320px" }}>
                  <div className="row tight">{c.emergency && <span className="tag solid">Emergency</span>}{c.urgent && <span className="tag line">Asked for urgent</span>}</div>
                  <Link href={`/${locale}/admin/campaigns/${c.id}`}><strong>{c.title}</strong></Link>
                  <p className="xs muted">{c.owner?.display_name ?? "Unknown"} · {[c.commune, c.department].filter(Boolean).join(", ") || "No place"} · {c.submitted_at ? `submitted ${fmtDate(c.submitted_at, "en")}` : ""}</p>
                </div>
                <Link className="btn small primary" href={`/${locale}/admin/campaigns/${c.id}`}>Review</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {pendingChanges.length > 0 && (
        <section className="stack tight"><h2>Proposed changes to public fundraisers ({pendingChanges.length})</h2>
          <ul className="list">
            {pendingChanges.map((c) => (
              <li key={c.campaign_id}>
                <div className="stack tight" style={{ flex: "1 1 320px" }}><strong>{c.campaign?.title ?? "Fundraiser"}</strong><p className="xs muted">Submitted {fmtDate(c.submitted_at, "en")}. The published version stays public until you decide.</p></div>
                <Link className="btn small primary" href={`/${locale}/admin/campaigns/${c.campaign_id}#changes`}>Review changes</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
async function Users({ locale, q, only, meId }: { locale: Locale; q: string; only: string; meId: string }) {
  const users = await adminUsers(q, only);
  return (
    <>
      <form className="toolbar" method="get" action={`/${locale}/admin`} role="search">
        <input type="hidden" name="tab" value="users" />
        <label className="searchbar"><Icon name="search" size={18} /><span className="sr">Search names</span><input name="q" type="search" defaultValue={q} placeholder="Search names" /><button className="btn primary small">Search</button></label>
        <label><span className="sr">Show</span><select name="only" defaultValue={only}><option value="">Everyone</option><option value="orgs">Organizations</option><option value="banned">Restricted</option><option value="admins">Admins</option></select></label>
        <button className="btn small">Apply</button>
      </form>
      {!users.length ? <div className="empty"><span className="icon-box"><Icon name="empty" size={24} /></span><p>No user matches.</p></div> : (
        <ul className="list">
          {users.map((u) => (
            <li key={u.id}>
              <div>
                <div className="row tight">{u.role === "admin" && <span className="tag line">Admin</span>}{u.banned && <span className="tag solid">Restricted</span>}{u.kind === "organization" && <span className="tag line">{u.org_verified ? "Verified organization" : "Organization, not verified"}</span>}</div>
                <h2><Link href={`/${locale}/u/${u.id}`}>{u.display_name}</Link>{u.org_name ? ` (${u.org_name})` : ""}</h2>
                <p className="small muted">Joined {fmtDate(u.created_at, "en")}{u.city ? `, ${u.city}` : ""}{u.org_type ? `, ${u.org_type}` : ""}</p>
              </div>
              {u.id !== meId && (
                <div className="row">
                  {u.kind === "organization" && <form action={verifyOrg}><Hidden v={{ user_id: u.id, on: u.org_verified ? "0" : "1" }} /><button className="btn small">{u.org_verified ? "Remove badge" : "Verify organization"}</button></form>}
                  <form action={setBan}><Hidden v={{ user_id: u.id, banned: u.banned ? "0" : "1" }} /><Confirm label={u.banned ? "Lift restriction" : "Restrict account"} confirm={u.banned ? "Confirm: lift" : "Confirm: restrict and suspend their campaigns"} /></form>
                  <form action={setRole}><Hidden v={{ user_id: u.id, role: u.role === "admin" ? "user" : "admin" }} /><Confirm label={u.role === "admin" ? "Remove admin" : "Make admin"} confirm="Confirm role change" className="btn small quiet" /></form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
async function Reports({ locale }: { locale: Locale }) {
  const items = await adminReports();
  if (!items.length) return <div className="empty"><span className="icon-box"><Icon name="empty" size={24} /></span><p>No reports.</p></div>;
  return (
    <ul className="list">
      {items.map((r) => (
        <li key={r.id} className={r.handled ? "" : "unread"}>
          <div>
            <p><strong>{String(r.reason).replace("_", " ")}</strong> on {r.campaign ? <Link href={`/${locale}/admin/campaigns/${r.campaign.id}`}>{r.campaign.title}</Link> : "a deleted campaign"}</p>
            {r.body && <p>{r.body}</p>}
            <p className="small muted">{fmtDate(r.created_at, "en")}</p>
          </div>
          <form action={resolveItem}><Hidden v={{ id: r.id, table: "reports", handled: r.handled ? "0" : "1" }} /><button className="btn small">{r.handled ? "Reopen" : "Mark handled"}</button></form>
        </li>
      ))}
    </ul>
  );
}
async function Vouches({ locale }: { locale: Locale }) {
  const items = await adminVouches();
  if (!items.length) return <div className="empty"><span className="icon-box"><Icon name="empty" size={24} /></span><p>No vouches yet.</p></div>;
  return (
    <ul className="list">
      {items.map((v) => (
        <li key={v.id} className={v.status === "pending" ? "unread" : ""}>
          <div>
            <p><strong>{v.voucher?.display_name ?? "Member"}</strong> ({v.role}{v.organization ? `, ${v.organization}` : ""}) vouches for {v.campaign ? <Link href={`/${locale}/admin/campaigns/${v.campaign.id}`}>{v.campaign.title}</Link> : "a deleted campaign"}</p>
            <p>{v.statement}</p>
            <p className="small muted">{v.status}, {fmtDate(v.created_at, "en")}</p>
          </div>
          <div className="row">
            {v.status !== "approved" && <form action={decideVouch}><Hidden v={{ id: v.id, status: "approved" }} /><button className="btn small primary">Approve</button></form>}
            {v.status !== "declined" && <form action={decideVouch}><Hidden v={{ id: v.id, status: "declined" }} /><button className="btn small quiet">Decline</button></form>}
          </div>
        </li>
      ))}
    </ul>
  );
}
async function Messages({ locale: _ }: { locale: Locale }) {
  const items = await adminMessages();
  if (!items.length) return <div className="empty"><span className="icon-box"><Icon name="empty" size={24} /></span><p>No messages.</p></div>;
  return (
    <ul className="list">
      {items.map((m) => (
        <li key={m.id} className={m.handled ? "" : "unread"}>
          <div>
            <p><strong>{m.name || "No name"}</strong> <a href={`mailto:${m.email}`}>{m.email}</a>{m.topic ? `, ${m.topic}` : ""}</p>
            <p>{m.body}</p>
            <p className="small muted">{fmtDate(m.created_at, "en")}</p>
          </div>
          <form action={resolveItem}><Hidden v={{ id: m.id, table: "contact_messages", handled: m.handled ? "0" : "1" }} /><button className="btn small">{m.handled ? "Reopen" : "Mark handled"}</button></form>
        </li>
      ))}
    </ul>
  );
}
async function Appeals({ locale }: { locale: Locale }) {
  const items = await adminAppeals();
  if (!items.length) return <div className="empty"><span className="icon-box"><Icon name="empty" size={24} /></span><p>No appeals.</p></div>;
  return (
    <ul className="list">
      {items.map((a) => (
        <li key={a.id} className={a.status === "open" ? "unread" : ""}>
          <div>
            <p><strong>{a.user?.display_name ?? "Member"}</strong>{a.campaign ? <> about <Link href={`/${locale}/admin/campaigns/${a.campaign.id}`}>{a.campaign.title}</Link></> : ""} <span className="tag line">{a.status}</span></p>
            <p>{a.body}</p>
            {a.admin_note && <p className="muted">Note: {a.admin_note}</p>}
            <p className="small muted">{fmtDate(a.created_at, "en")}</p>
          </div>
          {a.status === "open" && (
            <form action={decideAppeal} className="stack">
              <input type="hidden" name="id" value={a.id} />
              <input className="input" name="note" placeholder="Note for the record" maxLength={1000} />
              <div className="row"><button className="btn small primary" name="status" value="accepted">Accept</button><button className="btn small quiet" name="status" value="declined">Decline</button></div>
            </form>
          )}
        </li>
      ))}
    </ul>
  );
}
async function SettingsTab() {
  const [settings, cats, blocks] = await Promise.all([getSettings(), adminCategories(), adminBlocklist()]);
  return (
    <div className="manage-grid">
      <div className="stack">
        <ActionForm action={saveSettings} className="stack panel">
          <h2>Emergency mode</h2>
          <p className="small muted">Shows a banner on every page that links to emergency campaigns. Mark campaigns as “Emergency” when you review them, and they move to the top of the queue.</p>
          <label className="check"><input type="checkbox" name="active" defaultChecked={settings.emergency.active} /><span>Emergency mode is on</span></label>
          <label className="field"><span>Banner, Kreyòl</span><input className="input" name="ht" maxLength={300} defaultValue={settings.emergency.ht} /></label>
          <label className="field"><span>Banner, Français</span><input className="input" name="fr" maxLength={300} defaultValue={settings.emergency.fr} /></label>
          <label className="field"><span>Banner, English</span><input className="input" name="en" maxLength={300} defaultValue={settings.emergency.en} /></label>
          <h2>Exchange rate</h2>
          <label className="field"><span>Gourdes for 1 US dollar</span><input className="input" name="rate" inputMode="decimal" required defaultValue={settings.rate.htg_per_usd} /><small>Used to show campaign progress in both currencies. Update it when the rate moves.</small></label>
          <Submit>Save settings</Submit>
        </ActionForm>
        <div className="panel">
          <h2>Blocklist</h2>
          <p className="small muted">Phone numbers, account numbers, emails or names tied to fraud. Any campaign that contains one is flagged during review.</p>
          <ActionForm action={addBlock} className="row end" reset>
            <label className="field grow"><span>Value</span><input className="input" name="value" required minLength={3} maxLength={200} /></label>
            <label className="field grow"><span>Note</span><input className="input" name="note" maxLength={300} /></label>
            <Submit className="btn">Add</Submit>
          </ActionForm>
          {blocks.length > 0 && <ul className="list">{blocks.map((b) => <li key={b.id}><div><p><strong>{b.value}</strong></p>{b.note && <p className="small muted">{b.note}</p>}</div><form action={removeBlock}><input type="hidden" name="id" value={b.id} /><button className="btn small quiet">Remove</button></form></li>)}</ul>}
        </div>
      </div>
      <div className="panel">
        <h2>Causes</h2>
        <p className="small muted">Shown on the home page, the filters and the campaign form. Departments are fixed to Haiti's ten departments plus Diaspora.</p>
        {cats.map((c) => (
          <details key={c.slug} className="disclose">
            <summary>{c.name_en} <span className="muted small">{c.slug}{c.active ? "" : ", hidden"}</span></summary>
            <ActionForm action={saveCategory} className="stack">
              <input type="hidden" name="slug" value={c.slug} />
              <div className="cols-2"><label className="field"><span>Kreyòl</span><input className="input" name="name_ht" defaultValue={c.name_ht} required /></label><label className="field"><span>Français</span><input className="input" name="name_fr" defaultValue={c.name_fr} required /></label></div>
              <div className="cols-2"><label className="field"><span>English</span><input className="input" name="name_en" defaultValue={c.name_en} required /></label><label className="field"><span>Order</span><input className="input" name="position" inputMode="numeric" defaultValue={c.position} /></label></div>
              <label className="check"><input type="checkbox" name="active" defaultChecked={c.active} /><span>Visible</span></label>
              <Submit className="btn small">Save cause</Submit>
            </ActionForm>
          </details>
        ))}
        <details className="disclose">
          <summary>Add a cause</summary>
          <ActionForm action={saveCategory} className="stack" reset>
            <label className="field"><span>Slug (lowercase, no spaces)</span><input className="input" name="slug" required pattern="[a-z0-9-]{2,40}" /></label>
            <div className="cols-2"><label className="field"><span>Kreyòl</span><input className="input" name="name_ht" required /></label><label className="field"><span>Français</span><input className="input" name="name_fr" required /></label></div>
            <div className="cols-2"><label className="field"><span>English</span><input className="input" name="name_en" required /></label><label className="field"><span>Order</span><input className="input" name="position" inputMode="numeric" defaultValue={20} /></label></div>
            <input type="hidden" name="active" value="on" />
            <Submit className="btn small">Add cause</Submit>
          </ActionForm>
        </details>
      </div>
    </div>
  );
}
async function Audit({ locale: _ }: { locale: Locale }) {
  const items = await adminAudit();
  if (!items.length) return <div className="empty"><span className="icon-box"><Icon name="empty" size={24} /></span><p>No actions recorded yet.</p></div>;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>When</th><th>Who</th><th>Action</th><th>Target</th><th>Note</th></tr></thead>
        <tbody>{items.map((a) => <tr key={a.id}><td>{new Date(a.created_at).toISOString().slice(0, 16).replace("T", " ")}</td><td>{a.actor?.display_name ?? "Removed user"}</td><td>{a.action}</td><td>{a.target_type}</td><td>{a.note ?? ""}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
