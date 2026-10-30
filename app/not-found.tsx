import Link from "next/link";
import L from "@/components/L";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-8">
      <p className="wdth-tight text-d-1 text-rule">404</p>
      <h1 className="mt-6 text-d-3"><L en="This page isn't in the record." fr="Cette page ne figure pas dans le registre." /></h1>
      <p className="read mt-4"><L en="The link may be old, or the entry may have moved. Search for it or pick a decade." fr="Le lien est peut-être ancien, ou l’entrée a été déplacée. Cherchez-la ou choisissez une décennie." /></p>
      <div className="mt-8 flex gap-2">
        <Link href="/explore" className="btn btn-solid"><L en="Search the record" fr="Chercher dans le registre" /></Link>
        <Link href="/decades" className="btn btn-ghost"><L en="Browse decades" fr="Parcourir les décennies" /></Link>
      </div>
    </div>
  );
}
