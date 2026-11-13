import { METHODS } from "@/lib/constants";
import { fmtMoney, mediaUrl } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import type { Campaign, CampaignChange, Category, SupportMethod } from "@/lib/types";

/** Published version beside the proposed one, field by field, only where something changed. */
export default function Compare({ c, methods, change, locale, cats }: { c: Campaign; methods: SupportMethod[]; change: CampaignChange; locale: Locale; cats: Category[] }) {
  const d = t(locale), y = d.x.dash, r = change.payload.row as Record<string, unknown>;
  const show = (k: string, v: unknown): React.ReactNode => {
    if (v === null || v === undefined || v === "" || (Array.isArray(v) && !v.length)) return <span className="muted">—</span>;
    if (k === "cover_path") return <div className="frame" style={{ aspectRatio: "4/3", maxWidth: 200 }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={mediaUrl(String(v)) ?? ""} alt="" /></div>;
    if (k === "cause") return cats.find((x) => x.slug === v)?.[`name_${locale}`] ?? String(v);
    if (k === "goal_amount") return fmtMoney(Number(v), (r.goal_currency as "HTG" | "USD") ?? c.goal_currency, locale);
    if (k === "urgent") return v ? "✓" : "—";
    if (Array.isArray(v)) return `${v.length}`;
    return <span style={{ whiteSpace: "pre-wrap" }}>{String(v).length > 400 ? `${String(v).slice(0, 400)}…` : String(v)}</span>;
  };
  const keys = Object.keys(y.fields).filter((k) => k !== "methods" && k in r) as (keyof typeof y.fields)[];
  const diffs = keys.filter((k) => JSON.stringify((c as unknown as Record<string, unknown>)[k] ?? null) !== JSON.stringify(r[k] ?? null) && !(k === "goal_amount" && Number(c.goal_amount ?? 0) === Number(r[k] ?? 0)));
  const fmtM = (ms: { method: string; details: string; link?: string | null }[]) => ms.map((m) => `${METHODS.find((x) => x.id === m.method)?.name || d.support.other}: ${m.details}${m.link ? `\n${m.link}` : ""}`).join("\n\n");
  const methodsChanged = fmtM(methods) !== fmtM(change.payload.methods);
  return (
    <dl className="compare">
      <div className="labels"><span /><span>{y.published}</span><span>{y.proposed}</span></div>
      {diffs.map((k) => (
        <div key={k}><dt>{y.fields[k]}</dt><dd className="was"><span className="sr">{y.published}: </span>{show(k, (c as unknown as Record<string, unknown>)[k])}</dd><dd className="now"><span className="sr">{y.proposed}: </span>{show(k, r[k])}</dd></div>
      ))}
      {methodsChanged && <div><dt>{y.fields.methods}</dt><dd className="was" style={{ whiteSpace: "pre-wrap" }}>{fmtM(methods)}</dd><dd className="now" style={{ whiteSpace: "pre-wrap" }}>{fmtM(change.payload.methods)}</dd></div>}
      {!diffs.length && !methodsChanged && <div><dd className="muted">—</dd></div>}
    </dl>
  );
}
