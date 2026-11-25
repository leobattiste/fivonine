import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { MfaChallenge } from "@/components/MfaPanel";
import { safeNext } from "@/lib/auth";
import { db } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n";
export const metadata: Metadata = { robots: { index: false } };
export default async function MfaPage({params,searchParams}: {
  params: Promise<{locale:string}>; searchParams: Promise<{next?:string}>;
}) {
  const {locale}=await params;
  if(!isLocale(locale))notFound();
  const {next:requested}=await searchParams;
  const next=safeNext(requested,`/${locale}/dashboard`);
  const sb=await db();
  if(!sb)redirect(`/${locale}/login`);
  const {data:{user}}=await sb.auth.getUser();
  if(!user)redirect(`/${locale}/login?next=${encodeURIComponent(next)}`);
  const {data,error}=await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if(error||!data)redirect(`/${locale}/login`);
  if(data.currentLevel==="aal2"||data.nextLevel!=="aal2")redirect(next);
  return <MfaChallenge locale={locale} next={next}/>;
}
