import { returnPath } from "@/lib/return-path";
import { NextResponse, type NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase/server";
import { isLocale } from "@/lib/i18n";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "ht";
  const code = request.nextUrl.searchParams.get("code");
  const db = await getServerClient();
  if (code && db) {
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error)
      return NextResponse.redirect(
        new URL(
          returnPath(request.nextUrl.searchParams.get("next"), l),
          request.url,
        ),
      );
  }
  return NextResponse.redirect(
    new URL(`/${l}/login?error=expired`, request.url),
  );
}
