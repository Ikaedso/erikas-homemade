import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCOP, formatFecha, formatHora } from "@/lib/format";
import { getMisPedidos, type EstadoPedido } from "@/lib/data/pedidos";
import { getMisCitas, type EstadoCita } from "@/lib/data/citas";

export const metadata: Metadata = { title: "Mi cuenta" };

const ESTADO_PEDIDO: Record<EstadoPedido, string> = {
  nuevo: "Nuevo",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const ESTADO_CITA: Record<EstadoCita, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  completada: "Completada",
  cancelada: "Cancelada",
};

export default async function CuentaPage() {
  const [pedidos, citas] = await Promise.all([getMisPedidos(), getMisCitas()]);

  return (
    <div className="mx-auto max-w-[860px] px-4 py-10 lg:py-14">
      <h1 className="font-display text-[30px] text-moradoHondo lg:text-[40px]">Mi cuenta</h1>

      {/* Pedidos */}
      <section className="mt-8">
        <h2 className="font-display text-[20px] text-moradoHondo">Mis pedidos</h2>
        {pedidos.length === 0 ? (
          <p className="mt-3 text-[13px] text-tinta/60">Aún no tienes pedidos.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pedidos.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/pedido/${p.id}`}
                  className="flex items-center justify-between gap-4 rounded-[12px] border border-tinta/[0.09] bg-blanco p-4 transition-colors hover:bg-nieve"
                >
                  <div>
                    <p className="font-display text-[16px] text-moradoHondo">
                      #EH-{String(p.numero).padStart(4, "0")}
                    </p>
                    <p className="mt-0.5 text-[12px] text-tinta/55">{formatFecha(p.creado_en)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-[16px] text-tinta">
                      {formatCOP(p.total_cop)}
                    </span>
                    <Badge variant="neutro">{ESTADO_PEDIDO[p.estado]}</Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Citas */}
      <section className="mt-10">
        <h2 className="font-display text-[20px] text-moradoHondo">Mis citas</h2>
        {citas.length === 0 ? (
          <p className="mt-3 text-[13px] text-tinta/60">Aún no tienes citas agendadas.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {citas.map((c) => (
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
                <Badge variant="neutro">{ESTADO_CITA[c.estado]}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pedidos.length === 0 && citas.length === 0 && (
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/mujer">Ver el catálogo</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
