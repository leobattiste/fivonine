"use client";
import { useEffect, useRef, useState } from "react";

/** A captioned essay image. If the image can't load, the caption stays and the empty box collapses. */
export default function EssayImage({ src, alt, caption, credit, license, source, compact = false }: { src: string; alt: string; caption: string; credit: string; license: string; source: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // The image may fail before the page's scripts load, when onError can't fire. Check once on mount.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <figure className={compact ? "" : "my-10 sm:-mx-8 lg:-mx-24"}>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`w-full rounded-2xl bg-raise object-cover ${compact ? "aspect-[4/3]" : ""}`}
        />
      )}
      <figcaption className={`${compact ? "text-xs" : "mx-auto max-w-[45rem] text-sm"} leading-relaxed text-dim ${failed ? "" : compact ? "mt-2" : "mt-3"}`}>
        <span className="text-fg">{caption}</span>{" "}
        <span>
          {credit}.{" "}
          <a href={source} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-fg">{license}, via Wikimedia Commons</a>
        </span>
      </figcaption>
    </figure>
  );
}
