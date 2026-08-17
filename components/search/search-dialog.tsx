"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Search, ShoppingBag, X } from "lucide-react";
import { formatCOP } from "@/lib/format";
import { buscarProductos, type ResultadoBusqueda } from "@/actions/buscar";

const SUGERENCIAS = ["Blusas", "Vestidos", "Camisas", "Pantalones", "Uniformes", "Bisutería"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [cargando, setCargando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enfocar al abrir y bloquear el scroll del fondo.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Cerrar con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Búsqueda con debounce.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResultados([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    let activo = true;
    const t = setTimeout(async () => {
      const res = await buscarProductos(term, 8);
      if (activo) {
        setResultados(res);
        setCargando(false);
      }
    }, 280);
    return () => {
      activo = false;
      clearTimeout(t);
    };
  }, [q]);

  // Limpia al cerrar.
  useEffect(() => {
    if (!open) {
      setQ("");
      setResultados([]);
    }
  }, [open]);

  if (!open) return null;

  const term = q.trim();

  function irAResultados(texto: string) {
    const t = texto.trim();
    if (t.length < 2) return;
    onClose();
    router.push(`/buscar?q=${encodeURIComponent(t)}`);
  }

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Fondo */}
      <button
        aria-label="Cerrar búsqueda"
        onClick={onClose}
        className="absolute inset-0 bg-tinta/40 backdrop-blur-sm duration-200 animate-in fade-in"
      />

      {/* Panel */}
      <div className="relative mx-auto w-full max-w-2xl px-0 duration-200 animate-in fade-in slide-in-from-top-2 lg:px-4 lg:pt-3">
        <div className="overflow-hidden bg-blanco shadow-modal lg:rounded-[16px]">
          {/* Barra de entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              irAResultados(q);
            }}
            className="flex items-center gap-2.5 border-b border-tinta/[0.08] px-4 py-3.5"
          >
            <Search className="size-5 shrink-0 text-morado" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busca blusas, vestidos, uniformes…"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-tinta outline-none placeholder:text-tinta/40"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  inputRef.current?.focus();
                }}
                aria-label="Limpiar"
                className="grid size-7 shrink-0 place-items-center rounded-full text-tinta/45 transition-colors hover:bg-lavanda hover:text-tinta"
              >
                <X className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-[13px] font-medium text-morado transition-colors hover:text-moradoHondo"
            >
              Cancelar
            </button>
          </form>

          {/* Resultados */}
          <div className="max-h-[68vh] overflow-y-auto">
            {term.length < 2 ? (
              <div className="p-4">
                <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-tinta/45">
                  Sugerencias
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQ(s)}
                      className="rounded-pill border border-tinta/[0.14] px-3 py-1.5 text-[13px] text-tinta/75 transition-colors hover:border-morado hover:bg-lavanda/50 hover:text-morado"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : cargando ? (
              <div className="flex items-center justify-center gap-2 py-12 text-[13px] text-tinta/55">
                <Loader2 className="size-4 animate-spin text-morado" />
                Buscando…
              </div>
            ) : resultados.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="font-display text-[17px] text-moradoHondo">Sin coincidencias</p>
                <p className="mt-1 text-[13px] text-tinta/55">
                  No encontramos prendas para &ldquo;{term}&rdquo;. Prueba con otra palabra.
                </p>
              </div>
            ) : (
              <>
                <ul className="p-2">
                  {resultados.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/producto/${r.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-[10px] p-2 transition-colors hover:bg-lavanda/50"
                      >
                        <div className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-lavanda">
                          {r.fotoUrl ? (
                            <Image
                              src={r.fotoUrl}
                              alt={r.nombre}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <ShoppingBag className="size-5 text-morado/40" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-medium text-tinta">{r.nombre}</p>
                          <p className="text-[12px] text-tinta/50">
                            {r.categoriaNombre ?? "Catálogo"}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-display text-[14px] text-tinta">
                            {formatCOP(r.precio_cop)}
                          </p>
                          {!r.disponible && (
                            <p className="text-[10px] uppercase tracking-[0.06em] text-tinta/40">
                              Agotado
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => irAResultados(q)}
                  className="w-full border-t border-tinta/[0.08] py-3.5 text-center text-[13px] font-medium text-morado transition-colors hover:bg-lavanda/40"
                >
                  Ver todos los resultados de &ldquo;{term}&rdquo;
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
