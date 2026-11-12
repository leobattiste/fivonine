"use client";
import { useRef } from "react";
import Icon from "./Icon";
/** A short row that scrolls sideways. Arrow buttons on desktop, swipe on phones. */
export default function Row({ label, prev, next, children }: { label: string; prev: string; next: string; children: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const page = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.85, behavior: "smooth" });
  return (
    <section className="row-scroll" aria-label={label}>
      <ul className="row-track" ref={track} tabIndex={0}>{children}</ul>
      <div className="row-tools">
        <button type="button" className="row-arrow" onClick={() => page(-1)} aria-label={prev}><Icon name="left" size={20} /></button>
        <button type="button" className="row-arrow" onClick={() => page(1)} aria-label={next}><Icon name="right" size={20} /></button>
      </div>
    </section>
  );
}
