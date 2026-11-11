import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill, TierBadge } from "@/components/Campaign";
import { SupportSlip } from "@/components/Support";
import { setHidden } from "@/app/admin-actions";
import ModerationForm from "@/components/ModerationForm";
import { requireAdmin } from "@/lib/auth";
import { adminCampaign } from "@/lib/admin-data";
import { fmtDate, fmtMoney, mediaUrl } from "@/lib/format";
import { isLocale } from "@/lib/i18n";
export const metadata: Metadata = { title: "Review campaign", robots: { index: false } };
export default async function AdminCampaign({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdmin(locale);
  const data = await adminCampaign(id);
  if (!data) notFound();
  const { campaign: c, owner, priv, methods, docs, signals, reports, audit, updates, contributions } = data;
  const cover = mediaUrl(c.cover_path), voice = mediaUrl(c.voice_path);
  const kv = (k: string, v: React.ReactNode) => <div><dt>{k}</dt><dd>{v || <span className="muted">Not given</span>}</dd></div>;
  return (
    <div className="wrap page admin">
      <p><Link className="back" href={`/${locale}/admin`}>Back to admin</Link></p>
      <header className="page-head">
        <div className="row tight"><StatusPill status={c.status} locale="en" /><TierBadge tier={c.tier} locale="en" /></div>
        <h1>{c.title}</h1>
        <p className="muted">Created {fmtDate(c.created_at, "en")}{c.submitted_at ? `, submitted ${fmtDate(c.submitted_at, "en")}` : ""}. <Link href={`/${locale}/campaigns/${c.slug}`}>Open the public page</Link></p>
      </header>
      {signals.length > 0 && (
        <div className="notice err">
          <strong>Fraud signals</strong>
          <ul>{signals.map((s, i) => <li key={i}>{s.kind === "blocklist" ? `Matches blocklist entry “${s.detail}”` : s.kind === "shared_payout" ? <>Payment detail “{s.detail}” also appears on {s.other_id ? <Link href={`/${locale}/admin/campaigns/${s.other_id}`}>{s.other_title}</Link> : "another campaign"}</> : <>Same contact or reference as another organizer's campaign: {s.other_id ? <Link href={`/${locale}/admin/campaigns/${s.other_id}`}>{s.other_title}</Link> : s.detail}</>}</li>)}</ul>
        </div>
      )}
      <div className="review-grid">
        <div className="stack">
          <section className="panel stack">
            <h2>Campaign</h2>
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cover-preview" src={cover} alt="Cover" />
            )}
            <dl className="kv">
              {kv("For", `${c.beneficiary_name ?? ""}${c.beneficiary_relation ? ` (${c.beneficiary_relation})` : ""}`)}
              {kv("Cause", c.cause)}
              {kv("Place", [c.commune, c.department].filter(Boolean).join(", "))}
              {kv("Goal", c.goal_amount ? fmtMoney(Number(c.goal_amount), c.goal_currency, "en") : "No fixed goal")}
              {kv("Deadline", c.deadline)}
              {kv("Language", c.language)}
              {kv("Asked for urgent", c.urgent ? "Yes" : "No")}
              {kv("Video", c.video_url && <a href={c.video_url} target="_blank" rel="noopener noreferrer nofollow">{c.video_url}</a>)}
            </dl>
            {voice && <audio controls preload="none" src={voice} />}
            <div className="story">{c.story.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
            {c.gallery.length > 0 && <div className="gallery small-gallery">{c.gallery.map((g) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={g} src={mediaUrl(g) ?? ""} alt="" loading="lazy" />
            ))}</div>}
          </section>
          <section className="panel stack">
            <h2>How to support (public)</h2>
            {methods.length ? <SupportSlip methods={methods} locale="en" compact /> : <p className="muted">No support method.</p>}
          </section>
          {(updates.length > 0 || contributions.length > 0) && (
            <section className="panel stack">
              <h2>Updates and reported support</h2>
              <ul className="rows">
                {updates.map((u) => <li key={u.id}><div><p className="small muted">Update, {fmtDate(u.created_at, "en")}{u.hidden ? ", hidden" : ""}</p><p>{u.body}</p></div><form action={setHidden}><input type="hidden" name="id" value={u.id} /><input type="hidden" name="table" value="campaign_updates" /><input type="hidden" name="hidden" value={u.hidden ? "0" : "1"} /><button className="btn small ghost">{u.hidden ? "Show" : "Hide"}</button></form></li>)}
                {contributions.map((k) => <li key={k.id}><div><p className="small muted">Reported support, {fmtDate(k.created_at, "en")}{k.hidden ? ", hidden" : ""}</p><p>{k.anonymous ? "Anonymous" : k.display_name ?? "Member"}: {fmtMoney(Number(k.amount), k.currency, "en")}{k.message ? `, “${k.message}”` : ""}</p></div><form action={setHidden}><input type="hidden" name="id" value={k.id} /><input type="hidden" name="table" value="contributions" /><input type="hidden" name="hidden" value={k.hidden ? "0" : "1"} /><button className="btn small ghost">{k.hidden ? "Show" : "Hide"}</button></form></li>)}
              </ul>
            </section>
          )}
        </div>
        <div className="stack">
          <section className="panel stack">
            <h2>Decision</h2>
            <ModerationForm id={c.id} status={c.status} tier={c.tier} featured={c.featured} urgent={c.urgent} emergency={c.emergency} note={priv?.review_note ?? ""} />
          </section>
          <section className="panel stack">
            <h2>Organizer (private)</h2>
            <dl className="kv">
              {kv("Account", owner && <Link href={`/${locale}/u/${owner.id}`}>{owner.display_name}{owner.banned ? " (restricted)" : ""}</Link>)}
              {kv("Campaigns by this account", String(data.ownerCampaigns))}
              {kv("Full name", priv?.contact_name)}
              {kv("Email", priv?.contact_email && <a href={`mailto:${priv.contact_email}`}>{priv.contact_email}</a>)}
              {kv("Other contact", priv?.contact_details)}
              {kv("Reference", [priv?.reference_name, priv?.reference_contact].filter(Boolean).join(", "))}
              {kv("Consent given", priv?.consent_at ? fmtDate(priv.consent_at, "en") : "")}
            </dl>
            <h3>Verification files</h3>
            <ul className="doc-list">{docs.map((d) => <li key={d.label}>{d.url ? <a className="btn small" href={d.url} target="_blank" rel="noopener noreferrer">{d.label}</a> : <span className="muted">{d.label}: not provided</span>}</li>)}</ul>
            <p className="small muted">File links expire after 10 minutes. Reload the page for new ones.</p>
          </section>
          {reports.length > 0 && <section className="panel stack"><h2>Reports on this campaign</h2><ul className="rows">{reports.map((r) => <li key={r.id}><div><p><strong>{r.reason.replace("_", " ")}</strong>{r.handled ? " (handled)" : ""}</p><p>{r.body}</p><p className="small muted">{fmtDate(r.created_at, "en")}</p></div></li>)}</ul></section>}
          {audit.length > 0 && <section className="panel stack"><h2>History</h2><ul className="rows">{audit.map((a) => <li key={a.id}><div><p><strong>{a.action.replace(/_/g, " ")}</strong></p>{a.note && <p>{a.note}</p>}<p className="small muted">{fmtDate(a.created_at, "en")}</p></div></li>)}</ul></section>}
        </div>
      </div>
    </div>
  );
}
