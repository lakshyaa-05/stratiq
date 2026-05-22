"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnalysisResult } from "@/lib/types";
import { BarChart3, Users, TrendingUp, Target, Search, Megaphone, FileText, ListChecks, MessageSquare, Download, Share2, Zap, Rocket } from "lucide-react";
import MarketOverviewSection from "./sections/MarketOverview";
import LocalLandscapeSection from "./sections/LocalLandscape";
import CompetitorAnalysisSection from "./sections/CompetitorAnalysis";
import CustomerPsychologySection from "./sections/CustomerPsychology";
import MarketGapsSection from "./sections/MarketGaps";
import SEOAuditSection from "./sections/SEOAudit";
import BrandPositioningSection from "./sections/BrandPositioning";
import ContentStrategySection from "./sections/ContentStrategy";
import ActionPlanSection from "./sections/ActionPlan";
import MarketEntrySection from "./sections/MarketEntry";
import AIChat from "@/components/shared/AIChat";
import toast from "react-hot-toast";
import { C, G, S } from "@/lib/design";
import MovingBackground from "@/components/shared/MovingBackground";
import { Motif } from "@/components/shared/MovingBackground";

const NAV_ITEMS = [
  { id: "market",      label: "Market",      icon: BarChart3,  mode: null },
  { id: "landscape",   label: "Landscape",   icon: TrendingUp, mode: null },
  { id: "entry",       label: "Entry",       icon: Rocket,     mode: "new_launch" },
  { id: "competitors", label: "Competitors", icon: Target,     mode: null },
  { id: "psychology",  label: "Psychology",  icon: Users,      mode: null },
  { id: "gaps",        label: "Gaps",        icon: TrendingUp, mode: null },
  { id: "seo",         label: "SEO",         icon: Search,     mode: null },
  { id: "brand",       label: "Brand",       icon: Megaphone,  mode: null },
  { id: "content",     label: "Content",     icon: FileText,   mode: null },
  { id: "action",      label: "Action Plan", icon: ListChecks, mode: null },
];

export default function DashboardLayout({ result }: { result: AnalysisResult }) {
  const [active, setActive] = useState("market");
  const [chatOpen, setChatOpen] = useState(false);
  const hasSEO = !!result.seoAudit;
  const hasLandscape = !!result.localLandscape;
  const hasEntry = result.businessMode === "new_launch" && !!result.marketEntryAnalysis;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    NAV_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Dashboard link copied!");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, position: "relative" }}>
      <MovingBackground variant="light" motif={active as Motif} intensity={0.5} tickers={false} />
      {/* Top bar */}
      <div style={{ background: "white", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 64, zIndex: 40 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          {/* Business info */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={15} color="white" fill="white" />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: 14, color: C.ink }}>{result.businessName}</span>
              <span style={{ fontSize: 12, color: C.soft, marginLeft: 8 }}>{result.city}, {result.country}</span>
            </div>
          </div>

          {/* Nav pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", flexWrap: "nowrap" }}>
            {NAV_ITEMS.filter(({ id, mode }) =>
      (id !== "seo" || hasSEO) &&
      (id !== "landscape" || hasLandscape) &&
      (id !== "entry" || hasEntry) &&
      (mode === null || mode === result.businessMode)
    ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10,
                  fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", border: "none", cursor: "pointer",
                  background: active === id ? C.coralLight : "transparent",
                  color: active === id ? C.coral : C.soft,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (active !== id) { (e.currentTarget as HTMLElement).style.background = C.bg; (e.currentTarget as HTMLElement).style.color = C.ink; } }}
                onMouseLeave={(e) => { if (active !== id) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = C.soft; } }}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <button
              onClick={handleShare}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: "white", border: `1px solid ${C.border}`, color: C.muted, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral; (e.currentTarget as HTMLElement).style.color = C.coral; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
            >
              <Share2 size={13} />
              Share
            </button>
            <button
              onClick={() => { toast.success("Preparing PDF..."); window.print(); }}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: G.coral, color: "white", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(255,77,109,0.3)", transition: "all 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(255,77,109,0.3)"; }}
            >
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Content — position:relative + zIndex:1 keeps it above the background layer */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto", padding: "40px 24px", display: "flex", flexDirection: "column", gap: 80 }}>
        {[
          { id: "market",      el: <MarketOverviewSection data={result.marketOverview} businessName={result.businessName} /> },
          ...(hasLandscape ? [{ id: "landscape", el: <LocalLandscapeSection data={result.localLandscape!} city={result.city} /> }] : []),
          ...(hasEntry ? [{ id: "entry", el: <MarketEntrySection data={result.marketEntryAnalysis!} city={result.city} categories={result.category} /> }] : []),
          { id: "competitors", el: <CompetitorAnalysisSection competitors={result.competitors} sectorSocialSignals={result.sectorSocialSignals ?? undefined} /> },
          { id: "psychology",  el: <CustomerPsychologySection data={result.customerPsychology} /> },
          { id: "gaps",        el: <MarketGapsSection gaps={result.marketGaps} marketSearchSummary={result.marketSearchSummary ?? undefined} /> },
          ...(hasSEO ? [{ id: "seo", el: <SEOAuditSection data={result.seoAudit!} website={result.website || ""} /> }] : []),
          { id: "brand",   el: <BrandPositioningSection data={result.brandPositioning} businessName={result.businessName} /> },
          { id: "content", el: <ContentStrategySection data={result.contentStrategy} /> },
          { id: "action",  el: <ActionPlanSection data={result.actionPlan} businessName={result.businessName} /> },
        ].map(({ id, el }) => (
          <motion.div
            key={id}
            id={id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.5 }}
          >
            {el}
          </motion.div>
        ))}
      </div>

      {/* AI Chat FAB */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{ width: 56, height: 56, borderRadius: 18, background: G.coral, color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: S.btn, transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
        >
          <MessageSquare size={22} />
        </button>
      </div>

      {chatOpen && (
        <AIChat analysisId={result.id} businessName={result.businessName} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
