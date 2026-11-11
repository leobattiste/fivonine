import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { editorial } from "@/lib/editorial";
import { preview } from "@/lib/data";
import { MessageForm } from "@/components/Forms";
export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    e = editorial[locale];
  return (
    <section className="page section contact-page">
      <div className="task-layout">
        <header className="task-aside">
          <p className="eyebrow">{d.contact}</p>
          <h1>{e.contactTitle}</h1>
          <p className="lead">{e.contactAside}</p>
        </header>
        <div className="task-surface">
          <MessageForm locale={locale} enabled={!preview} />
        </div>
      </div>
    </section>
  );
}
