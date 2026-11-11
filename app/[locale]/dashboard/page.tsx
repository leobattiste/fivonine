import { editorial } from "@/lib/editorial";
import Media from "@/components/Media";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { currentUser, ownCampaigns, preview } from "@/lib/data";
import { OrganizerRequest } from "@/components/Forms";
import ShareTools from "@/components/ShareTools";
import { platform } from "@/lib/platform-content";
import Icon from "@/components/Icon";
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
  const p = platform[locale];
  const user = await currentUser();
  if (!user) redirect(`/${locale}/login`);
  const campaigns = await ownCampaigns();
  return (
    <section className="page organizer-page">
      <header className="workspace-heading">
        <div>
          <p className="eyebrow">{editorial[locale].workspace}</p>
          <h1>{editorial[locale].overview}</h1>
        </div>
        <Link className="button" href={`/${locale}/submit`}>
          {d.create}
          <Icon name="plus" />
        </Link>
      </header>
      {user && (
        <div className="dashboard-account">
          <span>{user.email}</span>
          <form action={signOut}>
            <input type="hidden" name="locale" value={locale} />
            <button className="text-link danger">{d.signout}</button>
          </form>
        </div>
      )}
      {!campaigns.length && <EmptyState locale={locale} />}
      <div className="dashboard-list">
        {campaigns
          .toSorted(
            (a, b) =>
              Number(b.status === "needs_changes") -
              Number(a.status === "needs_changes"),
          )
          .map((c) => {
            const latest = c.campaign_revisions.toSorted((a, b) =>
              b.created_at.localeCompare(a.created_at),
            )[0];
            return (
              <article className="dashboard-card" key={c.id}>
                <div className="organizer-listing">
                  <Media
                    src={
                      c.public_content.photo_url ??
                      latest?.content.photo_url ??
                      ""
                    }
                    alt={latest?.content.title ?? c.public_content.title}
                  />
                  <div>
                    <span className="status-pill">
                      {d[c.status as "pending"] ?? c.status}
                    </span>
                    <h2>{latest?.content.title ?? c.public_content.title}</h2>
                    <p className="hint">
                      {c.status === "published"
                        ? editorial[locale].published
                        : editorial[locale].draftLabel}{" "}
                      ·{" "}
                      {new Date(c.updated_at).toLocaleDateString(
                        locale === "ht" ? "fr-HT" : locale,
                      )}
                    </p>
                  </div>
                </div>
                {c.status === "published" && latest?.status === "pending" && (
                  <p className="review-note">{editorial[locale].pending}</p>
                )}
                {latest?.review_note && (
                  <div className="review-note">
                    <span className="eyebrow">
                      {editorial[locale].reviewNotes}
                    </span>
                    <p>{latest.review_note}</p>
                  </div>
                )}
                <div className="actions">
                  <Link
                    className="text-link"
                    href={`/${locale}/dashboard/${c.id}/preview`}
                  >
                    {editorial[locale].preview}
                    <Icon name="arrowRight" />
                  </Link>
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
                {c.status === "published" && (
                  <details>
                    <summary>{p.share}</summary>
                    <ShareTools
                      locale={locale}
                      title={c.public_content.title}
                      path={`/${locale}/campaigns/${c.id}`}
                    />
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
