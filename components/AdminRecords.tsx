"use client";
import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { brief } from "@/lib/brief";
import { t, type Locale } from "@/lib/i18n";
import { initialState, type CampaignContent } from "@/lib/domain";
import { bulkModerate } from "@/app/actions";
import { ReviewForm } from "./Forms";
import SupportText from "./SupportText";
export type AdminRecord = {
  id: string;
  title: string;
  status: string;
  kind: "revision" | "update" | "campaign";
  created_at: string;
  content?: CampaignContent;
  body?: string;
  campaign_id?: string;
  note?: string;
};
export default function AdminRecords({
  locale,
  rows,
}: {
  locale: Locale;
  rows: AdminRecord[];
}) {
  const b = brief[locale],
    d = t(locale);
  const [selected, setSelected] = useState<string[]>([]);
  const [state, action, pending] = useActionState(bulkModerate, initialState);
  useEffect(() => {
    if (state.ok) setSelected([]);
  }, [state]);
  const isCampaign = rows[0]?.kind === "campaign";
  const hasUpdates = selected.some((key) => key.startsWith("update:"));
  return (
    <>
      <form
        action={action}
        id="bulk-review"
        onSubmit={() => setSelected((current) => current.slice(0, 25))}
      >
        <input type="hidden" name="locale" value={locale} />
        {selected.map((value) => (
          <input type="hidden" name="records" value={value} key={value} />
        ))}
        {selected.length > 0 && (
          <div className="bulk-toolbar">
            <strong>
              {selected.length} {b.selected}
            </strong>
            <input
              name="review_note"
              required
              maxLength={2000}
              placeholder={b.reason}
              aria-label={b.reason}
            />
            {(isCampaign
              ? ["suspend", "archive", "feature", "unfeature"]
              : hasUpdates
                ? ["approve", "decline"]
                : ["approve", "changes", "decline"]
            ).map((decision) => (
              <button
                className="button secondary"
                disabled={pending}
                name="decision"
                value={decision}
                key={decision}
              >
                {d[decision as "approve"]}
              </button>
            ))}
          </div>
        )}
        {state.message && (
          <p
            className={`notice ${state.ok ? "success" : "error"}`}
            role="status"
          >
            {state.message}
          </p>
        )}
      </form>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label={d.any}
                  checked={
                    selected.length > 0 &&
                    selected.length === Math.min(rows.length, 25)
                  }
                  onChange={(e) =>
                    setSelected(
                      e.target.checked
                        ? rows.slice(0, 25).map((r) => `${r.kind}:${r.id}`)
                        : [],
                    )
                  }
                />
              </th>
              <th>{d.title}</th>
              <th>{b.status}</th>
              <th>{b.created}</th>
              <th>{b.viewDetails}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const key = `${row.kind}:${row.id}`;
              return (
                <tr key={key}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(key)}
                      aria-label={`${d.title}: ${row.title}`}
                      disabled={
                        pending ||
                        (!selected.includes(key) && selected.length >= 25)
                      }
                      onChange={(e) =>
                        setSelected((current) =>
                          e.target.checked
                            ? [...current, key]
                            : current.filter((v) => v !== key),
                        )
                      }
                    />
                  </td>
                  <td>
                    <strong>{row.title}</strong>
                    {row.kind === "campaign" && row.status === "published" && (
                      <div>
                        <Link
                          className="text-link"
                          href={`/${locale}/campaigns/${row.id}`}
                        >
                          {d.explore} →
                        </Link>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="status-pill">
                      {d[row.status as "pending"] ?? row.status}
                    </span>
                  </td>
                  <td>
                    {new Date(row.created_at).toLocaleDateString(
                      locale === "ht" ? "fr-HT" : locale,
                    )}
                  </td>
                  <td>
                    <details>
                      <summary>{b.viewDetails}</summary>
                      {row.content && (
                        <dl className="review-details">
                          {Object.entries(row.content).map(([label, value]) => (
                            <div key={label}>
                              <dt>{label.replaceAll("_", " ")}</dt>
                              <dd>
                                {label === "support_text" ||
                                label === "fundraising_url" ? (
                                  <SupportText text={String(value ?? "")} />
                                ) : (
                                  String(value ?? "—")
                                )}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      {row.body && <p>{row.body}</p>}
                      {row.note && <p>{row.note}</p>}
                      <ReviewForm locale={locale} id={row.id} kind={row.kind} />
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
