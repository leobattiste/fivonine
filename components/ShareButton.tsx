"use client";
import { useState } from "react";

export default function ShareButton({ title, path, text }: { title: string; path: string; text?: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = () => (typeof window !== "undefined" ? new URL(path, window.location.origin).toString() : path);

  async function share() {
    const data = { title, text: text ?? title, url: url() };
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share(data); return; } catch { /* dismissed */ }
    }
    setOpen((o) => !o);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  }

  const enc = encodeURIComponent;
  const msg = `${text ?? title} | Fivonine`;

  return (
    <div className="relative inline-block">
      <button onClick={share} className="btn btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" /></svg>
        Share
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl border border-rule bg-raise text-sm shadow-2xl shadow-black/40">
          <a className="block px-4 py-2.5 hover:bg-lift" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${enc(`${msg} ${url()}`)}`}>WhatsApp</a>
          <a className="block px-4 py-2.5 hover:bg-lift" target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${enc(msg)}&url=${enc(url())}`}>X / Twitter</a>
          <a className="block px-4 py-2.5 hover:bg-lift" target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url())}`}>Facebook</a>
          <button className="block w-full px-4 py-2.5 text-left hover:bg-lift" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
        </div>
      )}
    </div>
  );
}
