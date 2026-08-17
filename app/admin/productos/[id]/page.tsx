import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductoForm } from "@/components/admin/producto-form";
import { StockEditor } from "@/components/admin/stock-editor";
import { PublicadoToggle } from "@/components/admin/publicado-toggle";
import { getProductoAdmin } from "@/lib/data/admin";
import { getCategorias, getSubcategoriasTodas } from "@/lib/data/catalogo";

export const metadata: Metadata = { title: "Editar producto · Panel" };

export default async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [data, categorias, subcategorias] = await Promise.all([
    getProductoAdmin(id),
    getCategorias(),
    getSubcategoriasTodas(),
  ]);
  if (!data) notFound();
  const { producto, variantes } = data;

  return (
    <div>
      <nav className="text-[12px] text-tinta/50">
        <Link href="/admin/productos" className="hover:text-morado">
          Productos
        </Link>{" "}
        / <span className="text-tinta/70">{producto.nombre}</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[26px] text-moradoHondo lg:text-[32px]">
          {producto.nombre}
        </h1>
        <div className="flex items-center gap-2 text-[13px] text-tinta/60">
          <span>{producto.publicado ? "Publicado" : "Oculto"}</span>
          <PublicadoToggle id={producto.id} publicado={producto.publicado} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-[16px] text-moradoHondo">Información</h2>
          <ProductoForm
            modo="editar"
            categorias={categorias}
            subcategorias={subcategorias}
            inicial={{
              id: producto.id,
              nombre: producto.nombre,
              precio_cop: producto.precio_cop,
              categoria_id: producto.categoria_id,
              subcategoria_id: producto.subcategoria_id,
              descripcion: producto.descripcion ?? "",
              es_pieza_unica: producto.es_pieza_unica,
              aviso_stock_bajo: producto.aviso_stock_bajo,
            }}
          />
        </div>
        <div>
          <h2 className="mb-3 font-display text-[16px] text-moradoHondo">Inventario (stock)</h2>
          <StockEditor productoId={producto.id} variantes={variantes} />
        </div>
      </div>
    </div>
  );
}
