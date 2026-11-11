"use client";
import { useState } from "react";
import Link from "next/link";
import { brief } from "@/lib/brief";
import { editorial } from "@/lib/editorial";
import { t, type Locale } from "@/lib/i18n";
import Icon from "./Icon";
const supporterSteps = {
  en: [
    [
      "Find your cause",
      "Search by a name, a place, or the kind of help you want to offer.",
    ],
    [
      "Get to know the story",
      "Read the organizer’s story, intended use, recipient details, and completed review checks.",
    ],
    [
      "Choose how to help",
      "Follow the organizer’s instructions on their external provider, or share the campaign with your community.",
    ],
  ],
  fr: [
    [
      "Trouvez votre cause",
      "Cherchez un nom, un lieu ou le type d’aide que vous souhaitez apporter.",
    ],
    [
      "Découvrez l’histoire",
      "Lisez le récit, l’utilisation prévue, les bénéficiaires et les contrôles effectués.",
    ],
    [
      "Choisissez comment aider",
      "Suivez les instructions sur le service externe ou partagez la collecte autour de vous.",
    ],
  ],
  ht: [
    [
      "Jwenn koz pa w la",
      "Chèche yon non, yon kote, oswa kalite èd ou vle bay la.",
    ],
    [
      "Konnen istwa a",
      "Li istwa òganizatè a, itilizasyon sipò a, benefisyè yo ak verifikasyon ki fèt yo.",
    ],
    [
      "Chwazi kijan pou ede",
      "Swiv enstriksyon yo sou sèvis ekstèn nan oswa pataje kanpay la ak kominote w.",
    ],
  ],
};
export default function JourneyGuide({ locale }: { locale: Locale }) {
  const [mode, setMode] = useState<"organizer" | "supporter">("organizer"),
    b = brief[locale],
    e = editorial[locale],
    d = t(locale);
  const rows =
    mode === "organizer"
      ? [1, 2, 3].map((n) => [
          b[`step${n}` as "step1"],
          b[`step${n}body` as "step1body"],
        ])
      : supporterSteps[locale];
  return (
    <>
      <div className="journey-tabs" role="tablist" aria-label={d.how}>
        {(["organizer", "supporter"] as const).map((key) => (
          <button
            role="tab"
            id={`tab-${key}`}
            aria-controls={`panel-${key}`}
            aria-selected={mode === key}
            tabIndex={mode === key ? 0 : -1}
            key={key}
            onClick={() => setMode(key)}
            onKeyDown={(ev) => {
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(ev.key)) {
                ev.preventDefault();
                const next = key === "organizer" ? "supporter" : "organizer";
                setMode(next);
                requestAnimationFrame(() =>
                  document.getElementById(`tab-${next}`)?.focus(),
                );
              }
            }}
          >
            {e[key]}
            <Icon name="arrowRight" />
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${mode}`}
        aria-labelledby={`tab-${mode}`}
        className="journey-panel"
        tabIndex={0}
      >
        {rows.map(([title, body], i) => (
          <section key={title}>
            <span className="journey-number">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
        <div className="actions">
          <Link
            className="button"
            href={`/${locale}/${mode === "organizer" ? "submit" : "explore"}`}
          >
            {mode === "organizer" ? d.create : d.browse}
            <Icon name="arrowRight" />
          </Link>
          <Link className="text-link" href={`/${locale}/help`}>
            {d.help}
            <Icon name="arrowRight" />
          </Link>
        </div>
      </div>
    </>
  );
}
