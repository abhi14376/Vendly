import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#0EA5E9",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        pill: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.05)",
        md: "0 8px 20px rgba(0,0,0,0.08)",
        lg: "0 12px 30px rgba(0,0,0,0.12)",
        xl: "0 20px 40px rgba(0,0,0,0.16)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
        dashboard: "1440px",
        legal: "768px",
      },
      zIndex: {
        dropdown: "100",
        sticky: "200",
        overlay: "300",
        drawer: "400",
        modal: "500",
        toast: "600",
        tooltip: "700",
      },
    },
  },
  plugins: [],
};

export default config;
