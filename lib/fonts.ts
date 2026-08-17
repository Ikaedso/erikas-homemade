import { Lora, Work_Sans } from "next/font/google";

/** Display (títulos, nombres de producto, precios grandes). */
export const fontDisplay = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-display",
  display: "swap",
});

/** Cuerpo, UI y etiquetas. */
export const fontBody = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
