import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const headers = {
    "Cache-Control": "private, no-store, max-age=0",
    "X-Robots-Tag": "noindex, nofollow",
    "X-Content-Type-Options": "nosniff",
  };
  const sb = await db();
  if (!sb) return NextResponse.json({ error: "Unavailable" }, { status: 503, headers });
  const { data: { user }, error: authError } = await sb.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Sign in required" }, { status: 401, headers });
  const { data: aal, error: aalError } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aalError || (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2"))
    return NextResponse.json({ error: "Two-factor verification required" }, { status: 403, headers });
  const searches = [
    ["profile", sb.from("profiles").select("*").eq("id", user.id)],
    ["fundraisers", sb.from("campaigns").select("*").eq("owner_id", user.id)],
    ["bookmarks", sb.from("bookmarks").select("*").eq("user_id", user.id)],
    ["support_records", sb.from("contributions").select("*").eq("user_id", user.id)],
    ["vouches", sb.from("vouches").select("*").eq("voucher_id", user.id)],
    ["notifications", sb.from("notifications").select("*").eq("user_id", user.id)],
    ["contact_messages", sb.from("contact_messages").select("*").eq("user_id", user.id)],
    ["reports", sb.from("reports").select("*").eq("reporter_id", user.id)],
    ["appeals", sb.from("appeals").select("*").eq("user_id", user.id)],
    ["team_memberships", sb.from("campaign_members").select("*").eq("user_id", user.id)],
    ["authored_updates", sb.from("campaign_updates").select("*").eq("author_id", user.id)],
    ["proposed_changes", sb.from("campaign_changes").select("*").eq("author_id", user.id)],
    ["deletion_requests", sb.from("account_deletion_requests").select("*").eq("user_id", user.id)],
  ] as const;
  const responses = await Promise.all(searches.map(async ([name, query]) => {
    const {data,error} = await query;
    return {name,data,error};
  }));
  if(responses.some(r=>r.error)) {
    console.error("[account:export] a data collection query failed");
    return NextResponse.json({error:"Export temporarily unavailable"}, {status:503,headers});
  }
  const records: Record<string,unknown> = {};
  for (const r of responses) records[r.name] = r.data ?? [];
  const ids = (records.fundraisers as {id:string}[]).map(c=>c.id);
  if(ids.length) {
    const [privateData, methods] = await Promise.all([
      sb.from("campaign_private").select("*").in("campaign_id",ids),
      sb.from("support_methods").select("*").in("campaign_id",ids),
    ]);
    if(privateData.error||methods.error) {
      return NextResponse.json({error:"Export temporarily unavailable"}, {status:503,headers});
    }
    records.owned_fundraiser_private_details=privateData.data??[];
    records.owned_fundraiser_payment_methods=methods.data??[];
  }
  const payload = JSON.stringify({
    exported_at:new Date().toISOString(), account:{id:user.id,email:user.email,
    email_confirmed_at:user.email_confirmed_at??null,created_at:user.created_at},
    records,
  }, null, 2);
  return new NextResponse(payload,{
    status:200,headers:{
      ...headers,
      "Content-Type":"application/json; charset=utf-8",
      "Content-Disposition":"attachment; filename=\"yon-kout-men-account-data.json\"",
    }
  });
}
