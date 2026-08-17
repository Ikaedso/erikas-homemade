import { describe, expect, it } from "vitest";
import { slotsDelDia, ymdLocal, type HorarioDia } from "./slots";

// Un día laboral cualquiera a mediodía (evita el filtro de "pasado" con ahora=0).
const DIA = new Date("2030-06-10T12:00:00");
const DOW = DIA.getDay();

const horario: HorarioDia[] = [{ dia_semana: DOW, abre: "09:00:00", cierra: "17:00:00" }];

const base = {
  horario,
  duracionMin: 45,
  bloqueados: new Set<string>(),
  ocupados: new Set<number>(),
  ahora: 0,
};

describe("slotsDelDia", () => {
  it("genera cupos con el primero a las 09:00", () => {
    const slots = slotsDelDia({ dia: DIA, ...base });
    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].hora).toBe("09:00");
    expect(slots.every((s) => !s.ocupado)).toBe(true);
  });

  it("marca como ocupado el cupo que está en el set", () => {
    const primero = slotsDelDia({ dia: DIA, ...base })[0];
    const ocupados = new Set<number>([new Date(primero.iso).getTime()]);
    const slots = slotsDelDia({ dia: DIA, ...base, ocupados });
    expect(slots[0].ocupado).toBe(true);
  });

  it("devuelve vacío si el día está bloqueado", () => {
    const bloqueados = new Set<string>([ymdLocal(DIA)]);
    expect(slotsDelDia({ dia: DIA, ...base, bloqueados })).toHaveLength(0);
  });

  it("devuelve vacío si el taller está cerrado ese día (sin abre/cierra)", () => {
    const cerrado: HorarioDia[] = [{ dia_semana: DOW, abre: null, cierra: null }];
    expect(slotsDelDia({ dia: DIA, ...base, horario: cerrado })).toHaveLength(0);
  });

  it("no incluye cupos en el pasado", () => {
    const slots = slotsDelDia({ dia: DIA, ...base, ahora: Date.now() + 1000 * 60 * 60 * 24 * 3650 });
    expect(slots).toHaveLength(0);
  });
});
