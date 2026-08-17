"use server";

import { revalidatePath } from "next/cache";
import { esAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hayServiceRole } from "@/lib/supabase/admin";
import type { RolUsuario } from "@/lib/data/usuarios";

type Res = { ok: true } | { ok: false; error: string };

async function miId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/** Cambia el rol (cliente ↔ admin). No permite auto-degradarse. */
export async function cambiarRol(userId: string, rol: RolUsuario): Promise<Res> {
  if (!(await esAdmin())) return { ok: false, error: "No autorizado." };
  if ((await miId()) === userId && rol !== "admin") {
    return { ok: false, error: "No puedes quitarte a ti misma el rol de admin." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("perfiles").update({ rol }).eq("id", userId);
  if (error) return { ok: false, error: "No se pudo cambiar el rol." };
  revalidatePath("/admin/usuarios");
  return { ok: true };
}

/** Elimina la cuenta por completo (auth + perfil en cascada). Requiere SERVICE ROLE. */
export async function eliminarUsuario(userId: string): Promise<Res> {
  if (!(await esAdmin())) return { ok: false, error: "No autorizado." };
  if ((await miId()) === userId) {
    return { ok: false, error: "No puedes eliminar tu propia cuenta." };
  }
  if (!hayServiceRole()) {
    return {
      ok: false,
      error: "Falta configurar SUPABASE_SERVICE_ROLE_KEY para poder eliminar usuarios.",
    };
  }
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: "No se pudo eliminar el usuario." };
  revalidatePath("/admin/usuarios");
  return { ok: true };
}
