"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Icon from "./Icon";
import { bulkCampaigns } from "@/app/admin-actions";

export type AdminRow = { id: string; title: string; slug: string; status: string; tier: string; featured: boolean; urgent: boolean; emergency: boolean; owner: string; place: string; date: string; changes: boolean };
const STATUS: Record<string, string> = { draft: "Draft", pending: "In review", needs_changes: "Changes needed", live: "Public", completed: "Completed", closed: "Closed", rejected: "Not approved", suspended: "Suspended" };
const TIER: Record<string, string> = { none: "Reviewed", id_checked: "ID checked", community: "Community", organization: "Organization" };

function Btn({ op, children, cls = "btn small" }: { op: string; children: React.ReactNode; cls?: string }) {
  const { pending } = useFormStatus();
  return <button className={cls} name="op" value={op} disabled={pending} aria-busy={pending}>{children}</button>;
}

/** Fundraisers table with selection, contextual bulk actions, reason-required suspension and undo. */
export default function AdminTable({ rows, base }: { rows: AdminRow[]; base: string }) {
  const [sel, setSel] = useState<string[]>([]);
  const [suspend, setSuspend] = useState(false);
  const [state, action] = useActionState(bulkCampaigns, null);
  const [toast, setToast] = useState<{ message: string; undo?: string } | null>(null);
  useEffect(() => {
    if (!state) return;
    if (state.ok) { setSel([]); setSuspend(false); }
    setToast({ message: state.message, undo: state.undo });
    const id = setTimeout(() => setToast(null), state.undo ? 9000 : 4000);
    return () => clearTimeout(id);
  }, [state]);
  const all = rows.length > 0 && sel.length === rows.length;
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  if (!rows.length) return <div className="empty"><span className="icon-box"><Icon name="empty" size={24} /></span><p>No fundraiser matches.</p></div>;
  return (
    <>
      {sel.length > 0 && (
        <form action={action} className="bulkbar" aria-label="Bulk actions">
          {sel.map((id) => <input key={id} type="hidden" name="ids" value={id} />)}
          <strong>{sel.length} selected</strong>
          <Btn op="feature"><Icon name="heart" size={15} />Feature on home</Btn>
          <Btn op="unfeature">Remove from home</Btn>
          {suspend ? (
            <>
              <label className="sr" htmlFor="bulk-note">Reason for suspending</label>
              <input id="bulk-note" className="input" name="note" required minLength={5} placeholder="Reason the organizers will read" autoFocus />
              <Btn op="suspend" cls="btn small danger">Confirm suspend</Btn>
              <button type="button" className="btn small" onClick={() => setSuspend(false)}>Cancel</button>
            </>
          ) : <button type="button" className="btn small danger" onClick={() => setSuspend(true)}><Icon name="stop" size={15} />Suspend…</button>}
          <button type="button" className="btn small" style={{ marginLeft: "auto" }} onClick={() => setSel([])}>Clear selection</button>
        </form>
      )}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col"><input type="checkbox" aria-label="Select all" checked={all} onChange={() => setSel(all ? [] : rows.map((r) => r.id))} /></th>
              <th scope="col">Fundraiser</th><th scope="col">Status</th><th scope="col">Checks</th><th scope="col">Organizer</th><th scope="col">Updated</th><th scope="col"><span className="sr">Action</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={sel.includes(r.id) ? "sel" : ""}>
                <td><input type="checkbox" aria-label={`Select ${r.title}`} checked={sel.includes(r.id)} onChange={() => toggle(r.id)} /></td>
                <td className="title"><Link href={`${base}/campaigns/${r.id}`}>{r.title}</Link><div className="row tight xs muted">{r.place}{r.featured && <span className="tag line">Featured</span>}{r.urgent && <span className="tag line">Urgent</span>}{r.emergency && <span className="tag line">Emergency</span>}{r.changes && <span className="tag solid">Changes</span>}</div></td>
                <td><span className={`status ${r.status}`}>{STATUS[r.status] ?? r.status}</span></td>
                <td className="xs">{TIER[r.tier]}</td>
                <td className="xs">{r.owner}</td>
                <td className="xs muted">{r.date}</td>
                <td className="actions"><Link className="btn small" href={`${base}/campaigns/${r.id}`}>{r.status === "pending" || r.changes ? "Review" : "Open"}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          {toast.undo && <form action={action}><input type="hidden" name="snapshot" value={toast.undo} />{JSON.parse(toast.undo).map((r: { id: string }) => <input key={r.id} type="hidden" name="ids" value={r.id} />)}<Btn op="undo"><Icon name="undo" size={15} />Undo</Btn></form>}
          <button className="btn small icon-only" onClick={() => setToast(null)} aria-label="Dismiss" style={{ background: "transparent", color: "inherit", borderColor: "transparent" }}><Icon name="close" size={16} /></button>
        </div>
      )}
    </>
  );
}
