import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Exige sesión en una página protegida (checkout, cuenta, agendar).
 * Redirige a /entrar?next=… si no hay usuario. Reemplaza la protección que
 * antes hacía el middleware (retirado por incompatibilidad del Edge runtime).
 */
export async function requireUser(next: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/entrar?next=${encodeURIComponent(next)}`);
  return user;
}
