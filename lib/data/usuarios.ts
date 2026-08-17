import { createClient } from "@/lib/supabase/server";
import { createAdminClient, hayServiceRole } from "@/lib/supabase/admin";

export type RolUsuario = "cliente" | "admin";

export type UsuarioAdmin = {
  id: string;
  nombre: string;
  whatsapp: string | null;
  rol: RolUsuario;
  deshabilitado: boolean;
  creado_en: string;
  email: string | null;
  confirmado: boolean | null;
};

type PerfilRow = {
  id: string;
  nombre: string;
  whatsapp: string | null;
  rol: RolUsuario;
  deshabilitado: boolean;
  creado_en: string;
};

/**
 * Lista todos los usuarios para el panel.
 * - Perfiles (nombre, rol, whatsapp, fecha) → con la sesión admin vía RLS.
 * - Correo y confirmación → solo si hay SERVICE ROLE (API de administración).
 */
export async function getUsuarios(): Promise<{
  usuarios: UsuarioAdmin[];
  conServiceRole: boolean;
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("perfiles")
    .select("id, nombre, whatsapp, rol, deshabilitado, creado_en")
    .order("creado_en", { ascending: false });
  const perfiles = (data as PerfilRow[]) ?? [];

  if (!hayServiceRole()) {
    return {
      usuarios: perfiles.map((p) => ({ ...p, email: null, confirmado: null })),
      conServiceRole: false,
    };
  }

  // Correos + estado de confirmación vía API de administración (paginada).
  const admin = createAdminClient();
  const info = new Map<string, { email: string | null; confirmado: boolean }>();
  const perPage = 1000;
  for (let page = 1; page <= 50; page += 1) {
    const { data: lista, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error || !lista) break;
    for (const u of lista.users) {
      info.set(u.id, {
        email: u.email ?? null,
        confirmado: Boolean(u.email_confirmed_at),
      });
    }
    if (lista.users.length < perPage) break;
  }

  return {
    usuarios: perfiles.map((p) => ({
      ...p,
      email: info.get(p.id)?.email ?? null,
      confirmado: info.get(p.id)?.confirmado ?? null,
    })),
    conServiceRole: true,
  };
}
