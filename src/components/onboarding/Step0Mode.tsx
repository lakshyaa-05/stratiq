"use client";

import { motion } from "framer-motion";
import { Store, Rocket } from "lucide-react";
import { BusinessMode } from "@/lib/types";
import { C, G, S } from "@/lib/design";

interface Props {
  value: BusinessMode | "";
  onChange: (v: BusinessMode) => void;
  onNext: () => void;
}

const OPTIONS: { mode: BusinessMode; icon: typeof Store; title: string; subtitle: string; badge: string }[] = [
  {
    mode: "existing",
    icon: Store,
    title: "My business already exists",
    subtitle: "Analyse real competitors, see who's beating you and where you have the edge.",
    badge: "Existing Brand",
  },
  {
    mode: "new_launch",
    icon: Rocket,
    title: "I'm planning to launch",
    subtitle: "Find out if there's a market gap, who the key players are, and whether it's worth entering.",
    badge: "New Launch",
  },
];

export default function Step0Mode({ value, onChange, onNext }: Props) {
  const handleSelect = (mode: BusinessMode) => {
    onChange(mode);
    setTimeout(onNext, 180); // small delay so the selection animates before advancing
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: C.coralLight, marginBottom: 20 }}>
          <Rocket size={13} color={C.coral} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Step 1 of 6</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          What are you{" "}
          <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            here for?
          </span>
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          This shapes your entire analysis — pick the one that fits.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        {OPTIONS.map(({ mode, icon: Icon, title, subtitle, badge }, i) => {
          const selected = value === mode;
          return (
            <motion.button
              key={mode}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              onClick={() => handleSelect(mode)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 22px",
                borderRadius: 18, border: `2px solid ${selected ? C.coral : C.border}`,
                background: selected ? C.coralFaint : "white",
                boxShadow: selected ? `0 0 0 4px ${C.coralLight}, ${S.card}` : S.card,
                cursor: "pointer", textAlign: "left", transition: "all 0.18s",
              }}
              onMouseEnter={(e) => { if (!selected) { (e.currentTarget as HTMLElement).style.borderColor = C.coral + "80"; } }}
              onMouseLeave={(e) => { if (!selected) { (e.currentTarget as HTMLElement).style.borderColor = C.border; } }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: selected ? G.coral : C.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s",
              }}>
                <Icon size={20} color={selected ? "white" : C.muted} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{title}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: selected ? C.coral : C.bg, color: selected ? "white" : C.soft, flexShrink: 0, transition: "all 0.18s" }}>
                    {badge}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{subtitle}</p>
              </div>
              {selected && (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
