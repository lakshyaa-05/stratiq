"use client";

import { CSSProperties } from "react";
import * as Scenes from "./AnalyticalScenes";

/* ─────────────────────────────────────────────────────────────────
   Stratiq — Moving Background
   Layered: base wash → aurora mesh → 5 radial blobs → analytical
   SVG scenes (per motif) → drifting tickers → particle field → vignette.

   Drop in: src/components/shared/MovingBackground.tsx
   Requires animation keyframes from for-nextjs/styles/animations.css
   ──────────────────────────────────────────────────────────────── */

export type Motif =
  | "hero" | "onboarding" | "loading" | "projects"
  | "market" | "competitors" | "psychology" | "gaps" | "seo"
  | "brand" | "content" | "action";

export interface MovingBackgroundProps {
  variant?: "light" | "dark";
  motif?: Motif;
  intensity?: number;     // 0.5–1.5, default 1
  scenes?: boolean;       // default true
  tickers?: boolean;      // default true
}

// ── Deterministic particle field (same set every render) ─────────
const PARTICLE_COUNT = 28;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  const r = (n: number, mod: number) => ((seed >> n) % mod);
  return {
    id: i,
    left: r(0, 100),
    top: r(7, 100),
    size: 2 + r(3, 5),
    opacity: 0.15 + r(11, 50) / 100,
    duration: 4 + r(14, 5),
    delay: r(17, 4),
    color: i % 5 === 0 ? "#667EEA" : "#FF4D6D",
  };
});

// ── Drifting analytical "characters" (numbers, symbols, tickers) ──
const TICKERS = [
  { text: "+14.2%",  color: "#10B981", size: 13, weight: 700 },
  { text: "$12.4B",  color: "#9CA3AF", size: 11, weight: 600 },
  { text: "8.2/10",  color: "#667EEA", size: 12, weight: 700 },
  { text: "▲ live",  color: "#10B981", size: 10, weight: 600 },
  { text: "$89/mo",  color: "#9CA3AF", size: 10, weight: 600 },
  { text: "TAM",     color: "#FF4D6D", size: 11, weight: 700 },
  { text: "+62%",    color: "#FF4D6D", size: 10, weight: 700 },
  { text: "→",       color: "#FF8C69", size: 13, weight: 800 },
  { text: "›",       color: "#FF4D6D", size: 14, weight: 800 },
  { text: "0010110", color: "#9CA3AF", size:  9, weight: 500 },
  { text: "scan…",   color: "#9CA3AF", size: 10, weight: 500 },
  { text: "+9.0",    color: "#667EEA", size: 11, weight: 700 },
  { text: "247",     color: "#1A1A2E", size: 11, weight: 800 },
  { text: "▲ +3",    color: "#10B981", size: 10, weight: 700 },
];

function DriftingTickers({ count = 18, dark = false }: { count?: number; dark?: boolean }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const t = TICKERS[i % TICKERS.length];
        const seed = (i * 374761393) >>> 0;
        const left = (seed >> 0) % 100;
        const dur = 10 + ((seed >> 7) % 8); // 10–17s
        // Negative delay spreads tickers throughout the full animation cycle at page load
        const delay = -(((seed >> 13) % (dur * 10)) / 10);
        const rot = ((seed >> 19) % 8) - 4;
        const opacity = dark ? 0.75 : 0.85;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              bottom: "-30px",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: t.size,
              fontWeight: t.weight,
              color: t.color,
              letterSpacing: "-0.01em",
              transform: `rotate(${rot}deg)`,
              animation: `tickerDrift ${dur}s linear infinite`,
              animationDelay: `${delay}s`,
              whiteSpace: "nowrap",
              textShadow: dark
                ? "0 0 8px rgba(255,77,109,.4)"
                : "0 1px 3px rgba(0,0,0,0.08)",
              pointerEvents: "none",
              ["--ticker-r" as any]: `${rot}deg`,
              ["--ticker-o" as any]: opacity,
            } as CSSProperties}
          >
            {t.text}
          </div>
        );
      })}
    </>
  );
}

