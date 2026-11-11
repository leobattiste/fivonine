import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { editorial } from "@/lib/editorial";
import JourneyGuide from "@/components/JourneyGuide";
export default async function How({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    e = editorial[locale];
  return (
    <article className="page section how-page">
      <header className="page-head">
        <p className="eyebrow">{d.how}</p>
        <h1>{e.howTitle}</h1>
      </header>
      <div className="how-layout">
        <aside>
          <p>{e.intro}</p>
          <p className="disclosure">{d.disclosure}</p>
        </aside>
        <JourneyGuide locale={locale} />
      </div>
    </article>
  );
}
