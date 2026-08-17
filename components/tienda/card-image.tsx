"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Imagen de la tarjeta de producto. Si hay varias fotos, al pasar el cursor
 * van cambiando suavemente una tras otra en bucle (crossfade).
 */
export function CardImage({ fotoUrls, nombre }: { fotoUrls: string[]; nombre: string }) {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover) {
      setIdx(0);
      return;
    }
    if (fotoUrls.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % fotoUrls.length), 950);
    return () => clearInterval(id);
  }, [hover, fotoUrls.length]);

  if (fotoUrls.length === 0) {
    return (
      <span className="px-4 text-center font-display text-[15px] text-morado/40">{nombre}</span>
    );
  }

  return (
    <div
      className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {fotoUrls.map((url, i) => (
        <Image
          key={url}
          src={url}
          alt={nombre}
          fill
          sizes="(min-width: 1024px) 300px, 45vw"
          className={cn(
            "object-cover transition-opacity duration-500",
            i === idx ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
