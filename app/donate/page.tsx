import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description: "Help keep Fivonine free, independent and growing: research, sources, translation and the full history of Haiti.",
};

const DONATE_URL = process.env.NEXT_PUBLIC_DONATE_URL;

const USES = [
  { title: "Research", line: "Finding, checking and sourcing every moment, decade by decade, until the record is complete." },
  { title: "Archives and images", line: "Access to archives, documents and photographs, and the rights to show them." },
  { title: "Kreyòl and French", line: "Translating the whole site so it belongs to everyone it's about." },
  { title: "Free for everyone", line: "No ads, no paywall. Running costs for hosting, email and tools." },
];

export default function DonatePage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2 font-extrabold">Donate</h1>
      <p className="read mt-4">
        Fivonine is building the most complete record of Haitian history anywhere, free for anyone to read. Your support decides how fast
        it grows.
      </p>

      <div className="mt-10 rounded-[2rem] bg-raise p-8 sm:p-12">
        {DONATE_URL ? (
          <>
            <p className="text-d-4 font-semibold">Give once or monthly.</p>
            <p className="mt-2 max-w-lg text-dim">Every amount helps. You&apos;ll complete your donation on our secure payment page.</p>
            <a href={DONATE_URL} target="_blank" rel="noopener" className="btn btn-solid mt-6">Donate to Fivonine</a>
          </>
        ) : (
          <>
            <p className="text-d-4 font-semibold">Online donations open soon.</p>
            <p className="mt-2 max-w-lg text-dim">
              To give now, or to support Fivonine as an organization, write to us and we&apos;ll reply personally.
            </p>
            <a href="mailto:hello@fivonine.com?subject=Supporting%20Fivonine" className="btn btn-solid mt-6">Email hello@fivonine.com</a>
          </>
        )}
      </div>

      <section className="mt-20">
        <h2 className="text-d-3 font-semibold">Where your support goes</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {USES.map((u) => (
            <li key={u.title} className="rounded-2xl border border-rule p-6">
              <p className="text-xl font-semibold">{u.title}</p>
              <p className="mt-2 text-dim">{u.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t border-rule pt-10">
        <h2 className="text-lg font-semibold">Can&apos;t give money?</h2>
        <p className="mt-2 max-w-xl text-dim">
          Knowledge is just as valuable. Send a correction, a source, a family story or a person we&apos;re missing.
        </p>
        <Link href="/contribute" className="btn btn-ghost mt-5">Contribute</Link>
      </section>
    </div>
  );
}
