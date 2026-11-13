import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Icon from "@/components/Icon";
import AuthForm from "@/components/AuthForm";
import { PexelsPhoto } from "@/components/Brand";
import { getViewer, safeNext } from "@/lib/auth";
import { isLocale, t } from "@/lib/i18n";
import { PHOTOS } from "@/lib/photos";
export const metadata: Metadata = { robots: { index: false } };
export default async function Login({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ next?: string; error?: string; mode?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams, d = t(locale).auth;
  const next = safeNext(sp.next, `/${locale}/dashboard`);
  if (await getViewer()) redirect(next);
  return (
    <div className="wrap page">
      <div className="auth-layout">
        <div className="auth-box">
          <header className="stack tight"><h1>{d.title}</h1><p className="muted">{d.sub}</p></header>
          {sp.error && <p className="notice err"><Icon name="alert" size={18} />{d.linkError}</p>}
          <AuthForm locale={locale} next={next} initial={sp.mode === "up" ? "up" : "in"} />
        </div>
        <PexelsPhoto photo={PHOTOS.coast} locale={locale} sizes="(min-width: 1000px) 50vw, 100vw" />
      </div>
    </div>
  );
}
