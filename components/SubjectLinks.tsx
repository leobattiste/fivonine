import Link from "next/link";
import L from "@/components/L";
import { SECTIONS } from "@/lib/sections";

/** Consistent, clickable subject labels across event lists, modals and full pages. */
export default function SubjectLinks({
  slugs,
  compact = false,
  className = "",
}: {
  slugs: string[];
  compact?: boolean;
  className?: string;
}) {
  const found = [...new Set(slugs)]
    .map((slug) => SECTIONS.find((section) => section.slug === slug))
    .filter((section): section is (typeof SECTIONS)[number] => Boolean(section));

  if (!found.length) return null;

  return (
    <div role="group" aria-label="Subjects" className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {found.map((subject) => (
        <Link
          key={subject.slug}
          href={`/subjects/${subject.slug}`}
          className={`rounded-full border border-rule text-dim transition-colors hover:border-fg hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"}`}
        >
          <L en={compact ? subject.short : subject.name} fr={compact ? subject.shortFr : subject.nameFr} />
        </Link>
      ))}
    </div>
  );
}
