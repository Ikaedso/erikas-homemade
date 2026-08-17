import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Stitch } from "@/components/brand/stitch";
import { formatCOP } from "@/lib/format";
import { getResumen, getUltimosPedidos } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Panel" };

function StatCard({
  label,
  valor,
  destacada = false,
}: {
  label: string;
  valor: string;
  destacada?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[12px] border p-4",
        destacada ? "border-dorado/40 bg-[#FDFBF6]" : "border-tinta/[0.09] bg-blanco",
      )}
    >
      <p className="text-[12px] text-tinta/55">{label}</p>
      <p className="mt-1 font-display text-[26px] text-moradoHondo lg:text-[30px]">{valor}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const [resumen, pedidos] = await Promise.all([getResumen(), getUltimosPedidos(6)]);

  return (
    <div>
      <h1 className="font-display text-[26px] text-moradoHondo lg:text-[32px]">Resumen</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Ventas del mes" valor={formatCOP(resumen.ventasMes)} />
        <StatCard label="Pedidos nuevos" valor={String(resumen.pedidosNuevos)} />
        <StatCard label="Citas de hoy" valor={String(resumen.citasHoy)} />
        <StatCard label="Stock bajo" valor={String(resumen.stockBajo.length)} destacada />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Últimos pedidos */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[18px] text-moradoHondo">Últimos pedidos</h2>
            <Link href="/admin/pedidos" className="text-[13px] text-morado hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-[12px] border border-tinta/[0.09]">
            {pedidos.length === 0 ? (
              <p className="p-4 text-[13px] text-tinta/55">Aún no hay pedidos.</p>
            ) : (
              <table className="w-full text-[13px]">
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id} className="border-b border-tinta/[0.06] last:border-none">
                      <td className="p-3">
                        <Link href="/admin/pedidos" className="font-medium text-moradoHondo">
                          #EH-{String(p.numero).padStart(4, "0")}
                        </Link>
                        <span className="block text-[12px] text-tinta/50">
                          {p.perfiles?.nombre ?? "Cliente"}
                        </span>
                      </td>
                      <td className="p-3 text-right tabular-nums">{formatCOP(p.total_cop)}</td>
                      <td className="p-3 text-right">
                        <Badge variant="neutro">{p.estado}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Stock bajo */}
        <section>
          <h2 className="font-display text-[18px] text-moradoHondo">Stock bajo</h2>
          <div className="mt-3 rounded-[12px] border border-dorado/40 bg-[#FDFBF6] p-4">
            {resumen.stockBajo.length === 0 ? (
              <p className="text-[13px] text-tinta/55">Todo con inventario suficiente.</p>
            ) : (
              <ul className="space-y-2">
                {resumen.stockBajo.slice(0, 8).map((v) => (
                  <li key={v.id} className="flex items-center justify-between text-[13px]">
                    <span className="text-tinta/80">
                      {v.nombre} · {v.talla}/{v.color}
                    </span>
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        v.stock === 0 ? "text-[#B23A5B]" : "text-dorado",
                      )}
                    >
                      {v.stock}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Stitch className="my-3 border-dorado/50" />
            <p className="text-[11px] text-tinta/50">
              Estas cantidades no se muestran en la tienda.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
