"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Search, Target, Zap, Users, TrendingUp, FileText } from "lucide-react";
import { C, G, S } from "@/lib/design";
import MovingBackground from "@/components/shared/MovingBackground";

const FEATURES = [
  { icon: BarChart3,   title: "Market Overview",       desc: "Real market size, demand trends, growth potential and local opportunity scores.", grad: G.coral },
  { icon: Target,      title: "Competitor Intel",       desc: "Live competitor data with pricing, weaknesses, review sentiment and threat scores.", grad: G.indigo },
  { icon: Brain,       title: "Customer Psychology",    desc: "Deep persona cards, pain points, emotional triggers and buying behavior patterns.", grad: G.coral },
  { icon: TrendingUp,  title: "Market Gaps",            desc: "Underserved audiences, missing services and positioning opportunities scored 1–10.", grad: G.indigo },
  { icon: Search,      title: "SEO Audit",              desc: "Full technical audit, keyword opportunities, competitor gaps and exact fixes.", grad: G.coral },
  { icon: Zap,         title: "Brand Positioning",      desc: "USP, taglines, positioning statement and a competitive differentiation map.", grad: G.indigo },
  { icon: FileText,    title: "Content Strategy",       desc: "Blog posts, TikTok hooks, Instagram calendar and viral content formulas.", grad: G.coral },
  { icon: Users,       title: "30-Day Action Plan",     desc: "Prioritized roadmap with milestones, launch strategy and scaling recommendations.", grad: G.indigo },
];

const STEPS = [
  { n: "01", title: "Enter your business details", desc: "Name, category, country, city, and optional website URL." },
  { n: "02", title: "AI analyzes your market",     desc: "LLaMA 70B generates deep market intelligence in real time." },
  { n: "03", title: "Get your full report",        desc: "8 sections of market intelligence, ready in under 60 seconds." },
];

const PILLS = ["Real-time AI analysis", "8 intelligence modules", "Competitor deep-dive", "Export to PDF"];

export default function HomePage() {
  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ─── HERO ─── */}
      <section
        style={{
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <MovingBackground variant="light" motif="hero" intensity={1.2} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, background: C.coralLight, border: `1px solid #FFD0D8`, marginBottom: 32 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.coral, display: "inline-block" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.coral }}>AI-powered market intelligence</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: "clamp(44px, 7vw, 76px)", fontWeight: 900, color: C.ink, lineHeight: 1.08, letterSpacing: "-0.03em", margin: "0 0 16px" }}
          >
            Outthink{" "}
            <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              your market.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontSize: "clamp(16px, 2vw, 20px)", color: C.soft, maxWidth: 540, margin: "0 auto 16px", lineHeight: 1.6, fontWeight: 500 }}
          >
            Before the competition does.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 16, color: C.muted, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}
          >
            Enter your business details. Stratiq delivers competitor intelligence, market gaps, SEO audit, brand positioning and a full growth roadmap in under 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link
              href="/onboarding"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 14, background: G.coral, color: "white", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: S.btn, transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
            >
              <Zap size={18} fill="white" />
              Analyze My Market
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/projects"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: "white", color: C.muted, fontWeight: 600, fontSize: 16, textDecoration: "none", border: `1.5px solid ${C.border}`, transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral; (e.currentTarget as HTMLElement).style.color = C.coral; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
            >
              View Projects
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}
          >
            {PILLS.map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.soft }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
                {t}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "96px 24px", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 40, fontWeight: 900, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 12px" }}
            >
              Intelligence in{" "}
              <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                3 steps
              </span>
            </motion.h2>
            <p style={{ fontSize: 17, color: C.soft }}>From idea to full market report in under 60 seconds.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              >
                <div style={{ fontSize: 56, fontWeight: 900, background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", opacity: 0.22, lineHeight: 1, marginBottom: 16 }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ink, margin: "0 0 10px" }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.65 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: "96px 24px", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontSize: 40, fontWeight: 900, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 12px" }}
            >
              Everything you need to{" "}
              <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                win your market
              </span>
            </motion.h2>
            <p style={{ fontSize: 17, color: C.soft, maxWidth: 480, margin: "0 auto" }}>8 intelligence modules that replace months of research with minutes of AI.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -5, boxShadow: S.cardHover }}
                style={{ background: C.bg, borderRadius: 20, border: `1px solid ${C.border}`, padding: 24, boxShadow: S.card, transition: "all 0.2s" }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.grad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <f.icon size={20} color="white" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: C.soft, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section style={{ padding: "96px 24px", background: G.hero, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.08)", animation: "blobA 12s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, left: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.06)", animation: "blobB 14s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em" }}
          >
            Your market is waiting.
          </motion.h2>
          <p style={{ fontSize: 20, color: "rgba(255,255,255,0.8)", margin: "0 0 40px" }}>Stop guessing. Start winning.</p>
          <Link
            href="/onboarding"
            style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 36px", borderRadius: 16, background: "white", color: C.coral, fontWeight: 800, fontSize: 18, textDecoration: "none", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", transition: "all 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.15)"; }}
          >
            <Zap size={22} fill={C.coral} />
            Analyze My Market
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: C.ink, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 800, color: "white", fontSize: 16 }}>Stratiq</span>
            <span style={{ color: C.muted, fontSize: 14 }}>— Outthink your market</span>
          </div>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>© 2026 Stratiq. AI-powered market intelligence.</p>
        </div>
      </footer>

    </div>
  );
}
