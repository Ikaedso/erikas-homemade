import Link from "next/link";
import type { Metadata } from "next";
import { ProductoForm } from "@/components/admin/producto-form";
import { getCategorias, getSubcategoriasTodas } from "@/lib/data/catalogo";

export const metadata: Metadata = { title: "Nuevo producto · Panel" };

export default async function NuevoProducto() {
  const [categorias, subcategorias] = await Promise.all([
    getCategorias(),
    getSubcategoriasTodas(),
  ]);

  return (
    <div>
      <nav className="text-[12px] text-tinta/50">
        <Link href="/admin/productos" className="hover:text-morado">
          Productos
        </Link>{" "}
        / <span className="text-tinta/70">Nuevo</span>
      </nav>
      <h1 className="mt-3 font-display text-[26px] text-moradoHondo lg:text-[32px]">
        Nuevo producto
      </h1>
      <p className="mt-1 text-[13px] text-tinta/55">
        Créalo primero; luego podrás agregar tallas, colores y stock.
      </p>

      <div className="mt-6 max-w-[720px]">
        <ProductoForm modo="nuevo" categorias={categorias} subcategorias={subcategorias} />
      </div>
    </div>
  );
}
