import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { isAdmin, currentUser, preview } from "@/lib/data";
import { getServerClient } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/Forms";
import SupportText from "@/components/SupportText";
import type { CampaignContent } from "@/lib/domain";
export const metadata = { robots: { index: false, follow: false } };
export default async function Admin({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  if (!preview) {
    if (!(await currentUser())) redirect(`/${locale}/login`);
    if (!(await isAdmin())) notFound();
  }
  const db = preview ? null : await getServerClient();
  const sp = await searchParams;
  const tab = ["queue", "campaigns", "reports", "contact", "activity"].includes(
    sp.tab ?? "",
  )
    ? sp.tab!
    : "queue";
  const query = (sp.q ?? "").slice(0, 120);
  let rows: any[] = [];
  let error = false;
  if (db) {
    if (tab === "queue") {
      const [a, b] = await Promise.all([
        db
          .from("campaign_revisions")
          .select("*")
          .eq("status", "pending")
          .order("created_at")
          .limit(100),
        db
          .from("campaign_updates")
          .select("*")
          .eq("status", "pending")
          .order("created_at")
          .limit(100),
      ]);
      rows = [
        ...(a.data ?? []).map((r) => ({ ...r, kind: "revision" })),
        ...(b.data ?? []).map((r) => ({ ...r, kind: "update" })),
      ];
      error = !!a.error || !!b.error;
    } else {
      const table =
        tab === "campaigns"
          ? "campaigns"
          : tab === "reports"
            ? "reports"
            : tab === "contact"
              ? "contact_messages"
              : "review_events";
      const result = await db
        .from(table)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      rows = result.data ?? [];
      error = !!result.error;
    }
  }
  if (query)
    rows = rows.filter((r) =>
      JSON.stringify(r).toLowerCase().includes(query.toLowerCase()),
    );
  return (
    <section className="page section admin">
      <header className="page-head">
        <p className="eyebrow">fivonine / {d.admin}</p>
        <h1>{d.admin}</h1>
      </header>
      {preview && <p className="notice">{d.unavailable}</p>}
      <nav className="tabs" aria-label={d.admin}>
        {(
          ["queue", "campaigns", "reports", "contact", "activity"] as const
        ).map((k) => (
          <Link
            key={k}
            href={`/${locale}/admin?tab=${k}`}
            aria-current={tab === k ? "page" : undefined}
          >
            {d[k]}
          </Link>
        ))}
      </nav>
      <form className="explore-filters">
        <input type="hidden" name="tab" value={tab} />
        <input
          name="q"
          aria-label={d.search}
          placeholder={d.searchHint}
          defaultValue={query}
        />
        <button className="button">{d.search}</button>
      </form>
      {error && <p className="notice error">{d.errors}</p>}
      {!rows.length && (
        <p className="empty">{preview ? d.unavailable : d.empty}</p>
      )}
      <div className="admin-grid">
        {rows.map((r) => (
          <article className="dashboard-card" key={r.id}>
            {tab === "queue" && r.kind === "revision" ? (
              <>
                <h2>{r.content.title}</h2>
                <dl className="review-details">
                  {Object.entries(r.content as CampaignContent).map(
                    ([key, value]) => (
                      <div key={key}>
                        <dt>{key.replace(/_/g, " ")}</dt>
                        <dd className="preserve-lines">
                          {key === "support_text" ? (
                            <SupportText text={String(value)} />
                          ) : (
                            String(value ?? "—")
                          )}
                        </dd>
                      </div>
                    ),
                  )}
                </dl>
                <ReviewForm locale={locale} id={r.id} kind="revision" />
              </>
            ) : tab === "queue" ? (
              <>
                <h2>{r.title}</h2>
                <p className="preserve-lines">{r.body}</p>
                <ReviewForm locale={locale} id={r.id} kind="update" />
              </>
            ) : tab === "campaigns" ? (
              <>
                <p className="eyebrow">{r.status}</p>
                <h2>{r.public_content.title ?? r.id}</h2>
                {r.status === "published" && (
                  <Link
                    className="text-link"
                    href={`/${locale}/campaigns/${r.id}`}
                  >
                    {d.explore} →
                  </Link>
                )}
                <ReviewForm locale={locale} id={r.id} kind="campaign" />
              </>
            ) : tab === "reports" || tab === "contact" ? (
              <>
                <p className="eyebrow">{r.handled ? "✓" : d.pending}</p>
                <h2>{r.reason ?? r.name ?? d.contact}</h2>
                <p>{r.email}</p>
                <p className="preserve-lines">{r.body}</p>
                {r.campaign_id && (
                  <Link
                    className="text-link"
                    href={`/${locale}/campaigns/${r.campaign_id}`}
                  >
                    {d.campaigns}
                  </Link>
                )}
                {!r.handled && (
                  <ReviewForm
                    locale={locale}
                    id={r.id}
                    kind={tab === "reports" ? "report" : "contact"}
                  />
                )}
              </>
            ) : (
              <>
                <p className="eyebrow">
                  {new Date(r.created_at).toLocaleString()}
                </p>
                <h3>{r.action}</h3>
                <p>{r.note}</p>
              </>
            )}
          </article>
        ))}
      </div>
      <p className="hint">
        {locale === "ht"
          ? "Jiska 100 dosye nan chak lis."
          : locale === "fr"
            ? "Jusqu’à 100 dossiers par liste."
            : "Up to 100 records per list."}
      </p>
    </section>
  );
}
