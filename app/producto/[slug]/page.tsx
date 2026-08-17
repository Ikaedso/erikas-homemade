import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { formatCOP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Stitch } from "@/components/brand/stitch";
import { ProductCard } from "@/components/tienda/product-card";
import { AddToCartControls } from "@/components/tienda/add-to-cart";
import { estadoProducto } from "@/lib/data/types";
import {
  getCategorias,
  getFotos,
  getProductoPorSlug,
  getRelacionados,
  getSubcategorias,
  getVariantes,
} from "@/lib/data/catalogo";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  return { title: producto?.nombre ?? "Producto" };
}

export default async function ProductoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const producto = await getProductoPorSlug(slug);
  if (!producto) notFound();

  const [variantes, fotos, relacionados, categorias, subcategorias] = await Promise.all([
    getVariantes(producto.id),
    getFotos(producto.id),
    getRelacionados(producto.categoria_id, producto.id, 4),
    getCategorias(),
    getSubcategorias(producto.categoria_id),
  ]);

  const categoria = categorias.find((c) => c.id === producto.categoria_id);
  const subcategoria = subcategorias.find((s) => s.id === producto.subcategoria_id);
  const estado = estadoProducto(producto);

  void fotos; // Placeholder por ahora: las fotos reales llegan cuando Érika las suba a Storage.

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-14 lg:py-12">
      <nav className="text-[12px] text-tinta/50">
        <Link href="/" className="hover:text-morado">
          Inicio
        </Link>{" "}
        /{" "}
        {categoria && (
          <>
            <Link href={`/${categoria.slug}`} className="hover:text-morado">
              {categoria.nombre}
            </Link>{" "}
            /{" "}
          </>
        )}
        <span className="text-tinta/70">{producto.nombre}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_440px] lg:gap-12">
        {/* Galería (placeholder) */}
        <div className="flex aspect-[4/5] items-center justify-center rounded-[12px] border border-tinta/[0.08] bg-gradient-to-br from-lavanda to-nieve">
          <span className="px-6 text-center font-display text-[18px] text-morado/40">
            {producto.nombre}
          </span>
        </div>

        {/* Información */}
        <div>
          {(categoria || subcategoria) && (
            <p className="eyebrow text-tinta/50">
              {[categoria?.nombre, subcategoria?.nombre].filter(Boolean).join(" · ")}
            </p>
          )}
          <h1 className="mt-2 font-display text-[26px] leading-tight text-tinta lg:text-[38px]">
            {producto.nombre}
          </h1>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-display text-[26px] text-tinta lg:text-[34px]">
              {formatCOP(producto.precio_cop)}
            </span>
            <Badge variant={estado.key}>{estado.label}</Badge>
          </div>

          {producto.descripcion && (
            <p className="mt-4 text-[14px] leading-relaxed text-tinta/72">{producto.descripcion}</p>
          )}

          <div className="mt-6">
            <AddToCartControls
              variantes={variantes}
              disponible={producto.disponible}
              esPiezaUnica={producto.es_pieza_unica}
            />
          </div>

          {producto.ajuste_gratis && (
            <div className="puntada mt-6 flex items-start gap-3 rounded-b-[10px] border-x border-b border-dorado/40 border-t-dorado bg-nieve p-4">
              <p className="text-[13px] text-tinta/72">
                <span className="font-medium text-moradoHondo">Ajuste gratis:</span> el taller
                entalla esta pieza a tu medida sin costo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-[22px] text-moradoHondo lg:text-[28px]">
            También te puede gustar
          </h2>
          <Stitch className="mt-3 w-10 border-dorado" />
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {relacionados.map((p) => (
              <ProductCard key={p.id} producto={p} etiqueta={categoria?.nombre} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
