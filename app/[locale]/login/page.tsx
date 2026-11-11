import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isLocale, t } from "@/lib/i18n";
import { editorial } from "@/lib/editorial";
import { currentUser, preview } from "@/lib/data";
import { returnPath } from "@/lib/return-path";
import { LoginForm } from "@/components/Forms";
export const metadata = { robots: { index: false, follow: false } };
export default async function Login({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = t(locale),
    e = editorial[locale],
    sp = await searchParams,
    next = returnPath(sp.next, locale);
  if (await currentUser()) redirect(next);
  return (
    <section className="page task-page login-page">
      <div className="task-layout">
        <header className="task-aside">
          <p className="eyebrow">{d.login}</p>
          <h1>{e.loginTitle}</h1>
          <p className="lead">{e.loginAside}</p>
        </header>
        <div className="task-surface">
          {sp.error && (
            <p className="notice error" role="alert">
              {locale === "en"
                ? "This sign-in link has expired. Request a new one."
                : locale === "fr"
                  ? "Ce lien a expiré. Demandez-en un nouveau."
                  : "Lyen koneksyon sa a ekspire. Mande yon lòt."}
            </p>
          )}
          <LoginForm locale={locale} enabled={!preview} next={next} />
          <nav className="task-legal">
            <Link href={`/${locale}/legal#privacy`}>{d.privacy}</Link>
            <Link href={`/${locale}/legal#terms`}>{d.terms}</Link>
            <Link href={`/${locale}/help`}>{d.help}</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
