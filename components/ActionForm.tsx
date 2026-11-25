"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import type { ActionResult } from "@/lib/types";
export default function ActionForm({ action, children, className, reset, locale, disabled, onSuccess }: { action: (p: ActionResult, f: FormData) => Promise<ActionResult>; children: React.ReactNode; className?: string; reset?: boolean; locale?: string; disabled?: boolean; onSuccess?: (result: NonNullable<ActionResult>) => void }) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  const success = useRef(onSuccess);
  useEffect(() => { success.current = onSuccess; }, [onSuccess]);
  useEffect(() => {
    if (!state?.ok) return;
    if (reset) ref.current?.reset();
    success.current?.(state);
  }, [state, reset]);
  return (
    <form ref={ref} action={formAction} className={className} onSubmit={(e) => { if (disabled) e.preventDefault(); }}>
      {locale && <input type="hidden" name="locale" value={locale} />}
      {children}
      {state && <p role="status" className={`notice ${state.ok ? "ok" : "err"}`}>{state.message}</p>}
    </form>
  );
}
export function Submit({ children, className = "btn primary", name, value, disabled }: { children: React.ReactNode; className?: string; name?: string; value?: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button className={className} disabled={pending || disabled} name={name} value={value} aria-busy={pending}>{children}</button>;
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
