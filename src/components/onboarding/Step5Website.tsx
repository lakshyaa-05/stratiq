"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Globe, SkipForward } from "lucide-react";
import { C, G, S } from "@/lib/design";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5Website({ value, onChange, onNext, onBack }: Props) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const isValid = !value || value.includes(".");

  const btnBase = {
    borderRadius: 14, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: C.coralLight, marginBottom: 20 }}>
          <Globe size={13} color={C.coral} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Step 5 of 6 · Optional</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          Do you have a{" "}
          <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>website?</span>
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          Enter your URL for a full SEO audit, keyword gaps, and competitor backlink analysis.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <div
          style={{
            borderRadius: 16, border: `2px solid ${focused ? C.coral : C.border}`,
            background: "white", boxShadow: focused ? `0 0 0 4px ${C.coralLight}` : "none",
            transition: "all 0.2s", display: "flex", alignItems: "center", padding: "4px 20px", gap: 10,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: C.soft, flexShrink: 0 }}>https://</span>
          <input
            ref={inputRef}
            type="url"
            value={value.replace(/^https?:\/\//, "")}
            onChange={(e) => onChange(e.target.value ? `https://${e.target.value.replace(/^https?:\/\//, "")}` : "")}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="yourbusiness.com"
            style={{ flex: 1, padding: "14px 0", fontSize: 20, fontWeight: 600, background: "transparent", border: "none", outline: "none", color: C.ink }}
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onBack}
            style={{ ...btnBase, width: 54, height: 54, background: "white", border: `2px solid ${C.border}`, color: C.muted, flexShrink: 0 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral; (e.currentTarget as HTMLElement).style.color = C.coral; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={onNext}
            disabled={!!value && !isValid}
            style={{ ...btnBase, flex: 1, padding: "16px", background: G.coral, color: "white", boxShadow: S.btn, opacity: !!value && !isValid ? 0.4 : 1, cursor: !!value && !isValid ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => { if (!(!isValid && !!value)) (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
          >
            {value ? "Continue with SEO Audit" : "Continue"} <ArrowRight size={18} />
          </button>
        </div>
        {!value && (
          <button
            onClick={onNext}
            style={{ ...btnBase, padding: "14px", background: "white", border: `2px solid ${C.border}`, color: C.muted, fontSize: 14 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.coral + "66"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
          >
            <SkipForward size={16} />
            Skip — I don&apos;t have a website yet
          </button>
        )}
      </motion.div>
    </div>
  );
}
