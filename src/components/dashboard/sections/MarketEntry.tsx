"use client";

import { motion } from "framer-motion";
import { MarketEntryAnalysis } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Target, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { C, G, S } from "@/lib/design";

interface Props {
  data: MarketEntryAnalysis;
  city: string;
  categories: string[];
}

const VERDICT_CONFIG = {
  strong_opportunity: { color: C.green, bg: C.greenLight, label: "Strong Market Opportunity", emoji: "🚀" },
  moderate_opportunity: { color: C.amber, bg: C.amberLight, label: "Competitive but Viable",     emoji: "⚡" },
  saturated:            { color: C.red,   bg: C.redLight,   label: "Highly Saturated Market",    emoji: "⚠️" },
};

export default function MarketEntrySection({ data, city, categories }: Props) {
  const vc = VERDICT_CONFIG[data.verdict] ?? VERDICT_CONFIG.moderate_opportunity;
  const scorePct = (data.entryScore / 10) * 100;

  return (
    <div>
      <SectionHeader
        number={2}
        title="Market Entry Analysis"
        subtitle={`Should you launch ${categories.join(" / ")} in ${city}? Here's the honest answer.`}
      />

      {/* Verdict hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ borderRadius: 20, background: vc.bg, border: `2px solid ${vc.color}30`, padding: "28px 32px", marginBottom: 20, display: "flex", alignItems: "center", gap: 24 }}
      >
        <div style={{ fontSize: 52, lineHeight: 1 }}>{vc.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: vc.color }}>{data.verdictLabel}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, background: vc.color, color: "white" }}>
              <span style={{ fontSize: 14, fontWeight: 900 }}>{data.entryScore}</span>
              <span style={{ fontSize: 11, fontWeight: 600 }}>/10</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, margin: 0 }}>{data.summary}</p>
        </div>

        {/* Entry score ring */}
        <div style={{ flexShrink: 0, position: "relative", width: 80, height: 80 }}>
          <svg viewBox="0 0 80 80" style={{ width: 80, height: 80, transform: "rotate(-90deg)" }}>
            <circle cx="40" cy="40" r="32" fill="none" stroke={`${vc.color}20`} strokeWidth="8" />
            <motion.circle
              cx="40" cy="40" r="32"
              fill="none" stroke={vc.color} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - scorePct / 100) }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: vc.color }}>{data.entryScore}</span>
            <span style={{ fontSize: 9, color: C.soft, fontWeight: 600 }}>ENTRY</span>
          </div>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Pros */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={14} color={C.green} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Why Enter This Market</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.pros.map((p, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 + i * 0.06 }}
                style={{ display: "flex", gap: 10 }}
              >
                <CheckCircle2 size={14} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.55 }}>{p}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
          style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: C.redLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingDown size={14} color={C.red} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Challenges to Expect</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.cons.map((c, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 + i * 0.06 }}
                style={{ display: "flex", gap: 10 }}
              >
                <XCircle size={14} color={C.red} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.55 }}>{c}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Key players gap */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ borderRadius: 18, background: "linear-gradient(135deg, #EEF2FF, #F8F9FF)", border: `1px solid ${C.indigo}30`, padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Target size={15} color={C.indigo} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>The Gap All Key Players Are Missing</h3>
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: 0 }}>{data.keyPlayersGap}</p>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
          style={{ borderRadius: 18, background: "linear-gradient(135deg, #FFF0F3, #FFF5F7)", border: `1px solid ${C.coralLight}`, padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lightbulb size={13} color="white" />
            </div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>Recommended Entry Strategy</h3>
          </div>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: 0 }}>{data.recommendation}</p>
        </motion.div>
      </div>
    </div>
  );
}
