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

/** Deshabilita / habilita una cuenta. La cuenta nunca se elimina. */
export async function setDeshabilitado(userId: string, deshabilitado: boolean): Promise<Res> {
  if (!(await esAdmin())) return { ok: false, error: "No autorizado." };
  if ((await miId()) === userId) {
    return { ok: false, error: "No puedes deshabilitar tu propia cuenta." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("perfiles").update({ deshabilitado }).eq("id", userId);
  if (error) return { ok: false, error: "No se pudo actualizar la cuenta." };
  revalidatePath("/admin/usuarios");
  return { ok: true };
}

/** Edita el nombre (siempre) y el correo (si hay service role) de un usuario. */
export async function actualizarUsuario(
  userId: string,
  datos: { nombre: string; email?: string },
): Promise<Res> {
  if (!(await esAdmin())) return { ok: false, error: "No autorizado." };

  const nombre = datos.nombre.trim();
  if (nombre.length < 2 || nombre.length > 60) {
    return { ok: false, error: "El nombre debe tener entre 2 y 60 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("perfiles").update({ nombre }).eq("id", userId);
  if (error) return { ok: false, error: "No se pudo guardar el nombre." };

  // El correo vive en auth.users → requiere service role.
  const email = datos.email?.trim().toLowerCase();
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, error: "El correo no es válido." };
    }
    if (!hayServiceRole()) {
      return {
        ok: false,
        error: "El nombre se guardó, pero para cambiar el correo falta SUPABASE_SERVICE_ROLE_KEY.",
      };
    }
    const admin = createAdminClient();
    const { error: eMail } = await admin.auth.admin.updateUserById(userId, {
      email,
      email_confirm: true,
    });
    if (eMail) {
      return { ok: false, error: `No se pudo cambiar el correo: ${eMail.message}` };
    }
  }

  revalidatePath("/admin/usuarios");
  return { ok: true };
}
