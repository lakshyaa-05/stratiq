"use client";

import { CSSProperties, ReactElement } from "react";

/* ─────────────────────────────────────────────────────────────────
   Stratiq — Analytical Scenes
   10 looping SVG vignettes used by MovingBackground.
   Each one is a self-contained 200×130 panel (with a soft frame),
   safe to drop anywhere. All animation is CSS @keyframes — see
   for-nextjs/styles/animations.css.

   Drop in: src/components/shared/AnalyticalScenes.tsx
   ──────────────────────────────────────────────────────────────── */

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function ScenePanel({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <svg width="200" height="130" viewBox="0 0 200 130" style={{ display: "block", ...style }}>
      {children}
    </svg>
  );
}

const FrameRect = () => (
  <rect x="0.5" y="0.5" width="199" height="129" rx="10"
    fill="white" fillOpacity="0.5" stroke="#1A1A2E" strokeOpacity="0.18" strokeWidth="1" />
);

// 1. Line chart that draws itself, then resets ────────────────────
export const LineChart = (): ReactElement => (
  <ScenePanel>
    <FrameRect />
    <g opacity="0.9">
      <line x1="14" y1="100" x2="186" y2="100" stroke="#F0F0F5" strokeWidth="1" />
      <line x1="14" y1="70"  x2="186" y2="70"  stroke="#F0F0F5" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="14" y1="40"  x2="186" y2="40"  stroke="#F0F0F5" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M14,90 L36,82 L58,86 L80,68 L102,72 L124,52 L146,58 L168,38 L186,28"
        fill="none" stroke="#FF4D6D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: 260, strokeDashoffset: 260, animation: "drawIn 5s ease-in-out infinite" }} />
      <circle cx="186" cy="28" r="3.5" fill="#FF4D6D" style={{ animation: "pulseDot 1.6s ease-in-out infinite" }} />
    </g>
    <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">demand · 12-mo</text>
    <text x="160" y="22" fontFamily={MONO} fontSize="9" fill="#10B981">▲ +14.2%</text>
  </ScenePanel>
);

// 2. Bars stack up ──────────────────────────────────────────────
export const Bars = (): ReactElement => {
  const bars = [54, 38, 72, 46, 88, 60, 96];
  return (
    <ScenePanel>
      <FrameRect />
      <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">competitor pricing</text>
      <g>
        {bars.map((h, i) => (
          <rect key={i} x={20 + i * 24} y={110 - h} width="16" height={h} rx="2"
            fill={i === 4 ? "#FF4D6D" : "#667EEA"}
            opacity={i === 4 ? 0.9 : 0.6}
            style={{
              transformOrigin: `${28 + i * 24}px 110px`,
              transform: "scaleY(0)",
              animation: `growUp 4s ${i * 0.12}s ease-out infinite`,
            }} />
        ))}
      </g>
    </ScenePanel>
  );
};

