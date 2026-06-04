/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      boxShadow: {
        s: "0px 4px 4px rgba(0,0,0,0.15)",
        m: "0px 8px 16px rgba(0,0,0,0.12)",
        l: "0px 24px 48px rgba(0,0,0,0.10)",
      },
      colors: {
        // --- POC color names remapped to the app's violet/lime identity ---
        // (used by the ported Civiqa_POC components; deep-merged so default
        //  Tailwind shades like lime-400/500 used by app/ stay intact)
        bluette: {
          900: "#2E0B86",
          800: "#3A148F",
          700: "#5B21F7",
          600: "#6B30F5",
          500: "#7C4DFF",
          400: "#9E7BFA",
          300: "#B59CFB",
          200: "#D4C5FB",
          100: "#E8DEFC",
          50: "#F3EEFE",
          25: "#F8F5FE",
        },
        lime: {
          DEFAULT: "#C7F03A",
          600: "#9BBE2E",
          text: "#3A4D00",
        },
        status: {
          green: "#1F8C4A",
          "green-bg": "#defff0",
          orange: "#ca8600",
          "orange-bg": "#ffeecc",
          red: "#cc0000",
          "red-bg": "#ffe5e5",
        },
        success: {
          DEFAULT: "#1F8C4A",
          hover: "#157038",
          active: "#0e5528",
          light: "#c9ffe6",
          lighter: "#defff0",
        },
        warning: {
          DEFAULT: "#ca8600",
          hover: "#a36c00",
          active: "#7d5200",
          light: "#ffcc66",
          lighter: "#ffeecc",
        },
        error: {
          DEFAULT: "#cc0000",
          hover: "#a30000",
          active: "#7d0000",
          light: "#ff9999",
          lighter: "#ffe5e5",
        },
        gray: {
          100: "#F1F1F1",
          200: "#E7E7E7",
          500: "#999999",
          700: "#545454",
          900: "#2C2C2C",
        },
        brand: {
          violet: "#5B21F7",
          "violet-dark": "#2E0B86",
          "violet-light": "#E8DEFC",
          "violet-soft": "#F3EEFE",
        },
        accent: {
          lime: "#C7F03A",
        },
        badge: {
          eia: "#F8A8E2",
          ecba: "#A8D8F8",
          esg: "#86E8DC",
        },
        impact: {
          direct:   "#5B21F7",
          indirect: "#9E7BFA",
          induced:  "#D4C5FB",
          retain:   "#1F8C4A",
          leak:     "#C45A2E",
        },
        ink: {
          900: "#0E0E10",
          800: "#1C1C1F",
          700: "#2B2B2E",
          600: "#43434A",
          500: "#5A5A60",
          400: "#7B7B82",
          300: "#A3A3AA",
          200: "#D1D1D6",
          100: "#E5E5E8",
        },
        bg: {
          page: "#EEEEF0",
          card: "#FFFFFF",
          dark: "#0E0E10",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        // POC components use `font-serif` for display text → remap to Inter
        serif: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
