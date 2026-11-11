import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ActionForm, { Submit } from "@/components/ActionForm";
import { Avatar, Cover, ProgressBlock, StatusPill, TierBadge, causeName } from "@/components/Campaign";
import { SentForm, SupportSlip } from "@/components/Support";
import { ShareBar } from "@/components/Bits";
import { addVouch, toggleBookmark, toggleRemind } from "@/app/actions";
import { getViewer } from "@/lib/auth";
import { getCampaign, getCategories, getSettings, getViewerState } from "@/lib/data";
import { SITE_URL, VOUCH_ROLES, methodName } from "@/lib/constants";
import { fmtDate, fmtMoney, mediaUrl } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";
import { isLite } from "@/lib/prefs";

type P = { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<{ photos?: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const data = await getCampaign(slug);
  if (!data) return {};
  const c = data.campaign;
  return { title: c.title, description: c.story.slice(0, 160), alternates: { canonical: `/${locale}/campaigns/${c.slug}` }, robots: c.status === "live" || c.status === "completed" ? undefined : { index: false } };
}
export default async function CampaignPage({ params, searchParams }: P) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await getCampaign(slug);
  if (!data) notFound();
  const { campaign: c, methods, updates, contributions, vouches, team } = data;
  const d = t(locale), x = d.campaign;
  const [viewer, cats, settings, liteCookie, sp] = await Promise.all([getViewer(), getCategories(true), getSettings(), isLite(), searchParams]);
  const lite = liteCookie && sp.photos !== "1";
  const state = viewer ? await getViewerState(c.id, viewer.id) : { bookmarked: false, remind: false, vouched: false };
  const isPublic = c.status === "live" || c.status === "completed";
  const mine = viewer?.id === c.owner_id;
  const path = `/${locale}/campaigns/${c.slug}`, url = `${SITE_URL}${path}`;
  const place = [c.commune, c.department].filter(Boolean).join(", ");
  const owner = c.owner;
  const voice = mediaUrl(c.voice_path);
  return (
    <div className="wrap page campaign">
      {!isPublic && <p className="notice warn"><StatusPill status={c.status} locale={locale} /> {x.preview}</p>}
      <div className="campaign-grid">
        <div className="campaign-main campaign-head">
          <div className="row tight">
            {c.status === "completed" && <span className="badge done">{x.completed}</span>}
            {c.emergency && <span className="badge urgent">{x.emergency}</span>}
            {c.urgent && c.status === "live" && <span className="badge urgent">{x.urgent}</span>}
            {c.cause && <Link className="chip" href={`/${locale}/donate?cause=${c.cause}`}>{causeName(cats, c.cause, locale)}</Link>}
            <TierBadge tier={c.tier} locale={locale} withHelp />
          </div>
          <h1>{c.title}</h1>
          <p className="meta">
            {place && <span><Icon name="pin" size={16} />{place}</span>}
            {c.published_at && <span><Icon name="calendar" size={16} />{x.posted} {fmtDate(c.published_at, locale)}</span>}
            {c.deadline && <span><Icon name="clock" size={16} />{x.deadline} {fmtDate(c.deadline, locale)}</span>}
          </p>
          <Cover c={c} lite={lite} />
          {lite && <p className="small"><Link href={`${path}?photos=1`}>{x.showPhotos}</Link></p>}

          <div className="organizer">
            {owner && <Avatar name={owner.display_name} path={lite ? null : owner.avatar_path} size={44} />}
            <p>
              <span className="small muted">{x.by}</span><br />
              {owner ? <Link href={`/${locale}/u/${owner.id}`}><strong>{owner.kind === "organization" && owner.org_name ? owner.org_name : owner.display_name}</strong></Link> : <strong>{d.common.member}</strong>}
              {owner?.org_verified && <span className="badge tier-organization"><Icon name="badge" size={14} />{d.profile.verifiedOrg}</span>}
            </p>
            {c.beneficiary_name && <p><span className="small muted">{x.for}</span><br /><strong>{c.beneficiary_name}</strong>{c.beneficiary_relation && <span className="muted"> ({d.relations[c.beneficiary_relation as keyof typeof d.relations] ?? ""})</span>}</p>}
          </div>

        </div>
        <aside className="campaign-side" id="support">
          <ProgressBlock c={c} settings={settings} locale={locale} big />
          <p className="small muted">{x.selfReported}</p>
          <h2>{d.support.title}</h2>
          {c.status === "completed" ? <p className="notice ok">{d.support.closed}</p> : <p className="small">{d.support.intro}</p>}
          {methods.length > 0 && <SupportSlip methods={methods} locale={locale} />}
          {isPublic && <SentForm c={c} methods={methods} locale={locale} viewerName={viewer?.profile.display_name ?? ""} signedIn={Boolean(viewer)} />}
          <div className="side-actions">
            <ShareBar url={url} title={c.title} locale={locale} />
            <div className="row">
              <form action={toggleBookmark}>
                <input type="hidden" name="locale" value={locale} /><input type="hidden" name="campaign_id" value={c.id} /><input type="hidden" name="back" value={path} /><input type="hidden" name="on" value={state.bookmarked ? "0" : "1"} />
                <button className="btn small ghost" aria-pressed={state.bookmarked}><Icon name="bookmark" size={16} />{state.bookmarked ? x.saved : x.save}</button>
              </form>
              {state.bookmarked && (
                <form action={toggleRemind}>
                  <input type="hidden" name="locale" value={locale} /><input type="hidden" name="campaign_id" value={c.id} /><input type="hidden" name="on" value={state.remind ? "0" : "1"} />
                  <button className="btn small ghost" aria-pressed={state.remind}><Icon name="bell" size={16} />{x.remind}</button>
                </form>
              )}
              <Link className="btn small ghost" href={`${path}/flyer`}><Icon name="qr" size={16} />{x.flyer}</Link>
            </div>
            {mine ? <Link className="btn small" href={`/${locale}/dashboard/campaigns/${c.id}`}><Icon name="settings" size={16} />{d.dash.manage}</Link>
              : <Link className="report-link small" href={`/${locale}/report?campaign=${c.slug}`}><Icon name="flag" size={15} />{x.report}</Link>}
          </div>
        </aside>
        <article className="campaign-main campaign-body">
          <section aria-labelledby="story">
            <h2 id="story">{x.story}</h2>
            {voice && <div className="voice"><p className="small muted"><Icon name="mic" size={16} />{x.listen}</p><audio controls preload="none" src={voice} /></div>}
            <div className="story" lang={c.language}>{c.story.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}</div>
            {c.video_url && <p><a className="btn small ghost" href={c.video_url} target="_blank" rel="noopener noreferrer nofollow"><Icon name="link" size={16} />{x.video}</a></p>}
            {!lite && c.gallery.length > 0 && (
              <div className="gallery" aria-label={x.photos}>
                {c.gallery.map((g) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={g} src={mediaUrl(g) ?? ""} alt="" loading="lazy" />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="updates">
            <h2 id="updates">{x.updates}</h2>
            {updates.length ? (
              <ol className="timeline">
                {updates.map((u) => (
                  <li key={u.id}>
                    <p className="small muted">{fmtDate(u.created_at, locale)}{u.author?.display_name ? `, ${u.author.display_name}` : ""}</p>
                    {u.body.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
                    {!lite && u.proof.length > 0 && (
                      <div className="gallery small-gallery" aria-label={x.proof}>
                        {u.proof.map((g) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={g} src={mediaUrl(g) ?? ""} alt={x.proof} loading="lazy" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            ) : <p className="muted">{x.noUpdates}</p>}
          </section>

          <section aria-labelledby="vouches">
            <h2 id="vouches">{x.vouchesTitle}</h2>
            {vouches.length > 0 && (
              <ul className="vouches">
                {vouches.map((v) => (
                  <li key={v.id}>
                    <Icon name={v.role === "church" ? "church" : v.role === "neighbor" ? "user" : "building"} size={22} />
                    <div>
                      <p><strong>{v.voucher?.display_name ?? d.common.member}</strong> <span className="muted">{d.vouchRoles[v.role as keyof typeof d.vouchRoles]}{v.organization ? `, ${v.organization}` : ""}</span></p>
                      <p>{v.statement}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {c.status === "live" && !mine && !state.vouched && (
              <details className="vouch-form">
                <summary className="btn small">{x.vouchCta}</summary>
                {viewer ? (
                  <ActionForm action={addVouch} locale={locale} className="stack" reset>
                    <input type="hidden" name="campaign_id" value={c.id} />
                    <p className="small muted">{x.vouchHelp}</p>
                    <label className="field"><span>{x.vouchRole}</span>
                      <select className="input" name="role" required>{VOUCH_ROLES.map((r) => <option key={r} value={r}>{d.vouchRoles[r]}</option>)}</select>
                    </label>
                    <label className="field"><span>{x.vouchOrg} <em>({d.common.optional})</em></span><input className="input" name="organization" maxLength={120} /></label>
                    <label className="field"><span>{x.vouchStatement}</span><textarea className="input" name="statement" rows={3} minLength={10} maxLength={600} required /></label>
                    <Submit>{x.vouchSend}</Submit>
                  </ActionForm>
                ) : <p><Link href={`/${locale}/login?next=${encodeURIComponent(path)}`}>{d.common.signInFirst}</Link></p>}
              </details>
            )}
          </section>

          {contributions.length > 0 && (
            <section aria-labelledby="supporters">
              <h2 id="supporters">{x.supportersTitle}</h2>
              <ul className="supporters">
                {contributions.map((k) => (
                  <li key={k.id}>
                    <p><strong>{k.anonymous || !k.display_name ? d.common.anonymous : k.display_name}</strong> <span className="amount">{fmtMoney(Number(k.amount), k.currency, locale)}</span>{k.method && <span className="muted small"> {methodName(k.method, d.support.other)}</span>}</p>
                    {k.message && <p className="muted">{k.message}</p>}
                  </li>
                ))}
              </ul>
              <p className="small muted">{x.selfReported}</p>
            </section>
          )}
          {team.length > 0 && <p className="small muted"><Icon name="group" size={16} /> {x.team}: {team.map((m) => m.profile?.display_name).filter(Boolean).join(", ")}</p>}
        </article>

      </div>
      {isPublic && c.status === "live" && <a className="sticky-cta no-print" href="#support">{d.support.title}</a>}
    </div>
  );
}
