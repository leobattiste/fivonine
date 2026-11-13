import Link from "next/link";
import Icon, { causeIcon } from "./Icon";
import { initials, mediaUrl } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import type { Campaign, Category, Tier } from "@/lib/types";
import { storyText } from "@/lib/story";

export const causeName = (cats: Category[], slug: string | null, locale: Locale) => {
  const c = cats.find((x) => x.slug === slug);
  return c ? c[`name_${locale}`] : "";
};
export const ownerName = (c: Campaign) => (c.owner ? (c.owner.kind === "organization" && c.owner.org_name ? c.owner.org_name : c.owner.display_name) : "");
export const place = (c: Pick<Campaign, "commune" | "department">) => [c.commune, c.department].filter(Boolean).join(", ");
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
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">{initials(name)}</span>
  );
}
export function Cover({ c, className = "", sizes = "(min-width: 900px) 33vw, 100vw", priority }: { c: Pick<Campaign, "cover_path" | "cause">; className?: string; sizes?: string; priority?: boolean }) {
  const url = mediaUrl(c.cover_path);
  return url ? (
    <div className={`frame ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" sizes={sizes} loading={priority ? "eager" : "lazy"} decoding="async" />
    </div>
  ) : (
    <div className={`frame empty ${className}`} aria-hidden="true"><Icon name={causeIcon[c.cause ?? "other"] ?? "hand"} size={44} /></div>
  );
}
export function FundraiserCard({ c, locale, cats, priority }: { c: Campaign; locale: Locale; cats: Category[]; priority?: boolean }) {
  const d = t(locale), where = place(c), who = ownerName(c);
  return (
    <article className="fcard">
      <div style={{ position: "relative" }}>
        <Cover c={c} priority={priority} />
        <div className="badges">
          {c.status === "completed" && <span className="tag solid">{d.campaign.completed}</span>}
          {c.urgent && c.status === "live" && <span className="tag solid">{d.campaign.urgent}</span>}
        </div>
      </div>
      <p className="meta">
        {c.cause && <span>{causeName(cats, c.cause, locale)}</span>}
        {where && <span><Icon name="pin" size={14} /> {where}</span>}
      </p>
      <h3><Link href={`/${locale}/campaigns/${c.slug}`}>{c.title}</Link></h3>
      {c.story && <p className="excerpt">{excerpt(c.story)}</p>}
      <ReviewChecks tier={c.tier} locale={locale} />
      <div className="foot">
        {who ? <p className="by"><Avatar name={who} path={c.owner?.avatar_path} size={26} /><span>{d.x.card.by} {who}</span></p> : <span />}
        <span className="go" aria-hidden="true"><Icon name="arrow" size={18} /></span>
      </div>
    </article>
  );
}
export function StatusPill({ status, locale }: { status: Campaign["status"]; locale: Locale }) {
  return <span className={`status ${status}`}>{t(locale).status[status]}</span>;
}
export function CardSkeleton() {
  return (
    <div className="fcard" aria-hidden="true">
      <div className="sk frame" style={{ aspectRatio: "4 / 3" }} />
      <div className="sk sk-line" style={{ width: "40%" }} />
      <div className="sk sk-line" style={{ height: 22, width: "85%" }} />
      <div className="sk sk-line" style={{ width: "95%" }} />
      <div className="sk sk-line" style={{ width: "70%" }} />
    </div>
  );
}
