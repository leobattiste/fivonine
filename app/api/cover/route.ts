import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";
import { validCoverPath } from "@/lib/cover";
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") ?? "",
    key = process.env.SUPABASE_EDGE_ANON_KEY;
  if (!validCoverPath(path))
    return new NextResponse("Not found", { status: 404 });
  if (!key) return new NextResponse("Unavailable", { status: 503 });
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/campaign-cover?path=${encodeURIComponent(path)}`,
      {
        headers: { Authorization: `Bearer ${key}`, apikey: SUPABASE_ANON_KEY },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok)
      return new NextResponse(
        response.status === 404 ? "Not found" : "Unavailable",
        { status: response.status === 404 ? 404 : 503 },
      );
    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Unavailable", { status: 503 });
  }
}
