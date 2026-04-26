import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg:      "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        border:  "rgb(var(--color-border) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error:   "rgb(var(--color-error) / <alpha-value>)",
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          muted:   "rgb(var(--color-text-muted) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Inter", "Segoe UI", "ui-sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      fontSize: {
        "2xs": ["0.65rem", "1rem"]
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px"
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0,0,0,0.5)",
        glow:   "0 0 0 1px rgba(255,107,0,0.4), 0 8px 24px rgba(255,107,0,0.15)"
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "translateY(0)" } }
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease"
      }
    }
  },
  plugins: []
};

export default config;
