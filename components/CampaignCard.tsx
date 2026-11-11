import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import type { Campaign } from "@/lib/domain";
import Media from "./Media";
import Icon from "./Icon";
export default function CampaignCard({
  campaign,
  locale,
  priority = false,
}: {
  campaign: Campaign;
  locale: Locale;
  priority?: boolean;
}) {
  const d = t(locale),
    b = brief[locale],
    c = campaign.public_content;
  return (
    <article className="campaign-card">
      <Link href={`/${locale}/campaigns/${campaign.id}`}>
        <Media
          src={c.photo_url}
          alt={c.title}
          category={c.category}
          priority={priority}
        />
        <div className="card-content">
          <p className="eyebrow">{d[c.category]}</p>
          <h3>{c.title}</h3>
          <p className="card-location">
            {c.region}, {c.country}
          </p>
          <p className="card-story">{c.story}</p>
          <div className="card-bottom">
            <span>
              <Icon name="user" />
              {c.organizer_name}
            </span>
            <Icon name="arrowRight" />
          </div>
          {campaign.contact_confirmed && (
            <p className="card-review">
              <Icon name="check" />
              {d.emailConfirmed}
            </p>
          )}
          {campaign.links_checked_at && (
            <p className="card-review">
              {b.reviewed}{" "}
              {new Date(campaign.links_checked_at).toLocaleDateString(
                locale === "ht" ? "fr-HT" : locale,
              )}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
