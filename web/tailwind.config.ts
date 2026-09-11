import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#0a0a0a", secondary: "#111111", border: "#1a1a1a" },
        accent: { DEFAULT: "#00ff88", muted: "#00cc6a" },
        danger: "#ff3366",
        warning: "#ffaa00",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
