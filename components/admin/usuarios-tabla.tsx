"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Check, CircleCheck, Pencil, Search, Shield, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatFecha } from "@/lib/format";
import { actualizarUsuario, cambiarRol, setDeshabilitado } from "@/actions/usuarios";
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
  const [editando, setEditando] = useState<string | null>(null);
  const [fNombre, setFNombre] = useState("");
  const [fEmail, setFEmail] = useState("");
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
      return u.nombre.toLowerCase().includes(term) || (u.email ?? "").toLowerCase().includes(term);
    });
  }, [usuarios, q, filtro]);

  function ejecutar(id: string, fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    setPendiente(id);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok && r.error) setError(r.error);
      else {
        setEditando(null);
        router.refresh();
      }
      setPendiente(null);
    });
  }

  function abrirEdicion(u: UsuarioAdmin) {
    setError(null);
    setEditando(u.id);
    setFNombre(u.nombre);
    setFEmail(u.email ?? "");
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
          Para ver y editar los correos, configura{" "}
          <code className="rounded bg-lavanda px-1 py-0.5 text-morado">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          en Vercel. Los roles, el nombre y deshabilitar cuentas ya funcionan.
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
          const enEdicion = editando === u.id;

          return (
            <li
              key={u.id}
              className={cn(
                "rounded-[12px] border border-tinta/[0.09] bg-blanco p-4",
                cargando && "opacity-60",
                u.deshabilitado && "bg-tinta/[0.02]",
              )}
            >
              {enEdicion ? (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-medium text-tinta/70">Nombre</span>
                      <Input value={fNombre} onChange={(e) => setFNombre(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-medium text-tinta/70">Correo</span>
                      <Input
                        type="email"
                        value={fEmail}
                        onChange={(e) => setFEmail(e.target.value)}
                        disabled={!conServiceRole}
                        placeholder={conServiceRole ? undefined : "Requiere service role"}
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={cargando}
                      onClick={() =>
                        ejecutar(u.id, () =>
                          actualizarUsuario(u.id, {
                            nombre: fNombre,
                            email: conServiceRole && fEmail !== (u.email ?? "") ? fEmail : undefined,
                          }),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-pill bg-morado px-4 py-2 text-[13px] font-medium text-blanco transition-colors hover:bg-moradoHondo disabled:opacity-50"
                    >
                      <Check className="size-3.5" /> Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditando(null)}
                      className="rounded-pill border border-tinta/15 px-4 py-2 text-[13px] font-medium text-tinta transition-colors hover:bg-lavanda/40"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[15.5px] text-moradoHondo">{u.nombre}</p>
                      <Badge variant={u.rol === "admin" ? "piezaUnica" : "neutro"}>
                        {u.rol === "admin" ? "Admin" : "Cliente"}
                      </Badge>
                      {u.deshabilitado && (
                        <span className="rounded-[4px] bg-[#FBEAEF] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-[#B23A5B]">
                          Deshabilitado
                        </span>
                      )}
                      {soyYo && <span className="text-[11px] text-tinta/45">(tú)</span>}
                    </div>
                    <p className="mt-0.5 truncate text-[12.5px] text-tinta/60">
                      {u.email ?? "correo oculto"}
                      {u.whatsapp ? ` · ${u.whatsapp}` : ""}
                    </p>
                    <p className="mt-0.5 text-[11px] text-tinta/40">
                      Registro: {formatFecha(u.creado_en)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        ejecutar(u.id, () =>
                          cambiarRol(u.id, u.rol === "admin" ? "cliente" : "admin"),
                        )
                      }
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
                      onClick={() => abrirEdicion(u)}
                      disabled={cargando}
                      aria-label="Editar"
                      title="Editar nombre y correo"
                      className="grid size-9 place-items-center rounded-[8px] border border-tinta/[0.14] text-morado transition-colors hover:bg-lavanda disabled:opacity-40"
                    >
                      <Pencil className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => ejecutar(u.id, () => setDeshabilitado(u.id, !u.deshabilitado))}
                      disabled={cargando || soyYo}
                      title={soyYo ? "No puedes deshabilitar tu cuenta" : undefined}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-[12.5px] font-medium transition-colors disabled:opacity-40",
                        u.deshabilitado
                          ? "border-[#2F855A]/40 text-[#2F855A] hover:bg-[#2F855A]/10"
                          : "border-[#B23A5B]/30 text-[#B23A5B] hover:bg-[#FBEAEF]",
                      )}
                    >
                      {u.deshabilitado ? (
                        <>
                          <CircleCheck className="size-3.5" /> Habilitar
                        </>
                      ) : (
                        <>
                          <Ban className="size-3.5" /> Deshabilitar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
