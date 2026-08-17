import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/anim/reveal";
import { ProductCard } from "@/components/tienda/product-card";
import { Button } from "@/components/ui/button";
import { buscarProductos } from "@/actions/buscar";
import type { ProductoPublico } from "@/lib/data/types";

export const metadata: Metadata = { title: "Buscar" };
export const dynamic = "force-dynamic";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const term = q.trim();
  const resultados = term.length >= 2 ? await buscarProductos(term, 40) : [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-14 lg:py-14">
      <p className="eyebrow text-dorado">Búsqueda</p>
      <h1 className="mt-2 font-display text-[28px] leading-tight text-moradoHondo lg:text-[38px]">
        {term ? `Resultados para “${term}”` : "Buscar prendas"}
      </h1>
      {term.length >= 2 && (
        <p className="mt-1 text-[13px] text-tinta/60">
          {resultados.length}{" "}
          {resultados.length === 1 ? "prenda encontrada" : "prendas encontradas"}
        </p>
      )}

      {term.length < 2 ? (
        <div className="mt-10 rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
          <p className="font-display text-[19px] text-moradoHondo">Escribe qué buscas</p>
          <p className="mt-1 text-[13px] text-tinta/60">
            Usa el buscador del encabezado (mínimo 2 letras).
          </p>
        </div>
      ) : resultados.length === 0 ? (
        <div className="mt-10 rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
          <p className="font-display text-[19px] text-moradoHondo">Sin coincidencias</p>
          <p className="mt-1 text-[13px] text-tinta/60">
            No encontramos prendas para &ldquo;{term}&rdquo;. Prueba con otra palabra.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/mujer">Ver el catálogo</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {resultados.map((r, i) => {
            const producto: ProductoPublico = {
              id: r.id,
              slug: r.slug,
              nombre: r.nombre,
              descripcion: null,
              precio_cop: r.precio_cop,
              categoria_id: "",
              subcategoria_id: null,
              es_pieza_unica: r.es_pieza_unica,
              ajuste_gratis: false,
              creado_en: "",
              disponible: r.disponible,
            };
            return (
              <Reveal key={r.id} delay={Math.min(i, 8) * 55}>
                <ProductCard
                  producto={producto}
                  fotoUrl={r.fotoUrl ?? undefined}
                  etiqueta={r.categoriaNombre ?? undefined}
                />
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
