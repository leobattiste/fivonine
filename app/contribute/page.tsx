import type { Metadata } from "next";
import ContributeForm from "@/components/ContributeForm";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Send corrections, missing moments and people, sources, family stories and ideas to help complete Haiti's history.",
};

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 pt-10 sm:px-8 sm:pt-12">
      <h1 className="text-d-2 font-extrabold">Contribute</h1>
      <p className="read mt-4">
        Haiti&apos;s history lives in archives, in books and in families. Help us complete it: point out what&apos;s wrong, tell us
        what&apos;s missing, share a source or a story.
      </p>
      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_20rem]">
        <ContributeForm />
        <aside className="space-y-8 text-[0.95rem] lg:pt-12">
          <div>
            <p className="font-semibold">How we use contributions</p>
            <p className="mt-2 text-dim">
              Every suggestion is checked against sources before anything is added. Family stories may be published only with your
              permission.
            </p>
          </div>
          <div>
            <p className="font-semibold">The most helpful details</p>
            <p className="mt-2 text-dim">Dates, places, full names, and where you learned it: a book, an archive, a newspaper, a relative.</p>
          </div>
          <div>
            <p className="font-semibold">Prefer email?</p>
            <a href="mailto:hello@fivonine.com" className="mt-2 inline-block text-dim underline underline-offset-4 hover:text-fg">hello@fivonine.com</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
