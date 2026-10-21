import { ImageResponse } from "next/og";

export const alt =
  "DK Group — dumpster rentals, as-is property sales and homeowner consultations in Columbus, Georgia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#111312",
        color: "#f3f1ec",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 6,
          color: "#b4b8b1",
        }}
      >
        DK GROUP · COLUMBUS, GEORGIA
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 92 }}>
        <span>Every property.</span>
        <span>Every situation.</span>
        <span style={{ color: "#e8786d", fontStyle: "italic" }}>
          A way forward.
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#b4b8b1" }}>
        Dumpster rentals &amp; cleanouts · As-is property sales · Homeowner
        consultations
      </div>
    </div>,
    size,
  );
}
