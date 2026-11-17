/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F1E7",
        surface: "#FFFDF8",
        ink: {
          DEFAULT: "#14213D",
          muted: "#5B6475",
          border: "rgba(20, 33, 61, 0.14)",
        },
        stamp: {
          green: "#2E7D5B",
          "green-tint": "#2E7D5B1F",
          amber: "#B97500",
          "amber-tint": "#B975001F",
          red: "#C8372D",
          "red-tint": "#C8372D1F",
        },
      },
      opacity: {
        14: "0.14",
        85: "0.85",
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
