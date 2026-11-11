import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { db } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";
export async function GET(request: NextRequest, { params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ht";
  const q = request.nextUrl.searchParams;
  const next = safeNext(q.get("next"), `/${locale}/dashboard`);
  const sb = await db();
  const code = q.get("code"), hash = q.get("token_hash"), type = q.get("type") as EmailOtpType | null;
  let ok = false;
  if (sb && code) ok = !(await sb.auth.exchangeCodeForSession(code)).error;
  else if (sb && hash && type) ok = !(await sb.auth.verifyOtp({ token_hash: hash, type })).error;
  return NextResponse.redirect(new URL(ok ? next : `/${locale}/login?error=link`, request.url));
}
