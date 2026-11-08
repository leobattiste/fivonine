import Link from "next/link";
export default function NotFound() {
  return (
    <section className="page error-page">
      <h1>404</h1>
      <p>
        This page is unavailable. Paj sa a pa disponib. Cette page n’est pas
        disponible.
      </p>
      <Link className="button" href="/ht">
        fivonine →
      </Link>
    </section>
  );
}
