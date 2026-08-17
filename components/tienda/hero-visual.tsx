"use client";

import { useState } from "react";

/**
 * Visual del hero. Muestra la foto `public/hero.jpg` si existe; si no, una
 * ilustración de marca (así nunca se ve vacío). Para usar una foto real, sube
 * el archivo a `public/hero.jpg` — se mostrará automáticamente, sin tocar código.
 */
export function HeroVisual() {
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <div className="relative ml-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[22px] border border-blanco/70 bg-nieve shadow-[0_24px_70px_-28px_rgba(58,24,87,0.45)]">
      {sinFoto ? (
        <HeroArte />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/hero.jpg"
          alt="Prendas hechas a mano de Erika's Homemade"
          onError={() => setSinFoto(true)}
          loading="eager"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function HeroArte() {
  return (
    <svg viewBox="0 0 480 600" className="h-full w-full" role="img" aria-label="Ilustración artesanal">
      <defs>
        <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2ECF7" />
          <stop offset="1" stopColor="#FBF9FC" />
        </linearGradient>
      </defs>

      <rect width="480" height="600" fill="url(#heroGrad)" />
      <circle cx="384" cy="118" r="130" fill="#C9B3DD" opacity="0.35" />
      <circle cx="78" cy="512" r="96" fill="#B98A2E" opacity="0.13" />

      {/* Vestido (motivo de marca) */}
      <g
        transform="translate(118 150) scale(4.6)"
        stroke="#5B2A86"
        strokeWidth={3.4}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M25 14 Q32 20 39 14 L42 30 L46 34 L40 38 L44 52 L20 52 L24 38 L18 34 L22 30 Z" />
      </g>

      {/* Puntada dorada */}
      <path
        d="M96 520 C 190 470, 300 572, 396 496"
        stroke="#B98A2E"
        strokeWidth={3}
        fill="none"
        strokeDasharray="2 11"
        strokeLinecap="round"
      />

      {/* Aguja + hilo */}
      <g stroke="#3A1857" strokeWidth={3} fill="none" strokeLinecap="round">
        <line x1="336" y1="96" x2="412" y2="168" />
        <ellipse cx="332" cy="92" rx="6" ry="10" transform="rotate(-45 332 92)" />
      </g>
      <path
        d="M336 96 C 300 128, 372 150, 336 184"
        stroke="#B98A2E"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
