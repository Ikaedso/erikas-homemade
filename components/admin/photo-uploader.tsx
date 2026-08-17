"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { urlFotoProducto } from "@/lib/supabase/storage";
import type { FotoProducto } from "@/lib/data/types";

export function PhotoUploader({
  productoId,
  fotos,
}: {
  productoId: string;
  fotos: FotoProducto[];
}) {
  const router = useRouter();
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subir(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede pesar más de 5 MB.");
      return;
    }

    setSubiendo(true);
    const supabase = createClient();
    const limpio = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${productoId}/${Date.now()}-${limpio}`;

    const { error: upErr } = await supabase.storage.from("productos").upload(path, file);
    if (upErr) {
      setError("No pudimos subir la imagen. Intenta de nuevo.");
      setSubiendo(false);
      return;
    }

    const { error: dbErr } = await supabase
      .from("fotos_producto")
      .insert({ producto_id: productoId, path, orden: fotos.length });
    if (dbErr) {
      setError("La imagen se subió pero no se registró. Intenta de nuevo.");
      setSubiendo(false);
      return;
    }

    setSubiendo(false);
    router.refresh();
  }

  async function eliminar(foto: FotoProducto) {
    const supabase = createClient();
    await supabase.storage.from("productos").remove([foto.path]);
    await supabase.from("fotos_producto").delete().eq("id", foto.id);
    router.refresh();
  }

  return (
    <div className="rounded-[12px] border border-tinta/[0.09] bg-blanco p-5">
      <p className="text-[12px] text-tinta/55">La primera foto es la principal en la tienda.</p>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {fotos.map((foto, i) => (
          <div
            key={foto.id}
            className="group relative aspect-[4/5] overflow-hidden rounded-[10px] border border-tinta/[0.09] bg-lavanda"
          >
            <Image
              src={urlFotoProducto(foto.path)}
              alt={foto.alt ?? "Foto de producto"}
              fill
              sizes="180px"
              className="object-cover"
            />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-morado px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] text-blanco">
                Principal
              </span>
            )}
            <button
              type="button"
              onClick={() => eliminar(foto)}
              aria-label="Eliminar foto"
              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-blanco/90 text-[#B23A5B] opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}

        {/* Botón subir */}
        <label className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-morado/40 text-morado transition-colors hover:bg-lavanda/50">
          <Upload className="size-5" />
          <span className="text-[11px] font-medium">{subiendo ? "Subiendo…" : "Subir foto"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={subir}
            disabled={subiendo}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-[13px] text-[#B23A5B]">{error}</p>}
    </div>
  );
}
