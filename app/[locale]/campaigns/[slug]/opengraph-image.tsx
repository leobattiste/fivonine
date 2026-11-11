import { ImageResponse } from "next/og";
import { getCampaign } from "@/lib/data";
import { mediaUrl } from "@/lib/format";
import { isLocale, t } from "@/lib/i18n";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Fivonine";
/** Share card shown when a campaign link is pasted into WhatsApp or social apps. */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const d = t(isLocale(locale) ? locale : "ht");
  const data = await getCampaign(slug);
  const c = data && ["live", "completed"].includes(data.campaign.status) ? data.campaign : null;
  const cover = c?.cover_path && !c.cover_path.startsWith("fixture:") ? mediaUrl(c.cover_path) : null;
  const title = c?.title ?? d.home.headline;
  const place = c ? [c.commune, c.department].filter(Boolean).join(", ") : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#1f503b", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: cover ? 660 : 1200 }}>
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -2 }}>fivonine</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: title.length > 60 ? 50 : 62, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title.slice(0, 110)}</div>
            {place ? <div style={{ fontSize: 28, marginTop: 20, color: "#4c6a5a" }}>{place}</div> : null}
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, background: "#f0faef", padding: "16px 26px", borderRadius: 999, alignSelf: "flex-start" }}>{d.support.title}</div>
        </div>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" width={540} height={630} style={{ objectFit: "cover" }} />
        ) : null}
      </div>
    ),
    size,
  );
}
