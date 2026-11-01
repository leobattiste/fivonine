import Link from "next/link";
import type { Metadata } from "next";
import { getContent } from "@/lib/data";
import { DIMENSIONS } from "@/lib/site";

import L from "@/components/L";

export const metadata: Metadata = {
  title: "About",
  description: "What Fivonine is, how it's organized, and the editorial standards behind every entry.",
};

export default async function AboutPage() {
  const c = await getContent();
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2"><L en="About Fivonine" fr="À propos de Fivonine" /></h1>
      <div className="read mt-6">
        <p>
          <L en="Fivonine is a free, independent record of the entire history of Haiti and Haitians, from the Taíno island of Ayiti to today. It is organized decade by decade, so you can open any ten years and see everything that happened: politics and the economy, music and literature, wars, faith, sport, business and everyday life." fr="Fivonine est un registre libre et indépendant de toute l’histoire d’Haïti et des Haïtiens, de l’île taïno d’Ayiti à aujourd’hui. Il est organisé décennie par décennie : ouvrez dix années et voyez tout ce qui s’est passé, de la politique à l’économie, de la musique à la littérature, des guerres à la foi, du sport au commerce et à la vie quotidienne." />
        </p>
        <p>
          <L en="Haiti’s story has never stopped at its borders. Every period on Fivonine is told three ways: what happened inside Haiti, what Haitians did around the world, and what foreign governments and institutions did that changed Haiti." fr="L’histoire d’Haïti ne s’est jamais arrêtée à ses frontières. Chaque période est racontée de trois façons : ce qui s’est passé en Haïti, ce que les Haïtiens ont fait dans le monde, et ce que des gouvernements et des institutions étrangers ont fait qui a changé Haïti." />
        </p>
      </div>

      <section className="mt-16 grid gap-3 sm:grid-cols-3">
        {Object.values(DIMENSIONS).map((d) => (
          <div key={d.label} className="rounded-2xl border border-rule p-6">
            <span className="flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /><L en={d.label} fr={d.labelFr} /></span>
          </div>
        ))}
      </section>

      <section className="mt-20 border-t border-rule pt-10">
        <h2 className="text-d-3"><L en="How it’s organized" fr="Comment c’est organisé" /></h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/decades", t: <L en="Decades" fr="Décennies" />, d: <L en="Every period has its own year-by-year timeline." fr="Chaque période a sa propre frise année par année." /> },
            { href: "/events", t: <L en="Events" fr="Événements" />, d: <L en="Every moment, created once and linked everywhere it belongs." fr="Chaque moment, créé une fois et relié partout où il a sa place." /> },
            { href: "/people", t: <L en="Figures" fr="Personnages" />, d: <L en="Each person connected to every moment and decade they shaped." fr="Chaque personne reliée à chaque moment et à chaque décennie qu’elle a façonnés." /> },
            { href: "/subjects", t: <L en="Subjects" fr="Thèmes" />, d: <L en={`${c.categories.length} subjects, from Politics & Government to Environment & Geography.`} fr={`${c.categories.length} thèmes, de la politique et du gouvernement à l’environnement et à la géographie.`} /> },
          ].map((x) => (
            <li key={x.href}>
              <Link href={x.href} className="block h-full rounded-2xl border border-rule p-6 hover:border-fg">
                <span className="block text-lg">{x.t}</span>
                <span className="mt-1 block text-dim">{x.d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t border-rule pt-10">
        <h2 className="text-d-3"><L en="Our standards" fr="Nos principes" /></h2>
        <div className="read mt-6">
          <p><L en="References and archival materials used across the site are gathered on the dedicated Sources page." fr="Les références et les documents d’archives utilisés sur le site sont réunis sur la page Sources." /></p>
        </div>
        <div className="read mt-6">
          <p>
            <L en="We never invent history to fill a decade. Where the record is thin, the page says so, and we keep researching. When we get something wrong, we correct it." fr="Nous n’inventons jamais d’histoire pour combler une décennie. Là où le registre est mince, la page le dit, et nous continuons de chercher. Quand nous nous trompons, nous corrigeons." />
          </p>
        </div>
      </section>

      <section className="mt-20 grid gap-3 sm:grid-cols-2">
        <Link href="/contribute" className="rounded-[2rem] bg-raise p-8 hover:bg-lift">
          <span className="block text-d-4"><L en="Contribute" fr="Contribuer" /></span>
          <span className="mt-2 block text-dim"><L en="Send a correction, a source, a missing person or a family story." fr="Envoyez une correction, une source, une personne qui manque ou une histoire de famille." /></span>
        </Link>
        <Link href="/donate" className="rounded-[2rem] bg-raise p-8 hover:bg-lift">
          <span className="block text-d-4"><L en="Donate" fr="Faire un don" /></span>
          <span className="mt-2 block text-dim"><L en="Help fund the research and keep Fivonine free for everyone." fr="Aidez à financer la recherche et à garder Fivonine gratuit pour tous." /></span>
        </Link>
      </section>

      <p className="mt-16 text-dim">
        <L en="Questions or partnerships:" fr="Questions ou partenariats :" /> <a href="mailto:hello@fivonine.com" className="underline underline-offset-4 hover:text-fg">hello@fivonine.com</a>
      </p>
    </div>
  );
}
