"use client";

import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";
import { C, S } from "@/lib/design";

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  dark?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, hover = false, onClick, style }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, boxShadow: S.cardHover } : undefined}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={onClick}
        style={{
          borderRadius: 20,
          border: `1px solid ${C.border}`,
          background: C.surface,
          boxShadow: S.card,
          cursor: hover ? "pointer" : undefined,
          ...style,
        }}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export function SectionHeader({
  icon,
  number,
  title,
  subtitle,
}: {
  icon?: string;
  number?: number;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "linear-gradient(135deg, #FF4D6D, #FF8C69)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontSize: 14,
          boxShadow: "0 4px 12px rgba(255,77,109,0.3)",
          flexShrink: 0,
        }}
      >
        {icon || number}
      </div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.ink, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: C.soft, margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  );
}
