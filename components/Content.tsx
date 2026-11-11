import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
type Key = "safety" | "terms" | "privacy" | "guidelines" | "help";
export const contentMeta = (key: Key) => async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).pages[key].title, description: t(locale).pages[key].sub } : {};
};
export async function ContentPage({ params, page }: { params: Promise<{ locale: string }>; page: Key }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const p = t(locale).pages[page];
  return (
    <div className="wrap page narrow">
      <header className="page-head"><h1>{p.title}</h1><p className="lead">{p.sub}</p></header>
      <div className={page === "help" ? "faq" : "prose"}>
        {p.sections.map(([h, body]) => page === "help" ? (
          <details key={h}><summary>{h}</summary><p>{body}</p></details>
        ) : (
          <section key={h}><h2>{h}</h2><p>{body}</p></section>
        ))}
      </div>
    </div>
  );
}
