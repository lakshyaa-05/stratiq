"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin } from "lucide-react";
import { C, G, S } from "@/lib/design";

interface Props {
  country: string;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const EXAMPLES = [
  "Sangrur", "Lancaster", "Las Vegas", "Ludhiana", "Preston",
  "Fresno", "Jalandhar", "Blackburn", "Stockton", "Amritsar",
];

export default function Step4City({ country, value, onChange, onNext, onBack }: Props) {
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
          <MapPin size={13} color={C.coral} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Step 4 of 6</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          Which{" "}
          <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>city or town</span>
          {" "}are you in?
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          Type any city, town, or area — we&apos;ll search for real local businesses there.
          {country && <span style={{ color: C.coral, fontWeight: 600 }}> Market: {country}</span>}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <div
          style={{
            borderRadius: 16, border: `2px solid ${focused ? C.coral : C.border}`,
            background: "white", boxShadow: focused ? `0 0 0 4px ${C.coralLight}` : "none",
            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12, padding: "0 20px",
          }}
        >
          <MapPin size={18} color={focused ? C.coral : C.soft} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Sangrur, Lancaster, Las Vegas..."
            style={{
              flex: 1, padding: "18px 0", fontSize: 20, fontWeight: 600,
              background: "transparent", border: "none", outline: "none", color: C.ink,
            }}
          />
        </div>

        {/* Quick pick examples */}
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {EXAMPLES.map((city) => (
            <button
              key={city}
              onClick={() => onChange(city)}
              style={{
                padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                background: value === city ? C.coralFaint : C.bg,
                color: value === city ? C.coral : C.muted,
                border: `1px solid ${value === city ? C.coralLight : C.border}`,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (value !== city) (e.currentTarget as HTMLElement).style.borderColor = C.coral + "60"; }}
              onMouseLeave={(e) => { if (value !== city) (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
            >
              {city}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, background: C.coralFaint }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>We&apos;ll search the web for real businesses in your area to power the competitor analysis.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
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
          onClick={onNext}
          disabled={!valid}
          style={{ flex: 1, padding: "16px", borderRadius: 14, background: valid ? G.coral : C.border, color: valid ? "white" : C.soft, fontWeight: 700, fontSize: 16, border: "none", cursor: valid ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: valid ? S.btn : "none", transition: "all 0.2s" }}
          onMouseEnter={(e) => { if (valid) (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
          onMouseLeave={(e) => { if (valid) (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
        >
          Continue <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
