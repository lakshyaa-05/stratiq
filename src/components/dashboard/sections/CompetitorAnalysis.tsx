"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Competitor, SectorSocialSignals } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import {
  Star, ChevronDown, ChevronUp, ExternalLink, AlertTriangle, CheckCircle2,
  XCircle, Building2, Globe, Store, AtSign, Play, ThumbsUp, Hash, TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { C, S } from "@/lib/design";
import { formatCount } from "@/lib/utils";

interface Props {
  competitors: Competitor[];
  sectorSocialSignals?: SectorSocialSignals;
}

const threatColor = (score: number) => score >= 8 ? C.red : score >= 6 ? C.amber : C.green;

const typeConfig = (type: string) => {
  if (type === "local") return { label: "Local", bg: C.greenLight, color: C.green, icon: Store };
  if (type === "national_chain") return { label: "Chain", bg: C.amberLight, color: C.amber, icon: Building2 };
  return { label: "MNC", bg: "#EEF2FF", color: C.indigo, icon: Globe };
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={11}
          fill={n <= Math.round(rating) ? "#F59E0B" : "none"}
          color={n <= Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
        />
      ))}
    </span>
  );
}

function SocialBadge({ platform, value }: { platform: string; value: string }) {
  const absent = !value || value.toLowerCase().includes("no presence");
  const bg = absent ? C.bg : C.coralFaint;
  const color = absent ? C.soft : C.coral;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: bg, flex: 1 }}>
      {platform === "Instagram" && <AtSign size={12} color={color} />}
      {platform === "YouTube" && <Play size={12} color={color} />}
      {platform === "Facebook" && <ThumbsUp size={12} color={color} />}
      {!["Instagram", "YouTube", "Facebook"].includes(platform) && <Hash size={12} color={color} />}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: C.soft, textTransform: "uppercase", letterSpacing: "0.04em" }}>{platform}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color }}>{absent ? "No presence" : value}</div>
      </div>
    </div>
  );
}

