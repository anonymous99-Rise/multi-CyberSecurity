import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 全部走 CSS 变量（见 globals.css 的 :root / html.light），因此深浅主题自动适配。
        // 组件里请用这些语义色，不要写 gray-100 / black 之类的固定色值。
        bg: {
          DEFAULT: "var(--bg)",
          secondary: "var(--bg-2)",
          tertiary: "var(--bg-3)",
          raised: "var(--bg-raised)",
          border: "var(--border)",
        },
        // 代码/终端表面：深浅主题都保持深底，故给独立的 bg/fg/accent 三色
        code: {
          DEFAULT: "var(--code-bg)",
          fg: "var(--code-fg)",
          accent: "var(--code-accent)",
        },
        ink: {
          DEFAULT: "var(--text-1)",
          muted: "var(--text-2)",
          faint: "var(--text-3)",
        },
        overlay: "var(--overlay)",
        backdrop: "var(--backdrop)",
        // 配色纪律：accent 主色（自有内容/交互）、info 外部引用/信息、warning|danger 仅表严重度。
        accent: {
          DEFAULT: "var(--accent)",
          muted: "var(--accent-muted)",
          dim: "var(--accent-dim)",
        },
        info: "var(--info)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "monospace"],
        sans: ["var(--font-plex)", "system-ui", "sans-serif"],
      },
      animation: {
        "blink": "blink 1s step-end infinite",
        "scan": "scan 8s linear infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, -1px)" },
          "80%": { transform: "translate(1px, 1px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
