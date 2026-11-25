"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import Icon from "./Icon";
import ActionForm, { Submit } from "./ActionForm";
import { postUpdate } from "@/app/actions";
import { t, type Locale } from "@/lib/i18n";
import { uploadImage } from "@/lib/upload";
import { mediaUrl } from "@/lib/format";
import { memberCopy } from "@/lib/dict/member-launch";
export function UpdateForm({ locale, id }: { locale: Locale; id: string }) {
  const [proof, setProof] = useState<string[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <ActionForm action={postUpdate} locale={locale} className="stack" reset disabled={busy} onSuccess={() => { setProof([]); setBody(""); setErr(""); }}>
      <UpdateFields locale={locale} id={id} proof={proof} setProof={setProof} body={body} setBody={setBody} busy={busy} setBusy={setBusy} err={err} setErr={setErr} />
    </ActionForm>
  );
}

function UpdateFields({ locale, id, proof, setProof, body, setBody, busy, setBusy, err, setErr }: {
  locale: Locale; id: string; proof: string[]; setProof: React.Dispatch<React.SetStateAction<string[]>>;
  body: string; setBody: React.Dispatch<React.SetStateAction<string>>;
  busy: boolean; setBusy: React.Dispatch<React.SetStateAction<boolean>>;
  err: string; setErr: React.Dispatch<React.SetStateAction<string>>;
}) {
  const d = t(locale), m = memberCopy(locale);
  const { pending } = useFormStatus();
  return (
    <>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="proof" value={JSON.stringify(proof)} />
      <label className="field"><span>{d.dash.updateBody}</span><textarea className="input" name="body" rows={4} required maxLength={4000} value={body} onChange={(e) => setBody(e.target.value)} disabled={pending} /><small>{d.dash.updateHint}</small></label>
      {proof.length > 0 && (
        <div className="thumbs">
          {proof.map((path, index) => (
            <span className="thumb" key={path}>
              <span className="frame">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={mediaUrl(path) ?? undefined} alt={m.proofPhoto(index + 1)} /></span>
              <button type="button" disabled={pending} aria-label={m.removeProof(index + 1)} onClick={() => setProof((photos) => photos.filter((photo) => photo !== path))}><Icon name="close" size={14} /></button>
            </span>
          ))}
        </div>
      )}
      <div className="row">
        {proof.length < 6 && (
          <label className="upload-zone small">
            <input type="file" accept="image/*" disabled={busy || pending} onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file || busy || pending) return;
              setBusy(true); setErr("");
              try { const path = await uploadImage("media", file, { max: 1600 }); setProof((p) => [...p, path]); }
              catch { setErr(d.create.uploadFailed); }
              finally { setBusy(false); }
            }} />
            <Icon name="camera" size={18} /><span>{busy ? d.create.uploading : d.dash.addProof}</span>
          </label>
        )}
        {proof.length > 0 && <span className="small muted"><Icon name="check" size={15} /> {proof.length} {d.create.uploaded.toLowerCase()}</span>}
      </div>
      {busy && <p role="status" className="small muted">{m.waitForUpload}</p>}
      {err && <p role="alert" className="notice err">{err}</p>}
      <Submit disabled={busy}>{d.dash.publish}</Submit>
    </>
  );
}
export function AvatarInput({ locale, initial }: { locale: Locale; initial: string | null }) {
  const d = t(locale);
  const [path, setPath] = useState(initial ?? "");
  const [busy, setBusy] = useState(false);
  return (
    <div className="field">
      <span>{d.dash.photo}</span>
      <input type="hidden" name="avatar_path" value={path} />
      <label className={`upload-zone small ${path ? "has" : ""}`}>
        <input type="file" accept="image/*" disabled={busy} onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try { setPath(await uploadImage("media", file, { max: 400, ratio: 1 })); } catch {} finally { setBusy(false); }
        }} />
        <Icon name={path ? "check" : "camera"} size={18} /><span>{busy ? d.create.uploading : path ? d.create.changePhoto : d.create.addPhoto}</span>
      </label>
    </div>
  );
}
