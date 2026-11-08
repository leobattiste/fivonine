import { notFound } from "next/navigation";
import { isLocale, t } from "@/lib/i18n";
import { preview } from "@/lib/data";
import { LoginForm } from "@/components/Forms";
export const metadata = { robots: { index: false, follow: false } };
export default async function Login({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    sp = await searchParams;
  return (
    <section className="page narrow section">
      <header className="page-head">
        <h1>{d.login}</h1>
        <p className="lead">{d.loginIntro}</p>
      </header>
      {preview && <p className="notice">{d.unavailable}</p>}
      {sp.error && (
        <p className="notice error" role="alert">
          {locale === "ht"
            ? "Lyen an ekspire oswa li pa valab. Mande yon nouvo lyen."
            : locale === "fr"
              ? "Ce lien a expiré ou n’est plus valide. Demandez-en un nouveau."
              : "This link expired or is invalid. Request a new one."}
        </p>
      )}
      <LoginForm locale={locale} enabled={!preview} />
    </section>
  );
}
