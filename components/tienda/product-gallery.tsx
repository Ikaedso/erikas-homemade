"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { urlFotoProducto } from "@/lib/supabase/storage";
import type { FotoProducto } from "@/lib/data/types";

export function ProductGallery({
  fotos,
  nombre,
}: {
  fotos: FotoProducto[];
  nombre: string;
}) {
  const [activa, setActiva] = useState(0);

  // Sin fotos: marcador con el nombre (mismo estilo que las tarjetas).
  if (fotos.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[12px] border border-tinta/[0.08] bg-gradient-to-br from-lavanda to-nieve">
        <span className="px-6 text-center font-display text-[18px] text-morado/40">{nombre}</span>
      </div>
    );
  }

  const principal = fotos[Math.min(activa, fotos.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] border border-tinta/[0.08] bg-lavanda">
        <Image
          src={urlFotoProducto(principal.path)}
          alt={principal.alt ?? nombre}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
      </div>

      {fotos.length > 1 && (
        <div className="mt-3 flex gap-2.5">
          {fotos.map((foto, i) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-[8px] border transition-colors lg:size-20",
                i === activa ? "border-morado" : "border-tinta/[0.12] hover:border-morado/40",
              )}
            >
              <Image
                src={urlFotoProducto(foto.path)}
                alt={foto.alt ?? `${nombre} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
