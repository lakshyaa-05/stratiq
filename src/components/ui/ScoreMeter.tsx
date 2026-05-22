"use client";

import { C } from "@/lib/design";

interface ScoreMeterProps {
  score: number;
  max?: number;
  size?: number;
  label?: string;
  color?: "coral" | "indigo" | "green";
}

const colors = {
  coral:  { stroke: C.coral,  glow: "rgba(255,77,109,0.35)" },
  indigo: { stroke: C.indigo, glow: "rgba(102,126,234,0.35)" },
  green:  { stroke: C.green,  glow: "rgba(16,185,129,0.35)" },
};

export default function ScoreMeter({ score, max = 10, size = 100, label, color = "coral" }: ScoreMeterProps) {
  const pct = Math.min(score / max, 1);
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * pct;
  const c = colors[color];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.border} strokeWidth={7} />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            style={{ filter: `drop-shadow(0 0 6px ${c.glow})`, transition: "stroke-dasharray 1.2s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 11, color: C.soft }}>/{max}</span>
        </div>
      </div>
      {label && <p style={{ fontSize: 12, fontWeight: 500, color: C.muted, textAlign: "center" }}>{label}</p>}
    </div>
  );
}
