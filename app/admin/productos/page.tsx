import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/format";
import { getProductosAdmin } from "@/lib/data/admin";
import { PublicadoToggle } from "@/components/admin/publicado-toggle";

export const metadata: Metadata = { title: "Productos · Panel" };

export default async function AdminProductos() {
  const productos = await getProductosAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[26px] text-moradoHondo lg:text-[32px]">Productos</h1>
        <Button asChild size="sm">
          <Link href="/admin/productos/nuevo">Nuevo producto</Link>
        </Button>
      </div>

      {productos.length === 0 ? (
        <p className="mt-6 text-[13px] text-tinta/55">
          Aún no hay productos. Crea el primero con &ldquo;Nuevo producto&rdquo;.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[12px] border border-tinta/[0.09]">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-tinta/[0.09] text-left text-[12px] text-tinta/55">
                <th className="p-3 font-medium">Producto</th>
                <th className="p-3 font-medium">Categoría</th>
                <th className="p-3 text-right font-medium">Precio</th>
                <th className="p-3 text-right font-medium">Stock</th>
                <th className="p-3 text-center font-medium">Publicado</th>
                <th className="p-3 text-right font-medium">Editar</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => {
                const stock = p.variantes.reduce((n, v) => n + v.stock, 0);
                return (
                  <tr key={p.id} className="border-b border-tinta/[0.06] last:border-none">
                    <td className="p-3 font-medium text-moradoHondo">{p.nombre}</td>
                    <td className="p-3 text-tinta/70">
                      {p.categorias?.nombre}
                      {p.subcategorias?.nombre ? ` · ${p.subcategorias.nombre}` : ""}
                    </td>
                    <td className="p-3 text-right tabular-nums">{formatCOP(p.precio_cop)}</td>
                    <td className="p-3 text-right tabular-nums text-tinta/70">{stock}</td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        <PublicadoToggle id={p.id} publicado={p.publicado} />
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="text-[13px] font-medium text-morado hover:underline"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
