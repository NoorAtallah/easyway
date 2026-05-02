"use client";

import { ShieldCheck, Users, MapPin, Star } from "lucide-react";

const STATS = [
  { icon: <ShieldCheck size={22} />, num: "12", suffix: "+", label: "Years of experience across the US" },
  { icon: <Users size={22} />, num: "4.8", suffix: "k", label: "Satisfied customers served" },
  { icon: <MapPin size={22} />, num: "38", suffix: "+", label: "States we currently operate in" },
  { icon: <Star size={22} />, num: "4.9", suffix: "/5", label: "Average customer rating" },
];

export default function StatsStrip() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--purple)",
        padding: "70px 52px",
        overflow: "hidden",
      }}
    >
      {/* Subtle background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(140,199,196,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(219,26,26,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0",
          position: "relative",
          zIndex: 1,
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "0 40px",
              borderRight:
                i < STATS.length - 1
                  ? "1px solid rgba(255,246,246,0.12)"
                  : "none",
              ...(i === 0 && { paddingLeft: 0 }),
              ...(i === STATS.length - 1 && { paddingRight: 0 }),
            }}
          >
            {/* Glass card */}
            <div
              style={{
                background: "rgba(255,246,246,0.06)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,246,246,0.1)",
                borderRadius: "6px",
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                transition: "background 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,246,246,0.12)";
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,246,246,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform =
                  "translateY(0)";
              }}
            >
              <div style={{ color: "var(--teal)" }}>{stat.icon}</div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.8rem",
                  fontWeight: 900,
                  color: "var(--cream)",
                  lineHeight: 1,
                }}
              >
                {stat.num}
                <span
                  style={{ fontSize: "1.4rem", color: "var(--teal)" }}
                >
                  {stat.suffix}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(255,246,246,0.5)",
                  fontWeight: 300,
                  letterSpacing: "0.03em",
                  lineHeight: 1.5,
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}