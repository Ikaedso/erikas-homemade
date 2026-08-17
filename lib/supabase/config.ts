/**
 * Configuración de Supabase leída del entorno.
 *
 * Acepta tanto el nombre nuevo de Supabase (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
 * como el clásico (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) para la llave pública, así
 * funciona con cualquiera de los dos configurado en Vercel.
 *
 * Las referencias a `process.env.NEXT_PUBLIC_*` son literales a propósito, para
 * que Next las incruste en el bundle del cliente.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export function haySupabaseEnv(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
