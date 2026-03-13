import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Clarity — Define your project before you build"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAFAF9",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* Logo mark */}
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="9" stroke="#FFAA80" strokeWidth="2" strokeOpacity="0.35" />
          <path d="M 16 7 A 9 9 0 1 1 7.001 16.001" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <p
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: "#1e1b16",
              margin: 0,
              letterSpacing: "-3px",
              lineHeight: 1,
            }}
          >
            Clarity
          </p>
          <p
            style={{
              fontSize: 28,
              color: "#7a7570",
              margin: 0,
              textAlign: "center",
              letterSpacing: "-0.5px",
            }}
          >
            Define your project before you build.
          </p>
        </div>
      </div>
    ),
    { ...size }
  )
}
