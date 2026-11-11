import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabaseEnabled,
} from "@/lib/supabase/config";
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const saved = request.cookies.get("pote-kole-locale")?.value;
    return NextResponse.redirect(
      new URL(
        `/${["ht", "fr", "en"].includes(saved ?? "") ? saved : "ht"}`,
        request.url,
      ),
    );
  }
  let response = NextResponse.next({ request });
  if (!supabaseEnabled) return response;
  const db = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const c of list) request.cookies.set(c.name, c.value);
        response = NextResponse.next({ request });
        for (const c of list) response.cookies.set(c.name, c.value, c.options);
      },
    },
  });
  await db.auth.getUser();
  return response;
}
export const config = {
  matcher: ["/((?!_next|illustrations|fonts|icon|robots|sitemap|.*\\..*).*)"],
};
