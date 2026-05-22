"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";
import { C, G } from "@/lib/design";

const LABELS = ["Business", "Category", "Country", "City", "Website", "Launch"];

export default function StepProgress({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / (total - 1)) * 100;

  return (
    <div
      style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: G.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Stratiq</span>
          </Link>
          <span style={{ fontSize: 12, color: C.soft, fontWeight: 500 }}>Step {current} of {total}</span>
        </div>

        <div style={{ position: "relative", height: 5, background: C.border, borderRadius: 99, overflow: "hidden" }}>
          <motion.div
            style={{ position: "absolute", left: 0, top: 0, height: "100%", background: G.coral, borderRadius: 99 }}
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {LABELS.map((label, i) => (
            <span
              key={label}
              style={{
                fontSize: 11,
                fontWeight: 600,
                transition: "color 0.3s",
                color: i + 1 <= current ? C.coral : "#D1D5DB",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
