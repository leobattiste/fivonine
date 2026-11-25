import { timingSafeEqual } from "node:crypto";

export function authorizedBearer(auth: string | null, secret: string | undefined) {
  if (!secret || !auth) return false;
  const expected = `Bearer ${secret}`;
  return Buffer.byteLength(auth) === Buffer.byteLength(expected) && timingSafeEqual(Buffer.from(auth), Buffer.from(expected));
}
