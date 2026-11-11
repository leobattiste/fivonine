import { NextResponse, type NextRequest } from "next/server";
import { publicCampaign } from "@/lib/data";
import { safeExternal, supportParts } from "@/lib/domain";
import { serviceClient } from "@/lib/supabase/service";
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("campaign") ?? "",
    url = safeExternal(request.nextUrl.searchParams.get("url") ?? "");
  const campaign = await publicCampaign(id);
  if (
    !campaign ||
    campaign.demo ||
    !url ||
    !(
      safeExternal(campaign.public_content.fundraising_url ?? "") === url ||
      supportParts(campaign.public_content.support_text).some(
        (part) => part.url === url,
      )
    )
  )
    return new NextResponse("Unavailable destination", { status: 404 });
  const db = serviceClient();
  if (db) await db.rpc("record_outbound_click", { campaign_id: id });
  return NextResponse.redirect(url, 302);
}
