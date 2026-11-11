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
  const extra =
    locale === "en"
      ? [
          {
            heading: "How long does review take?",
            body: "Review time depends on the information supplied and any follow-up needed. We do not promise a fixed turnaround. Check your submission status through your secure management link.",
          },
          {
            heading: "Can I edit my fundraiser?",
            body: "Yes. Open your campaign in the organizer area and submit your changes. Edits are reviewed before replacing the published information.",
          },
        ]
      : locale === "fr"
        ? [
            {
              heading: "Combien de temps prend l’examen ?",
              body: "Le délai dépend des informations et des précisions nécessaires. Aucun délai fixe n’est garanti. Consultez le statut avec votre lien de gestion sécurisé.",
            },
            {
              heading: "Puis-je modifier ma collecte ?",
              body: "Oui. Ouvrez votre collecte dans votre espace et soumettez les modifications. Elles sont examinées avant de remplacer les informations publiées.",
            },
          ]
        : [
            {
              heading: "Konbyen tan revizyon an pran?",
              body: "Tan an depann de enfòmasyon ak lòt detay ekip la bezwen. Nou pa garanti yon delè fiks. Sèvi ak lyen jesyon sekirize w la pou swiv estati a.",
            },
            {
              heading: "Èske mwen ka modifye kanpay mwen?",
              body: "Wi. Louvri kanpay ou nan espas òganizatè a epi soumèt chanjman yo. Yo pase revizyon anvan yo ranplase enfòmasyon ki pibliye yo.",
            },
          ];
  return (
    <article className="page narrow section">
      <header className="page-head">
        <p className="eyebrow">{d.tagline}</p>
        <h1>{d.help}</h1>
      </header>
      <HelpTopics locale={locale} topics={[...helpCopy[locale], ...extra]} />
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
