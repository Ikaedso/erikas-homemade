import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, haySupabaseEnv } from "@/lib/supabase/config";

/**
 * Refresca la sesión de Supabase en cada navegación.
 *
 * Sin esto, cuando el access token caduca (≈1 h) el servidor deja de ver la
 * sesión y el usuario aparece deslogueado aunque su refresh token siga válido
 * (30 días). Aquí usamos el refresh token para renovar el access token y volver
 * a escribir las cookies, así la sesión se mantiene y no hay que reloguear.
 *
 * Es compatible con Edge: solo usa `@supabase/ssr` + `next/server` (no Node).
 * Va protegido por env + try/catch para nunca romper la navegación.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!haySupabaseEnv()) return response;

  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    // Renueva la sesión si hace falta (escribe cookies nuevas vía setAll).
    await supabase.auth.getUser();
  } catch {
    // Ante cualquier fallo, dejamos pasar la petición sin bloquear.
  }

  return response;
}

export const config = {
  // Corre en todo menos assets estáticos e imágenes.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
