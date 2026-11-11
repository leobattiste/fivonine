import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ActionForm, { Confirm, Submit } from "@/components/ActionForm";
import { StatusPill } from "@/components/Campaign";
import { ClearDraft, ShareBar } from "@/components/Bits";
import { UpdateForm } from "@/components/Uploads";
import { addTeamMember, deleteCampaign, deleteUpdate, removeTeamMember, setCampaignStatus } from "@/app/actions";
import { requireViewer } from "@/lib/auth";
import { getManaged } from "@/lib/data";
import { SITE_URL } from "@/lib/constants";
import { fmtDate } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
export default async function Manage({ params, searchParams }: { params: Promise<{ locale: string; id: string }>; searchParams: Promise<{ sent?: string; saved?: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard/campaigns/${id}`);
  const data = await getManaged(id);
  if (!data) notFound();
  const { campaign: c, priv, updates, team } = data;
  const d = t(locale), x = d.dash, sp = await searchParams;
  const owner = c.owner_id === viewer.id;
  const canPost = ["live", "completed"].includes(c.status);
  const status = (to: string, label: string, cls = "btn small") => (
    <form action={setCampaignStatus}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={c.id} /><input type="hidden" name="to" value={to} /><button className={cls}>{label}</button></form>
  );
  return (
    <div className="wrap page narrow">
      {(sp.sent || sp.saved) && <ClearDraft storageKey={`fivonine-draft-${viewer.id}`} />}
      <p><Link className="back" href={`/${locale}/dashboard`}>{d.common.back}</Link></p>
      <header className="page-head">
        <StatusPill status={c.status} locale={locale} />
        <h1>{c.title}</h1>
      </header>
      {sp.sent && <p className="notice ok">{d.create.submitted}</p>}
      {sp.saved && <p className="notice ok">{d.common.saved}</p>}
      {priv?.review_note && ["needs_changes", "rejected", "suspended"].includes(c.status) && <div className="notice warn"><strong>{x.note}</strong><p>{priv.review_note}</p></div>}

      <section className="panel stack">
        <div className="row">
          <Link className="btn small ghost" href={`/${locale}/campaigns/${c.slug}`}><Icon name="eye" size={16} />{x.view}</Link>
          {owner && !["suspended", "completed", "closed"].includes(c.status) && <Link className="btn small" href={`/${locale}/dashboard/campaigns/${c.id}/edit`}><Icon name="edit" size={16} />{x.edit}</Link>}
          {owner && c.status === "pending" && status("draft", x.withdraw, "btn small ghost")}
          {owner && c.status === "draft" && <Link className="btn small primary" href={`/${locale}/dashboard/campaigns/${c.id}/edit`}>{x.resubmit}</Link>}
          {owner && c.status === "live" && status("completed", x.markCompleted)}
          {owner && ["live", "draft", "pending", "needs_changes", "rejected"].includes(c.status) && status("closed", x.close, "btn small ghost")}
        </div>
        {owner && c.status === "live" && <p className="small muted">{x.closeHint}</p>}
        {c.status === "live" && <ShareBar url={`${SITE_URL}/${locale}/campaigns/${c.slug}`} title={c.title} locale={locale} />}
      </section>

      {canPost && (
        <section className="panel stack">
          <h2>{x.postUpdate}</h2>
          <UpdateForm locale={locale} id={c.id} />
        </section>
      )}
      {updates.length > 0 && (
        <section className="panel stack">
          <h2>{d.campaign.updates}</h2>
          <ul className="rows">
            {updates.map((u) => (
              <li key={u.id}>
                <div><p className="small muted">{fmtDate(u.created_at, locale)}</p><p>{u.body}</p></div>
                {u.author_id === viewer.id && <form action={deleteUpdate}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={u.id} /><Confirm label={x.delete} confirm={`${x.delete}?`} /></form>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {owner && (
        <section className="panel stack">
          <h2>{x.team}</h2>
          <p className="small muted">{x.teamHint}</p>
          {team.length > 0 && (
            <ul className="rows">
              {team.map((m) => (
                <li key={m.user_id}><p>{m.profile?.display_name ?? d.common.member}</p>
                  <form action={removeTeamMember}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={c.id} /><input type="hidden" name="user_id" value={m.user_id} /><button className="btn small ghost">{d.common.remove}</button></form>
                </li>
              ))}
            </ul>
          )}
          <ActionForm action={addTeamMember} locale={locale} className="row end" reset>
            <input type="hidden" name="id" value={c.id} />
            <label className="field grow"><span>{x.teamEmail}</span><input className="input" type="email" name="email" required /></label>
            <Submit className="btn">{x.addMember}</Submit>
          </ActionForm>
        </section>
      )}
      {owner && ["draft", "rejected", "needs_changes"].includes(c.status) && (
        <form action={deleteCampaign}><input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={c.id} /><Confirm label={x.delete} confirm={x.deleteConfirm} /></form>
      )}
    </div>
  );
}
