import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Procesa el enlace de confirmación de correo de Supabase.
 * Supabase redirige aquí con ?code=… ; lo intercambiamos por una sesión y
 * mandamos al usuario a `next` (o al inicio). Funciona en local y en producción
 * porque el redirect se arma con el origin de la propia petición.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/entrar?error=confirmacion", url.origin));
}
