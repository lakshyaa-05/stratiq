"use client";

import { motion } from "framer-motion";
import { ActionPlan } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Zap, Calendar, Rocket, TrendingUp, ArrowUpRight } from "lucide-react";
import { C, S } from "@/lib/design";

const PRIORITY: Record<string, { badge: "coral" | "amber" | "indigo"; color: string }> = {
  critical: { badge: "coral",  color: C.red },
  high:     { badge: "amber",  color: C.amber },
  medium:   { badge: "indigo", color: C.indigo },
};

export default function ActionPlanSection({ data, businessName }: { data: ActionPlan; businessName: string }) {
  return (
    <div>
      <SectionHeader number={8} title="Action Plan" subtitle={`Your complete growth roadmap for ${businessName}`} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Immediate actions */}
        <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Zap size={17} color={C.coral} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>This Week</h3>
            <Badge variant="coral">Immediate</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.immediateActions.map((action, i) => {
              const cfg = PRIORITY[action.priority] || PRIORITY.medium;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ borderRadius: 14, border: `1px solid ${C.border}`, padding: 16 }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, flex: 1, lineHeight: 1.4 }}>{action.title}</span>
                    <Badge variant={cfg.badge}>{action.priority}</Badge>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: "0 0 10px" }}>{action.description}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: C.soft }}>{action.timeframe}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ height: 4, width: 64, background: C.bg, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: cfg.color, borderRadius: 99, width: `${action.priorityScore * 10}%` }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.coral }}>{action.priorityScore}/10</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 30-day roadmap */}
        <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Calendar size={17} color={C.indigo} />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>30-Day Roadmap</h3>
          </div>
          <div style={{ position: "relative", paddingLeft: 24, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ position: "absolute", left: 8, top: 6, bottom: 6, width: 2, background: "linear-gradient(180deg, #FF4D6D, #667EEA)", opacity: 0.25, borderRadius: 99 }} />
            {data.thirtyDayRoadmap.map((milestone, i) => (
              <motion.div
                key={milestone.week}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ position: "relative" }}
              >
                <div style={{ position: "absolute", left: -24, top: 2, width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.coral}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.coral }}>{milestone.week}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{milestone.title}</span>
                </div>
                <p style={{ fontSize: 11, color: C.soft, margin: "0 0 8px" }}>{milestone.goal}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  {milestone.tasks.map((task) => (
                    <li key={task} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: C.muted }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.border, marginTop: 5, flexShrink: 0 }} />
                      {task}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Launch + Scaling */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "linear-gradient(135deg, #FFF0F3, #FFE4E8)", borderRadius: 18, border: `1px solid ${C.coralLight}`, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Rocket size={16} color={C.coral} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Launch Strategy</h3>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {data.launchStrategy.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: C.ink }}>
                <ArrowUpRight size={14} color={C.coral} style={{ marginTop: 2, flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)", borderRadius: 18, border: "1px solid #E0D9FF", padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <TrendingUp size={16} color={C.indigo} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Scaling Recommendations</h3>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {data.scalingRecommendations.map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: C.ink }}>
                <ArrowUpRight size={14} color={C.indigo} style={{ marginTop: 2, flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
