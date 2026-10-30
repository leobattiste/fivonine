import { ImageResponse } from "next/og";
import { formatDate, getContent, yearOf } from "@/lib/data";
import { DIMENSIONS, SITE } from "@/lib/site";

/** Share cards: every event and decade gets its own image. */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const kind = sp.get("kind");
  const slug = sp.get("slug") ?? "";
  const c = await getContent();

  let big = "Fivonine";
  let title = SITE.tagline;
  let sub = "Every decade. Inside Haiti, Haitians abroad, and the world acting on Haiti.";
  let color = "#0A0A0A";
  let accent = "";

  if (kind === "event") {
    const e = c.events.find((x) => x.slug === slug);
    if (e) { big = String(yearOf(e)); title = e.title; sub = `${formatDate(e)}, ${e.location}`; accent = DIMENSIONS[e.dimension].color; }
  } else if (kind === "period") {
    const p = c.periods.find((x) => x.slug === slug);
    if (p) { big = p.kind === "decade" ? `${p.start}s` : p.label; title = p.title.split(/:\s/).slice(-1)[0]; sub = "Haiti and the Haitian world"; }
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", color: "#0A0A0A", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>Fivonine</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: big.length > 8 ? 96 : 200, fontWeight: 800, letterSpacing: -6, lineHeight: 0.9, color }}>{big}</div>
          <div style={{ marginTop: 28, fontSize: 44, fontWeight: 600, lineHeight: 1.15, maxWidth: 1000 }}>{title.slice(0, 110)}</div>
          <div style={{ marginTop: 18, fontSize: 26, color: "#6E6E6B", display: "flex", alignItems: "center", gap: 14 }}>{accent ? <div style={{ width: 16, height: 16, borderRadius: 8, background: accent }} /> : null}{sub}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
