import type { Metadata } from "next";
import { fontBody, fontDisplay } from "@/lib/fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

const DESCRIPCION =
  "Ropa y bisutería hecha a mano, más servicios de costura con cita. Cosido a mano, hecho a tu medida.";

export const metadata: Metadata = {
  title: {
    default: "Erika's Homemade",
    template: "%s · Erika's Homemade",
  },
  description: DESCRIPCION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Erika's Homemade",
    description: DESCRIPCION,
    type: "website",
    locale: "es_CO",
    siteName: "Erika's Homemade",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <CartProvider>
          <SiteHeader />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
