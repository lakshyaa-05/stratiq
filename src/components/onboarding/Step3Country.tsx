"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Globe, Search } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { C, G, S } from "@/lib/design";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const btnBase = {
  borderRadius: 14, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s",
};

export default function Step3Country({ value, onChange, onNext, onBack }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const selected = COUNTRIES.find((c) => c.name === value);

  const pick = (name: string) => { onChange(name); setQuery(""); setOpen(false); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: C.coralLight, marginBottom: 20 }}>
          <Globe size={13} color={C.coral} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.coral }}>Step 3 of 6</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: C.ink, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
          Which{" "}
          <span style={{ background: G.coral, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>country</span>
          {" "}do you operate in?
        </h1>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
          We&apos;ll tailor your analysis to this market.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ position: "relative" }}
      >
        <div
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          style={{
            borderRadius: 16, border: `2px solid ${open ? C.coral : C.border}`,
            background: "white", boxShadow: open ? `0 0 0 4px ${C.coralLight}` : "none",
            transition: "all 0.2s", cursor: "text",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", gap: 12 }}>
            <Search size={18} color={C.soft} />
            {selected && !open ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <span style={{ fontSize: 22 }}>{selected.flag}</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>{selected.name}</span>
              </div>
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                placeholder="Search country..."
                style={{ flex: 1, fontSize: 18, fontWeight: 600, background: "transparent", border: "none", outline: "none", color: C.ink }}
              />
            )}
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.15 }}
                style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 20, background: "white", border: `1px solid ${C.border}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", overflow: "hidden", maxHeight: 280, overflowY: "auto" }}
              >
                {filtered.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => pick(c.name)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 20px", textAlign: "left", background: value === c.name ? C.coralFaint : "transparent", border: "none", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { if (value !== c.name) (e.currentTarget as HTMLElement).style.background = C.coralFaint; }}
                    onMouseLeave={(e) => { if (value !== c.name) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 20 }}>{c.flag}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: value === c.name ? C.coral : C.ink, flex: 1 }}>{c.name}</span>
                    {value === c.name && <span style={{ color: C.coral, fontWeight: 700 }}>✓</span>}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div style={{ padding: "24px 20px", textAlign: "center", color: C.soft, fontSize: 14 }}>No results for &ldquo;{query}&rdquo;</div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        style={{ display: "flex", gap: 10 }}
      >
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
          disabled={!value}
          style={{ ...btnBase, flex: 1, padding: "16px", background: value ? G.coral : C.border, color: value ? "white" : C.soft, boxShadow: value ? S.btn : "none", cursor: value ? "pointer" : "not-allowed" }}
          onMouseEnter={(e) => { if (value) (e.currentTarget as HTMLElement).style.boxShadow = S.btnHover; }}
          onMouseLeave={(e) => { if (value) (e.currentTarget as HTMLElement).style.boxShadow = S.btn; }}
        >
          Continue <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
