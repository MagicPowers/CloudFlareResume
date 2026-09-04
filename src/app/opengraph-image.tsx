import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: 72,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(700px 420px at 78% 8%, rgba(124,107,255,0.30), transparent 70%), radial-gradient(620px 400px at 12% 96%, rgba(212,245,92,0.20), transparent 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 10,
              border: "1px solid #26262e",
              background: "#16161b",
              color: "#d4f55c",
              fontSize: 17,
              letterSpacing: -0.5,
            }}
          >
            DP
          </div>
          <div
            style={{
              fontSize: 15,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#6c6c69",
            }}
          >
            {profile.location}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 128,
              lineHeight: 0.9,
              color: "#f4f4f1",
              letterSpacing: -4,
              display: "flex",
            }}
          >
            David Power
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 30,
              lineHeight: 1.3,
              color: "#a3a39f",
              maxWidth: 900,
              display: "flex",
            }}
          >
            {profile.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #26262e",
            paddingTop: 26,
            fontSize: 20,
            color: "#6c6c69",
          }}
        >
          <div style={{ display: "flex", color: "#d4f55c" }}>
            {profile.title} · {profile.company}
          </div>
          <div style={{ display: "flex" }}>{profile.site.replace("https://", "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
