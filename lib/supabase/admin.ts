import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/**
 * Cliente de Supabase con SERVICE ROLE. **Solo servidor.**
 *
 * Omite RLS y habilita la API de administración (`auth.admin.*`) para listar
 * correos y eliminar usuarios. La clave NUNCA debe exponerse al navegador:
 * este módulo solo se importa desde Server Actions / data del servidor.
 *
 * Requiere la variable de entorno `SUPABASE_SERVICE_ROLE_KEY` (en Vercel).
 */
export function hayServiceRole(): boolean {
  return Boolean(SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
