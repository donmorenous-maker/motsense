import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E0E0F",
          50: "#F6F6F6",
          100: "#EDEDEE",
          200: "#D6D6D8",
          300: "#B0B0B4",
          400: "#7C7C82",
          500: "#54545A",
          600: "#38383D",
          700: "#25252A",
          800: "#18181C",
          900: "#0E0E0F",
          950: "#08080A",
        },
        mustard: {
          DEFAULT: "#C69A2C",
          50: "#FBF6E8",
          100: "#F6ECC8",
          200: "#EDD98C",
          300: "#E2C458",
          400: "#D4AF37",
          500: "#C69A2C",
          600: "#A17A20",
          700: "#7A5C18",
          800: "#523F10",
          900: "#2E2308",
        },
        line: "rgba(255,255,255,0.08)",
        lineDark: "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 4vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.10)",
        cardDark: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.6)",
        ring: "0 0 0 1px rgba(198,154,44,0.35), 0 8px 24px -8px rgba(198,154,44,0.25)",
      },
      keyframes: {
        pulse_dot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.9)" },
        },
        flow: {
          "0%": { transform: "translateX(-10%)", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { transform: "translateX(110%)", opacity: "0" },
        },
        rise: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        count_up: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pingSlow: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        "pulse-dot": "pulse_dot 1.6s ease-in-out infinite",
        flow: "flow 3.2s linear infinite",
        rise: "rise 0.6s ease-out both",
        "count-up": "count_up 0.5s ease-out both",
        "ping-slow": "pingSlow 2.4s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "grid-light":
          "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
    },
  },
  plugins: [],
};

export default config;
