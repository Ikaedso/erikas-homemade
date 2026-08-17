import type { Metadata } from "next";
import { getUsuarios } from "@/lib/data/usuarios";
import { createClient } from "@/lib/supabase/server";
import { UsuariosTabla } from "@/components/admin/usuarios-tabla";

export const metadata: Metadata = { title: "Usuarios · Panel" };
export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const [{ usuarios, conServiceRole }, { data: sesion }] = await Promise.all([
    getUsuarios(),
    supabase.auth.getUser(),
  ]);

  return (
    <div>
      <h1 className="font-display text-[26px] text-moradoHondo lg:text-[32px]">Usuarios</h1>
      <p className="mt-1 text-[13px] text-tinta/60">
        Gestiona las cuentas: cambia roles y elimina usuarios.
      </p>

      <div className="mt-6">
        <UsuariosTabla
          usuarios={usuarios}
          miId={sesion.user?.id ?? ""}
          conServiceRole={conServiceRole}
        />
      </div>
    </div>
  );
}
