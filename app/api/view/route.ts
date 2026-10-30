import { NextResponse } from "next/server";
import { getServiceClient, hasSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  if (!hasSupabase()) return NextResponse.json({ ok: true });
  try {
    const { slug } = await req.json();
    if (typeof slug !== "string" || !/^[a-z0-9-]{1,120}$/.test(slug)) return NextResponse.json({ ok: false }, { status: 400 });
    await getServiceClient().rpc("increment_view", { slug_in: slug });
  } catch { /* never block the page on analytics */ }
  return NextResponse.json({ ok: true });
}
