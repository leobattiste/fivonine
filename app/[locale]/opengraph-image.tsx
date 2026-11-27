import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, t } from "@/lib/i18n";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "yon kout men";
/** Default share card for every page that has no image of its own. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = t(isLocale(locale) ? locale : "fr");
  const [logo, sans, sansBold] = await Promise.all([readFile(join(process.cwd(), "lib/og/AgravePro-Bold.ttf")), readFile(join(process.cwd(), "lib/og/Geist-Regular.ttf")), readFile(join(process.cwd(), "lib/og/Geist-SemiBold.ttf"))]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#111111", color: "#ffffff", fontFamily: "Geist" }}>
        <div style={{ fontFamily: "Agrave", fontSize: 96, lineHeight: 1 }}>ykm</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{d.x.home.title}</div>
          <div style={{ fontSize: 30, color: "#bbbbbb", maxWidth: 900 }}>yon kout men</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: sans, style: "normal", weight: 400 }, { name: "Geist", data: sansBold, style: "normal", weight: 700 }, { name: "Agrave", data: logo, style: "normal", weight: 700 }] },
  );
}
