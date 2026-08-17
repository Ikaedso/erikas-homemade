import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type MotivoCategoria = "mujer" | "hombre" | "nino" | "manualidades";

/** Dibujo de línea (marca de agua) por categoría, para cuando aún no hay foto. */
const MOTIVOS: Record<MotivoCategoria, string> = {
  // Vestido en A
  mujer: "M25 14 Q32 20 39 14 L42 30 L46 34 L40 38 L44 52 L20 52 L24 38 L18 34 L22 30 Z",
  // Camisa con cuello
  hombre: "M22 16 L28 16 L32 21 L36 16 L42 16 L50 24 L44 30 L44 50 L20 50 L20 30 L14 24 Z",
  // Camiseta
  nino: "M24 18 L30 18 Q32 22 34 18 L40 18 L48 26 L42 32 L42 48 L22 48 L22 32 L16 26 Z",
  // Carrete de hilo
  manualidades: "M24 16 H40 M24 48 H40 M27 16 V48 M37 16 V48 M27 26 H37 M27 38 H37",
};

export function CategoryCard({
  nombre,
  href,
  nota,
  imagen,
  motivo,
  destacada = false,
}: {
  nombre: string;
  href: string;
  nota?: string;
  /** URL de foto de portada; si falta se muestra el motivo de línea. */
  imagen?: string;
  motivo?: MotivoCategoria;
  destacada?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[10px] p-4 transition-transform hover:-translate-y-0.5",
        destacada && "ring-1 ring-dorado/40",
      )}
    >
      {imagen ? (
        <>
          <Image
            src={imagen}
            alt={nombre}
            fill
            sizes="(min-width: 1024px) 320px, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-moradoHondo/85 via-moradoHondo/25 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-t from-moradoHondo via-morado/70 to-morado/30">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="absolute left-1/2 top-[42%] size-24 -translate-x-1/2 -translate-y-1/2 text-blanco/25 transition-transform duration-500 group-hover:scale-105 lg:size-32"
          >
            <path d={MOTIVOS[motivo ?? "mujer"]} />
          </svg>
        </div>
      )}

      <div className="relative">
        {nota && <p className="eyebrow text-doradoClaro">{nota}</p>}
        <p className="mt-1 font-display text-[19px] text-blanco lg:text-[27px]">{nombre}</p>
      </div>
    </Link>
  );
}
