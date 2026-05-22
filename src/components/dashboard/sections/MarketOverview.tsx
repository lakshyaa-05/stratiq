"use client";

import { motion } from "framer-motion";
import { MarketOverview } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import ScoreMeter from "@/components/ui/ScoreMeter";
import Badge from "@/components/ui/Badge";
import { TrendingUp, DollarSign, Target, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { C, S } from "@/lib/design";

interface Props { data: MarketOverview; businessName: string; }

const KPI_ICON_BG: Record<string, string> = {
  coral: C.coralFaint, green: "#F0FDF4", indigo: "#EEF2FF", amber: C.amberLight,
};
const KPI_ICON_COLOR: Record<string, string> = {
  coral: C.coral, green: C.green, indigo: C.indigo, amber: C.amber,
};

export default function MarketOverviewSection({ data, businessName }: Props) {
  const kpis = [
    { icon: DollarSign, label: "Market Size",        value: data.marketSize,                          badge: "TAM",      color: "coral" as const },
    { icon: TrendingUp, label: "Growth Rate",         value: data.growthRate,                          badge: "YoY",      color: "green" as const },
    { icon: Target,     label: "Local Opportunity",   value: `${data.localOpportunityScore}/10`,       badge: "Score",    color: "indigo" as const },
    { icon: Zap,        label: "Growth Potential",    value: `${data.growthPotentialScore}/10`,        badge: "AI Score", color: "amber" as const },
  ];

  return (
    <div>
      <SectionHeader number={1} title="Market Overview" subtitle="Live market intelligence for your category and location" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 20, boxShadow: S.card }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: KPI_ICON_BG[kpi.color], display: "flex", alignItems: "center", justifyContent: "center" }}>
                <kpi.icon size={18} color={KPI_ICON_COLOR[kpi.color]} />
              </div>
              <Badge variant={kpi.color}>{kpi.badge}</Badge>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: 13, color: C.soft, marginTop: 6 }}>{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Chart */}
        <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>Demand Trend</h3>
              <p style={{ fontSize: 12, color: C.soft, margin: "4px 0 0" }}>12-month search & conversation volume</p>
            </div>
            <Badge variant="green" dot>Live</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.demandTrend}>
              <defs>
                <linearGradient id="coralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4D6D" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#FF4D6D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.soft }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.soft }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: C.surfaceDark, border: `1px solid ${C.borderDark}`, borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: "#F9FAFB" }}
                itemStyle={{ color: C.orange }}
              />
              <Area type="monotone" dataKey="value" stroke={C.coral} strokeWidth={2.5} fill="url(#coralGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scores */}
        <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <ScoreMeter score={data.localOpportunityScore} label="Local Opportunity" color="coral" size={110} />
          <ScoreMeter score={data.growthPotentialScore} label="Growth Potential" color="indigo" size={110} />
        </div>
      </div>

      {/* AI insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ borderRadius: 18, background: "linear-gradient(135deg, #FFF0F3 0%, #F8F9FF 100%)", border: `1px solid ${C.coralLight}`, padding: 20, display: "flex", gap: 16, alignItems: "flex-start" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #FF4D6D, #FF8C69)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Zap size={15} color="white" fill="white" />
        </div>
        <p style={{ fontSize: 14, color: C.ink, lineHeight: 1.7, margin: 0 }}>{data.summary}</p>
      </motion.div>
    </div>
  );
}
