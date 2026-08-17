import type { Metadata } from "next";
import { formatCOP } from "@/lib/format";
import { getServiciosAdmin } from "@/lib/data/admin";
import { ServicioToggle } from "@/components/admin/servicio-toggle";
import type { Servicio } from "@/lib/data/citas";

export const metadata: Metadata = { title: "Servicios · Panel" };

export default async function AdminServicios() {
  const servicios = (await getServiciosAdmin()) as Servicio[];

  return (
    <div>
      <h1 className="font-display text-[26px] text-moradoHondo lg:text-[32px]">Servicios</h1>

      <div className="mt-6 overflow-x-auto rounded-[12px] border border-tinta/[0.09]">
        <table className="w-full min-w-[560px] text-[13px]">
          <thead>
            <tr className="border-b border-tinta/[0.09] text-left text-[12px] text-tinta/55">
              <th className="p-3 font-medium">Servicio</th>
              <th className="p-3 font-medium">Precio desde</th>
              <th className="p-3 font-medium">Duración</th>
              <th className="p-3 font-medium">Cupos/sem</th>
              <th className="p-3 text-right font-medium">Activo</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s) => (
              <tr key={s.id} className="border-b border-tinta/[0.06] last:border-none">
                <td className="p-3 font-medium text-moradoHondo">{s.nombre}</td>
                <td className="p-3 tabular-nums text-tinta/75">
                  {s.precio_desde_cop == null ? "Presupuesto" : formatCOP(s.precio_desde_cop)}
                </td>
                <td className="p-3 text-tinta/70">{s.duracion_min} min</td>
                <td className="p-3 text-tinta/70">{s.cupos_semana}</td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <ServicioToggle id={s.id} activo={s.activo} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
