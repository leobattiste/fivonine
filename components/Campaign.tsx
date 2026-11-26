import Link from "next/link";
import Icon, { causeIcon } from "./Icon";
import { fmtMoney, initials, mediaUrl, campaignPlace } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import type { Campaign, Category, Tier } from "@/lib/types";
import { storyText } from "@/lib/story";

export const causeName = (cats: Category[], slug: string | null, locale: Locale) => {
  const c = cats.find((x) => x.slug === slug);
  return c ? c[`name_${locale}`] : "";
};
export const ownerName = (c: Campaign) => (c.owner ? (c.owner.kind === "organization" && c.owner.org_name ? c.owner.org_name : c.owner.display_name) : "");
export const place = (c: Pick<Campaign, "commune" | "department" | "country_code">, locale: Locale = "en") => campaignPlace(c, locale);
export const excerpt = (story: string, n = 170) => {
  const s = storyText(story).replace(/\s+/g, " ").trim();
  return s.length > n ? `${s.slice(0, n).replace(/\s+\S*$/, "")}…` : s;
};
/** Review indicators appear only for checks our team actually completed. */
export function ReviewChecks({ tier, locale, withHelp }: { tier: Tier; locale: Locale; withHelp?: boolean }) {
  if (tier === "none") return null;
  const d = t(locale);
  return <span className="check-tag" title={d.tierHelp[tier]}><Icon name="badge" size={16} />{d.tiers[tier]}{withHelp && <span className="sr">. {d.tierHelp[tier]}</span>}</span>;
}
export function Avatar({ name, path, size = 28 }: { name: string; path?: string | null; size?: number }) {
  const url = mediaUrl(path);
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="avatar" src={url} alt="" width={size} height={size} style={{ width: size, height: size }} loading="lazy" />
  ) : (
    <span className="avatar" style={{ width: size, height: size }} aria-hidden="true">{initials(name)}</span>
  );
}
/** Attribution for Pexels stock photography used exclusively by example drafts. */
const pexelsDemoCredits: Record<string, string> = {
  "28503361": "The Design Lady",
  "27176065": "Helena Lopes",
  "8942700": "Mikhail Nilov",
  "5125690": "Roger Brown",
  "5905446": "Katerina Holmes",
  "3030281": "K",
};
export function Cover({ c, className = "", sizes = "(min-width: 900px) 33vw, 100vw", priority, noIconFallback = false }: { c: Pick<Campaign, "cover_path" | "cause">; className?: string; sizes?: string; priority?: boolean; noIconFallback?: boolean }) {
  const url = mediaUrl(c.cover_path);
  const pexelsId = /^pexels:([0-9]{4,10})$/.exec(c.cover_path ?? "")?.[1];
  return url ? (
    <div className={`frame ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={pexelsId ? "Illustrative stock photo, not a real fundraiser beneficiary" : ""} sizes={sizes} loading={priority ? "eager" : "lazy"} decoding="async" />
      {pexelsId && <a className="credit-over" href={`https://www.pexels.com/photo/${pexelsId}/`} target="_blank" rel="noopener noreferrer">
        {pexelsDemoCredits[pexelsId] ?? "Photographer"} / Pexels
      </a>}
    </div>
  ) : (
    <div className={`frame empty ${className}`} aria-hidden="true">{!noIconFallback && <Icon name={causeIcon[c.cause ?? "other"] ?? "hand"} size={44} />}</div>
  );
}
export function FundraiserCard({ c, locale, cats, priority, simplified = false }: { c: Campaign; locale: Locale; cats: Category[]; priority?: boolean; simplified?: boolean }) {
  const d = t(locale), where = place(c, locale), cause = causeName(cats, c.cause, locale);
  if (simplified) {
    return (
      <article className="fcard fcard-simple">
        <Cover c={c} priority={priority} noIconFallback />
        <div className="fcard-details">
          <h3><Link href={`/${locale}/campaigns/${c.slug}`}>{c.title}</Link></h3>
          {(cause || where) && <p className="fcard-meta">{cause}{cause && where ? " · " : ""}{where}</p>}
        </div>
      </article>
    );
  }
  const amount = c.goal_amount ? fmtMoney(Number(c.goal_amount), c.goal_currency, locale) : null;
  return (
    <article className="fcard">
      <div style={{ position: "relative" }}>
        <Cover c={c} priority={priority} />
        {c.status === "completed" && <div className="badges"><span className="tag solid">{d.campaign.completed}</span></div>}
      </div>
      {cause && <p className="meta"><span>{cause}</span></p>}
      <h3><Link href={`/${locale}/campaigns/${c.slug}`}>{c.title}</Link></h3>
      <p className="foot">
        <span className="where">{where && <><Icon name="pin" size={15} />{where}</>}</span>
        <span className="amount">{amount ?? <span className="muted">{d.x.card.noGoal}</span>}</span>
      </p>
    </article>
  );
}
export function StatusPill({ status, locale }: { status: Campaign["status"]; locale: Locale }) {
  return <span className={`status ${status}`}>{t(locale).status[status]}</span>;
}
export function CardSkeleton() {
  return (
    <div className="fcard" aria-hidden="true">
      <div className="sk frame" style={{ aspectRatio: "1 / 1" }} />
      <div className="sk sk-line" style={{ width: "40%" }} />
      <div className="sk sk-line" style={{ height: 22, width: "85%" }} />
      <div className="sk sk-line" style={{ width: "95%" }} />
      <div className="sk sk-line" style={{ width: "70%" }} />
    </div>
  );
}
