"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { crearProducto, actualizarProducto, type ProductoInput } from "@/actions/admin";
import type { Categoria, Subcategoria } from "@/lib/data/types";

type Inicial = ProductoInput & { id?: string };

export function ProductoForm({
  modo,
  categorias,
  subcategorias,
  inicial,
}: {
  modo: "nuevo" | "editar";
  categorias: Categoria[];
  subcategorias: Subcategoria[];
  inicial?: Inicial;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [precio, setPrecio] = useState(inicial?.precio_cop ? String(inicial.precio_cop) : "");
  const [categoriaId, setCategoriaId] = useState(inicial?.categoria_id ?? categorias[0]?.id ?? "");
  const [subcategoriaId, setSubcategoriaId] = useState<string>(inicial?.subcategoria_id ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [piezaUnica, setPiezaUnica] = useState(inicial?.es_pieza_unica ?? false);
  const [avisoStock, setAvisoStock] = useState(String(inicial?.aviso_stock_bajo ?? 3));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  // El aviso de "guardado" se desvanece solo tras unos segundos.
  useEffect(() => {
    if (!guardado) return;
    const t = setTimeout(() => setGuardado(false), 3200);
    return () => clearTimeout(t);
  }, [guardado]);

  const subsDeCategoria = subcategorias.filter((s) => s.categoria_id === categoriaId);

  async function guardar() {
    setError(null);
    setGuardado(false);
    const input: ProductoInput = {
      nombre,
      precio_cop: Math.round(Number(precio) || 0),
      categoria_id: categoriaId,
      subcategoria_id: subcategoriaId || null,
      descripcion,
      es_pieza_unica: piezaUnica,
      aviso_stock_bajo: Math.max(0, Math.round(Number(avisoStock) || 0)),
    };
    setGuardando(true);
    if (modo === "nuevo") {
      const res = await crearProducto(input);
      if (!res.ok) {
        setError(res.error);
        setGuardando(false);
        return;
      }
      router.push(`/admin/productos/${res.id}`);
    } else if (inicial?.id) {
      const res = await actualizarProducto(inicial.id, input);
      setGuardando(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setGuardado(true);
      router.refresh();
    }
  }

  return (
    <div className="rounded-[12px] border border-tinta/[0.09] bg-blanco p-5">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Nombre</span>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Categoría</span>
            <select
              value={categoriaId}
              onChange={(e) => {
                setCategoriaId(e.target.value);
                setSubcategoriaId("");
              }}
              className="h-11 w-full rounded-[8px] border border-tinta/[0.16] bg-blanco px-3 text-[14px]"
            >
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Subcategoría</span>
            <select
              value={subcategoriaId}
              onChange={(e) => setSubcategoriaId(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-tinta/[0.16] bg-blanco px-3 text-[14px]"
            >
              <option value="">— Sin subcategoría —</option>
              {subsDeCategoria.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Precio (COP)</span>
            <Input
              type="number"
              inputMode="numeric"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">
              Aviso de stock bajo
            </span>
            <Input
              type="number"
              inputMode="numeric"
              value={avisoStock}
              onChange={(e) => setAvisoStock(e.target.value)}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">Descripción</span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full rounded-[10px] border border-tinta/[0.16] bg-blanco p-3 text-[14px] text-tinta focus-visible:border-morado focus-visible:outline-none"
          />
        </label>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={piezaUnica}
            onChange={(e) => setPiezaUnica(e.target.checked)}
            className="size-4 accent-[#5B2A86]"
          />
          <span className="text-[13px] text-tinta">Marcar como pieza única</span>
        </label>

        {error && <p className="text-[13px] text-[#B23A5B]">{error}</p>}
        {guardado && (
          <div
            role="status"
            className="flex items-center gap-2.5 rounded-[10px] border border-morado/15 bg-lavanda px-3.5 py-2.5 duration-300 animate-in fade-in slide-in-from-bottom-1"
          >
            <CheckCircle2 className="size-[18px] text-morado animate-pop-check" />
            <span className="text-[13px] font-medium text-moradoHondo">
              ¡Cambios guardados con éxito!
            </span>
          </div>
        )}

        <Button onClick={guardar} disabled={guardando} size="lg">
          {guardando ? "Guardando…" : modo === "nuevo" ? "Crear producto" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
