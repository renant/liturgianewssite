import { ImageResponse } from "next/og";
import type { LiturgyFacts } from "./liturgy-facts";

export const liturgyImageSize = { width: 1200, height: 630 };

export function createLiturgyImage(formattedDate: string, title: string, facts: LiturgyFacts) {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 84px", background: "linear-gradient(135deg, #fffbeb, #ffffff)", color: "#1e293b", fontFamily: "serif" }}>
      <div style={{ display: "flex", color: "#92400e", fontSize: 30, fontWeight: 700 }}>LiturgiaNews</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{formattedDate}</div>
        <div style={{ display: "flex", fontSize: 34, lineHeight: 1.25, color: "#78350f" }}>{title}</div>
        {facts.gospel && <div style={{ display: "flex", fontSize: 28, color: "#475569" }}>Evangelho {facts.gospel}</div>}
      </div>
      <div style={{ display: "flex", width: 180, height: 8, borderRadius: 8, background: "#d97706" }} />
    </div>,
    liturgyImageSize,
  );
}
