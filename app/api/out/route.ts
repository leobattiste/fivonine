import { NextResponse, type NextRequest } from "next/server";
import { publicCampaign } from "@/lib/data";
import { safeExternal, supportParts } from "@/lib/domain";
import { backendAction } from "@/lib/supabase/backend";
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("campaign") ?? "",
    url = safeExternal(request.nextUrl.searchParams.get("url") ?? "");
  const campaign = await publicCampaign(id);
  if (
    !campaign ||
    !url ||
    !(
      safeExternal(campaign.public_content.fundraising_url ?? "") === url ||
      supportParts(campaign.public_content.support_text).some(
        (part) => part.url === url,
      )
    )
  )
    return new NextResponse("Unavailable destination", { status: 404 });
  await backendAction("outbound_click", { campaign_id: id });
  return NextResponse.redirect(url, 302);
}
