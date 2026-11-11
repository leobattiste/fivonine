import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getViewer, safeNext } from "@/lib/auth";
import { isLocale, t } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
export default async function Login({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string; error?: string; mode?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams, d = t(locale).auth;
  const next = safeNext(sp.next, `/${locale}/dashboard`);
  if (await getViewer()) redirect(next);
  return (
    <div className="wrap page auth">
      <header className="page-head"><h1>{d.title}</h1><p className="lead">{d.sub}</p></header>
      {sp.error && <p className="notice err">{d.linkError}</p>}
      <AuthForm locale={locale} next={next} initial={sp.mode === "up" ? "up" : "in"} />
    </div>
  );
}
