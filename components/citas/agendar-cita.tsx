"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Stitch } from "@/components/brand/stitch";
import { crearCita } from "@/actions/citas";
import { slotsDelDia, tieneCuposLibres, type HorarioDia } from "@/lib/citas/slots";
import { formatFecha } from "@/lib/format";

export function AgendarCita({
  servicio,
  horario,
  bloqueados,
  ocupados,
}: {
  servicio: { id: string; nombre: string; slug: string; duracionMin: number };
  horario: HorarioDia[];
  bloqueados: string[];
  ocupados: string[];
}) {
  const bloqueadosSet = useMemo(() => new Set(bloqueados), [bloqueados]);
  const ocupadosSet = useMemo(
    () => new Set(ocupados.map((o) => new Date(o).getTime())),
    [ocupados],
  );
  const ahora = useMemo(() => Date.now(), []);

  const hoy = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const finVentana = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d;
  }, []);

  const [dia, setDia] = useState<Date | undefined>();
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [nota, setNota] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const params = { horario, duracionMin: servicio.duracionMin, bloqueados: bloqueadosSet, ocupados: ocupadosSet, ahora };

  const slots = useMemo(
    () => (dia ? slotsDelDia({ dia, ...params }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dia, ocupadosSet, bloqueadosSet],
  );

  function sinCupos(d: Date) {
    return !tieneCuposLibres({ dia: d, ...params });
  }

  async function confirmar() {
    if (!slotIso) return;
    setError(null);
    setEnviando(true);
    const res = await crearCita(servicio.id, slotIso, nota);
    if (!res.ok) {
      setError(res.error);
      setEnviando(false);
      return;
    }
    setOk(true);
  }

  if (ok) {
    return (
      <div className="mx-auto max-w-[520px] rounded-[14px] border border-tinta/10 bg-nieve p-8 text-center shadow-card">
        <h2 className="font-display text-[24px] text-moradoHondo">¡Cita solicitada!</h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-[14px] text-tinta/70">
          Tu cita queda <span className="font-medium text-dorado">pendiente</span> hasta que Érika
          la confirme por WhatsApp. La verás en tu cuenta.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/cuenta">Ver mis citas</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/servicios">Otros servicios</Link>
          </Button>
        </div>
      </div>
    );
  }

  const horaElegida = slots.find((s) => s.iso === slotIso)?.hora;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Calendario + horas */}
      <div>
        <div
          className="rdp-marca inline-block rounded-[12px] border border-tinta/[0.09] bg-blanco p-3"
          style={
            {
              "--rdp-accent-color": "#5B2A86",
              "--rdp-accent-background-color": "#F2ECF7",
              "--rdp-today-color": "#B98A2E",
            } as React.CSSProperties
          }
        >
          <DayPicker
            mode="single"
            locale={es}
            selected={dia}
            onSelect={(d) => {
              setDia(d);
              setSlotIso(null);
            }}
            startMonth={hoy}
            endMonth={finVentana}
            disabled={[{ before: hoy }, sinCupos]}
          />
        </div>

        {dia && (
          <div className="mt-6">
            <p className="eyebrow text-tinta/50">Horarios · {formatFecha(dia)}</p>
            {slots.length === 0 ? (
              <p className="mt-2 text-[13px] text-tinta/60">No hay cupos este día. Elige otro.</p>
            ) : (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.map((s) => (
                  <button
                    key={s.iso}
                    type="button"
                    disabled={s.ocupado}
                    onClick={() => setSlotIso(s.iso)}
                    className={cn(
                      "rounded-[8px] border py-2 text-[13px] transition-colors",
                      s.iso === slotIso
                        ? "border-morado bg-lavanda font-medium text-moradoHondo"
                        : "border-tinta/[0.16] text-tinta hover:bg-lavanda/60",
                      s.ocupado && "cursor-not-allowed border-dashed text-tinta/35 line-through",
                    )}
                  >
                    {s.hora}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[12px] border border-tinta/[0.09] bg-nieve p-6">
          <p className="eyebrow text-tinta/50">Tu cita</p>
          <p className="mt-2 font-display text-[17px] text-moradoHondo">{servicio.nombre}</p>
          <Link href="/servicios" className="text-[12px] text-morado hover:underline">
            Cambiar servicio
          </Link>

          <Stitch className="my-4 border-dorado/50" />

          <dl className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-tinta/60">Día</dt>
              <dd className="text-tinta">{dia ? formatFecha(dia) : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-tinta/60">Hora</dt>
              <dd className="text-tinta">{horaElegida ?? "—"}</dd>
            </div>
          </dl>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[12px] font-medium text-tinta/70">
              Nota para Érika
            </span>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Qué prenda traes y qué le quieres cambiar"
              className="w-full rounded-[10px] border border-tinta/[0.16] bg-blanco p-3 text-[13px] text-tinta placeholder:text-tinta/45 focus-visible:border-morado focus-visible:outline-none"
            />
          </label>

          {error && <p className="mt-2 text-[13px] text-[#B23A5B]">{error}</p>}

          <Button
            className="mt-4 w-full"
            size="lg"
            onClick={confirmar}
            disabled={!slotIso || enviando}
          >
            {enviando ? "Agendando…" : "Confirmar cita"}
          </Button>
          <p className="mt-3 text-[12px] text-tinta/55">
            Queda <span className="font-medium">pendiente</span> hasta que Érika la confirme.
          </p>
        </div>
      </div>
    </div>
  );
}
