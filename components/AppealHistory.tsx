import { memberCopy } from "@/lib/dict/member-launch";
import { fmtDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

type MemberAppeal = {
  id: string;
  body: string;
  status: "open" | "accepted" | "declined";
  admin_note: string | null;
  created_at: string;
};

export default function AppealHistory({ locale, items }: { locale: Locale; items: MemberAppeal[] }) {
  const m = memberCopy(locale);
  return (
    <>
      <h3>{m.appealHistory}</h3>
      {!items.length ? <p className="small muted">{m.noAppeals}</p> : (
        <ul className="stack">
          {items.map((appeal) => (
            <li key={appeal.id} className="panel stack" style={{ gap: 12 }}>
              <div className="row spread"><span className="tag line">{m.appealStatus[appeal.status]}</span><time className="xs muted" dateTime={appeal.created_at}>{fmtDate(appeal.created_at, locale)}</time></div>
              <div><strong className="small">{m.yourAppeal}</strong><p className="small" style={{ whiteSpace: "pre-wrap" }}>{appeal.body}</p></div>
              {appeal.admin_note ? <div className="feedback"><strong>{m.teamResponse}</strong><p style={{ whiteSpace: "pre-wrap" }}>{appeal.admin_note}</p></div> : <p className="small muted">{appeal.status === "open" ? m.awaitingResponse : m.noResponse}</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
