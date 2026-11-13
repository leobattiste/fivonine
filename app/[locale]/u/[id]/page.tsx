import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { Avatar, FundraiserCard } from "@/components/Campaign";
import { getCategories, getProfile, listCampaigns } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";
import { isLite } from "@/lib/prefs";
type P = { params: Promise<{ locale: string; id: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  const p = await getProfile(id);
  return p ? { title: p.kind === "organization" && p.org_name ? p.org_name : p.display_name } : {};
}
export default async function ProfilePage({ params }: P) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const p = await getProfile(id);
  if (!p || p.banned) notFound();
  const d = t(locale);
  const [{ items }, cats, lite] = await Promise.all([listCampaigns({ owner: p.id, status: "all", perPage: 24 }), getCategories(true), isLite()]);
  const name = p.kind === "organization" && p.org_name ? p.org_name : p.display_name;
  return (
    <div className="wrap page">
      <header className="row" style={{ gap: 20, alignItems: "center" }}>
        <Avatar name={name} path={lite ? null : p.avatar_path} size={96} />
        <div className="stack tight">
          <h1>{name}</h1>
          <p className="f-meta">
            {p.org_verified && <span className="check-tag"><Icon name="badge" size={16} />{d.profile.verifiedOrg}</span>}
            {p.kind === "organization" && p.org_type && <span>{p.org_type}</span>}
            {(p.city || p.department) && <span><Icon name="pin" size={16} />{[p.city, p.department].filter(Boolean).join(", ")}</span>}
            <span>{d.profile.joined} {fmtDate(p.created_at, locale)}</span>
          </p>
          {p.bio && <p className="measure">{p.bio}</p>}
        </div>
      </header>
      <section className="stack"><h2>{d.profile.campaigns}</h2>
        {items.length ? <div className="grid-cards">{items.map((c) => <FundraiserCard key={c.id} c={c} locale={locale} cats={cats} lite={lite} />)}</div> : <div className="empty"><p>{d.profile.none}</p></div>}
      </section>
    </div>
  );
}
