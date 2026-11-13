import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Icon from "@/components/Icon";
import ActionForm, { Submit } from "@/components/ActionForm";
import { Avatar, Cover, ReviewChecks, StatusPill, causeName, ownerName, place } from "@/components/Campaign";
import { SentForm, SupportMethods } from "@/components/Support";
import { BackToResults, MobileSupport, SectionTabs, ShareBar } from "@/components/Bits";
import { addVouch, toggleBookmark, toggleRemind } from "@/app/actions";
import { getViewer } from "@/lib/auth";
import { getCampaign, getCategories, getChange, getViewerState, ownerSince } from "@/lib/data";
import { SITE_URL, VOUCH_ROLES } from "@/lib/constants";
import { fmtDate, fmtMoney, mediaUrl } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";

type P = { params: Promise<{ locale: string; slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const data = await getCampaign(slug);
  if (!data) return {};
  const c = data.campaign;
  return { title: c.title, description: c.story.slice(0, 160), alternates: { canonical: `/${locale}/campaigns/${c.slug}` }, robots: c.status === "live" || c.status === "completed" ? undefined : { index: false } };
}
export default async function FundraiserPage({ params }: P) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getCampaign(slug);
  if (!data) notFound();
  const { campaign: c, methods, updates, contributions, vouches, team } = data;
  const d = t(locale), x = d.x.detail;
  const [viewer, cats, since] = await Promise.all([getViewer(), getCategories(true), c.owner ? ownerSince(c.owner.id) : null]);
  const state = viewer ? await getViewerState(c.id, viewer.id) : { bookmarked: false, remind: false, vouched: false };
  const isPublic = c.status === "live" || c.status === "completed";
  const mine = viewer?.id === c.owner_id;
  const change = mine || viewer?.profile.role === "admin" ? await getChange(c.id) : null;
  const path = `/${locale}/campaigns/${c.slug}`, url = `${SITE_URL}${path}`;
  const where = place(c), who = ownerName(c);
  const voice = mediaUrl(c.voice_path);
  const notes = contributions.filter((k) => k.message);
  const relation = c.beneficiary_relation ? d.relations[c.beneficiary_relation as keyof typeof d.relations] : "";
  const hidden = (k: string, v: string) => <input type="hidden" name={k} value={v} />;

  return (
    <div className="wrap page" style={{ gap: 24 }}>
      <div className="row spread">
        <BackToResults locale={locale} />
        {mine && <Link className="btn small" href={`/${locale}/dashboard/campaigns/${c.id}`}><Icon name="settings" size={16} />{x.manage}</Link>}
      </div>
      {!isPublic && <p className="notice"><Icon name="lock" size={18} /><span><StatusPill status={c.status} locale={locale} /> {x.preview}</span></p>}
      {change && <p className="notice"><Icon name="clock" size={18} />{x.pendingChanges}</p>}

      <header className="f-head">
        <div className="row tight">
          {c.status === "completed" && <span className="tag solid">{d.campaign.completed}</span>}
          {c.emergency && <span className="tag solid">{d.campaign.emergency}</span>}
          {c.urgent && c.status === "live" && <span className="tag solid">{d.campaign.urgent}</span>}
          {c.cause && <Link className="chip" href={`/${locale}/explore?cause=${c.cause}`}>{causeName(cats, c.cause, locale)}</Link>}
        </div>
        <h1>{c.title}</h1>
        <p className="f-meta">
          {where && <span><Icon name="pin" size={16} />{where}</span>}
          {c.published_at && <span><Icon name="calendar" size={16} />{d.campaign.posted} {fmtDate(c.published_at, locale)}</span>}
          {c.deadline && <span><Icon name="clock" size={16} />{d.campaign.deadline} {fmtDate(c.deadline, locale)}</span>}
        </p>
      </header>
      <Cover c={c} className="f-cover" priority sizes="100vw" />

      <div className="f-grid">
        <div style={{ minWidth: 0 }}>
          <div className="people">
            {c.owner && (
              <Link className="person" href={`/${locale}/u/${c.owner.id}`}>
                <Avatar name={who} path={c.owner.avatar_path} size={44} />
                <p>{x.organizer}<strong>{who}</strong>{c.owner.org_verified ? d.profile.verifiedOrg : ""}</p>
              </Link>
            )}
            {c.beneficiary_name && (
              <div className="person"><span className="avatar" aria-hidden="true"><Icon name="hand" size={20} /></span><p>{x.beneficiary}<strong>{c.beneficiary_name}</strong>{relation}</p></div>
            )}
          </div>

          <SectionTabs items={[["story", x.tabs.story], ["updates", x.tabs.updates, updates.length], ["organizer", x.tabs.organizer]]} />

          <section id="story" className="f-section" aria-label={x.tabs.story}>
            {voice && <div className="voice"><Icon name="mic" size={20} /><span className="small">{d.campaign.listen}</span><audio controls preload="none" src={voice} /></div>}
            <div className="story" lang={c.language}>{c.story.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
            {c.video_url && <p><a className="btn small" href={c.video_url} target="_blank" rel="noopener noreferrer nofollow"><Icon name="external" size={16} />{d.campaign.video}<span className="sr"> ({d.x.common.newTab})</span></a></p>}
            {c.gallery.length > 0 && (
              <div className="gallery" aria-label={d.campaign.photos}>
                {c.gallery.map((g) => <div key={g} className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={mediaUrl(g) ?? ""} alt="" loading="lazy" /></div>)}
              </div>
            )}
          </section>

          <section id="updates" className="f-section" aria-labelledby="updates-h">
            <h2 id="updates-h">{x.tabs.updates}</h2>
            {updates.length ? (
              <ol className="timeline">
                {updates.map((u) => (
                  <li key={u.id}>
                    <time dateTime={u.created_at}>{fmtDate(u.created_at, locale)}{u.author?.display_name ? `, ${u.author.display_name}` : ""}</time>
                    {u.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
                    {u.proof.length > 0 && (
                      <div className="gallery" aria-label={d.campaign.proof}>
                        {u.proof.map((g) => <div key={g} className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={mediaUrl(g) ?? ""} alt={d.campaign.proof} loading="lazy" /></div>)}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            ) : <p className="muted">{x.noUpdates}</p>}
            {notes.length > 0 && (
              <div className="stack" style={{ marginTop: 16 }}>
                <h3>{x.notes}</h3>
                <p className="small muted">{x.notesHint}</p>
                <ul className="notes">{notes.map((k) => <li key={k.id}><strong className="small">{k.anonymous || !k.display_name ? d.common.anonymous : k.display_name}</strong><p>{k.message}</p></li>)}</ul>
              </div>
            )}
          </section>

          <section id="organizer" className="f-section" aria-labelledby="org-h">
            <h2 id="org-h">{x.tabs.organizer}</h2>
            {c.owner && (
              <div className="org-card">
                <div className="who">
                  <Avatar name={who} path={c.owner.avatar_path} size={56} />
                  <div><strong>{who}</strong>{since && <p className="small muted">{x.memberSince} {fmtDate(since, locale)}</p>}</div>
                </div>
                {team.length > 0 && <p className="small"><Icon name="group" size={16} /> {x.team}: {team.map((m) => m.profile?.display_name).filter(Boolean).join(", ")}</p>}
                <Link className="arrow-link small" href={`/${locale}/u/${c.owner.id}`}>{x.profile}<Icon name="arrow" size={16} /></Link>
              </div>
            )}
            <div className="stack tight">
              <h3>{x.checks}</h3>
              <ul className="checklist">
                <li><Icon name="check" size={18} /><span>{x.checkReviewed}</span></li>
                {c.tier !== "none" && <li><Icon name="badge" size={18} /><span><strong>{d.tiers[c.tier]}.</strong> {d.tierHelp[c.tier]}</span></li>}
              </ul>
            </div>
            {vouches.length > 0 && (
              <div className="stack tight">
                <h3>{x.vouches}</h3>
                <ul className="vouch-list">
                  {vouches.map((v) => (
                    <li key={v.id}><p className="small"><strong>{v.voucher?.display_name ?? d.common.member}</strong> <span className="muted">{d.vouchRoles[v.role as keyof typeof d.vouchRoles]}{v.organization ? `, ${v.organization}` : ""}</span></p><p>{v.statement}</p></li>
                  ))}
                </ul>
              </div>
            )}
            {c.status === "live" && !mine && !state.vouched && (
              <details className="disclose">
                <summary>{d.campaign.vouchCta}</summary>
                {viewer ? (
                  <ActionForm action={addVouch} locale={locale} className="stack" reset>
                    {hidden("campaign_id", c.id)}
                    <p className="small muted">{d.campaign.vouchHelp}</p>
                    <label className="field"><span>{d.campaign.vouchRole}</span><select className="input" name="role" required>{VOUCH_ROLES.map((r) => <option key={r} value={r}>{d.vouchRoles[r]}</option>)}</select></label>
                    <label className="field"><span>{d.campaign.vouchOrg} <span className="opt">({d.common.optional})</span></span><input className="input" name="organization" maxLength={120} /></label>
                    <label className="field"><span>{d.campaign.vouchStatement}</span><textarea className="input" name="statement" rows={3} minLength={10} maxLength={600} required /></label>
                    <Submit>{d.campaign.vouchSend}</Submit>
                  </ActionForm>
                ) : <p><Link className="link" href={`/${locale}/login?next=${encodeURIComponent(path)}`}>{d.common.signInFirst}</Link></p>}
              </details>
            )}
            {!mine && <Link className="arrow-link small" href={`/${locale}/report?campaign=${c.slug}`}><Icon name="flag" size={16} />{x.report}</Link>}
          </section>
        </div>

        <aside id="support" className="support" aria-labelledby="support-h">
          <h2 id="support-h">{x.support}</h2>
          {c.goal_amount && (
            <div className="goal"><span className="small muted">{x.goal}</span><strong>{fmtMoney(Number(c.goal_amount), c.goal_currency, locale)}</strong><span className="xs muted">{x.goalNote}</span></div>
          )}
          <ReviewChecks tier={c.tier} locale={locale} withHelp />
          {c.status === "completed" ? <p className="notice"><Icon name="done" size={18} />{x.supportClosed}</p> : <p className="small">{x.supportIntro}</p>}
          {methods.length > 0 && c.status !== "completed" && <SupportMethods methods={methods} locale={locale} />}
          <p className="warn-line"><Icon name="shield" size={16} />{d.support.warning}</p>
          {c.status === "live" && <SentForm c={c} methods={methods} locale={locale} viewerName={viewer?.profile.display_name ?? ""} signedIn={Boolean(viewer)} />}
          <ShareBar url={url} title={c.title} locale={locale} />
          <div className="support-tools">
            <form action={toggleBookmark}>
              {hidden("locale", locale)}{hidden("campaign_id", c.id)}{hidden("back", path)}{hidden("on", state.bookmarked ? "0" : "1")}
              <button className="btn small quiet" aria-pressed={state.bookmarked}><Icon name="bookmark" size={16} />{state.bookmarked ? d.campaign.saved : d.campaign.save}</button>
            </form>
            {state.bookmarked && (
              <form action={toggleRemind}>
                {hidden("locale", locale)}{hidden("campaign_id", c.id)}{hidden("on", state.remind ? "0" : "1")}
                <button className="btn small quiet" aria-pressed={state.remind}><Icon name="bell" size={16} />{d.campaign.remind}</button>
              </form>
            )}
            <Link className="btn small quiet" href={`${path}/flyer`}><Icon name="qr" size={16} />{d.campaign.flyer}</Link>
          </div>
        </aside>
      </div>
      {c.status === "live" && <Suspense fallback={null}><MobileSupport label={x.jump} /></Suspense>}
    </div>
  );
}
