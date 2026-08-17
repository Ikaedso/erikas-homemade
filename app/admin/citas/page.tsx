import type { Metadata } from "next";
import { formatFecha, formatHora } from "@/lib/format";
import { getCitasAdmin } from "@/lib/data/admin";
import { CitaControl } from "@/components/admin/cita-control";

export const metadata: Metadata = { title: "Citas · Panel" };

export default async function AdminCitas() {
  const citas = await getCitasAdmin();

  return (
    <div>
      <h1 className="font-display text-[26px] text-moradoHondo lg:text-[32px]">Citas</h1>

      {citas.length === 0 ? (
        <p className="mt-6 text-[13px] text-tinta/55">Aún no hay citas agendadas.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[12px] border border-tinta/[0.09]">
          <table className="w-full min-w-[680px] text-[13px]">
            <thead>
              <tr className="border-b border-tinta/[0.09] text-left text-[12px] text-tinta/55">
                <th className="p-3 font-medium">Servicio</th>
                <th className="p-3 font-medium">Cliente</th>
                <th className="p-3 font-medium">Cuándo</th>
                <th className="p-3 font-medium">Nota</th>
                <th className="p-3 text-right font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id} className="border-b border-tinta/[0.06] align-top last:border-none">
                  <td className="p-3 font-medium text-moradoHondo">
                    {c.servicios?.nombre ?? "Servicio"}
                  </td>
                  <td className="p-3 text-tinta/80">{c.perfiles?.nombre ?? "Cliente"}</td>
                  <td className="p-3 text-tinta/70">
                    {formatFecha(c.inicia_en)} · {formatHora(c.inicia_en)}
                  </td>
                  <td className="max-w-[220px] p-3 text-[12.5px] text-tinta/60">
                    {c.nota_cliente || "—"}
                  </td>
                  <td className="p-3 text-right">
                    <CitaControl citaId={c.id} estado={c.estado} />
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
