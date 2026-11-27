"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { formText } from "@/lib/dict/form";
import type { Locale } from "@/lib/i18n";

type Draft = { id: string; title: string; status: string; updated_at: string; cover?: string | null };

/** The screen before the form: what to prepare, how it works, and any draft to pick up again. */
export default function CreateIntro({ locale, drafts, deviceKey, guideHref, guideLabel }: { locale: Locale; drafts: Draft[]; deviceKey: string; guideHref: string; guideLabel: string }) {
  const F = formText[locale], T = F.intro;
  const [device, setDevice] = useState<string | null>(null);
  // Answers typed before a title existed live only on this device. Offer them if they aren't already an account draft.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(deviceKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      const started = Boolean(saved && (String(saved.title ?? "").trim() || String(saved.beneficiary_name ?? "").trim() || String(saved.story ?? "").trim() || saved.cause));
      if (started && !(saved.id && drafts.some((d) => d.id === saved.id))) setDevice(String(saved.title ?? "").trim() || T.untitled);
    } catch {}
  }, [deviceKey, drafts, T.untitled]);
  const when = (iso: string) => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  const hasDrafts = drafts.length > 0 || device;

  return (
    <div className="create-intro">
      <header className="stack tight">
        <h1>{T.title}</h1>
        <p className="lead">{T.lead}</p>
      </header>

      {hasDrafts && (
        <section className="intro-drafts" aria-labelledby="drafts-h">
          <h2 id="drafts-h">{T.continueTitle}</h2>
          <ul>
            {drafts.map((d) => (
              <li key={d.id}>
                <Link className="draft-row" href={`/${locale}/create?draft=${d.id}`}>
                  <span className="stack tight">
                    <strong>{d.title.trim() || T.untitled}</strong>
                    <small className="muted">{d.status === "needs_changes" ? <span className="tag line">{T.needsChanges}</span> : null} {T.savedOn(when(d.updated_at))}</small>
                  </span>
                  <Icon name="arrow" size={18} />
                </Link>
              </li>
            ))}
            {device && (
              <li>
                <Link className="draft-row" href={`/${locale}/create?resume=1`}>
                  <span className="stack tight"><strong>{device}</strong><small className="muted">{T.deviceDraft}</small></span>
                  <Icon name="arrow" size={18} />
                </Link>
              </li>
            )}
          </ul>
        </section>
      )}

      <section className="ready-card" aria-labelledby="ready-h">
        <h2 id="ready-h">{F.ready.title}</h2>
        <ul>{F.ready.items.map((item) => <li key={item}><Icon name="check" size={16} />{item}</li>)}</ul>
      </section>

      <ol className="intro-how">
        {T.how.map(([title, body], i) => (
          <li key={title}><span className="n">{i + 1}</span><span><strong>{title}</strong><span className="muted">{body}</span></span></li>
        ))}
      </ol>

      <div className="intro-actions">
        <Link className="btn primary" href={`/${locale}/create?new=1`}>{hasDrafts ? T.startNew : T.start}<Icon name="arrow" size={16} /></Link>
        <Link className="arrow-link small" href={guideHref}><Icon name="guide" size={18} />{guideLabel}</Link>
      </div>
    </div>
  );
}
