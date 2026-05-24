import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #16a34a 0%, #65d36e 60%, #eab308 110%)",
          color: "#0a0a0b",
          fontSize: 352,
          fontWeight: 800,
          letterSpacing: "-0.08em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        h
      </div>
    ),
    { ...size },
  );
}
