"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlFotoProducto } from "@/lib/supabase/storage";
import type { FotoProducto } from "@/lib/data/types";

export function ProductGallery({ fotos, nombre }: { fotos: FotoProducto[]; nombre: string }) {
  const [activa, setActiva] = useState(0);

  // Sin fotos: marcador con el nombre.
  if (fotos.length === 0) {
    return (
      <div className="flex aspect-[4/5] w-full max-w-[420px] items-center justify-center rounded-[12px] border border-tinta/[0.08] bg-gradient-to-br from-lavanda to-nieve">
        <span className="px-6 text-center font-display text-[18px] text-morado/40">{nombre}</span>
      </div>
    );
  }

  const principal = fotos[Math.min(activa, fotos.length - 1)];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
      {/* Miniaturas: abajo en móvil, columna izquierda en escritorio (estilo ML) */}
      {fotos.length > 1 && (
        <div className="order-2 flex gap-2.5 overflow-x-auto pb-1 lg:order-1 lg:w-[66px] lg:flex-col lg:overflow-visible lg:pb-0">
          {fotos.map((foto, i) => (
            <button
              key={foto.id}
              type="button"
              onMouseEnter={() => setActiva(i)}
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === activa}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-[8px] border-2 transition-colors lg:size-[66px]",
                i === activa ? "border-morado" : "border-tinta/[0.12] hover:border-morado/40",
              )}
            >
              <Image
                src={urlFotoProducto(foto.path)}
                alt={`${nombre} ${i + 1}`}
                fill
                sizes="66px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal (tamaño acotado para que quepa sin scroll en escritorio) */}
      <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-[12px] border border-tinta/[0.08] bg-lavanda lg:order-2 lg:max-w-[420px]">
        <Image
          key={principal.id}
          src={urlFotoProducto(principal.path)}
          alt={principal.alt ?? nombre}
          fill
          priority
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover duration-300 animate-in fade-in"
        />
      </div>
    </div>
  );
}
