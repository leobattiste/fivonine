"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { editorial } from "@/lib/editorial";
import { brief } from "@/lib/brief";
import type { CampaignContent } from "@/lib/domain";
import { ReviewForm } from "./Forms";
import Media from "./Media";
import SupportText from "./SupportText";
import type { AdminRecord } from "./AdminRecords";
export type QueueRecord = AdminRecord & {
  before?: CampaignContent;
  history?: { action: string; note: string | null; created_at: string }[];
};
export default function ReviewQueue({
  locale,
  rows,
}: {
  locale: Locale;
  rows: QueueRecord[];
}) {
  const [selected, setSelected] = useState(rows[0]?.id);
  const row = rows.find((r) => r.id === selected) ?? rows[0],
    d = t(locale),
    e = editorial[locale],
    b = brief[locale];
  if (!row) return null;
  const content = row.content;
  const fields: [keyof CampaignContent, string][] = [
    ["organizer_name", d.organizer],
    ["beneficiary", d.beneficiary],
    ["relationship", d.relationship],
    ["intended_use", d.use],
    ["distribution", d.distribution],
    ["support_text", d.support],
    ["fundraising_url", b.url],
  ];
  return (
    <div className="review-workspace">
      <nav className="review-queue-list" aria-label={b.admin[2]}>
        {rows.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setSelected(item.id)}
            aria-current={row.id === item.id ? "true" : undefined}
          >
            <span className="eyebrow">
              {item.kind === "revision" ? b.fundraiser : d.updates}
            </span>
            <strong>{item.title}</strong>
            <small>
              {new Date(item.created_at).toLocaleDateString(
                locale === "ht" ? "fr-HT" : locale,
              )}
            </small>
          </button>
        ))}
      </nav>
      <article className="review-document" key={row.id}>
        <header>
          <span className="status-pill">{d.pending}</span>
          <h2>{row.title}</h2>
          <p className="hint">{row.campaign_id}</p>
        </header>
        {content ? (
          <>
            <Media src={content.photo_url} alt={content.title} />
            <section className="prose">
              <h3>{d.story}</h3>
              <p className="preserve-lines">{content.story}</p>
            </section>
            <dl className="review-field-list">
              {fields.map(([key, label]) => {
                const value = content[key],
                  before = row.before?.[key],
                  changed = before !== undefined && before !== value;
                return (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>
                      {changed && (
                        <div className="previous-value">
                          <span>{e.published}</span>
                          <p>{String(before ?? "")}</p>
                        </div>
                      )}
                      {key === "support_text" || key === "fundraising_url" ? (
                        <SupportText text={String(value ?? "")} />
                      ) : (
                        <p>{String(value ?? "—")}</p>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </>
        ) : (
          <p className="preserve-lines">{row.body}</p>
        )}
        {!!row.history?.length && (
          <details className="review-history">
            <summary>{d.activity}</summary>
            {row.history.map((event, i) => (
              <div key={i}>
                <small>
                  {new Date(event.created_at).toLocaleString(
                    locale === "ht" ? "fr-HT" : locale,
                  )}{" "}
                  · {event.action}
                </small>
                <p>{event.note}</p>
              </div>
            ))}
          </details>
        )}
        <section className="review-decision">
          <p className="eyebrow">{e.reviewNotes}</p>
          <ReviewForm locale={locale} id={row.id} kind={row.kind} />
        </section>
      </article>
    </div>
  );
}
