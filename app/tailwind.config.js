/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
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
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
