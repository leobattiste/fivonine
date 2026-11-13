import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Icon from "@/components/Icon";
import ExploreShell from "@/components/Explore";
import { RememberResults } from "@/components/Bits";
import { FundraiserCard } from "@/components/Campaign";
import { getCategories, listCampaigns } from "@/lib/data";
import { DEPARTMENTS, PER_PAGE } from "@/lib/constants";
import { isLocale, t } from "@/lib/i18n";

type Search = { q?: string; cause?: string; place?: string; status?: string; emergency?: string; sort?: string; page?: string };
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).x.explore.title, description: t(locale).x.explore.sub } : {};
}
export default async function Explore({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Search> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams, d = t(locale), x = d.x.explore;
  const page = Math.max(1, Number(sp.page) || 1);
  const [cats] = await Promise.all([getCategories()]);
  const cause = cats.some((c) => c.slug === sp.cause) ? sp.cause : undefined;
  const place = (DEPARTMENTS as readonly string[]).includes(sp.place ?? "") ? sp.place : undefined;
  const status = sp.status === "completed" || sp.status === "all" ? sp.status : "open";
  const { items, total } = await listCampaigns({ q: sp.q, cause, department: place, status, emergency: sp.emergency === "1", sort: sp.sort, page });
  const filtered = Boolean(sp.q || cause || place || sp.status || sp.emergency);
  const pages = Math.ceil(total / PER_PAGE);
  const href = (p: number) => {
    const q = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
    if (p > 1) q.set("page", String(p));
    return `/${locale}/explore${q.toString() ? `?${q}` : ""}`;
  };
  const options = { causes: cats.map((c) => [c.slug, c[`name_${locale}`]] as [string, string]), places: DEPARTMENTS.map((p) => [p, p] as [string, string]) };
  return (
    <div className="wrap page" style={{ gap: 20 }}>
      <Suspense fallback={null}><RememberResults /></Suspense>
      <ExploreShell locale={locale} options={options} total={total}>
        {items.length ? (
          <div className="grid-cards">{items.map((c, i) => <FundraiserCard key={c.id} c={c} locale={locale} cats={cats} priority={i < 3} />)}</div>
        ) : (
          <div className="empty">
            <span className="icon-box"><Icon name="empty" size={26} /></span>
            <h2>{filtered ? x.emptyTitle : x.emptyAllTitle}</h2>
            <p>{filtered ? x.emptyBody : x.emptyAllBody}</p>
            <div className="row">
              {filtered && <Link className="btn" href={`/${locale}/explore`}>{x.clearAll}</Link>}
              <Link className="btn primary" href={`/${locale}/create`}><Icon name="plus" size={18} />{d.x.nav.share}</Link>
            </div>
          </div>
        )}
        {pages > 1 && (
          <nav className="pager" aria-label={x.page(page, pages)} style={{ marginTop: 32 }}>
            {page > 1 ? <Link className="btn" href={href(page - 1)}><Icon name="left" size={18} />{x.prev}</Link> : <span />}
            <span className="small muted">{x.page(page, pages)}</span>
            {page < pages ? <Link className="btn" href={href(page + 1)}>{x.next}<Icon name="right" size={18} /></Link> : <span />}
          </nav>
        )}
      </ExploreShell>
    </div>
  );
}
