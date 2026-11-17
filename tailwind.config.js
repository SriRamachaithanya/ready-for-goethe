/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        surface: "var(--color-surface)",
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          border: "var(--color-border)",
        },
        stamp: {
          green: "var(--color-clearance-green)",
          "green-tint": "var(--color-clearance-green-tint)",
          amber: "var(--color-caution-amber)",
          "amber-tint": "var(--color-caution-amber-tint)",
          red: "var(--color-stop-red)",
          "red-tint": "var(--color-stop-red-tint)",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 33, 61, 0.06), 0 12px 32px rgba(20, 33, 61, 0.08)",
        "card-hover": "0 2px 4px rgba(20, 33, 61, 0.08), 0 16px 40px rgba(20, 33, 61, 0.12)",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
    },
  },
  plugins: [],
};
