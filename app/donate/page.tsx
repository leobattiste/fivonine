import Link from "next/link";
import L from "@/components/L";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Help keep Fivonine free, independent and growing: research, sources, translation and the full history of Haiti.",
};

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL;

const USES = [
  { id: "r", title: <L en="Research" fr="Recherche" />, line: <L en="Finding, checking and sourcing every moment, decade by decade, until the record is complete." fr="Trouver, vérifier et sourcer chaque moment, décennie après décennie, jusqu’à ce que le registre soit complet." /> },
  { id: "a", title: <L en="Archives and images" fr="Archives et images" />, line: <L en="Access to archives, documents and photographs, and the rights to show them." fr="L’accès aux archives, aux documents et aux photographies, et les droits pour les montrer." /> },
  { id: "k", title: <L en="Kreyòl and French" fr="Kreyòl et français" />, line: <L en="Translating the whole site so it belongs to everyone it's about." fr="Traduire tout le site pour qu’il appartienne à toutes les personnes dont il parle." /> },
  { id: "f", title: <L en="Free for everyone" fr="Gratuit pour tous" />, line: <L en="No ads, no paywall. Running costs for hosting, email and tools." fr="Pas de publicité, pas de paywall. Les frais d’hébergement, de courriel et d’outils." /> },
];

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2"><L en="Donate" fr="Faire un don" /></h1>
      <p className="read mt-4">
        <L en="Fivonine is building the most complete record of Haitian history anywhere, free for anyone to read. Your support decides how fast it grows." fr="Fivonine construit le registre le plus complet de l’histoire d’Haïti, gratuit pour tous. Votre soutien décide de la vitesse à laquelle il grandit." />
      </p>

      <div className="mt-10 rounded-[2rem] bg-raise p-8 sm:p-12">
        {DONATE_URL ? (
          <>
            <p className="text-d-4"><L en="Give once or monthly." fr="Donnez une fois ou chaque mois." /></p>
            <p className="mt-2 max-w-lg text-dim"><L en="Every amount helps. You’ll complete your donation on our secure payment page." fr="Chaque montant compte. Vous finaliserez votre don sur notre page de paiement sécurisée." /></p>
            <a href={DONATE_URL} target="_blank" rel="noopener" className="btn btn-solid mt-6"><L en="Donate to Fivonine" fr="Faire un don à Fivonine" /></a>
          </>
        ) : (
          <>
            <p className="text-d-4"><L en="Online donations open soon." fr="Les dons en ligne ouvrent bientôt." /></p>
            <p className="mt-2 max-w-lg text-dim">
              <L en="To give now, or to support Fivonine as an organization, write to us and we’ll reply personally." fr="Pour donner dès maintenant, ou soutenir Fivonine en tant qu’organisation, écrivez-nous et nous répondrons personnellement." />
            </p>
            <a href="mailto:hello@fivonine.com?subject=Supporting%20Fivonine" className="btn btn-solid mt-6"><L en="Email" fr="Écrire à" /> hello@fivonine.com</a>
          </>
        )}
      </div>

      <section className="mt-20">
        <h2 className="text-d-3"><L en="Where your support goes" fr="À quoi sert votre soutien" /></h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {USES.map((u) => (
            <li key={u.id} className="rounded-2xl border border-rule p-6">
              <p className="text-lg">{u.title}</p>
              <p className="mt-2 text-dim">{u.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t border-rule pt-10">
        <h2 className="text-lg"><L en="Can’t give money?" fr="Vous ne pouvez pas donner d’argent ?" /></h2>
        <p className="mt-2 max-w-xl text-dim">
          <L en="Knowledge is just as valuable. Send a correction, a source, a family story or a person we’re missing." fr="Le savoir a tout autant de valeur. Envoyez une correction, une source, une histoire de famille ou une personne qui nous manque." />
        </p>
        <Link href="/contribute" className="btn btn-ghost mt-5"><L en="Contribute" fr="Contribuer" /></Link>
      </section>
    </div>
  );
}
