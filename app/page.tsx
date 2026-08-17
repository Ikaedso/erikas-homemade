import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { Reveal } from "@/components/anim/reveal";
import { CategoryCard, type MotivoCategoria } from "@/components/tienda/category-card";
import { ProductCard } from "@/components/tienda/product-card";
import {
  getCategorias,
  getDestacados,
  getFotosGaleria,
  getPortadasCategorias,
} from "@/lib/data/catalogo";
import { urlFotoProducto } from "@/lib/supabase/storage";

// Siempre fresco: refleja en tiempo real lo que Érika publica desde el panel.
export const dynamic = "force-dynamic";

const CATEGORIAS: {
  nombre: string;
  href: string;
  slug: string;
  nota: string;
  motivo: MotivoCategoria;
}[] = [
  { nombre: "Mujer", href: "/mujer", slug: "mujer", nota: "Blusas · Vestidos · Bisutería", motivo: "mujer" },
  { nombre: "Hombre", href: "/hombre", slug: "hombre", nota: "Camisas · Pantalones", motivo: "hombre" },
  { nombre: "Niño", href: "/nino", slug: "nino", nota: "Uniformes · Básicos", motivo: "nino" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  // Respaldo: si la confirmación de correo cae en "/?code=…", la procesamos.
  const { code } = await searchParams;
  if (code) redirect(`/auth/callback?code=${encodeURIComponent(code)}`);

  const [categorias, portadas, destacados] = await Promise.all([
    getCategorias(),
    getPortadasCategorias(),
    getDestacados(4),
  ]);
  const idPorSlug = new Map(categorias.map((c) => [c.slug, c.id]));
  const fotos = await getFotosGaleria(destacados.map((p) => p.id));

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

        <div className="mt-8 grid grid-cols-3 gap-3 lg:gap-6">
          {CATEGORIAS.map((cat, i) => {
            const catId = idPorSlug.get(cat.slug);
            const portada = catId ? portadas.get(catId) : undefined;
            return (
              <Reveal key={cat.href} delay={i * 80}>
                <CategoryCard
                  nombre={cat.nombre}
                  href={cat.href}
                  nota={cat.nota}
                  motivo={cat.motivo}
                  imagen={portada ? urlFotoProducto(portada) : undefined}
                />
              </Reveal>
            );
          })}
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
            {destacados.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i, 8) * 60}>
                <ProductCard producto={p} fotoUrls={(fotos.get(p.id) ?? []).map(urlFotoProducto)} />
              </Reveal>
            ))}
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
