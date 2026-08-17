import type { Metadata } from "next";
import { formatCOP, formatFecha } from "@/lib/format";
import { getPedidosAdmin } from "@/lib/data/admin";
import { PedidoControl } from "@/components/admin/pedido-control";

export const metadata: Metadata = { title: "Pedidos · Panel" };

export default async function AdminPedidos() {
  const pedidos = await getPedidosAdmin();

  return (
    <div>
      <h1 className="font-display text-[26px] text-moradoHondo lg:text-[32px]">Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="mt-6 text-[13px] text-tinta/55">Aún no hay pedidos.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[12px] border border-tinta/[0.09]">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-tinta/[0.09] text-left text-[12px] text-tinta/55">
                <th className="p-3 font-medium">Pedido</th>
                <th className="p-3 font-medium">Cliente</th>
                <th className="p-3 font-medium">Fecha</th>
                <th className="p-3 font-medium">Pago</th>
                <th className="p-3 text-right font-medium">Total</th>
                <th className="p-3 text-right font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id} className="border-b border-tinta/[0.06] last:border-none">
                  <td className="p-3 font-medium text-moradoHondo">
                    #EH-{String(p.numero).padStart(4, "0")}
                  </td>
                  <td className="p-3 text-tinta/80">{p.perfiles?.nombre ?? "Cliente"}</td>
                  <td className="p-3 text-tinta/60">{formatFecha(p.creado_en)}</td>
                  <td className="p-3 capitalize text-tinta/70">{p.pago}</td>
                  <td className="p-3 text-right tabular-nums">{formatCOP(p.total_cop)}</td>
                  <td className="p-3">
                    <PedidoControl
                      pedidoId={p.id}
                      estado={p.estado}
                      comprobantePath={p.comprobante_path}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
