"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Slide-over modal for routes opened from within the site. Closing goes back to where the reader was.
 * It renders only while the address matches `path`, so it always disappears when the reader navigates away.
 */
export default function Modal({ children, label, path }: { children: React.ReactNode; label: string; path: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const open = pathname === path;
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") router.back(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [open, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <button aria-label="Close" tabIndex={-1} onClick={() => router.back()} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        ref={panel}
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[1.75rem] bg-base px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 shadow-2xl outline-none sm:max-h-[88vh] sm:max-w-2xl sm:rounded-[1.75rem] sm:px-10 sm:pb-10 sm:pt-6"
      >
        <div className="sticky top-0 z-10 -mx-5 -mt-4 flex h-12 items-center justify-center bg-base/95 px-5 backdrop-blur sm:-mx-10 sm:-mt-6 sm:h-16 sm:px-10">
          <span className="h-1.5 w-10 rounded-full bg-rule sm:hidden" aria-hidden />
          <button onClick={() => router.back()} className="absolute right-4 top-1.5 grid h-10 w-10 place-items-center rounded-full border border-rule bg-base hover:border-fg sm:right-6 sm:top-4" aria-label="Close profile">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