// ── Per-motif scene layout (which scenes appear where) ───────────
type SceneCfg = {
  Scene: keyof typeof Scenes;
  top?: string; left?: string; right?: string; bottom?: string;
  opacity: number; scale?: number; delay?: number;
};

const SCENE_LAYOUTS: Record<Motif, SceneCfg[]> = {
  hero: [
    { Scene: "LineChart", top: "12%",   left: "4%",  opacity: 0.32, scale: 0.9 },
    { Scene: "Bars",      top: "18%",   right: "3%", opacity: 0.30, scale: 0.85, delay: 1 },
    { Scene: "Scan",      bottom: "10%", left: "3%", opacity: 0.28, scale: 0.85, delay: 0.5 },
    { Scene: "Network",   bottom: "8%", right: "4%", opacity: 0.30, scale: 0.9,  delay: 1.5 },
  ],
  onboarding: [
    { Scene: "Persona",    top: "14%",   left: "4%",  opacity: 0.25, scale: 0.85 },
    { Scene: "SparkStrip", top: "16%",   right: "4%", opacity: 0.25, scale: 0.85, delay: 0.8 },
    { Scene: "Network",    bottom: "10%", left: "5%", opacity: 0.22, scale: 0.8,  delay: 1.4 },
    { Scene: "Document",   bottom: "12%", right: "4%", opacity: 0.25, scale: 0.85, delay: 0.4 },
  ],
  loading: [
    { Scene: "Terminal",   top: "10%",    left: "3%",  opacity: 0.5,  scale: 0.85 },
    { Scene: "Scan",       top: "14%",    right: "3%", opacity: 0.4,  scale: 0.85, delay: 0.8 },
    { Scene: "Network",    bottom: "10%", left: "5%",  opacity: 0.45, scale: 0.85, delay: 1.4 },
    { Scene: "Bars",       bottom: "12%", right: "4%", opacity: 0.4,  scale: 0.8,  delay: 0.4 },
  ],
  market:      [{ Scene: "LineChart", top: "20%", right: "2%", opacity: 0.22, scale: 0.75 },
                { Scene: "Pie",       bottom: "20%", left: "2%", opacity: 0.20, scale: 0.75, delay: 1 }],
  competitors: [{ Scene: "Bars",      top: "18%",  right: "2%", opacity: 0.22, scale: 0.75 },
                { Scene: "Network",   bottom: "16%", left: "2%", opacity: 0.20, scale: 0.75, delay: 0.8 }],
  psychology:  [{ Scene: "Persona",   top: "18%",  left: "2%",  opacity: 0.22, scale: 0.75 },
                { Scene: "Document",  bottom: "18%", right: "2%", opacity: 0.20, scale: 0.75, delay: 1 }],
  gaps:        [{ Scene: "Scan",      top: "18%",  right: "2%", opacity: 0.22, scale: 0.75 },
                { Scene: "Funnel",    bottom: "16%", left: "2%", opacity: 0.20, scale: 0.75, delay: 1 }],
  seo:         [{ Scene: "Terminal",  top: "18%",  left: "2%",  opacity: 0.28, scale: 0.75 },
                { Scene: "SparkStrip",bottom: "16%", right: "2%", opacity: 0.22, scale: 0.75, delay: 1 }],
  brand:       [{ Scene: "Network",   top: "18%",  right: "2%", opacity: 0.20, scale: 0.75 },
                { Scene: "Pie",       bottom: "18%", left: "2%", opacity: 0.22, scale: 0.75, delay: 1 }],
  content:     [{ Scene: "Document",  top: "18%",  left: "2%",  opacity: 0.22, scale: 0.75 },
                { Scene: "Funnel",    bottom: "16%", right: "2%", opacity: 0.20, scale: 0.75, delay: 1 }],
  action:      [{ Scene: "Funnel",    top: "18%",  left: "2%",  opacity: 0.22, scale: 0.75 },
                { Scene: "LineChart", bottom: "16%", right: "2%", opacity: 0.22, scale: 0.75, delay: 1 }],
  projects:    [{ Scene: "Document",  top: "14%",  left: "3%",  opacity: 0.22, scale: 0.8 },
                { Scene: "SparkStrip",top: "16%",  right: "3%", opacity: 0.22, scale: 0.8,  delay: 0.7 },
                { Scene: "Bars",      bottom: "12%", left: "3%", opacity: 0.20, scale: 0.75, delay: 1.4 },
                { Scene: "Network",   bottom: "14%", right: "3%", opacity: 0.20, scale: 0.75, delay: 0.5 }],
};

