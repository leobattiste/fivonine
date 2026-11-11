import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { CampaignCard } from "@/components/Campaign";
import { getCategories, getSettings, listCampaigns } from "@/lib/data";
import { DEPARTMENTS, PER_PAGE } from "@/lib/constants";
import { isLocale, t } from "@/lib/i18n";
import { isLite } from "@/lib/prefs";

type Search = { q?: string; cause?: string; place?: string; verified?: string; urgent?: string; completed?: string; emergency?: string; sort?: string; page?: string };
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).donate.title } : {};
}
export default async function Donate({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Search> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams, d = t(locale), x = d.donate;
  const page = Math.max(1, Number(sp.page) || 1);
  const [cats, settings, lite] = await Promise.all([getCategories(), getSettings(), isLite()]);
  const cause = cats.some((c) => c.slug === sp.cause) ? sp.cause : undefined;
  const place = (DEPARTMENTS as readonly string[]).includes(sp.place ?? "") ? sp.place : undefined;
  const { items, total } = await listCampaigns({ q: sp.q, cause, department: place, verified: sp.verified === "1", urgent: sp.urgent === "1", completed: sp.completed === "1", emergency: sp.emergency === "1", sort: sp.sort, page });
  const filtered = Boolean(sp.q || cause || place || sp.verified || sp.urgent || sp.completed || sp.emergency);
  const pages = Math.ceil(total / PER_PAGE);
  const href = (p: number) => {
    const q = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return `/${locale}/donate${s ? `?${s}` : ""}`;
  };
  return (
    <div className="wrap page">
      <header className="page-head">
        <h1>{x.title}</h1>
        <p className="lead">{x.sub}</p>
      </header>
      <form className="filters" method="get" action={`/${locale}/donate`} role="search">
        <label className="search">
          <Icon name="search" />
          <span className="sr">{x.search}</span>
          <input name="q" type="search" defaultValue={sp.q ?? ""} placeholder={x.searchHint} maxLength={60} />
          <button className="btn primary small">{x.search}</button>
        </label>
        <div className="filter-row">
          <label className="field"><span>{x.cause}</span>
            <select className="input" name="cause" defaultValue={cause ?? ""}><option value="">{x.allCauses}</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c[`name_${locale}`]}</option>)}</select>
          </label>
          <label className="field"><span>{x.place}</span>
            <select className="input" name="place" defaultValue={place ?? ""}><option value="">{x.allPlaces}</option>{DEPARTMENTS.map((p) => <option key={p}>{p}</option>)}</select>
          </label>
          <label className="field"><span>{x.sort}</span>
            <select className="input" name="sort" defaultValue={sp.sort ?? "newest"}><option value="newest">{x.newest}</option><option value="updated">{x.updated}</option><option value="urgent">{x.urgentFirst}</option></select>
          </label>
          <div className="filter-checks">
            <label className="check"><input type="checkbox" name="verified" value="1" defaultChecked={sp.verified === "1"} /><span>{x.verifiedOnly}</span></label>
            <label className="check"><input type="checkbox" name="urgent" value="1" defaultChecked={sp.urgent === "1"} /><span>{x.urgentOnly}</span></label>
            <label className="check"><input type="checkbox" name="completed" value="1" defaultChecked={sp.completed === "1"} /><span>{x.completedToo}</span></label>
          </div>
          <div className="row">
            <button className="btn small">{x.apply}</button>
            {filtered && <Link className="btn small ghost" href={`/${locale}/donate`}>{x.clear}</Link>}
          </div>
        </div>
      </form>
      <p className="muted small" aria-live="polite">{x.results(total)}</p>
      {items.length ? (
        <div className="card-grid">
          {items.map((c) => <CampaignCard key={c.id} c={c} locale={locale} settings={settings} cats={cats} lite={lite} />)}
        </div>
      ) : (
        <div className="empty">
          <h2>{filtered ? x.emptyTitle : x.emptyAll}</h2>
          {filtered ? <><p>{x.emptyBody}</p><Link className="btn" href={`/${locale}/donate`}>{x.clear}</Link></> : <Link className="btn primary" href={`/${locale}/create`}>{d.home.create}</Link>}
        </div>
      )}
      {pages > 1 && (
        <nav className="pager" aria-label={d.common.page}>
          {page > 1 ? <Link className="btn small" href={href(page - 1)}>{d.common.previous}</Link> : <span />}
          <span className="small muted">{d.common.page} {page} {d.common.of} {pages}</span>
          {page < pages ? <Link className="btn small" href={href(page + 1)}>{d.common.next}</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
