"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/lib/types";
import { listProjects } from "@/lib/api";
import { BarChart3, MapPin, Clock, ArrowRight, Plus, Zap } from "lucide-react";
import { C, G, S } from "@/lib/design";
import { formatDate } from "@/lib/utils";
import MovingBackground from "@/components/shared/MovingBackground";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProjects().then(setProjects).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, paddingTop: 96, paddingBottom: 48, position: "relative", overflow: "hidden" }}>
      <MovingBackground variant="light" motif="projects" intensity={0.7} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: C.ink, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Your Projects</h1>
            <p style={{ fontSize: 15, color: C.soft, margin: 0 }}>All your market analyses, saved and ready.</p>
          </div>
          <Link
            href="/onboarding"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, background: G.coral, color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: S.btn, transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
          >
            <Plus size={16} />
            New Analysis
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 18 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 160, borderRadius: 18, background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "80px 0" }}
          >
            <div style={{ fontSize: 56, marginBottom: 20 }}>🔍</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: "0 0 10px" }}>No analyses yet</h2>
            <p style={{ fontSize: 15, color: C.soft, margin: "0 0 28px" }}>Start your first market analysis to see it here.</p>
            <Link
              href="/onboarding"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: G.coral, color: "white", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: S.btn }}
            >
              Start Analysis
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 18 }}>
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(255,77,109,0.12)" }}
                style={{ transition: "all 0.2s" }}
              >
                <Link href={`/dashboard/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <div
                    style={{ background: "white", borderRadius: 20, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card, transition: "border-color 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral + "50"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Zap size={20} color="white" fill="white" />
                      </div>
                      <ArrowRight size={16} color={C.border} />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ink, margin: "0 0 8px" }}>{p.businessName}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: C.soft }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={13} />
                        {p.city}, {p.country}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={13} />
                        {formatDate(p.createdAt)}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                      {p.category.slice(0, 3).map((cat) => (
                        <span key={cat} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: C.coralFaint, color: C.coral, fontWeight: 600 }}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
