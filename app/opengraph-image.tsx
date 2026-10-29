import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LiturgiaNews — Liturgia Católica Diária";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 84px",
        background: "linear-gradient(135deg, #fffbeb, #ffffff)",
        color: "#0f172a",
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", color: "#92400e", fontSize: 32, fontWeight: 700 }}>
        LiturgiaNews
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 960 }}>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.12 }}>
          Um encontro com a Palavra, em cada dia.
        </div>
        <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: "#475569" }}>
          Leituras, salmos, Evangelho e reflexões da liturgia católica diária no site e gratuitamente por e-mail.
        </div>
      </div>
      <div style={{ display: "flex", width: 180, height: 8, borderRadius: 8, background: "#d97706" }} />
    </div>,
    size,
  );
}
