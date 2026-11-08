import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { currentUser, ownCampaigns, preview } from "@/lib/data";
import { OrganizerRequest } from "@/components/Forms";
import { signOut } from "@/app/actions";
export const metadata = { robots: { index: false, follow: false } };
export default async function Dashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  const user = await currentUser();
  if (!user && !preview) redirect(`/${locale}/login`);
  const campaigns = await ownCampaigns();
  return (
    <section className="page narrow section">
      <header className="page-head">
        <h1>{d.manage}</h1>
        <p className="lead">{d.manageIntro}</p>
      </header>
      {preview && <p className="notice">{d.unavailable}</p>}
      {user && (
        <div className="dashboard-account">
          <span>{user.email}</span>
          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <button className="text-link danger">{d.signout}</button>
          </form>
        </div>
      )}
      <Link className="button" href={`/${locale}/submit`}>
        {d.create}
      </Link>
      {!campaigns.length && <p className="empty">{d.noCampaigns}</p>}
      <div className="dashboard-list">
        {campaigns.map((c) => {
          const latest = c.campaign_revisions.toSorted((a, b) =>
            b.created_at.localeCompare(a.created_at),
          )[0];
          return (
            <article className="dashboard-card" key={c.id}>
              <p className="eyebrow">{d[c.status as "pending"] ?? c.status}</p>
              <h2>{latest?.content.title ?? c.public_content.title}</h2>
              {c.status === "published" && latest?.status === "pending" && (
                <p className="notice">{d.pending}</p>
              )}
              {latest?.review_note && (
                <p className="notice">{latest.review_note}</p>
              )}
              <div className="actions">
                <Link
                  className="button secondary"
                  href={`/${locale}/dashboard/${c.id}/edit`}
                >
                  {d.edit}
                </Link>
                {c.status === "published" && (
                  <Link
                    className="text-link"
                    href={`/${locale}/campaigns/${c.id}`}
                  >
                    {d.explore} →
                  </Link>
                )}
              </div>
              {c.status === "published" && (
                <details>
                  <summary>{d.updates}</summary>
                  <OrganizerRequest locale={locale} id={c.id} />
                </details>
              )}
              {!["archived", "removal_requested"].includes(c.status) && (
                <details>
                  <summary className="danger">{d.requestRemoval}</summary>
                  <OrganizerRequest locale={locale} id={c.id} remove />
                </details>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
