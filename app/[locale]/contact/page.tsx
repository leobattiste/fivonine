import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { preview } from "@/lib/data";
import { MessageForm } from "@/components/Forms";
export default async function Contact({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  return (
    <section className="page narrow section">
      <header className="page-head">
        <h1>{d.contact}</h1>
        <p className="lead">{d.contactIntro}</p>
      </header>
      {preview && <p className="notice">{d.unavailable}</p>}
      <MessageForm locale={locale} enabled={!preview} />
    </section>
  );
}
