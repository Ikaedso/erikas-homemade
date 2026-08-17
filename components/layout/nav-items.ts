/** Navegación por categorías (header y drawer móvil). */
export const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Mujer", href: "/mujer", categoria: true },
  { label: "Hombre", href: "/hombre", categoria: true },
  { label: "Niño", href: "/nino", categoria: true },
  { label: "Manualidades", href: "/manualidades", categoria: true },
  { label: "Servicios", href: "/servicios" },
  { label: "Contacto", href: "/contacto" },
] as const;
