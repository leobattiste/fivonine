import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import MessageForm from "@/components/MessageForm";
import { requireViewer } from "@/lib/auth";
import { getThread, getThreads, threadBlocked } from "@/lib/data";
import { blockThread } from "@/app/actions";
import { followUp } from "@/lib/dict/follow-up";
import { isLocale } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export default async function Thread({ params, searchParams }: { params: Promise<{ locale: string; cid: string }>; searchParams: Promise<{ with?: string }> }) {
  const { locale, cid } = await params;
  if (!isLocale(locale) || !(UUID.test(cid) || /^c\d+$/.test(cid))) notFound();
  const viewer = await requireViewer(locale, `/${locale}/dashboard?tab=messages`);
  const sp = await searchParams, sid = sp.with && UUID.test(sp.with) ? sp.with : viewer.id;
  const m = followUp[locale].msg;
  const [messages, threads, blocked] = await Promise.all([getThread(cid, sid), getThreads(), threadBlocked(cid, sid)]);
  const info = threads.find((x) => x.campaign_id === cid && x.supporter_id === sid);
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  return (
    <div className="wrap page">
      <Link className="crumb" href={`/${locale}/dashboard?tab=messages`}><Icon name="left" size={18} />{m.back}</Link>
      <header className="stack tight">
        <h1>{info?.other_name ?? m.title}</h1>
        {info && <p className="muted"><Link href={`/${locale}/campaigns/${info.slug}`}>{info.title}</Link></p>}
      </header>
      {messages.length === 0 && !info ? <div className="empty"><span className="icon-box"><Icon name="mail" size={24} /></span><p>{m.none}</p></div> : (
        <ol className="thread" aria-label={m.title}>
          {messages.map((x) => (
            <li key={x.id} data-mine={x.mine ? "true" : undefined}>
              <p>{x.body}</p>
              <time className="xs muted" dateTime={x.created_at}>{x.mine ? m.you : x.sender_name} · {fmt.format(new Date(x.created_at))}</time>
            </li>
          ))}
        </ol>
      )}
      {blocked ? <p className="notice"><Icon name="info" size={18} />{info?.as_organizer ? m.blockedNote : m.blocked}</p> : <section className="panel" aria-label={m.send}><MessageForm locale={locale} id={cid} withId={sid} /></section>}
      <div className="row">
        {info?.as_organizer && (
          <form action={blockThread}>
            <input type="hidden" name="locale" value={locale} /><input type="hidden" name="id" value={cid} /><input type="hidden" name="with" value={sid} /><input type="hidden" name="on" value={blocked ? "0" : "1"} />
            <button className="btn small ghost"><Icon name={blocked ? "check" : "close"} size={16} />{blocked ? m.unblock : m.block}</button>
          </form>
        )}
        {info && !info.as_organizer && <Link className="btn small ghost" href={`/${locale}/report?campaign=${info.slug}`}><Icon name="flag" size={16} />{m.report}</Link>}
      </div>
    </div>
  );
}
