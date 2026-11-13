"use client";
import { useMemo, useState } from "react";
import Icon from "./Icon";
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
export default function HelpSearch({ items, label, none }: { items: [string, string][]; label: string; none: string }) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => items.filter(([h, b]) => !q.trim() || norm(`${h} ${b}`).includes(norm(q.trim()))), [items, q]);
  return (
    <div className="stack" style={{ gap: 20 }}>
      <label className="searchbar" style={{ minHeight: 56 }}><Icon name="search" /><span className="sr">{label}</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={label} /></label>
      <p className="sr" aria-live="polite">{shown.length}</p>
      {shown.length ? <div className="faq">{shown.map(([h, b]) => <details key={h} open={Boolean(q.trim())}><summary>{h}</summary><p>{b}</p></details>)}</div> : <div className="empty"><p>{none}</p></div>}
    </div>
  );
}
