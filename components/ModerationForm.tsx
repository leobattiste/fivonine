"use client";
import { useRef, useState } from "react";
import ActionForm, { Submit } from "./ActionForm";
import { moderate } from "@/app/admin-actions";
import { TIERS } from "@/lib/constants";
const TEMPLATES: [string, string][] = [
  ["ID not readable", "Foto pyès idantite a pa klè. Tanpri reprann li nan bon limyè, san refleksyon, epi voye kanpay la ankò."],
  ["Selfie missing", "Nou bezwen yon foto ou k ap kenbe pyès idantite w toupre figi w pou nou ka konfime se ou."],
  ["Payment name mismatch", "Non ki sou enfòmasyon peman yo pa menm ak non òganizatè a. Eksplike relasyon an oswa mete yon kont ki sou non pa w."],
  ["Story needs detail", "Istwa a twò kout. Di nou ki moun ki bezwen èd, sa ki pase, ak egzakteman sa lajan an pral peye."],
  ["Proof needed", "Tanpri ajoute yon dokiman ki sipòte demann nan, tankou yon bòdwo lopital, yon lèt lekòl oswa yon devi."],
  ["Not allowed", "Kanpay sa a pa respekte règ kominote a, kidonk nou pa ka pibliye li."],
];
export default function ModerationForm({ id, status, tier, featured, urgent, emergency, note, evidenceReady, identityCheckedAt, recipientCheckedAt }: { id: string; status: string; tier: string; featured: boolean; urgent: boolean; emergency: boolean; note: string; evidenceReady: boolean; identityCheckedAt?: string | null; recipientCheckedAt?: string | null }) {
  const area = useRef<HTMLTextAreaElement>(null);
  const [identity, setIdentity] = useState(false), [recipient, setRecipient] = useState(false);
  const live = status === "live";
  return (
    <ActionForm action={moderate} className="stack">
      <input type="hidden" name="id" value={id} />
      <fieldset className="stack tight">
        <legend>Required before publishing or restoring</legend>
        {!evidenceReady && <p className="notice err">Private government ID, a separate selfie, and the organizer's consent are still required. Ask the organizer to complete verification.</p>}
        <label className="check"><input type="checkbox" name="identity_checked" checked={identity} onChange={(e) => setIdentity(e.target.checked)} disabled={!evidenceReady} /><span>I opened the private ID and selfie and confirmed they match the organizer.</span></label>
        <label className="check"><input type="checkbox" name="recipient_checked" checked={recipient} onChange={(e) => setRecipient(e.target.checked)} disabled={!evidenceReady} /><span>I checked the recipient's name, relationship to the beneficiary, and every current support method.</span></label>
        {identityCheckedAt && <small>Last identity check: {new Date(identityCheckedAt).toLocaleString("en-US")}</small>}
        {recipientCheckedAt && <small>Last recipient check: {new Date(recipientCheckedAt).toLocaleString("en-US")}</small>}
        <small>Both confirmations are recorded with your administrator account. Earlier checks do not replace a new publishing review.</small>
      </fieldset>
      <label className="field"><span>Verification badge</span>
        <select className="input" name="tier" defaultValue={tier === "none" && evidenceReady ? "id_checked" : tier}>{TIERS.map((t) => <option key={t} value={t}>{{ none: "Incomplete verification (cannot publish)", id_checked: "Identity checked", community: "Community confirmed", organization: "Verified organization" }[t]}</option>)}</select>
      </label>
      <div className="row">
        <label className="check"><input type="checkbox" name="featured" defaultChecked={featured} /><span>Feature on home</span></label>
        <label className="check"><input type="checkbox" name="urgent" defaultChecked={urgent} /><span>Urgent</span></label>
        <label className="check"><input type="checkbox" name="emergency" defaultChecked={emergency} /><span>Emergency</span></label>
      </div>
      <label className="field"><span>Note to the organizer</span>
        <textarea ref={area} className="input" name="note" rows={4} maxLength={2000} defaultValue={note} />
        <small><strong>Required</strong> when you ask for changes, decline or suspend. The organizer reads it by email and in their account. Write it in their language.</small>
      </label>
      <div className="templates">{TEMPLATES.map(([label, text]) => <button key={label} type="button" className="chip" onClick={() => { if (area.current) { area.current.value = text; area.current.focus(); } }}>{label}</button>)}</div>
      <div className="stack tight">
        {!live && status !== "suspended" && <Submit name="decision" value="approve" disabled={!evidenceReady || !identity || !recipient}>Approve and publish</Submit>}
        {status === "suspended" && <Submit name="decision" value="restore" disabled={!evidenceReady || !identity || !recipient}>Restore</Submit>}
        {!live && <Submit name="decision" value="needs_changes" className="btn">Ask for changes</Submit>}
        {!live && status !== "rejected" && <Submit name="decision" value="reject" className="btn quiet danger">Decline</Submit>}
        {status !== "suspended" && <Submit name="decision" value="suspend" className="btn quiet danger">Suspend</Submit>}
        <Submit name="decision" value="flags" className="btn quiet">Save badge and flags only</Submit>
      </div>
    </ActionForm>
  );
}
