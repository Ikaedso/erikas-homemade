import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware liviano y Edge-safe: NO importa supabase-js (arrastra módulos de
 * Node que el Edge Runtime no soporta). La sesión se refresca en el cliente
 * (@supabase/ssr escribe las cookies); aquí solo protegemos rutas mirando si
 * existe la cookie de sesión. La autorización real vive en RLS + Server Actions.
 */

const PROTEGIDAS = ["/admin", "/pagar", "/cuenta", "/agendar"];

function tieneSesion(request: NextRequest): boolean {
  return request.cookies.getAll().some((c) => {
    // Supabase guarda el token en `sb-<ref>-auth-token` (a veces en trozos .0/.1).
    return (
      c.name.startsWith("sb-") &&
      c.name.includes("auth-token") &&
      !c.name.includes("code-verifier")
    );
  });
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const requiereSesion = PROTEGIDAS.some((p) => path === p || path.startsWith(`${p}/`));

  if (requiereSesion && !tieneSesion(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto assets estáticos, imágenes y favicon.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
