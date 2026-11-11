import Link from "next/link";
import { editorial } from "@/lib/editorial";
import { t, type Locale } from "@/lib/i18n";
import Icon from "./Icon";
export default function EmptyState({
  locale,
  filtered = false,
  clearHref,
}: {
  locale: Locale;
  filtered?: boolean;
  clearHref?: string;
}) {
  const e = editorial[locale],
    d = t(locale);
  return (
    <div className="empty-state">
      <span className="empty-symbol">
        <Icon name={filtered ? "search" : "users"} />
      </span>
      <div>
        <h2>{filtered ? e.noMatches : e.empty}</h2>
        <p>{filtered ? e.noMatchesBody : e.emptyBody}</p>
        <Link
          className="text-link"
          href={
            filtered ? (clearHref ?? `/${locale}/explore`) : `/${locale}/submit`
          }
        >
          {filtered ? e.clear : d.create}
          <Icon name="arrowRight" />
        </Link>
      </div>
    </div>
  );
}
