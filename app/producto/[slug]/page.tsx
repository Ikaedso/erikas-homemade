import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { formatCOP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Stitch } from "@/components/brand/stitch";
import { Reveal } from "@/components/anim/reveal";
import { ProductCard } from "@/components/tienda/product-card";
import { ProductGallery } from "@/components/tienda/product-gallery";
import { AddToCartControls } from "@/components/tienda/add-to-cart";
import { estadoProducto } from "@/lib/data/types";
import {
  getCategorias,
  getFotos,
  getFotosPrincipales,
  getProductoPorSlug,
  getRelacionados,
  getSubcategorias,
  getVariantes,
} from "@/lib/data/catalogo";
import { urlFotoProducto } from "@/lib/supabase/storage";

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

  const fotosRelacionados = await getFotosPrincipales(relacionados.map((p) => p.id));

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

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-12">
        {/* Galería */}
        <Reveal>
          <ProductGallery fotos={fotos} nombre={producto.nombre} />
        </Reveal>

        {/* Información */}
        <Reveal as="div" delay={120}>
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
              producto={producto}
              variantes={variantes}
              disponible={producto.disponible}
              esPiezaUnica={producto.es_pieza_unica}
              fotoUrl={fotos[0] ? urlFotoProducto(fotos[0].path) : undefined}
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
        </Reveal>
      </div>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-[22px] text-moradoHondo lg:text-[28px]">
            También te puede gustar
          </h2>
          <Stitch className="mt-3 w-10 border-dorado" />
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {relacionados.map((p, i) => {
              const foto = fotosRelacionados.get(p.id);
              return (
                <Reveal key={p.id} delay={Math.min(i, 8) * 55}>
                  <ProductCard
                    producto={p}
                    fotoUrls={foto ? [urlFotoProducto(foto)] : []}
                    etiqueta={categoria?.nombre}
                  />
                </Reveal>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
