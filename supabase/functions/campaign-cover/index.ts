import { createClient } from "npm:@supabase/supabase-js@2.118.0";
Deno.serve(async (request:Request)=>{
 if(request.method!=="GET")return new Response("Method not allowed",{status:405});
 const path=new URL(request.url).searchParams.get("path")??"";
 if(!/^[a-f\d-]{36}\/[a-f\d-]{36}\.webp$/i.test(path))return new Response("Not found",{status:404});
 const url=Deno.env.get("SUPABASE_URL")!;
 // Public RLS decides which current approved snapshot can expose its cover.
 const publicDb=createClient(url,Deno.env.get("SUPABASE_ANON_KEY")!,{auth:{persistSession:false}});
 const {data,error}=await publicDb.from("campaigns").select("id").eq("status","published").eq("public_content->>photo_url",`${url}/storage/v1/object/authenticated/covers/${path}`).limit(1);
 if(error)return new Response("Unavailable",{status:503});
 if(!data?.length)return new Response("Not found",{status:404});
 const storage=createClient(url,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
 const photo=await storage.storage.from("covers").download(path);
 if(photo.error||!photo.data)return new Response("Not found",{status:404});
 return new Response(photo.data,{headers:{"Content-Type":"image/webp","Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
});
