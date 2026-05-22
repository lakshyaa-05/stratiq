"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle2, Globe, MapPin, Building2 } from "lucide-react";
import { OnboardingData } from "@/lib/types";
import { CATEGORIES, COUNTRIES } from "@/lib/countries";
import { C, G, S } from "@/lib/design";

interface Props {
  data: OnboardingData;
  onAnalyze: () => void;
  onBack: () => void;
}

export default function Step6CTA({ data, onAnalyze, onBack }: Props) {
  const catLabels = (data.categories || [])
    .map((id) => CATEGORIES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");
  const countryData = COUNTRIES.find((c) => c.name === data.country);

  const items = [
    { icon: Building2, label: "Business", value: data.businessName },
    { icon: Sparkles,  label: "Category", value: catLabels || "—" },
    { icon: Globe,     label: "Market",   value: `${countryData?.flag || ""} ${data.country}` },
    { icon: MapPin,    label: "City",     value: data.city },
  ];

  const deliverables = [
    "Market Overview", "Competitor Intelligence", "Customer Psychology", "Market Gaps",
    "Brand Positioning", "Content Strategy", "30-Day Action Plan",
    data.website ? "Full SEO Audit" : "Growth Forecast",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: C.coralLight, marginBottom: 20 }}>
          <Sparkles size={13} color={C.coral} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Ready to analyze</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          Your analysis is{" "}
          <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            ready to run.
          </span>
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          Stratiq will deliver deep market intelligence in seconds — not weeks.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: "linear-gradient(135deg, #FFF5F7 0%, #F8F9FF 100%)", borderRadius: 18, border: `1px solid ${C.coralLight}`, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}
      >
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 10, background: C.coralLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon size={14} color={C.coral} />
            </div>
            <span style={{ fontSize: 12, color: C.soft, width: 72 }}>{item.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, flex: 1 }}>{item.value}</span>
            <CheckCircle2 size={15} color={C.green} />
          </motion.div>
        ))}
        {data.website && (
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 10, background: C.coralLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Globe size={14} color={C.coral} />
            </div>
            <span style={{ fontSize: 12, color: C.soft, width: 72 }}>Website</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{data.website}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.indigo, background: "#EEF2FF", padding: "2px 8px", borderRadius: 99 }}>+SEO</span>
          </motion.div>
        )}
      </motion.div>

      {/* Deliverables */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: C.bg, borderRadius: 16, border: `1px solid ${C.border}`, padding: "16px 20px" }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, color: C.soft, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>What you&apos;ll get</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {deliverables.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: C.muted }}>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ display: "flex", gap: 10 }}
      >
        <button
          onClick={onBack}
          style={{ width: 54, height: 54, borderRadius: 14, background: "white", border: `2px solid ${C.border}`, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral; (e.currentTarget as HTMLElement).style.color = C.coral; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onAnalyze}
          style={{
            flex: 1, padding: "16px", borderRadius: 14, background: G.hero, color: "white", fontWeight: 800, fontSize: 18,
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            boxShadow: S.btn, transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
        >
          <Sparkles size={20} />
          Analyze My Market
        </button>
      </motion.div>
    </div>
  );
}
