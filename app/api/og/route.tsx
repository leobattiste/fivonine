import { ImageResponse } from "next/og";
import { formatDate, getContent, yearOf } from "@/lib/data";
import { DIMENSIONS, SITE } from "@/lib/site";

/** Share cards: every event, decade and thread gets its own image. */
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
  } else if (kind === "thread") {
    const t = c.threads.find((x) => x.slug === slug);
    if (t) { big = t.title; title = t.dek; sub = `A thread across ${t.steps.length} moments`; }
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", color: "#0A0A0A", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 700 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ width: 34, height: 7, borderRadius: 4, background: "#0A0A0A" }} />
            <div style={{ width: 24, height: 7, borderRadius: 4, background: "#8A8A87" }} />
            <div style={{ width: 29, height: 7, borderRadius: 4, background: "#C8C8C5" }} />
          </div>
          Fivonine
        </div>
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
