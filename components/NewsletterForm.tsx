"use client";
import { useState } from "react";

export default function NewsletterForm({ source = "site" }: { source?: string }) {
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
      setMsg("You’re in. Mèsi! Your first letter arrives Sunday.");
    } catch (err: any) {
      setState("error");
      setMsg(err.message);
    }
  }

  if (state === "ok") return <p className="font-serif text-lg text-mint">{msg}</p>;

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-2 sm:flex-row">
      <label htmlFor="nl-email" className="sr-only">Email</label>
      <input
        id="nl-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="min-w-0 flex-1 rounded-full border border-rule bg-base px-5 py-3 text-sm outline-none placeholder:text-dim/70 focus:border-mint"
      />
      <button disabled={state === "loading"} className="btn btn-solid justify-center disabled:opacity-60">
        {state === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {state === "error" && <p className="text-sm text-sun sm:basis-full">{msg}</p>}
    </form>
  );
}
