import type { Config } from "tailwindcss";

/**
 * Paleta de marca de Erika's Homemade.
 * El blanco es la superficie dominante; morado/dorado viven solo en los detalles.
 * Tokens tomados del handoff de diseño (docs/design/README.md §5).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        morado: "#5B2A86", // marca: botones primarios, enlaces, íconos
        moradoHondo: "#3A1857", // hover de botón, footer, badges sólidos
        dorado: "#B98A2E", // acento: puntada, "pieza única", avisos, subrayados
        doradoClaro: "#E7D7A6", // texto dorado sobre morado oscuro
        lila: "#C9B3DD", // bordes suaves, badge "enviado"
        lavanda: "#F2ECF7", // fondos suaves, chips activos, badges claros
        tinta: "#2E2438", // TODO el texto. Nunca negro puro
        blanco: "#FFFFFF", // superficie dominante
        nieve: "#FCFAFD", // filas alternas, tarjetas de resumen
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(46,36,56,.07)",
        modal: "0 12px 34px rgba(58,24,87,.16)",
        ventana: "0 18px 44px rgba(58,24,87,.13)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pop-check": {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "60%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "cart-bump": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.35)" },
          "70%": { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pop-check": "pop-check 0.42s cubic-bezier(0.34,1.56,0.64,1)",
        "cart-bump": "cart-bump 0.4s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
