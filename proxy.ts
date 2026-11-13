import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "@/lib/supabase/config";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/lib/i18n";
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (first === "ht") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname.slice(3)}`;
    return NextResponse.redirect(url, 308);
  }
  if (!isLocale(first)) {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
    const url = request.nextUrl.clone();
    url.pathname = `/${isLocale(saved) ? saved : DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  request.headers.set("x-fivonine-locale", first);
  let response = NextResponse.next({ request });
  if (!supabaseEnabled) return response;
  const sb = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const c of list) request.cookies.set(c.name, c.value);
        response = NextResponse.next({ request });
        for (const c of list) response.cookies.set(c.name, c.value, c.options);
      },
    },
  });
  await sb.auth.getUser();
  return response;
}
export const config = { matcher: ["/((?!_next|api|fonts|icons|manifest.webmanifest|sw.js|robots.txt|sitemap.xml|.*\\..*).*)"] };
