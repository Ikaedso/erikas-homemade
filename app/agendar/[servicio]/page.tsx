import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AgendarCita } from "@/components/citas/agendar-cita";
import { requireUser } from "@/lib/auth/require-user";
import {
  getDiasBloqueados,
  getHorario,
  getHorariosOcupados,
  getServicioPorSlug,
} from "@/lib/data/citas";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicio: string }>;
}): Promise<Metadata> {
  const { servicio } = await params;
  const s = await getServicioPorSlug(servicio);
  return { title: s ? `Agendar · ${s.nombre}` : "Agendar cita" };
}

export default async function AgendarPage({
  params,
}: {
  params: Promise<{ servicio: string }>;
}) {
  const { servicio: slug } = await params;
  await requireUser(`/agendar/${slug}`);
  const servicio = await getServicioPorSlug(slug);
  if (!servicio) notFound();

  const desde = new Date();
  const hasta = new Date();
  hasta.setDate(hasta.getDate() + 60);

  const [horario, bloqueados, ocupados] = await Promise.all([
    getHorario(),
    getDiasBloqueados(),
    getHorariosOcupados(desde.toISOString(), hasta.toISOString()),
  ]);

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 lg:py-14">
      <h1 className="font-display text-[28px] text-moradoHondo lg:text-[38px]">Agendar cita</h1>
      <p className="mt-1 text-[13px] text-tinta/60">
        Elige el día y la hora para <span className="font-medium text-tinta">{servicio.nombre}</span>.
      </p>

      <div className="mt-8">
        <AgendarCita
          servicio={{
            id: servicio.id,
            nombre: servicio.nombre,
            slug: servicio.slug,
            duracionMin: servicio.duracion_min,
          }}
          horario={horario}
          bloqueados={bloqueados}
          ocupados={ocupados}
        />
      </div>
    </div>
  );
}
