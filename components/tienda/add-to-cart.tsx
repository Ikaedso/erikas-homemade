"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import type { ProductoPublico, VariantePublica } from "@/lib/data/types";

function unicos<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function AddToCartControls({
  producto,
  variantes,
  disponible,
  esPiezaUnica,
}: {
  producto: Pick<ProductoPublico, "id" | "slug" | "nombre" | "precio_cop">;
  variantes: VariantePublica[];
  disponible: boolean;
  esPiezaUnica: boolean;
}) {
  const { add } = useCart();
  const tallas = useMemo(() => unicos(variantes.map((v) => v.talla)), [variantes]);
  const colores = useMemo(() => unicos(variantes.map((v) => v.color)), [variantes]);

  const [talla, setTalla] = useState<string | null>(tallas[0] ?? null);
  const [color, setColor] = useState<string | null>(colores[0] ?? null);
  const [cantidad, setCantidad] = useState(1);
  const [aviso, setAviso] = useState<string | null>(null);

  const maxCantidad = esPiezaUnica ? 1 : 8;

  function tallaDisponible(t: string) {
    return variantes.some((v) => v.talla === t && v.disponible);
  }

  if (!disponible) {
    return (
      <div className="space-y-3">
        <Button disabled className="w-full" size="lg">
          Agotado
        </Button>
        <Button variant="outline" className="w-full" size="lg">
          Avísame cuando vuelva
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tallas.length > 0 && (
        <div>
          <p className="eyebrow text-tinta/50">Talla</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tallas.map((t) => {
              const ok = tallaDisponible(t);
              const activo = talla === t;
              return (
                <button
                  key={t}
                  type="button"
                  disabled={!ok}
                  onClick={() => setTalla(t)}
                  className={cn(
                    "min-w-[46px] rounded-[8px] border px-3 py-2 text-[13px] transition-colors",
                    activo
                      ? "border-morado bg-lavanda font-medium text-moradoHondo"
                      : "border-tinta/[0.16] text-tinta hover:bg-lavanda/60",
                    !ok && "cursor-not-allowed border-dashed text-tinta/35 line-through",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colores.length > 0 && (
        <div>
          <p className="eyebrow text-tinta/50">Color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colores.map((c) => {
              const activo = color === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "rounded-[8px] border px-3 py-2 text-[13px] transition-colors",
                    activo
                      ? "border-morado bg-lavanda font-medium text-moradoHondo"
                      : "border-tinta/[0.16] text-tinta hover:bg-lavanda/60",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-pill border border-tinta/[0.16]">
          <button
            type="button"
            aria-label="Restar"
            onClick={() => setCantidad((n) => Math.max(1, n - 1))}
            className="grid size-10 place-items-center text-morado disabled:opacity-40"
            disabled={cantidad <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-[14px] font-medium tabular-nums">{cantidad}</span>
          <button
            type="button"
            aria-label="Sumar"
            onClick={() => setCantidad((n) => Math.min(maxCantidad, n + 1))}
            className="grid size-10 place-items-center text-morado disabled:opacity-40"
            disabled={cantidad >= maxCantidad}
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button
          className="flex-1"
          size="lg"
          onClick={() => {
            const variante =
              variantes.find((v) => v.talla === talla && v.color === color) ??
              variantes.find((v) => v.talla === talla) ??
              variantes[0];
            if (!variante) {
              setAviso("Selecciona una opción disponible.");
              return;
            }
            add(
              {
                productoId: producto.id,
                varianteId: variante.id,
                slug: producto.slug,
                nombre: producto.nombre,
                precioCop: producto.precio_cop,
                talla: variante.talla,
                color: variante.color,
                esPiezaUnica,
              },
              cantidad,
            );
            setAviso("Añadido al carrito.");
          }}
        >
          Agregar al carrito
        </Button>
      </div>

      {esPiezaUnica && <p className="text-[12px] text-dorado">Pieza única: solo hay una.</p>}
      {aviso && <p className="text-[12px] text-morado">{aviso}</p>}
    </div>
  );
}
