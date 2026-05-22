"use client";

import { motion } from "framer-motion";
import { MarketGap } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import { Search, TrendingUp, MapPin } from "lucide-react";
import { C, S } from "@/lib/design";

interface Props {
  gaps: MarketGap[];
  marketSearchSummary?: { summary: string; topSearches: string[] };
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; color: string; emoji: string }> = {
  service:     { label: "Service Gap",     bg: C.coralLight,  color: C.coral,  emoji: "🛠️" },
  content:     { label: "Content Gap",     bg: "#EEF2FF",     color: C.indigo, emoji: "📝" },
  positioning: { label: "Positioning Gap", bg: C.amberLight,  color: C.amber,  emoji: "🎯" },
  audience:    { label: "Audience Gap",    bg: C.greenLight,  color: C.green,  emoji: "👥" },
};

export default function MarketGapsSection({ gaps, marketSearchSummary }: Props) {
  const sorted = [...gaps].sort((a, b) => b.opportunityScore - a.opportunityScore);

  return (
    <div>
      <SectionHeader number={4} title="Market Gaps" subtitle="What people are actually looking for — and what no competitor is delivering" />

      {/* What people are searching for */}
      {marketSearchSummary && (marketSearchSummary.summary || marketSearchSummary.topSearches?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, marginBottom: 24, boxShadow: S.card }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: C.coralLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Search size={15} color={C.coral} />
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: C.ink, margin: 0 }}>What People Are Actually Searching For</h3>
              <p style={{ fontSize: 11, color: C.soft, margin: 0 }}>Real demand signals in this market</p>
            </div>
          </div>

          {marketSearchSummary.summary && (
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: "0 0 16px", borderLeft: `3px solid ${C.coralLight}`, paddingLeft: 14 }}>
              {marketSearchSummary.summary}
            </p>
          )}

          {marketSearchSummary.topSearches?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Top Search Queries in This Sector
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {marketSearchSummary.topSearches.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: C.bg, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.ink }}
                  >
                    <Search size={10} color={C.coral} />
                    {q}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Gap cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {sorted.map((gap, i) => {
          const cfg = TYPE_CONFIG[gap.type] || TYPE_CONFIG.service;
          return (
            <motion.div
              key={gap.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.09 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(255,77,109,0.12)" }}
              style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 22, boxShadow: S.card, transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 0 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{cfg.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "3px 10px", borderRadius: 99 }}>{cfg.label}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: C.soft }}>Opportunity</div>
                  <div style={{ fontSize: 22, fontWeight: 900, background: "linear-gradient(135deg, #FF4D6D, #FF8C69)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {gap.opportunityScore}/10
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>{gap.title}</h3>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{gap.description}</p>

              {/* Local angle */}
              {gap.localAngle && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "8px 12px", borderRadius: 10, background: C.coralFaint, marginBottom: 12 }}>
                  <MapPin size={11} color={C.coral} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.55, fontStyle: "italic" }}>{gap.localAngle}</span>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral }} />
                <span style={{ fontSize: 11, color: C.soft }}>Target: </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>{gap.audience}</span>
              </div>

              <div style={{ marginTop: 10, height: 4, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                <motion.div
                  style={{ height: "100%", background: "linear-gradient(90deg, #FF4D6D, #FF8C69)", borderRadius: 99 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${gap.opportunityScore * 10}%` }}
                  transition={{ delay: i * 0.09 + 0.4, duration: 0.8 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {sorted[0] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 20, borderRadius: 18, background: "linear-gradient(135deg, #FFF0F3, #F8F9FF)", border: `1px solid ${C.coralLight}`, padding: 20, display: "flex", alignItems: "center", gap: 16 }}
        >
          <TrendingUp size={28} color={C.coral} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: C.ink, margin: "0 0 4px" }}>Biggest Opportunity: {sorted[0].title}</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Score {sorted[0].opportunityScore}/10 — The highest-value gap in your market that no competitor is currently addressing.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