export default function MovingBackground({
  variant = "light",
  motif = "hero",
  intensity = 1,
  scenes = true,
  tickers = true,
}: MovingBackgroundProps) {
  const isDark = variant === "dark";
  const layout = SCENE_LAYOUTS[motif] || [];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Base wash */}
      <div style={{
        position: "absolute", inset: 0,
        background: isDark
          ? "linear-gradient(160deg, #0F0F1A 0%, #1A1A2E 50%, #0F0F1A 100%)"
          : "linear-gradient(160deg, #FFFFFF 0%, #FFF5F7 45%, #F8F9FF 100%)",
      }} />

      {/* Slow aurora mesh */}
      <div style={{
        position: "absolute", inset: "-10%",
        background: isDark
          ? "linear-gradient(120deg, rgba(255,77,109,0) 0%, rgba(255,77,109,.08) 25%, rgba(102,126,234,.10) 50%, rgba(255,140,105,.06) 75%, rgba(255,77,109,0) 100%)"
          : "linear-gradient(120deg, rgba(255,77,109,0) 0%, rgba(255,77,109,.05) 25%, rgba(102,126,234,.05) 50%, rgba(255,140,105,.04) 75%, rgba(255,77,109,0) 100%)",
        backgroundSize: "200% 200%",
        animation: "auroraShift 22s ease-in-out infinite",
        filter: "blur(40px)",
      }} />

      {/* Blobs */}
      <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, #FF4D6D 0%, transparent 65%)", opacity: (isDark ? 0.22 : 0.10) * intensity, animation: "blobA 14s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, #667EEA 0%, transparent 65%)", opacity: (isDark ? 0.20 : 0.08) * intensity, animation: "blobB 16s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "30%", left: "20%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, #FF8C69 0%, transparent 65%)", opacity: (isDark ? 0.16 : 0.06) * intensity, animation: "blobC 18s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "55%", right: "15%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, #764BA2 0%, transparent 65%)", opacity: (isDark ? 0.18 : 0.05) * intensity, animation: "blobD 22s ease-in-out infinite" }} />

      {/* Analytical scene panels */}
      {scenes && layout.map((cfg, i) => {
        const Scene = Scenes[cfg.Scene];
        if (!Scene) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: cfg.top, left: cfg.left, right: cfg.right, bottom: cfg.bottom,
              opacity: cfg.opacity * intensity,
              transform: `scale(${cfg.scale ?? 1})`,
              transformOrigin: cfg.right ? "top right" : "top left",
              animation: `floatScene ${8 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${cfg.delay ?? 0}s`,
              filter: isDark ? "brightness(1.2)" : "none",
            }}
          >
            <Scene />
          </div>
        );
      })}

      {/* Drifting tickers */}
      {tickers && <DriftingTickers count={isDark ? 20 : 18} dark={isDark} />}

      {/* Particle field */}
      {PARTICLES.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.left}%`, top: `${p.top}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: p.color,
          opacity: isDark ? p.opacity : p.opacity * 0.45,
          animation: `particleDrift ${p.duration}s ease-in-out infinite`,
          animationDelay: `${p.delay}s`,
          boxShadow: isDark ? `0 0 ${p.size * 3}px ${p.color}` : "none",
          ["--p-opacity" as any]: isDark ? p.opacity : p.opacity * 0.45,
        } as CSSProperties} />
      ))}

      {/* Vignette */}
      {!isDark && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(255,255,255,.55) 95%)",
        }} />
      )}
    </div>
  );
}
