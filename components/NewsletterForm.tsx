"use client";
import L from "@/components/L";
import { useT } from "@/components/Prefs";
import { useState } from "react";

export default function NewsletterForm({ source = "site" }: { source?: string }) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong");
      setState("ok");
      setMsg(t("You’re in. Mèsi! Your first letter arrives Sunday.", "C’est fait. Mèsi ! Votre première lettre arrive dimanche."));
    } catch (err: any) {
      setState("error");
      setMsg(err.message);
    }
  }

  if (state === "ok") return <p className="text-lg text-dim">{msg}</p>;

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2 sm:flex-row">
      <label htmlFor="nl-email" className="sr-only">{t("Email", "Courriel")}</label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("you@email.com", "vous@courriel.com")}
        className="min-w-0 flex-1 rounded-full border border-rule bg-base px-5 py-3 text-sm outline-none placeholder:text-dim/70 focus:border-fg"
      />
      <button disabled={state === "loading"} className="btn btn-solid justify-center disabled:opacity-60">
        {state === "loading" ? <L en="Subscribing…" fr="Inscription…" /> : <L en="Subscribe" fr="S’abonner" />}
      </button>
      {state === "error" && <p className="text-sm font-medium text-fg sm:basis-full">{msg}</p>}
    </form>
  );
}
