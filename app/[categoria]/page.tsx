import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Stitch } from "@/components/brand/stitch";
import { ProductCard } from "@/components/tienda/product-card";
import {
  FilterSidebar,
  SubcategoryChips,
  type SubcatConteo,
} from "@/components/tienda/category-filters";
import {
  CATEGORIAS_CONOCIDAS,
  getCategoriaPorSlug,
  getFotosPrincipales,
  getProductosPorCategoria,
  getSubcategorias,
} from "@/lib/data/catalogo";
import { urlFotoProducto } from "@/lib/supabase/storage";
import type { ProductoPublico, Subcategoria } from "@/lib/data/types";

type Params = { categoria: string };
type Search = { sub?: string; disp?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const cat = await getCategoriaPorSlug(categoria);
  const nombre = cat?.nombre ?? CATEGORIAS_CONOCIDAS[categoria];
  return { title: nombre ?? "Catálogo" };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { categoria: slug } = await params;
  const { sub: subActivo, disp } = await searchParams;
  const dispActivo = disp === "1";

  const cat = await getCategoriaPorSlug(slug);
  const nombre = cat?.nombre ?? CATEGORIAS_CONOCIDAS[slug];
  if (!nombre) notFound(); // slug desconocido (p. ej. una ruta que aún no existe)

  let subcategorias: Subcategoria[] = [];
  let productosTodos: ProductoPublico[] = [];
  if (cat) {
    [subcategorias, productosTodos] = await Promise.all([
      getSubcategorias(cat.id),
      getProductosPorCategoria(cat.id),
    ]);
  }

  const nombrePorSubId = new Map(subcategorias.map((s) => [s.id, s.nombre]));
  const idPorSubSlug = new Map(subcategorias.map((s) => [s.slug, s.id]));

  // Conteos por subcategoría (estables, sin el filtro de disponibilidad)
  const subs: SubcatConteo[] = subcategorias.map((s) => ({
    slug: s.slug,
    nombre: s.nombre,
    count: productosTodos.filter((p) => p.subcategoria_id === s.id).length,
  }));

  // Filtros aplicados
  const subActivoId = subActivo ? idPorSubSlug.get(subActivo) : undefined;
  const productos = productosTodos.filter((p) => {
    if (subActivoId && p.subcategoria_id !== subActivoId) return false;
    if (dispActivo && !p.disponible) return false;
    return true;
  });

  const fotos = await getFotosPrincipales(productos.map((p) => p.id));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-14 lg:py-14">
      {/* Cabecera */}
      <nav className="text-[12px] text-tinta/50">
        Inicio / Colecciones / <span className="text-tinta/70">{nombre}</span>
      </nav>
      <div className="mt-4 flex flex-col items-center text-center">
        <h1 className="font-display text-[30px] text-moradoHondo lg:text-[44px]">{nombre}</h1>
        <Stitch className="mt-3 w-12 border-dorado" />
        <p className="mt-2 text-[13px] text-tinta/60">
          {productosTodos.length} {productosTodos.length === 1 ? "pieza" : "piezas"} hechas a mano
        </p>
      </div>

      {/* Chips (móvil) */}
      {subs.length > 0 && (
        <div className="mt-6">
          <SubcategoryChips
            categoriaSlug={slug}
            subs={subs}
            subActivo={subActivo}
            dispActivo={dispActivo}
          />
        </div>
      )}

      <div className="mt-6 lg:grid lg:grid-cols-[236px_1fr] lg:gap-11">
        <FilterSidebar
          categoriaSlug={slug}
          subs={subs}
          subActivo={subActivo}
          dispActivo={dispActivo}
          total={productosTodos.length}
        />

        <div>
          {productos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
              {productos.map((p) => {
                const foto = fotos.get(p.id);
                return (
                  <ProductCard
                    key={p.id}
                    producto={p}
                    fotoUrl={foto ? urlFotoProducto(foto) : undefined}
                    etiqueta={
                      p.subcategoria_id
                        ? `${nombre} · ${nombrePorSubId.get(p.subcategoria_id) ?? ""}`
                        : nombre
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
              <p className="font-display text-[19px] text-moradoHondo">Aún no hay piezas aquí</p>
              <p className="mt-1 text-[13px] text-tinta/60">
                {productosTodos.length === 0
                  ? "Conecta Supabase y aplica el seed para ver el catálogo."
                  : "Prueba quitando algún filtro."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
