"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="page error-page">
      <h1>Unable to load / Pa ka chaje / Chargement impossible</h1>
      <p>Please try again. Tanpri eseye ankò. Veuillez réessayer.</p>
      <button className="button" onClick={reset}>
        Try again / Eseye ankò / Réessayer
      </button>
    </section>
  );
}
