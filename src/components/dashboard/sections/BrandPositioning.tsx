"use client";

import { motion } from "framer-motion";
import { BrandPositioning } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import { Sparkles, Quote, Target, Star } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { C, S } from "@/lib/design";

export default function BrandPositioningSection({ data, businessName }: { data: BrandPositioning; businessName: string }) {
  return (
    <div>
      <SectionHeader number={6} title="Brand Positioning" subtitle={`How ${businessName} should own its market category`} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* USP */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "linear-gradient(135deg, #FFF0F3, #FFE4E8)", borderRadius: 18, border: `1px solid ${C.coralLight}`, padding: 24 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Sparkles size={16} color={C.coral} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Unique Selling Proposition</h3>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.ink, lineHeight: 1.6, margin: 0 }}>{data.usp}</p>
          </motion.div>

          {/* Positioning statement */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Target size={16} color={C.indigo} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Positioning Statement</h3>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <Quote size={18} color={C.coral} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>{data.positioningStatement}</p>
            </div>
          </motion.div>

          {/* Taglines */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Star size={16} color={C.amber} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Tagline Options</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.taglines.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12,
                    background: i === 0 ? C.coralFaint : C.bg,
                    border: i === 0 ? `1px solid ${C.coralLight}` : "1px solid transparent",
                    cursor: "default",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.soft, width: 20, textAlign: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, flex: 1 }}>&ldquo;{t}&rdquo;</span>
                  {i === 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "white", background: C.coral, padding: "2px 8px", borderRadius: 99 }}>Top Pick</span>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Radar chart */}
          <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: "0 0 4px" }}>Differentiation Map</h3>
            <p style={{ fontSize: 12, color: C.soft, margin: "0 0 16px" }}>You vs. market average across key dimensions</p>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={data.differentiationMap}>
                <PolarGrid stroke={C.border} />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: C.soft }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 9, fill: C.soft }} />
                <Radar name="Competitors" dataKey="competitors" stroke={C.soft} fill={C.soft} fillOpacity={0.15} />
                <Radar name={businessName} dataKey="yourBrand" stroke={C.coral} fill={C.coral} fillOpacity={0.28} />
                <Tooltip contentStyle={{ background: C.surfaceDark, border: `1px solid ${C.borderDark}`, borderRadius: 8, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ background: "linear-gradient(135deg, #FFF0F3, #FFE4E8)", borderRadius: 16, border: `1px solid ${C.coralLight}`, padding: 18 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: C.coral, margin: "0 0 8px" }}>Premium Angle</h3>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>{data.premiumAngle}</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", borderRadius: 16, border: `1px solid ${C.greenLight}`, padding: 18 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#059669", margin: "0 0 8px" }}>Trust Angle</h3>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>{data.trustAngle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
