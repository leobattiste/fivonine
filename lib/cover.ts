import { SUPABASE_URL } from "./supabase/config";
export const validCoverPath = (path: string) =>
  /^[a-f\d-]{36}\/[a-f\d-]{36}\.webp$/i.test(path);
export function coverPath(src: string) {
  const prefix = `${SUPABASE_URL}/storage/v1/object/authenticated/covers/`;
  if (!SUPABASE_URL || !src.startsWith(prefix)) return null;
  const path = src.slice(prefix.length);
  return validCoverPath(path) ? path : null;
}
export function coverReference(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/authenticated/covers/${path}`;
}
