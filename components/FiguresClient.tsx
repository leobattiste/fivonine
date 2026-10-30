"use client";
import L from "@/components/L";
import { useT } from "@/components/Prefs";
import { PersonLink } from "@/components/PersonModal";
import { useMemo, useState } from "react";
import type { Category } from "@/lib/types";

export type Figure = {
  slug: string; name: string; rolesFr?: string[]; years: string; roles: string[]; subjects: string[];
  eras: { slug: string; label: string }[]; sortYear: number; count: number;
};

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function FiguresClient({ figures, categories, eras }: { figures: Figure[]; categories: Category[]; eras: { slug: string; label: string }[] }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");
  const [era, setEra] = useState("");

  const list = useMemo(() => {
    const t = norm(q.trim());
    return figures.filter((f) =>
      (!t || norm(`${f.name} ${f.roles.join(" ")}`).includes(t)) &&
      (!subject || f.subjects.includes(subject)) &&
      (!era || f.eras.some((e) => e.slug === era))
    );
  }, [figures, q, subject, era]);

  const usedSubjects = categories.filter((c) => figures.some((f) => f.subjects.includes(c.slug)));
  const usedEras = eras.filter((e) => figures.some((f) => f.eras.some((x) => x.slug === e.slug)));
  const name = (slug: string) => { const c = categories.find((x) => x.slug === slug); return c ? <L en={c.short} fr={c.shortFr} /> : slug; };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="fig-q">{t("Search figures", "Chercher un personnage")}</label>
        <input id="fig-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search a name or role", "Chercher un nom ou un rôle")}
          className="h-12 rounded-full border border-rule bg-base px-5 text-base outline-none focus:border-fg" />
        <select aria-label={t("Era", "Époque")} value={era} onChange={(e) => setEra(e.target.value)} className="h-12 w-full rounded-full border border-rule bg-base px-4 text-base text-fg outline-none focus:border-fg sm:w-56">
          <option value="">{t("Any era", "Toute époque")}</option>
          {usedEras.map((e) => <option key={e.slug} value={e.slug}>{e.label}</option>)}
        </select>
      </div>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <button className="pill shrink-0" data-on={!subject} onClick={() => setSubject("")}><L en="All fields" fr="Tous les domaines" /></button>
        {usedSubjects.map((c) => (
          <button key={c.slug} className="pill shrink-0" data-on={subject === c.slug} onClick={() => setSubject(subject === c.slug ? "" : c.slug)}><L en={c.name} fr={c.nameFr} /></button>
        ))}
      </div>

      <p className="mt-8 text-sm text-dim" aria-live="polite"><L en={`${list.length} ${list.length === 1 ? "figure" : "figures"}`} fr={`${list.length} ${list.length === 1 ? "personnage" : "personnages"}`} /></p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((f) => (
          <li key={f.slug}>
            <PersonLink slug={f.slug} className="flex h-full flex-col rounded-2xl border border-rule p-5 transition-colors hover:border-fg">
              <span className="text-sm tabular-nums text-dim">{f.years}</span>
              <span className="mt-1 text-lg leading-tight">{f.name}</span>
              <span className="mt-1.5 text-[0.95rem] text-dim"><L en={f.roles.join(", ")} fr={f.rolesFr?.join(", ")} /></span>
              <span className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-4 text-xs text-dim">
                {f.subjects.slice(0, 3).map((s) => <span key={s}>{name(s)}</span>)}
                <span className="ml-auto tabular-nums">{f.count} {f.count === 1 ? "moment" : "moments"}</span>
              </span>
            </PersonLink>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-6 text-dim"><L en="No figures match. Try a different name or clear the filters." fr="Aucun personnage ne correspond. Essayez un autre nom ou effacez les filtres." /></p>}
    </div>
  );
}
