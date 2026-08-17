import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Verifica sesión + rol admin en una página del panel. Redirige si no cumple. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/admin");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol, nombre")
    .eq("id", user.id)
    .maybeSingle();

  if (perfil?.rol !== "admin") redirect("/");
  return { user, nombre: perfil?.nombre as string | undefined };
}

/** Versión para Server Actions: devuelve true/false sin redirigir. */
export async function esAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();
  return perfil?.rol === "admin";
}
