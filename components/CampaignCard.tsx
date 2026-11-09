import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
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
          <div className="eyebrow">
            <span>{d[c.category]}</span>
            <span>{c.region}</span>
          </div>
          <h3>{c.title}</h3>
          <p className="card-story">{c.story}</p>
          <div className="card-bottom">
            <span>{c.organizer_name}</span>
            <Icon name="arrowRight" />
          </div>
        </div>
      </Link>
    </article>
  );
}