// 3. Magnifying-glass scanning data points ────────────────────────
export const Scan = (): ReactElement => (
  <ScenePanel>
    <FrameRect />
    <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">scanning…</text>
    {[[40,50],[60,80],[90,40],[110,65],[140,85],[160,45],[80,95]].map(([x,y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#667EEA" opacity="0.55"
        style={{ animation: `pulseDot 2s ${i * 0.2}s infinite` }} />
    ))}
    <g style={{ animation: "scanSweep 6s ease-in-out infinite", transformOrigin: "100px 70px" }}>
      <circle cx="0" cy="0" r="22" fill="rgba(255,77,109,0.08)" stroke="#FF4D6D" strokeWidth="1.8" />
      <line x1="16" y1="16" x2="28" y2="28" stroke="#FF4D6D" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="0" cy="0" r="2" fill="#FF4D6D" />
    </g>
  </ScenePanel>
);

// 4. Node graph with traveling pulses ─────────────────────────────
export const Network = (): ReactElement => {
  const nodes: [number, number][] = [[40,40],[120,30],[170,70],[80,80],[150,105],[30,95]];
  const edges = [[0,1],[1,2],[1,3],[3,4],[3,5],[0,5],[2,4]];
  return (
    <ScenePanel>
      <FrameRect />
      <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">market graph</text>
      {edges.map(([a,b], i) => (
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="#FF4D6D" strokeWidth="1.2" opacity="0.35" strokeDasharray="3 4"
          style={{ animation: "dashFlow 2s linear infinite", animationDelay: `${i * 0.15}s` }} />
      ))}
      {nodes.map(([x,y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#FF4D6D" opacity="0.18"
            style={{ animation: `pulseDot 2.4s ${i * 0.2}s infinite` }} />
          <circle cx={x} cy={y} r="3" fill={i === 1 ? "#FF4D6D" : "#667EEA"} />
        </g>
      ))}
    </ScenePanel>
  );
};

// 5. Terminal typing ──────────────────────────────────────────────
export const Terminal = (): ReactElement => {
  const lines = ["$ stratiq scan --local", "› 247 competitors found", "› parsing reviews…", "› ▲ 3 gaps detected"];
  return (
    <ScenePanel>
      <rect x="0.5" y="0.5" width="199" height="129" rx="10" fill="#0F0F1A" stroke="#1A1A2E" strokeWidth="1" />
      <g>
        <circle cx="14" cy="14" r="3" fill="#EF4444" opacity="0.7" />
        <circle cx="24" cy="14" r="3" fill="#F59E0B" opacity="0.7" />
        <circle cx="34" cy="14" r="3" fill="#10B981" opacity="0.7" />
        <text x="50" y="17" fontFamily={MONO} fontSize="9" fill="#4a4a60">stratiq-engine</text>
      </g>
      {lines.map((l, i) => (
        <text key={i} x="14" y={40 + i * 18} fontFamily={MONO} fontSize="10"
          fill={i === 0 ? "#9CA3AF" : i === lines.length-1 ? "#10B981" : "#667EEA"}
          style={{ opacity: 0, animation: `typeLine 8s ${i * 1.4}s infinite` }}>{l}</text>
      ))}
      <rect x="14" y={40 + lines.length * 18 - 8} width="6" height="11" fill="#FF4D6D"
        style={{ animation: "caretBlink .8s infinite" }} />
    </ScenePanel>
  );
};

// 6. Pie filling sections ─────────────────────────────────────────
export const Pie = (): ReactElement => (
  <ScenePanel>
    <FrameRect />
    <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">market share</text>
    <g transform="translate(70 75)">
      <circle r="38" fill="none" stroke="#F0F0F5" strokeWidth="14" />
      <circle r="38" fill="none" stroke="#FF4D6D" strokeWidth="14"
        strokeDasharray="92 240" transform="rotate(-90)"
        style={{ animation: "fillArc1 5s ease-in-out infinite" }} />
      <circle r="38" fill="none" stroke="#667EEA" strokeWidth="14"
        strokeDasharray="68 240" strokeDashoffset="-92" transform="rotate(-90)"
        style={{ animation: "fillArc2 5s ease-in-out infinite" }} />
      <circle r="38" fill="none" stroke="#FF8C69" strokeWidth="14"
        strokeDasharray="44 240" strokeDashoffset="-160" transform="rotate(-90)"
        style={{ animation: "fillArc3 5s ease-in-out infinite" }} />
    </g>
    <g transform="translate(130 50)" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fill="#1A1A2E">
      <g><rect x="0" y="0" width="8" height="8" rx="2" fill="#FF4D6D"/><text x="14" y="8">You · 38%</text></g>
      <g transform="translate(0 16)"><rect width="8" height="8" rx="2" fill="#667EEA"/><text x="14" y="8" fill="#6B7280">Comp · 28%</text></g>
      <g transform="translate(0 32)"><rect width="8" height="8" rx="2" fill="#FF8C69"/><text x="14" y="8" fill="#6B7280">Other · 18%</text></g>
    </g>
  </ScenePanel>
);

// 7. Document being written ───────────────────────────────────────
export const Document = (): ReactElement => (
  <ScenePanel>
    <FrameRect />
    <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">report.md · drafting</text>
    <g>
      {[0,1,2,3,4].map((i) => (
        <rect key={i} x="14" y={36 + i * 14}
          width={i === 4 ? 80 : 130 - (i % 3) * 10}
          height="6" rx="2"
          fill={i === 0 ? "#1A1A2E" : "#9CA3AF"}
          opacity={i === 0 ? 0.7 : 0.35}
          style={{
            transformOrigin: "14px center",
            transform: "scaleX(0)",
            animation: `typewriter 6s ${i * 0.5}s ease-out infinite`,
          }} />
      ))}
    </g>
  </ScenePanel>
);

// 8. Funnel converting ────────────────────────────────────────────
export const Funnel = (): ReactElement => {
  const stages = [
    { w: 100, label: "Visit  · 24k" },
    { w: 78,  label: "Engage · 9.4k" },
    { w: 52,  label: "Trial  · 2.1k" },
    { w: 28,  label: "Paid   · 612" },
  ];
  return (
    <ScenePanel>
      <FrameRect />
      <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">conversion funnel</text>
      <g transform="translate(50 36)">
        {stages.map((s, i) => (
          <g key={i} transform={`translate(${(100 - s.w) / 2} ${i * 22})`}>
            <rect width={s.w} height="16" rx="3"
              fill={i === 3 ? "#FF4D6D" : "#667EEA"}
              opacity={0.3 + i * 0.18}
              style={{
                transformOrigin: `${s.w / 2}px 8px`,
                transform: "scaleX(0)",
                animation: `growX 4.5s ${i * 0.2}s ease-out infinite`,
              }} />
            <text x={s.w + 6} y="11" fontFamily={MONO} fontSize="8" fill="#6B7280">{s.label}</text>
          </g>
        ))}
      </g>
    </ScenePanel>
  );
};

// 9. KPI spark strip ──────────────────────────────────────────────
export const SparkStrip = (): ReactElement => {
  const sparks = [
    { d: "M0,16 L10,12 L20,14 L30,8 L40,10 L50,4", color: "#FF4D6D" },
    { d: "M0,12 L10,16 L20,10 L30,12 L40,6 L50,8", color: "#667EEA" },
    { d: "M0,10 L10,8 L20,12 L30,6 L40,10 L50,2", color: "#10B981" },
  ];
  return (
    <ScenePanel>
      <FrameRect />
      <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">KPI sparks</text>
      <g>
        {[0,1,2].map((row) => (
          <g key={row} transform={`translate(20 ${38 + row * 28})`}>
            <text x="0" y="12" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fill="#9CA3AF">
              {["Search","Reviews","Mentions"][row]}
            </text>
            <g transform="translate(50 4)">
              <path d={sparks[row].d} fill="none" stroke={sparks[row].color} strokeWidth="1.6" strokeLinecap="round"
                style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: `drawIn 3.2s ${row * 0.4}s ease-in-out infinite` }} />
            </g>
            <text x="110" y="12" fontFamily={MONO} fontSize="9" fill={sparks[row].color}>▲ {[12,8,21][row]}%</text>
          </g>
        ))}
      </g>
    </ScenePanel>
  );
};

