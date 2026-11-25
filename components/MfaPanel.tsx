"use client";
import { useEffect, useState } from "react";
import { browserDb } from "@/lib/supabase/client";
import { accountCopy } from "@/lib/account-copy";
import type { Locale } from "@/lib/i18n";

type Factor = { id: string; status: string; friendly_name?: string };
type Pending = { factorId: string; qr: string; secret: string };

export default function MfaPanel({ locale }: { locale: Locale }) {
  const c = accountCopy(locale);
  const [enabled, setEnabled] = useState<Factor[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  async function refresh() {
    const sb = browserDb();
    if (!sb) return;
    const { data, error } = await sb.auth.mfa.listFactors();
    if (error) { setError(c.mfaError); return; }
    setEnabled((data?.totp ?? []).filter((f: Factor) => f.status === "verified"));
  }
  useEffect(() => { void refresh(); }, [locale]);
  async function enroll() {
    const sb = browserDb(); if (!sb) return;
    setWorking(true); setError("");
    const { data, error } = await sb.auth.mfa.enroll({ factorType: "totp", friendlyName: "Authenticator app" });
    if (error || !data?.totp) setError(c.mfaError);
    else setPending({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    setWorking(false);
  }
  async function verify() {
    const sb=browserDb(); if(!sb || !pending || !/^\d{6}$/.test(code.trim())) { setError(c.mfaError); return; }
    setWorking(true); setError("");
    const { error }=await sb.auth.mfa.challengeAndVerify({factorId:pending.factorId,code:code.trim()});
    if(error) setError(c.mfaError);
    else { setPending(null);setCode("");await refresh(); }
    setWorking(false);
  }
  async function remove(id:string) {
    const sb=browserDb(); if(!sb) return;
    setWorking(true);setError("");
    const {error}=await sb.auth.mfa.unenroll({factorId:id});
    if(error) setError(c.mfaError); else await refresh();
    setWorking(false);
  }
  return (
    <section className="panel">
      <h2>{c.mfa}</h2>
      {enabled.length > 0 ? <>
        <p className="small muted">{c.mfaActive}</p>
        {enabled.map(f => <div className="row spread" key={f.id}>
          <span>{f.friendly_name ?? c.mfa}</span>
          <button type="button" className="btn" disabled={working} onClick={()=>void remove(f.id)}>{c.mfaDisable}</button>
        </div>)}
      </> : !pending ? <div><button className="btn" type="button" onClick={()=>void enroll()} disabled={working}>{c.mfaEnable}</button></div> : null}
      {pending && (
        <div className="stack">
          <p className="small">{c.mfaSetup}</p>
          {/* Supabase returns a QR image for this account's TOTP factor. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width="180" height="180" src={pending.qr} alt="Authenticator QR code" style={{background:"#fff",padding:10,borderRadius:12}} />
          <label className="field"><span>{c.mfaSecret}</span><input className="input" value={pending.secret} readOnly onFocus={e=>e.target.select()} /></label>
          <label className="field"><span>{c.mfaCode}</span><input className="input" value={code} inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" onChange={e=>setCode(e.target.value)} /></label>
          <div><button className="btn primary" type="button" disabled={working || !/^\d{6}$/.test(code)} onClick={()=>void verify()}>{c.mfaVerify}</button></div>
        </div>
      )}
      {error && <p className="notice err" role="alert">{error}</p>}
    </section>
  );
}

export function MfaChallenge({ locale, next }: { locale: Locale; next: string }) {
  const c=accountCopy(locale);
  const [factors,setFactors]=useState<Factor[]>([]);
  const [code,setCode]=useState("");
  const [error,setError]=useState("");
  const [working,setWorking]=useState(false);
  useEffect(()=>{
    const sb=browserDb();
    if(!sb)return;
    void sb.auth.mfa.listFactors().then(({data,error}: {data: {totp: Factor[]} | null; error: unknown})=>{
      if(error) setError(c.mfaError);
      else setFactors((data?.totp??[]).filter((x: Factor)=>x.status==="verified"));
    });
  },[locale]);
  async function verify(){
    const sb=browserDb(); if(!sb||!factors.length||!/^\d{6}$/.test(code.trim())) {setError(c.mfaError);return;}
    setWorking(true);setError("");
    const {error}=await sb.auth.mfa.challengeAndVerify({factorId:factors[0].id,code:code.trim()});
    if(error){setError(c.mfaError);setWorking(false);return;}
    window.location.assign(next);
  }
  async function signOut(){
    await browserDb()?.auth.signOut({scope:"local"});
    window.location.assign("/"+locale+"/login");
  }
  return <div className="wrap page"><div className="auth-box stack">
    <h1>{c.mfa}</h1><p className="muted">{c.mfaRequired}</p>
    <label className="field"><span>{c.mfaCode}</span><input className="input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value)} /></label>
    <div className="row"><button type="button" className="btn primary" onClick={()=>void verify()} disabled={working||code.length!==6}>{c.mfaVerify}</button><button type="button" className="btn" onClick={()=>void signOut()}>{c.mfaSignOut}</button></div>
    {error && <p className="notice err" role="alert">{error}</p>}
  </div></div>;
}
