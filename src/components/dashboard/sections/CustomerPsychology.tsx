"use client";

import { motion } from "framer-motion";
import { CustomerPsychology } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import { Brain, Heart, ShoppingBag } from "lucide-react";
import { C, S } from "@/lib/design";

const AVATARS = ["👩‍💼", "👨‍💻", "👩‍🎓", "🧑‍🏫", "👩‍⚕️", "👨‍🏫"];

export default function CustomerPsychologySection({ data }: { data: CustomerPsychology }) {
  return (
    <div>
      <SectionHeader number={3} title="Customer Psychology" subtitle="Who your ideal customer is and what drives them to buy" />

      {/* Persona cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18, marginBottom: 24 }}>
        {data.personas.map((persona, i) => (
          <motion.div
            key={persona.name}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
            style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: "linear-gradient(135deg, #FFE4E8, #FFF0F3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                {AVATARS[i % AVATARS.length]}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.ink, margin: "0 0 3px" }}>{persona.name}</h3>
                <p style={{ fontSize: 12, color: C.soft, margin: "0 0 6px" }}>{persona.age}</p>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.coral, background: C.coralFaint, padding: "2px 10px", borderRadius: 99 }}>{persona.preferredPricing}</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>{persona.description}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.soft, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Pain Points</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {persona.painPoints.slice(0, 3).map((p) => (
                    <span key={p} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: C.coralFaint, color: C.coral }}>{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.soft, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Preferred Platforms</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {persona.preferredPlatforms.map((p) => (
                    <span key={p} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: C.bg, color: C.muted }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {/* Pain points */}
        <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Brain size={17} color={C.coral} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>Top Pain Points</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.topPainPoints.map((pain, i) => (
              <motion.div key={pain.pain} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{pain.pain}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.coral }}>{pain.opportunityScore}/10</span>
                </div>
                <div style={{ height: 5, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                  <motion.div
                    style={{ height: "100%", background: "linear-gradient(90deg, #FF4D6D, #FF8C69)", borderRadius: 99 }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pain.opportunityScore * 10}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>
                <span style={{ fontSize: 11, color: C.soft, marginTop: 4, display: "block" }}>{pain.frequency}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Trust factors */}
          <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Heart size={16} color={C.coral} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Trust Factors</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.trustFactors.map((t) => (
                <span key={t} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 10, background: C.greenLight, color: "#059669", fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Buying patterns */}
          <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <ShoppingBag size={16} color={C.indigo} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Buying Patterns</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {data.buyingPatterns.map((p) => (
                <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: C.muted }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.indigo, marginTop: 5, flexShrink: 0 }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
