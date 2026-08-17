import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { CardImage } from "@/components/tienda/card-image";
import { estadoProducto, type ProductoPublico } from "@/lib/data/types";

export function ProductCard({
  producto,
  etiqueta,
  fotoUrls = [],
}: {
  producto: ProductoPublico;
  /** Texto pequeño sobre el nombre (p. ej. "Mujer · Blusas"). */
  etiqueta?: string;
  /** URLs de fotos; la primera es la portada. Al pasar el cursor rotan. */
  fotoUrls?: string[];
}) {
  const estado = estadoProducto(producto);
  const agotado = estado.key === "agotado";

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group block transition-transform duration-300 hover:-translate-y-1"
    >
      <div
        className={cn(
          "relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[10px] border border-tinta/[0.08] bg-gradient-to-br from-lavanda to-nieve",
          agotado && "opacity-[0.74] saturate-[0.6]",
        )}
      >
        <Badge variant={estado.key} className="absolute left-3 top-3 z-10">
          {estado.label}
        </Badge>
        <CardImage fotoUrls={fotoUrls} nombre={producto.nombre} />
      </div>

      <div className="mt-3">
        {etiqueta && <p className="text-[11px] text-tinta/55">{etiqueta}</p>}
        <h3 className="mt-0.5 font-display text-[15px] leading-tight text-tinta transition-colors group-hover:text-morado lg:text-[17px]">
          {producto.nombre}
        </h3>
        <p className="mt-1 font-display text-[15px] text-tinta">{formatCOP(producto.precio_cop)}</p>
      </div>
    </Link>
  );
}
