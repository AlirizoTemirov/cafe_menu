import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          950: "#1C120C",
          900: "#2B1B14",
          800: "#3B271C",
          700: "#4E3527",
          600: "#664936",
        },
        cream: {
          50: "#FDFBF7",
          100: "#FAF6F0",
          200: "#F3ECE1",
          300: "#E9DECC",
        },
        amber: {
          400: "#DBA55C",
          500: "#C98A3D",
          600: "#AD7330",
          700: "#8C5D26",
        },
        sage: {
          500: "#6B8F71",
          600: "#557459",
        },
        brick: {
          500: "#B5493D",
          600: "#993C32",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "1.25rem",
        sheet: "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(43, 27, 20, 0.12)",
        lift: "0 12px 32px -8px rgba(43, 27, 20, 0.28)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pop": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in": "fade-in 0.2s ease-out",
        "pop": "pop 0.18s cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
