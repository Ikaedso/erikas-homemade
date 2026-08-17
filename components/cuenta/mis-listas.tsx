"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCOP, formatFecha, formatHora } from "@/lib/format";
import type { EstadoPedido, Pedido } from "@/lib/data/pedidos";
import type { CitaConServicio, EstadoCita } from "@/lib/data/citas";

const PEDIDO_LABEL: Record<EstadoPedido, string> = {
  nuevo: "Nuevo",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
const PEDIDO_ORDEN: EstadoPedido[] = ["nuevo", "pagado", "enviado", "entregado", "cancelado"];

const CITA_LABEL: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};
const CITA_ORDEN: EstadoCita[] = ["pendiente", "confirmada", "completada", "cancelada"];

type Opcion<T extends string> = { key: T | "todos"; label: string; count: number };

function Chips<T extends string>({
  opciones,
  valor,
  onChange,
}: {
  opciones: Opcion<T>[];
  valor: T | "todos";
  onChange: (v: T | "todos") => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {opciones.map((o) => {
        const activo = valor === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={activo}
            className={cn(
              "rounded-pill border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              activo
                ? "border-morado bg-morado text-blanco"
                : "border-tinta/[0.14] text-tinta/70 hover:bg-lavanda/60",
            )}
          >
            {o.label}
            <span className={cn("ml-1.5 tabular-nums", activo ? "text-blanco/70" : "text-tinta/40")}>
              {o.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MisListas({ pedidos, citas }: { pedidos: Pedido[]; citas: CitaConServicio[] }) {
  const [fPedido, setFPedido] = useState<EstadoPedido | "todos">("todos");
  const [fCita, setFCita] = useState<EstadoCita | "todos">("todos");

  const opcPedidos = useMemo<Opcion<EstadoPedido>[]>(
    () => [
      { key: "todos", label: "Todos", count: pedidos.length },
      ...PEDIDO_ORDEN.filter((e) => pedidos.some((p) => p.estado === e)).map((e) => ({
        key: e,
        label: PEDIDO_LABEL[e],
        count: pedidos.filter((p) => p.estado === e).length,
      })),
    ],
    [pedidos],
  );

  const opcCitas = useMemo<Opcion<EstadoCita>[]>(
    () => [
      { key: "todos", label: "Todas", count: citas.length },
      ...CITA_ORDEN.filter((e) => citas.some((c) => c.estado === e)).map((e) => ({
        key: e,
        label: CITA_LABEL[e],
        count: citas.filter((c) => c.estado === e).length,
      })),
    ],
    [citas],
  );

  const pedidosVis = fPedido === "todos" ? pedidos : pedidos.filter((p) => p.estado === fPedido);
  const citasVis = fCita === "todos" ? citas : citas.filter((c) => c.estado === fCita);

  return (
    <>
      {/* Pedidos */}
      <section className="mt-8">
        <h2 className="font-display text-[20px] text-moradoHondo">Mis pedidos</h2>
        {pedidos.length === 0 ? (
          <p className="mt-3 text-[13px] text-tinta/60">Aún no tienes pedidos.</p>
        ) : (
          <>
            {opcPedidos.length > 2 && (
              <Chips opciones={opcPedidos} valor={fPedido} onChange={setFPedido} />
            )}
            {pedidosVis.length === 0 ? (
              <p className="mt-4 text-[13px] text-tinta/55">No hay pedidos en ese estado.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {pedidosVis.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/pedido/${p.id}`}
                      className="flex items-center justify-between gap-4 rounded-[12px] border border-tinta/[0.09] bg-blanco p-4 transition-colors hover:bg-nieve"
                    >
                      <div>
                        <p className="font-display text-[16px] text-moradoHondo">
                          #EH-{String(p.numero).padStart(4, "0")}
                        </p>
                        <p className="mt-0.5 text-[12px] text-tinta/55">
                          {formatFecha(p.creado_en)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-display text-[16px] text-tinta">
                          {formatCOP(p.total_cop)}
                        </span>
                        <Badge variant="neutro">{PEDIDO_LABEL[p.estado]}</Badge>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {/* Citas */}
      <section className="mt-10">
        <h2 className="font-display text-[20px] text-moradoHondo">Mis citas</h2>
        {citas.length === 0 ? (
          <p className="mt-3 text-[13px] text-tinta/60">Aún no tienes citas agendadas.</p>
        ) : (
          <>
            {opcCitas.length > 2 && <Chips opciones={opcCitas} valor={fCita} onChange={setFCita} />}
            {citasVis.length === 0 ? (
              <p className="mt-4 text-[13px] text-tinta/55">No hay citas en ese estado.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {citasVis.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-4 rounded-[12px] border border-tinta/[0.09] bg-blanco p-4"
                  >
                    <div>
                      <p className="font-display text-[16px] text-moradoHondo">
                        {c.servicios?.nombre ?? "Servicio"}
                      </p>
                      <p className="mt-0.5 text-[12px] text-tinta/55">
                        {formatFecha(c.inicia_en)} · {formatHora(c.inicia_en)}
                      </p>
                    </div>
                    <Badge variant="neutro">{CITA_LABEL[c.estado]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {pedidos.length === 0 && citas.length === 0 && (
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/mujer">Ver el catálogo</Link>
          </Button>
        </div>
      )}
    </>
  );
}
