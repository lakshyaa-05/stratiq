"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { C } from "@/lib/design";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  // Guard with mounted so server render always uses light-mode values — avoids hydration mismatch
  const dark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled
          ? dark ? "rgba(15,15,26,0.92)" : "rgba(255,255,255,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${dark ? C.borderDark : C.border}`
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FF4D6D, #FF8C69)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(255,77,109,0.35)" }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: dark ? "#F9FAFB" : C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>Stratiq</div>
            <div style={{ fontSize: 11, color: C.soft, lineHeight: 1, marginTop: 2 }}>Outthink your market</div>
          </div>
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/projects" style={{ fontSize: 14, fontWeight: 500, color: C.muted, textDecoration: "none", padding: "8px 14px", borderRadius: 10, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.coral)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >
            Projects
          </Link>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(dark ? "light" : "dark")}
              style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${dark ? C.borderDark : C.border}`, background: dark ? C.surfaceDark : C.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.coral)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = dark ? C.borderDark : C.border)}
            >
              {dark ? <Sun size={15} color={C.orange} /> : <Moon size={15} color={C.muted} />}
            </button>
          )}

          <Link
            href="/onboarding"
            style={{ background: "linear-gradient(135deg, #FF4D6D, #FF8C69)", color: "white", textDecoration: "none", padding: "9px 18px", borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(255,77,109,0.3)", transition: "all 0.2s", display: "inline-block" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(255,77,109,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(255,77,109,0.3)"; }}
          >
            Start Free
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
