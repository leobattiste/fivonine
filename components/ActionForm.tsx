"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/types";
export default function ActionForm({ action, children, className, reset, locale }: { action: (p: ActionResult, f: FormData) => Promise<ActionResult>; children: React.ReactNode; className?: string; reset?: boolean; locale?: string }) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && reset) ref.current?.reset();
  }, [state, reset]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {locale && <input type="hidden" name="locale" value={locale} />}
      {children}
      {state && <p role="status" className={`notice ${state.ok ? "ok" : "err"}`}>{state.message}</p>}
    </form>
  );
}
export function Submit({ children, className = "btn primary", name, value }: { children: React.ReactNode; className?: string; name?: string; value?: string }) {
  const { pending } = useFormStatus();
  return <button className={className} disabled={pending} name={name} value={value} aria-busy={pending}>{children}</button>;
}
/** Two-step button for destructive actions. */
export function Confirm({ label, confirm, className = "btn small ghost danger" }: { label: string; confirm: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(id);
  }, [armed]);
  return (
    <button className={className} onClick={(e) => { if (!armed) { e.preventDefault(); setArmed(true); } }}>{armed ? confirm : label}</button>
  );
}
