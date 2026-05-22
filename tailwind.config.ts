import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        coral: {
          DEFAULT: "#FF4D6D",
          50: "#FFF0F3",
          100: "#FFE4E8",
          200: "#FFCCD5",
          300: "#FFA3B5",
          400: "#FF7090",
          500: "#FF4D6D",
          600: "#ED1E45",
          700: "#C81035",
          800: "#A81030",
          900: "#8F122D",
        },
        blush: "#FFE4E8",
        charcoal: "#1A1A2E",
        "warm-grey": "#6B7280",
        "soft-grey": "#9CA3AF",
        "light-border": "#F3F4F6",
        "dark-bg": "#0F0F1A",
        "dark-card": "#1A1A2E",
        indigo: {
          DEFAULT: "#667EEA",
          purple: "#764BA2",
        },
      },
      backgroundImage: {
        "gradient-coral": "linear-gradient(135deg, #FF4D6D 0%, #FF8C69 100%)",
        "gradient-indigo": "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
        "gradient-section": "linear-gradient(180deg, #F8F9FF 0%, #FFE4E8 100%)",
        "gradient-hero": "linear-gradient(135deg, #FF4D6D 0%, #FF8C69 50%, #FFB347 100%)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(255, 77, 109, 0.08)",
        "card-hover": "0 8px 40px rgba(255, 77, 109, 0.15)",
        glow: "0 0 40px rgba(255, 77, 109, 0.25)",
        "glow-indigo": "0 0 40px rgba(102, 126, 234, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
