import type { Locale } from "./i18n";
import { METHODS } from "./constants";
type Field = "holder" | "phone" | "account" | "currency" | "country" | "city" | "handle" | "name" | "instructions";
const labels: Record<Locale,Record<Field,string>> = {
 en: { holder:"Account holder or recipient name", phone:"Phone number", account:"Account number", currency:"Currency", country:"Country", city:"City", handle:"Payment handle or email", name:"Method name", instructions:"Receiving instructions" },
 fr: { holder:"Nom du titulaire ou du destinataire", phone:"Numéro de téléphone", account:"Numéro de compte", currency:"Devise", country:"Pays", city:"Ville", handle:"Identifiant ou e-mail de paiement", name:"Nom du moyen", instructions:"Instructions de réception" },
 ht: { holder:"Non moun k ap resevwa a", phone:"Nimewo telefòn", account:"Nimewo kont", currency:"Lajan", country:"Peyi", city:"Vil", handle:"Idantifyan oswa imèl peman", name:"Non metòd la", instructions:"Enstriksyon pou resevwa" },
 es: { holder:"Nombre del titular o destinatario", phone:"Número de teléfono", account:"Número de cuenta", currency:"Moneda", country:"País", city:"Ciudad", handle:"Usuario o correo de pago", name:"Nombre del método", instructions:"Instrucciones de recepción" }
};
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
  const key=keys[i], prefix=Object.values(labels).map(l=>l[key]+":").find(p=>lines[i].startsWith(p));
  if(!prefix) return null;
  out[key]=lines[i].slice(prefix.length).replace(/^ /,"");
 }
 return out;
}
export function formatPayment(method: string,values: Partial<Record<Field,string>>,locale: Locale): string {
 return paymentFields(method).map(k=>labels[locale][k]+": "+(values[k]??"").replace(/[\r\n]+/g," ")).join("\n");
}
export function paymentValid(method: string,details: string,link: string) {
 const values=parsePayment(method,details);
 if(!values) return details.trim().length>=3;
 return paymentFields(method).every(k=>k==="handle" ? Boolean(values[k]?.trim() || link.trim()) : Boolean(values[k]?.trim()));
}
const CONTACT_PREFIX="Phone / WhatsApp:";
export function splitContact(raw: string){
 if(!raw.startsWith(CONTACT_PREFIX))return { phone:"", notes:raw };
 const [first,...rest]=raw.split("\n");
 return {phone:first.slice(CONTACT_PREFIX.length).replace(/^ /,""),notes:rest.join("\n")};
}
export function formatContact(phone:string,notes:string){return CONTACT_PREFIX+" "+phone.replace(/[\r\n]+/g," ")+"\n"+notes;}