// 10. Persona match ───────────────────────────────────────────────
export const Persona = (): ReactElement => (
  <ScenePanel>
    <FrameRect />
    <text x="14" y="22" fontFamily={MONO} fontSize="9" fill="#9CA3AF">persona match</text>
    <g transform="translate(40 70)">
      <circle r="22" fill="#FFE4E8" stroke="#FF4D6D" strokeWidth="1.5" />
      <circle cx="-7" cy="-4" r="2" fill="#1A1A2E" />
      <circle cx="7"  cy="-4" r="2" fill="#1A1A2E" />
      <path d="M-7 6 Q0 12 7 6" fill="none" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    <g transform="translate(80 50)" fontFamily="Inter, system-ui, sans-serif" fontSize="10">
      <text fill="#1A1A2E" fontWeight="700">Casey · 32</text>
      <text y="14" fill="#9CA3AF" fontSize="9">solo founder · SF</text>
      <text y="30" fill="#6B7280" fontSize="9">Pain: research overload</text>
      <g transform="translate(0 38)">
        <rect width="80" height="5" rx="2.5" fill="#F0F0F5"/>
        <rect width="62" height="5" rx="2.5" fill="#FF4D6D"
          style={{ animation: "growX 3.5s ease-out infinite", transformOrigin: "0 2.5px" }} />
      </g>
      <text y="56" fill="#FF4D6D" fontWeight="700" fontSize="9">match · 78%</text>
    </g>
  </ScenePanel>
);
