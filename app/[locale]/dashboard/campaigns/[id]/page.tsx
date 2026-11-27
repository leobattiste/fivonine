import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ActionForm, { Confirm, Submit } from "@/components/ActionForm";
import { Cover, StatusPill } from "@/components/Campaign";
import { ClearDraft, CopyButton, ShareBar } from "@/components/Bits";
import { createFlow } from "@/lib/dict/create-flow";
import { formText } from "@/lib/dict/form";
import { UpdateForm } from "@/components/Uploads";
import FinalReport from "@/components/FinalReport";
import { followUp } from "@/lib/dict/follow-up";
import { fmtMoney } from "@/lib/format";
import { addTeamMember, confirmSupport, deleteCampaign, deleteUpdate, discardChanges, removeTeamMember, setCampaignStatus } from "@/app/actions";
import { requireViewer } from "@/lib/auth";
import { getCategories, getChange, getManaged, getSupportRecords } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";
import Compare from "@/components/Compare";
export const metadata: Metadata = { robots: { index: false } };

export default async function Manage({ params, searchParams }: { params: Promise<{ locale: string; id: string }>; searchParams: Promise<{ sent?: string; changes?: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard/campaigns/${id}`);
  const [data, change, cats] = await Promise.all([getManaged(id), getChange(id), getCategories(true)]);
  if (!data) notFound();
  const { campaign: c, priv, updates, team, methods } = data;
  const d = t(locale), x = d.dash, y = d.x.dash, sp = await searchParams, L = (p: string) => `/${locale}${p}`;
  const owner = c.owner_id === viewer.id;
  const fu = followUp[locale];
  const records = ["live", "completed"].includes(c.status) ? await getSupportRecords(c.id) : [];
  const canPost = ["live", "completed"].includes(c.status);
  const editable = owner && !["suspended", "completed", "closed"].includes(c.status);
  const note = ["needs_changes", "rejected", "suspended"].includes(c.status) ? priv?.review_note : null;
  const hidden = (k: string, v: string) => <input type="hidden" name={k} value={v} />;
  const status = (to: string, label: string, cls = "btn small") => (
    <form action={setCampaignStatus}>{hidden("locale", locale)}{hidden("id", c.id)}{hidden("to", to)}<button className={cls}>{label}</button></form>
  );
  const confirm = sp.sent ? "sent" : sp.changes ? "changes" : null;

  return (
    <div className="wrap page">
      {confirm && <><ClearDraft storageKey={`fivonine-draft-${viewer.id}`} /><ClearDraft storageKey={`fivonine-draft-${viewer.id}-${c.id}`} /></>}
      <Link className="crumb" href={L("/dashboard")}><Icon name="left" size={18} />{d.x.nav.dashboard}</Link>

      {confirm ? (
        <section className="confirm-card" aria-labelledby="confirm-h">
          <span className="tick"><Icon name="check" size={28} /></span>
          <div className="stack tight"><h1 id="confirm-h">{confirm === "sent" ? d.x.form.confirm.title : d.x.form.confirm.changesTitle}</h1><p className="measure">{confirm === "sent" ? d.x.form.confirm.body : d.x.form.confirm.changesBody}</p></div>
          <dl><div><dt>{d.x.dash.fields.title}</dt><dd>{(change?.payload.row.title as string) ?? c.title}</dd></div><div><dt>{d.x.form.confirm.status}</dt><dd>{confirm === "sent" ? d.status[c.status] : y.changesPending}</dd></div></dl>
          <div className="row">
            <Link className="btn" href={L(`/campaigns/${c.slug}`)}><Icon name="eye" size={18} />{d.x.form.confirm.view}</Link>
            <Link className="btn quiet" href={L("/dashboard")}>{d.x.form.confirm.dashboard}</Link>
          </div>
          {confirm === "sent" && (() => {
            const cf = createFlow[locale], url = `${SITE_URL}/${locale}/campaigns/${c.slug}`, message = cf.after.message(c.title, url);
            return (
              <div className="after-submit">
                <section aria-labelledby="next-h">
                  <h2 id="next-h">{cf.after.title}</h2>
                  <ol className="after-steps">{cf.after.steps(priv?.contact_email || viewer.email).map((step, i) => <li key={i}><span className="n">{i + 1}</span><span>{step}</span></li>)}</ol>
                </section>
                <section aria-labelledby="share-h" className="stack tight">
                  <h2 id="share-h">{cf.after.shareTitle}</h2>
                  <p className="small muted">{cf.after.shareBody}</p>
                  <p className="share-message">{message}</p>
                  <div className="row tight">
                    <CopyButton text={message} locale={locale} label={cf.after.copy} done={cf.after.copied} className="btn small primary" />
                    <a className="btn small" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" size={17} />WhatsApp</a>
                  </div>
                </section>
                <section aria-labelledby="team-h" className="stack tight">
                  <h2 id="team-h">{cf.after.teamTitle}</h2>
                  <p className="small muted">{cf.after.teamBody}</p>
                  <div><a className="btn small" href="#team"><Icon name="group" size={17} />{cf.after.teamCta}</a></div>
                </section>
              </div>
            );
          })()}
        </section>
      ) : (
        <header className="row spread end" style={{ alignItems: "flex-start" }}>
          <div className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap", gap: 16 }}>
            <Cover c={c} className="thumbnail" sizes="120px" />
            <div className="stack tight">
              <div className="row tight"><StatusPill status={c.status} locale={locale} />{change && <span className="tag line">{change.status === "pending" ? y.changesPending : y.changesNeeded}</span>}</div>
              <h1>{c.title || formText[locale].intro.untitled}</h1>
              <p className="muted small measure">{change?.status === "pending" ? y.changesPendingBody : y.explain[c.status]}</p>
            </div>
          </div>
          <div className="row">
            {editable && <Link className={`btn ${["draft", "needs_changes", "rejected"].includes(c.status) || change?.status === "needs_changes" ? "primary" : ""}`} href={L(`/dashboard/campaigns/${c.id}/edit`)}><Icon name="edit" size={18} />{c.status === "draft" ? y.action.draft : c.status === "needs_changes" || change?.status === "needs_changes" ? y.action.needs_changes : x.edit}</Link>}
            <Link className="btn quiet" href={L(`/campaigns/${c.slug}`)}><Icon name="eye" size={18} />{x.view}</Link>
          </div>
        </header>
      )}

      {note && <div className="notice"><Icon name="note" size={18} /><span><strong>{y.feedback}</strong>{note}</span></div>}
      {change?.status === "needs_changes" && change.review_note && <div className="notice"><Icon name="note" size={18} /><span><strong>{y.feedback}</strong>{change.review_note}</span></div>}

      {owner && !confirm && !["closed", "completed"].includes(c.status) && (() => {
        const stage = c.status === "live" ? 2 : c.status === "pending" ? 1 : 0, info = fu.review.by[c.status];
        return (
          <section className="panel review-track" aria-labelledby="rv-h">
            <h2 id="rv-h">{fu.review.title}</h2>
            <ol className="review-steps">{fu.review.steps.map((label, i) => <li key={label} data-state={i < stage ? "done" : i === stage ? "now" : "next"} aria-current={i === stage ? "step" : undefined}><span className="n">{i < stage ? <Icon name="check" size={14} /> : i + 1}</span>{label}</li>)}</ol>
            {info && <p><strong>{info.h}.</strong> {info.p}</p>}
          </section>
        );
      })()}

      <div className="manage-grid">
        <div className="stack" style={{ gap: 24, minWidth: 0 }}>
          {change && (
            <section className="panel" aria-labelledby="cmp">
              <div className="row spread"><h2 id="cmp">{y.changed}</h2>
                {owner && <form action={discardChanges}>{hidden("locale", locale)}{hidden("id", c.id)}<Confirm label={y.discard} confirm={y.discardConfirm} /></form>}
              </div>
              <Compare c={c} methods={methods} change={change} locale={locale} cats={cats} />
            </section>
          )}
          {canPost && (
            <section className="panel" id="update" aria-labelledby="post">
              <h2 id="post">{x.postUpdate}</h2>
              <UpdateForm locale={locale} id={c.id} />
            </section>
          )}
          {records.length > 0 && (
            <section className="panel" id="support" aria-labelledby="sup-h">
              <h2 id="sup-h">{fu.support.title}</h2>
              <p className="small muted measure">{fu.support.intro}</p>
              <ul className="list">
                {records.map((k) => (
                  <li key={k.id}>
                    <div className="stack tight" style={{ flex: "1 1 260px" }}>
                      <strong>{fmtMoney(k.amount, k.currency, locale)} <span className="muted small">· {k.anonymous || !k.display_name ? fu.support.anon : k.display_name} · {fmtDate(k.created_at, locale)}</span></strong>
                      {k.message && <p className="small">{k.message}</p>}
                      {(k.reference || k.sent_on || k.sender_phone || k.receipt_url) && (
                        <dl className="transfer-facts">
                          {k.reference && <div><dt>{fu.send.ref}</dt><dd><code>{k.reference}</code></dd></div>}
                          {k.sent_on && <div><dt>{fu.send.date}</dt><dd>{fmtDate(k.sent_on, locale)}</dd></div>}
                          {k.sender_phone && <div><dt>{fu.send.phone}</dt><dd>{k.sender_phone}</dd></div>}
                          {k.receipt_url && <div><dt>{fu.send.receipt}</dt><dd><a href={k.receipt_url} target="_blank" rel="noopener noreferrer">{fu.send.view}</a></dd></div>}
                        </dl>
                      )}
                      <span className="xs muted">{k.received_at ? fu.support.gotOn(fmtDate(k.received_at, locale)) : fu.support.waiting}</span>
                    </div>
                    <form action={confirmSupport}>{hidden("locale", locale)}{hidden("id", k.id)}{hidden("got", k.received_at ? "0" : "1")}<button className={k.received_at ? "btn small ghost" : "btn small primary"}>{k.received_at ? fu.support.undo : fu.support.got}</button></form>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {updates.length > 0 && (
            <section className="panel" aria-labelledby="ups">
              <h2 id="ups">{d.campaign.updates}</h2>
              <ul className="list">
                {updates.map((u) => (
                  <li key={u.id}>
                    <div className="stack tight" style={{ flex: "1 1 280px" }}><div className="row tight"><time className="xs muted">{fmtDate(u.created_at, locale)}</time>{u.final && <span className="tag solid">{fu.final.tag}</span>}</div><p>{u.body}</p></div>
                    {u.author_id === viewer.id && <form action={deleteUpdate}>{hidden("locale", locale)}{hidden("id", u.id)}<Confirm label={x.delete} confirm={`${x.delete}?`} /></form>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="stack" style={{ gap: 24 }}>
          {c.status === "live" && <section className="panel mint"><h2>{y.share}</h2><ShareBar url={`${SITE_URL}/${locale}/campaigns/${c.slug}`} title={c.title} locale={locale} /></section>}
          {owner && (
            <section className="panel" aria-labelledby="more">
              <h2 id="more">{y.more}</h2>
              <div className="stack tight">
                {c.status === "pending" && status("draft", x.withdraw, "btn small")}
                {c.status === "live" && <FinalReport locale={locale} id={c.id} />}
                {["live", "draft", "pending", "needs_changes", "rejected"].includes(c.status) && status("closed", x.close, "btn small quiet")}
                {c.status === "live" && <p className="xs muted">{x.closeHint}</p>}
                {["draft", "rejected", "needs_changes"].includes(c.status) && <form action={deleteCampaign}>{hidden("locale", locale)}{hidden("id", c.id)}<Confirm label={x.delete} confirm={x.deleteConfirm} /></form>}
              </div>
            </section>
          )}
          {owner && (
            <section className="panel" aria-labelledby="team">
              <h2 id="team">{x.team}</h2>
              <p className="small muted">{x.teamHint}</p>
              {team.length > 0 && (
                <ul className="list">
                  {team.map((m) => (
                    <li key={m.user_id}><span>{m.profile?.display_name ?? d.common.member}</span>
                      <form action={removeTeamMember}>{hidden("locale", locale)}{hidden("id", c.id)}{hidden("user_id", m.user_id)}<button className="btn small quiet">{d.common.remove}</button></form></li>
                  ))}
                </ul>
              )}
              <ActionForm action={addTeamMember} locale={locale} className="stack" reset>
                {hidden("id", c.id)}
                <label className="field"><span>{x.teamEmail}</span><input className="input" type="email" name="email" required /></label>
                <div><Submit className="btn small">{x.addMember}</Submit></div>
              </ActionForm>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

