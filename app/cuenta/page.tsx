import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCOP, formatFecha } from "@/lib/format";
import { getMisPedidos, type EstadoPedido } from "@/lib/data/pedidos";

export const metadata: Metadata = { title: "Mi cuenta" };

const ESTADO_LABEL: Record<EstadoPedido, string> = {
  nuevo: "Nuevo",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function CuentaPage() {
  const pedidos = await getMisPedidos();

  return (
    <div className="mx-auto max-w-[860px] px-4 py-10 lg:py-14">
      <h1 className="font-display text-[30px] text-moradoHondo lg:text-[40px]">Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="mt-8 rounded-[12px] border border-dashed border-tinta/15 py-16 text-center">
          <p className="font-display text-[19px] text-moradoHondo">Aún no tienes pedidos</p>
          <p className="mt-1 text-[13px] text-tinta/60">Cuando compres, aparecerán aquí.</p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/mujer">Ver el catálogo</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
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
                  <Badge variant="neutro">{ESTADO_LABEL[p.estado]}</Badge>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
