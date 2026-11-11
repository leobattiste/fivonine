import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActionForm, { Submit } from "@/components/ActionForm";
import { sendContact } from "@/app/actions";
import { getViewer } from "@/lib/auth";
import { isLocale, t } from "@/lib/i18n";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: t(locale).contact.title } : {};
}
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const x = t(locale).contact, viewer = await getViewer();
  return (
    <div className="wrap page narrow">
      <header className="page-head"><h1>{x.title}</h1><p className="lead">{x.sub}</p></header>
      <ActionForm action={sendContact} locale={locale} className="stack panel" reset>
        <div className="grid-2">
          <label className="field"><span>{x.name}</span><input className="input" name="name" maxLength={120} defaultValue={viewer?.profile.display_name ?? ""} autoComplete="name" /></label>
          <label className="field"><span>{x.email}</span><input className="input" type="email" name="email" required maxLength={254} defaultValue={viewer?.email ?? ""} autoComplete="email" /></label>
        </div>
        <label className="field"><span>{x.topic}</span><select className="input" name="topic">{x.topics.map((o) => <option key={o}>{o}</option>)}</select></label>
        <label className="field"><span>{x.message}</span><textarea className="input" name="body" rows={6} required maxLength={4000} /></label>
        <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <Submit>{x.send}</Submit>
      </ActionForm>
    </div>
  );
}
