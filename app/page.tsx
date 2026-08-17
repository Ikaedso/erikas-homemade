import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { CategoryCard } from "@/components/tienda/category-card";
import { ProductCard } from "@/components/tienda/product-card";
import { getDestacados, getFotosPrincipales } from "@/lib/data/catalogo";
import { urlFotoProducto } from "@/lib/supabase/storage";

const CATEGORIAS = [
  { nombre: "Mujer", href: "/mujer", nota: "Blusas · Vestidos · Bisutería" },
  { nombre: "Hombre", href: "/hombre", nota: "Camisas · Pantalones" },
  { nombre: "Niño", href: "/nino", nota: "Uniformes · Básicos" },
  { nombre: "Manualidades", href: "/manualidades", nota: "Piezas únicas", destacada: true },
];

export default async function HomePage() {
  const destacados = await getDestacados(4);
  const fotos = await getFotosPrincipales(destacados.map((p) => p.id));

  return (
    <>
      {/* Hero */}
      <section className="bg-lavanda">
        <div className="mx-auto max-w-[1440px] px-4 py-16 lg:px-14 lg:py-24">
          <p className="eyebrow text-dorado">Serie corta · hecho a mano</p>
          <h1 className="mt-3 max-w-[16ch] font-display text-[32px] leading-[1.14] text-moradoHondo lg:text-[56px]">
            Cosido a mano, hecho a tu medida
          </h1>
          <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-tinta/72 lg:text-[15px]">
            Ropa y bisutería artesanal en series de pocas unidades, y un taller de costura que
            arregla, ajusta y confecciona a tu medida —con cita.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/mujer">Ver el catálogo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/servicios">Agendar una cita</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Nuestro catálogo */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 lg:px-14 lg:py-20">
        <div className="flex flex-col items-center">
          <h2 className="font-display text-[24px] text-moradoHondo lg:text-[38px]">
            Nuestro catálogo
          </h2>
          <Stitch className="mt-3 w-10 border-dorado" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {CATEGORIAS.map((cat) => (
            <CategoryCard key={cat.href} {...cat} />
          ))}
        </div>
      </section>

      {/* Destacados (solo si hay datos) */}
      {destacados.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 pb-16 lg:px-14 lg:pb-20">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-[24px] text-moradoHondo lg:text-[32px]">Destacados</h2>
            <Link href="/mujer" className="text-[13px] font-medium text-morado hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
            {destacados.map((p) => {
              const foto = fotos.get(p.id);
              return (
                <ProductCard
                  key={p.id}
                  producto={p}
                  fotoUrl={foto ? urlFotoProducto(foto) : undefined}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Taller de costura */}
      <section className="bg-moradoHondo text-blanco">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-5 px-4 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-16">
          <div>
            <p className="eyebrow text-doradoClaro">Taller de costura</p>
            <h2 className="mt-2 max-w-[20ch] font-display text-[24px] leading-tight lg:text-[34px]">
              ¿Se te rompió algo que quieres conservar?
            </h2>
            <p className="mt-3 max-w-[48ch] text-[14px] text-blanco/75">
              Ajustes, ruedos, reparaciones y confección a medida. Reservas tu cita y Érika lo
              confirma por WhatsApp.
            </p>
          </div>
          <Button asChild variant="dorado" size="lg">
            <Link href="/servicios">Ver los servicios</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
