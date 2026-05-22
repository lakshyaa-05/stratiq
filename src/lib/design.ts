// Central design tokens — all components pull from here
// This guarantees consistency and fixes Tailwind v4 custom-color issues

export const C = {
  coral:       "#FF4D6D",
  coralDark:   "#E8344E",
  coralLight:  "#FFE4E8",
  coralFaint:  "#FFF0F3",
  orange:      "#FF8C69",
  indigo:      "#667EEA",
  purple:      "#764BA2",
  ink:         "#1A1A2E",
  muted:       "#6B7280",
  soft:        "#9CA3AF",
  border:      "#F0F0F5",
  borderDark:  "#2A2A40",
  surface:     "#FFFFFF",
  surfaceDark: "#1A1A2E",
  bg:          "#FAFAFA",
  bgDark:      "#0F0F1A",
  green:       "#10B981",
  greenLight:  "#D1FAE5",
  amber:       "#F59E0B",
  amberLight:  "#FEF3C7",
  red:         "#EF4444",
  redLight:    "#FEE2E2",
} as const;

export const G = {
  coral:   "linear-gradient(135deg, #FF4D6D 0%, #FF8C69 100%)",
  indigo:  "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
  hero:    "linear-gradient(135deg, #FF4D6D 0%, #FF7A5A 50%, #FF8C69 100%)",
  faint:   "linear-gradient(135deg, #FFF0F3 0%, #F8F9FF 100%)",
} as const;

export const S = {
  card:      "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  cardHover: "0 4px 24px rgba(255,77,109,0.12), 0 1px 8px rgba(0,0,0,0.06)",
  btn:       "0 4px 20px rgba(255,77,109,0.35)",
  btnHover:  "0 8px 32px rgba(255,77,109,0.45)",
  glow:      "0 0 40px rgba(255,77,109,0.2)",
} as const;
