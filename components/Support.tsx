import Link from "next/link";
import Icon from "./Icon";
import ActionForm, { Submit } from "./ActionForm";
import { CopyButton } from "./Bits";
import { addContribution } from "@/app/actions";
import { METHODS, methodName } from "@/lib/constants";
import { t, type Locale } from "@/lib/i18n";
import type { Campaign, SupportMethod } from "@/lib/types";

const host = (url: string) => { try { return new URL(url).host.replace(/^www\./, ""); } catch { return url; } };

/** Each way the organizer receives support, exactly as they wrote it, with an optional external link. */
export function SupportMethods({ methods, locale, compact }: { methods: Pick<SupportMethod, "method" | "details" | "link">[]; locale: Locale; compact?: boolean }) {
  const d = t(locale), x = d.x.detail;
  return (
    <ul className="stack tight" style={{ gap: 10 }}>
      {methods.map((m) => {
        const name = methodName(m.method, d.support.other);
        return (
          <li className="method" key={m.method}>
            <div className="method-head">
              <strong>{name}</strong>
              {!compact && <CopyButton text={m.details} locale={locale} label={x.copyDetails} />}
            </div>
            <pre>{m.details}</pre>
            {m.link && (
              <a className="btn small ext" href={m.link} target="_blank" rel="noopener noreferrer nofollow" aria-describedby={undefined}>
                <span>{x.open(name)}</span><Icon name="external" size={16} />
                <span className="sr">. {x.opens(host(m.link))}</span>
              </a>
            )}
            {m.link && <p className="host" aria-hidden="true">{x.opens(host(m.link))}</p>}
          </li>
        );
      })}
    </ul>
  );
}
export function SentForm({ c, methods, locale, viewerName, signedIn }: { c: Campaign; methods: SupportMethod[]; locale: Locale; viewerName: string; signedIn: boolean }) {
  const d = t(locale);
  if (!signedIn)
    return <Link className="btn wide" href={`/${locale}/login?next=${encodeURIComponent(`/${locale}/campaigns/${c.slug}#support`)}`}><Icon name="check" size={18} />{d.support.sent}</Link>;
  return (
    <details className="disclose">
      <summary className="btn wide" style={{ justifyContent: "center" }}><Icon name="check" size={18} />{d.support.sent}</summary>
      <ActionForm action={addContribution} locale={locale} className="stack" reset>
        <input type="hidden" name="campaign_id" value={c.id} />
        <p className="small muted">{d.support.sentTitle}</p>
        <div className="cols-2">
          <label className="field"><span>{d.support.amount}</span><input className="input" name="amount" inputMode="decimal" required pattern="[0-9 .,]+" /></label>
          <label className="field"><span>{d.support.currency}</span>
            <select className="input" name="currency" defaultValue={c.goal_currency}><option>HTG</option><option>USD</option></select>
          </label>
        </div>
        <label className="field"><span>{d.support.method}</span>
          <select className="input" name="method" defaultValue="">
            <option value="">—</option>
            {methods.map((m) => <option key={m.id} value={m.method}>{methodName(m.method, d.support.other)}</option>)}
          </select>
        </label>
        <label className="field"><span>{d.support.name}</span><input className="input" name="display_name" defaultValue={viewerName} maxLength={80} /></label>
        <label className="check"><input type="checkbox" name="anonymous" /><span>{d.support.hideName}</span></label>
        <label className="field"><span>{d.support.message} <span className="opt">({d.common.optional})</span></span><textarea className="input" name="message" rows={2} maxLength={500} /></label>
        <Submit>{d.support.sent}</Submit>
      </ActionForm>
    </details>
  );
}
export function MethodCloud() {
  return <ul className="method-cloud">{METHODS.filter((m) => m.name).map((m) => <li key={m.id}>{m.name}</li>)}</ul>;
}
