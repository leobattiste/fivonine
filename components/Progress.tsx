"use client";
import { useEffect } from "react";

/** Fire-and-forget view counter for trending. Not a browsing-progress tracker. */
export function ViewPing({ slug }: { slug: string }) {
  useEffect(() => {
    const k = `fivonine:viewed:${slug}`;
    try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, "1"); } catch {}
    fetch("/api/view", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug }) }).catch(() => {});
  }, [slug]);
  return null;
}
