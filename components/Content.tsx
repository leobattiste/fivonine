import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
type Key = "safety" | "terms" | "privacy" | "guidelines" | "help";
export const contentMeta = (key: Key) => async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).pages[key].title, description: t(locale).pages[key].sub } : {};
};
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** Policies read as documents: a table of contents beside a readable column. */
export async function ContentPage({ params, page }: { params: Promise<{ locale: string }>; page: Exclude<Key, "help" | "safety"> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale), p = d.pages[page];
  return (
    <div className="wrap page">
      <header className="page-head"><h1>{p.title}</h1><p className="lead">{p.sub}</p></header>
      <div className="doc">
        <nav className="toc" aria-label={d.x.pages.toc}><p>{d.x.pages.toc}</p>{p.sections.map(([h]) => <a key={h} href={`#${slug(h)}`}>{h}</a>)}</nav>
        <div className="prose">{p.sections.map(([h, body]) => <section key={h} id={slug(h)}><h2>{h}</h2><p>{body}</p></section>)}</div>
      </div>
    </div>
  );
}
