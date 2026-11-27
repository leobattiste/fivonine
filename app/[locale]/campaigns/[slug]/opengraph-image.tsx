import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getCampaign } from "@/lib/data";
import { campaignPlace, fmtMoney, mediaUrl } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "yon kout men";
/** Share card shown when a fundraiser link is pasted into WhatsApp, Facebook or a text message. */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : "fr", d = t(locale);
  const [data, logo, sans, sansBold] = await Promise.all([getCampaign(slug), readFile(join(process.cwd(), "lib/og/AgravePro-Bold.ttf")), readFile(join(process.cwd(), "lib/og/Geist-Regular.ttf")), readFile(join(process.cwd(), "lib/og/Geist-SemiBold.ttf"))]);
  const c = data && ["live", "completed"].includes(data.campaign.status) ? data.campaign : null;
  const cover = c?.cover_path && !c.cover_path.startsWith("fixture:") ? mediaUrl(c.cover_path) : null;
  const title = c?.title ?? d.home.headline;
  const place = c ? campaignPlace(c, locale) : "";
  const goal = c?.goal_amount ? fmtMoney(c.goal_amount, c.goal_currency, locale) : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#111111", fontFamily: "Geist" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: cover ? 660 : 1200 }}>
          <div style={{ fontFamily: "Agrave", fontSize: 64, lineHeight: 1 }}>ykm</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: title.length > 60 ? 50 : 62, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>{title.slice(0, 110)}</div>
            {place ? <div style={{ fontSize: 28, marginTop: 20, color: "#555555" }}>{place}</div> : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 28, fontWeight: 700, background: "#111111", color: "#ffffff", padding: "16px 30px", borderRadius: 999 }}>{d.support.title}</div>
            {goal ? <div style={{ fontSize: 28, color: "#555555" }}>{goal}</div> : null}
          </div>
        </div>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" width={540} height={630} style={{ objectFit: "cover" }} />
        ) : null}
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: sans, style: "normal", weight: 400 }, { name: "Geist", data: sansBold, style: "normal", weight: 700 }, { name: "Agrave", data: logo, style: "normal", weight: 700 }] },
  );
}
