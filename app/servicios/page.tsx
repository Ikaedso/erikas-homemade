import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/format";
import { getServiciosPagina } from "@/lib/data/citas";

export const metadata: Metadata = { title: "Servicios de costura" };

const PAGE_SIZE = 6;

function precioTexto(precio: number | null) {
  return precio == null ? "Presupuesto" : `Desde ${formatCOP(precio)}`;
}

function hrefPagina(n: number) {
  return n <= 1 ? "/servicios" : `/servicios?page=${n}`;
}

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, Number(pageRaw) || 1);
  const { items: servicios, total } = await getServiciosPagina(page, PAGE_SIZE);
  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 lg:px-8 lg:py-16">
      <div className="max-w-[640px]">
        <p className="eyebrow text-dorado">Taller de costura</p>
        <h1 className="mt-2 font-display text-[30px] leading-tight text-moradoHondo lg:text-[42px]">
          Arreglamos, ajustamos y confeccionamos a tu medida
        </h1>
        <p className="mt-3 text-[14px] text-tinta/70">
          Reservas tu cita en línea y Érika la confirma por WhatsApp. Los precios &ldquo;desde&rdquo;
          son referenciales; el valor final se acuerda en el taller.
        </p>
      </div>

      {servicios.length === 0 ? (
        <div className="mt-10 rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
          <p className="font-display text-[19px] text-moradoHondo">Aún no hay servicios</p>
          <p className="mt-1 text-[13px] text-tinta/60">
            Conecta Supabase y aplica el seed para verlos.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:gap-5">
            {servicios.map((s) => (
              <article
                key={s.id}
                className={cn(
                  "flex flex-col rounded-[14px] border p-5 transition-shadow hover:shadow-[0_4px_18px_rgba(46,36,56,0.06)]",
                  s.requiere_consulta
                    ? "border-dorado/40 bg-[#FDFBF6]"
                    : "border-tinta/[0.09] bg-blanco",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-[18px] leading-snug text-moradoHondo">
                    {s.nombre}
                  </h2>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-pill bg-lavanda px-2.5 py-1 text-[11px] font-medium text-morado">
                    <Clock className="size-3" />
                    {s.duracion_min} min
                  </span>
                </div>

                {s.descripcion && (
                  <p className="mt-2 text-[13px] leading-relaxed text-tinta/65">{s.descripcion}</p>
                )}

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-tinta/[0.07] pt-4">
                  <div>
                    <p className="font-display text-[18px] text-tinta">
                      {precioTexto(s.precio_desde_cop)}
                    </p>
                    {s.requiere_consulta && (
                      <p className="mt-0.5 text-[11px] text-dorado">Requiere consulta previa</p>
                    )}
                  </div>
                  <Link
                    href={`/agendar/${s.slug}`}
                    className="shrink-0 rounded-pill bg-morado px-5 py-2.5 text-[13px] font-medium text-blanco transition-colors hover:bg-moradoHondo"
                  >
                    Agendar
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {totalPaginas > 1 && (
            <nav
              aria-label="Paginación de servicios"
              className="mt-10 flex items-center justify-center gap-1.5"
            >
              {page > 1 ? (
                <Link
                  href={hrefPagina(page - 1)}
                  aria-label="Página anterior"
                  className="grid size-9 place-items-center rounded-[8px] border border-tinta/[0.12] text-tinta transition-colors hover:bg-lavanda/60"
                >
                  <ChevronLeft className="size-4" />
                </Link>
              ) : (
                <span className="grid size-9 place-items-center rounded-[8px] border border-tinta/[0.08] text-tinta/25">
                  <ChevronLeft className="size-4" />
                </span>
              )}

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={hrefPagina(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={cn(
                    "grid size-9 place-items-center rounded-[8px] text-[13px] transition-colors",
                    n === page
                      ? "bg-morado font-medium text-blanco"
                      : "border border-tinta/[0.12] text-tinta hover:bg-lavanda/60",
                  )}
                >
                  {n}
                </Link>
              ))}

              {page < totalPaginas ? (
                <Link
                  href={hrefPagina(page + 1)}
                  aria-label="Página siguiente"
                  className="grid size-9 place-items-center rounded-[8px] border border-tinta/[0.12] text-tinta transition-colors hover:bg-lavanda/60"
                >
                  <ChevronRight className="size-4" />
                </Link>
              ) : (
                <span className="grid size-9 place-items-center rounded-[8px] border border-tinta/[0.08] text-tinta/25">
                  <ChevronRight className="size-4" />
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
