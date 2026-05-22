"use client";

import { motion } from "framer-motion";
import { LocalLandscape } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import { Store, Globe, Building2, MapPin, Lightbulb } from "lucide-react";
import { C, G, S } from "@/lib/design";

interface Props {
  data: LocalLandscape;
  city: string;
}

const typeConfig = (type: string) => {
  if (type === "local") return { label: "Local Business", bg: C.greenLight, color: C.green, icon: Store };
  if (type === "national_chain") return { label: "National Chain", bg: C.amberLight, color: C.amber, icon: Building2 };
  return { label: "Multinational", bg: "#EEF2FF", color: C.indigo, icon: Globe };
};

export default function LocalLandscapeSection({ data, city }: Props) {
  const total = data.localVsMNC.localCount + data.localVsMNC.mncCount;
  const localPct = total > 0 ? Math.round((data.localVsMNC.localCount / total) * 100) : 50;
  const mncPct = 100 - localPct;

  return (
    <div>
      <SectionHeader
        number={2}
        title="Local Market Landscape"
        subtitle={`Who dominates ${city} — local independents or global chains?`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Local vs MNC breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}
        >
          <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: "0 0 18px" }}>Local vs Chain Split</h3>
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, textAlign: "center", padding: "16px 12px", borderRadius: 14, background: C.greenLight }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>{data.localVsMNC.localCount}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.green, marginTop: 4 }}>Local Players</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", padding: "16px 12px", borderRadius: 14, background: "#EEF2FF" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.indigo }}>{data.localVsMNC.mncCount}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.indigo, marginTop: 4 }}>Chains / MNCs</div>
            </div>
          </div>

          {/* Split bar */}
          <div style={{ height: 10, borderRadius: 99, overflow: "hidden", display: "flex", marginBottom: 12 }}>
            <div style={{ width: `${localPct}%`, background: G.coral, transition: "width 0.8s ease" }} />
            <div style={{ flex: 1, background: C.indigo }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>{localPct}% Local</span>
            <span style={{ fontSize: 11, color: C.indigo, fontWeight: 600 }}>{mncPct}% Chains</span>
          </div>

          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: "16px 0 0" }}>
            {data.localVsMNC.summary}
          </p>
        </motion.div>

        {/* Brand Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card, display: "flex", flexDirection: "column" }}
        >
          <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: "0 0 18px" }}>Brand Opportunity Score</h3>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: `conic-gradient(${C.coral} ${data.brandOpportunityScore * 10}%, ${C.border} 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: C.coral }}>{data.brandOpportunityScore}</span>
              </div>
            </div>
            <span style={{ fontSize: 12, color: C.muted }}>out of 10</span>
          </div>
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: C.coralFaint, borderLeft: `3px solid ${C.coral}` }}>
            <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: C.coral }}>Your advantage:</strong> {data.localVsMNC.localAdvantage}
            </p>
          </div>
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Dominant Players */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <MapPin size={14} color={C.coral} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>Dominant Players</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {data.dominantPlayers.map((player, i) => {
              const tc = typeConfig(player.type);
              const Icon = tc.icon;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 12, background: C.bg }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={tc.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: C.ink }}>{player.name}</span>
                      <span style={{ padding: "2px 7px", borderRadius: 99, background: tc.bg, fontSize: 10, fontWeight: 700, color: tc.color }}>{player.marketShare}</span>
                    </div>
                    <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.5 }}>
                      <span style={{ color: C.amber, fontWeight: 600 }}>Weakness: </span>{player.weakness}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* White Space */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "linear-gradient(135deg, #FFF0F3 0%, #F8F9FF 100%)", borderRadius: 18, border: `1px solid ${C.coralLight}`, padding: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lightbulb size={14} color="white" />
            </div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>Your White Space</h3>
          </div>
          <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.75, margin: 0 }}>
            {data.whiteSpace}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
