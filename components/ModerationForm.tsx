"use client";
import { useRef } from "react";
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
export default function ModerationForm({ id, status, tier, featured, urgent, emergency, note }: { id: string; status: string; tier: string; featured: boolean; urgent: boolean; emergency: boolean; note: string }) {
  const area = useRef<HTMLTextAreaElement>(null);
  const live = status === "live";
  return (
    <ActionForm action={moderate} className="stack">
      <input type="hidden" name="id" value={id} />
      <label className="field"><span>Verification badge</span>
        <select className="input" name="tier" defaultValue={tier}>{TIERS.map((t) => <option key={t} value={t}>{{ none: "Reviewed only", id_checked: "Identity checked", community: "Community confirmed", organization: "Verified organization" }[t]}</option>)}</select>
      </label>
      <div className="row">
        <label className="check"><input type="checkbox" name="featured" defaultChecked={featured} /><span>Feature on home</span></label>
        <label className="check"><input type="checkbox" name="urgent" defaultChecked={urgent} /><span>Urgent</span></label>
        <label className="check"><input type="checkbox" name="emergency" defaultChecked={emergency} /><span>Emergency</span></label>
      </div>
      <label className="field"><span>Note to the organizer</span>
        <textarea ref={area} className="input" name="note" rows={4} maxLength={2000} defaultValue={note} />
        <small>Required when you ask for changes, decline or suspend. The organizer reads it by email and in their account. Write it in their language.</small>
      </label>
      <div className="row tight">{TEMPLATES.map(([label, text]) => <button key={label} type="button" className="chip" onClick={() => { if (area.current) area.current.value = text; }}>{label}</button>)}</div>
      <div className="row">
        {!live && status !== "suspended" && <Submit name="decision" value="approve">Approve and publish</Submit>}
        {status === "suspended" && <Submit name="decision" value="restore">Restore</Submit>}
        {!live && <Submit name="decision" value="needs_changes" className="btn">Ask for changes</Submit>}
        {!live && status !== "rejected" && <Submit name="decision" value="reject" className="btn ghost danger">Decline</Submit>}
        {status !== "suspended" && <Submit name="decision" value="suspend" className="btn ghost danger">Suspend</Submit>}
        <Submit name="decision" value="flags" className="btn ghost">Save badge and flags only</Submit>
      </div>
    </ActionForm>
  );
}
