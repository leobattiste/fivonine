"use client";
import L from "@/components/L";
import { useT } from "@/components/Prefs";
import { useEffect, useState } from "react";
import { CONTRIBUTION_KINDS } from "@/lib/site";

export default function ContributeForm() {
  const t = useT();
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
    if (!kind) { setState("error"); setError(t("Choose what you're sending.", "Choisissez ce que vous envoyez.")); return; }
    setState("sending");
    try {
      const r = await fetch("/api/contribute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, page, message, name, email, website }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || t("Something went wrong. Try again.", "Une erreur s’est produite. Réessayez."));
      setState("sent");
    } catch (err: unknown) {
      setState("error");
      setError(err instanceof Error ? err.message : t("Something went wrong. Try again.", "Une erreur s’est produite. Réessayez."));
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[2rem] bg-raise p-8 sm:p-12">
        <p className="text-d-4"><L en="Mèsi. We received it." fr="Mèsi. Nous l’avons reçu." /></p>
        <p className="mt-2 max-w-lg text-dim">
          <L en="We read everything. If you left your email and we use what you sent, we’ll let you know." fr="Nous lisons tout. Si vous avez laissé votre courriel et que nous utilisons ce que vous avez envoyé, nous vous le dirons." />
        </p>
        <button onClick={() => { setState("idle"); setMessage(""); setKind(""); setPage(""); }} className="btn btn-ghost mt-6"><L en="Send something else" fr="Envoyer autre chose" /></button>
      </div>
    );
  }

  const field = "w-full rounded-2xl border border-rule bg-base px-4 py-3 text-base outline-none focus:border-fg";
  const active = CONTRIBUTION_KINDS.find((k) => k.value === kind);

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-8" noValidate>
      <fieldset>
        <legend className="text-lg"><L en="What are you sending?" fr="Que nous envoyez-vous ?" /></legend>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {CONTRIBUTION_KINDS.map((k) => (
            <label key={k.value} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors ${kind === k.value ? "border-fg bg-raise" : "border-rule hover:border-dim"}`}>
              <input type="radio" name="kind" value={k.value} checked={kind === k.value} onChange={() => setKind(k.value)} className="mt-1 accent-[rgb(var(--fg))]" />
              <span>
                <span className="block font-medium"><L en={k.label} fr={k.labelFr} /></span>
                <span className="block text-sm text-dim"><L en={k.hint} fr={k.hintFr} /></span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="c-message" className="text-lg"><L en="Your message" fr="Votre message" /></label>
        <p className="mt-1 text-sm text-dim">{active ? <L en={active.hint} fr={active.hintFr} /> : <L en="Include dates, names and where you learned it, if you can." fr="Indiquez les dates, les noms et où vous l’avez appris, si possible." />}</p>
        <textarea id="c-message" required rows={7} value={message} onChange={(e) => setMessage(e.target.value)} className={`${field} mt-3 resize-y leading-relaxed`} />
      </div>

      <div>
        <label htmlFor="c-page" className="font-medium"><L en="Which page is this about?" fr="De quelle page s’agit-il ?" /> <span className="font-normal text-dim"><L en="Optional" fr="Facultatif" /></span></label>
        <input id="c-page" value={page} onChange={(e) => setPage(e.target.value)} placeholder={t("For example, the 1920s or a link", "Par exemple, les années 1920 ou un lien")} className={`${field} mt-2`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="font-medium"><L en="Name" fr="Nom" /> <span className="font-normal text-dim"><L en="Optional" fr="Facultatif" /></span></label>
          <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={`${field} mt-2`} />
        </div>
        <div>
          <label htmlFor="c-email" className="font-medium"><L en="Email" fr="Courriel" /> <span className="font-normal text-dim"><L en="Optional, for follow-up" fr="Facultatif, pour le suivi" /></span></label>
          <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={`${field} mt-2`} />
        </div>
      </div>

      {/* Hidden from people; catches bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>

      {state === "error" && <p className="font-medium" role="alert">{error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={state === "sending"} className="btn btn-solid disabled:opacity-60">{state === "sending" ? <L en="Sending…" fr="Envoi…" /> : <L en="Send contribution" fr="Envoyer la contribution" />}</button>
        <p className="text-sm text-dim"><L en="We never publish your name or email without asking." fr="Nous ne publions jamais votre nom ni votre courriel sans vous le demander." /></p>
      </div>
    </form>
  );
}
