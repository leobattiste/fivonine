import Link from "next/link";
import Icon from "./Icon";
import ActionForm, { Submit } from "./ActionForm";
import { CopyButton } from "./Bits";
import { addContribution } from "@/app/actions";
import { METHODS, methodName } from "@/lib/constants";
import { t, type Locale } from "@/lib/i18n";
import type { Campaign, SupportMethod } from "@/lib/types";

/** The transfer-slip card: every way the organizer receives support, exactly as they wrote it. */
export function SupportSlip({ methods, locale, compact }: { methods: SupportMethod[]; locale: Locale; compact?: boolean }) {
  const d = t(locale);
  return (
    <div className="slip">
      {methods.map((m) => (
        <div className="slip-row" key={m.id}>
          <div className="slip-head">
            <strong>{methodName(m.method, d.support.other)}</strong>
            {!compact && <CopyButton text={m.details} locale={locale} />}
          </div>
          <p className="slip-details">{m.details}</p>
        </div>
      ))}
      <p className="slip-warning"><Icon name="alert" size={16} />{d.support.warning}</p>
    </div>
  );
}
export function SentForm({ c, methods, locale, viewerName, signedIn }: { c: Campaign; methods: SupportMethod[]; locale: Locale; viewerName: string; signedIn: boolean }) {
  const d = t(locale);
  if (!signedIn)
    return <Link className="btn wide" href={`/${locale}/login?next=${encodeURIComponent(`/${locale}/campaigns/${c.slug}#support`)}`}><Icon name="check" size={18} />{d.support.sent}</Link>;
  return (
    <details className="sent">
      <summary className="btn wide"><Icon name="check" size={18} />{d.support.sent}</summary>
      <ActionForm action={addContribution} locale={locale} className="stack" reset>
        <input type="hidden" name="campaign_id" value={c.id} />
        <p className="small muted">{d.support.sentTitle}</p>
        <div className="grid-2">
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
        <label className="field"><span>{d.support.message} <em>({d.common.optional})</em></span><textarea className="input" name="message" rows={2} maxLength={500} /></label>
        <Submit>{d.support.sent}</Submit>
      </ActionForm>
    </details>
  );
}
export function MethodChips() {
  return <ul className="method-chips">{METHODS.filter((m) => m.name).map((m) => <li key={m.id}>{m.name}</li>)}</ul>;
}
