import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { formatCOP } from "@/lib/format";
import { getServicioPorSlug } from "@/lib/data/citas";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await getServicioPorSlug(slug);
  return { title: s?.nombre ?? "Servicio" };
}

export default async function ServicioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const servicio = await getServicioPorSlug(slug);
  if (!servicio) notFound();

  const precio =
    servicio.precio_desde_cop == null
      ? "Presupuesto"
      : `Desde ${formatCOP(servicio.precio_desde_cop)}`;

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 lg:py-16">
      <nav className="text-[12px] text-tinta/50">
        <Link href="/servicios" className="hover:text-morado">
          Servicios
        </Link>{" "}
        / <span className="text-tinta/70">{servicio.nombre}</span>
      </nav>

      <p className="mt-6 eyebrow text-dorado">Servicio con cita</p>
      <h1 className="mt-2 font-display text-[28px] text-moradoHondo lg:text-[36px]">
        {servicio.nombre}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-tinta/75">
        <span>
          <span className="font-medium text-tinta">{precio}</span>
        </span>
        <span>Duración · {servicio.duracion_min} min</span>
        {servicio.requiere_consulta && <span>Requiere consulta previa</span>}
      </div>

      {servicio.descripcion && (
        <p className="mt-5 text-[14px] leading-relaxed text-tinta/72">{servicio.descripcion}</p>
      )}

      <Stitch className="my-8 border-dorado/50" />

      <div className="rounded-[12px] border border-tinta/[0.09] bg-nieve p-5">
        <p className="text-[13px] text-tinta/70">
          Reserva tu cita y elige día y hora. Queda <span className="font-medium">pendiente</span>{" "}
          hasta que Érika la confirme por WhatsApp. El precio final se acuerda en el taller.
        </p>
        <Button asChild className="mt-4 w-full sm:w-auto" size="lg">
          <Link href={`/agendar/${servicio.slug}`}>Agendar cita</Link>
        </Button>
      </div>
    </div>
  );
}
