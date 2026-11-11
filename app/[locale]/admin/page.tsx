import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale, t, categoryKeys } from "@/lib/i18n";
import { brief } from "@/lib/brief";
import { isAdmin, currentUser, preview } from "@/lib/data";
import { getServerClient } from "@/lib/supabase/server";
import { guides, platform } from "@/lib/platform-content";
import Icon, { type IconName } from "@/components/Icon";
import AdminRecords, { type AdminRecord } from "@/components/AdminRecords";
import { ReviewForm } from "@/components/Forms";
export const metadata = { robots: { index: false, follow: false } };
const tabs = [
  "overview",
  "campaigns",
  "queue",
  "organizers",
  "reports",
  "organizations",
  "content",
  "analytics",
  "settings",
] as const;
const icons: IconName[] = [
  "overview",
  "heart",
  "reviews",
  "users",
  "flag",
  "organization",
  "content",
  "analytics",
  "settings",
];
export default async function Admin({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tab?: string;
    q?: string;
    status?: string;
    kind?: string;
  }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    b = brief[locale],
    p = platform[locale];
  if (!(await currentUser())) redirect(`/${locale}/login`);
  if (!(await isAdmin())) notFound();
  const db = preview ? null : await getServerClient(),
    sp = await searchParams;
  const tab = tabs.includes(sp.tab as (typeof tabs)[number])
    ? (sp.tab as (typeof tabs)[number])
    : "overview";
  const query = (sp.q ?? "").slice(0, 120),
    status = (sp.status ?? "").slice(0, 30);
  const contactMode = sp.kind === "contact";
  let audit: any[] = [];
  let rows: any[] = [],
    failure = false;
  let counts = { pending: 0, published: 0, reports: 0, total: 0 };
  if (db) {
    if (tab === "overview") {
      const results = await Promise.all([
        db
          .from("campaign_revisions")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        db
          .from("campaigns")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        db
          .from("reports")
          .select("id", { count: "exact", head: true })
          .eq("handled", false),
        db.from("campaigns").select("id", { count: "exact", head: true }),
        db
          .from("campaign_updates")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        db
          .from("review_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(25),
      ]);
      counts = {
        pending: (results[0].count ?? 0) + (results[4].count ?? 0),
        published: results[1].count ?? 0,
        reports: results[2].count ?? 0,
        total: results[3].count ?? 0,
      };
      audit = results[5].data ?? [];
      failure = results.some((r) => r.error);
    } else if (tab === "queue") {
      const [a, c] = await Promise.all([
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
        ...(a.data ?? []).map((r) => ({
          ...r,
          kind: "revision",
          title: r.content.title,
        })),
        ...(c.data ?? []).map((r) => ({ ...r, kind: "update" })),
      ];
      failure = !!a.error || !!c.error;
    } else if (
      [
        "campaigns",
        "organizers",
        "reports",
        "organizations",
        "analytics",
      ].includes(tab)
    ) {
      const table =
        tab === "organizers"
          ? "organizer_profiles"
          : tab === "reports"
            ? contactMode
              ? "contact_messages"
              : "reports"
            : tab === "analytics"
              ? "campaign_metrics"
              : "campaigns";
      let request = db.from(table).select("*").limit(100);
      if (tab === "analytics")
        request = request.order("outbound_clicks", { ascending: false });
      else request = request.order("created_at", { ascending: false });
      if (tab === "organizations")
        request = request.not("organization_reviewed_at", "is", null);
      if (tab === "campaigns" && status) request = request.eq("status", status);
      const result = await request;
      rows = result.data ?? [];
      failure = !!result.error;
    }
  }
  if (query)
    rows = rows.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(query.toLowerCase()),
    );
  const records: AdminRecord[] = rows.map((row) => ({
    id: row.id,
    title:
      row.title ?? row.public_content?.title ?? row.content?.title ?? row.id,
    status: row.status,
    kind: tab === "campaigns" ? "campaign" : row.kind,
    created_at: row.created_at,
    content: row.content ?? row.public_content,
    body: row.body,
    note: row.review_note,
  }));
  return (
    <section className="page section admin">
      <header className="page-head">
        <p className="eyebrow">{b.privateArea}</p>
        <h1>{d.admin}</h1>
      </header>
      <nav className="tabs" aria-label={d.admin}>
        {tabs.map((key, i) => (
          <Link
            key={key}
            href={`/${locale}/admin?tab=${key}`}
            aria-current={tab === key ? "page" : undefined}
          >
            <Icon name={icons[i]} />
            {b.admin[i]}
          </Link>
        ))}
      </nav>
      {failure && <p className="notice error">{d.errors}</p>}
      {tab === "overview" ? (
        <>
          <div className="admin-metrics">
            {[
              [b.pending, counts.pending],
              [b.published, counts.published],
              [b.unresolved, counts.reports],
              [b.admin[1], counts.total],
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
          <div className="actions">
            <Link className="button" href={`/${locale}/admin?tab=queue`}>
              {b.admin[2]}
              <Icon name="arrowRight" />
            </Link>
            <Link
              className="button secondary"
              href={`/${locale}/admin?tab=reports`}
            >
              {b.admin[4]}
            </Link>
          </div>
        </>
      ) : null}
      {[
        "campaigns",
        "queue",
        "organizers",
        "reports",
        "organizations",
        "analytics",
      ].includes(tab) && (
        <>
          <form className="admin-search">
            <input type="hidden" name="tab" value={tab} />
            {contactMode && <input type="hidden" name="kind" value="contact" />}
            <input
              name="q"
              aria-label={d.search}
              placeholder={d.searchHint}
              defaultValue={query}
            />
            {tab === "campaigns" && (
              <select name="status" defaultValue={status} aria-label={b.status}>
                <option value="">{d.any}</option>
                {[
                  "pending",
                  "published",
                  "needs_changes",
                  "suspended",
                  "archived",
                  "removal_requested",
                  "declined",
                ].map((s) => (
                  <option key={s} value={s}>
                    {d[s as "pending"] ?? s}
                  </option>
                ))}
              </select>
            )}
            <button className="button">{d.search}</button>
          </form>
          {!rows.length && <p className="empty">{b.noData}</p>}
        </>
      )}
      {rows.length > 0 && ["campaigns", "queue"].includes(tab) && (
        <AdminRecords locale={locale} rows={records} />
      )}
      {rows.length > 0 && tab === "organizers" && (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>{d.name}</th>
                <th>{d.email}</th>
                <th>{b.created}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.user_id}>
                  <td>{row.display_name}</td>
                  <td>{row.email}</td>
                  <td>{new Date(row.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "reports" && (
        <div className="actions admin-secondary-nav">
          <Link className="text-link" href={`/${locale}/admin?tab=reports`}>
            {d.reports}
          </Link>
          <Link
            className="text-link"
            href={`/${locale}/admin?tab=reports&kind=contact`}
          >
            {d.contact}
          </Link>
        </div>
      )}
      {tab === "reports" && (
        <div className="admin-grid">
          {rows.map((row) => (
            <article className="dashboard-card" key={row.id}>
              <span className="status-pill">
                {row.handled ? b.completed : d.pending}
              </span>
              <h2>{row.reason ?? row.name ?? d.contact}</h2>
              <p>{row.body}</p>
              <p className="hint">{row.email}</p>
              {row.campaign_id && (
                <Link
                  className="text-link"
                  href={`/${locale}/campaigns/${row.campaign_id}`}
                >
                  {d.explore} →
                </Link>
              )}
              {!row.handled && (
                <ReviewForm
                  locale={locale}
                  id={row.id}
                  kind={contactMode ? "contact" : "report"}
                />
              )}
            </article>
          ))}
        </div>
      )}
      {tab === "organizations" && (
        <>
          <p className="hint">{b.organizationNote}</p>
          <div className="dashboard-list">
            {rows.map((row) => (
              <article className="dashboard-card" key={row.id}>
                <h2>{row.public_content.organizer_name}</h2>
                <p>{row.public_content.title}</p>
                <span className="card-review">
                  <Icon name="check" />
                  {d.orgReviewed}
                </span>
                <Link
                  className="text-link"
                  href={`/${locale}/campaigns/${row.id}`}
                >
                  {d.explore} →
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
      {tab === "content" && (
        <>
          <h2>{b.contentNote}</h2>
          <div className="dashboard-list">
            {guides[locale].map((guide) => (
              <article className="dashboard-card" key={guide.slug}>
                <h3>{guide.title}</h3>
                <p className="hint">{guide.intro}</p>
                <Link
                  className="text-link"
                  href={`/${locale}/resources/${guide.slug}`}
                >
                  {p.guide} →
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
      {tab === "analytics" && rows.length > 0 && (
        <>
          <h2>{b.analyticsNote}</h2>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{d.title}</th>
                  <th>{b.outbound}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.campaign_id}>
                    <td>
                      <Link
                        className="text-link"
                        href={`/${locale}/campaigns/${row.campaign_id}`}
                      >
                        {row.campaign_id}
                      </Link>
                    </td>
                    <td>{row.outbound_clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === "overview" && audit.length > 0 && (
        <section className="audit-section">
          <h2>{d.activity}</h2>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{b.created}</th>
                  <th>{b.admin[2]}</th>
                  <th>{b.admin[3]}</th>
                  <th>{b.reason}</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {new Date(row.created_at).toLocaleString(
                        locale === "ht" ? "fr-HT" : locale,
                      )}
                    </td>
                    <td>{row.action}</td>
                    <td>{row.actor_id}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {tab === "settings" && (
        <>
          <h2>{b.settingsNote}</h2>
          <dl className="settings-list">
            <div>
              <dt>{d.sourceLanguage}</dt>
              <dd>Kreyòl · Français · English</dd>
            </div>
            <div>
              <dt>{d.categories}</dt>
              <dd>{categoryKeys.map((c) => d[c]).join(" · ")}</dd>
            </div>
            <div>
              <dt>{d.verification}</dt>
              <dd>{b.step2body}</dd>
            </div>
            <div>
              <dt>{d.disclosures}</dt>
              <dd>{d.disclosure}</dd>
            </div>
            <div>
              <dt>{p.resources}</dt>
              <dd>
                <Link href={`/${locale}/resources`}>{p.resources} →</Link>
              </dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
