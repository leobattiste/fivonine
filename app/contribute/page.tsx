import type { Metadata } from "next";
import ContributeForm from "@/components/ContributeForm";

import L from "@/components/L";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Send corrections, missing moments and people, sources, family stories and ideas to help complete Haiti's history.",
};

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2"><L en="Contribute" fr="Contribuer" /></h1>
      <p className="read mt-4">
        <L en="Haiti’s history lives in archives, in books and in families. Help us complete it: point out what’s wrong, tell us what’s missing, share a source or a story." fr="L’histoire d’Haïti vit dans les archives, dans les livres et dans les familles. Aidez-nous à la compléter : signalez ce qui est faux, dites-nous ce qui manque, partagez une source ou une histoire." />
      </p>
      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_20rem]">
        <ContributeForm />
        <aside className="space-y-8 text-[0.95rem] lg:pt-12">
          <div>
            <p className="font-semibold"><L en="How we use contributions" fr="Comment nous utilisons les contributions" /></p>
            <p className="mt-2 text-dim">
              <L en="Every suggestion is checked against sources before anything is added. Family stories may be published only with your permission." fr="Chaque suggestion est vérifiée auprès des sources avant tout ajout. Les histoires de famille ne sont publiées qu’avec votre permission." />
            </p>
          </div>
          <div>
            <p className="font-semibold"><L en="The most helpful details" fr="Les détails les plus utiles" /></p>
            <p className="mt-2 text-dim"><L en="Dates, places, full names, and where you learned it: a book, an archive, a newspaper, a relative." fr="Dates, lieux, noms complets, et où vous l’avez appris : un livre, des archives, un journal, un proche." /></p>
          </div>
          <div>
            <p className="font-semibold"><L en="Prefer email?" fr="Vous préférez le courriel ?" /></p>
            <a href="mailto:hello@fivonine.com" className="mt-2 inline-block text-dim underline underline-offset-4 hover:text-fg">hello@fivonine.com</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
