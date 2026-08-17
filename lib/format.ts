/**
 * Formato de datos para Erika's Homemade.
 * Moneda: pesos colombianos (COP), sin decimales, punto de miles → "$72.000".
 * Fechas: español, zona horaria America/Bogota.
 */

const TIMEZONE = "America/Bogota";

/** Formatea un entero en pesos a "$72.000". Guardar en la BD como entero en pesos. */
export function formatCOP(valor: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(Math.round(valor))}`;
}

/** Fecha corta en español: "mar 15 sept 2026". */
export function formatFecha(fecha: Date | string): string {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Hora en formato 24h: "11:15". */
export function formatHora(fecha: Date | string): string {
  const d = typeof fecha === "string" ? new Date(fecha) : fecha;
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
