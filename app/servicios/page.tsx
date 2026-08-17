import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/format";
import { getServicios } from "@/lib/data/citas";

export const metadata: Metadata = { title: "Servicios de costura" };

function precioTexto(precio: number | null) {
  return precio == null ? "Presupuesto" : `Desde ${formatCOP(precio)}`;
}

export default async function ServiciosPage() {
  const servicios = await getServicios();

  return (
    <div className="mx-auto max-w-[860px] px-4 py-12 lg:py-16">
      <p className="eyebrow text-dorado">Taller de costura</p>
      <h1 className="mt-2 max-w-[18ch] font-display text-[30px] leading-tight text-moradoHondo lg:text-[42px]">
        Arreglamos, ajustamos y confeccionamos a tu medida
      </h1>
      <p className="mt-3 max-w-[54ch] text-[14px] text-tinta/70">
        Reservas tu cita en línea y Érika la confirma por WhatsApp. Los precios &ldquo;desde&rdquo;
        son referenciales; el valor final se acuerda en el taller.
      </p>

      {servicios.length === 0 ? (
        <div className="mt-10 rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
          <p className="font-display text-[19px] text-moradoHondo">Aún no hay servicios</p>
          <p className="mt-1 text-[13px] text-tinta/60">
            Conecta Supabase y aplica el seed para verlos.
          </p>
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {servicios.map((s) => (
            <li
              key={s.id}
              className={cn(
                "rounded-[12px] border p-5",
                s.requiere_consulta
                  ? "border-dorado/40 bg-[#FDFBF6]"
                  : "border-tinta/[0.09] bg-blanco",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[17px] text-moradoHondo">{s.nombre}</h2>
                  {s.descripcion && (
                    <p className="mt-1 max-w-[52ch] text-[13px] text-tinta/65">{s.descripcion}</p>
                  )}
                  <p className="mt-2 text-[13px] text-tinta/70">
                    <span className="font-medium text-tinta">{precioTexto(s.precio_desde_cop)}</span>{" "}
                    · {s.duracion_min} min
                    {s.requiere_consulta && " · requiere consulta previa"}
                  </p>
                </div>
                <Link
                  href={`/agendar/${s.slug}`}
                  className="rounded-pill bg-morado px-5 py-2.5 text-[13px] font-medium text-blanco transition-colors hover:bg-moradoHondo"
                >
                  Agendar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
