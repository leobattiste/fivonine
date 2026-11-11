import "server-only";
import { cookies } from "next/headers";
export async function isLite() {
  return (await cookies()).get("fivonine-lite")?.value === "1";
}
