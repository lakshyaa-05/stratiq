"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { C, G, S } from "@/lib/design";

interface Props {
  mode: "existing" | "new_launch";
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step1BusinessName({ mode, value, onChange, onNext, onBack }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim().length > 1) onNext();
  };

  const valid = value.trim().length >= 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: C.coralLight, marginBottom: 20 }}>
          <Building2 size={13} color={C.coral} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Step 2 of {mode === "new_launch" ? 6 : 7}</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          {mode === "new_launch" ? (
            <>What will you{" "}
              <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                call it?
              </span>
            </>
          ) : (
            <>What&apos;s your{" "}
              <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                business name?
              </span>
            </>
          )}
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          {mode === "new_launch"
            ? "Enter your planned brand name — or a working title if you haven't decided yet."
            : "This is what we’ll build your entire market analysis around."}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <div
          style={{
            borderRadius: 16,
            border: `2px solid ${focused ? C.coral : C.border}`,
            background: "white",
            boxShadow: focused ? `0 0 0 4px ${C.coralLight}` : "none",
            transition: "all 0.2s",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Nova Salon, Peak Fitness, Brew Lab..."
            style={{
              width: "100%",
              padding: "18px 22px",
              fontSize: 20,
              fontWeight: 600,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.ink,
              boxSizing: "border-box",
            }}
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onBack}
          style={{ width: 54, height: 54, borderRadius: 14, background: "white", border: `2px solid ${C.border}`, color: C.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral; (e.currentTarget as HTMLElement).style.color = C.coral; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: 14,
            background: valid ? G.coral : C.border,
            color: valid ? "white" : C.soft,
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            cursor: valid ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: valid ? S.btn : "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { if (valid) (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
          onMouseLeave={(e) => { if (valid) (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
        >
          Continue
          <ArrowRight size={18} />
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: C.soft, marginTop: 10 }}>Press Enter to continue</p>
      </motion.div>
    </div>
  );
}
