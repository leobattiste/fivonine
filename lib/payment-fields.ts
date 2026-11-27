import type { Locale } from "./i18n";
import { METHODS } from "./constants";
import { formText } from "./dict/form";
type Field = "holder" | "phone" | "account" | "currency" | "country" | "city" | "handle" | "name" | "instructions";
// Labels used before the form copy rewrite. Stored details may still use them, so parsing keeps accepting them.
const legacyLabels: Record<Locale,Record<Field,string>> = {
 en: { holder:"Account holder or recipient name", phone:"Phone number", account:"Account number", currency:"Currency", country:"Country", city:"City", handle:"Payment handle or email", name:"Method name", instructions:"Receiving instructions" },
 fr: { holder:"Nom du titulaire ou du destinataire", phone:"Numéro de téléphone", account:"Numéro de compte", currency:"Devise", country:"Pays", city:"Ville", handle:"Identifiant ou e-mail de paiement", name:"Nom du moyen", instructions:"Instructions de réception" },
 ht: { holder:"Non moun k ap resevwa a", phone:"Nimewo telefòn", account:"Nimewo kont", currency:"Lajan", country:"Peyi", city:"Vil", handle:"Idantifyan oswa imèl peman", name:"Non metòd la", instructions:"Enstriksyon pou resevwa" },
 es: { holder:"Nombre del titular o destinatario", phone:"Número de teléfono", account:"Número de cuenta", currency:"Moneda", country:"País", city:"Ciudad", handle:"Usuario o correo de pago", name:"Nombre del método", instructions:"Instrucciones de recepción" }
};
const labels: Record<Locale,Record<Field,string>> = { en: formText.en.pay, fr: formText.fr.pay, ht: formText.ht.pay, es: formText.es.pay };
export function paymentFields(method: string): Field[] {
 const group=METHODS.find(m=>m.id===method)?.group;
 if(group==="wallet") return ["holder","phone"];
 if(group==="bank") return ["holder","account","currency"];
 if(group==="transfer" || ["remitly","sendwave","taptap_send"].includes(method)) return ["holder","country","city"];
 if(group==="app") return ["holder","handle"];
 return ["name","instructions"];
}
export function paymentLabel(key: Field,locale: Locale) { return labels[locale][key]; }
// Keep the public, human-readable details format; recognize any of the four localized label sets on edit.
export function parsePayment(method: string,details: string): Partial<Record<Field,string>> | null {
 const keys=paymentFields(method), lines=details.split("\n");
 if(lines.length!==keys.length) return null;
 const out: Partial<Record<Field,string>>={};
 for(let i=0;i<keys.length;i++){
  const key=keys[i], prefix=[...Object.values(labels),...Object.values(legacyLabels)].map(l=>l[key]+":").find(p=>lines[i].startsWith(p));
  if(!prefix) return null;
  out[key]=lines[i].slice(prefix.length).replace(/^ /,"");
 }
 return out;
}
/** Structured rows for public display, labelled in the viewer's language. Null for free-text details. */
export function paymentRows(method: string,details: string,locale: Locale): [string,string][] | null {
 const values=parsePayment(method,details);
 if(!values) return null;
 return paymentFields(method).filter(k=>values[k]?.trim()).map(k=>[labels[locale][k], k==="phone" ? formatWalletNumber(values[k]!) : values[k]!.trim()]);
}
export function formatPayment(method: string,values: Partial<Record<Field,string>>,locale: Locale): string {
 return paymentFields(method).map(k=>labels[locale][k]+": "+(values[k]??"").replace(/[\r\n]+/g," ")).join("\n");
}
export type PaymentIssue = "holder" | "phone" | "account" | "handle";
const digits=(v: string)=>v.replace(/[\s+().-]/g,"");
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Haitian mobile wallets use an 8-digit number, optionally with the 509 country code. */
export const walletNumberOk=(v: string)=>{ const n=digits(v); return /^\d+$/.test(n) && (n.length===8 || (n.length===11 && n.startsWith("509"))); };
export const formatWalletNumber=(v: string)=>{ const n=digits(v).replace(/^509(?=\d{8}$)/,""); return /^\d{8}$/.test(n) ? `+509 ${n.slice(0,4)} ${n.slice(4)}` : v.trim(); };
function handleOk(method: string,v: string){
 const h=v.trim(), n=digits(h);
 const phone=/^\d{10,11}$/.test(n) || walletNumberOk(h);
 if(method==="zelle") return EMAIL_RE.test(h) || phone;
 if(method==="cash_app") return /^\$?[A-Za-z][A-Za-z0-9_]{0,19}$/.test(h) || EMAIL_RE.test(h) || phone;
 if(method==="paypal") return EMAIL_RE.test(h) || phone || /^(https:\/\/)?(www\.)?paypal\.me\/[A-Za-z0-9_.-]+$/i.test(h);
 return h.length>=3;
}
/** Format problems that would send support to the wrong place. Empty when the details look usable. */
export function paymentIssues(method: string,details: string,link: string): PaymentIssue[] {
 const values=parsePayment(method,details);
 if(!values) return [];
 const out: PaymentIssue[]=[];
 const has=(k: Field)=>Boolean(values[k]?.trim());
 if(has("holder") && !/\p{L}.*\p{L}/u.test(values.holder!)) out.push("holder");
 if(has("phone") && !walletNumberOk(values.phone!)) out.push("phone");
 if(has("account")){ const n=digits(values.account!); if(!/^[A-Za-z0-9]+$/.test(n) || (n.replace(/\D/g,"").length<6) || n.length>34) out.push("account"); }
 if(has("handle") && !handleOk(method,values.handle!)) out.push("handle");
 void link;
 return out;
}
export function paymentValid(method: string,details: string,link: string) {
 const values=parsePayment(method,details);
 if(!values) return details.trim().length>=3;
 const complete=paymentFields(method).every(k=>k==="handle" ? Boolean(values[k]?.trim() || link.trim()) : Boolean(values[k]?.trim()));
 return complete && paymentIssues(method,details,link).length===0;
}
const CONTACT_PREFIX="Phone / WhatsApp:";
export function splitContact(raw: string){
 if(!raw.startsWith(CONTACT_PREFIX))return { phone:"", notes:raw };
 const [first,...rest]=raw.split("\n");
 return {phone:first.slice(CONTACT_PREFIX.length).replace(/^ /,""),notes:rest.join("\n")};
}
export function formatContact(phone:string,notes:string){return CONTACT_PREFIX+" "+phone.replace(/[\r\n]+/g," ")+"\n"+notes;}
