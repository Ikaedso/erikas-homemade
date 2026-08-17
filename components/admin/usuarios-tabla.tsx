"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Shield, ShieldOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatFecha } from "@/lib/format";
import { cambiarRol, eliminarUsuario } from "@/actions/usuarios";
import type { RolUsuario, UsuarioAdmin } from "@/lib/data/usuarios";

type Filtro = "todos" | RolUsuario;

export function UsuariosTabla({
  usuarios,
  miId,
  conServiceRole,
}: {
  usuarios: UsuarioAdmin[];
  miId: string;
  conServiceRole: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [pendiente, setPendiente] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const conteos = useMemo(
    () => ({
      todos: usuarios.length,
      admin: usuarios.filter((u) => u.rol === "admin").length,
      cliente: usuarios.filter((u) => u.rol === "cliente").length,
    }),
    [usuarios],
  );

  const visibles = useMemo(() => {
    const term = q.trim().toLowerCase();
    return usuarios.filter((u) => {
      if (filtro !== "todos" && u.rol !== filtro) return false;
      if (!term) return true;
      return (
        u.nombre.toLowerCase().includes(term) || (u.email ?? "").toLowerCase().includes(term)
      );
    });
  }, [usuarios, q, filtro]);

  function ejecutar(id: string, fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setPendiente(id);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok && r.error) setError(r.error);
      else router.refresh();
      setPendiente(null);
    });
  }

  function alternarRol(u: UsuarioAdmin) {
    ejecutar(u.id, () => cambiarRol(u.id, u.rol === "admin" ? "cliente" : "admin"));
  }

  function borrar(u: UsuarioAdmin) {
    const quien = u.email ?? u.nombre;
    if (!window.confirm(`¿Eliminar la cuenta de ${quien}? Esta acción no se puede deshacer.`)) {
      return;
    }
    ejecutar(u.id, () => eliminarUsuario(u.id));
  }

  const chips: { key: Filtro; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: conteos.todos },
    { key: "admin", label: "Admins", count: conteos.admin },
    { key: "cliente", label: "Clientes", count: conteos.cliente },
  ];

  return (
    <div>
      {!conServiceRole && (
        <div className="mb-4 rounded-[10px] border border-dorado/40 bg-[#FDFBF6] px-4 py-3 text-[12.5px] text-tinta/75">
          Para ver los correos y <strong>eliminar</strong> cuentas, configura la variable{" "}
          <code className="rounded bg-lavanda px-1 py-0.5 text-morado">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          en Vercel. Mientras tanto puedes cambiar roles.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tinta/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o correo…"
            className="h-10 w-full rounded-[10px] border border-tinta/[0.16] bg-blanco pl-9 pr-3 text-[13.5px] focus-visible:border-morado focus-visible:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const activo = filtro === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setFiltro(c.key)}
                className={cn(
                  "rounded-pill border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  activo
                    ? "border-morado bg-morado text-blanco"
                    : "border-tinta/[0.14] text-tinta/70 hover:bg-lavanda/60",
                )}
              >
                {c.label}
                <span className={cn("ml-1.5 tabular-nums", activo ? "text-blanco/70" : "text-tinta/40")}>
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="mt-3 text-[13px] text-[#B23A5B]">{error}</p>}

      <ul className="mt-4 space-y-2.5">
        {visibles.length === 0 && (
          <li className="rounded-[12px] border border-dashed border-tinta/15 py-10 text-center text-[13px] text-tinta/55">
            No hay usuarios que coincidan.
          </li>
        )}
        {visibles.map((u) => {
          const soyYo = u.id === miId;
          const cargando = pendiente === u.id;
          return (
            <li
              key={u.id}
              className={cn(
                "flex flex-col gap-3 rounded-[12px] border border-tinta/[0.09] bg-blanco p-4 sm:flex-row sm:items-center sm:justify-between",
                cargando && "opacity-60",
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-[15.5px] text-moradoHondo">{u.nombre}</p>
                  <Badge variant={u.rol === "admin" ? "piezaUnica" : "neutro"}>
                    {u.rol === "admin" ? "Admin" : "Cliente"}
                  </Badge>
                  {soyYo && <span className="text-[11px] text-tinta/45">(tú)</span>}
                  {u.confirmado === false && (
                    <span className="rounded-[4px] bg-[#FBEAEF] px-1.5 py-0.5 text-[10px] font-medium text-[#B23A5B]">
                      Sin confirmar
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-[12.5px] text-tinta/60">
                  {u.email ?? "correo oculto"}
                  {u.whatsapp ? ` · ${u.whatsapp}` : ""}
                </p>
                <p className="mt-0.5 text-[11px] text-tinta/40">Registro: {formatFecha(u.creado_en)}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => alternarRol(u)}
                  disabled={cargando || (soyYo && u.rol === "admin")}
                  title={soyYo && u.rol === "admin" ? "No puedes quitarte el admin" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-[12.5px] font-medium transition-colors disabled:opacity-40",
                    u.rol === "admin"
                      ? "border-tinta/[0.16] text-tinta/75 hover:bg-lavanda/60"
                      : "border-morado bg-morado text-blanco hover:bg-moradoHondo",
                  )}
                >
                  {u.rol === "admin" ? (
                    <>
                      <ShieldOff className="size-3.5" /> Quitar admin
                    </>
                  ) : (
                    <>
                      <Shield className="size-3.5" /> Hacer admin
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => borrar(u)}
                  disabled={cargando || soyYo || !conServiceRole}
                  title={
                    soyYo
                      ? "No puedes eliminar tu cuenta"
                      : !conServiceRole
                        ? "Requiere SUPABASE_SERVICE_ROLE_KEY"
                        : "Eliminar cuenta"
                  }
                  aria-label="Eliminar cuenta"
                  className="grid size-9 place-items-center rounded-[8px] border border-tinta/[0.12] text-[#B23A5B] transition-colors hover:bg-[#FBEAEF] disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
