import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ActionForm, { Submit } from "@/components/ActionForm";
import { Cover, StatusPill } from "@/components/Campaign";
import { SupportMethods } from "@/components/Support";
import Compare from "@/components/Compare";
import { decideChanges, setHidden } from "@/app/admin-actions";
import ModerationForm from "@/components/ModerationForm";
import { requireAdmin } from "@/lib/auth";
import { adminCampaign, adminChange } from "@/lib/admin-data";
import { getCategories } from "@/lib/data";
import { fmtDate, fmtMoney, mediaUrl } from "@/lib/format";
import { isLocale } from "@/lib/i18n";
import { storyHtml } from "@/lib/story";
export const metadata: Metadata = { title: "Review fundraiser", robots: { index: false } };
const TIER: Record<string, string> = { none: "Reviewed only", id_checked: "Identity checked", community: "Community confirmed", organization: "Verified organization" };

export default async function AdminCampaign({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdmin(locale);
  const [data, change, cats] = await Promise.all([adminCampaign(id), adminChange(id), getCategories(true)]);
  if (!data) notFound();
  const { campaign: c, owner, priv, methods, docs, signals, reports, audit, updates, contributions } = data;
  const voice = mediaUrl(c.voice_path);
  const kv = (k: string, v: React.ReactNode) => <><dt>{k}</dt><dd>{v || <span className="muted">Not given</span>}</dd></>;
  const hide = (tid: string, table: string, hidden: boolean) => (
    <form action={setHidden}><input type="hidden" name="id" value={tid} /><input type="hidden" name="table" value={table} /><input type="hidden" name="hidden" value={hidden ? "0" : "1"} /><button className="btn small quiet">{hidden ? "Show" : "Hide"}</button></form>
  );
  return (
    <div className="wrap page admin-shell" style={{ display: "flex", paddingTop: 8, gap: 20 }}>
      <Link className="crumb" href={`/${locale}/admin`}><Icon name="left" size={18} />Review queue</Link>
      <header className="stack tight">
        <div className="row tight"><StatusPill status={c.status} locale="en" /><span className="tag line">{TIER[c.tier]}</span>{change && <span className="tag solid">Proposed changes</span>}</div>
        <h1>{c.title}</h1>
        <p className="xs muted">Created {fmtDate(c.created_at, "en")}{c.submitted_at ? `, submitted ${fmtDate(c.submitted_at, "en")}` : ""}. <Link href={`/${locale}/campaigns/${c.slug}`}>Open the public page</Link></p>
      </header>
      {signals.length > 0 && (
        <div className="stack tight" role="alert">
          {signals.map((s, i) => <p key={i} className="signal"><Icon name="alert" size={18} /><span>{s.kind === "blocklist" ? `Matches blocklist entry “${s.detail}”` : s.kind === "shared_payout" ? <>Payment detail “{s.detail}” also appears on {s.other_id ? <Link href={`/${locale}/admin/campaigns/${s.other_id}`}>{s.other_title}</Link> : "another fundraiser"}</> : <>Same contact or reference as another organizer: {s.other_id ? <Link href={`/${locale}/admin/campaigns/${s.other_id}`}>{s.other_title}</Link> : s.detail}</>}</span></p>)}
        </div>
      )}

      <div className="review-shell">
        <div className="stack" style={{ gap: 20, minWidth: 0 }}>
          {change && (
            <section id="changes" className="panel" style={{ borderColor: "var(--green)" }}>
              <h2>Proposed changes</h2>
              <p className="small muted">Submitted {fmtDate(change.submitted_at, "en")}. The published version stays public until you decide.{change.status === "needs_changes" ? " Sent back to the organizer." : ""}</p>
              <Compare c={c} methods={methods} change={change} locale="en" cats={cats} />
              <ActionForm action={decideChanges} className="stack">
                <input type="hidden" name="id" value={c.id} />
                <label className="field"><span>Note to the organizer</span><textarea className="input" name="note" rows={3} maxLength={2000} defaultValue={change.review_note ?? ""} /><small>Required to send changes back or discard them.</small></label>
                <div className="row">
                  <Submit name="decision" value="approve"><Icon name="check" size={16} />Publish changes</Submit>
                  <Submit name="decision" value="needs_changes" className="btn">Send back</Submit>
                  <Submit name="decision" value="discard" className="btn quiet danger">Discard</Submit>
                </div>
              </ActionForm>
            </section>
          )}
          <section className="panel">
            <h2>Public preview</h2>
            <Cover c={c} className="f-cover" sizes="60vw" />
            <dl className="kv">
              {kv("For", `${c.beneficiary_name ?? ""}${c.beneficiary_relation ? ` (${c.beneficiary_relation})` : ""}`)}
              {kv("Need", cats.find((x) => x.slug === c.cause)?.name_en ?? c.cause)}
              {kv("Place", [c.commune, c.department].filter(Boolean).join(", "))}
              {kv("Goal", c.goal_amount ? fmtMoney(Number(c.goal_amount), c.goal_currency, "en") : "No fixed goal")}
              {kv("End date", c.deadline)}
              {kv("Language", c.language)}
              {kv("Asked for urgent", c.urgent ? "Yes" : "No")}
              {kv("Video", c.video_url && <a href={c.video_url} target="_blank" rel="noopener noreferrer nofollow">{c.video_url}</a>)}
            </dl>
            {voice && <audio controls preload="none" src={voice} />}
            <div className="story" style={{ fontSize: "var(--t-md)" }} dangerouslySetInnerHTML={{ __html: storyHtml(c.story) }} />
            {c.gallery.length > 0 && <div className="gallery">{c.gallery.map((g) => <div key={g} className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={mediaUrl(g) ?? ""} alt="" loading="lazy" /></div>)}</div>}
          </section>
          <section className="panel">
            <h2>How to support (public)</h2>
            {methods.length ? <SupportMethods methods={methods} locale="en" compact /> : <p className="muted">No support method.</p>}
          </section>
          {(updates.length > 0 || contributions.length > 0) && (
            <section className="panel">
              <h2>Updates and supporter notes</h2>
              <ul className="list">
                {updates.map((u) => <li key={u.id}><div className="stack tight" style={{ flex: "1 1 300px" }}><p className="xs muted">Update, {fmtDate(u.created_at, "en")}{u.hidden ? ", hidden" : ""}</p><p>{u.body}</p></div>{hide(u.id, "campaign_updates", u.hidden)}</li>)}
                {contributions.map((k) => <li key={k.id}><div className="stack tight" style={{ flex: "1 1 300px" }}><p className="xs muted">“I sent it”, {fmtDate(k.created_at, "en")}{k.hidden ? ", hidden" : ""}</p><p>{k.anonymous ? "Anonymous" : k.display_name ?? "Member"}: {fmtMoney(Number(k.amount), k.currency, "en")}{k.message ? `, “${k.message}”` : ""}</p></div>{hide(k.id, "contributions", k.hidden)}</li>)}
              </ul>
            </section>
          )}
        </div>

        <aside className="stack" style={{ gap: 20 }}>
          <section className="panel mint">
            <h2>Decision</h2>
            <ModerationForm id={c.id} status={c.status} tier={c.tier} featured={c.featured} urgent={c.urgent} emergency={c.emergency} note={priv?.review_note ?? ""} />
          </section>
          <section className="panel">
            <h2>Organizer (private)</h2>
            <dl className="kv">
              {kv("Account", owner && <Link href={`/${locale}/u/${owner.id}`}>{owner.display_name}{owner.banned ? " (restricted)" : ""}</Link>)}
              {kv("Fundraisers", String(data.ownerCampaigns))}
              {kv("Full name", priv?.contact_name)}
              {kv("Email", priv?.contact_email && <a href={`mailto:${priv.contact_email}`}>{priv.contact_email}</a>)}
              {kv("Other contact", priv?.contact_details)}
              {kv("Reference", [priv?.reference_name, priv?.reference_contact].filter(Boolean).join(", "))}
              {kv("Consent", priv?.consent_at ? fmtDate(priv.consent_at, "en") : "")}
            </dl>
            <h3>Verification files</h3>
            <ul className="row tight">{docs.map((d) => <li key={d.label}>{d.url ? <a className="btn small" href={d.url} target="_blank" rel="noopener noreferrer"><Icon name="file" size={15} />{d.label}</a> : <span className="tag line">{d.label}: missing</span>}</li>)}</ul>
            <p className="xs muted">File links expire after 10 minutes. Reload for new ones.</p>
          </section>
          {reports.length > 0 && <section className="panel"><h2>Reports</h2><ul className="list">{reports.map((r) => <li key={r.id}><div className="stack tight"><strong>{r.reason.replace("_", " ")}{r.handled ? " (handled)" : ""}</strong><p>{r.body}</p><p className="xs muted">{fmtDate(r.created_at, "en")}</p></div></li>)}</ul></section>}
          {audit.length > 0 && <section className="panel"><h2>History</h2><ul className="list">{audit.map((a) => <li key={a.id}><div className="stack tight"><strong>{a.action.replace(/_/g, " ")}</strong>{a.note && <p className="small">{a.note}</p>}<p className="xs muted">{fmtDate(a.created_at, "en")}</p></div></li>)}</ul></section>}
        </aside>
      </div>
    </div>
  );
}