export default function CompetitorAnalysisSection({ competitors, sectorSocialSignals }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const chartData = competitors.map((c) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name,
    threat: c.threatScore,
  }));

  return (
    <div>
      <SectionHeader number={2} title="Local Competitor Analysis" subtitle={`${competitors.length} competitors found — real ratings & reviews from Google Maps`} />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Competitor cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {competitors.map((c, i) => {
            const open = expanded === c.name;
            const tc = typeConfig(c.type || (c.isLocal ? "local" : "multinational"));
            const TypeIcon = tc.icon;
            const sp = c.socialPresence;

            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: S.card }}
              >
                <button
                  onClick={() => setExpanded(open ? null : c.name)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", textAlign: "left", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  {/* Avatar */}
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>{c.name.slice(0, 2).toUpperCase()}</span>
                  </div>

                  {/* Name + rating */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: C.ink }}>{c.name}</span>
                      {c.website && <ExternalLink size={11} color={C.soft} />}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 99, background: tc.bg, fontSize: 10, fontWeight: 700, color: tc.color }}>
                        <TypeIcon size={10} />{tc.label}
                      </span>
                    </div>

                    {/* Real rating + review count — prominent */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <StarRating rating={c.rating} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#F59E0B" }}>{c.rating?.toFixed(1)}</span>
                        <span style={{ fontSize: 12, color: C.muted }}>
                          · <span style={{ fontWeight: 700, color: C.ink }}>{formatCount(c.reviewCount ?? 0)}</span> reviews
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: C.soft }}>{c.priceRange}</span>
                    </div>

                    {/* Address pill */}
                    {c.address && (
                      <div style={{ marginTop: 4, fontSize: 11, color: C.soft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>
                        📍 {c.address}
                      </div>
                    )}
                  </div>

                  {/* Threat score */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: C.soft }}>Threat</div>
                    <div style={{ fontSize: 17, fontWeight: 900, color: threatColor(c.threatScore) }}>{c.threatScore}/10</div>
                  </div>
                  {open ? <ChevronUp size={16} color={C.soft} /> : <ChevronDown size={16} color={C.soft} />}
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "16px 20px 20px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 16 }}>
                        {c.localInsight && (
                          <div style={{ padding: "10px 14px", borderRadius: 10, background: C.bg, borderLeft: `3px solid ${tc.color}` }}>
                            <span style={{ fontSize: 12, color: C.muted, fontStyle: "italic" }}>{c.localInsight}</span>
                          </div>
                        )}

                        {/* Strengths / Weaknesses / Missing */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                          {[
                            { icon: CheckCircle2, label: "Strengths",        items: c.strengths,       color: C.green },
                            { icon: XCircle,      label: "Weaknesses",       items: c.weaknesses,      color: C.red },
                            { icon: AlertTriangle, label: "Missing Services", items: c.missingServices, color: C.coral },
                          ].map(({ icon: Icon, label, items, color }) => (
                            <div key={label}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                <Icon size={13} color={color} />
                                <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
                              </div>
                              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5 }}>
                                {items.map((s) => (
                                  <li key={s} style={{ fontSize: 12, color: C.muted, display: "flex", gap: 6 }}>
                                    <span style={{ color, marginTop: 1 }}>•</span>{s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Social presence */}
                        {sp && (
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              Social Presence
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              {sp.instagram && <SocialBadge platform="Instagram" value={sp.instagram} />}
                              {sp.facebook && <SocialBadge platform="Facebook" value={sp.facebook} />}
                              {sp.youtube && <SocialBadge platform="YouTube" value={sp.youtube} />}
                            </div>
                            {sp.activity && (
                              <div style={{ marginTop: 8, fontSize: 11, color: C.soft }}>
                                Activity: <span style={{ fontWeight: 600, color: C.muted }}>{sp.activity}</span>
                                {sp.topPlatform && <> · Top platform: <span style={{ fontWeight: 600, color: C.coral }}>{sp.topPlatform}</span></>}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Threat chart */}
          <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, boxShadow: S.card }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Threat Scores</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F8" horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10, fill: C.soft }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: C.soft }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: C.surfaceDark, border: `1px solid ${C.borderDark}`, borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "#F9FAFB" }} />
                <Bar dataKey="threat" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={threatColor(entry.threat)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick opportunity callout */}
          <div style={{ background: "linear-gradient(135deg, #FFF0F3, #FFE4E8)", borderRadius: 16, border: `1px solid ${C.coralLight}`, padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 8 }}>Your Opportunity</h3>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: 0 }}>
              {competitors.filter((c) => c.threatScore < 7).length} of {competitors.length} competitors have critical weaknesses — especially around{" "}
              {competitors.flatMap((c) => c.missingServices).slice(0, 2).join(" and ")}.
            </p>
          </div>

          {/* Sector social signals */}
          {sectorSocialSignals && (
            <div style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, boxShadow: S.card }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <TrendingUp size={14} color={C.coral} />
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0 }}>Social & Influencer Trends</h3>
              </div>

              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, marginBottom: 12 }}>
                {sectorSocialSignals.marketMood}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Dominant Platform</div>
                <span style={{ padding: "3px 10px", borderRadius: 99, background: C.coralLight, fontSize: 12, fontWeight: 700, color: C.coral }}>
                  {sectorSocialSignals.dominantPlatform}
                </span>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Key Influencer Types</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {sectorSocialSignals.keyInfluencerTypes.map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ color: C.coral, marginTop: 1, fontSize: 10 }}>▸</span>
                      <span style={{ fontSize: 12, color: C.muted }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Trending in Sector</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {sectorSocialSignals.trendingHashtags.map((tag) => (
                    <span key={tag} style={{ padding: "2px 8px", borderRadius: 99, background: "#EEF2FF", fontSize: 11, fontWeight: 600, color: C.indigo }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.soft, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Content That Works</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {sectorSocialSignals.contentTypesThatWork.map((t, i) => (
                    <div key={i} style={{ fontSize: 11, color: C.muted, display: "flex", gap: 6 }}>
                      <span style={{ color: C.green }}>✓</span>{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
