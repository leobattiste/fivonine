import { getServiceClient, hasSupabase } from "@/lib/supabase";
import { SITE } from "@/lib/site";

const page = (msg: string) =>
  new Response(
    `<!doctype html><meta name="viewport" content="width=device-width"><title>Fivonine</title>
     <body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#FFFFFF;color:#0A0A0A;font-family:system-ui,sans-serif">
     <div style="max-width:420px;padding:24px;text-align:center"><p style="font-size:22px;font-weight:600">${msg}</p>
     <a href="${SITE.url}" style="color:#0A0A0A">Back to Fivonine</a></div></body>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );

async function handle(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token || !/^[0-9a-f-]{36}$/i.test(token) || !hasSupabase()) return page("This unsubscribe link isn't valid.");
  const { error } = await getServiceClient().from("subscribers").update({ status: "unsubscribed" }).eq("token", token);
  return page(error ? "We couldn't update your subscription. Try the link again." : "You're unsubscribed. You won't get more letters.");
}

export const GET = handle;
export const POST = handle; // one-click unsubscribe (RFC 8058)
