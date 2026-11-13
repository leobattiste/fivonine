"use client";
import { browserDb } from "./supabase/client";
export const MAX_BYTES = 8 * 1024 * 1024;
/** Resize in the browser so uploads stay small on slow connections. */
export type Crop = { x: number; y: number; w: number; h: number };
export async function toWebp(file: File, opts: { max: number; ratio?: number; focusY?: number; crop?: Crop }): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let sw = bitmap.width, sh = bitmap.height, sx = 0, sy = 0;
  if (opts.crop) {
    sx = Math.max(0, opts.crop.x * bitmap.width); sy = Math.max(0, opts.crop.y * bitmap.height);
    sw = Math.min(bitmap.width - sx, opts.crop.w * bitmap.width); sh = Math.min(bitmap.height - sy, opts.crop.h * bitmap.height);
  } else if (opts.ratio) {
    if (sw / sh > opts.ratio) { const w = sh * opts.ratio; sx = (sw - w) / 2; sw = w; }
    else { const h = sw / opts.ratio; sy = (sh - h) * ((opts.focusY ?? 50) / 100); sh = h; }
  }
  const scale = Math.min(1, opts.max / Math.max(sw, sh));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(sw * scale); canvas.height = Math.round(sh * scale);
  canvas.getContext("2d")!.drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.82));
  if (blob && blob.type === "image/webp") return blob;
  const jpeg = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
  if (!jpeg) throw new Error("encode");
  return jpeg;
}
const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "application/pdf": "pdf", "audio/webm": "webm", "audio/mp4": "m4a", "audio/ogg": "ogg", "audio/mpeg": "mp3" };
export async function uploadBlob(bucket: "media" | "documents", blob: Blob): Promise<string> {
  const sb = browserDb();
  if (!sb) throw new Error("offline");
  if (blob.size > MAX_BYTES) throw new Error("too-big");
  const type = blob.type.split(";")[0];
  const ext = EXT[type];
  if (!ext) throw new Error("type");
  const { data } = await sb.auth.getUser();
  if (!data.user) throw new Error("auth");
  const path = `${data.user.id}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from(bucket).upload(path, blob, { contentType: type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);
  return path;
}
export async function uploadImage(bucket: "media" | "documents", file: File, opts: { max: number; ratio?: number; focusY?: number; crop?: Crop }) {
  if (file.type === "application/pdf" && bucket === "documents") return uploadBlob(bucket, file);
  return uploadBlob(bucket, await toWebp(file, opts));
}
