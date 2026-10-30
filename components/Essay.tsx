import EssayImage from "@/components/EssayImage";
import { PersonLink } from "@/components/PersonModal";
import type { EssayBlock } from "@/lib/types";

/** Renders _italic_ spans (titles of books, ships, newspapers) inside chapter text. */
function inline(text: string) {
  return text.split(/(_[^_]+_)/g).map((part, i) =>
    part.startsWith("_") && part.endsWith("_") && part.length > 2 ? <em key={i}>{part.slice(1, -1)}</em> : part
  );
}

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const anchor = (b: EssayBlock) => (b.type === "year" ? `essay-${b.year}` : b.type === "section" ? `ch-${slugify(b.title)}` : "");

/** A chapter: numbered thematic sections and/or year-by-year sections, with an index beside it on large screens. */
export default function Essay({ blocks, title }: { blocks: EssayBlock[]; title: string }) {
  const index = blocks.filter((b) => b.type === "year" || b.type === "section") as Extract<EssayBlock, { type: "year" | "section" }>[];
  const byYear = index.every((b) => b.type === "year");
  const col = "mx-auto w-full max-w-[45rem]"; // one column width in rem, so headings and text align

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
      <nav aria-label={`Contents of ${title}`} className="min-w-0 lg:sticky lg:top-36 lg:max-h-[calc(100vh-10rem)] lg:self-start lg:overflow-y-auto">
        <p className="label">{byYear ? "Jump to a year" : "In this chapter"}</p>
        <ol className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:px-0">
          {index.map((b) => (
            <li key={anchor(b)} className="shrink-0">
              <a href={`#${anchor(b)}`} className="block whitespace-nowrap rounded-full border border-rule px-3 py-1.5 text-sm text-dim hover:text-fg lg:whitespace-normal lg:rounded-md lg:border-0 lg:px-2 lg:py-1.5 lg:leading-snug">
                {b.type === "year" ? <span className="tabular-nums">{b.year}</span> : <>{b.n && <span className="tabular-nums">{b.n}. </span>}{b.title}</>}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="min-w-0">
        {blocks.map((b, i) => {
          switch (b.type) {
            case "year":
              return (
                <h3 key={i} id={anchor(b)} className={`${col} mt-14 scroll-mt-40 first:mt-0`}>
                  <span className="wdth-tight block text-5xl font-extrabold tabular-nums">{b.year}</span>
                  <span className="mt-2 block text-2xl font-semibold leading-snug">{b.title}</span>
                </h3>
              );
            case "section":
              return (
                <h3 key={i} id={anchor(b)} className={`${col} mt-16 scroll-mt-40 border-t border-rule pt-8 first:mt-0 first:border-0 first:pt-0`}>
                  {b.n && <span className="wdth-tight block text-4xl font-extrabold tabular-nums text-dim">{b.n}</span>}
                  <span className="mt-1 block text-[1.75rem] font-semibold leading-tight">{b.title}</span>
                </h3>
              );
            case "sub":
              return <h4 key={i} className={`${col} mt-10 text-xl font-semibold`}>{b.title}</h4>;
            case "p":
              return <p key={i} className={`read ${col} !max-w-[45rem] mt-5`}>{inline(b.text)}</p>;
            case "list":
              return (
                <ul key={i} className={`read ${col} !max-w-[45rem] mt-4 list-disc space-y-1.5 pl-6 marker:text-dim`}>
                  {b.items.map((t, j) => <li key={j}>{inline(t)}</li>)}
                </ul>
              );
            case "note":
              return (
                <aside key={i} className={`${col} mt-6 rounded-2xl bg-raise px-5 py-4`}>
                  <p className="text-sm font-semibold">{b.label}</p>
                  <p className="mt-1 font-serif text-[1.05rem] leading-relaxed text-[#2a2a28]">{inline(b.text)}</p>
                </aside>
              );
            case "table":
              return (
                <div key={i} className={`${col} mt-6`}>
                  <table className="w-full border-collapse text-left text-[0.95rem]">
                    {b.caption && <caption className="mb-2 text-left text-sm text-dim">{b.caption}</caption>}
                    <thead>
                      <tr className="border-b-2 border-fg">
                        <th className="py-2 pr-4 align-bottom font-semibold sm:w-48">{b.head[0]}</th>
                        <th className="py-2 align-bottom font-semibold">{b.head[1]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map(([a, c], j) => (
                        <tr key={j} className="border-b border-rule align-top">
                          <td className="py-2.5 pr-4 font-medium tabular-nums">{a}</td>
                          <td className="py-2.5 font-serif text-[1.02rem] leading-relaxed text-[#2a2a28]">{c}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            case "people":
              return (
                <ul key={i} className={`${col} mt-6 divide-y divide-rule border-y border-rule`}>
                  {b.items.map((x, j) => (
                    <li key={j} className="py-3.5">
                      {x.slug ? (
                        <PersonLink slug={x.slug} className="font-semibold underline decoration-rule underline-offset-4 hover:decoration-fg">{x.name}</PersonLink>
                      ) : (
                        <span className="font-semibold">{x.name}</span>
                      )}
                      <span className="text-dim">: {x.text}</span>
                    </li>
                  ))}
                </ul>
              );
            case "biblio":
              return (
                <ol key={i} className={`${col} mt-5 list-decimal space-y-2.5 pl-6 font-serif text-[1rem] leading-relaxed text-[#2a2a28] marker:text-dim`}>
                  {b.items.map((t, j) => <li key={j}>{inline(t)}</li>)}
                </ol>
              );
            case "img":
              return <EssayImage key={i} {...b} />;
          }
        })}
      </article>
    </div>
  );
}
