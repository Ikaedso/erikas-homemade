import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { formatCOP } from "@/lib/format";
import { getPedido, type EstadoPedido } from "@/lib/data/pedidos";

export const metadata: Metadata = { title: "Pedido confirmado" };

const ESTADO_LABEL: Record<EstadoPedido, string> = {
  nuevo: "Nuevo",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPedido(id);
  if (!data) notFound();
  const { pedido, items } = data;

  return (
    <div className="mx-auto max-w-[720px] px-4 py-12 text-center lg:py-16">
      <div className="mx-auto grid size-14 place-items-center rounded-full border border-dashed border-dorado bg-lavanda text-morado">
        <Check className="size-6" strokeWidth={2.5} />
      </div>
      <h1 className="mt-5 font-display text-[28px] text-moradoHondo lg:text-[36px]">
        ¡Gracias por tu pedido!
      </h1>
      <p className="mt-2 text-[14px] text-tinta/65">
        Tu pedido{" "}
        <span className="font-medium text-moradoHondo">
          #EH-{String(pedido.numero).padStart(4, "0")}
        </span>{" "}
        quedó registrado. Érika lo confirma por WhatsApp en menos de 24 h.
      </p>

      <div className="mt-8 rounded-[12px] border border-tinta/[0.09] bg-nieve p-6 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-tinta">Estado</span>
          <Badge variant="neutro">{ESTADO_LABEL[pedido.estado]}</Badge>
        </div>
        <Stitch className="my-4 border-dorado/50" />
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3 text-[13px]">
              <span className="text-tinta/75">
                {i.cantidad}× {i.nombre_producto} · {i.talla}
              </span>
              <span className="tabular-nums">{formatCOP(i.precio_unitario_cop * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <Stitch className="my-4 border-dorado/50" />
        <div className="space-y-1.5 text-[13px] text-tinta/75">
          {pedido.costo_entrega_cop > 0 && (
            <div className="flex justify-between">
              <span>Entrega</span>
              <span className="tabular-nums">{formatCOP(pedido.costo_entrega_cop)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="font-medium text-tinta">Total</span>
            <span className="font-display text-[22px] text-moradoHondo">
              {formatCOP(pedido.total_cop)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/cuenta">Ver mis pedidos</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/mujer">Seguir comprando</Link>
        </Button>
      </div>
    </div>
  );
}
