/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        "on-primary": "#FFFFFF",
        secondary: "#64748B",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        error: "#BA1A1A",
        success: "#15803D",
        "on-surface": "#191C1E",
        "on-surface-variant": "#45464D",
      },
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", clipPath: "inset(0 100% 0 0)", transform: "translateY(-6px)" },
          "100%": { opacity: "1", clipPath: "inset(0 0 0 0)", transform: "translateY(0)" },
        },
      },
      animation: {
        "toast-in": "toast-in 320ms ease-out",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // token: [size, { lineHeight, letterSpacing, fontWeight }]
        h1: ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1-mobile": ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        h3: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px" }],
        "body-md": ["16px", { lineHeight: "24px" }],
        "body-sm": ["14px", { lineHeight: "20px" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        lg: "8px",
        xl: "16px",
      },
      boxShadow: {
        // L1 cards use border only (no shadow)
        "card-hover": "0 4px 12px rgba(15,23,42,0.05)", // L2
        overlay: "0 10px 25px rgba(15,23,42,0.10)", // L3 modal/popover/toast
        "focus-glow": "0 0 0 2px rgba(15,23,42,0.10)", // focus soft glow
      },
    },
  },
  plugins: [],
};
