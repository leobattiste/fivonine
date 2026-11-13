"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
/** A thin green bar that runs while the next page loads, and finishes when it arrives. */
export default function Loader() {
  const path = usePathname(), search = useSearchParams();
  const [state, setState] = useState<"" | "go" | "done">("");
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setState("done");
    const id = setTimeout(() => setState(""), 420);
    return () => clearTimeout(id);
  }, [path, search]);
  useEffect(() => {
    const start = () => setState("go");
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      start();
    };
    const onSubmit = (e: SubmitEvent) => { const f = e.target as HTMLFormElement; if (f.method === "get") start(); };
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    window.addEventListener("yk:navigate", start);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("submit", onSubmit); window.removeEventListener("yk:navigate", start); };
  }, []);
  return <div className={`loader ${state}`} aria-hidden="true" />;
}
