"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContentStrategy } from "@/lib/types";
import { SectionHeader } from "@/components/ui/Card";
import { FileText, Video, Camera, PlayCircle, TrendingUp } from "lucide-react";
import { C, G, S } from "@/lib/design";

const TABS = [
  { id: "blog",      label: "Blog Posts",  icon: FileText,   accent: C.indigo },
  { id: "tiktok",    label: "TikTok",      icon: Video,      accent: "#EE1D52" },
  { id: "instagram", label: "Instagram",   icon: Camera,     accent: "#E1306C" },
  { id: "youtube",   label: "YouTube",     icon: PlayCircle, accent: "#FF0000" },
  { id: "viral",     label: "Viral Hooks", icon: TrendingUp, accent: C.coral },
];

export default function ContentStrategySection({ data }: { data: ContentStrategy }) {
  const [tab, setTab] = useState("blog");

  const content = ({
    blog:      data.blogPosts,
    tiktok:    data.tiktokIdeas,
    instagram: data.instagramCalendar,
    youtube:   data.youtubeTopics,
    viral:     data.viralHooks.map((h) => ({ title: h })),
  } as Record<string, { title: string; hook?: string; description?: string }[]>)[tab] || [];

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div>
      <SectionHeader number={7} title="Content Strategy" subtitle="Ready-to-use content ideas across every channel" />

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 16px",
              borderRadius: 12, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer",
              background: tab === t.id ? G.coral : "white",
              color: tab === t.id ? "white" : C.muted,
              border: tab === t.id ? "none" : `1px solid ${C.border}`,
              boxShadow: tab === t.id ? S.btn : "none",
              transition: "all 0.18s",
            } as React.CSSProperties}
            onMouseEnter={(e) => { if (tab !== t.id) { (e.currentTarget as HTMLElement).style.borderColor = C.coral + "80"; (e.currentTarget as HTMLElement).style.color = C.ink; } }}
            onMouseLeave={(e) => { if (tab !== t.id) { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; } }}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {content.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(255,77,109,0.1)", borderColor: C.coral + "50" }}
            style={{ background: "white", borderRadius: 16, border: `1px solid ${C.border}`, padding: 20, boxShadow: S.card, transition: "all 0.2s" }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: C.coralFaint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: C.coral }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.45, margin: "0 0 6px" }}>{item.title}</p>
                {item.hook && (
                  <p style={{ fontSize: 12, color: activeTab.accent, fontStyle: "italic", margin: "0 0 4px" }}>&ldquo;{item.hook}&rdquo;</p>
                )}
                {item.description && (
                  <p style={{ fontSize: 12, color: C.soft, lineHeight: 1.55, margin: 0 }}>{item.description}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
