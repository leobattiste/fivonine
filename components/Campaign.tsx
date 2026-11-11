import Link from "next/link";
import Icon, { causeIcon } from "./Icon";
import { fmtMoney, initials, mediaUrl, otherCurrency, raised } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import type { Campaign, Category, Settings, Tier } from "@/lib/types";

export const causeName = (cats: Category[], slug: string | null, locale: Locale) => {
  const c = cats.find((x) => x.slug === slug);
  return c ? c[`name_${locale}`] : "";
};
export function TierBadge({ tier, locale, withHelp }: { tier: Tier; locale: Locale; withHelp?: boolean }) {
  const d = t(locale);
  return (
    <span className={`badge tier-${tier}`} title={d.tierHelp[tier]}>
      <Icon name={tier === "none" ? "check" : "badge"} size={15} />
      {d.tiers[tier]}
      {withHelp && <span className="sr">. {d.tierHelp[tier]}</span>}
    </span>
  );
}
export function Avatar({ name, path, size = 36 }: { name: string; path?: string | null; size?: number }) {
  const url = mediaUrl(path);
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="avatar" src={url} alt="" width={size} height={size} loading="lazy" />
  ) : (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">{initials(name)}</span>
  );
}
export function ProgressBlock({ c, settings, locale, big }: { c: Campaign; settings: Settings; locale: Locale; big?: boolean }) {
  const d = t(locale);
  const total = raised(c, c.progress, settings);
  const pct = c.goal_amount ? Math.min(100, Math.round((total / Number(c.goal_amount)) * 100)) : null;
  const other = otherCurrency(total, c.goal_currency, settings);
  return (
    <div className={big ? "progress-block big" : "progress-block"}>
      <p className="raised">
        <strong>{fmtMoney(total, c.goal_currency, locale)}</strong> <span>{d.campaign.reported}</span>
      </p>
      {pct !== null && (
        <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${pct}%`}>
          <span style={{ width: `${Math.max(pct, total > 0 ? 3 : 0)}%` }} />
        </div>
      )}
      <p className="small muted">
        {c.goal_amount ? `${pct}% ${d.common.of} ${fmtMoney(Number(c.goal_amount), c.goal_currency, locale)}` : d.campaign.noGoal}
        {big && total > 0 && ` (${d.common.approx} ${fmtMoney(other.amount, other.currency, locale)})`}
        {big && <>, {d.campaign.supporters(c.progress?.supporters ?? 0)}</>}
      </p>
    </div>
  );
}
export function Cover({ c, lite, sizes }: { c: Campaign; lite: boolean; sizes?: string }) {
  const url = lite ? null : mediaUrl(c.cover_path);
  return (
    <div className="cover">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" loading="lazy" decoding="async" sizes={sizes} />
      ) : (
        <span className="cover-empty" aria-hidden="true"><Icon name={causeIcon[c.cause ?? "other"] ?? "hand"} size={40} /></span>
      )}
    </div>
  );
}
export function CampaignCard({ c, locale, settings, cats, lite, wide }: { c: Campaign; locale: Locale; settings: Settings; cats: Category[]; lite: boolean; wide?: boolean }) {
  const d = t(locale);
  const place = [c.commune, c.department].filter(Boolean).join(", ");
  return (
    <article className={wide ? "c-card wide" : "c-card"}>
      <Link href={`/${locale}/campaigns/${c.slug}`} className="c-link" aria-label={c.title}>
        <Cover c={c} lite={lite} />
      </Link>
      <div className="c-body">
        <div className="row tight">
          {c.status === "completed" && <span className="badge done">{d.campaign.completed}</span>}
          {c.urgent && c.status === "live" && <span className="badge urgent">{d.campaign.urgent}</span>}
          {c.cause && <span className="chip">{causeName(cats, c.cause, locale)}</span>}
        </div>
        <h3><Link href={`/${locale}/campaigns/${c.slug}`}>{c.title}</Link></h3>
        {place && <p className="small muted place"><Icon name="pin" size={15} />{place}</p>}
        <ProgressBlock c={c} settings={settings} locale={locale} />
        <div className="c-foot">
          <TierBadge tier={c.tier} locale={locale} />
        </div>
      </div>
    </article>
  );
}
export function StatusPill({ status, locale }: { status: Campaign["status"]; locale: Locale }) {
  return <span className={`badge status-${status}`}>{t(locale).status[status]}</span>;
}
