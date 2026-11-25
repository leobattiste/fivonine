import type { Locale } from "@/lib/i18n";
import { getOperator } from "@/lib/operator";

const copy = {
  en: { title: "Operator and data requests", operator: "Operator", country: "Country", contact: "Support and privacy contact", retention: "Verification document retention", pending: "The operator’s details and document-retention policy will be published before the public launch.", providers: "Vercel hosts this website. Supabase provides accounts, the database and file storage. Resend delivers platform notification emails when email delivery is configured." },
  fr: { title: "Responsable et demandes sur vos données", operator: "Responsable", country: "Pays", contact: "Contact pour l’aide et la confidentialité", retention: "Conservation des documents de vérification", pending: "Les coordonnées du responsable et la politique de conservation seront publiées avant le lancement public.", providers: "Vercel héberge ce site. Supabase fournit les comptes, la base de données et le stockage des fichiers. Resend envoie les notifications de la plateforme lorsque l’envoi d’e-mails est configuré." },
  ht: { title: "Responsab ak demann sou done ou", operator: "Responsab", country: "Peyi", contact: "Kontak pou èd ak vi prive", retention: "Konsèvasyon dokiman verifikasyon", pending: "Enfòmasyon responsab la ak règleman konsèvasyon dokiman yo ap pibliye anvan lansman piblik la.", providers: "Vercel òganize sit sa a. Supabase bay kont yo, baz done a ak depo fichye yo. Resend voye imèl notifikasyon platfòm nan lè sèvis imèl la konfigire." },
  es: { title: "Responsable y solicitudes sobre tus datos", operator: "Responsable", country: "País", contact: "Contacto de ayuda y privacidad", retention: "Conservación de documentos de verificación", pending: "Los datos del responsable y la política de conservación se publicarán antes del lanzamiento público.", providers: "Vercel aloja este sitio. Supabase proporciona las cuentas, la base de datos y el almacenamiento de archivos. Resend envía las notificaciones de la plataforma cuando se configura el envío de correo." },
};
export default function OperatorDetails({ locale }: { locale: Locale }) {
  const o = getOperator(), d = copy[locale];
  return <section id="operator" className="panel stack" aria-labelledby="operator-title">
    <h2 id="operator-title">{d.title}</h2>
    {o.name && o.country && o.email && o.retention ? <dl className="kv">
      <div><dt>{d.operator}</dt><dd>{o.name}</dd></div>
      <div><dt>{d.country}</dt><dd>{o.country}</dd></div>
      <div><dt>{d.contact}</dt><dd><a className="link" href={`mailto:${o.email}`}>{o.email}</a></dd></div>
      <div><dt>{d.retention}</dt><dd style={{ whiteSpace: "pre-wrap" }}>{o.retention}</dd></div>
    </dl> : <p>{d.pending}</p>}
    <p className="small">{d.providers}</p>
  </section>;
}
