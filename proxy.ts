import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_KEY, SUPABASE_URL, supabaseEnabled } from "@/lib/supabase/config";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/lib/i18n";
import { isMissingSession } from "@/lib/auth-errors";
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (!isLocale(first)) {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value ?? "";
    const url = request.nextUrl.clone();
    url.pathname = `/${isLocale(saved) ? saved : DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  request.headers.set("x-fivonine-locale", first);
  request.headers.set("x-fivonine-pathname", pathname);
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
  const { data, error } = await sb.auth.getUser();
  // Only anonymous public responses may be retained on a shared device.
  if (!data.user && isMissingSession(error)) response.headers.set("X-Fivonine-Public-Cache", "1");
  return response;
}
export const config = { matcher: ["/((?!_next|api|fonts|icons|manifest.webmanifest|sw.js|robots.txt|sitemap.xml|.*\\..*).*)"] };
