/**
 * Generación de cupos de cita. Zona fija America/Bogota (offset -05:00, sin DST),
 * así que construimos las marcas de tiempo con ese offset sin depender de librerías.
 */

export type Slot = { iso: string; hora: string; ocupado: boolean };

export type HorarioDia = { dia_semana: number; abre: string | null; cierra: string | null };

const OFFSET = "-05:00";

/** yyyy-mm-dd a partir de los componentes locales del Date (día del calendario). */
export function ymdLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

function aHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type SlotsParams = {
  dia: Date;
  horario: HorarioDia[];
  duracionMin: number;
  bloqueados: Set<string>; // yyyy-mm-dd
  ocupados: Set<number>; // epoch ms
  ahora: number; // Date.now()
};

export function slotsDelDia({
  dia,
  horario,
  duracionMin,
  bloqueados,
  ocupados,
  ahora,
}: SlotsParams): Slot[] {
  const ymd = ymdLocal(dia);
  if (bloqueados.has(ymd)) return [];

  const h = horario.find((x) => x.dia_semana === dia.getDay());
  if (!h || !h.abre || !h.cierra) return [];

  const abre = aMinutos(h.abre);
  const cierra = aMinutos(h.cierra);
  const paso = Math.max(15, duracionMin);

  const slots: Slot[] = [];
  for (let t = abre; t + duracionMin <= cierra; t += paso) {
    const hora = aHHMM(t);
    const iso = `${ymd}T${hora}:00${OFFSET}`;
    const ms = new Date(iso).getTime();
    if (ms <= ahora) continue;
    slots.push({ iso, hora, ocupado: ocupados.has(ms) });
  }
  return slots;
}

/** ¿El día tiene al menos un cupo libre a futuro? */
export function tieneCuposLibres(params: SlotsParams): boolean {
  return slotsDelDia(params).some((s) => !s.ocupado);
}
