"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
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
  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  // El aviso de "guardado" se desvanece solo tras unos segundos.
  useEffect(() => {
    if (!guardado) return;
    const t = setTimeout(() => setGuardado(false), 3200);
    return () => clearTimeout(t);
  }, [guardado]);

  // Vista previa de la foto elegida al crear.
  useEffect(() => {
    if (!foto) {
      setPreviewFoto(null);
      return;
    }
    const url = URL.createObjectURL(foto);
    setPreviewFoto(url);
    return () => URL.revokeObjectURL(url);
  }, [foto]);

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
    // Valida la foto antes de crear (para no dejar un producto a medias).
    if (modo === "nuevo" && foto) {
      if (!foto.type.startsWith("image/")) {
        setError("El archivo debe ser una imagen.");
        return;
      }
      if (foto.size > 5 * 1024 * 1024) {
        setError("La imagen no puede pesar más de 5 MB.");
        return;
      }
    }

    setGuardando(true);
    if (modo === "nuevo") {
      const res = await crearProducto(input);
      if (!res.ok) {
        setError(res.error);
        setGuardando(false);
        return;
      }
      // Sube la foto elegida (si hay) y la registra como principal.
      if (foto) {
        const supabase = createClient();
        const limpio = foto.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${res.id}/${Date.now()}-${limpio}`;
        const { error: upErr } = await supabase.storage.from("productos").upload(path, foto);
        if (!upErr) {
          await supabase
            .from("fotos_producto")
            .insert({ producto_id: res.id, path, orden: 0 });
        }
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

        {/* Foto de portada (solo al crear; luego se gestionan en "Fotos") */}
        {modo === "nuevo" && (
          <div>
            <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">
              Foto principal <span className="font-normal text-tinta/45">(opcional)</span>
            </span>
            {foto && previewFoto ? (
              <div className="flex items-center gap-3 rounded-[12px] border border-morado/20 bg-blanco p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewFoto}
                  alt="Vista previa"
                  className="size-16 shrink-0 rounded-[8px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-moradoHondo">{foto.name}</p>
                  <p className="text-[11px] text-tinta/50">{(foto.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFoto(null)}
                  aria-label="Quitar foto"
                  className="grid size-8 shrink-0 place-items-center rounded-full text-tinta/50 transition-colors hover:bg-lavanda hover:text-[#B23A5B]"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[12px] border border-dashed border-morado/40 py-4 text-[13px] font-medium text-morado transition-colors hover:bg-lavanda/50">
                <ImagePlus className="size-4" />
                Elegir imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
            )}
            <p className="mt-1.5 text-[11px] text-tinta/45">
              Será la imagen que aparezca en la tienda. Podrás agregar más después.
            </p>
          </div>
        )}

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
