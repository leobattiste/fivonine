import Link from "next/link";
import Icon from "./Icon";
import { guides, platform } from "@/lib/platform-content";
import type { Locale } from "@/lib/i18n";
export default function ResourceCards({
  locale,
  limit = 6,
}: {
  locale: Locale;
  limit?: number;
}) {
  return (
    <div className="resource-grid">
      {guides[locale].slice(0, limit).map((guide, i) => (
        <Link
          className="resource-card"
          key={guide.slug}
          href={`/${locale}/resources/${guide.slug}`}
        >
          <span className="resource-index">0{i + 1}</span>
          <h3>{guide.title}</h3>
          <p>{guide.intro}</p>
          <span className="text-link">
            {platform[locale].guide}
            <Icon name="arrowRight" />
          </span>
        </Link>
      ))}
    </div>
  );
}
