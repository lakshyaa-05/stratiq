"use client";

import { motion } from "framer-motion";
import { SEOAudit } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ScoreMeter from "@/components/ui/ScoreMeter";
import { AlertTriangle, CheckCircle2, Info, TrendingUp } from "lucide-react";
import { C, S } from "@/lib/design";

const IMPACT_BG: Record<string, string> = {
  high: "#FEF2F2", medium: "#FFFBEB", low: "#F9FAFB",
};

export default function SEOAuditSection({ data, website }: { data: SEOAudit; website: string }) {
  const allIssues = [...data.metaIssues, ...data.technicalIssues, ...data.contentWeaknesses];
  const highIssues = allIssues.filter((i) => i.impact === "high");
  const medIssues = allIssues.filter((i) => i.impact === "medium");

  return (
    <div>
      <SectionHeader number={5} title="SEO Audit" subtitle={`Full diagnostic for ${website}`} />

      {/* Score cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { score: Math.round(data.overallScore / 10),     label: "Overall SEO",    raw: data.overallScore,        color: "coral" as const },
          { score: Math.round(data.pageSpeed.mobile / 10), label: "Mobile Speed",   raw: data.pageSpeed.mobile,   color: "indigo" as const },
          { score: Math.round(data.pageSpeed.desktop / 10),label: "Desktop Speed",  raw: data.pageSpeed.desktop,  color: "green" as const },
          { score: Math.round(data.localSEOScore / 10),    label: "Local SEO",      raw: data.localSEOScore,       color: "coral" as const },
        ].map((item) => (
          <div key={item.label} style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: S.card }}>
            <ScoreMeter score={item.score} label={item.label} color={item.color} size={88} />
            <span style={{ fontSize: 11, color: C.soft }}>{item.raw}/100</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Issues */}
        <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>Issues & Fixes</h3>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{highIssues.length} high</span>
              <span style={{ fontSize: 12, color: C.amber, fontWeight: 600 }}>{medIssues.length} medium</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 340, overflowY: "auto" }}>
            {allIssues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{ borderRadius: 12, padding: 14, background: IMPACT_BG[issue.impact] }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <Badge variant={issue.impact === "high" ? "coral" : issue.impact === "medium" ? "amber" : "grey"}>
                    {issue.impact}
                  </Badge>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, margin: 0, flex: 1, lineHeight: 1.4 }}>{issue.issue}</p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <CheckCircle2 size={13} color={C.green} style={{ marginTop: 1, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.55 }}>{issue.fix}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Keywords */}
          <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={16} color={C.indigo} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>Keyword Opportunities</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {data.keywordOpportunities.map((kw) => (
                <div key={kw.keyword} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.bg}` }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{kw.keyword}</span>
                    <div style={{ fontSize: 11, color: C.soft, marginTop: 2 }}>{kw.searchVolume}/mo</div>
                  </div>
                  <Badge variant={kw.difficulty === "easy" ? "green" : kw.difficulty === "medium" ? "amber" : "coral"}>
                    {kw.difficulty}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Keyword gaps */}
          <div style={{ background: "white", borderRadius: 18, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: "0 0 14px" }}>Competitor Keyword Gaps</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.competitorKeywordGaps.map((kw) => (
                <span key={kw} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 8, background: C.bg, color: C.muted }}>{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
