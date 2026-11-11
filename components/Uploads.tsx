"use client";
import { useState } from "react";
import Icon from "./Icon";
import ActionForm, { Submit } from "./ActionForm";
import { postUpdate } from "@/app/actions";
import { t, type Locale } from "@/lib/i18n";
import { uploadImage } from "@/lib/upload";
export function UpdateForm({ locale, id }: { locale: Locale; id: string }) {
  const d = t(locale);
  const [proof, setProof] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <ActionForm action={postUpdate} locale={locale} className="stack" reset>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="proof" value={JSON.stringify(proof)} />
      <label className="field"><span>{d.dash.updateBody}</span><textarea className="input" name="body" rows={4} required maxLength={4000} /><small>{d.dash.updateHint}</small></label>
      <div className="row">
        {proof.length < 6 && (
          <label className="upload">
            <input type="file" accept="image/*" hidden disabled={busy} onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
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
      {err && <p className="notice err">{err}</p>}
      <Submit>{d.dash.publish}</Submit>
    </ActionForm>
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
      <label className={`upload ${path ? "has" : ""}`}>
        <input type="file" accept="image/*" hidden disabled={busy} onChange={async (e) => {
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
