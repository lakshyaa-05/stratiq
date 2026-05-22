"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, LayoutGrid } from "lucide-react";
import { CATEGORIES } from "@/lib/countries";
import { C, G, S } from "@/lib/design";

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const btnBase = {
  borderRadius: 14, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s",
};

export default function Step2Category({ value, onChange, onNext, onBack }: Props) {
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  const valid = value.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: C.coralLight, marginBottom: 20 }}>
          <LayoutGrid size={13} color={C.coral} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Step 2 of 6</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          What{" "}
          <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>category</span>
          {" "}is your business?
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          Select all that apply — this shapes your entire analysis.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}
      >
        {CATEGORIES.map((cat, i) => {
          const sel = value.includes(cat.id);
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.04 * i }}
              onClick={() => toggle(cat.id)}
              style={{
                position: "relative",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                padding: "16px 10px", borderRadius: 16,
                border: `2px solid ${sel ? C.coral : C.border}`,
                background: sel ? C.coralFaint : "white",
                boxShadow: sel ? `0 0 0 3px ${C.coralLight}` : "none",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {sel && (
                <div style={{ position: "absolute", top: 7, right: 7, width: 16, height: 16, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: "center", lineHeight: 1.3, color: sel ? C.coral : C.muted }}>{cat.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ display: "flex", gap: 10 }}
      >
        <button
          onClick={onBack}
          style={{ ...btnBase, width: 54, height: 54, borderRadius: 14, background: "white", border: `2px solid ${C.border}`, color: C.muted, cursor: "pointer", flexShrink: 0 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral; (e.currentTarget as HTMLElement).style.color = C.coral; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          style={{ ...btnBase, flex: 1, padding: "16px", background: valid ? G.coral : C.border, color: valid ? "white" : C.soft, boxShadow: valid ? S.btn : "none", cursor: valid ? "pointer" : "not-allowed" }}
          onMouseEnter={(e) => { if (valid) (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
          onMouseLeave={(e) => { if (valid) (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
        >
          Continue <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
