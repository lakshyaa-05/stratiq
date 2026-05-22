"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { runAnalysis } from "@/lib/api";
import { OnboardingData, AnalysisResult } from "@/lib/types";
import { C, G } from "@/lib/design";
import MovingBackground from "@/components/shared/MovingBackground";

const MESSAGES = [
  { text: "Scanning competitors in your area...",       delay: 0 },
  { text: "Fetching local business data...",            delay: 2200 },
  { text: "Reading customer reviews...",                delay: 4400 },
  { text: "Analyzing search trends...",                 delay: 6600 },
  { text: "Detecting market gaps...",                   delay: 8800 },
  { text: "Running SEO diagnostics...",                 delay: 10200 },
  { text: "Building positioning strategy...",           delay: 12400 },
  { text: "Generating customer personas...",            delay: 14200 },
  { text: "Compiling your intelligence report...",      delay: 16000 },
];


export default function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [msgs, setMsgs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const rawData = sessionStorage.getItem("stratiq_onboarding");
    if (!rawData) { router.replace("/onboarding"); return; }
    const data: OnboardingData = JSON.parse(rawData);

    MESSAGES.forEach(({ text, delay }) => {
      setTimeout(() => {
        setMsgs((prev) => [...prev, text]);
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }, delay);
    });

    const startTime = Date.now();
    const duration = 18000;
    const tick = () => {
      const p = Math.min((Date.now() - startTime) / duration, 0.92);
      setProgress(p);
      if (p < 0.92) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    runAnalysis(data)
      .then((result: AnalysisResult) => {
        sessionStorage.setItem(`stratiq_result_${result.id}`, JSON.stringify(result));
        setProgress(1);
        setTimeout(() => router.push(`/dashboard/${result.id}`), 600);
      })
      .catch((err) => {
        setError(err.message || "Analysis failed. Please try again.");
      });
  }, [router]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: C.bgDark, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 380, padding: "0 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 10 }}>Something went wrong</h2>
          <p style={{ fontSize: 14, color: C.soft, marginBottom: 24 }}>{error}</p>
          <button
            onClick={() => router.push("/onboarding")}
            style={{ padding: "12px 24px", borderRadius: 12, background: G.coral, color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <MovingBackground variant="dark" motif="loading" intensity={1.2} />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 480, padding: "0 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        {/* Logo */}
        <motion.div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        >
          <div style={{ width: 88, height: 88, borderRadius: 24, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center", animation: "glowPulse 2.5s ease-in-out infinite" }}>
            <span style={{ color: "white", fontSize: 36, fontWeight: 900 }}>S</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "white", margin: 0 }}>Stratiq</h1>
            <p style={{ fontSize: 13, color: C.soft, marginTop: 4, margin: "4px 0 0" }}>AI is analyzing your market</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: C.soft }}>Analyzing</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.coral }}>{Math.round(progress * 100)}%</span>
          </div>
          <div style={{ width: "100%", height: 8, background: C.surfaceDark, borderRadius: 99, overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", background: G.coral, borderRadius: 99 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
          </div>
        </div>

        {/* Terminal */}
        <div style={{ width: "100%", background: "#050510", borderRadius: 18, border: `1px solid ${C.surfaceDark}`, padding: 20, minHeight: 220, fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.surfaceDark}` }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(239,68,68,0.6)" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(245,158,11,0.6)" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(16,185,129,0.6)" }} />
            </div>
            <span style={{ fontSize: 11, color: "#4a4a60" }}>stratiq-engine</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 150, overflowY: "auto" }}>
            <AnimatePresence>
              {msgs.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span style={{ color: C.indigo }}>›</span>
                  <span style={{ color: i === msgs.length - 1 ? "#F9FAFB" : C.muted }}>
                    {msg}
                  </span>
                  {i === msgs.length - 1 && (
                    <motion.span
                      style={{ display: "inline-block", width: 6, height: 14, background: C.coral, borderRadius: 2, marginLeft: 2 }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={endRef} />
          </div>
        </div>

        <motion.p
          style={{ fontSize: 12, color: C.soft, textAlign: "center", maxWidth: 340 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        >
          Powered by real-time market data, competitor intelligence, and AI synthesis
        </motion.p>
      </div>
      </div>
    </div>
  );
}
