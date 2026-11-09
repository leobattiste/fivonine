import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
import { helpCopy } from "@/lib/content";
import HelpTopics from "@/components/HelpTopics";
import { platform } from "@/lib/platform-content";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale);
  const p = platform[locale];
  return (
    <article className="page narrow section">
      <header className="page-head">
        <p className="eyebrow">{d.tagline}</p>
        <h1>{d.help}</h1>
      </header>
      <HelpTopics locale={locale} topics={helpCopy[locale]} />
      <div className="help-shortcuts">
        <Link href={`/${locale}/resources`}>{p.resources} →</Link>
        <Link href={`/${locale}/safety`}>{p.safety} →</Link>
        <Link href={`/${locale}/pricing`}>{p.pricing} →</Link>
      </div>
      <Link className="button secondary" href={`/${locale}/contact`}>
        {d.contact}
      </Link>
    </article>
  );
}
