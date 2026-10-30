"use client";
import { useEffect, useState } from "react";
import { CONTRIBUTION_KINDS } from "@/lib/site";

export default function ContributeForm() {
  const [kind, setKind] = useState<string>("");
  const [page, setPage] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Prefill from links like /contribute?type=correction&page=/events/...
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get("type");
    if (t && CONTRIBUTION_KINDS.some((k) => k.value === t)) setKind(t);
    const p = sp.get("page");
    if (p) setPage(p);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!kind) { setState("error"); setError("Choose what you're sending."); return; }
    setState("sending");
    try {
      const r = await fetch("/api/contribute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, page, message, name, email, website }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong. Try again.");
      setState("sent");
    } catch (err: unknown) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[2rem] bg-raise p-8 sm:p-12">
        <p className="text-d-4 font-semibold">Mèsi. We received it.</p>
        <p className="mt-2 max-w-lg text-dim">
          We read everything. If you left your email and we use what you sent, we&apos;ll let you know.
        </p>
        <button onClick={() => { setState("idle"); setMessage(""); setKind(""); setPage(""); }} className="btn btn-ghost mt-6">Send something else</button>
      </div>
    );
  }

  const field = "w-full rounded-2xl border border-rule bg-base px-4 py-3 text-base outline-none focus:border-fg";
  const active = CONTRIBUTION_KINDS.find((k) => k.value === kind);

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-8" noValidate>
      <fieldset>
        <legend className="text-lg font-semibold">What are you sending?</legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {CONTRIBUTION_KINDS.map((k) => (
            <label key={k.value} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors ${kind === k.value ? "border-fg bg-raise" : "border-rule hover:border-dim"}`}>
              <input type="radio" name="kind" value={k.value} checked={kind === k.value} onChange={() => setKind(k.value)} className="mt-1 accent-black" />
              <span>
                <span className="block font-medium">{k.label}</span>
                <span className="block text-sm text-dim">{k.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="c-message" className="text-lg font-semibold">Your message</label>
        <p className="mt-1 text-sm text-dim">{active ? active.hint : "Include dates, names and where you learned it, if you can."}</p>
        <textarea id="c-message" required rows={7} value={message} onChange={(e) => setMessage(e.target.value)} className={`${field} mt-3 resize-y font-serif text-[1.05rem] leading-relaxed`} />
      </div>

      <div>
        <label htmlFor="c-page" className="font-medium">Which page is this about? <span className="font-normal text-dim">Optional</span></label>
        <input id="c-page" value={page} onChange={(e) => setPage(e.target.value)} placeholder="For example, the 1920s or a link" className={`${field} mt-2`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="font-medium">Name <span className="font-normal text-dim">Optional</span></label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={`${field} mt-2`} />
        </div>
        <div>
          <label htmlFor="c-email" className="font-medium">Email <span className="font-normal text-dim">Optional, for follow-up</span></label>
          <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={`${field} mt-2`} />
        </div>
      </div>

      {/* Hidden from people; catches bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>

      {state === "error" && <p className="font-medium" role="alert">{error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={state === "sending"} className="btn btn-solid disabled:opacity-60">{state === "sending" ? "Sending…" : "Send contribution"}</button>
        <p className="text-sm text-dim">We never publish your name or email without asking.</p>
      </div>
    </form>
  );
}
