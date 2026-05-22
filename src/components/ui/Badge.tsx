import { CSSProperties, ReactNode } from "react";
import { C } from "@/lib/design";

type BadgeVariant = "coral" | "indigo" | "green" | "amber" | "grey" | "blush";

const styles: Record<BadgeVariant, CSSProperties> = {
  coral:  { background: C.coralLight, color: C.coral },
  indigo: { background: "#EEF2FF", color: "#4F46E5" },
  green:  { background: C.greenLight, color: "#059669" },
  amber:  { background: C.amberLight, color: "#D97706" },
  grey:   { background: "#F3F4F6", color: C.muted },
  blush:  { background: C.coralFaint, color: C.coral },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  style?: CSSProperties;
}

export default function Badge({ children, variant = "grey", dot, style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        ...styles[variant],
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "currentColor",
            animation: "pulse 2s infinite",
          }}
        />
      )}
      {children}
    </span>
  );
}
